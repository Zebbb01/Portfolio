// src/components/sections/ExpertiseSection.tsx
import React from 'react';
import { techStack } from '../../data/portfolioData';

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="py-20 bg-black/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Technical Expertise
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(techStack).map(([category, technologies], index) => (
            <div
              key={category}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-semibold mb-4 capitalize text-blue-400">
                {category === 'cloud' ? 'Cloud & DevOps' : category}
              </h3>
              <div className="space-y-3">
                {technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-3 text-gray-300">
                    <span className="text-purple-400">{React.createElement(tech.icon)}</span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;