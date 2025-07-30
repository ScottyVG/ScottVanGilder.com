# Pre-Commit Hooks Setup

This project uses pre-commit hooks to ensure code quality and security before commits are made.

## What the Pre-Commit Hook Does

The pre-commit hook automatically runs the following checks:

1. **🔧 Linter Error Fixing**: Runs `./scripts/fix-linter-errors.sh` to automatically fix common linting issues
2. **📝 Linting**: Runs `npm run lint` to check for code style and quality issues
3. **🔒 Security Audit**: Runs `npm run security:audit` to check for known security vulnerabilities
4. **🔐 Secret Detection**: Runs `npm run security:secrets` (gitleaks) to detect secrets, API keys, and sensitive information

## Available Scripts

- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint with automatic fixing
- `npm run security:audit` - Run npm audit with moderate+ severity threshold
- `npm run security:fix` - Automatically fix security vulnerabilities where possible
- `npm run security:secrets` - Run gitleaks to detect secrets and sensitive information
- `npm run pre-commit` - Run all checks (linting, security audit, and secret detection)

## Setup

To set up or update the pre-commit hooks, run:

```bash
./scripts/setup-git-hooks.sh
```

## Bypassing Pre-Commit Hooks

If you need to bypass the pre-commit hooks in an emergency (not recommended), you can use:

```bash
git commit --no-verify -m "your commit message"
```

## Troubleshooting

### Linting Errors
If the pre-commit hook fails due to linting errors:
1. Run `npm run lint:fix` to automatically fix issues
2. Manually fix any remaining issues
3. Try committing again

### Security Vulnerabilities
If the pre-commit hook fails due to security issues:
1. Run `npm run security:fix` to automatically fix vulnerabilities
2. Review the audit report with `npm audit`
3. For high-severity issues only, you can adjust the audit level in package.json

### Secret Detection
If the pre-commit hook fails due to detected secrets:
1. Review the `gitleaks-report.json` file for details
2. Remove any secrets, API keys, passwords, or sensitive data from your code
3. Consider using environment variables or secure secret management
4. Try committing again after removing the sensitive information

### Hook Not Running
If the pre-commit hook isn't running:
1. Ensure the hook file exists: `ls -la .git/hooks/pre-commit`
2. Ensure it's executable: `chmod +x .git/hooks/pre-commit`
3. Re-run the setup script: `./scripts/setup-git-hooks.sh`