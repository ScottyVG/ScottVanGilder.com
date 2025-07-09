import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BlogSidebar from '../../../components/blog/BlogSidebar';
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-64"></div>}>
                <BlogSidebar tags={tags} archiveData={archiveData} />
              </Suspense>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
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
                
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>

              <article className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-img:shadow-lg prose-img:mx-auto prose-img:my-8 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline dark:prose-a:text-blue-400 dark:hover:prose-a:text-blue-300 prose-a:font-medium prose-a:transition-colors prose-a:duration-200">
                <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
              </article>
            </div>


          </div>
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