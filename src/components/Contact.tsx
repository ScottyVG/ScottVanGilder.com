'use client';

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          I'm always interested in discussing new opportunities and collaborations. Feel free to reach out!
        </p>
        <div className="space-y-4">
          <a
            href="mailto:svangilder@gmail.com"
            className="inline-block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            svangilder@gmail.com
          </a>
          <div className="flex space-x-4">
            <a
              href="https://github.com/ScottyVG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/scott-van-gilder-91065139"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
