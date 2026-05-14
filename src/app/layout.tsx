// src\app\layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gerald Villaceran',
  jobTitle: 'Web Developer & Growth Systems Builder',
  url: 'https://portfolio-five-ruddy-49.vercel.app',
  sameAs: [
    'https://github.com/Zebbb01',
    'https://www.linkedin.com/in/gerald-villaceran-798983325'
  ],
  description: 'Portfolio of Gerald Villaceran - Web Developer, Growth Systems Builder, and AI Prompt Engineer specializing in scalable SaaS platforms and automated workflows.',
  knowsAbout: ['Web Development', 'Growth Systems', 'SaaS', 'Next.js', 'React', 'AI Prompts', 'Automation']
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-five-ruddy-49.vercel.app'),
  title: {
    default: 'Gerald Villaceran | Web Developer & Growth Systems Builder',
    template: '%s | Gerald Villaceran'
  },
  icons: {
    icon: 'https://vddymvngjbcgnmaaklpe.supabase.co/storage/v1/object/public/portfolio-images/logo.svg',
  },
  description: 'Portfolio of Gerald Villaceran - Web Developer, Growth Systems Builder, and AI Prompt Engineer specializing in scalable SaaS platforms and automated workflows.',
  keywords: ['Gerald Villaceran', 'Web Developer', 'Software Engineer', 'Growth Systems Builder', 'SaaS', 'Next.js', 'React', 'TypeScript', 'AI Prompt Engineer'],
  authors: [{ name: 'Gerald Villaceran' }],
  creator: 'Gerald Villaceran',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-five-ruddy-49.vercel.app',
    title: 'Gerald Villaceran | Web Developer & Growth Systems Builder',
    description: 'Portfolio of Gerald Villaceran - Web Developer, Growth Systems Builder, and AI Prompt Engineer specializing in scalable SaaS platforms and automated workflows.',
    siteName: 'Gerald Villaceran Portfolio'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerald Villaceran | Web Developer & Growth Systems Builder',
    description: 'Portfolio of Gerald Villaceran - Web Developer, Growth Systems Builder, and AI Prompt Engineer specializing in scalable SaaS platforms and automated workflows.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}