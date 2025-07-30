# CDK Import Fix: Resolving "Already Exists" Error

## The Problem

You encountered this error because you ran `cdk deploy` before `cdk import`. This tried to create new AWS resources instead of importing existing ones.

```
❌ ScottVanGilderWebsiteStack failed: Resource handler returned message: "scottvangilder.com already exists"
```

## The Solution

Follow these steps to fix the issue:

### Step 1: Clean Up Failed CloudFormation Stack

You need to delete the failed CloudFormation stack. Since you have limited CloudFormation permissions, you have two options:

**Option A: AWS Console (Recommended)**
1. Go to [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Find the stack named `ScottVanGilderWebsiteStack`
3. Select it and click "Delete"
4. Wait for deletion to complete

**Option B: Ask for Help**
Ask someone with CloudFormation permissions to run:
```bash
aws cloudformation delete-stack --stack-name ScottVanGilderWebsiteStack
```

### Step 2: Verify Stack Deletion

Wait until the stack is completely deleted. You can check in the AWS Console or ask someone to run:
```bash
aws cloudformation describe-stacks --stack-name ScottVanGilderWebsiteStack
```
This should return "Stack does not exist" when deletion is complete.

### Step 3: Prepare for Correct Import Process

Before importing, make sure you have the correct resource identifiers:

1. **Get your S3 bucket name**:
   - Go to [S3 Console](https://console.aws.amazon.com/s3/)
   - Find your bucket (likely `scottvangilder.com`)

2. **Get your CloudFront distribution ID**:
   - Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
   - Find your distribution and copy the ID (starts with E...)

3. **Get your certificate ARN** (if using custom domain):
   - Go to [Certificate Manager Console](https://console.aws.amazon.com/acm/) (us-east-1 region)
   - Find your certificate and copy the ARN

### Step 4: Update Configuration Files

Update `infrastructure/import-resources.json` with your actual values:

```json
{
  "version": 1,
  "resources": [
    {
      "resourceType": "AWS::S3::Bucket",
      "logicalId": "WebsiteBucket",
      "resourceIdentifier": {
        "BucketName": "scottvangilder.com"
      }
    },
    {
      "resourceType": "AWS::CloudFront::Distribution",
      "logicalId": "WebsiteDistribution",
      "resourceIdentifier": {
        "Id": "E1234567890ABC"
      }
    }
  ]
}
```

Update `infrastructure/cdk.context.json`:

```json
{
  "domainName": "scottvangilder.com",
  "certificateArn": "arn:aws:acm:us-east-1:937916641299:certificate/your-cert-id"
}
```

### Step 5: Execute Correct Import Process

Now follow the correct order:

```bash
cd infrastructure

# 1. Build the project
npm run build

# 2. Synthesize (this creates the template but doesn't deploy)
cdk synth

# 3. IMPORT existing resources (this is the key step you missed)
cdk import --resource-mapping import-resources.json

# 4. Follow the interactive prompts to confirm each resource
# 5. Only AFTER import is complete, you can deploy changes
cdk deploy
```

### Step 6: Verify Import Success

After successful import:

```bash
# Check for any configuration drift
cdk diff

# Should show no differences if import was successful
```

## Why This Happened

The CDK import process works like this:

1. **`cdk import`**: Takes existing AWS resources and brings them under CloudFormation/CDK management
2. **`cdk deploy`**: Manages resources that are already under CloudFormation control

You skipped step 1 and went directly to step 2, which tried to create new resources instead of importing existing ones.

## Prevention

To avoid this in the future:

1. **Always import before deploy** when working with existing resources
2. **Use `cdk synth`** to review what will be created/imported before executing
3. **Check AWS Console** to understand what resources already exist

## Alternative: Start Fresh (If Import Continues to Fail)

If the import process continues to have issues, you could:

1. **Rename your existing S3 bucket** (e.g., to `scottvangilder-com-old`)
2. **Let CDK create new resources** with the original names
3. **Migrate content** from old to new bucket
4. **Update DNS** to point to new CloudFront distribution
5. **Delete old resources** once everything is working

This approach gives you a clean CDK-managed infrastructure but requires more migration work.

## Need Help?

If you continue to have issues:

1. **Check AWS Console** for the exact state of your resources
2. **Verify permissions** - you may need CloudFormation permissions for import
3. **Consider using an admin account** for the initial import process
4. **Review CDK logs** for more detailed error messages

The key is to always import existing resources before trying to manage them with CDK!