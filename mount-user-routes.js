const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the content routes section and add user management routes after it
const contentRoutesPattern = '// Content Routes';
const contentRoutesEndPattern = '} catch (error)';

const contentRoutesIndex = serverJsContent.indexOf(contentRoutesPattern);
const contentRoutesEndIndex = serverJsContent.indexOf(contentRoutesEndPattern, contentRoutesIndex);

if (contentRoutesIndex !== -1 && contentRoutesEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', contentRoutesEndIndex);
  
  const userManagementRoutes = `
// User Management Routes
try {
  const userManagementRoutes = require("./backend/routes/user-management");
  app.use("/api/users", userManagementRoutes);
  console.log("[SERVER] User management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] User management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + userManagementRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] User management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find content routes section to insert user management routes');
}