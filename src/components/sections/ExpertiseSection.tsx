// src/components/sections/ExpertiseSection.tsx
import React from 'react';
import { techStack } from '../../data/portfolioData';

const categoryTitles: Record<string, string> = {
  webDevelopment: 'Modern Web Development',
  backendData: 'Backend & Data Architecture',
  automationAI: 'Automation & AI Systems',
  tools: 'Ecosystem & Tools'
};

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="py-24 bg-black/40">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Technical Expertise
          </h2>
          <p className="text-gray-400 text-lg">
            A comprehensive stack focused on building scalable, automated, and intelligent digital solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(techStack).map(([category, technologies], index) => (
            <div
              key={category}
              className="group bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-xl font-bold mb-6 text-blue-400 group-hover:text-blue-300 transition-colors">
                {categoryTitles[category] || category}
              </h3>
              <div className="space-y-4">
                {technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-3 text-gray-300 group/item">
                    <span className="p-2 rounded-lg bg-gray-800/50 text-purple-400 group-hover/item:text-purple-300 group-hover/item:scale-110 transition-all">
                      {React.createElement(tech.icon, { size: 18 })}
                    </span>
                    <span className="font-medium">{tech.name}</span>
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