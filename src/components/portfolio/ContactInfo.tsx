import React from 'react';
import { personalInfo } from '../../data/portfolio';

export const ContactInfo: React.FC = () => {
  const contactMethods = [
    {
      icon: '📧',
      label: 'Email',
      value: personalInfo.email,
      action: () => window.open(`mailto:${personalInfo.email}`, '_blank')
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Connect with me',
      action: () => window.open(personalInfo.linkedin, '_blank')
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: 'View my code',
      action: () => window.open(personalInfo.github, '_blank')
    },
    {
      icon: '🌐',
      label: 'Website',
      value: personalInfo.website,
      action: () => window.open(personalInfo.website, '_blank')
    }
  ];

  const downloadResume = () => {
    // This would trigger resume download
    console.log('Download resume');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Get in Touch</h2>
        <p className="text-gray-400 text-sm">
          {personalInfo.bio}
        </p>
      </div>

      {/* Contact Methods */}
      <div className="space-y-3 mb-6">
        {contactMethods.map((method, index) => (
          <button
            key={index}
            onClick={method.action}
            className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:border-blue-400/50 group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{method.icon}</span>
              <div className="flex-1">
                <div className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                  {method.label}
                </div>
                <div className="text-gray-400 text-xs">{method.value}</div>
              </div>
              <span className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Resume Download */}
      <button
        onClick={downloadResume}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
      >
        📄 Download Resume
      </button>

      {/* Quick Stats */}
      <div className="mt-6 p-4 glass rounded-lg">
        <h3 className="text-white font-medium text-sm mb-3">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-white/5 rounded">
            <div className="text-blue-400 font-semibold">5+</div>
            <div className="text-gray-400">Years Experience</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded">
            <div className="text-green-400 font-semibold">20+</div>
            <div className="text-gray-400">Projects Built</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded">
            <div className="text-purple-400 font-semibold">10+</div>
            <div className="text-gray-400">Technologies</div>
          </div>
          <div className="text-center p-2 bg-white/5 rounded">
            <div className="text-yellow-400 font-semibold">Remote</div>
            <div className="text-gray-400">Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};