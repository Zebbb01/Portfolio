// src/components/ui/Navigation.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { sections } from '@/src/data/portfolioData';
import useScrollSpy from '@/src/components/hooks/useScrollSpy';

// ---------------------------------------------------------------------------
// Navigation link labels mapped from section IDs
// ---------------------------------------------------------------------------
const navLinks: { id: string; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'expertise', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' as const },
  },
};

const mobileNavVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const mobileLinkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.06,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.15 } },
};


// ---------------------------------------------------------------------------
// Navigation Component
// ---------------------------------------------------------------------------
export default function Navigation() {
  const activeSection = useScrollSpy(sections, 100);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll position for background transition
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll(); // Set initial state
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Smooth-scroll to a section by ID
  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });

    // Update URL hash silently
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#${sectionId}`);
    }
  }, []);

  // Handle nav link click (desktop + mobile)
  const handleNavClick = useCallback(
    (e: React.MouseEvent, sectionId: string) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      // Small delay so mobile menu closes before scroll calculation
      setTimeout(() => scrollToSection(sectionId), 80);
    },
    [scrollToSection],
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#060606]/80 backdrop-blur-xl border-b border-[#1F1F1F]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* ----------------------------------------------------------------
            Logo: Personal Brand Mark
        ----------------------------------------------------------------- */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="relative z-10 group"
        >
          <img
            src="/images/logo-gv.svg"
            alt="Gerald Villaceran"
            className="h-10 md:h-11 w-auto transition-opacity duration-300 group-hover:opacity-80"
          />
        </a>

        {/* ----------------------------------------------------------------
            Desktop Navigation Links (hidden below lg)
        ----------------------------------------------------------------- */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-[#D4AF37]'
                    : 'text-[#A09882] hover:text-[#F5F0E8]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* ----------------------------------------------------------------
            Desktop CTA Button (hidden below lg)
        ----------------------------------------------------------------- */}
        <div className="hidden lg:block">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#060606] text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-[#E8D48B] hover:-translate-y-0.5 active:translate-y-0"
          >
            Start a Project
            <ArrowUpRight size={16} strokeWidth={2} />
          </a>
        </div>

        {/* ----------------------------------------------------------------
            Mobile Hamburger (hidden above lg)
        ----------------------------------------------------------------- */}
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="relative z-10 lg:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#1F1F1F] bg-[#0E0E0E] text-[#F5F0E8] transition-colors duration-200 hover:border-[#D4AF37]/30"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X size={20} strokeWidth={1.5} />
          ) : (
            <Menu size={20} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------------
          Mobile Full-screen Overlay (hidden above lg)
      ------------------------------------------------------------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-[#060606]/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              key="mobile-nav"
              variants={mobileNavVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 right-0 w-full sm:w-[380px] bg-[#060606] border-l border-[#1F1F1F] lg:hidden flex flex-col"
            >
              {/* Header area (matches main nav height) */}
              <div className="flex items-center justify-between h-16 md:h-20 px-6 border-b border-[#1F1F1F]">
                <span className="font-heading font-bold text-xl tracking-tight text-[#D4AF37]">
                  G<span className="text-[#F5F0E8]">.</span>V
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-[#1F1F1F] bg-[#0E0E0E] text-[#F5F0E8]"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 flex flex-col justify-center px-8 gap-2">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={(e) => handleNavClick(e, link.id)}
                      variants={mobileLinkVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={i}
                      className={`group flex items-center justify-between py-4 border-b border-[#1F1F1F]/50 transition-colors duration-300 ${
                        isActive
                          ? 'text-[#D4AF37]'
                          : 'text-[#F5F0E8] hover:text-[#D4AF37]'
                      }`}
                    >
                      <span className="font-heading text-3xl md:text-4xl font-semibold tracking-tight">
                        {link.label}
                      </span>
                      <ArrowUpRight
                        size={20}
                        strokeWidth={1.5}
                        className={`transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          isActive ? 'opacity-100 text-[#D4AF37]' : 'opacity-0 group-hover:opacity-60'
                        }`}
                      />
                    </motion.a>
                  );
                })}
              </div>

              {/* Mobile CTA */}
              <div className="px-8 pb-10">
                <motion.a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, 'contact')}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={navLinks.length}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#D4AF37] text-[#060606] font-semibold text-base rounded-full transition-all duration-300 hover:bg-[#E8D48B] active:scale-[0.98]"
                >
                  Start a Project
                  <ArrowUpRight size={18} strokeWidth={2} />
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}