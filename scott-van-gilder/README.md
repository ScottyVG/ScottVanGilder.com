# Scott Van Gilder - Personal Website

A modern personal website built with Next.js, TypeScript, and Tailwind CSS.

## Development

```bash
# Install dependencies
make install

# Run development server
make dev

# Build for production
make build

# Fix linter errors
make fix-lint

# Run linter
make lint

# Test local deployment
make deploy-local

# Set up AWS IAM user
make setup-aws-iam

# Find CloudFront distribution ID
make find-cloudfront-id

# Run pre-commit checks manually
make pre-commit

# See all available commands
make help
```

## Git Hooks

This project uses git hooks to ensure code quality. To set up the git hooks:

```bash
./scripts/setup-git-hooks.sh
```

The following hooks are available:

- **pre-commit**: Runs linter checks and fixes common issues before committing

## Deployment

This site is deployed to AWS S3 and served through CloudFront. The deployment is automated using GitHub Actions.

### Setting up GitHub Actions Secrets

To deploy this site, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `S3_BUCKET`: The name of your S3 bucket (e.g., `scottvangilder.com`)
   - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

### Finding Your CloudFront Distribution ID

To find your CloudFront distribution ID, run:

```bash
make find-cloudfront-id
```

This will list all your CloudFront distributions with their IDs and domain names.

### AWS IAM Permissions

The AWS user associated with the access keys needs the following permissions:

- `s3:PutObject`
- `s3:GetObject`
- `s3:ListBucket`
- `s3:DeleteObject`
- `cloudfront:CreateInvalidation`

### Local Deployment Testing

Before pushing to GitHub, you can test the deployment locally:

1. Find your CloudFront distribution ID:
   ```bash
   make find-cloudfront-id
   ```

2. Update `scripts/deploy-local.sh` with your S3 bucket and CloudFront distribution ID:
   ```bash
   S3_BUCKET_NAME="your-bucket-name"
   CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"
   ```

3. Run the deployment:
   ```bash
   make deploy-local
   ```

## Features

- Modern, responsive design
- Dark mode support
- Image carousel
- Optimized images
- SEO-friendly
- Fast loading
- Accessible
- Automated linting and deployment
- Pre-commit hooks for code quality
