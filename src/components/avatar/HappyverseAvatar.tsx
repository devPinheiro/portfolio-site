import React, { useRef, useEffect, useState } from 'react';

interface HappyverseAvatarProps {
  emotion?: 'neutral' | 'excited' | 'thinking' | 'happy' | 'focused';
  isSpeaking?: boolean;
  avatarId?: string; // Happyverse avatar ID
  apiKey?: string; // Happyverse API key if available
}

export const HappyverseAvatar: React.FC<HappyverseAvatarProps> = ({ 
  emotion = 'neutral',
  isSpeaking = false,
  avatarId = import.meta.env.VITE_HAPPYVERSE_AVATAR_ID,
  apiKey = import.meta.env.VITE_HAPPYVERSE_API_KEY
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no avatar ID is provided, show error
    if (!avatarId) {
      setError('Happyverse Avatar ID not configured');
      return;
    }

    try {
      // Load the Happyverse avatar
      // This is a placeholder implementation - actual integration would depend on their SDK/API
      const loadHappyverseAvatar = async () => {
        // Check if Happyverse SDK is available
        if (typeof window !== 'undefined' && (window as any).Happyverse) {
          const happyverse = (window as any).Happyverse;
          
          // Initialize avatar with the provided ID
          await happyverse.createAvatar({
            containerId: containerRef.current?.id,
            avatarId: avatarId,
            apiKey: apiKey,
            config: {
              emotion: emotion,
              isSpeaking: isSpeaking,
              autoPlay: true,
              responsive: true
            }
          });

          setIsLoaded(true);
        } else {
          // Fallback: Load via iframe (most common integration method)
          loadViaIframe();
        }
      };

      const loadViaIframe = () => {
        if (containerRef.current) {
          const iframe = document.createElement('iframe');
          iframe.src = `https://happyverse.ai/embed/${avatarId}${apiKey ? `?key=${apiKey}` : ''}`;
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.border = 'none';
          iframe.style.borderRadius = '12px';
          iframe.allow = 'camera; microphone; autoplay';
          
          // Add event listener for iframe load
          iframe.onload = () => setIsLoaded(true);
          iframe.onerror = () => setError('Failed to load Happyverse avatar');
          
          containerRef.current.appendChild(iframe);
        }
      };

      loadHappyverseAvatar();
    } catch (err) {
      setError('Error initializing Happyverse avatar');
      console.error('Happyverse Avatar Error:', err);
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [avatarId, apiKey]);

  // Update emotion/speaking state if Happyverse SDK supports it
  useEffect(() => {
    if (isLoaded && (window as any).Happyverse) {
      try {
        (window as any).Happyverse.updateState({
          emotion: emotion,
          isSpeaking: isSpeaking
        });
      } catch (err) {
        console.warn('Could not update Happyverse avatar state:', err);
      }
    }
  }, [emotion, isSpeaking, isLoaded]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg">
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">Avatar Unavailable</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="text-sm text-gray-400">
            <p>To use Happyverse.ai avatar:</p>
            <p>1. Set VITE_HAPPYVERSE_AVATAR_ID in your .env file</p>
            <p>2. Optionally set VITE_HAPPYVERSE_API_KEY</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg">
          <div className="text-center text-white">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p>Loading Happyverse Avatar...</p>
          </div>
        </div>
      )}
      
      {/* Happyverse Avatar Container */}
      <div 
        ref={containerRef}
        id={`happyverse-avatar-${Date.now()}`}
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Emotion indicator overlay (optional visual feedback) */}
      {isLoaded && emotion !== 'neutral' && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {emotion === 'excited' && '🎉'}
          {emotion === 'thinking' && '🤔'}
          {emotion === 'happy' && '😊'}
          {emotion === 'focused' && '🎯'}
        </div>
      )}
      
      {/* Speaking indicator */}
      {isLoaded && isSpeaking && (
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-red-500/80 text-white px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Speaking</span>
        </div>
      )}
    </div>
  );
};

// Optional: Load Happyverse SDK script
export const loadHappyverseSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).Happyverse) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://happyverse.ai/sdk/v1/happyverse.js'; // Placeholder URL
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Happyverse SDK'));
    
    document.head.appendChild(script);
  });
};