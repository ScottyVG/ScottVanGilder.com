#!/bin/bash

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook to run linter checks

echo "Running pre-commit checks..."

# Run the fix-lint script
echo "Fixing linter errors..."
./scripts/fix-linter-errors.sh

# Run the linter
echo "Running linter..."
npm run lint

# If the linter fails, prevent the commit
if [ $? -ne 0 ]; then
  echo "Linter errors found. Please fix them before committing."
  exit 1
fi

echo "Pre-commit checks passed!"
exit 0
EOF

# Make the pre-commit hook executable
chmod +x .git/hooks/pre-commit

echo "Git hooks have been set up successfully!"