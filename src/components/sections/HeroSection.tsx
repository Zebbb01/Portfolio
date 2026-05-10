"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-brand-teal/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-bold mb-6 text-brand-white tracking-tight"
          >
            Gerald Villaceran
          </motion.h1>
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-4 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-gray-200 text-sm md:text-base font-medium tracking-wide">
              Web Developer
            </span>
            <span className="px-4 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-gray-200 text-sm md:text-base font-medium tracking-wide">
              Growth Systems Builder
            </span>
            <span className="px-4 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-gray-200 text-sm md:text-base font-medium tracking-wide">
              AI Prompt Engineer
            </span>
          </motion.div>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-brand-muted mb-10 max-w-3xl mx-auto leading-relaxed">
            I build high-performance websites and automated marketing systems that help businesses 
            scale, capture leads, and streamline operations through structured development and AI-assisted engineering.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12">
            <a href="#projects" className="w-full md:w-auto bg-brand-cyan hover:bg-[#33EBFF] text-brand-black px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transform hover:-translate-y-1">
              View Featured Work
            </a>
            <a href="#contact" className="w-full md:w-auto border border-brand-teal hover:border-brand-cyan text-brand-white px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-brand-cyan/10 backdrop-blur-sm">
              Get In Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-6 h-6 text-brand-muted" />
      </motion.div>
    </section>
  );
};

export default HeroSection;