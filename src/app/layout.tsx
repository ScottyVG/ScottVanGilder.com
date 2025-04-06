import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Define the base URL for the site
const baseUrl = 'https://scottvangilder.com';

export const metadata: Metadata = {
  title: 'Scott Van Gilder',
  description: 'DevOps Engineer at AWS',
  metadataBase: new URL(baseUrl),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'Scott Van Gilder',
    description: 'DevOps Engineer at AWS',
    url: baseUrl,
    siteName: 'Scott Van Gilder',
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Scott Van Gilder - DevOps Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scott Van Gilder',
    description: 'DevOps Engineer at AWS',
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.className} text-gray-900 dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
