'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BlogPostMeta } from '../../lib/blog-data';

interface BlogSidebarProps {
  className?: string;
  tags: { tag: string; count: number }[];
  archiveData: { year: number; month: number; count: number; posts: BlogPostMeta[] }[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  enableAnimations?: boolean;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ 
  className = '', 
  tags, 
  archiveData, 
  isCollapsed = false, 
  onToggleCollapse,
  enableAnimations = false
}) => {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');
  const currentYear = searchParams.get('year');
  const currentMonth = searchParams.get('month');
  
  const [tagSearch, setTagSearch] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);

  // Filter and sort tags based on search and display preferences
  const displayedTags = useMemo(() => {
    let filteredTags = tags;
    
    // Filter by search term if provided
    if (tagSearch.trim()) {
      filteredTags = tags.filter(({ tag }) => 
        tag.toLowerCase().includes(tagSearch.toLowerCase())
      );
    }
    
    // Show top 10 or all based on toggle
    if (!showAllTags && !tagSearch.trim()) {
      filteredTags = tags.slice(0, 10);
    }
    
    return filteredTags;
  }, [tags, tagSearch, showAllTags]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <aside className={`lg:sticky lg:top-24 space-y-6 ${className} ${
      enableAnimations ? 'transition-all duration-300 ease-in-out' : ''
    } ${isCollapsed ? 'lg:w-12' : 'lg:w-full'}`}>
      {/* Collapse Button - Desktop Only */}
      <div className="hidden lg:block">
        <button
          onClick={onToggleCollapse}
          className={`flex items-center justify-center p-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm ${
            enableAnimations ? 'transition-all duration-300' : ''
          } ${isCollapsed ? 'w-12 h-12' : 'w-full gap-2'}`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`w-5 h-5 ${
              enableAnimations ? 'transition-transform duration-300' : ''
            } ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {!isCollapsed && (
            <span className="text-sm font-medium">Collapse Sidebar</span>
          )}
        </button>
      </div>
      {/* Collapsible Content */}
      <div className={`overflow-hidden space-y-6 ${
        enableAnimations ? 'transition-all duration-300 ease-in-out' : ''
      } ${
        isCollapsed 
          ? 'lg:max-h-0 lg:opacity-0 lg:transform lg:scale-y-0' 
          : 'lg:max-h-[2000px] lg:opacity-100 lg:transform lg:scale-y-100'
      }`}>
        {/* Tags Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Browse by Tags
          </h3>
          
          {/* Tag Search Box */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

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
            {displayedTags.map(({ tag, count }) => (
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

          {/* Show More/Less Toggle */}
          {!tagSearch.trim() && tags.length > 10 && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {showAllTags ? 'Show Less' : `Show All ${tags.length} Tags`}
              </button>
            </div>
          )}

          {/* No Results Message */}
          {tagSearch.trim() && displayedTags.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tags found matching &ldquo;{tagSearch}&rdquo;
              </p>
            </div>
          )}
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
              href="/blog?all=true"
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              All Posts
            </Link>
            <Link
              href="/blog?tag=AWS"
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              AWS Posts
            </Link>
            <Link
              href="/blog?tag=GenAI"
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              GenAI Posts
            </Link>
            <Link
              href="/blog?tag=DevOps"
              className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              DevOps Posts
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;