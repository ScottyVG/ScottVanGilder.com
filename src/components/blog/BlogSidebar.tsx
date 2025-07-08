'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogPostMeta } from '../../lib/blog-data';

interface BlogSidebarProps {
  className?: string;
  tags: { tag: string; count: number }[];
  archiveData: { year: number; month: number; count: number; posts: BlogPostMeta[] }[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ className = '', tags, archiveData }) => {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const currentYear = searchParams.get('year');
  const currentMonth = searchParams.get('month');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <aside className={`lg:sticky lg:top-24 space-y-6 ${className}`}>
      {/* Tags Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Browse by Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !currentTag
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All Posts
          </Link>
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                currentTag === tag
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {tag} ({count})
            </Link>
          ))}
        </div>
      </div>

      {/* Archive Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Archive
        </h3>
        <div className="space-y-1">
          {archiveData.map(({ year, month, count }) => {
            const isActive = 
              currentYear === year.toString() && 
              currentMonth === month.toString();
            
            return (
              <Link
                key={`${year}-${month}`}
                href={`/blog?year=${year}&month=${month}`}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {monthNames[month - 1]} {year} ({count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Quick Links
        </h3>
        <div className="space-y-1">
          <Link
            href="/blog"
            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            All Posts
          </Link>
          <Link
            href="/blog?tag=Tech"
            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Tech Posts
          </Link>
          <Link
            href="/blog?tag=Travel"
            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Travel Posts
          </Link>
          <Link
            href="/blog?tag=Outdoors"
            className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Outdoor Posts
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;