"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isOpen, onClose, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset zoom when changing images
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-brand-black/95 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Close Button */}
          <div className="absolute top-6 right-6 z-[1000] flex items-center space-x-4">
            {/* Zoom Controls (Images only) */}
            {!images[currentIndex].toLowerCase().endsWith('.mkv') && !images[currentIndex].toLowerCase().endsWith('.mp4') && (
              <div className="flex items-center space-x-2 bg-brand-white/10 border border-brand-white/20 rounded-full p-1">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel === 1}
                  className="p-2 rounded-full hover:bg-brand-white/10 text-brand-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={resetZoom}
                  disabled={zoomLevel === 1}
                  className="p-2 rounded-full hover:bg-brand-white/10 text-brand-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel === 3}
                  className="p-2 rounded-full hover:bg-brand-white/10 text-brand-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-3 rounded-full bg-brand-white/10 border border-brand-white/20 text-brand-white hover:bg-brand-cyan hover:text-brand-black transition-all group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          {/* Title */}
          <div className="absolute top-8 left-8 z-[1000] hidden md:block">
            <h3 className="text-brand-white font-black uppercase tracking-[0.3em] text-sm italic">{title}</h3>
            <p className="text-brand-cyan text-xs font-bold mt-1">
              {images[currentIndex].toLowerCase().endsWith('.mkv') || images[currentIndex].toLowerCase().endsWith('.mp4') ? 'Video' : 'Image'} {currentIndex + 1} of {images.length}
            </p>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-6 z-[1000] p-4 rounded-full bg-brand-white/5 border border-brand-white/10 text-brand-white hover:border-brand-cyan hover:text-brand-cyan transition-all hidden md:block"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-6 z-[1000] p-4 rounded-full bg-brand-white/5 border border-brand-white/10 text-brand-white hover:border-brand-cyan hover:text-brand-cyan transition-all hidden md:block"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Main Content (Image or Video) */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring" as const, damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-brand-cyan/20 border border-brand-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={`w-full h-full ${zoomLevel > 1 ? 'overflow-auto cursor-zoom-out' : 'overflow-hidden cursor-zoom-in'}`}
              onClick={(e) => zoomLevel > 1 ? resetZoom(e) : handleZoomIn(e)}
            >
              <div 
                className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
                style={{ 
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  minWidth: '100%',
                  minHeight: '100%'
                }}
              >
                {images[currentIndex].toLowerCase().endsWith('.mkv') || images[currentIndex].toLowerCase().endsWith('.mp4') ? (
                  <video
                    src={images[currentIndex]}
                    className="w-full h-full object-contain bg-black"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={images[currentIndex]}
                    alt={`${title} screenshot ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    priority
                    onError={(e) => {
                      // Fallback for 404 images
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/1200x800/101010/00E5FF?text=Preview+Coming+Soon";
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Mobile Navigation */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 md:hidden">
            <button
              onClick={prevImage}
              className="p-4 rounded-full bg-brand-white/10 text-brand-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="p-4 rounded-full bg-brand-white/10 text-brand-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
