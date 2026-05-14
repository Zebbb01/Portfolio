"use client";

import React from 'react';
import { contactInfo } from '../../data/portfolioData';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import Link from 'next/link';

const Footer = () => {


  return (
    <footer className="pt-24 pb-12 relative overflow-hidden bg-brand-black border-t border-brand-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-24 text-center md:text-left border-b border-brand-white/10 pb-12">
          <div className="mb-8 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-black text-brand-white tracking-tighter mb-4 italic uppercase">
              Let's create<br />the <span className="text-brand-cyan">future</span>.
            </h2>
            <p className="text-brand-muted font-bold tracking-widest uppercase text-xs">
              Open for world-wide collaborations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-brand-white/10 pb-24 mb-12 text-center md:text-left">
          <div>
            <div className="text-brand-muted text-[10px] font-black uppercase tracking-[0.4em] mb-6">Navigation</div>
            <div className="flex flex-col items-center md:items-start space-y-4">
              {['Home', 'About', 'Expertise', 'Projects', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-brand-white font-bold hover:text-brand-cyan transition-colors uppercase tracking-widest text-xs">
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-brand-muted text-[10px] font-black uppercase tracking-[0.4em] mb-6">Socials</div>
            <div className="flex flex-col items-center md:items-start space-y-4">
              {contactInfo.socials.map((social) => (
                <a key={social.name} href={social.href} className="text-brand-white font-bold hover:text-brand-cyan transition-colors uppercase tracking-widest text-xs flex items-center space-x-2">
                  <social.icon size={14} />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-brand-muted text-[10px] font-black uppercase tracking-[0.4em] mb-6">Legal</div>
            <div className="flex flex-col items-center md:items-start space-y-4">
              <Link href="/privacy" className="text-brand-white font-bold hover:text-brand-cyan transition-colors uppercase tracking-widest text-xs">Privacy Policy</Link>
              <Link href="/terms" className="text-brand-white font-bold hover:text-brand-cyan transition-colors uppercase tracking-widest text-xs">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:justify-between text-brand-muted space-y-4 md:space-y-0">
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase">
            © 2026 GERALD VILLACERAN. ALL RIGHTS RESERVED.
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase flex items-center space-x-2">
            <span>Built with</span>
            <span className="text-brand-cyan">Next.js 16</span>
            <span>+</span>
            <span className="text-brand-teal">Framer Motion</span>
          </div>
        </div>
      </div>
      
      {/* Huge background text */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 text-[15rem] md:text-[25rem] font-black text-brand-white/5 select-none pointer-events-none whitespace-nowrap uppercase tracking-tighter italic">
        RELIABLE
      </div>
    </footer>
  );
};

export default Footer;