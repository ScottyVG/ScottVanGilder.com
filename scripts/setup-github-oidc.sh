#!/bin/bash

# Setup GitHub OIDC for AWS
# This script sets up GitHub Actions OIDC authentication with AWS

echo "🔐 Setting up GitHub OIDC Provider for AWS"
echo "=========================================="

# Use admin profile
export AWS_PROFILE=adminrole

echo "📍 Using AWS profile: $AWS_PROFILE"
echo ""

echo "Step 1: Create GitHub OIDC Provider"
echo "==================================="
echo ""
echo "ℹ️  What are thumbprints?"
echo "   Thumbprints are SHA-1 fingerprints of the root certificate authorities"
echo "   that GitHub uses to sign their OIDC tokens. AWS requires these for security."
echo "   These are GitHub's official thumbprints that rarely change."
echo ""

# Check if OIDC provider already exists
echo "🔍 Checking if GitHub OIDC provider already exists..."
aws iam get-open-id-connect-provider \
  --open-id-connect-provider-arn "arn:aws:iam::937916641299:oidc-provider/token.actions.githubusercontent.com" \
  > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ GitHub OIDC provider already exists"
else
    echo "📝 Creating GitHub OIDC provider..."
    aws iam create-open-id-connect-provider \
      --url https://token.actions.githubusercontent.com \
      --client-id-list sts.amazonaws.com \
      --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 \
      --thumbprint-list 1c58a3a8518e8759bf075b76b750d4f2df264fcd
    
    if [ $? -eq 0 ]; then
        echo "✅ GitHub OIDC provider created successfully"
    else
        echo "❌ Failed to create OIDC provider"
        exit 1
    fi
fi

echo ""
echo "Step 2: Update IAM Role Trust Policy"
echo "===================================="
echo ""
echo "🔧 Updating trust policy for role: scottvangilder.com-github-actions-role"
echo "   This allows GitHub Actions from your repository to assume the role"
echo ""

# Create trust policy document
cat > /tmp/trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::937916641299:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:scottyvg/ScottVanGilder.com:*"
        }
      }
    }
  ]
}
EOF

# Update the role trust policy
aws iam update-assume-role-policy \
  --role-name scottvangilder.com-github-actions-role \
  --policy-document file:///tmp/trust-policy.json

if [ $? -eq 0 ]; then
    echo "✅ IAM role trust policy updated successfully"
else
    echo "❌ Failed to update IAM role trust policy"
    exit 1
fi

# Clean up temp file
rm /tmp/trust-policy.json

echo ""
echo "Step 3: Verify Setup"
echo "==================="
echo ""

# Get role details
echo "🔍 Verifying role configuration..."
aws iam get-role --role-name scottvangilder.com-github-actions-role \
  --query 'Role.AssumeRolePolicyDocument' \
  --output json

echo ""
echo "🎉 GitHub OIDC setup completed!"
echo ""
echo "✅ What was configured:"
echo "   - GitHub OIDC provider in AWS"
echo "   - IAM role trust policy for your repository"
echo "   - Repository: scottyvg/ScottVanGilder.com"
echo ""
echo "🚀 Next steps:"
echo "   1. Push a commit to trigger GitHub Actions"
echo "   2. Check that OIDC authentication works"
echo "   3. Your deployment should now succeed!"
echo ""
echo "📋 Your GitHub secrets should be:"
echo "   AWS_ROLE_TO_ASSUME: arn:aws:iam::937916641299:role/scottvangilder.com-github-actions-role"
echo "   AWS_REGION: us-west-2"
echo "   AWS_S3_BUCKET: scottvangilder.com"
echo "   CLOUDFRONT_DISTRIBUTION_ID: E256LY0L024L6G"