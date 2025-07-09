import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BlogLayout from '../../../components/blog/BlogLayout';
import { getPostBySlug, markdownToHtml, getAllPostSlugs, getAllTags, getArchiveData } from '../../../lib/blog';
import { formatBlogDate } from '../../../lib/date-utils';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);
  const tags = getAllTags();
  const archiveData = getArchiveData();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogLayout tags={tags} archiveData={archiveData}>
            <div className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
              >
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>

            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <header className="mb-8">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <time dateTime={post.date}>
                    {formatBlogDate(post.date)}
                  </time>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                  {post.author && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{post.author}</span>
                    </>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </header>

              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:text-gray-900 dark:prose-headings:text-white 
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
                prose-strong:text-gray-900 dark:prose-strong:text-white 
                prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6
                prose-h1:mt-8 prose-h1:mb-6 prose-h1:leading-tight
                prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-tight  
                prose-h3:mt-6 prose-h3:mb-3 prose-h3:leading-tight
                prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
                prose-blockquote:my-6 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:italic
                prose-img:my-8 prose-img:rounded-lg prose-img:shadow-sm
                prose-hr:my-8 prose-hr:border-gray-300 dark:prose-hr:border-gray-600"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            </article>
          </BlogLayout>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}