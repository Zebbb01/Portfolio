// src/components/ui/ProjectCard.tsx
import React, { useState } from 'react';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const descriptionWords = project.description.split(' ').filter(word => word.length > 0);
  const shouldTruncate = descriptionWords.length > 25;

  const detailsHref = project.detailsUrl || project.live;
  const isInternalLink = detailsHref?.startsWith('/');

  const ImageContainer = (
    <div className="mb-6 relative aspect-video rounded-xl overflow-hidden bg-brand-teal/20/50 border border-brand-teal/30 group/image">
      {project.mediaSrc && (
        <Image
          src={project.mediaSrc}
          alt={project.title}
          className="object-cover transition-transform duration-700 group-hover/image:scale-110"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <span className="text-sm text-brand-cyan font-bold flex items-center gap-1 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
          {isInternalLink ? 'View Case Study' : 'View Details'} <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );

  return (
    <div className="group relative bg-gradient-to-br from-brand-teal/40/40 to-brand-black/60 backdrop-blur-md rounded-2xl p-6 border border-brand-teal/50 hover:border-brand-cyan/50 transition-all duration-500 flex flex-col hover:shadow-2xl hover:shadow-brand-cyan/10 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-cyan/10 rounded-full blur-[80px] group-hover:bg-brand-cyan/20 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4 min-h-[4rem]">
          <h3 className="text-xl font-bold text-brand-white group-hover:text-brand-cyan transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          {project.isFeatured && (
            <span className="flex-shrink-0 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-purple-300 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full">
              Featured
            </span>
          )}
        </div>

        {detailsHref && detailsHref !== '#' ? (
          <Link href={detailsHref} target={isInternalLink ? '_self' : '_blank'} rel={isInternalLink ? '' : 'noopener noreferrer'}>
            {ImageContainer}
          </Link>
        ) : (
          ImageContainer
        )}

        <div className="flex-grow">
          <div className="relative mb-6">
            <p className={`text-brand-muted text-sm leading-relaxed ${!showFullDescription && shouldTruncate ? 'line-clamp-4' : ''}`}>
              {project.description}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-brand-cyan hover:text-brand-cyan font-medium transition-colors mt-2 text-sm inline-block"
              >
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex flex-wrap content-start gap-2 min-h-[3.5rem]">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2.5 py-1 bg-brand-teal/20/50 border border-brand-teal/50 text-brand-muted rounded-lg text-[11px] font-medium group-hover:border-brand-cyan/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-brand-teal/50">
            {project.github !== '#' && (
              <a
                href={project.github}
                className="flex items-center gap-2 text-brand-muted hover:text-brand-white transition-all duration-300 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4 group-hover/link:rotate-12 transition-transform" />
                <span className="text-sm font-semibold">Source</span>
              </a>
            )}
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                className="flex items-center gap-2 text-brand-cyan hover:text-brand-cyan transition-all duration-300 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                <span className="text-sm font-bold tracking-wide">View Case Study</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;