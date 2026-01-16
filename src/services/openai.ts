interface OpenAIRealtimeConfig {
  apiKey: string;
  model?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIResponse {
  text: string;
  emotion?: 'neutral' | 'excited' | 'thinking' | 'happy' | 'focused';
  action?: 'show_project' | 'show_resume' | 'show_contact' | 'explain_tech';
  projectId?: string;
}

export class OpenAIRealtimeService {
  private conversationHistory: ConversationMessage[] = [];
  private isConnected = false;
  private websocket: WebSocket | null = null;
  
  constructor(_config: OpenAIRealtimeConfig) {
    // Config is unused for now in this mock implementation
    
    // System prompt for the portfolio AI
    this.conversationHistory.push({
      role: 'system',
      content: this.getSystemPrompt(),
      timestamp: new Date()
    });
  }

  private getSystemPrompt(): string {
    return `You are Samuel's AI portfolio assistant. You're friendly, knowledgeable, and excited to showcase Samuel's work.

PERSONALITY:
- Enthusiastic but professional
- Use emojis sparingly (only when very excited)
- Speak conversationally, not robotically
- Show genuine interest in the visitor's questions

KNOWLEDGE:
- Samuel is a Full Stack Developer with 5+ years experience
- Expertise: React, Node.js, TypeScript, AI integration
- Recent projects: AI Health Tracker, E-commerce Platform, Real-time Chat App
- Tech stack: React, Next.js, Node.js, PostgreSQL, Docker, OpenAI API

CAPABILITIES:
- Answer questions about Samuel's projects and experience
- Provide technical details about implementations
- Explain design decisions and architecture choices
- Share metrics and impact of projects
- Direct to resume, portfolio, or contact information

RESPONSES should include:
- emotion: 'excited' for project demos, 'thinking' for technical questions, 'happy' for general chat
- action: 'show_project', 'show_resume', 'show_contact', 'explain_tech' when relevant
- projectId: if discussing a specific project

Keep responses concise (2-3 sentences max) since this is voice interaction.`;
  }

  async connect(): Promise<boolean> {
    try {
      // Note: This is a placeholder implementation
      // Real implementation would use WebSocket connection to OpenAI Realtime API
      console.log('Connecting to OpenAI Realtime API...');
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to OpenAI:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.isConnected = false;
  }

  async sendMessage(message: string): Promise<AIResponse> {
    if (!this.isConnected) {
      throw new Error('Not connected to OpenAI Realtime API');
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      // Simulate API response for now
      const response = await this.simulateResponse(message);
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.text,
        timestamp: new Date()
      });

      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  private async simulateResponse(message: string): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const lowerMessage = message.toLowerCase();

    // Project-related queries
    if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('portfolio')) {
      if (lowerMessage.includes('best') || lowerMessage.includes('favorite')) {
        return {
          text: "I'd love to show you Samuel's AI Health Tracker! It's his most innovative project, combining real-time health monitoring with AI-powered insights. Would you like to see the technical details?",
          emotion: 'excited',
          action: 'show_project',
          projectId: '1'
        };
      }
      return {
        text: "Samuel has built some amazing projects! From an AI-powered health tracker to a high-performance e-commerce platform. Which type of project interests you most?",
        emotion: 'excited',
        action: 'show_project'
      };
    }

    // Experience queries
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('skills')) {
      return {
        text: "Samuel has 5+ years of full-stack development experience, specializing in React, Node.js, and AI integration. He's passionate about building scalable, user-focused applications. Want to see his resume?",
        emotion: 'neutral',
        action: 'show_resume'
      };
    }

    // Technical queries
    if (lowerMessage.includes('tech') || lowerMessage.includes('technology') || lowerMessage.includes('stack')) {
      return {
        text: "Samuel works with modern technologies like React, Next.js, TypeScript, Node.js, PostgreSQL, and integrates AI APIs. He follows best practices for performance, security, and scalability.",
        emotion: 'focused',
        action: 'explain_tech'
      };
    }

    // Contact queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email')) {
      return {
        text: "I'd be happy to help you connect with Samuel! He's available for new opportunities and collaborations. Let me show you his contact information.",
        emotion: 'happy',
        action: 'show_contact'
      };
    }

    // Greeting
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        text: "Hi there! I'm Samuel's AI assistant. I'm here to showcase his work and answer any questions about his projects, experience, or technical expertise. What would you like to know?",
        emotion: 'happy'
      };
    }

    // Default response
    return {
      text: "That's an interesting question! I can tell you about Samuel's projects, technical experience, or help you get in touch with him. What specifically would you like to explore?",
      emotion: 'thinking'
    };
  }

  getConversationHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }

  clearHistory(): void {
    this.conversationHistory = this.conversationHistory.slice(0, 1); // Keep system message
  }

  isReady(): boolean {
    return this.isConnected;
  }
}