.PHONY: install build dev lint fix-lint deploy-local setup-aws-iam find-cloudfront-id help

# Default target
help:
	@echo "Available commands:"
	@echo "  make install        - Install dependencies"
	@echo "  make build          - Build the Next.js app"
	@echo "  make dev            - Run development server"
	@echo "  make lint           - Run linter"
	@echo "  make fix-lint       - Fix linter errors"
	@echo "  make deploy-local   - Test local deployment to S3"
	@echo "  make setup-aws-iam  - Set up AWS IAM user for deployment"
	@echo "  make find-cloudfront-id - Find your CloudFront distribution ID"
	@echo "  make pre-commit     - Run pre-commit checks"

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