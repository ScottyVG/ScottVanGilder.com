#!/bin/bash

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook to run linter checks and security scanning

echo "🔍 Running pre-commit checks..."

# Run the fix-lint script if it exists
if [ -f "./scripts/fix-linter-errors.sh" ]; then
  echo "🔧 Fixing linter errors..."
  ./scripts/fix-linter-errors.sh
fi

# Run the linter
echo "📝 Running linter..."
npm run lint

# If the linter fails, prevent the commit
if [ $? -ne 0 ]; then
  echo "❌ Linter errors found. Please fix them before committing."
  exit 1
fi

# Run security audit
echo "🔒 Running security audit..."
npm run security:audit

# If security audit fails, prevent the commit
if [ $? -ne 0 ]; then
  echo "❌ Security vulnerabilities found. Please run 'npm run security:fix' or review the issues."
  echo "💡 You can also run 'npm audit --audit-level=high' to only fail on high/critical issues."
  exit 1
fi

# Run gitleaks to detect secrets
echo "🔐 Scanning for secrets and sensitive information..."
npm run security:secrets

# If gitleaks finds secrets, prevent the commit
if [ $? -ne 0 ]; then
  echo "❌ Secrets or sensitive information detected! Check gitleaks-report.json for details."
  echo "💡 Remove any secrets, API keys, or sensitive data before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
exit 0
EOF

# Make the pre-commit hook executable
chmod +x .git/hooks/pre-commit

echo "Git hooks have been set up successfully!"