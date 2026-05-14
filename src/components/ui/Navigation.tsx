"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sections } from '../../data/portfolioData';
import { Menu, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
  isScrolled: boolean;
  scrollToSection: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, isScrolled, scrollToSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
    
    // Update URL hash without jumping
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'bg-brand-black/70 backdrop-blur-md border-b border-brand-white/10 py-4' 
        : 'bg-transparent py-8'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link 
          href="/#home"
          onClick={(e) => handleSectionClick(e, 'home')}
          className="cursor-pointer group flex items-center space-x-3 z-10" 
        >
          <div className="relative">
            <Image 
              src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/logo.png" 
              alt="Logo" 
              width={40} 
              height={40}
              className="w-10 h-10 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute -inset-2 bg-brand-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-brand-white font-black tracking-tighter text-xl hidden sm:block">
            GERALD<span className="text-brand-cyan">.</span>V
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {sections.map((section) => (
            <Link
              key={section}
              href={`/#${section}`}
              onClick={(e) => handleSectionClick(e, section)}
              className={`relative px-6 py-2 capitalize text-sm font-bold tracking-widest transition-all group overflow-hidden ${
                activeSection === section ? 'text-brand-cyan' : 'text-brand-muted hover:text-brand-white'
              }`}
            >
              <span className="relative z-10">{section}</span>
              {activeSection === section && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute bottom-0 left-6 right-6 h-0.5 bg-brand-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                  transition={{ type: "spring" as const, stiffness: 380, damping: 30 }}
                />
              )}
              <span className="absolute inset-0 bg-brand-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          ))}
          
          <div className="pl-6">
            <Link 
              href="/#contact"
              onClick={(e) => handleSectionClick(e, 'contact')}
              className="px-6 py-2.5 bg-brand-cyan text-brand-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >
              HIRE ME
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-10">
          <button 
            onClick={toggleMobileMenu} 
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-white/5 border border-brand-white/10 text-brand-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-brand-black/95 backdrop-blur-2xl border-b border-brand-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-12 flex flex-col space-y-6">
              {sections.map((section, i) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    onClick={(e) => handleSectionClick(e, section)}
                    className={`flex items-center justify-between group py-2 border-b border-brand-white/5 cursor-pointer ${
                      activeSection === section ? 'text-brand-cyan' : 'text-brand-white'
                    }`}
                  >
                    <span className="text-3xl font-black uppercase tracking-tighter italic">
                      {section}
                    </span>
                    <ArrowRight className={`w-6 h-6 transition-transform group-hover:translate-x-2 ${
                      activeSection === section ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                </motion.div>
              ))}
              
               <div 
                onClick={(e) => handleSectionClick(e, 'contact')}
                className="mt-8 w-full py-5 bg-brand-cyan text-brand-black rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-transform"
              >
                START A PROJECT
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;