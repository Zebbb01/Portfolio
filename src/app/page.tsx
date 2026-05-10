// src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Navigation from '../components/ui/Navigation';
import HeroSection from '../components/sections/HeroSection';
import ExpertiseSection from '../components/sections/ExpertiseSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/ui/Footer';
import { sections } from '../data/portfolioData'; // Import sections for navigation
import useScrollSpy from '../components/hooks/useScrollSpy'; // Custom hook
import { motion } from 'framer-motion';

const Portfolio = () => {
  const activeSection = useScrollSpy(sections, 100);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Intro Preloader */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-brand-black transition-opacity duration-700 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center transform transition-transform duration-700 scale-100">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-t-2 border-brand-cyan animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-brand-teal animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/logo.png" 
                alt="Logo" 
                className="w-12 h-12 animate-pulse"
              />
            </div>
          </div>
          <div className="text-brand-cyan tracking-[0.3em] text-sm font-semibold uppercase animate-pulse">Initializing Systems</div>
          <div className="w-48 h-1 bg-brand-teal/20 rounded-full mt-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-brand-cyan w-full animate-progress origin-left"></div>
          </div>
        </div>
      </div>

      <div className={`min-h-screen bg-brand-black text-brand-white font-['Inter',sans-serif] transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Subtle global ambient glow and grid */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
          <motion.div 
            animate={{ 
              x: [0, 50, 0, -50, 0],
              y: [0, 30, -30, 0, 0],
              scale: [1, 1.2, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-teal/10 blur-[150px]"
          />
          <motion.div 
            animate={{ 
              x: [0, -60, 0, 60, 0],
              y: [0, -40, 40, 0, 0],
              scale: [1, 1.3, 1, 1.2, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/10 blur-[150px]"
          />
        </div>

        <div className="relative z-10">
          <Navigation
            activeSection={activeSection}
            isScrolled={isScrolled}
            scrollToSection={scrollToSection}
          />
          <HeroSection />
          <ExpertiseSection />
          <ProjectsSection />
          <ContactSection />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Portfolio;