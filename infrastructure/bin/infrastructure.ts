#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

// Get configuration from context or environment variables
const domainName = app.node.tryGetContext('domainName') || process.env.DOMAIN_NAME || 'scottvangilder.com';
const certificateArn = app.node.tryGetContext('certificateArn') || process.env.CERTIFICATE_ARN;

new InfrastructureStack(app, 'ScottVanGilderWebsiteStack', {
  domainName,
  certificateArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2', // S3 bucket is actually in us-west-2
  },
  description: 'Static website infrastructure for ScottVanGilder.com with S3 and CloudFront',
});