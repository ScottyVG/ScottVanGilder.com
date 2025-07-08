import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  author?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  author?: string;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(remarkBreaks) // Convert line breaks to <br> tags
    .use(html, { sanitize: false }) // Allow HTML in markdown
    .process(markdown);
  return result.toString();
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(name => name.endsWith('.md'))
    .map(name => name.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content,
      date: data.date,
      readTime: data.readTime,
      tags: data.tags || [],
      author: data.author
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): BlogPostMeta[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => {
      const post = getPostBySlug(slug);
      if (!post) return null;
      
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        readTime: post.readTime,
        tags: post.tags,
        author: post.author
      } as BlogPostMeta;
    })
    .filter((post): post is BlogPostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByDateRange(year?: number, month?: number): BlogPostMeta[] {
  return getAllPosts().filter(post => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear();
    const postMonth = postDate.getMonth() + 1;

    if (year && month) {
      return postYear === year && postMonth === month;
    } else if (year) {
      return postYear === year;
    }
    return true;
  });
}

export function getArchiveData(): { year: number; month: number; count: number; posts: BlogPostMeta[] }[] {
  const posts = getAllPosts();
  const archiveMap: Record<string, BlogPostMeta[]> = {};

  posts.forEach(post => {
    const date = new Date(post.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!archiveMap[key]) {
      archiveMap[key] = [];
    }
    archiveMap[key].push(post);
  });

  return Object.entries(archiveMap)
    .map(([key, posts]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        year,
        month,
        count: posts.length,
        posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}