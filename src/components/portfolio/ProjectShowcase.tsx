import React from 'react';
import { portfolioData } from '../../data/portfolio';

export const ProjectShowcase: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Featured Projects</h2>
        <p className="text-gray-400 text-sm">
          Ask me about any project for detailed insights!
        </p>
      </div>

      <div className="space-y-4">
        {portfolioData.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:border-blue-400/50 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
                {project.duration.split(' - ')[0]}
              </span>
            </div>

            <p className="text-gray-400 text-xs mb-3 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-3">
              {project.techStack.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-xs text-gray-400">
                  +{project.techStack.length - 4} more
                </span>
              )}
            </div>

            {project.metrics && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {project.metrics.impact && (
                  <div className="text-gray-400">
                    <span className="text-green-400">Impact:</span> {project.metrics.impact}
                  </div>
                )}
                {project.metrics.performance && (
                  <div className="text-gray-400">
                    <span className="text-yellow-400">Performance:</span> {project.metrics.performance}
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 text-xs text-blue-400 group-hover:text-blue-300">
              💬 Ask me about this project →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};