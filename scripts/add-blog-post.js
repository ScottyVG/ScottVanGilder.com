#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🚀 Blog Post Creator\n');

  const title = await question('Post title: ');
  const excerpt = await question('Post excerpt: ');
  const tags = await question('Tags (comma-separated): ');
  const readTime = await question('Read time (e.g., "5 min read"): ');

  const slug = slugify(title);
  const date = new Date().toISOString().split('T')[0];
  const tagsArray = tags.split(',').map(tag => tag.trim());

  // Create markdown file
  const frontmatter = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${date}"
readTime: "${readTime}"
tags: [${tagsArray.map(tag => `"${tag}"`).join(', ')}]
author: "Scott Van Gilder"
---

# ${title}

Write your blog post content here...

## Section 1

Your content here.

## Section 2

More content here.

## Conclusion

Wrap up your thoughts here.
`;

  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const filePath = path.join(contentDir, `${slug}.md`);

  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  fs.writeFileSync(filePath, frontmatter);

  // Update blog-data.ts
  const blogDataPath = path.join(process.cwd(), 'src', 'lib', 'blog-data.ts');
  const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

  const newPost = `  {
    slug: '${slug}',
    title: '${title}',
    excerpt: '${excerpt}',
    date: '${date}',
    readTime: '${readTime}',
    tags: [${tagsArray.map(tag => `'${tag}'`).join(', ')}],
    author: 'Scott Van Gilder'
  }`;

  // Insert the new post at the beginning of the blogPosts array
  const updatedContent = blogDataContent.replace(
    /export const blogPosts: BlogPostMeta\[\] = \[/,
    `export const blogPosts: BlogPostMeta[] = [\n${newPost},`
  );

  fs.writeFileSync(blogDataPath, updatedContent);

  console.log(`\n✅ Blog post created successfully!`);
  console.log(`📝 Markdown file: ${filePath}`);
  console.log(`📊 Updated blog data: ${blogDataPath}`);
  console.log(`\n🔗 URL: /blog/${slug}`);
  console.log(`\n📅 Date Format: ${date} (YYYY-MM-DD format ensures consistent display)`);
  console.log(`\n📸 Adding Images:`);
  console.log(`1. Add images to: public/images/blog/`);
  console.log(`2. Use in markdown: ![Alt text](/images/blog/filename.jpg)`);
  console.log(`3. See BLOG_IMAGES_GUIDE.md for detailed instructions`);
  console.log(`\nNext steps:`);
  console.log(`1. Edit the markdown file to add your content`);
  console.log(`2. Add any images to public/images/blog/`);
  console.log(`3. Run 'npm run dev' to test locally`);
  console.log(`4. Run 'npm run build' to test production build`);
  console.log(`5. Commit and deploy your changes`);

  rl.close();
}

main().catch(console.error);