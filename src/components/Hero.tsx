'use client';

import React from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden">
            <Image
              src="/images/svg.jpg"
              alt="Scott Van Gilder"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Scott Van Gilder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              DevOps Engineer and Cloud Architect 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;