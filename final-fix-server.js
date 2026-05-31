const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

console.log('[FINAL FIX] Removing orphaned catch block...');

// Remove the orphaned catch block at lines 4095-4097
const orphanedCatch = ` catch (error) {
  console.error("[SERVER] Error loading content routes:", error.message);
}`;

const updatedContent = serverJsContent.replace(orphanedCatch, '');

fs.writeFileSync(serverJsPath, updatedContent);
console.log('[FINAL FIX] Orphaned catch block removed successfully');