import React, { useState } from 'react';
import { QuickActions } from './QuickActions';
import { ProjectShowcase } from './ProjectShowcase';
import { ContactInfo } from './ContactInfo';
import { ThemeToggle } from '../ui/ThemeToggle';

export const PortfolioPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'actions' | 'projects' | 'contact'>('actions');

  return (
    <div className="h-screen flex flex-col glass border-l border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white gradient-text">
              Samuel Pinheiro
            </h1>
            <p className="text-gray-300 text-sm">Full Stack Developer</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-white/10">
        {[
          { key: 'actions', label: 'Quick Actions' },
          { key: 'projects', label: 'Projects' },
          { key: 'contact', label: 'Contact' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key as any)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeSection === tab.key
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'actions' && <QuickActions />}
        {activeSection === 'projects' && <ProjectShowcase />}
        {activeSection === 'contact' && <ContactInfo />}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <span>Ask anything</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};