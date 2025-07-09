#!/bin/bash

# Deploy CloudFront Function for URL rewriting
# Make sure you have AWS CLI configured with appropriate permissions

FUNCTION_NAME="scottvangilder-blog-url-rewriter"
DISTRIBUTION_ID="ZYZ1234567890"  # Replace with your actual distribution ID
AWS_PROFILE="default"  # AWS CLI profile to use

echo "Creating CloudFront Function..."

# Create the function
aws cloudfront create-function \
    --name "$FUNCTION_NAME" \
    --function-config Comment="URL rewriter for Next.js static export",Runtime="cloudfront-js-1.0" \
    --function-code fileb://cloudfront-function.js

echo "Function created. Getting ETag..."

# Get the ETag for the function
ETAG=$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query 'ETag' --output text --profile $AWS_PROFILE)

echo "Publishing function with ETag: $ETAG"

# Publish the function
aws cloudfront publish-function \
    --name "$FUNCTION_NAME" \
    --if-match "$ETAG"

echo "Function published. Now you need to associate it with your CloudFront distribution."
echo ""
echo "Manual steps in AWS Console:"
echo "1. Go to CloudFront Console → Your Distribution → Behaviors"
echo "2. Edit the default behavior (*)"
echo "3. Scroll to 'Function associations'"
echo "4. Set 'Viewer request' to 'CloudFront Function'"
echo "5. Select function: $FUNCTION_NAME"
echo "6. Save changes"
echo ""
echo "Or use this AWS CLI command (replace YOUR_DISTRIBUTION_ID):"
echo ""
echo "First, get current distribution config:"
echo "aws cloudfront get-distribution-config --id $DISTRIBUTION_ID > dist-config.json"
echo ""
echo "Then edit the config to add the function association and update the distribution."