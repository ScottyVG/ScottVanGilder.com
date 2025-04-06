import React from "react";
import React from "react";
import React from "react";
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Scott Van Gilder',
  description: 'DevOps engineer with a passion for building scalable, cloud-native platforms.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} text-gray-900 dark:text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}

export default RootLayout
