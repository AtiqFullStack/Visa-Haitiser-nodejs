#!/bin/bash

# Script to remove TypeScript files after conversion

echo "This script will delete all .ts files from the src directory."
echo "Make sure you have tested the JavaScript files before running this!"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

echo "Removing TypeScript files..."

# Remove all .ts files except .d.ts files
find src -name "*.ts" -not -name "*.d.ts" -type f -delete

# Remove tsconfig.json
if [ -f "tsconfig.json" ]; then
    rm tsconfig.json
    echo "Removed tsconfig.json"
fi

# Remove index.ts from root
if [ -f "index.ts" ]; then
    rm index.ts
    echo "Removed index.ts"
fi

echo "Cleanup complete!"
echo "All TypeScript files have been removed."
