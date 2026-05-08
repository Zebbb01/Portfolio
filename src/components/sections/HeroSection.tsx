// src/components/sections/HeroSection.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 animate-pulse"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            Gerald Villaceran
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm md:text-base font-medium">
              Web Developer
            </span>
            <span className="px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm md:text-base font-medium">
              Growth Systems Builder
            </span>
            <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm md:text-base font-medium">
              AI Prompt Engineer
            </span>
          </div>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            I build high-performance websites and automated marketing systems that help businesses 
            scale, capture leads, and streamline operations through structured development and AI-assisted engineering.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
            <a href="#projects" className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-1">
              View Featured Work
            </a>
            <a href="#contact" className="w-full md:w-auto border border-gray-700 hover:border-blue-400 px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-blue-400/5 backdrop-blur-sm">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default HeroSection;