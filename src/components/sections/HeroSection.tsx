"use client";

import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown, MousePointer2 } from 'lucide-react';

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Use narrower ranges for better performance
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -75]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const scale = useTransform(scrollY, [0, 200], [1, 0.95]);

  const y1Value = shouldReduceMotion ? 0 : y1;
  const y2Value = shouldReduceMotion ? 0 : y2;
  const scaleValue = shouldReduceMotion ? 1 : scale;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 1, 
        ease: [0.16, 1, 0.3, 1] as any
      } 
    },
  };

  const fadeUpVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section id="home" className="h-[100vh] flex items-center justify-center relative overflow-hidden bg-brand-black">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.05),transparent_70%)]" />
        <motion.div 
          style={{ y: y1Value, willChange: "transform" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ y: y2Value, willChange: "transform" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[150px]" 
        />
        
        {/* Placeholder for abstract shape */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
          data-placeholder="Hero background image – abstract futuristic gradient or dark fluid shape"
        >
          <div className="w-[80vw] h-[80vh] border border-brand-cyan/10 rounded-full animate-pulse-slow motion-reduce:animate-none" />
        </div>
      </div>

      <motion.div 
        style={{ opacity, scale: scaleValue, willChange: "opacity, transform" }}
        className="container mx-auto px-6 relative z-10 text-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariants} className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-white/5 border border-brand-white/10 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-cyan"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-cyan">Available for high-impact projects</span>
          </motion.div>

          <div className="overflow-hidden mb-6">
            <motion.h1 
              variants={titleVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-white tracking-tighter leading-none"
            >
              GERALD<br className="md:hidden" /> VILLACERAN
            </motion.h1>
          </div>

          <motion.p 
            variants={fadeUpVariants}
            className="text-base md:text-lg text-brand-muted max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            I help businesses scale with <span className="text-brand-white font-bold">high-performance web systems</span> - from concept to revenue.
          </motion.p>

          <motion.div 
            variants={fadeUpVariants}
            className="flex flex-col md:flex-row justify-center items-center gap-6"
          >
            <motion.a 
              href="#projects" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full md:w-auto overflow-hidden bg-brand-cyan text-brand-black px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_0_40px_rgba(0,229,255,0.2)] hover:shadow-[0_0_60px_rgba(0,229,255,0.4)]"
            >
              <span className="relative z-10">VIEW MY WORK</span>
              <motion.div 
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"
              />
            </motion.a>
            <motion.a 
              href="#contact" 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 229, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto border-2 border-brand-teal text-brand-white px-12 py-5 rounded-2xl font-black text-lg backdrop-blur-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>GET IN TOUCH</span>
              <MousePointer2 className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50"
      >
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-muted">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5 text-brand-cyan" />
        </motion.div>
      </motion.div>

      {/* Side Decorative Text */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <span className="rotate-90 block text-[10px] font-bold tracking-[1em] uppercase text-brand-muted/20 origin-right">
          BASED IN PHILIPPINES // GMT+8
        </span>
      </div>
    </section>
  );
};

export default HeroSection;