# 🤖 AI-Powered Portfolio Website

An innovative, interactive portfolio website featuring a realtime AI avatar assistant that can speak, listen, and showcase projects through natural conversation.

## ✨ Features

### 🎭 AI Avatar Assistant
- **3D Animated Avatar** with emotion-based expressions and behaviors
- **Voice Recognition** - Speak naturally to the AI assistant
- **Text-to-Speech** - AI responds with synthesized voice
- **Emotional Responses** - Avatar changes emotions based on conversation context
- **Intelligent Conversations** - Context-aware responses about projects and experience

### 🎨 Modern UI/UX
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark/Light Mode** - System preference detection with manual toggle
- **GSAP Animations** - Smooth, professional animations throughout
- **Glass Morphism** - Modern glassmorphic design elements
- **Accessibility** - ARIA labels, keyboard navigation, screen reader support

### 📱 Interactive Features
- **Voice Controls** - Start conversations with voice commands
- **Quick Actions** - Pre-defined questions for easy interaction
- **Project Showcase** - Dynamic project exploration with metrics
- **Contact Integration** - Direct links to email, GitHub, LinkedIn

### 🔧 Technical Excellence
- **TypeScript** - Full type safety and developer experience
- **Modular Architecture** - Clean, maintainable component structure
- **Error Boundaries** - Graceful error handling and recovery
- **SEO Optimized** - Meta tags, structured data, social sharing
- **Performance** - Optimized loading and lazy-loaded components

## 🚀 Tech Stack

### Frontend Framework
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional animation library
- **CSS Grid/Flexbox** - Modern responsive layouts

### 3D Graphics
- **Three.js** - 3D graphics and rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

### AI & Voice
- **Web Speech API** - Browser-native speech recognition
- **Speech Synthesis API** - Text-to-speech functionality
- **OpenAI Integration** - Ready for realtime AI API (when available)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 22+ (uses Node.js LTS)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio-ai.git
   cd portfolio-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Components

### AvatarPanel
The main AI assistant interface featuring:
- 3D animated avatar with emotion states
- Voice recognition controls
- Speech bubble for AI responses
- Quick action buttons
- Text input fallback

### PortfolioPanel
Interactive portfolio showcase including:
- Project listings with metrics
- Contact information
- Quick stats
- Theme toggle
- Responsive navigation

## 🌟 Customization

### Personal Information
Update your details in `src/data/portfolio.ts`:

```typescript
export const personalInfo = {
  name: 'Your Name',
  title: 'Your Title',
  bio: 'Your bio...',
  email: 'your.email@example.com',
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourprofile'
};
```

### Projects
Add your projects to the `portfolioData` array in `src/data/portfolio.ts`.

### AI Responses
Customize AI responses in `src/services/openai.ts` - modify the `simulateResponse` function for custom conversation logic.

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically with each push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure redirects for SPA routing

## 🔧 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Voice Features**: Requires browsers with Web Speech API support
- **3D Features**: Requires WebGL support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ and cutting-edge technology**
