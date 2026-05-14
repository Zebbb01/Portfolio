"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '../components/ui/Navigation';
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ExpertiseSection from '../components/sections/ExpertiseSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/ui/Footer';
import { sections } from '../data/portfolioData';
import useScrollSpy from '../components/hooks/useScrollSpy';

const Portfolio = () => {
  const activeSection = useScrollSpy(sections, 100);
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Simulate premium loading experience
    const timer = setTimeout(() => setIsLoading(false), 2500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Add small delay to ensure menu closure doesn't interfere with scroll calculation
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-black"
          >
            <div className="flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-32 h-32 mb-12"
              >
                <div className="absolute inset-0 rounded-full border border-brand-cyan/20 animate-pulse" />
                <div className="absolute inset-2 rounded-full border-t-2 border-brand-cyan animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-brand-cyan text-4xl font-black italic"
                   >
                     G<span className="text-brand-white">.</span>V
                   </motion.span>
                </div>
              </motion.div>
              <div className="overflow-hidden h-6 w-64 bg-brand-white/5 rounded-full relative">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-brand-cyan shadow-[0_0_20px_rgba(0,229,255,0.8)]"
                 />
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-[10px] font-black uppercase tracking-[0.6em] text-brand-muted"
              >
                Orchestrating Experience
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-brand-black text-brand-white font-['Inter',sans-serif] selection:bg-brand-cyan selection:text-brand-black">
        {/* Advanced Ambient Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute inset-0 bg-grid-pattern [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40"></div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-cyan/5 blur-[150px]"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-teal/5 blur-[150px]"
          />
        </div>

        <div className="relative z-10">
          <Navigation
            activeSection={activeSection}
            isScrolled={isScrolled}
            scrollToSection={scrollToSection}
          />
          
          <main className="relative">
            <HeroSection />
            <AboutSection />
            <ExpertiseSection />
            <ProjectsSection />
            <ContactSection />
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default Portfolio;