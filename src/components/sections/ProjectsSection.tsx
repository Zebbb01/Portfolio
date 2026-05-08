// src/components/sections/ProjectsSection.tsx
'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { projects } from '../../data/portfolioData';
import ProjectCard from '../ui/ProjectCard';
import { ChevronLeft, ChevronRight, X, Grid, List, Play } from 'lucide-react';
import type { Project } from '../../types';
import Image from 'next/image';

// Ultra-lightweight video placeholder that doesn't load anything
const VideoPlaceholder = React.memo(({
  title,
  className,
  onClick
}: {
  title: string;
  className: string;
  onClick: () => void;
}) => {
  return (
    <div
      className={`${className} bg-gradient-to-br from-gray-700 to-gray-800 cursor-pointer group relative overflow-hidden rounded-lg border border-gray-600/30`}
      onClick={onClick}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
        }} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 group-hover:scale-105 transition-transform duration-200">
        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200 backdrop-blur-sm border border-blue-400/20">
          <Play className="w-8 h-8 text-blue-400 ml-1" />
        </div>
        <div className="text-center px-4">
          <p className="text-white font-medium text-sm mb-1">Video Preview</p>
          <p className="text-gray-400 text-xs line-clamp-1">{title}</p>
        </div>
        <div className="text-xs text-gray-500 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
          Click to load & play
        </div>
      </div>
    </div>
  );
});

VideoPlaceholder.displayName = 'VideoPlaceholder';

// Actual video component that only renders when activated
const LazyVideo = React.memo(({
  src,
  className,
  onClose
}: {
  src: string;
  className: string;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    // Auto-play when loaded
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore play errors (common on mobile)
      });
    }
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    // Cleanup when component unmounts
    return () => {
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, []);

  if (hasError) {
    return (
      <div className={`${className} bg-red-900/20 border border-red-500/30 rounded-lg flex items-center justify-center`}>
        <div className="text-center p-4">
          <X className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">Failed to load video</p>
          <button
            onClick={onClose}
            className="text-gray-400 text-xs mt-1 hover:text-white transition-colors"
          >
            Click to close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative rounded-lg overflow-hidden`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-400 border-t-transparent"></div>
            <p className="text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        className={className}
        controls
        muted
        playsInline
        preload="metadata"
        onLoadedData={handleLoadedData}
        onError={handleError}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 z-20 backdrop-blur-sm"
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
});

LazyVideo.displayName = 'LazyVideo';

// Optimized project item for modal list view
const ModalProjectItem = React.memo(({
  project,
  index,
  isVisible = true
}: {
  project: Project;
  index: number;
  isVisible?: boolean;
}) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleVideoClick = useCallback((videoSrc: string) => {
    setActiveVideo(videoSrc);
  }, []);

  const handleVideoClose = useCallback(() => {
    setActiveVideo(null);
  }, []);

  // Return skeleton if not visible
  if (!isVisible) {
    return (
      <div className="h-48 bg-gray-800/30 rounded-xl animate-pulse border border-gray-700/30">
        <div className="flex h-full p-6 gap-6">
          <div className="w-48 h-32 bg-gray-700/50 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/30 rounded w-full"></div>
            <div className="h-4 bg-gray-700/30 rounded w-5/6"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-700/30 rounded-full"></div>
              <div className="h-6 w-12 bg-gray-700/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Project Media */}
        {project.mediaSrc && (
          <div className="md:w-48 flex-shrink-0">
            {activeVideo === project.mediaSrc ? (
              <LazyVideo
                src={project.mediaSrc}
                className="w-full h-32 md:h-24 object-cover"
                onClose={handleVideoClose}
              />
            ) : project.mediaType === 'image' ? (
              <div className="relative overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={project.mediaSrc}
                  alt={project.title}
                  width={192} // 192px is 48 * 4, adjust as needed
                  height={96} // 96px is 24 * 4, adjust as needed
                  className="w-full h-32 md:h-24 object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,..." // You would generate this
                />
              </div>
            ) : (
              <VideoPlaceholder
                title={project.title}
                className="w-full h-32 md:h-24"
                onClick={() => handleVideoClick(project.mediaSrc)}
              />
            )}
          </div>
        )}

        {/* Project Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xl font-semibold text-blue-400 truncate">
              {project.title}
            </h4>
            {project.isFeatured && (
              <span className="px-2 py-1 text-xs font-medium text-purple-300 bg-purple-500/20 rounded-full flex-shrink-0">
                Featured
              </span>
            )}
          </div>
          <p className="text-gray-300 text-sm mb-3 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tech.slice(0, 5).map((tech: string, techIndex: number) => (
              <span
                key={`${index}-${techIndex}`}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 5 && (
              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                +{project.tech.length - 5}
              </span>
            )}
          </div>
          <div className="flex space-x-4">
            <a
              href={project.github}
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code
            </a>
            {project.live && project.live !== '#' && (
              <a
                href={project.live}
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ModalProjectItem.displayName = 'ModalProjectItem';

// Optimized Modal with virtual scrolling and no video pre-loading
const ProjectModal = React.memo(({
  isOpen,
  onClose,
  projects: modalProjects,
  featuredCount
}: {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  featuredCount: number;
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list for better performance
  const [isAnimating, setIsAnimating] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 200;
  const OVERSCAN = 5; // Number of items to render outside viewport

  // Virtual scrolling optimization
  useEffect(() => {
    if (!isOpen || viewMode !== 'list') return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
      const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);
      const endIndex = Math.min(modalProjects.length - 1, startIndex + visibleCount + OVERSCAN * 2);

      setVisibleRange({ start: startIndex, end: endIndex });
    };

    const container = scrollContainerRef.current;
    if (container) {
      handleScroll(); // Initial calculation
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen, viewMode, modalProjects.length]);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);

  const handleClose = useCallback(() => {
    setIsAnimating(true);

    // Force cleanup of any active videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.pause();
      video.src = '';
      video.load();
    });

    setTimeout(() => {
      onClose();
      setIsAnimating(false);
      setVisibleRange({ start: 0, end: 10 }); // Reset range
    }, 200);
  }, [onClose]);

  // Handle escape key and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-7xl max-h-[90vh] bg-gradient-to-br from-gray-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-gray-700/50 flex flex-col transition-all duration-200 transform ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-900/50">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All Projects ({modalProjects.length})
            </h3>
            <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg p-1">
              <button
                onClick={toggleViewMode}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid'
                    ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-300'
                  }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={toggleViewMode}
                className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'list'
                    ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:text-gray-300'
                  }`}
                title="List View (Recommended)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500 bg-gray-800/30 px-2 py-1 rounded-full">
              List view recommended for performance
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {modalProjects.map((project: Project, index: number) => (
                <div key={`modal-grid-${index}`} className="transform transition-all duration-200 hover:scale-[1.02]">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative"
              style={{ height: modalProjects.length * ITEM_HEIGHT }}
            >
              <div className="p-6 space-y-4">
                {modalProjects.map((project: Project, index: number) => {
                  const isVisible = index >= visibleRange.start && index <= visibleRange.end;
                  return (
                    <ModalProjectItem
                      key={`modal-list-${index}`}
                      project={project}
                      index={index}
                      isVisible={isVisible}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-900/30">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {modalProjects.length} projects total • {featuredCount} featured
              {viewMode === 'list' && (
                <span className="ml-2 text-green-400">• Optimized view active</span>
              )}
            </p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectModal.displayName = 'ProjectModal';

const ProjectsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showAllModal, setShowAllModal] = useState<boolean>(false);

  const projectsPerPage: number = 6;

  // Memoized calculations
  const { featuredProjects, displayProjects, totalPages, currentProjects } = useMemo(() => {
    const featured: Project[] = projects.filter((project: Project) => project.isFeatured);
    const display: Project[] = featured.length > 0 ? featured : projects;
    const pages: number = Math.ceil(display.length / projectsPerPage);

    const startIndex: number = currentPage * projectsPerPage;
    const current: Project[] = display.slice(startIndex, startIndex + projectsPerPage);

    return {
      featuredProjects: featured,
      displayProjects: display,
      totalPages: pages,
      currentProjects: current
    };
  }, [currentPage, projectsPerPage]);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const openModal = useCallback(() => {
    setShowAllModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowAllModal(false);
  }, []);

  const startIndex: number = currentPage * projectsPerPage;
  const endIndex: number = Math.min(startIndex + projectsPerPage, displayProjects.length);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>

        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            Showing {startIndex + 1}-{endIndex} of {displayProjects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {currentProjects.map((project: Project, index: number) => (
            <div
              key={`page-${currentPage}-${index}`}
              className="transform transition-all duration-300 hover:scale-[1.02] will-change-transform h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={goToPrevPage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${currentPage === 0
                  ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/40 hover:to-purple-500/40 text-white hover:shadow-lg'
                }`}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i: number) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 transform hover:scale-125 ${currentPage === i
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-lg'
                        : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-medium">
                {currentPage + 1} / {totalPages}
              </span>
            </div>

            <button
              onClick={goToNextPage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${currentPage === totalPages - 1
                  ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:from-blue-500/40 hover:to-purple-500/40 text-white hover:shadow-lg'
                }`}
              disabled={currentPage === totalPages - 1}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View All Projects Button */}
        {featuredProjects.length > 0 && featuredProjects.length < projects.length && (
          <div className="text-center mt-8">
            <button
              onClick={openModal}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 font-semibold hover:shadow-xl"
            >
              <Grid className="w-4 h-4" />
              <span>View All Projects ({projects.length})</span>
            </button>
          </div>
        )}

        {/* Modal */}
        <ProjectModal
          isOpen={showAllModal}
          onClose={closeModal}
          projects={projects}
          featuredCount={featuredProjects.length}
        />
      </div>
    </section>
  );
};

export default ProjectsSection;