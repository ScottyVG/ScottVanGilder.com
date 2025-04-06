'use client';

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Scott Van Gilder. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
