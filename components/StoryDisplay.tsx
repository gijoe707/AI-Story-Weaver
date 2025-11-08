
import React from 'react';
import { MicrophoneIcon, BookOpenIcon, LoadingSpinnerIcon } from './icons';

interface StoryDisplayProps {
  story: string;
  isLoading: boolean;
  onGenerateAudio: () => void;
  isAudioReady: boolean;
  isGeneratingAudio: boolean;
}

const SkeletonLoader: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
    <div className="h-4 bg-slate-700 rounded"></div>
    <div className="h-4 bg-slate-700 rounded"></div>
    <div className="h-4 bg-slate-700 rounded w-5/6"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2 mt-6"></div>
    <div className="h-4 bg-slate-700 rounded"></div>
    <div className="h-4 bg-slate-700 rounded w-4/5"></div>
  </div>
);


export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, isLoading, onGenerateAudio, isAudioReady, isGeneratingAudio }) => {
  return (
    <div className="flex flex-col flex-grow">
      <h2 className="text-2xl font-bold text-cyan-300 mb-4">2. Your Generated Story</h2>
      <div className="flex-grow bg-slate-900 p-4 rounded-lg overflow-y-auto max-h-[400px] lg:max-h-full mb-4 border border-slate-700 custom-scrollbar">
        {isLoading ? (
          <SkeletonLoader />
        ) : story ? (
          <p className="whitespace-pre-wrap text-slate-300 leading-relaxed font-serif">
            {story}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center">
            <BookOpenIcon className="w-16 h-16 mb-4" />
            <p>Your story will appear here once generated.</p>
          </div>
        )}
      </div>

      {story && !isLoading && (
        <button
          onClick={onGenerateAudio}
          disabled={isGeneratingAudio}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
        >
          {isGeneratingAudio ? (
             <>
                <LoadingSpinnerIcon />
                <span>Creating Audio Episodes...</span>
             </>
          ) : isAudioReady ? (
            <>
                <MicrophoneIcon />
                Regenerate Audio Episodes
            </>
          ) : (
            <>
                <MicrophoneIcon />
                Generate Audio Episodes
            </>
          )}
        </button>
      )}
    </div>
  );
};
