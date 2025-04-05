import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scott Van Gilder',
  description: 'Scott Van Gilder is a DevOps Engineer working at AWS, dedicated to improving operations performance and application scalability.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} text-gray-900 dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
