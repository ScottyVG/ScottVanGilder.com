import { remark } from 'remark';
import html from 'remark-html';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: Record<string, BlogPost> = {
  'getting-started-with-aws-devops': {
    slug: 'getting-started-with-aws-devops',
    title: 'Getting Started with AWS DevOps: A Comprehensive Guide',
    excerpt: 'Learn the fundamentals of DevOps on AWS, including CI/CD pipelines, infrastructure as code, and best practices for cloud-native development.',
    content: `
# Getting Started with AWS DevOps: A Comprehensive Guide

DevOps on AWS combines the power of Amazon's cloud infrastructure with modern development practices to create scalable, reliable, and efficient software delivery pipelines.

## What is DevOps?

DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.

## Key AWS DevOps Services

### 1. AWS CodePipeline
AWS CodePipeline is a continuous integration and continuous delivery service for fast and reliable application and infrastructure updates.

### 2. AWS CodeBuild
A fully managed continuous integration service that compiles source code, runs tests, and produces software packages.

### 3. AWS CodeDeploy
Automates code deployments to any instance, including Amazon EC2 instances and on-premises servers.

### 4. AWS CloudFormation
Infrastructure as Code service that allows you to model and set up your AWS resources.

## Best Practices

1. **Start Small**: Begin with a simple pipeline and gradually add complexity
2. **Automate Everything**: From testing to deployment, automation is key
3. **Monitor Continuously**: Use CloudWatch and other monitoring tools
4. **Security First**: Implement security at every stage of your pipeline

## Conclusion

AWS provides a comprehensive suite of tools for implementing DevOps practices. Start with the basics and gradually build more sophisticated pipelines as your team grows comfortable with the tools.
    `,
    date: '2024-01-15',
    readTime: '8 min read',
    tags: ['AWS', 'DevOps', 'CI/CD', 'CloudFormation']
  },
  'terraform-best-practices': {
    slug: 'terraform-best-practices',
    title: 'Terraform Best Practices for Production Environments',
    excerpt: 'Discover essential Terraform patterns and practices for managing infrastructure at scale in production environments.',
    content: `
# Terraform Best Practices for Production Environments

Terraform is a powerful Infrastructure as Code (IaC) tool, but using it effectively in production requires following established best practices.

## Project Structure

### Organize Your Code
\`\`\`
terraform/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
├── modules/
│   ├── vpc/
│   ├── ec2/
│   └── rds/
└── shared/
\`\`\`

## State Management

### Use Remote State
Always use remote state backends like S3 with DynamoDB for locking:

\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
\`\`\`

## Security Best Practices

1. **Never commit secrets**: Use AWS Secrets Manager or Parameter Store
2. **Enable state encryption**: Always encrypt your state files
3. **Use least privilege**: Apply minimal required permissions
4. **Regular security audits**: Review your infrastructure regularly

## Module Design

### Keep Modules Simple
- Single responsibility principle
- Clear input/output variables
- Comprehensive documentation
- Version your modules

## Testing

### Validate Your Code
- Use \`terraform validate\`
- Implement automated testing with tools like Terratest
- Plan before apply in CI/CD pipelines

## Conclusion

Following these best practices will help you maintain reliable, secure, and scalable infrastructure with Terraform.
    `,
    date: '2024-01-10',
    readTime: '12 min read',
    tags: ['Terraform', 'IaC', 'Best Practices', 'Production']
  },
  'kubernetes-monitoring-observability': {
    slug: 'kubernetes-monitoring-observability',
    title: 'Kubernetes Monitoring and Observability with Prometheus',
    excerpt: 'A deep dive into setting up comprehensive monitoring and observability for Kubernetes clusters using Prometheus and Grafana.',
    content: `
# Kubernetes Monitoring and Observability with Prometheus

Effective monitoring and observability are crucial for maintaining healthy Kubernetes clusters in production environments.

## The Observability Stack

### Core Components
- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and management
- **Jaeger**: Distributed tracing

## Setting Up Prometheus

### Installation with Helm
\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
\`\`\`

## Key Metrics to Monitor

### Cluster Level
- Node resource utilization
- Pod scheduling and failures
- Network performance
- Storage usage

### Application Level
- Request rates and latency
- Error rates
- Resource consumption
- Custom business metrics

## Alerting Strategy

### Critical Alerts
- Node down
- High memory/CPU usage
- Pod crash loops
- Storage space low

### Warning Alerts
- Approaching resource limits
- Slow response times
- Unusual traffic patterns

## Best Practices

1. **Start with Golden Signals**: Latency, traffic, errors, and saturation
2. **Use Labels Wisely**: Proper labeling for effective querying
3. **Set Appropriate Retention**: Balance storage costs with data needs
4. **Regular Review**: Continuously improve your monitoring setup

## Grafana Dashboards

Create dashboards for:
- Cluster overview
- Node details
- Application performance
- Business metrics

## Conclusion

A well-designed monitoring and observability strategy is essential for operating Kubernetes clusters successfully. Start with the basics and gradually add more sophisticated monitoring as your needs grow.
    `,
    date: '2024-01-05',
    readTime: '15 min read',
    tags: ['Kubernetes', 'Monitoring', 'Prometheus', 'Observability']
  }
};

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export function getAllPosts(): BlogPost[] {
  return Object.values(blogPosts).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  return blogPosts[slug] || null;
}