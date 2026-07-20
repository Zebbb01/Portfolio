// src/components/ui/ImageGallery.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const isVideo = (src: string) =>
  src.toLowerCase().endsWith('.mkv') || src.toLowerCase().endsWith('.mp4');

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isOpen, onClose, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setCurrentIndex(0); setZoomLevel(1); }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose, next, prev]);

  // Scroll thumbnail into view
  useEffect(() => {
    const strip = thumbnailStripRef.current;
    if (!strip) return;
    const thumb = strip.children[currentIndex] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIndex]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && galleryRef.current) {
      galleryRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={galleryRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] flex flex-col bg-[#030303]/98 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* ── Top Bar ─────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-[#F5F0E8] font-heading font-semibold text-xs md:text-sm tracking-[0.12em] uppercase">
                {title}
              </h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] text-[#D4AF37] font-medium tracking-wider">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {!isVideo(images[currentIndex]) && (
                <div className="hidden md:flex items-center gap-0.5 mr-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
                    disabled={zoomLevel <= 1}
                    className="p-2 rounded-lg text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-20 transition-all"
                  >
                    <ZoomOut size={15} strokeWidth={1.5} />
                  </button>
                  <span className="text-[10px] text-[#6B6355] font-mono w-9 text-center select-none">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
                    disabled={zoomLevel >= 3}
                    className="p-2 rounded-lg text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-20 transition-all"
                  >
                    <ZoomIn size={15} strokeWidth={1.5} />
                  </button>
                </div>
              )}
              <button
                onClick={toggleFullscreen}
                className="hidden md:flex p-2 rounded-lg text-[#6B6355] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
              >
                {isFullscreen ? <Minimize2 size={15} strokeWidth={1.5} /> : <Maximize2 size={15} strokeWidth={1.5} />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-[#6B6355] hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/5 transition-all ml-1"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* ── Main Viewport ───────────────────────────────────────── */}
          <div
            className="flex-1 relative flex items-center justify-center min-h-0 px-4 md:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 md:left-5 z-10 p-2.5 rounded-full bg-[#0E0E0E]/70 border border-[#1F1F1F]/50 text-[#6B6355] hover:text-[#D4AF37] hover:border-[#D4AF37]/25 transition-all backdrop-blur-sm"
                >
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 md:right-5 z-10 p-2.5 rounded-full bg-[#0E0E0E]/70 border border-[#1F1F1F]/50 text-[#6B6355] hover:text-[#D4AF37] hover:border-[#D4AF37]/25 transition-all backdrop-blur-sm"
                >
                  <ChevronRight size={20} strokeWidth={1.5} />
                </button>
              </>
            )}

            {/* Image / Video — simple crossfade, no stacking */}
            <div className="relative w-full h-full max-w-6xl max-h-[72vh] rounded-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0"
                >
                  <div
                    className={`w-full h-full ${zoomLevel > 1 ? 'overflow-auto cursor-zoom-out' : 'overflow-hidden cursor-zoom-in'}`}
                    onClick={() => setZoomLevel((z) => (z > 1 ? 1 : Math.min(z + 0.5, 3)))}
                  >
                    <div
                      className="relative w-full h-full transition-transform duration-200 ease-out"
                      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                    >
                      {isVideo(images[currentIndex]) ? (
                        <video
                          src={images[currentIndex]}
                          className="w-full h-full object-contain bg-[#060606]"
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <Image
                          src={images[currentIndex]}
                          alt={`${title} - ${currentIndex + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 1200px"
                          priority
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Thumbnail Filmstrip ─────────────────────────────────── */}
          {images.length > 1 && (
            <div
              className="shrink-0 py-3 md:py-4 px-4 md:px-8 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-xl bg-[#0E0E0E]/60 border border-[#1F1F1F]/40 backdrop-blur-lg overflow-hidden">
                  <div
                    ref={thumbnailStripRef}
                    className="flex items-center gap-1.5 overflow-x-auto px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                          i === currentIndex
                            ? 'ring-2 ring-[#D4AF37] w-16 h-11 md:w-20 md:h-13 opacity-100 scale-105'
                            : 'w-12 h-8 md:w-16 md:h-10 opacity-35 hover:opacity-60'
                        }`}
                      >
                        {isVideo(img) ? (
                          <div className="w-full h-full bg-[#161616] flex items-center justify-center">
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                              <path d="M1 1.5V12.5L11 7L1 1.5Z" fill="#D4AF37" />
                            </svg>
                          </div>
                        ) : (
                          <Image
                            src={img}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
