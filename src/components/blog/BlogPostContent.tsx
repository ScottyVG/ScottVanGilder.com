'use client';

import React from 'react';
import { useCodeBlocks } from '../../hooks/useCodeBlocks';
import '../../styles/tokyo-night.css';

interface BlogPostContentProps {
  contentHtml: string;
}

export default function BlogPostContent({ contentHtml }: BlogPostContentProps) {
  useCodeBlocks();

  return (
    <div 
      className="prose prose-lg dark:prose-invert max-w-none 
      prose-headings:text-gray-900 dark:prose-headings:text-white 
      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
      prose-strong:text-gray-900 dark:prose-strong:text-white 
prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:bg-gray-200 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
      prose-h1:mt-8 prose-h1:mb-6 prose-h1:leading-tight
      prose-h2:mt-8 prose-h2:mb-4 prose-h2:leading-tight  
      prose-h3:mt-6 prose-h3:mb-3 prose-h3:leading-tight
      prose-ul:mb-6 prose-ol:mb-6 prose-li:mb-2
      prose-blockquote:my-6 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:italic
      prose-img:my-8 prose-img:rounded-lg prose-img:shadow-sm
      prose-hr:my-8 prose-hr:border-gray-300 dark:prose-hr:border-gray-600
      [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}