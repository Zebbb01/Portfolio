// A project card, used in the home page's bento grid and on the projects page.
// The title link stretches over the whole card; the live demo link sits above it.
import { ExternalLink, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDuration, monthsSince } from '@/src/data/portfolioData';
import type { Project } from '@/src/types';

type Props = {
  project: Project;
  /** The big tile of the bento grid: taller media and the description. */
  large?: boolean;
  /** Description and tech list, for the projects page. */
  detailed?: boolean;
  heading?: 'h2' | 'h3';
  priority?: boolean;
  className?: string;
};

export default function ProjectTile({ project, large, detailed, heading = 'h3', priority, className = '' }: Props) {
  const Heading = heading;
  const isActive = project.status === 'active' && project.startedAt;
  const hasLive = Boolean(project.live && project.live !== '#');

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#0E0E0E] transition-colors duration-300 hover:border-[#D4AF37]/30 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-[#D4AF37]/70 ${className}`}
    >
      <div className={`relative overflow-hidden ${large ? 'aspect-video lg:aspect-auto lg:min-h-80 lg:flex-1' : 'aspect-video'}`}>
        {project.mediaType === 'video' ? (
          <video
            src={project.mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="h-full w-full object-cover object-top transition-transform duration-700 motion-safe:group-hover:scale-105"
          />
        ) : (
          <Image
            src={project.mediaSrc}
            alt=""
            fill
            priority={priority}
            sizes={large ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
            className="object-cover object-top transition-transform duration-700 motion-safe:group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" aria-hidden="true" />
      </div>

      <div className={`flex flex-col gap-2 ${large ? 'p-6 lg:p-8' : 'p-5'}`}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#D4AF37]">{project.category}</span>
          {isActive && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4ADE80]/25 bg-[#4ADE80]/[0.07] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4ADE80]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true" />
              Active · {formatDuration(monthsSince(project.startedAt!))}
            </span>
          )}
        </div>

        <Heading className={`font-heading font-semibold text-[#F5F0E8] ${large ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          <Link
            href={project.opensAt ?? project.detailsUrl}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-[#F5F0E8]"
          >
            {project.title}
          </Link>
        </Heading>

        {(large || detailed) && (
          <p className={`text-sm leading-relaxed text-[#A09882] ${large ? 'line-clamp-3' : 'line-clamp-2'}`}>{project.problem}</p>
        )}

        <p className="mt-1 inline-flex items-center gap-2 text-sm text-[#D4AF37]">
          <TrendingUp size={14} strokeWidth={1.5} aria-hidden="true" />
          {project.impact}
        </p>

        {detailed && (
          <p className="text-xs text-[#6B6355]">
            {project.tech.slice(0, 4).join(' · ')}
            {project.tech.length > 4 && ` · +${project.tech.length - 4}`}
          </p>
        )}

        {hasLive && (large || detailed) && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 mt-2 inline-flex w-fit items-center gap-1.5 rounded text-sm text-[#A09882] transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            aria-label={`Open the live ${project.title} demo in a new tab`}
          >
            Live demo
            <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
}
