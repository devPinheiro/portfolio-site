import React, { useState, useRef, useEffect } from 'react';
import { HappyverseAvatar } from './HappyverseAvatar';
import { VoiceIndicator } from './VoiceIndicator';
import { SpeechBubble } from './SpeechBubble';
import { useAIAgent } from '../../hooks/useAIAgent';
import { useGSAP } from '../../hooks/useGSAP';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export const AvatarPanel: React.FC = () => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    agent,
    conversationHistory,
    handleUserMessage,
    startListening,
    stopListening,
    isVoiceSupported
  } = useAIAgent({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    autoSpeak: true
  });

  const { scopeRef } = useGSAP();

  // Get the latest assistant message for the speech bubble
  const latestMessage = conversationHistory
    .filter(msg => msg.role === 'assistant')
    .pop()?.content || "Hi! I'm Samuel's AI assistant. Ask me about his projects!";

  // Auto-focus text input when shown
  useEffect(() => {
    if (showTextInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showTextInput]);

  const handleVoiceClick = () => {
    if (agent.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (textMessage.trim()) {
      await handleUserMessage(textMessage);
      setTextMessage('');
      setShowTextInput(false);
    }
  };

  const handleQuickAction = (message: string) => {
    handleUserMessage(message);
  };

  return (
    <div ref={scopeRef} className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
      {/* Avatar Container */}
      <ErrorBoundary>
        <div className="flex-1 relative min-h-0">
          <React.Suspense
            fallback={
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner 
                  variant="orbit" 
                  size="lg" 
                  text="Loading Happyverse Avatar..." 
                />
              </div>
            }
          >
            <HappyverseAvatar 
              emotion={agent.currentEmotion}
              isSpeaking={agent.isSpeaking}
            />
          </React.Suspense>
          
          {/* Voice Indicator Overlay */}
          <div className="absolute bottom-10 left-10" data-animate>
            <VoiceIndicator 
              isListening={agent.isListening} 
              isSpeaking={agent.isSpeaking} 
            />
          </div>
          
          {/* Speech Bubble Overlay */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2" data-animate>
            <SpeechBubble 
              message={latestMessage}
              isVisible={!agent.isThinking}
            />
          </div>

          {/* Thinking Indicator */}
          {agent.isThinking && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
              <div className="glass rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-white text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ErrorBoundary>

      {/* Quick Actions */}
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-2 justify-center" data-animate>
          {[
            "Show me your best project",
            "Tell me about your experience",
            "What technologies do you use?",
            "How can I contact Samuel?"
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-colors border border-white/20"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      
      {/* Voice Controls */}
      <div className="p-6 glass m-4 rounded-lg" data-animate>
        {!showTextInput ? (
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={handleVoiceClick}
              disabled={!isVoiceSupported}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                agent.isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${!isVoiceSupported ? 'opacity-50 cursor-not-allowed' : ''} text-white`}
            >
              <span>{agent.isListening ? '⏹️' : '🎤'}</span>
              <span>{agent.isListening ? 'Stop Listening' : 'Start Conversation'}</span>
            </button>
            <button 
              onClick={() => setShowTextInput(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>💬</span>
              <span>Type Message</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={!textMessage.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg transition-colors"
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => setShowTextInput(false)}
                className="px-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        
        {!isVoiceSupported && (
          <p className="text-xs text-yellow-400 text-center mt-2">
            Voice input not supported in this browser. Please use text input.
          </p>
        )}
      </div>
    </div>
  );
};