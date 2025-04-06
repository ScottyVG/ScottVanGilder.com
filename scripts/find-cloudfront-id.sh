#!/bin/bash

# This script helps you find your CloudFront distribution ID

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "Error: AWS CLI is not installed. Please install it first."
  exit 1
fi

echo "Finding CloudFront distributions..."

# List all CloudFront distributions
aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName,Aliases.Items[0]]" --output table --profile adminrole

echo ""
echo "To use a distribution ID in your scripts, update the CLOUDFRONT_DISTRIBUTION_ID variable in:"
echo "1. scripts/deploy-local.sh"
echo "2. scripts/setup-aws-iam.sh"
echo "3. .github/workflows/deploy.yml (for GitHub Actions)"
echo ""
echo "Example: CLOUDFRONT_DISTRIBUTION_ID=\"E2XXXXXXXXXXXXX\""