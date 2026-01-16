import React from 'react';

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Show me your best project",
      description: "Explore my most impactful work",
      icon: "🚀",
      action: () => console.log('Show best project')
    },
    {
      title: "Tell me about your experience",
      description: "Learn about my background and skills",
      icon: "💼",
      action: () => console.log('Show experience')
    },
    {
      title: "Walk through a case study",
      description: "Deep dive into a specific project",
      icon: "📊",
      action: () => console.log('Show case study')
    },
    {
      title: "What technologies do you use?",
      description: "Discover my tech stack and tools",
      icon: "⚡",
      action: () => console.log('Show tech stack')
    },
    {
      title: "Show me your resume",
      description: "View my professional background",
      icon: "📄",
      action: () => console.log('Show resume')
    },
    {
      title: "Let's discuss a project",
      description: "Talk about potential collaboration",
      icon: "🤝",
      action: () => console.log('Discuss project')
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Quick Actions</h2>
        <p className="text-gray-400 text-sm">
          Click any button or ask me directly!
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:border-blue-400/50 group"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{action.icon}</span>
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Voice Input */}
      <div className="mt-6 p-4 glass rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <span className="text-lg">💬</span>
          <span className="text-white font-medium text-sm">Ask Anything</span>
        </div>
        <input
          type="text"
          placeholder="Type your question here..."
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400"
        />
        <button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Send Message
        </button>
      </div>
    </div>
  );
};