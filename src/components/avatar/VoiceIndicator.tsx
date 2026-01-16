import React from 'react';
import { cn } from '../../lib/cn';

interface VoiceIndicatorProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ 
  isListening, 
  isSpeaking 
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Microphone Icon */}
      <div 
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          isListening 
            ? "bg-red-500 animate-pulse" 
            : "bg-gray-700 hover:bg-gray-600"
        )}
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      {/* Sound Waves */}
      {isSpeaking && (
        <div className="flex items-center space-x-1">
          <div className="w-1 bg-blue-500 rounded-full animate-pulse" 
               style={{ height: '20px', animationDelay: '0ms' }} />
          <div className="w-1 bg-blue-500 rounded-full animate-pulse" 
               style={{ height: '30px', animationDelay: '150ms' }} />
          <div className="w-1 bg-blue-500 rounded-full animate-pulse" 
               style={{ height: '25px', animationDelay: '300ms' }} />
          <div className="w-1 bg-blue-500 rounded-full animate-pulse" 
               style={{ height: '35px', animationDelay: '450ms' }} />
        </div>
      )}
      
      {/* Status Text */}
      <div className="text-white text-sm">
        {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
      </div>
    </div>
  );
};