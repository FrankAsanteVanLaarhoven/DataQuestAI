import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClerkAuthProvider } from '@/components/ClerkAuthProvider';

export const viewport: Viewport = {
  themeColor: '#08090e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dataquest.ai';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'DataQuest AI • Interactive Database Architecture & SQL Lab',
    template: '%s • DataQuest AI',
  },
  description:
    'Master relational database systems, interactive ERD modeling, ACID transaction analysis, and SQL query optimization with real-time feedback.',
  applicationName: 'DataQuest AI',
  authors: [{ name: 'DataQuest Engineering' }],
  generator: 'Next.js',
  keywords: [
    'SQL Learning',
    'Database Architecture',
    'ERD Modeling',
    'Relational Schema',
    'Interactive SQL Lab',
    'Query Plan Optimization',
    'Computer Science Education',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    title: 'DataQuest AI • Interactive Database Architecture & SQL Lab',
    description:
      'Master relational database systems, interactive ERD modeling, ACID transaction analysis, and SQL query optimization with real-time feedback.',
    siteName: 'DataQuest AI',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'DataQuest AI Interactive Database Architecture Canvas & SQL Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DataQuest AI • Interactive Database Architecture & SQL Lab',
    description:
      'Master relational database systems, interactive ERD modeling, ACID transaction analysis, and SQL query optimization with real-time feedback.',
    images: ['/og-image.svg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-violet-500 selection:text-white min-h-screen bg-[#08090e] text-zinc-100">
        <ClerkAuthProvider>
          {children}
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
