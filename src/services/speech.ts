interface SpeechOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

// Add missing type definitions
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
  language: string;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;
  private callbacks: {
    onResult?: (result: SpeechResult) => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {};

  constructor(options: SpeechOptions = {}) {
    this.setupRecognition(options);
  }

  private setupRecognition(options: SpeechOptions): void {
    // Check if Speech Recognition is supported
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.isSupported = true;
    this.recognition = new SpeechRecognition();

    // Configure recognition
    if (this.recognition) {
      this.recognition.language = options.language || 'en-US';
      this.recognition.continuous = options.continuous ?? true;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.maxAlternatives = 1;

      // Event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        const isFinal = result.isFinal;

        this.callbacks.onResult?.({
          transcript: transcript.trim(),
          confidence,
          isFinal
        });
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        this.callbacks.onError?.(event.error);
      };
    }
  }

  startListening(): boolean {
    if (!this.isSupported || !this.recognition) {
      console.warn('Speech Recognition not available');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  onResult(callback: (result: SpeechResult) => void): void {
    this.callbacks.onResult = callback;
  }

  onStart(callback: () => void): void {
    this.callbacks.onStart = callback;
  }

  onEnd(callback: () => void): void {
    this.callbacks.onEnd = callback;
  }

  onError(callback: (error: string) => void): void {
    this.callbacks.onError = callback;
  }

  getIsSupported(): boolean {
    return this.isSupported;
  }

  getIsListening(): boolean {
    return this.isListening;
  }
}

export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.setupVoice();
  }

  private setupVoice(): void {
    // Wait for voices to load
    const setVoice = () => {
      const voices = this.synth.getVoices();
      // Prefer a female voice with natural intonation
      this.voice = voices.find(voice => 
        voice.name.includes('Google') && voice.lang.startsWith('en')
      ) || voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Female')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0] || null;
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}): void {
    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure utterance
    if (this.voice) {
      utterance.voice = this.voice;
    }
    
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      options.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      options.onEnd?.();
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      this.isSpeaking = false;
      options.onEnd?.();
    };

    // Start speaking
    this.synth.speak(utterance);
  }

  stop(): void {
    this.synth.cancel();
    this.isSpeaking = false;
  }

  pause(): void {
    this.synth.pause();
  }

  resume(): void {
    this.synth.resume();
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  setVoice(voiceName: string): void {
    const voices = this.synth.getVoices();
    this.voice = voices.find(voice => voice.name === voiceName) || this.voice;
  }
}