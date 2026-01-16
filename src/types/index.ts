export interface Project {
  id: string;
  title: string;
  role: string;
  company?: string;
  duration: string;
  description: string;
  techStack: string[];
  achievements: string[];
  metrics?: {
    impact?: string;
    performance?: string;
    users?: string;
  };
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
}

export interface AIAgent {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  currentEmotion: 'neutral' | 'excited' | 'thinking' | 'happy' | 'focused';
  currentProject?: Project;
}

export interface VoiceSettings {
  autoListen: boolean;
  voiceEnabled: boolean;
  language: string;
}

export interface ThemeSettings {
  isDark: boolean;
  accentColor: string;
}

export interface AppSettings {
  theme: ThemeSettings;
  voice: VoiceSettings;
  animations: {
    reducedMotion: boolean;
  };
}