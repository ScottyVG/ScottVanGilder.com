# CloudFormation S3 301 Error - Final Resolution

## Problem Summary
You were getting a CloudFormation error:
```
Resource handler returned message: "The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint. (Service: S3, Status Code: 301, Request ID: ..., Extended Request ID: ...)"
```

## Root Cause
- **Your S3 bucket is in `us-east-1`** (confirmed via AWS Console)
- **CDK was trying to deploy to `us-west-2`** (your AWS CLI default region)
- **CloudFormation couldn't access the bucket** because it was looking in the wrong region

## Solution Applied

### 1. Updated CDK Configuration
Fixed `infrastructure/bin/infrastructure.ts` to deploy to `us-east-1`:
```typescript
env: {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1', // S3 bucket is in us-east-1
},
```

### 2. Created Deployment Script
Created `scripts/deploy-us-east-1.sh` that:
- Sets all region environment variables to `us-east-1`
- Forces CDK to deploy to the correct region
- Provides clear success/failure feedback

## Next Steps

### Deploy with Correct Region
```bash
./scripts/deploy-us-east-1.sh
```

### If Deployment Still Fails
1. **Check for failed CloudFormation stacks**:
   - Go to: https://us-east-1.console.aws.amazon.com/cloudformation/
   - Look for `ScottVanGilderWebsiteStack` in ROLLBACK_COMPLETE state
   - Delete any failed stacks

2. **Verify permissions**:
   - Ensure you have CloudFormation permissions in `us-east-1`
   - Check that you can access S3 and CloudFront from `us-east-1`

### Expected Result
After successful deployment:
- ✅ S3 bucket managed by CDK with enhanced security
- ✅ CloudFront distribution managed by CDK
- ✅ IAM role for GitHub Actions with OIDC authentication
- ✅ All resources properly managed in `us-east-1`

## Why This Happens
S3 buckets are region-specific, but the AWS CLI can access them from any region. However, when CloudFormation tries to **import** and **manage** a resource, it must make API calls from the same region where the resource exists. The 301 error is S3's way of saying "this bucket exists, but not in the region you're calling from."

## Prevention
Always ensure your CDK deployment region matches the region where your existing AWS resources are located before attempting to import them.