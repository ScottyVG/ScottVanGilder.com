'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogLayout from '../../components/blog/BlogLayout';
import BlogFilters from '../../components/blog/BlogFilters';
import { getAllPosts, getPostsByTag, getPostsByDateRange, getAllTags, getArchiveData } from '../../lib/blog-data';
import { formatBlogDate } from '../../lib/date-utils';

function BlogContent() {
  const searchParams = useSearchParams();
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const archiveData = getArchiveData();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPosts = useMemo(() => {
    const tag = searchParams.get('tag');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const showAll = searchParams.get('all') === 'true';
    
    let posts = allPosts;
    
    // Apply filters from URL params
    if (tag) {
      posts = getPostsByTag(tag);
    } else if (year || month) {
      const yearNum = year ? parseInt(year) : undefined;
      const monthNum = month ? parseInt(month) : undefined;
      posts = getPostsByDateRange(yearNum, monthNum);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Limit to 5 most recent posts if no filters are applied and showAll is not true
    if (!tag && !year && !month && !searchQuery.trim() && !showAll) {
      posts = posts.slice(0, 5);
    }
    
    return posts;
  }, [searchParams, allPosts, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Centered Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Exploring Tech, AWS, GenAI, DevOps—and Life Outside of Code
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 opacity-75">
          (My opinions are my own)
        </p>
      </div>

      <BlogLayout tags={tags} archiveData={archiveData}>
        <>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm focus:bg-white dark:focus:bg-gray-700 transition-colors"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <BlogFilters 
            totalPosts={allPosts.length} 
            filteredPosts={filteredPosts.length} 
          />
          
          {/* Show recent posts indicator or search results */}
          {!searchParams.get('tag') && !searchParams.get('year') && !searchParams.get('month') && !searchQuery.trim() && !searchParams.get('all') && (
            <div className="mb-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Showing 5 most recent posts
              </p>
              <Link
                href="/blog?all=true"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                View all posts →
              </Link>
            </div>
          )}
          
          <div className="space-y-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md hover:bg-white dark:hover:bg-gray-750 transition-all"
            >
               <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                 <time dateTime={post.date}>
                   {formatBlogDate(post.date)}
                 </time>                    <span className="mx-2">•</span>
                 <span>{post.readTime}</span>
               </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No posts found matching your criteria.
            </p>
            <Link
              href="/blog"
              className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              View all posts
            </Link>
          </div>
        )}
          </div>
        </>
      </BlogLayout>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading blog posts...</p>
            </div>
          </div>
        }>
          <BlogContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}