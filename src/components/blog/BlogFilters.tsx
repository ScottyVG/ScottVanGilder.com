'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface BlogFiltersProps {
  totalPosts: number;
  filteredPosts: number;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({ totalPosts, filteredPosts }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTag = searchParams.get('tag');
  const currentYear = searchParams.get('year');
  const currentMonth = searchParams.get('month');

  const clearFilters = () => {
    router.push('/blog');
  };

  const hasFilters = currentTag || currentYear || currentMonth;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getFilterDescription = () => {
    if (currentTag && currentYear && currentMonth) {
      return `Posts tagged "${currentTag}" from ${monthNames[parseInt(currentMonth) - 1]} ${currentYear}`;
    } else if (currentTag) {
      return `Posts tagged "${currentTag}"`;
    } else if (currentYear && currentMonth) {
      return `Posts from ${monthNames[parseInt(currentMonth) - 1]} ${currentYear}`;
    } else if (currentYear) {
      return `Posts from ${currentYear}`;
    }
    return 'All posts';
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getFilterDescription()}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredPosts} of {totalPosts} posts
          </p>
        </div>
        
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        )}
      </div>
      
      {hasFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {currentTag && (
            <span className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              Tag: {currentTag}
            </span>
          )}
          {currentYear && currentMonth && (
            <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Date: {monthNames[parseInt(currentMonth) - 1]} {currentYear}
            </span>
          )}
          {currentYear && !currentMonth && (
            <span className="inline-flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Year: {currentYear}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogFilters;