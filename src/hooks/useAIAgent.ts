import { useState, useCallback, useEffect } from 'react';
import { OpenAIRealtimeService } from '../services/openai';
import { SpeechRecognitionService, TextToSpeechService } from '../services/speech';
import { type AIAgent, type Project } from '../types';

interface UseAIAgentProps {
  apiKey?: string;
  autoSpeak?: boolean;
}

export const useAIAgent = ({
  apiKey = '',
  autoSpeak = true
}: UseAIAgentProps = {}) => {
  const [agent, setAgent] = useState<AIAgent>({
    isListening: false,
    isSpeaking: false,
    isThinking: false,
    currentEmotion: 'neutral'
  });

  const [openaiService] = useState(() => 
    apiKey ? new OpenAIRealtimeService({ apiKey }) : null
  );
  
  const [speechRecognition] = useState(() => new SpeechRecognitionService({
    continuous: false,
    interimResults: true
  }));

  const [textToSpeech] = useState(() => new TextToSpeechService());

  const [lastMessage, setLastMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);

  // Initialize services
  useEffect(() => {
    if (openaiService) {
      openaiService.connect();
    }

    // Setup speech recognition callbacks
    speechRecognition.onStart(() => {
      setAgent(prev => ({ ...prev, isListening: true }));
    });

    speechRecognition.onEnd(() => {
      setAgent(prev => ({ ...prev, isListening: false }));
    });

    speechRecognition.onResult((result) => {
      if (result.isFinal && result.transcript.length > 0) {
        handleUserMessage(result.transcript);
      }
    });

    speechRecognition.onError((error) => {
      console.error('Speech recognition error:', error);
      setAgent(prev => ({ ...prev, isListening: false }));
    });

    return () => {
      openaiService?.disconnect();
      speechRecognition.stopListening();
      textToSpeech.stop();
    };
  }, []);

  const handleUserMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    try {
      setAgent(prev => ({ ...prev, isThinking: true }));
      setLastMessage(message);

      // Add user message to history
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, userMessage]);

      // Get AI response
      let response;
      if (openaiService?.isReady()) {
        response = await openaiService.sendMessage(message);
      } else {
        // Fallback to mock response
        response = await getMockResponse(message);
      }

      // Add assistant message to history
      const assistantMessage = {
        role: 'assistant' as const,
        content: response.text,
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, assistantMessage]);

      // Update agent state
      setAgent(prev => ({
        ...prev,
        isThinking: false,
        currentEmotion: response.emotion || 'neutral',
        // @ts-ignore - Ignoring project type mismatch for now as we transition
        currentProject: (response as any).projectId ? getProjectById((response as any).projectId) : undefined
      }));

      // Speak response if auto-speak is enabled
      if (autoSpeak && response.text) {
        speakMessage(response.text);
      }

      return response;
    } catch (error) {
      console.error('Error handling user message:', error);
      setAgent(prev => ({ ...prev, isThinking: false }));
      
      const errorResponse = {
        text: "I'm sorry, I'm having trouble processing that right now. Could you try asking again?",
        emotion: 'neutral' as const
      };

      if (autoSpeak) {
        speakMessage(errorResponse.text);
      }

      return errorResponse;
    }
  }, [openaiService, autoSpeak]);

  const speakMessage = useCallback((text: string) => {
    setAgent(prev => ({ ...prev, isSpeaking: true }));
    
    textToSpeech.speak(text, {
      rate: 0.9,
      pitch: 1.1,
      onStart: () => {
        setAgent(prev => ({ ...prev, isSpeaking: true }));
      },
      onEnd: () => {
        setAgent(prev => ({ ...prev, isSpeaking: false }));
      }
    });
  }, [textToSpeech]);

  const startListening = useCallback(() => {
    if (speechRecognition.getIsSupported()) {
      speechRecognition.startListening();
    } else {
      console.warn('Speech recognition not supported');
    }
  }, [speechRecognition]);

  const stopListening = useCallback(() => {
    speechRecognition.stopListening();
  }, [speechRecognition]);

  const stopSpeaking = useCallback(() => {
    textToSpeech.stop();
    setAgent(prev => ({ ...prev, isSpeaking: false }));
  }, [textToSpeech]);

  const setEmotion = useCallback((emotion: AIAgent['currentEmotion']) => {
    setAgent(prev => ({ ...prev, currentEmotion: emotion }));
  }, []);

  const clearConversation = useCallback(() => {
    setConversationHistory([]);
    openaiService?.clearHistory();
  }, [openaiService]);

  return {
    agent,
    lastMessage,
    conversationHistory,
    handleUserMessage,
    speakMessage,
    startListening,
    stopListening,
    stopSpeaking,
    setEmotion,
    clearConversation,
    isVoiceSupported: speechRecognition.getIsSupported(),
    isConnected: openaiService?.isReady() ?? false
  };
};

// Mock response function for when OpenAI is not available
async function getMockResponse(message: string) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
    return {
      text: "I'd love to show you Samuel's projects! His AI Health Tracker is particularly innovative. Which aspect interests you most?",
      emotion: 'excited' as const,
      action: 'show_project' as const,
      projectId: '1'
    };
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
    return {
      text: "Samuel is available for new opportunities! Let me show you his contact information.",
      emotion: 'happy' as const,
      action: 'show_contact' as const
    };
  }

  return {
    text: "That's interesting! I can tell you about Samuel's projects, experience, or technical skills. What would you like to explore?",
    emotion: 'thinking' as const
  };
}

// Helper function to get project by ID
function getProjectById(projectId: string): Project {
  // This would normally fetch from your portfolio data
  return {
    id: projectId,
    title: 'Sample Project',
    description: 'A sample project description',
    role: 'Developer',
    duration: '2024',
    techStack: ['React', 'TypeScript'],
    achievements: ['Built amazing things'],
    images: ['https://example.com/image.jpg'],
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com'
  };
}