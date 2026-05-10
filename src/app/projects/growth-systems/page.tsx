'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, Zap, Workflow, Server, Table, Play } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';

// Removed metadata as this is now a client component

export default function GrowthSystemsCaseStudy() {
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
              Automation
            </span>
            <span className="px-4 py-1.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-sm font-semibold tracking-wide uppercase">
              API Integration
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-brand-white">
            Growth Systems & Workflow Automation
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-muted max-w-3xl leading-relaxed mb-10">
            End-to-end automation systems designed to completely eliminate manual data entry, streamline financial operations, and bridge the gap between disconnected software silos.
          </p>

          <a 
            href="https://drive.google.com/drive/folders/15apEURviJiMWK-FJGsWkkPnysu8Fw02f?usp=sharing" 
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
              poster="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/automation.png"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              controls={isPlaying} // Only show native controls when playing
            >
              <source src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-videos/automation-2.mkv" type="video/mp4" />
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
                  To achieve massive scale, businesses require flawless marketing automation integration. I developed end-to-end automation systems designed to completely eliminate manual data entry, streamline financial operations, and bridge the gap between disconnected software silos.
                </p>
                <p>
                  Leveraging powerful automation platforms like n8n and Make alongside Google Sheets and various REST APIs, I constructed intelligent data pipelines that react to real-time events.
                </p>
                <p>
                  For instance, when a new client signs up, the system automatically provisions their account, sends a customized onboarding email sequence, and updates the accounting ledger—all without human intervention.
                </p>
                <p>
                  This comprehensive automation architecture drastically improved the client&apos;s business response times by over 70%, allowing their core team to transition from repetitive administrative tasks to high-value strategic planning. My deep expertise in integrating disparate APIs ensures that data flows securely and reliably, forming the backbone of a highly efficient digital operation.
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
                  "Complex Multi-Step Workflows",
                  "Real-Time Webhook Triggers",
                  "Automated Client Onboarding",
                  "Cross-Platform Data Sync",
                  "Error Handling & Retries",
                  "Financial Ledger Automation"
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
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                    <Workflow size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">n8n</p>
                    <p className="text-sm text-brand-muted">Workflow Automation</p>
                  </div>
                </li>
                
                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">Make (Integromat)</p>
                    <p className="text-sm text-brand-muted">Visual API Integration</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <Server size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">REST APIs</p>
                    <p className="text-sm text-brand-muted">Custom Endpoints & Webhooks</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Table size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">Google Sheets</p>
                    <p className="text-sm text-brand-muted">Dynamic Databases</p>
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
