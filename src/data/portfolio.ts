import { type Project } from '../types';

export const portfolioData: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Health Tracker',
    role: 'Full Stack Developer',
    company: 'Personal Project',
    duration: 'Q3 2024 - Present',
    description: 'A comprehensive health tracking application that uses AI to provide personalized health insights and recommendations based on user data.',
    techStack: ['React', 'Node.js', 'TypeScript', 'OpenAI API', 'PostgreSQL', 'Docker'],
    achievements: [
      'Built real-time health monitoring dashboard',
      'Integrated AI recommendations using GPT-4',
      'Implemented secure user authentication',
      'Created responsive design for mobile and desktop'
    ],
    metrics: {
      impact: '500+ active users',
      performance: '98% uptime',
      users: '15% improvement in health goals achievement'
    }
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    role: 'Frontend Lead',
    company: 'Localyze',
    duration: 'Q1 2024 - Q2 2024',
    description: 'Led the frontend development of a modern e-commerce platform with advanced search capabilities and seamless user experience.',
    techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe API'],
    achievements: [
      'Improved page load speed by 40%',
      'Implemented advanced product filtering',
      'Built cart and checkout flow',
      'Integrated payment processing'
    ],
    metrics: {
      impact: '2000+ daily active users',
      performance: '2.3s average load time',
      users: '25% increase in conversion rate'
    }
  },
  {
    id: '3',
    title: 'Real-time Chat Application',
    role: 'Full Stack Developer',
    company: 'Personal Project',
    duration: 'Q4 2023 - Q1 2024',
    description: 'Built a scalable real-time messaging application with features like file sharing, emoji reactions, and group chat capabilities.',
    techStack: ['React', 'Node.js', 'Socket.IO', 'MongoDB', 'Express'],
    achievements: [
      'Implemented real-time messaging',
      'Built file upload and sharing',
      'Created group chat functionality',
      'Added message encryption'
    ],
    metrics: {
      impact: '1000+ registered users',
      performance: '99.9% message delivery rate',
      users: 'Support for 100+ concurrent users'
    }
  }
];

export const personalInfo = {
  name: 'Samuel Pinheiro',
  title: 'Full Stack Developer',
  bio: 'Passionate developer with expertise in React, Node.js, and AI integration. I love building innovative solutions that solve real-world problems.',
  location: 'Remote',
  email: 'contact@samuel.dev',
  github: 'https://github.com/samuel',
  linkedin: 'https://linkedin.com/in/samuel-pinheiro',
  website: 'https://samuel.dev'
};