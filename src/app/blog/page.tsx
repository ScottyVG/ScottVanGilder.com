'use client';

import React, { useMemo, Suspense } from 'react';
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
      {/* Centered Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Exploring Tech, AWS, GenAI, DevOps—and Life Outside the Code<br></br>(My opinions are my own)
        </p>
      </div>

      <BlogLayout tags={tags} archiveData={archiveData}>
        <>
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
                      className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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