import React from 'react';
import Link from 'next/link';

const Contact: React.FC = () => {
  return (
    <div id="contact" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact</h2>
        <div className="prose prose-lg text-gray-600 dark:text-gray-300">
          <p>
            I'd love to hear from you! Whether you have a project in mind or just want to say hello,
            feel free to reach out.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Email:</span>
              <Link 
                href="mailto:svangilder@gmail.com?Subject=Hello%20Scott" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                svangilder@gmail.com
              </Link>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">LinkedIn:</span>
              <Link 
                href="https://www.linkedin.com/in/scott-van-gilder-91065139" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                scott-van-gilder
              </Link>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Twitter:</span>
              <Link 
                href="https://twitter.com/scottyvg" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                @scottyvg
              </Link>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">GitHub:</span>
              <Link 
                href="https://github.com/ScottyVG" 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                ScottyVG
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
