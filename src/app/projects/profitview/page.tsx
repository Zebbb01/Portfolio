import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle2, Server, Database, Bot, CreditCard } from 'lucide-react';
import Image from 'next/image';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProfitView Accounting Case Study | Gerald Villaceran',
  description: 'A deep dive into ProfitView Accounting, a next-generation SaaS financial operations platform built with Next.js, Supabase, Stripe, and AI Agents.',
};

export default function ProfitViewCaseStudy() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-brand-cyan/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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
              SaaS Platform
            </span>
            <span className="px-4 py-1.5 rounded-full bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-sm font-semibold tracking-wide uppercase">
              Fintech
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            ProfitView Accounting
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-muted max-w-3xl leading-relaxed mb-10">
            A next-generation financial operations platform combining multi-tenant architecture with AI-driven insights to automate and scale modern accounting.
          </p>

          <a 
            href="https://profit-view-swart.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-950 font-bold hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]"
          >
            Visit Live Project <ExternalLink size={20} />
          </a>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-brand-black border border-brand-teal shadow-2xl mb-20 group">
          <Image 
            src="https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/profitview.png" 
            alt="ProfitView Dashboard" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
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
              <div className="space-y-6 text-lg text-brand-muted leading-relaxed">
                <p>
                  ProfitView was built to solve the fragmentation in modern accounting workflows. Traditional systems require manual data entry, complex reconciliation processes, and lack proactive insights. 
                </p>
                <p>
                  This platform centralizes financial operations into a single, highly scalable dashboard. By leveraging advanced OCR for receipt capture and an AI Agent for financial analysis, ProfitView reduces manual bookkeeping hours by up to 80% while providing real-time financial health indicators.
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
                  "Multi-Tenant SaaS Architecture",
                  "Real-time Invoicing & Billing",
                  "OCR Expense Data Extraction",
                  "Automated Bank Reconciliation",
                  "AI-Driven Proactive Financial Alerts",
                  "Role-Based Access Control (RBAC)"
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
                  <div className="p-3 rounded-lg bg-brand-teal/20 text-brand-muted">
                    <Server size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">Next.js 15 (App Router)</p>
                    <p className="text-sm text-brand-muted">Frontend & Server Actions</p>
                  </div>
                </li>
                
                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Database size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">Supabase / PostgreSQL</p>
                    <p className="text-sm text-brand-muted">Auth, Database & RLS</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <Bot size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">AI Agents</p>
                    <p className="text-sm text-brand-muted">LLM Integration & OCR</p>
                  </div>
                </li>

                <li className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-brand-cyan/10 text-brand-cyan">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-brand-white">Stripe Integration</p>
                    <p className="text-sm text-brand-muted">Subscription & Payments</p>
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
