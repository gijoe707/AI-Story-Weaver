import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { StoryParams } from './types';
import { StoryForm } from './components/StoryForm';
import { StoryDisplay } from './components/StoryDisplay';
import { AudioPlayer } from './components/AudioPlayer';
import { generateStory, generateSpeech } from './services/geminiService';
import { decode, decodeAudioData } from './utils/audioUtils';

const AudioContext = window.AudioContext || (window as any).webkitAudioContext;

const App: React.FC = () => {
  const [storyParams, setStoryParams] = useState<StoryParams>({
    characters: '', context: '', place: '', timePeriod: '', pointOfView: 'Third-person omniscient',
    genres: '', theme: '', style: '', preferredEnding: '', plot: '', structure: '',
    pacing: '', narrative: '', voice: 'Kore', characterVoiceMapping: ''
  });
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [episodes, setEpisodes] = useState<AudioBuffer[]>([]);
  const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  const [musicBuffer, setMusicBuffer] = useState<AudioBuffer | null>(null);
  const [musicVolume, setMusicVolume] = useState<number>(0.2);

  const audioContextRef = useRef<AudioContext | null>(null);
  const speechSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const musicGainNodeRef = useRef<GainNode | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        musicGainNodeRef.current = audioContextRef.current.createGain();
        musicGainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (e) {
        setError("Could not initialize AudioContext. Your browser might not support it.");
        return false;
      }
    }
    return true;
  }, []);

  const handleStopPlayback = useCallback(() => {
    if (speechSourceRef.current) {
      speechSourceRef.current.onended = null;
      speechSourceRef.current.stop();
      speechSourceRef.current = null;
    }
    if (musicSourceRef.current) {
      musicSourceRef.current.stop();
      musicSourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);
  
  useEffect(() => {
    return () => {
      handleStopPlayback();
      if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [handleStopPlayback]);

  const playCurrentEpisode = useCallback(() => {
    if (!audioContextRef.current || !episodes[currentEpisodeIndex]) return;

    // Stop any existing playback
    handleStopPlayback();
    setIsPlaying(true);

    // Play speech
    const speechSource = audioContextRef.current.createBufferSource();
    speechSource.buffer = episodes[currentEpisodeIndex];
    speechSource.connect(audioContextRef.current.destination);
    speechSource.start();
    speechSourceRef.current = speechSource;

    speechSource.onended = () => {
      if (speechSourceRef.current === speechSource) {
        if (currentEpisodeIndex < episodes.length - 1) {
          setCurrentEpisodeIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentEpisodeIndex(0);
        }
      }
    };
    
    // Play music
    if (musicBuffer) {
        const musicSource = audioContextRef.current.createBufferSource();
        musicSource.buffer = musicBuffer;
        musicSource.loop = true;
        musicSource.connect(musicGainNodeRef.current!);
        musicSource.start();
        musicSourceRef.current = musicSource;
    }

  }, [episodes, currentEpisodeIndex, musicBuffer, handleStopPlayback]);

  useEffect(() => {
    if (musicGainNodeRef.current) {
        musicGainNodeRef.current.gain.setValueAtTime(musicVolume, audioContextRef.current?.currentTime || 0);
    }
  }, [musicVolume]);

  useEffect(() => {
    if (isPlaying && currentEpisodeIndex >= 0) {
      playCurrentEpisode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpisodeIndex]);

  const handlePlayPause = useCallback(() => {
    if (!initializeAudioContext()) return;
    if (isPlaying) {
      handleStopPlayback();
    } else {
      setIsPlaying(true);
      playCurrentEpisode();
    }
  }, [isPlaying, handleStopPlayback, playCurrentEpisode, initializeAudioContext]);

  const handleNext = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      handleStopPlayback();
      setCurrentEpisodeIndex(prev => prev + 1);
      if (isPlaying) {
         setTimeout(() => playCurrentEpisode(), 50);
      }
    }
  };

  const handlePrev = () => {
    if (currentEpisodeIndex > 0) {
      handleStopPlayback();
      setCurrentEpisodeIndex(prev => prev - 1);
      if (isPlaying) {
        setTimeout(() => playCurrentEpisode(), 50);
      }
    }
  };

  const handleGenerateStory = useCallback(async () => {
    setIsLoadingStory(true);
    setError(null);
    setGeneratedStory('');
    setEpisodes([]);
    try {
      const story = await generateStory(storyParams);
      setGeneratedStory(story);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while generating the story.');
    } finally {
      setIsLoadingStory(false);
    }
  }, [storyParams]);
  
  const handleMusicFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        setMusicBuffer(null);
        return;
    };
    if (!initializeAudioContext()) return;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
        setMusicBuffer(audioBuffer);
    } catch(e) {
        console.error("Error decoding audio file:", e);
        setError("Failed to load background music. Please try a different audio file.");
        setMusicBuffer(null);
    }
  };

  const handleGenerateAudio = useCallback(async () => {
    if (!generatedStory) return;
    if (!initializeAudioContext()) return;

    setIsLoadingAudio(true);
    setError(null);
    setEpisodes([]);
    handleStopPlayback();

    // Parse character voice mapping
    const characterVoices = storyParams.characterVoiceMapping
        .split(',')
        .map(pair => pair.trim().split(':'))
        .filter(parts => parts.length === 2 && parts[0].trim() && parts[1].trim())
        .map(([speaker, voiceName]) => ({
            speaker: speaker.trim(),
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName.trim() } }
        }));


    try {
      const storyParts = generatedStory.split('\n\n').filter(p => p.trim().length > 0);
      const audioBuffers: AudioBuffer[] = [];

      for (const part of storyParts) {
        // Check if the part is dialogue
        const isDialogue = characterVoices.some(cv => part.trim().startsWith(cv.speaker + ':'));
        
        const audioData = await generateSpeech(
            part, 
            storyParams.voice, 
            isDialogue ? characterVoices : undefined
        );

        if(audioData) {
            const decodedBytes = decode(audioData);
            const buffer = await decodeAudioData(decodedBytes, audioContextRef.current!, 24000, 1);
            audioBuffers.push(buffer);
        }
      }
      setEpisodes(audioBuffers);
      setCurrentEpisodeIndex(0);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while generating audio.');
    } finally {
      setIsLoadingAudio(false);
    }
  }, [generatedStory, handleStopPlayback, storyParams.characterVoiceMapping, storyParams.voice, initializeAudioContext]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            AI Story Weaver
          </h1>
          <p className="mt-2 text-slate-400">Fill in the narrative blocks, add music, and watch your story come to life.</p>
        </header>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6 text-center">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <StoryForm
              params={storyParams}
              setParams={setStoryParams}
              onGenerate={handleGenerateStory}
              isLoading={isLoadingStory}
            />
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 flex flex-col min-h-[600px] lg:min-h-0">
            <StoryDisplay
              story={generatedStory}
              isLoading={isLoadingStory}
              onGenerateAudio={handleGenerateAudio}
              isAudioReady={episodes.length > 0}
              isGeneratingAudio={isLoadingAudio}
            />
            {episodes.length > 0 && (
              <AudioPlayer
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                currentEpisode={currentEpisodeIndex + 1}
                totalEpisodes={episodes.length}
                isLoading={isLoadingAudio}
                onMusicFileChange={handleMusicFileChange}
                musicVolume={musicVolume}
                onVolumeChange={setMusicVolume}
                hasMusic={!!musicBuffer}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;