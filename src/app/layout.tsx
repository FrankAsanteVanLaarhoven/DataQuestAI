import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataQuest • Learn • Build • Earn • Make an Impact',
  description: 'Gamified interactive Database Systems, ERD Architecture and SQL Learning Platform',
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
        {children}
      </body>
    </html>
  );
}
