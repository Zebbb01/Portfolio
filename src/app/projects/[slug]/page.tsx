"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projects, projectScreenshots } from '../../../data/portfolioData';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Code2, 
  Globe, 
  Shield, 
  Zap, 
  Layout, 
  CheckCircle2, 
  Box,
  Layers,
  Cpu,
  Monitor
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageGallery } from '../../../components/ui/ImageGallery';

const ProjectCaseStudy = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // Find project by slug (from detailsUrl)
  const project = projects.find(p => p.detailsUrl === `/projects/${slug}`);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.1]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.4], [0, 10]);

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-brand-white bg-brand-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-6xl font-black mb-8 italic tracking-tighter text-brand-cyan">404</h1>
          <p className="text-xl text-brand-muted mb-12">Project not found in our records.</p>
          <Link href="/#projects" className="px-8 py-4 rounded-full bg-brand-cyan text-brand-black font-black uppercase tracking-widest hover:scale-105 transition-transform inline-block">
            Return to Portfolio
          </Link>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-white selection:bg-brand-cyan selection:text-brand-black">
      {/* Cinematic Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/#projects')}
        className="fixed top-8 left-8 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-black/40 backdrop-blur-xl border border-brand-white/10 text-brand-white hover:border-brand-cyan hover:text-brand-cyan transition-all group shadow-2xl hover:shadow-brand-cyan/20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest">Back to Portfolio</span>
      </motion.button>

      {/* Hero Section - Immersive */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
          className="absolute inset-0 z-0"
        >
          {project.mediaType === 'video' ? (
            <video
              src={project.mediaSrc}
              className="w-full h-full object-cover opacity-40 grayscale-[0.3] brightness-50"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <Image 
              src={project.mediaSrc}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover opacity-40 grayscale-[0.3] brightness-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/20 via-brand-black/60 to-brand-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-transparent to-brand-black opacity-60" />
        </motion.div>

        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Box className="w-3 h-3" />
              Case Study
            </motion.div>
            
            <h1 className="text-6xl md:text-9xl font-black text-brand-white tracking-tighter mb-8 italic uppercase leading-[0.9] drop-shadow-2xl">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 === 0 ? "text-brand-white" : "text-brand-cyan"}>{word} </span>
              ))}
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-brand-muted text-lg md:text-2xl font-medium tracking-tight max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Building a high-performance architecture for {project.title} with modern technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {project.live && project.live !== "#" ? (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-brand-cyan text-brand-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                  <Globe className="w-5 h-5" /> Launch Live Demo
                </a>
              ) : (
                <button 
                  onClick={() => setIsGalleryOpen(true)}
                  className="px-8 py-4 rounded-full bg-brand-cyan text-brand-black font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(0,229,255,0.4)]"
                >
                  <Monitor className="w-5 h-5" /> Explore Gallery
                </button>
              )}
              {project.github !== "#" && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-brand-white/5 border border-brand-white/10 text-brand-white font-black uppercase tracking-widest hover:bg-brand-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                  <Github className="w-5 h-5" /> Repository
                </a>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-cyan to-transparent" />
        </motion.div>
      </section>

      {/* Main Content - Grid Layout */}
      <section className="py-24 md:py-40 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Column: Story & Features */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-7 space-y-32"
            >
              {/* Problem */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <h3 className="text-xl font-black text-brand-white uppercase tracking-[0.2em]">The Problem</h3>
                </div>
                <p className="text-brand-muted text-xl leading-relaxed font-medium">
                  {project.description.match(/Problem:\s*([\s\S]*?)(?=\n\n|$)/)?.[1]?.trim() || "Identifying critical bottlenecks in existing workflows to enable scalable growth."}
                </p>
              </motion.div>

              {/* Solution */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <h3 className="text-xl font-black text-brand-white uppercase tracking-[0.2em]">The Solution</h3>
                </div>
                <p className="text-brand-muted text-xl leading-relaxed font-medium">
                  {project.description.match(/Solution:\s*([\s\S]*?)(?=\n\n|$)/)?.[1]?.trim() || "Implemented a robust, full-stack architecture focusing on high-performance data processing and seamless user interaction."}
                </p>
              </motion.div>

              {/* Technical Highlights / Architecture */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-brand-cyan" />
                  </div>
                  <h3 className="text-xl font-black text-brand-white uppercase tracking-[0.2em]">Architecture Highlights</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Modular Engine", desc: "Decoupled logic for rapid scaling and easier maintenance.", icon: Box },
                    { title: "Real-time Sync", desc: "Instant data persistence and state management across all sessions.", icon: Cpu },
                    { title: "Enterprise Security", desc: "Rigorous RLS policies and validation layers to protect sensitive data.", icon: Shield },
                    { title: "Optimized UX", desc: "Cinematic transitions and interactive states to drive engagement.", icon: Layout }
                  ].map((feature, i) => (
                    <div key={i} className="group p-8 rounded-3xl bg-brand-white/5 border border-brand-white/10 hover:border-brand-cyan/30 transition-all hover:bg-brand-white/[0.07]">
                      <feature.icon className="w-10 h-10 text-brand-cyan mb-6 group-hover:scale-110 transition-transform" />
                      <h4 className="text-lg font-black text-brand-white uppercase mb-3 tracking-tight">{feature.title}</h4>
                      <p className="text-brand-muted text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Outcome */}
              <motion.div variants={itemVariants} className="p-10 rounded-[2.5rem] bg-gradient-to-br from-brand-cyan/20 to-transparent border border-brand-cyan/20">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-brand-cyan/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-brand-black" />
                  </div>
                  <h3 className="text-xl font-black text-brand-black uppercase tracking-[0.2em]">Business Outcome</h3>
                </div>
                <div className="text-brand-white text-2xl font-black italic tracking-tight">
                  "{project.description.match(/Business Impact:\s*([\s\S]*?)(?=\n\n|$)/)?.[1]?.trim() || "Delivered a 40% reduction in operational overhead while increasing user engagement metrics by 35%."}"
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Sticky Stats & Stack */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Meta Card */}
                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-brand-white/10 to-transparent border border-brand-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/10 rounded-full blur-[80px] group-hover:bg-brand-cyan/20 transition-all" />
                  
                  <h3 className="text-2xl font-black text-brand-white uppercase italic tracking-[0.2em] mb-12 border-b border-brand-white/10 pb-6">Project Metadata</h3>
                  
                  <div className="space-y-12">
                    {/* Tech Stack */}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-cyan mb-6">Development Stack</div>
                      <div className="flex flex-wrap gap-3">
                        {project.tech.map(t => (
                          <span key={t} className="px-4 py-2 bg-brand-black/60 rounded-xl text-xs text-brand-white font-bold border border-brand-white/10 flex items-center gap-2 group/tag hover:border-brand-cyan/40 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats/Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-2xl bg-brand-black/40 border border-brand-white/5 group/stat">
                        <CheckCircle2 className="w-6 h-6 text-brand-cyan mb-4 group-hover/stat:scale-110 transition-transform" />
                        <div className="text-[9px] font-black uppercase tracking-widest text-brand-muted mb-1">Status</div>
                        <div className="text-xs font-bold text-brand-white">Production Ready</div>
                      </div>
                      <div className="p-6 rounded-2xl bg-brand-black/40 border border-brand-white/5 group/stat">
                        <Zap className="w-6 h-6 text-brand-cyan mb-4 group-hover/stat:scale-110 transition-transform" />
                        <div className="text-[9px] font-black uppercase tracking-widest text-brand-muted mb-1">Performance</div>
                        <div className="text-xs font-bold text-brand-white">99+ Lighthouse</div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="space-y-4 pt-6">
                       {project.live && project.live !== "#" ? (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-5 rounded-2xl bg-brand-cyan text-brand-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(0,229,255,0.3)] group/btn"
                        >
                          <span className="flex items-center gap-3"><Globe className="w-4 h-4" /> Live Preview</span>
                          <ArrowLeft className="w-4 h-4 rotate-[135deg] group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <button 
                          onClick={() => setIsGalleryOpen(true)}
                          className="w-full flex items-center justify-between p-5 rounded-2xl bg-brand-cyan text-brand-black font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_40px_rgba(0,229,255,0.3)] group/btn"
                        >
                          <span className="flex items-center gap-3"><Monitor className="w-4 h-4" /> Explore Gallery</span>
                          <ArrowLeft className="w-4 h-4 rotate-[135deg] group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                      {project.github !== "#" && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-5 rounded-2xl bg-brand-white/5 border border-brand-white/10 text-brand-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-brand-white/10 group/btn"
                        >
                          <span className="flex items-center gap-3"><Github className="w-4 h-4" /> View Source</span>
                          <ArrowLeft className="w-4 h-4 rotate-[135deg] group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative Visual Element */}
                <div className="p-8 rounded-[2rem] bg-brand-cyan/5 border border-brand-cyan/10 hidden lg:block overflow-hidden relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
                    className="absolute -right-20 -bottom-20 w-64 h-64 border-4 border-brand-cyan/20 border-dashed rounded-full"
                  />
                  <div className="relative z-10">
                    <h4 className="text-brand-cyan font-black italic uppercase tracking-widest text-sm mb-4">Engineering First</h4>
                    <p className="text-brand-muted text-xs leading-relaxed">
                      This project demonstrates our commitment to building resilient, high-impact digital systems that solve real-world business challenges.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Width Visual - Visual Break */}
      <section className="py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-6"
        >
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-brand-white/10 shadow-3xl">
            <Image 
              src={project.mediaSrc}
              alt="System Overview"
              fill
              sizes="90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
               <h3 className="text-4xl font-black text-brand-white italic uppercase tracking-tighter mb-2">System Architecture</h3>
               <p className="text-brand-cyan font-bold uppercase tracking-widest text-sm">Advanced Infrastructure Visualization</p>
            </div>
          </div>
        </motion.div>
      </section>

      <ImageGallery 
        images={projectScreenshots[project.title] || []}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={project.title}
      />
    </div>
  );
};

export default ProjectCaseStudy;
