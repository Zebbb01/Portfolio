// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import LiveChatWidget from '@/src/components/ui/LiveChatWidget';
import { Toaster } from 'sonner';
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['300', '400', '500', '600', '700', '800'] })

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gerald Villaceran',
  jobTitle: 'Full-Stack Engineer & Systems Architect',
  url: 'https://portfolio-five-ruddy-49.vercel.app',
  sameAs: [
    'https://github.com/Zebbb01',
    'https://www.linkedin.com/in/gerald-villaceran-798983325'
  ],
  description: 'Full-stack engineer specializing in enterprise SaaS platforms, mobile applications, and business automation systems.',
  knowsAbout: ['Full-Stack Development', 'Systems Architecture', 'SaaS', 'Next.js', 'React', 'React Native', 'AI Integration', 'Business Automation']
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-five-ruddy-49.vercel.app'),
  title: {
    default: 'Gerald Villaceran | Full-Stack Engineer & Systems Architect',
    template: '%s | Gerald Villaceran'
  },
  icons: {
    icon: '/images/logo-mark.svg',
  },
  description: 'Full-stack engineer specializing in enterprise SaaS platforms, mobile applications, and business automation systems that deliver measurable business outcomes.',
  keywords: ['Gerald Villaceran', 'Full-Stack Engineer', 'Systems Architect', 'Software Engineer', 'SaaS', 'Next.js', 'React', 'React Native', 'TypeScript', 'Supabase'],
  authors: [{ name: 'Gerald Villaceran' }],
  creator: 'Gerald Villaceran',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-five-ruddy-49.vercel.app',
    title: 'Gerald Villaceran | Full-Stack Engineer & Systems Architect',
    description: 'Full-stack engineer specializing in enterprise SaaS platforms, mobile applications, and business automation systems.',
    siteName: 'Gerald Villaceran'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gerald Villaceran | Full-Stack Engineer & Systems Architect',
    description: 'Full-stack engineer specializing in enterprise SaaS platforms, mobile applications, and business automation systems.',
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#060606" />
      </head>
      <body className="font-body bg-bg-primary text-text-primary">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <LiveChatWidget />
        <Toaster theme="dark" position="bottom-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}