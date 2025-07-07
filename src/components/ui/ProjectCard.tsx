// src/components/ui/ProjectCard.tsx
import React, { useState } from 'react';
import { Github, ExternalLink, GitBranchPlus, GitForkIcon } from 'lucide-react';
import { Project } from '../../types'; // Ensure this path is correct for your Project type definition

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  // Split description by words and filter out empty strings in case of multiple spaces
  const descriptionWords = project.description.split(' ').filter(word => word.length > 0);
  const shouldTruncate = descriptionWords.length > 20;

  const displayedDescription = showFullDescription
    ? project.description
    : shouldTruncate
    ? descriptionWords.slice(0, 20).join(' ') + '...'
    : project.description;

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 group flex flex-col h-full"> {/* Added h-full here */}
      <h3 className="text-xl font-semibold mb-3 text-blue-400 group-hover:text-purple-400 transition-colors">
        {project.title}
        {project.isFeatured && (
          <span className="ml-2 px-2 py-1 text-xs font-medium text-purple-300 bg-purple-500/20 rounded-full">
            Featured
          </span>
        )}
      </h3>

      {/* Image or Video before description */}
      {project.mediaType === 'image' && project.mediaSrc && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={project.mediaSrc}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {project.mediaType === 'video' && project.mediaSrc && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <video
            src={project.mediaSrc}
            controls
            className="w-full h-48 object-cover"
            preload="none" // Optimizes initial load
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <p className="text-gray-300 mb-4 text-sm leading-relaxed flex-grow">
        {displayedDescription}
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-blue-400 hover:text-blue-300 ml-1 whitespace-nowrap focus:outline-none"
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        )}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tech.map((tech, techIndex) => (
          <span
            key={techIndex}
            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex space-x-4 mt-4">
        <a
          href={project.github}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          target="_blank" // Added for external links
          rel="noopener noreferrer" // Security for target="_blank"
        >
          <GitForkIcon className="w-4 h-4" />
          <span className="text-sm">Code</span>
        </a>
        {/* {project.live && ( // Only render if live link exists
          <a
            href={project.live}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            target="_blank" // Added for external links
            rel="noopener noreferrer" // Security for target="_blank"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Live Demo</span>
          </a>
        )} */}
      </div>
    </div>
  );
};

export default ProjectCard;