import React from 'react';
import type { Metadata } from 'next';
import PageShell from '../../../components/ui/PageShell';
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
  return <PageShell>{children}</PageShell>;
}
