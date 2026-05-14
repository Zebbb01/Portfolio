"use client";

import React, { useRef, useState, useMemo, memo } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { projects, projectScreenshots } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import { ExternalLink, Github, ArrowUpRight, Code2, ChevronDown, ChevronUp, Play, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageGallery } from '../ui/ImageGallery';



const ProjectCard = memo(({ 
  project, 
  index, 
  onViewDemo 
}: { 
  project: any, 
  index: number, 
  onViewDemo: (project: any) => void 
}) => {
  const shouldReduceMotion = useReducedMotion();
  const container = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const cardScale = shouldReduceMotion ? 1 : scale;
  
  const truncatedDescription = project.description.slice(0, 120) + (project.description.length > 120 ? '...' : '');

  return (
    <div ref={container} className="relative h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <motion.div 
        style={{ scale: cardScale, willChange: "transform" }}
        className="w-full max-w-6xl h-[85vh] md:h-[80vh] bg-brand-black/40 backdrop-blur-3xl border border-brand-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative flex flex-col lg:flex-row group shadow-2xl"
      >
        {/* Project Media (Image or Video) */}
        <div className="lg:w-3/5 h-1/3 lg:h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-cyan/10 group-hover:bg-transparent transition-colors z-10" />
          
          {project.mediaType === 'video' ? (
            <video
              src={project.mediaSrc}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : (
            <Image
              src={project.mediaSrc}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={index === 0}
            />
          )}

          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-20 flex flex-wrap gap-2">
             {project.tech.map((t: string) => (
                <span key={t} className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-brand-black/80 border border-brand-white/10 text-[8px] md:text-[10px] font-bold text-brand-white uppercase tracking-widest backdrop-blur-md">
                  {t}
                </span>
             ))}
          </div>

          {/* Hover Play Button Visual */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={() => onViewDemo(project)}
              className="w-20 h-20 rounded-full bg-brand-cyan/20 backdrop-blur-md border border-brand-cyan/50 flex items-center justify-center text-brand-cyan hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,229,255,0.3)]"
            >
              <Play className="w-8 h-8 fill-brand-cyan" />
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="lg:w-2/5 p-6 md:p-12 flex flex-col justify-between relative bg-gradient-to-br from-brand-white/5 to-transparent overflow-y-auto scrollbar-hide">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-brand-cyan mb-4">
              <Code2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Project {index + 1}</span>
            </div>
            <h3 className="text-2xl md:text-5xl font-black text-brand-white mb-4 md:mb-6 leading-tight group-hover:text-brand-cyan transition-colors">
              {project.title}
            </h3>
            
            <div className="relative mb-6 md:mb-8">
              <div className="p-4 md:p-6 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 mb-6 group/impact">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan mb-2">Business Impact</div>
                <p className="text-brand-white text-xs md:text-sm font-bold leading-tight">
                  {project.impact}
                </p>
              </div>
              <p className="text-brand-muted text-xs md:text-base leading-relaxed">
                {isExpanded ? project.description : truncatedDescription}
              </p>
              {project.description.length > 120 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-brand-cyan text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Read More <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-3 md:space-y-4 relative z-10">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => onViewDemo(project)}
                className="flex items-center space-x-2 text-brand-white hover:text-brand-cyan transition-colors group/link"
              >
                <span className="font-bold text-xs md:text-sm">Explore Gallery</span>
                <ExternalLink className="w-3 h-3 md:w-4 md:h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
              </button>
              {project.live && project.live !== "" && project.live !== "#" && (
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-brand-white hover:text-brand-cyan transition-colors group/link"
                >
                  <span className="font-bold text-xs md:text-sm">Live Demo</span>
                  <Globe className="w-3 h-3 md:w-4 md:h-4" />
                </a>
              )}
              {project.github !== "#" && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-brand-white hover:text-brand-cyan transition-colors group/link"
                >
                  <span className="font-bold text-xs md:text-sm">Source Code</span>
                  <Github className="w-3 h-3 md:w-4 md:h-4" />
                </a>
              )}
            </div>
            
            <Link 
              href={project.detailsUrl} 
              className="inline-flex items-center justify-between w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-brand-white/5 border border-brand-white/10 hover:bg-brand-cyan hover:text-brand-black transition-all group/btn"
            >
              <span className="font-black text-[10px] md:text-xs uppercase tracking-widest">View Case Study</span>
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
        
        {/* Large Index Number Background */}
        <div className="absolute top-0 right-0 text-[10rem] md:text-[20rem] font-black text-brand-white/5 select-none pointer-events-none translate-x-1/4 -translate-y-1/4">
          {index + 1}
        </div>
      </motion.div>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleViewDemo = (project: any) => {
    setSelectedProject(project);
    setIsGalleryOpen(true);
  };

  return (
    <section id="projects" className="relative bg-brand-black pb-24 overflow-hidden">
      {/* Background blobs for depth */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" as const }}
        className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
        className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-[150px] pointer-events-none"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/[0.02] rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="pt-24 md:pt-32">
          <SectionHeading 
            number="03"
            subtitle="Selected Works"
            title="Digital Products & Systems"
            align="left"
          />
        </div>
        
        <div className="relative min-h-screen">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index}
              onViewDemo={handleViewDemo}
            />
          ))}
        </div>
      </div>
      
      {/* Visual connection to next section */}
      <div className="h-screen flex items-center justify-center text-center px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h4 className="text-3xl md:text-5xl font-bold text-brand-white mb-8 italic tracking-tight">Ready to accelerate your business?</h4>
          <Link href="/#contact" className="inline-flex items-center space-x-4 group">
             <span className="text-brand-cyan text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-brand-cyan pb-2 transition-all group-hover:tracking-[0.2em]">Let's talk</span>
             <div className="w-12 h-12 rounded-full border-2 border-brand-cyan flex items-center justify-center group-hover:bg-brand-cyan transition-all">
                <ArrowUpRight className="w-6 h-6 text-brand-cyan group-hover:text-brand-black transition-transform group-hover:rotate-45" />
             </div>
          </Link>
        </motion.div>
      </div>

      {/* Image Gallery Modal */}
      {selectedProject && (
        <ImageGallery 
          images={projectScreenshots[selectedProject.title] || []}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          title={selectedProject.title}
        />
      )}
    </section>
  );
};

export default ProjectsSection;