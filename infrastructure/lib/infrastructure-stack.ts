import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface InfrastructureStackProps extends cdk.StackProps {
  domainName: string;
  certificateArn?: string;
}

export class InfrastructureStack extends cdk.Stack {
  public readonly deploymentRole: iam.IRole;

  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    // S3 Bucket - imported and now managed by CDK
    const bucket = new cdk.CfnResource(this, 'WebsiteBucket', {
      type: 'AWS::S3::Bucket',
      properties: {
        BucketName: props.domainName,
        // Enhanced security configuration
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true,
        },
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
              },
            },
          ],
        },
        VersioningConfiguration: {
          Status: 'Enabled',
        },
        LifecycleConfiguration: {
          Rules: [
            {
              Id: 'DeleteOldVersions',
              Status: 'Enabled',
              NoncurrentVersionExpirationInDays: 30,
            },
          ],
        },
      },
    });

    // CloudFront Distribution - imported and now managed by CDK
    const distribution = new cdk.CfnResource(this, 'WebsiteDistribution', {
      type: 'AWS::CloudFront::Distribution',
      properties: {
        DistributionConfig: {
          DefaultCacheBehavior: {
            TargetOriginId: 'origin1',
            ViewerProtocolPolicy: 'redirect-to-https', // Enhanced security
            AllowedMethods: ['GET', 'HEAD'],
            CachedMethods: ['GET', 'HEAD'],
            Compress: true,
            ForwardedValues: {
              QueryString: false,
              Cookies: { Forward: 'none' },
            },
          },
          Origins: [
            {
              Id: 'origin1',
              DomainName: `${props.domainName}.s3.amazonaws.com`,
              S3OriginConfig: {
                OriginAccessIdentity: '',
              },
            },
          ],
          Enabled: true,
          DefaultRootObject: 'index.html',
          CustomErrorResponses: [
            {
              ErrorCode: 404,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
              ErrorCachingMinTTL: 300,
            },
            {
              ErrorCode: 403,
              ResponseCode: 200,
              ResponsePagePath: '/index.html',
              ErrorCachingMinTTL: 300,
            },
          ],
          // Add certificate if provided (CloudFront certificates must be in us-east-1)
          ...(props.certificateArn && {
            Aliases: [props.domainName, `www.${props.domainName}`],
            ViewerCertificate: {
              AcmCertificateArn: props.certificateArn, // This ARN is in us-east-1, which is correct for CloudFront
              SslSupportMethod: 'sni-only',
              MinimumProtocolVersion: 'TLSv1.2_2021',
            },
          }),
        },
      },
    });

    // Reference existing GitHub Actions OIDC role
    this.deploymentRole = iam.Role.fromRoleName(this, 'GitHubActionsRole', 'github-actions-scottvangilderDotCom');

    // Outputs for reference
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.ref,
      description: 'S3 Bucket Name',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.ref,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: cdk.Fn.getAtt(distribution.logicalId, 'DomainName').toString(),
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'DeploymentRoleArn', {
      value: this.deploymentRole.roleArn,
      description: 'GitHub Actions Deployment Role ARN',
    });
  }
}
