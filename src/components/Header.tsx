'use client';

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <nav className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Scott Van Gilder
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              About
            </Link>
            <Link href="#projects" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Projects
            </Link>
            <Link href="#certifications" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Certifications
            </Link>
            <Link href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;