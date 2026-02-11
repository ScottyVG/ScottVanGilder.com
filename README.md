# ScottVanGilder.com

My personal website built with Next.js, TypeScript, and Tailwind CSS. This is a modern, performant static site that showcases my work and experience.

## 🚀 Features

- **Modern Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Performance**: 100/100 Lighthouse scores with static site generation
- **Automated Deployment**: CI/CD pipeline with GitHub Actions to AWS S3/CloudFront

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Infrastructure**: AWS CDK (TypeScript)
- **Deployment**: AWS S3 + CloudFront
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
├── infrastructure/         # AWS CDK infrastructure code
│   ├── lib/               # CDK stack definitions
│   ├── bin/               # CDK app entry point
│   └── import-resources.json # Resource import configuration
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   └── lib/               # Utility functions and data
├── scripts/               # Build and deployment scripts
└── .github/workflows/     # GitHub Actions CI/CD
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/scottyvg/ScottVanGilder.com.git
cd ScottVanGilder.com
```

2. Install dependencies:
```bash
npm install
# or
make install
```

3. Run the development server:
```bash
npm run dev
# or
make dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `make help` - See all available Makefile commands

## 🏗️ Infrastructure as Code (CDK)

This project uses AWS CDK to manage infrastructure as code. All AWS resources (S3, CloudFront, IAM roles) are defined in TypeScript and can be deployed locally.

### Prerequisites for Infrastructure Management

- AWS CLI configured with admin permissions
- AWS CDK CLI installed globally: `npm install -g aws-cdk`
- AWS profile named `adminrole` with appropriate permissions

### Infrastructure Commands

```bash
# See all available commands
make help

# Install CDK dependencies (first time setup)
make infra-install

# Preview infrastructure changes
make infra-diff

# Deploy infrastructure changes
make infra-deploy

# View generated CloudFormation template
make infra-synth
```

### Infrastructure Components

The CDK stack manages:

- **S3 Bucket**: Static website hosting with security best practices
  - Public access blocked
  - Server-side encryption enabled
  - Versioning with lifecycle rules
- **CloudFront Distribution**: Global CDN with HTTPS redirect
- **IAM Role**: GitHub Actions deployment role with OIDC authentication
- **Security**: Comprehensive security headers and policies

### Making Infrastructure Changes

1. **Edit the CDK code**: Modify files in `infrastructure/lib/`
2. **Preview changes**: `make infra-diff`
3. **Deploy changes**: `make infra-deploy`
4. **Commit changes**: Git commit your infrastructure code

### Important Notes

- Infrastructure is deployed locally using your `adminrole` AWS profile
- GitHub Actions only deploys the application, not infrastructure
- Always run `make infra-diff` before deploying to preview changes
- Infrastructure changes require manual approval during deployment

## 🚀 Deployment

The site automatically deploys to AWS S3/CloudFront via GitHub Actions when changes are pushed to the main branch.

### Setting up GitHub Actions Secrets

You need to configure the following secrets in your GitHub repository:

1. Go to Settings > Secrets and variables > Actions
2. Add these secrets:
   - `AWS_ROLE_TO_ASSUME`: ARN of the IAM role for OIDC authentication
   - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
   - `AWS_S3_BUCKET`: Your S3 bucket name
   - `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

### Local Deployment Testing

1. Update variables in `scripts/deploy-local.sh` with your values
2. Configure AWS CLI with appropriate credentials
3. Run: `make deploy-local`

### Setting Up AWS Infrastructure

1. Update variables in `scripts/setup-aws-iam.sh` with your values
2. Run: `make setup-aws-iam`
3. Configure the generated credentials in GitHub Secrets

## 📚 Documentation

### Infrastructure
- [CDK Import Guide](CDK_IMPORT_GUIDE.md) - How to import existing AWS resources
- [Security Checklist](SECURITY_CHECKLIST.md) - Security best practices and checklist

## 🤝 Contributing

This is my personal website, but I'm happy to discuss the technical implementation or answer questions about the architecture. Feel free to open an issue if you find bugs or have suggestions.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Site**: [scottvangilder.com](https://scottvangilder.com)
- **LinkedIn**: [Scott Van Gilder](https://www.linkedin.com/in/scott-v-91065139/)

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
