#!/bin/bash

# This script helps you create an IAM user with the necessary permissions for GitHub Actions deployment
# Run this script with AWS CLI configured with admin permissions

# Variables
USER_NAME="github-actions-deployer"
POLICY_NAME="github-actions-deployment-policy"
S3_BUCKET_NAME="scottvangilder.com"  # Replace with your actual bucket name
CLOUDFRONT_DISTRIBUTION_ID="E2XXXXXXXXXXXXX"  # Replace with your actual distribution ID

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
  echo "Error: AWS CLI is not installed. Please install it first."
  exit 1
fi

# Check if the CloudFront distribution ID is set correctly
if [ "$CLOUDFRONT_DISTRIBUTION_ID" = "YOUR_DISTRIBUTION_ID" ] || [ "$CLOUDFRONT_DISTRIBUTION_ID" = "E2XXXXXXXXXXXXX" ]; then
  echo "Error: CloudFront distribution ID is not set correctly."
  echo "Please update the CLOUDFRONT_DISTRIBUTION_ID variable in this script with your actual distribution ID."
  exit 1
fi

# Create IAM policy document
cat > policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::${S3_BUCKET_NAME}",
                "arn:aws:s3:::${S3_BUCKET_NAME}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation"
            ],
            "Resource": [
                "arn:aws:cloudfront::*:distribution/${CLOUDFRONT_DISTRIBUTION_ID}"
            ]
        }
    ]
}
EOF

# Create IAM policy
echo "Creating IAM policy..."
aws iam create-policy --policy-name $POLICY_NAME --policy-document file://policy.json

# Check if policy creation was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to create IAM policy. The policy might already exist."
  echo "Trying to get the existing policy ARN..."
  POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" --output text)
  
  if [ -z "$POLICY_ARN" ]; then
    echo "Error: Could not find the existing policy. Please check your AWS permissions."
    exit 1
  fi
else
  # Get the policy ARN
  POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName=='$POLICY_NAME'].Arn" --output text)
fi

# Create IAM user
echo "Creating IAM user..."
aws iam create-user --user-name $USER_NAME

# Check if user creation was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to create IAM user. The user might already exist."
  echo "Trying to attach the policy to the existing user..."
else
  echo "IAM user created successfully."
fi

# Attach policy to user
echo "Attaching policy to user..."
aws iam attach-user-policy --user-name $USER_NAME --policy-arn $POLICY_ARN

# Check if policy attachment was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to attach policy to user. Please check your AWS permissions."
  exit 1
fi

# Create access key
echo "Creating access key..."
aws iam create-access-key --user-name $USER_NAME > access-key.json

# Check if access key creation was successful
if [ $? -ne 0 ]; then
  echo "Error: Failed to create access key. The user might already have 2 access keys."
  echo "Please delete an existing access key and try again."
  exit 1
fi

echo "Setup complete! Your access key and secret are in access-key.json"
echo "Add these to your GitHub repository secrets as AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY"
echo "Also add your S3 bucket name as S3_BUCKET and CloudFront distribution ID as CLOUDFRONT_DISTRIBUTION_ID"