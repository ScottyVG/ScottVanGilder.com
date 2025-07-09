'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogSidebar from '../../components/blog/BlogSidebar';
import BlogFilters from '../../components/blog/BlogFilters';
import { getAllPosts, getPostsByTag, getPostsByDateRange, getAllTags, getArchiveData } from '../../lib/blog-data';
import { formatBlogDate } from '../../lib/date-utils';

function BlogContent() {
  const searchParams = useSearchParams();
  const allPosts = getAllPosts();
  const tags = getAllTags();
  const archiveData = getArchiveData();
  
  const filteredPosts = useMemo(() => {
    const tag = searchParams.get('tag');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    
    if (tag) {
      return getPostsByTag(tag);
    } else if (year || month) {
      const yearNum = year ? parseInt(year) : undefined;
      const monthNum = month ? parseInt(month) : undefined;
      return getPostsByDateRange(yearNum, monthNum);
    }
    return allPosts;
  }, [searchParams, allPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Exploring Tech, AWS, GenAI, DevOps—and Life Outside the Code<br></br>(My opinions are my own)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-64"></div>}>
            <BlogSidebar tags={tags} archiveData={archiveData} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <BlogFilters 
            totalPosts={allPosts.length} 
            filteredPosts={filteredPosts.length} 
          />
          
          <div className="space-y-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                   <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                     <time dateTime={post.date}>
                       {formatBlogDate(post.date)}
                     </time>                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                    {post.author && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </>
                    )}
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
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Read more
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </article>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No posts found matching your criteria.
                </p>
                <Link
                  href="/blog"
                  className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  View all posts
                </Link>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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