#!/bin/bash

# Import Resources in US-West-2
# This script imports your existing resources in the correct region

echo "📥 Importing AWS Resources in US-West-2"
echo "======================================="

# Set the admin profile and correct region
export AWS_PROFILE=empty #update
export AWS_DEFAULT_REGION=us-west-2
export CDK_DEFAULT_REGION=us-west-2

echo "📍 Importing in us-west-2 (correct bucket region)"
echo "   AWS_PROFILE: $AWS_PROFILE"
echo "   AWS_DEFAULT_REGION: $AWS_DEFAULT_REGION"
echo "   CDK_DEFAULT_REGION: $CDK_DEFAULT_REGION"
echo ""

cd infrastructure

echo "🧹 Cleaning up previous outputs..."
rm -rf cdk.out temp-synth* outputs.json cdk-*.out

echo ""
echo "🏗️  Building and synthesizing..."
npm run build
cdk synth > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ CDK synthesis failed"
    exit 1
fi

echo "✅ CDK synthesis successful"

echo "🚀 Starting import process..."
echo "   This will import your existing resources into CDK management"
echo ""

# Run the import
cdk import --resource-mapping import-resources.json

# Check import result
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Resources imported successfully!"
    echo ""
    echo "✅ Next steps:"
    echo "1. Your S3 bucket and CloudFront distribution are now managed by CDK"
    echo "2. You can now deploy changes with: cdk deploy"
    echo "3. Run: ./scripts/deploy-correct-region.sh to add security features"
    
else
    echo ""
    echo "❌ Import failed"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "1. Check that import-resources.json has correct resource IDs"
    echo "2. Verify no other CloudFormation stacks are managing these resources"
    echo "3. Check CloudFormation console for detailed error messages"
    echo ""
    echo "Current import-resources.json content:"
    cat import-resources.json
fi