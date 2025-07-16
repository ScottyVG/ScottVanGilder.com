.PHONY: install build dev lint fix-lint deploy-local setup-aws-iam find-cloudfront-id help
.PHONY: infra-install infra-build infra-synth infra-diff infra-deploy infra-destroy infra-bootstrap

# Default target
help:
	@echo "Available commands:"
	@echo ""
	@echo "📦 Application Commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make build          - Build the Next.js app"
	@echo "  make dev            - Run development server"
	@echo "  make lint           - Run linter"
	@echo "  make fix-lint       - Fix linter errors"
	@echo "  make pre-commit     - Run pre-commit checks"
	@echo ""
	@echo "🏗️  Infrastructure Commands (requires AWS_PROFILE=adminrole):"
	@echo "  make infra-install  - Install CDK dependencies"
	@echo "  make infra-build    - Build CDK TypeScript code"
	@echo "  make infra-synth    - Synthesize CloudFormation template"
	@echo "  make infra-diff     - Show infrastructure changes"
	@echo "  make infra-deploy   - Deploy infrastructure changes"
	@echo "  make infra-destroy  - Destroy infrastructure (DANGEROUS)"
	@echo "  make infra-bootstrap - Bootstrap CDK (one-time setup)"
	@echo ""
	@echo "🚀 Deployment Commands:"
	@echo "  make deploy-local   - Test local deployment to S3"
	@echo "  make setup-aws-iam  - Set up AWS IAM user for deployment"
	@echo "  make find-cloudfront-id - Find your CloudFront distribution ID"

# Install dependencies
install:
	npm install

# Build the Next.js app
build:
	npm run build

# Run development server
dev:
	npm run dev

# Run linter
lint:
	npm run lint

# Fix linter errors
fix-lint:
	./scripts/fix-linter-errors.sh

# Test local deployment
deploy-local:
	./scripts/deploy-local.sh

# Set up AWS IAM user
setup-aws-iam:
	./scripts/setup-aws-iam.sh

# Find CloudFront distribution ID
find-cloudfront-id:
	./scripts/find-cloudfront-id.sh

# Pre-commit checks
pre-commit: fix-lint lint
	@echo "Pre-commit checks completed successfully!"

# Infrastructure as Code Commands
# These commands manage your AWS infrastructure using CDK
# Requires: AWS_PROFILE=adminrole to be set

# Install CDK dependencies
infra-install:
	@echo "📦 Installing CDK dependencies..."
	cd infrastructure && npm install

# Build CDK TypeScript code
infra-build:
	@echo "🏗️  Building CDK project..."
	cd infrastructure && npm run build

# Synthesize CloudFormation template (preview what will be deployed)
infra-synth: infra-build
	@echo "📋 Synthesizing CloudFormation template..."
	cd infrastructure && AWS_PROFILE=adminrole AWS_DEFAULT_REGION=us-west-2 cdk synth

# Show what infrastructure changes will be made
infra-diff: infra-build
	@echo "🔍 Checking for infrastructure changes..."
	cd infrastructure && AWS_PROFILE=adminrole AWS_DEFAULT_REGION=us-west-2 cdk diff

# Deploy infrastructure changes
infra-deploy: infra-build
	@echo "🚀 Deploying infrastructure changes..."
	@echo "⚠️  This will modify your AWS resources!"
	@read -p "Continue? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	cd infrastructure && AWS_PROFILE=adminrole AWS_DEFAULT_REGION=us-west-2 cdk deploy --outputs-file outputs.json

# Bootstrap CDK (one-time setup per region/account)
infra-bootstrap:
	@echo "🚀 Bootstrapping CDK in us-west-2..."
	@echo "⚠️  This is typically only needed once per AWS account/region"
	cd infrastructure && AWS_PROFILE=adminrole AWS_DEFAULT_REGION=us-west-2 cdk bootstrap

# Destroy infrastructure (DANGEROUS - will delete your resources)
infra-destroy: infra-build
	@echo "💥 DANGER: This will destroy your infrastructure!"
	@echo "⚠️  This will delete your S3 bucket, CloudFront distribution, and IAM roles!"
	@echo "⚠️  Your website will go offline!"
	@read -p "Are you absolutely sure? Type 'DELETE' to confirm: " confirm && [ "$$confirm" = "DELETE" ] || exit 1
	cd infrastructure && AWS_PROFILE=adminrole AWS_DEFAULT_REGION=us-west-2 cdk destroy