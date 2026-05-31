const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
let serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Simple fix: remove the orphaned catch block and add proper catch to content routes
const lines = serverJsContent.split('\n');
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip the orphaned catch block
  if (line.includes(' catch (error)') && line.includes('Error loading content routes')) {
    continue;
  }
  
  // Add catch block for content routes after the console.log line
  if (line.includes('[SERVER] Content routes loaded successfully')) {
    fixedLines.push(line);
    fixedLines.push('} catch (error) {');
    fixedLines.push('  console.log("[SERVER] Content routes not available:", error.message);');
    fixedLines.push('}');
    continue;
  }
  
  fixedLines.push(line);
}

fs.writeFileSync(serverJsPath, fixedLines.join('\n'));
console.log('[FIX] server.js syntax error fixed');