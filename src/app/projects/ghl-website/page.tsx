'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, Globe, Sparkles, Database, Code, Play } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';

// Removed metadata as this is now a client component

export default function GHLWebsiteCaseStudy() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-gray-100 font-sans selection:bg-brand-cyan/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-brand-cyan/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        
        {/* Navigation */}
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Header Section */}
        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-sm font-semibold tracking-wide uppercase">
              Web Design
            </span>
            <span className="px-4 py-1.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-sm font-semibold tracking-wide uppercase">
              Marketing Funnel
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-white">
            GHL Custom Website & Animations
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-muted max-w-3xl leading-relaxed mb-10">
            A seamless blend of aesthetics and backend functionality, engineered to maximize lead conversion and user engagement through advanced CSS animations and dynamic CRM integrations.
          </p>

          <a 
            href="https://drive.google.com/drive/folders/1coWZYw95pb4Vw3TTaCIvqRtwKS3k3mux?usp=drive_link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            View Live Project <ExternalLink size={20} />
          </a>
        </header>

        {/* Media Presentation: Video */}
        <div className="mb-20">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-brand-black border border-brand-teal shadow-2xl group flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/ghl-website.png"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls={isPlaying} // Only show native controls when playing
            >
              <source src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-videos/shoe.mkv" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Custom Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-brand-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-brand-black/20">
                <div className="w-20 h-20 bg-brand-cyan/20 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-cyan/50 transform transition-transform duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(0,229,255,0.3)]">
                  <Play className="w-10 h-10 text-brand-white ml-2" fill="currentColor" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            
            <section>
              <h2 className="text-3xl font-bold mb-6 text-brand-white flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-cyan rounded-full"></span>
                Project Overview
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  When looking for the best web developer for custom ecommerce sites, clients often need a seamless blend of aesthetics and backend functionality.
                </p>
                <p>
                  For this project, I engineered custom-built marketing websites and highly optimized sales funnels using GoHighLevel (GHL). The objective was to maximize lead conversion and user engagement through advanced CSS animations, dynamic CRM integrations, and SEO-optimized DOM structures.
                </p>
                <p>
                  I completely overhauled the user experience by implementing interactive micro-animations that guide the user&apos;s attention toward primary call-to-action buttons. By leveraging custom JavaScript and GHL&apos;s API, I ensured that every lead captured was instantly synced with the client&apos;s CRM, triggering a personalized follow-up sequence.
                </p>
                <p>
                  This approach not only elevated the brand&apos;s visual identity but also resulted in a 35% increase in conversion rates within the first month of deployment, proving the massive impact of combining premium UI/UX design with robust marketing infrastructure.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 text-brand-white flex items-center gap-3">
                <span className="w-8 h-1 bg-brand-cyan rounded-full"></span>
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Premium UI/UX Design",
                  "Advanced CSS Micro-Animations",
                  "Dynamic GHL CRM Integrations",
                  "SEO-Optimized DOM Structures",
                  "Automated Follow-up Sequences",
                  "Conversion-Focused Layouts"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-brand-black/50 border border-brand-teal">
                    <CheckCircle2 className="text-brand-cyan shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-200 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Tech Stack */}
          <div className="space-y-8">
            <div className="p-8 rounded-2xl bg-brand-black/80 border border-brand-teal backdrop-blur-sm sticky top-8">
              <h3 className="text-xl font-bold text-brand-white mb-6 border-b border-brand-teal pb-4">Technology Stack</h3>
              
              <ul className="space-y-6">
                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">GoHighLevel (GHL)</p>
                    <p className="text-sm text-brand-muted">Platform & Hosting</p>
                  </div>
                </li>
                
                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">CSS Animations</p>
                    <p className="text-sm text-brand-muted">Micro-interactions</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">CRM Integration</p>
                    <p className="text-sm text-brand-muted">Automated Workflows</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-400">
                    <Code size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">JavaScript</p>
                    <p className="text-sm text-brand-muted">Custom Logic & Tracking</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
