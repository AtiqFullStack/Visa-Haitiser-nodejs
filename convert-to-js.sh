#!/bin/bash

# Script to convert TypeScript files to JavaScript by removing type annotations

echo "Converting TypeScript files to JavaScript..."

# Find all .ts files (excluding .d.ts files)
find src -name "*.ts" -not -name "*.d.ts" | while read tsfile; do
    # Get the corresponding .js filename
    jsfile="${tsfile%.ts}.js"
    
    # Skip if .js file already exists
    if [ -f "$jsfile" ]; then
        echo "Skipping $tsfile (JS file already exists)"
        continue
    fi
    
    echo "Converting: $tsfile -> $jsfile"
    
    # Basic conversion using sed
    sed -E \
        -e 's/^import (.*) from/const \1 = require/g' \
        -e "s/^import (.*) from/const \1 = require/g" \
        -e 's/^export default /module.exports = /g' \
        -e 's/^export \{ (.*) \}/module.exports = { \1 }/g' \
        -e 's/^export \* from/module.exports = require/g' \
        -e 's/: [A-Za-z<>[\]|&, ]*(\{|=|;|\))/\1/g' \
        -e 's/interface [A-Za-z]* \{/\/\/ interface removed/g' \
        -e 's/type [A-Za-z<>]* = .*/\/\/ type removed/g' \
        "$tsfile" > "$jsfile"
done

echo "Conversion complete!"
echo "Note: Manual review recommended for complex type definitions"
