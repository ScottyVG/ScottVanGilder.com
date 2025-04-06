#!/bin/bash

# This script fixes common linter errors in the Next.js project

# # Add React import to all component files
# echo "Adding React imports to component files..."
# find src -name "*.tsx" -exec sed -i '' '1i\
# import React from "react";
# ' {} \;

# Install missing dependencies
echo "Installing missing dependencies..."
npm install next react react-dom

echo "Linter errors should be fixed now. Run 'npm run lint' to verify."