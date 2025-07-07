// src/components/sections/HeroSection.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gerald Villaceran
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Junior Web Developer
          </p>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Passionate about creating innovative web solutions with almost 1 year of experience
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <a href="#projects" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              View My Work
            </a>
            <a href="#contact" className="border border-gray-500 hover:border-blue-400 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-blue-400/10">
              Get In Touch
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default HeroSection;