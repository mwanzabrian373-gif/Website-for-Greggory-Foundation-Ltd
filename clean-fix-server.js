const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

// Remove the orphaned catch block that's causing the syntax error
const orphanedCatch = / catch \(error\) \{\s*console\.error\("\[SERVER\] Error loading content routes:", error\.message\);\s*\}/g;
content = content.replace(orphanedCatch, '');

fs.writeFileSync(serverJsPath, content);
console.log('[CLEAN FIX] Orphaned catch block removed');