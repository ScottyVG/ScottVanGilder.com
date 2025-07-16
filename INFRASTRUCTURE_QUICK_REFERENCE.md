# Infrastructure Quick Reference

## 🚀 Common Infrastructure Tasks

### Daily Operations

```bash
# Check what infrastructure changes would be made
make infra-diff

# Deploy infrastructure changes (with confirmation)
make infra-deploy

# View the generated CloudFormation template
make infra-synth
```

### First Time Setup

```bash
# Install CDK dependencies
make infra-install

# Bootstrap CDK (only needed once per AWS account/region)
make infra-bootstrap
```

### Prerequisites

- **AWS Profile**: Must have `adminrole` profile configured
- **Region**: Infrastructure is deployed to `us-west-2`
- **Permissions**: Admin-level permissions required for CDK operations

## 📋 Infrastructure Components

### Current Stack: `ScottVanGilderWebsiteStack`

| Resource | Type | Purpose |
|----------|------|---------|
| S3 Bucket | `scottvangilder.com` | Static website hosting |
| CloudFront Distribution | `E256LY0L024L6G` | Global CDN |
| IAM Role | `github-actions-scottvangilderDotCom` | GitHub Actions deployment |

### Security Features

- ✅ S3 public access blocked
- ✅ Server-side encryption enabled
- ✅ CloudFront HTTPS redirect
- ✅ OIDC authentication for GitHub Actions
- ✅ Least privilege IAM policies

## 🔧 Making Infrastructure Changes

### 1. Edit CDK Code
```bash
# Infrastructure code is in:
infrastructure/lib/infrastructure-stack.ts
infrastructure/bin/infrastructure.ts
```

### 2. Preview Changes
```bash
make infra-diff
```

### 3. Deploy Changes
```bash
make infra-deploy
# Will prompt for confirmation before deploying
```

### 4. Commit Changes
```bash
git add infrastructure/
git commit -m "Update infrastructure: [describe changes]"
git push
```

## ⚠️ Important Notes

### Deployment Flow
- **Infrastructure**: Deployed locally with `make infra-deploy`
- **Application**: Deployed via GitHub Actions on push to main

### Safety Features
- `make infra-deploy` requires manual confirmation
- `make infra-destroy` requires typing "DELETE" to confirm
- Always run `make infra-diff` first to preview changes

### Troubleshooting

```bash
# If CDK dependencies are out of sync
make infra-install

# If TypeScript compilation fails
make infra-build

# If you need to see the raw CloudFormation
make infra-synth
```

## 🆘 Emergency Procedures

### Rollback Infrastructure
```bash
# Revert to previous commit
git revert HEAD
make infra-deploy
```

### Complete Infrastructure Rebuild
```bash
# DANGER: This destroys everything!
make infra-destroy
# Then redeploy
make infra-deploy
```

## 📞 Support Resources

- [CDK Import Guide](CDK_IMPORT_GUIDE.md) - Detailed import documentation
- [Security Checklist](SECURITY_CHECKLIST.md) - Security best practices
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)

---

**Remember**: Infrastructure changes are deployed locally, application changes deploy via GitHub Actions!