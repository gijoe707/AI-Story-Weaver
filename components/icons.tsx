import React from 'react';

export const SparklesIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L16 6m-5.293 2.293a1 1 0 010 1.414L6 16m6-3v4m-2-2h4m5-4l2.293-2.293a1 1 0 000-1.414L16 8m-4 6h.01M16 16h.01" />
  </svg>
);

export const MicrophoneIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export const BookOpenIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const PlayIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const PauseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

export const NextIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

export const PrevIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 6l-8.5 6 8.5 6V6zM6 6v12H4V6h2z" />
  </svg>
);

export const LoadingSpinnerIcon: React.FC = () => (
    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
);

export const MusicIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
);

export const DiceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <path d="M16 8h.01"/>
        <path d="M8 8h.01"/>
        <path d="M12 12h.01"/>
        <path d="M8 16h.01"/>
        <path d="M16 16h.01"/>
    </svg>
);