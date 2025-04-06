import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
          Scott Van Gilder
        </Link>
        <nav className="flex space-x-6">
          <Link href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            About
          </Link>
          <Link href="#projects" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Projects
          </Link>
          <Link href="#contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;