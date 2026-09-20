import React from 'react';
import type { Metadata } from 'next';
import Footer from '../../../components/ui/Footer';
import { projects } from '../../../data/portfolioData';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Any slug that is not in the list above is a real 404, not a soft one.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} — ${project.category}`,
    description: project.description.slice(0, 160),
    alternates: { canonical: project.detailsUrl },
    openGraph: {
      title: `${project.title} — ${project.category}`,
      description: project.description.slice(0, 200),
      url: project.detailsUrl,
      type: 'article',
      images: project.mediaType === 'image' ? [{ url: project.mediaSrc }] : undefined,
    },
  };
}

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#060606] min-h-screen selection:bg-[#D4AF37]/30 selection:text-[#F5F0E8]">
      {/* Ambient gold glow for continuity with the home page */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-[#D4AF37]/[0.04] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] max-w-[80vw] max-h-[80vw] bg-[#D4AF37]/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </div>
  );
}
