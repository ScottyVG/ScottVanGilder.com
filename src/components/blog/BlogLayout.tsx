'use client';

import React, { useState, useEffect, Suspense } from 'react';
import BlogSidebar from './BlogSidebar';
import { BlogPostMeta } from '../../lib/blog-data';

interface BlogLayoutProps {
  children: React.ReactNode;
  tags: { tag: string; count: number }[];
  archiveData: { year: number; month: number; count: number; posts: BlogPostMeta[] }[];
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, tags, archiveData }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(false);

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('blog-sidebar-collapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedState));
    }
    setIsHydrated(true);
  }, []);

  // Save collapse state to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('blog-sidebar-collapsed', JSON.stringify(isSidebarCollapsed));
    }
  }, [isSidebarCollapsed, isHydrated]);

  const handleToggleCollapse = () => {
    // Enable animations only when user clicks the button
    if (!enableAnimations) {
      setEnableAnimations(true);
    }
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-64"></div>}>
          <BlogSidebar 
            tags={tags} 
            archiveData={archiveData}
            isCollapsed={false}
            onToggleCollapse={handleToggleCollapse}
            enableAnimations={false}
          />          </Suspense>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`${
      isSidebarCollapsed 
        ? 'relative' 
        : 'grid grid-cols-1 lg:grid-cols-4 gap-8'
    } ${enableAnimations ? 'transition-all duration-300 ease-in-out' : ''}`}>
      {/* Sidebar */}
      <div className={`${
        isSidebarCollapsed 
          ? 'absolute left-0 top-0 z-10 lg:block hidden' 
          : 'order-2 lg:order-1 lg:col-span-1'
      } ${enableAnimations ? 'transition-all duration-300 ease-in-out' : ''}`}>
        <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-64"></div>}>
          <BlogSidebar 
            tags={tags} 
            archiveData={archiveData}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
            enableAnimations={enableAnimations}
          />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className={`${
        isSidebarCollapsed 
          ? 'w-full max-w-4xl mx-auto px-4' 
          : 'order-1 lg:order-2 lg:col-span-3'
      } ${enableAnimations ? 'transition-all duration-300 ease-in-out' : ''}`}>
        {children}
      </div>
    </div>  );
};

export default BlogLayout;