const fs = require('fs');
const path = require('path');

function convertTsToJs(content) {
    let js = content;
    
    // Convert imports to require
    js = js.replace(/import\s+(\{[^}]+\})\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')');
    js = js.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')');
    js = js.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require(\'$2\')');
    js = js.replace(/import\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]/g, '// type import removed');
    js = js.replace(/import\s+type\s+[^;]+;/g, '// type import removed');
    
    // Convert exports
    js = js.replace(/export\s+default\s+/g, 'module.exports = ');
    js = js.replace(/export\s+\{([^}]+)\}/g, 'module.exports = {$1}');
    js = js.replace(/export\s+const\s+(\w+)/g, 'const $1');
    js = js.replace(/export\s+function\s+(\w+)/g, 'function $1');
    js = js.replace(/export\s+class\s+(\w+)/g, 'class $1');
    
    // Remove type annotations from function parameters
    js = js.replace(/(\w+)\s*:\s*[A-Za-z<>[\]|&, ]+(\s*[,)])/g, '$1$2');
    
    // Remove return type annotations
    js = js.replace(/\)\s*:\s*[A-Za-z<>[\]|&, ]+\s*\{/g, ') {');
    js = js.replace(/\)\s*:\s*Promise<[^>]+>\s*\{/g, ') {');
    
    // Remove interface and type definitions
    js = js.replace(/interface\s+\w+\s*\{[^}]*\}/gs, '// interface removed');
    js = js.replace(/type\s+\w+\s*=\s*[^;]+;/g, '// type removed');
    
    // Remove 'as' type assertions
    js = js.replace(/\s+as\s+[A-Za-z<>[\]|&, ]+/g, '');
    
    // Remove generic type parameters
    js = js.replace(/<[A-Za-z<>[\]|&, ]+>/g, '');
    
    return js;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            const jsPath = filePath.replace(/\.ts$/, '.js');
            
            // Skip if JS file already exists
            if (fs.existsSync(jsPath)) {
                console.log(`Skipping ${filePath} (JS file exists)`);
                return;
            }
            
            console.log(`Converting: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf8');
            const jsContent = convertTsToJs(content);
            fs.writeFileSync(jsPath, jsContent);
        }
    });
}

// Start conversion
const srcDir = path.join(__dirname, 'src');
console.log('Starting TypeScript to JavaScript conversion...\n');
processDirectory(srcDir);
console.log('\nConversion complete!');
console.log('Note: Please review the converted files and make manual adjustments if needed.');
