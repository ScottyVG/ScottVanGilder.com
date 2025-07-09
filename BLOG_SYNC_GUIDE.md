# Blog Data Sync Guide

## Overview

The blog system now automatically syncs metadata from markdown files in `content/blog/` to the `src/lib/blog-data.ts` file. This eliminates the need to manually maintain both files.

## How It Works

### Automatic Sync
- **Build Process**: `npm run build` automatically runs `npm run sync-blog` before building
- **Manual Sync**: Run `npm run sync-blog` anytime to update blog-data.ts
- **Add New Posts**: The `scripts/add-blog-post.js` script automatically syncs after creating a new post

### File Structure
```
content/blog/
├── post-1.md
├── post-2.md
└── post-3.md

src/lib/
└── blog-data.ts (auto-generated)
```

## Creating New Blog Posts

### Method 1: Using the Helper Script (Recommended)
```bash
node scripts/add-blog-post.js
```
This will:
1. Prompt for post details
2. Create the markdown file
3. Automatically sync blog-data.ts

### Method 2: Manual Creation
1. Create a new `.md` file in `content/blog/`
2. Add required frontmatter:
   ```yaml
   ---
   title: "Your Post Title"
   excerpt: "Brief description of your post"
   date: "2025-07-08"
   readTime: "5 min read"
   tags: ["Tag1", "Tag2"]
   author: "Scott Van Gilder"
   ---
   ```
3. Run `npm run sync-blog` to update blog-data.ts

## Required Frontmatter Fields

- `title`: Post title (required)
- `excerpt`: Brief description for listings (required)
- `date`: Publication date in YYYY-MM-DD format (required)
- `readTime`: Estimated reading time (optional, defaults to "5 min read")
- `tags`: Array of tags (optional, defaults to empty array)
- `author`: Author name (optional, defaults to "Scott Van Gilder")

## File Naming

The filename (without .md extension) becomes the URL slug:
- `my-awesome-post.md` → `/blog/my-awesome-post`
- Use lowercase, hyphens for spaces, no special characters

## Scripts

- `npm run sync-blog`: Manually sync blog data
- `npm run build`: Build with automatic sync
- `npm run dev`: Development server (no sync needed)
- `node scripts/add-blog-post.js`: Create new post with guided prompts

## Important Notes

- **DO NOT** manually edit `src/lib/blog-data.ts` - it's auto-generated
- The sync script validates required frontmatter fields
- Posts are automatically sorted by date (newest first)
- The build process will fail if required frontmatter is missing

## Troubleshooting

### Missing Required Fields
If you see warnings about missing frontmatter fields:
1. Check the markdown file has all required fields
2. Ensure frontmatter is properly formatted (YAML syntax)
3. Run `npm run sync-blog` to see specific errors

### Sync Not Working
1. Ensure `gray-matter` dependency is installed
2. Check file permissions on `content/blog/` directory
3. Verify markdown files have `.md` extension

### Build Failures
1. Run `npm run sync-blog` first to check for sync issues
2. Check that all markdown files have valid frontmatter
3. Ensure no duplicate slugs (filenames)