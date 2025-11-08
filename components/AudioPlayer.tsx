import React from 'react';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, LoadingSpinnerIcon, MusicIcon } from './icons';

interface AudioPlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentEpisode: number;
  totalEpisodes: number;
  isLoading: boolean;
  onMusicFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  musicVolume: number;
  onVolumeChange: (volume: number) => void;
  hasMusic: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
    isPlaying, onPlayPause, onNext, onPrev, currentEpisode, totalEpisodes, isLoading,
    onMusicFileChange, musicVolume, onVolumeChange, hasMusic
}) => {
  if(isLoading) {
    return (
        <div className="mt-auto pt-4 border-t border-slate-700 flex items-center justify-center text-slate-400">
            <LoadingSpinnerIcon />
            <span>Loading audio...</span>
        </div>
    );
  }

  return (
    <div className="mt-auto pt-4 border-t border-slate-700 space-y-4">
        <div>
            <h3 className="text-lg font-bold text-cyan-300 mb-2 text-center">Audio Player</h3>
            <div className="text-center text-slate-400 mb-3">
                Episode {currentEpisode} of {totalEpisodes}
            </div>
            <div className="flex items-center justify-center gap-4">
                <button onClick={onPrev} disabled={currentEpisode <= 1} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <PrevIcon />
                </button>
                <button onClick={onPlayPause} className="p-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 transition-colors transform hover:scale-110">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={onNext} disabled={currentEpisode >= totalEpisodes} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <NextIcon />
                </button>
            </div>
        </div>
        
        <div className="pt-4 border-t border-slate-700/50 space-y-3">
            <h4 className="text-md font-bold text-cyan-300 text-center">Background Music</h4>
            <div className="flex items-center justify-center gap-4">
                 <label htmlFor="music-upload" className="cursor-pointer text-sm bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    {hasMusic ? 'Change Music' : 'Upload Music'}
                </label>
                <input id="music-upload" type="file" accept="audio/*" onChange={onMusicFileChange} className="hidden" />

                <div className="flex items-center gap-2 w-1/2 max-w-xs">
                    <MusicIcon />
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={musicVolume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        aria-label="Background music volume"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};