# CloudFront Configuration for Client-Side Routing

## Problem
Direct navigation to `/blog` or blog post URLs (like from GitHub README links) results in AccessDenied errors, while navigation from the main site works fine.

## Root Cause
Next.js static export creates client-side routing, but CloudFront doesn't know how to handle direct requests to these routes since they don't exist as actual files in S3.

## Solution: Configure CloudFront Error Pages

### Step 1: Configure Custom Error Pages in CloudFront

1. Go to AWS CloudFront Console
2. Select your distribution
3. Go to "Error Pages" tab
4. Create custom error responses:

**UPDATED APPROACH - Remove the error page redirects you just added**

The issue is that CloudFront is redirecting ALL 404s to index.html. Instead, we need CloudFront to understand the Next.js static export structure.

**Better Solution: CloudFront Behaviors**

1. Go to CloudFront Console → Your Distribution → Behaviors
2. Create a new behavior:
   - Path Pattern: `/blog*`
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Cache Policy: Managed-CachingOptimized
   - Origin Request Policy: Managed-CORS-S3Origin

**Alternative: Use CloudFront Functions**

Create a CloudFront function to handle the routing:

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Handle blog routes
    if (uri === '/blog' || uri === '/blog/') {
        request.uri = '/blog/index.html';
    } else if (uri.startsWith('/blog/') && !uri.endsWith('.html') && !uri.includes('.')) {
        // For blog post URLs like /blog/post-slug
        if (!uri.endsWith('/')) {
            uri += '/';
        }
        request.uri = uri + 'index.html';
    } else if (uri.endsWith('/') && uri !== '/') {
        // For any other trailing slash URLs
        request.uri = uri + 'index.html';
    } else if (!uri.includes('.') && uri !== '/') {
        // For URLs without extensions and not root
        request.uri = uri + '/index.html';
    }
    
    return request;
}
```

### Step 2: Alternative - Use AWS CLI

```bash
# Get your distribution ID
aws cloudfront list-distributions --query 'DistributionList.Items[?Comment==`ScottVanGilder.com`].Id' --output text

# Update distribution with error pages
aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION_ID > dist-config.json

# Edit the config to add custom error responses, then update:
aws cloudfront update-distribution --id YOUR_DISTRIBUTION_ID --distribution-config file://updated-config.json --if-match ETAG_FROM_GET_COMMAND
```

### Step 3: Invalidate Cache
After making changes, invalidate the CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## How It Works

1. User navigates directly to `scottvangilder.com/blog`
2. CloudFront requests `/blog` from S3
3. S3 returns 403/404 (file doesn't exist)
4. CloudFront catches the error and serves `/index.html` instead with 200 status
5. Next.js client-side router takes over and renders the correct page

## Testing

After configuration:
- Direct links to `/blog` should work
- Direct links to `/blog/post-slug` should work
- All existing functionality should continue working
- SEO and social sharing should work properly

## Backup Solution

The `.htaccess` file has been updated with rewrite rules as a fallback, but CloudFront error page configuration is the recommended approach for AWS deployments.