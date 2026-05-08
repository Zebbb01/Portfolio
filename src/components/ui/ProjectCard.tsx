// src/components/ui/ProjectCard.tsx
import React, { useState } from 'react';
import { Github, ExternalLink, GitForkIcon, ArrowUpRight } from 'lucide-react';
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

  const displayedDescription = showFullDescription
    ? project.description
    : shouldTruncate
    ? descriptionWords.slice(0, 25).join(' ') + '...'
    : project.description;

  const detailsHref = project.detailsUrl || project.live;
  const isInternalLink = detailsHref?.startsWith('/');

  const ImageContainer = (
    <div className="mb-6 relative aspect-video rounded-xl overflow-hidden bg-gray-800/50 border border-gray-700/30 group/image">
      {project.mediaSrc && (
        <Image
          src={project.mediaSrc}
          alt={project.title}
          className="object-cover transition-transform duration-700 group-hover/image:scale-110"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500 flex items-end p-4">
        <span className="text-sm text-blue-300 font-bold flex items-center gap-1 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
          {isInternalLink ? 'View Case Study' : 'View Details'} <ArrowUpRight size={16} />
        </span>
      </div>
    </div>
  );

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight">
            {project.title}
          </h3>
          {project.isFeatured && (
            <span className="flex-shrink-0 px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full">
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
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            {displayedDescription}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-400 hover:text-blue-300 ml-1 font-medium transition-colors"
              >
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>

        <div className="mt-auto space-y-6">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2.5 py-1 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg text-[11px] font-medium group-hover:border-blue-500/30 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-800/50">
            {project.github !== '#' && (
              <a
                href={project.github}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 group/link"
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
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all duration-300 group/link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                <span className="text-sm font-bold tracking-wide">View Project</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;