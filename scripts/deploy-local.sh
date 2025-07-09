#!/bin/bash

# This script builds the Next.js app and deploys it to your local S3 bucket for testing
# Make sure you have AWS CLI configured with the correct credentials

# Variables - UPDATE THESE WITH YOUR VALUES
S3_BUCKET_NAME="your-bucket-name.com"  # Replace with your actual bucket name
CLOUDFRONT_DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"  # Replace with your actual distribution ID
AWS_PROFILE="default"  # AWS CLI profile to use

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if AWS CLI is installed
if ! command_exists aws; then
  echo "Error: AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
  echo "Error: npm is not installed. Please install Node.js and npm first."
  exit 1
fi

# Check if the CloudFront distribution ID is set correctly
if [ "$CLOUDFRONT_DISTRIBUTION_ID" = "YOUR_DISTRIBUTION_ID" ] || [ "$CLOUDFRONT_DISTRIBUTION_ID" = "E2XXXXXXXXXXXXX" ]; then
  echo "Error: CloudFront distribution ID is not set correctly."
  echo "Please update the CLOUDFRONT_DISTRIBUTION_ID variable in this script with your actual distribution ID."
  exit 1
fi

# Build the Next.js app
echo "Building Next.js app..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Error: Build failed. Please fix the build errors before deploying."
  exit 1
fi

# Check if the out directory exists
if [ ! -d "./out" ]; then
  echo "Error: The 'out' directory does not exist. This might be because the build failed or Next.js is not configured for static export."
  echo "Make sure your next.config.js has 'output: \"export\"' set."
  exit 1
fi

# Deploy to S3
echo "Deploying to S3..."
aws s3 sync ./out s3://$S3_BUCKET_NAME --delete --profile $AWS_PROFILE

# Check if S3 sync was successful
if [ $? -ne 0 ]; then
  echo "Error: S3 sync failed. Please check your AWS credentials and bucket permissions."
  exit 1
fi

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --profile $AWS_PROFILE

# Check if CloudFront invalidation was successful
if [ $? -ne 0 ]; then
  echo "Error: CloudFront invalidation failed. Please check your AWS credentials and CloudFront permissions."
  exit 1
fi

echo "Deployment complete!"