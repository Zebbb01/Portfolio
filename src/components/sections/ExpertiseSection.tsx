"use client";

import React from 'react';
import { techStack } from '../../data/portfolioData';
import { motion } from 'framer-motion';

const categoryTitles: Record<string, string> = {
  webDevelopment: 'Modern Web Development',
  backendData: 'Backend & Data Architecture',
  automationAI: 'Automation & AI Systems',
  tools: 'Ecosystem & Tools'
};

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="py-24 bg-transparent relative z-10/40">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-white">
            Technical Expertise
          </h2>
          <p className="text-brand-muted text-lg">
            A comprehensive stack focused on building scalable, automated, and intelligent digital solutions.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(techStack).map(([category, technologies], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-gradient-to-br from-brand-teal/40/40 to-brand-black/60 backdrop-blur-md rounded-2xl p-8 border border-brand-teal/50 hover:border-brand-cyan/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-cyan/10"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-100 group-hover:text-brand-cyan transition-colors">
                {categoryTitles[category] || category}
              </h3>
              <div className="space-y-4">
                {technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center space-x-3 text-brand-muted group/item">
                    <span className="p-2 rounded-lg bg-brand-teal/20/50 text-brand-cyan group-hover/item:text-[#33EBFF] group-hover/item:scale-110 transition-all">
                      {React.createElement(tech.icon, { size: 18 })}
                    </span>
                    <span className="font-medium">{tech.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;