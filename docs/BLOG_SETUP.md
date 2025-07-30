# Blog Subdomain Setup Guide

This guide explains how to configure CloudFront and DNS to serve your blog at `blog.scottvangilder.com` while keeping everything in the same Next.js application.

## Architecture Overview

- **Main site**: `scottvangilder.com` → serves from `/` (root)
- **Blog subdomain**: `blog.scottvangilder.com` → serves from `/blog/` directory
- **Single S3 bucket**: Contains the entire static site
- **CloudFront distributions**: Two distributions pointing to the same S3 bucket with different behaviors

## CloudFront Configuration

### Option 1: Single Distribution with Behaviors (Recommended)

1. **Update your existing CloudFront distribution**:
   - Add alternate domain name: `blog.scottvangilder.com`
   - Create a new behavior for the blog subdomain:
     - **Path Pattern**: `/blog/*`
     - **Origin**: Your existing S3 bucket
     - **Viewer Protocol Policy**: Redirect HTTP to HTTPS

2. **CloudFront Function for Subdomain Routing**:
   Create a CloudFront function to handle subdomain routing:

```javascript
function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;
    
    if (host === 'blog.scottvangilder.com') {
        // Redirect blog subdomain to /blog/ path
        if (!request.uri.startsWith('/blog/')) {
            request.uri = '/blog' + request.uri;
        }
    }
    
    return request;
}
```

### Option 2: Separate Distribution for Blog

1. **Create a new CloudFront distribution**:
   - **Origin**: Same S3 bucket as main site
   - **Alternate Domain Names**: `blog.scottvangilder.com`
   - **Default Root Object**: `blog/index.html`
   - **Custom Error Pages**: 
     - 404 → `/blog/404.html` (you'll need to create this)

2. **Behavior Configuration**:
   - **Path Pattern**: `/*`
   - **Origin Path**: `/blog`

## DNS Configuration

Add a CNAME record in your DNS provider:
```
blog.scottvangilder.com → your-cloudfront-distribution.cloudfront.net
```

## SSL Certificate

1. **Request/Update ACM Certificate**:
   - Add `blog.scottvangilder.com` to your existing certificate
   - Or create a wildcard certificate for `*.scottvangilder.com`

2. **Associate with CloudFront**:
   - Update your CloudFront distribution to use the new certificate

## GitHub Actions Update

Your existing deployment workflow will work without changes since the blog is part of the same Next.js build.

## Testing

1. **Build and deploy**:
   ```bash
   npm run build
   # Deploy to S3 as usual
   ```

2. **Test URLs**:
   - `https://scottvangilder.com` → Main site
   - `https://scottvangilder.com/blog/` → Blog listing
   - `https://blog.scottvangilder.com` → Should redirect to blog
   - `https://blog.scottvangilder.com/getting-started-with-aws-devops/` → Blog post

## Next Steps

1. Configure CloudFront distribution with subdomain support
2. Update DNS records
3. Test the blog functionality
4. Add more blog posts by updating `src/lib/blog.ts`

## Adding New Blog Posts

To add new blog posts:

1. **Update `src/lib/blog.ts`**:
   - Add new post object to the `blogPosts` record
   - Include title, excerpt, content, date, readTime, and tags

2. **Deploy**:
   - The static site will automatically include the new post
   - No additional configuration needed

## Future Enhancements

- Add RSS feed generation
- Implement blog post search
- Add blog categories/tags filtering
- Set up blog post analytics
- Add social sharing buttons