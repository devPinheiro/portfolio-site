import React from 'react';
import { cn } from '../../lib/cn';

interface SpeechBubbleProps {
  message: string;
  isVisible: boolean;
  position?: 'top' | 'bottom';
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ 
  message, 
  isVisible, 
  position = 'top' 
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        "max-w-sm glass rounded-lg p-4 relative transform transition-all duration-300",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      <p className="text-white text-sm leading-relaxed">{message}</p>
      
      {/* Speech bubble tail */}
      <div 
        className={cn(
          "absolute w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent",
          position === 'top' 
            ? "bottom-[-8px] left-1/2 transform -translate-x-1/2 border-t-8 border-t-white/20" 
            : "top-[-8px] left-1/2 transform -translate-x-1/2 border-b-8 border-b-white/20"
        )}
      />
    </div>
  );
};