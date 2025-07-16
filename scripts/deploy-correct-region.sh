#!/bin/bash

# Deploy with Correct Region Script
# Your bucket is actually in us-west-2, not us-east-1!

echo "🎯 Deploying CDK to Correct Region (us-west-2)"
echo "=============================================="

# Set the admin profile and CORRECT region
export AWS_PROFILE=empty #update
export AWS_DEFAULT_REGION=us-west-2
export CDK_DEFAULT_REGION=us-west-2

echo "📍 Using correct region based on actual bucket location"
echo "   AWS_PROFILE: $AWS_PROFILE"
echo "   AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION"
echo "   CDK_DEFAULT_REGION: $CDK_DEFAULT_REGION"
echo ""

# Verify bucket location
echo "🔍 Confirming bucket location..."
BUCKET_REGION=$(aws s3api get-bucket-location --bucket scottvangilder.com --output text)
echo "   Bucket 'scottvangilder.com' is in: $BUCKET_REGION"

if [ "$BUCKET_REGION" != "us-west-2" ]; then
    echo "❌ Region mismatch detected!"
    echo "   Expected: us-west-2"
    echo "   Actual: $BUCKET_REGION"
    echo "   Updating deployment region to: $BUCKET_REGION"
    export AWS_DEFAULT_REGION=$BUCKET_REGION
    export CDK_DEFAULT_REGION=$BUCKET_REGION
fi

cd infrastructure

echo ""
echo "🧹 Cleaning up and rebuilding..."
rm -rf cdk.out temp-synth* outputs.json cdk-*.out
npm run build

echo ""
echo "🚀 Deploying to $AWS_DEFAULT_REGION with admin privileges..."
echo "   This should finally resolve the S3 301 error!"
echo ""

# Deploy with correct region and admin profile
cdk deploy --outputs-file outputs.json --require-approval never

# Check deployment result
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! CDK import completed!"
    
    if [ -f outputs.json ]; then
        echo ""
        echo "🔧 GitHub Actions Configuration"
        echo "==============================="
        echo ""
        
        ROLE_ARN=$(cat outputs.json | grep -o '"DeploymentRoleArn":"[^"]*' | cut -d'"' -f4)
        BUCKET_NAME=$(cat outputs.json | grep -o '"BucketName":"[^"]*' | cut -d'"' -f4)
        DIST_ID=$(cat outputs.json | grep -o '"DistributionId":"[^"]*' | cut -d'"' -f4)
        
        echo "Add these secrets to your GitHub repository:"
        echo ""
        echo "AWS_ROLE_TO_ASSUME: $ROLE_ARN"
        echo "AWS_S3_BUCKET: $BUCKET_NAME"
        echo "CLOUDFRONT_DISTRIBUTION_ID: $DIST_ID"
        echo "AWS_REGION: $AWS_DEFAULT_REGION"
        echo ""
        echo "✨ Your infrastructure is now managed by CDK!"
    fi
else
    echo ""
    echo "❌ Still failing with S3 301 error"
    echo ""
    echo "🔍 Let's try one more debugging approach..."
    echo ""
    
    # Check if there are any failed stacks to clean up
    echo "Checking for failed CloudFormation stacks..."
    aws cloudformation describe-stacks --query 'Stacks[?StackName==`ScottVanGilderWebsiteStack`].[StackName,StackStatus]' --output table
    
    echo ""
    echo "If you see a stack in ROLLBACK_COMPLETE state, delete it and try again:"
    echo "aws cloudformation delete-stack --stack-name ScottVanGilderWebsiteStack"
fi