'use client';

import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400">
        © {currentYear} Scott Van Gilder. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
