---
title: "Importing Decade-Old AWS Infrastructure into CDK: A Journey from ClickOps to Infrastructure as Code"
excerpt: "After 10+ years of managing my personal website infrastructure through the AWS console, I finally took the plunge into Infrastructure as Code using AWS CDK import. Here's the complete technical journey, including the challenges, solutions, and security improvements that came with modernizing legacy cloud resources."
date: "2025-07-16"
readTime: "12 min read"
tags: ["AWS", "CDK", "Infrastructure as Code", "IaC", "DevOps", "Security", "CloudFormation", "S3", "CloudFront"]
author: "Scott Van Gilder"
---

## Importing Decade-Old AWS Infrastructure into CDK

There’s something humbling about revisiting the AWS resources you spun up a decade ago. Back in 2016, I shepherded my personal site—scottvangilder.com—into existence purely through the AWS console. An S3 bucket became my origin, CloudFront wrapped it in a global CDN, and Route 53 quietly handled DNS. Over time, I even layered on a GitHub Actions workflow for deployments. But with every click in the console, I built myself into a corner: undocumented settings, fleeting muscle memory, and the constant anxiety of “What was that toggle again?”

After years of evangelizing Infrastructure as Code, I finally decided it was time to practice what I preached. AWS CDK’s import feature offered a graceful path: bring my existing “ClickOps” infrastructure under management without tearing anything down. The alternative—rebuilding from scratch or abandoning the console—felt reckless or shameful. Terraform crossed my mind, but I’m comfortable in the AWS ecosystem, so CDK import it was.

My first task was simple in theory: figure out what I actually had. I dusted off the AWS CLI and ran a few discovery commands:

```bash
aws s3 ls | grep scottvangilder
aws cloudfront list-distributions \
  --query 'DistributionList.Items[*].[Id,DomainName,Status]' \
  --output table
```

To my surprise, the S3 bucket was living in **us-west-2**, not the us-east-1 I’d always assumed. That little detail would become my first—and most instructive—gotcha.

With my detective work done, I scaffolded a fresh CDK project in TypeScript inside an `infrastructure/` folder. The generated directory structure felt familiar—`bin/`, `lib/`, `test/`, configuration files—and I dove into the stack definition, using low-level `CfnResource` constructs to mirror my bucket and distribution exactly:

```typescript
const bucket = new cdk.CfnResource(this, 'WebsiteBucket', {
  type: 'AWS::S3::Bucket',
  properties: { BucketName: 'scottvangilder.com' }
});

const distribution = new cdk.CfnResource(this, 'WebsiteDistribution', {
  type: 'AWS::CloudFront::Distribution',
  properties: {
    DistributionConfig: {
      Origins: [{
        Id: 'origin1',
        DomainName: 'scottvangilder.com.s3.amazonaws.com',
        S3OriginConfig: {}
      }],
      DefaultCacheBehavior: {
        TargetOriginId: 'origin1',
        ViewerProtocolPolicy: 'allow-all',
        AllowedMethods: ['GET','HEAD'],
        Compress: true
      },
      Enabled: true,
      DefaultRootObject: 'index.html'
    }
  }
});
```

Next came the import mapping file, which paired each logical ID in my code with the real-world resource identifiers:

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
        "Id": "E1U5RQF7T870K0" // example CF Distribution ID
      }
    }
  ]
}
```

When I ran `cdk import --resource-mapping import-resources.json`, CDK immediately complained about a “301 Moved Permanently”—a region mismatch between my default us-east-1 stack and the real us-west-2 bucket. Rather than risk migrating my live bucket, I updated my app entry point:

```typescript
new InfrastructureStack(app, 'ScottVanGilderWebsiteStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-west-2'
  }
});
```

With the region aligned, the import flew through, and my console-managed resources now lived under a CDK stack. From there, I finally had the power to layer in modern security hardening: blocking public access on S3, enforcing server-side encryption and versioning, forcing HTTPS via CloudFront’s `redirect-to-https` policy, and swapping long-lived keys for OIDC-based IAM roles for GitHub Actions.

I integrated CDK commands into my existing Makefile—`make infra-diff`, `make infra-deploy`, and so on—and overhauled the README with step-by-step IaC instructions. Suddenly, changes that used to take me hours of mental gymnastics were boiled down to `cdk diff` and `cdk deploy`. Best of all, every configuration was now versioned, reviewed, and tested alongside my application code.

Reflecting on the process, the biggest lessons weren’t about clever code patterns but about the importance of careful planning and incremental change. Start with a minimal import, verify every detail with `cdk diff`, and only then layer on new security or operational features. Documentation—both in code comments and in your README—turns muscle memory into shared team knowledge. And always double-check your regions.

Looking ahead, I’m excited to add AWS services to my personal website stack. But the real win is the peace of mind: I can now evolve my site’s infrastructure without fear. What began as a fragile decade-old ClickOps setup has transformed into a secure, maintainable, and testable IaC foundation—exactly the DevOps philosophy I’ve been preaching all these years.

*Curious to see the full code? Check out the [GitHub repo](https://github.com/scottyvg/ScottVanGilder.com). The `infrastructure/` directory has everything you need to follow along.*
