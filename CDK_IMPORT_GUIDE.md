# CDK Import Guide: Migrating Existing AWS Resources to CDK Management

This guide walks you through importing your existing AWS resources (S3 bucket, CloudFront distribution, etc.) into AWS CDK for proper Infrastructure as Code management with security best practices.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Security Considerations](#security-considerations)
3. [Step-by-Step Import Process](#step-by-step-import-process)
4. [Post-Import Configuration](#post-import-configuration)
5. [Deployment and CI/CD Updates](#deployment-and-cicd-updates)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

## Prerequisites

### Required Tools
- AWS CLI configured with appropriate permissions
- Node.js 18+ and npm
- AWS CDK CLI (`npm install -g aws-cdk`)
- Git

### Required AWS Permissions
Your AWS user/role needs the following permissions:
- `s3:*` (for S3 bucket management)
- `cloudfront:*` (for CloudFront distribution management)
- `iam:*` (for role and policy management)
- `cloudformation:*` (for CDK stack management)
- `sts:AssumeRole` (for deployment roles)

## Security Considerations

This CDK setup implements several security best practices:

### S3 Security Features
- **Block Public Access**: All public access is blocked by default
- **Server-Side Encryption**: S3-managed encryption enabled
- **SSL Enforcement**: Only HTTPS requests allowed
- **Versioning**: Enabled for data protection
- **Lifecycle Rules**: Automatic cleanup of old versions

### CloudFront Security Features
- **HTTPS Redirect**: All HTTP traffic redirected to HTTPS
- **Security Headers**: Comprehensive security headers including:
  - Content Security Policy (CSP)
  - Strict Transport Security (HSTS)
  - X-Frame-Options
  - X-Content-Type-Options
- **Origin Access Control**: Secure access to S3 without public bucket access
- **Minimum TLS 1.2**: Modern encryption standards

### IAM Security Features
- **Least Privilege**: Deployment role has minimal required permissions
- **OIDC Integration**: Secure GitHub Actions authentication without long-lived keys
- **Session Duration Limits**: 1-hour maximum session duration
- **Resource-Specific Permissions**: Scoped to specific S3 bucket and CloudFront distribution

## Step-by-Step Import Process

### Step 1: Gather Existing Resource Information

First, collect information about your existing AWS resources:

```bash
# Get your S3 bucket name (if you have permissions)
aws s3 ls | grep scottvangilder

# Get your CloudFront distribution ID
aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName,Status]' --output table

# Get your certificate ARN (if using custom domain)
aws acm list-certificates --region us-east-1 --query 'CertificateSummaryList[*].[CertificateArn,DomainName]' --output table
```

### Step 2: Update Configuration Files

Update the resource identifiers in the configuration files:

1. **Update `infrastructure/import-resources.json`**:
```json
{
  "version": 1,
  "resources": [
    {
      "resourceType": "AWS::S3::Bucket",
      "logicalId": "WebsiteBucket",
      "resourceIdentifier": {
        "BucketName": "your-actual-bucket-name"
      }
    },
    {
      "resourceType": "AWS::CloudFront::Distribution",
      "logicalId": "WebsiteDistribution",
      "resourceIdentifier": {
        "Id": "YOUR_ACTUAL_DISTRIBUTION_ID"
      }
    }
  ]
}
```

2. **Update `infrastructure/cdk.context.json`**:
```json
{
  "domainName": "scottvangilder.com",
  "certificateArn": "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERTIFICATE_ID"
}
```

### Step 3: Bootstrap CDK (if not already done)

```bash
cd infrastructure
cdk bootstrap
```

### Step 4: Build and Synthesize the Stack

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Synthesize the CloudFormation template
cdk synth
```

### Step 5: Import Existing Resources

**IMPORTANT**: This step will bring your existing resources under CDK management. Make sure you have backups and understand the implications.

```bash
# Import the resources
cdk import --resource-mapping import-resources.json

# Follow the interactive prompts to confirm each resource import
```

### Step 6: Verify the Import

```bash
# Check the stack status
cdk diff

# Verify no changes are needed (should show no differences)
cdk deploy --dry-run
```

## Post-Import Configuration

### Update GitHub Actions Workflow

After importing, update your GitHub Actions workflow to use the new IAM role:

1. **Get the role ARN from CDK output**:
```bash
cdk deploy --outputs-file outputs.json
cat outputs.json
```

2. **Update GitHub repository secrets**:
   - `AWS_ROLE_TO_ASSUME`: The role ARN from CDK output
   - `AWS_REGION`: Your deployment region (likely `us-east-1`)
   - `AWS_S3_BUCKET`: Your S3 bucket name
   - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

3. **Update `.github/workflows/deploy.yml`** (already configured for OIDC):
```yaml
- name: Assume Role with OIDC
  uses: aws-actions/configure-aws-credentials@v3
  with:
    role-to-assume: ${{ secrets.AWS_ROLE_TO_ASSUME }}
    aws-region: ${{ secrets.AWS_REGION }}
```

### Configure OIDC Provider (if not already done)

If you haven't set up GitHub OIDC provider in your AWS account:

```bash
# This is typically done once per AWS account
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

## Deployment and CI/CD Updates

### Local Development

```bash
# Deploy changes
cd infrastructure
npm run build
cdk deploy

# View differences before deploying
cdk diff
```

### Automated Deployment

Your GitHub Actions workflow will now:
1. Build your Next.js application
2. Assume the CDK-managed IAM role using OIDC
3. Deploy to the CDK-managed S3 bucket
4. Invalidate the CDK-managed CloudFront distribution

## Troubleshooting

### Common Import Issues

1. **Resource Not Found**:
   - Verify resource identifiers in `import-resources.json`
   - Ensure you have permissions to access the resources

2. **Permission Denied**:
   - Check your AWS credentials and permissions
   - Ensure you have CloudFormation permissions

3. **Resource Already Managed**:
   - The resource might already be managed by another CloudFormation stack
   - Use `aws cloudformation describe-stack-resources` to check

### Import Rollback

If you need to rollback the import:

```bash
# Delete the CDK stack (this will NOT delete the imported resources)
cdk destroy

# The resources will return to their unmanaged state
```

### Validation Commands

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name ScottVanGilderWebsiteStack

# Verify S3 bucket configuration
aws s3api get-bucket-policy --bucket your-bucket-name
aws s3api get-bucket-encryption --bucket your-bucket-name

# Verify CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## Best Practices

### Security Best Practices

1. **Regular Security Reviews**:
   - Review IAM policies quarterly
   - Monitor CloudTrail logs for unusual activity
   - Keep CDK and dependencies updated

2. **Backup Strategy**:
   - Enable S3 versioning (already configured)
   - Consider cross-region replication for critical data
   - Document recovery procedures

3. **Access Control**:
   - Use least privilege principles
   - Regularly rotate access keys
   - Monitor resource access patterns

### Operational Best Practices

1. **Version Control**:
   - Keep all infrastructure code in version control
   - Use meaningful commit messages
   - Tag releases for rollback capability

2. **Testing**:
   - Test infrastructure changes in a staging environment
   - Use `cdk diff` before deployments
   - Validate security configurations after changes

3. **Monitoring**:
   - Set up CloudWatch alarms for key metrics
   - Monitor costs and usage patterns
   - Enable AWS Config for compliance monitoring

### Development Workflow

1. **Making Changes**:
```bash
# Make changes to infrastructure/lib/infrastructure-stack.ts
cd infrastructure
npm run build
cdk diff  # Review changes
cdk deploy  # Deploy changes
```

2. **Adding New Resources**:
   - Follow the existing security patterns
   - Add appropriate outputs for CI/CD
   - Update documentation

3. **Emergency Procedures**:
   - Keep emergency access procedures documented
   - Have rollback plans for critical changes
   - Maintain contact information for AWS support

## Next Steps

After completing the import:

1. **Enable Additional Security Features**:
   - Set up AWS Config rules
   - Enable GuardDuty for threat detection
   - Configure CloudTrail for audit logging

2. **Optimize Performance**:
   - Review CloudFront cache behaviors
   - Optimize S3 storage classes
   - Monitor and tune performance metrics

3. **Cost Optimization**:
   - Set up cost alerts
   - Review and optimize resource configurations
   - Consider Reserved Instances for predictable workloads

4. **Disaster Recovery**:
   - Document recovery procedures
   - Test backup and restore processes
   - Consider multi-region deployment for critical applications

## Support and Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS CDK Import Documentation](https://docs.aws.amazon.com/cdk/v2/guide/cli.html#cli-import)
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/)
- [CloudFront Security Headers](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/adding-response-headers.html)

For issues specific to this setup, check the troubleshooting section above or review the CDK stack configuration in `infrastructure/lib/infrastructure-stack.ts`.