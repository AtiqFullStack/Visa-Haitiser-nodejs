const fs = require('fs');
const path = require('path');

const controllerFiles = [
    'src/controllers/upload.controller.js',
    'src/controllers/admin/template.controller.js',
    'src/controllers/admin/QrControllers.js',
    'src/controllers/admin/dashboard.controller.js'
];

controllerFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if module.exports already exists
    if (content.includes('module.exports')) {
        console.log(`Skipping ${filePath} - already has module.exports`);
        return;
    }
    
    // Extract function names (const functionName = ...)
    const functionMatches = content.matchAll(/const\s+(\w+)\s*=\s*asyncHandler/g);
    const functions = Array.from(functionMatches).map(match => match[1]);
    
    if (functions.length > 0) {
        const exports = `\nmodule.exports = {\n    ${functions.join(',\n    ')}\n};\n`;
        content += exports;
        fs.writeFileSync(fullPath, content);
        console.log(`Added exports to ${filePath}: ${functions.join(', ')}`);
    } else {
        console.log(`No functions found in ${filePath}`);
    }
});

console.log('\nDone!');
