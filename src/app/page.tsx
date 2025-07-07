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

const Portfolio = () => {
  const activeSection = useScrollSpy(sections, 100); // Using the custom hook

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-['Inter',sans-serif]">
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
  );
};

export default Portfolio;