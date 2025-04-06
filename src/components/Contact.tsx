'use client';

import React from 'react';

const Contact: React.FC = () => {
  return (
    <div id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            I&apos;m always interested in connecting with fellow technologists and discussing cloud infrastructure, 
            DevOps practices, and software engineering.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/scottyvg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/scott-v-91065139/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://www.credly.com/users/scott-van-gilder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Credly Certifications
            </a>
            <a
              href="mailto:svangilder@gmail.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
