const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the applications management routes section and add content routes after it
const applicationsManagementPattern = '// Applications Management Routes';
const applicationsManagementEndPattern = '[SERVER] Applications management routes not available:';

const applicationsManagementIndex = serverJsContent.indexOf(applicationsManagementPattern);
const applicationsManagementEndIndex = serverJsContent.indexOf(applicationsManagementEndPattern, applicationsManagementIndex);

if (applicationsManagementIndex !== -1 && applicationsManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', applicationsManagementEndIndex);
  
  const contentRoutes = `
// Content Management Routes
try {
  const contentManagementRoutes = require("./backend/routes/content-management");
  app.use("/api/content-management", contentManagementRoutes);
  console.log("[SERVER] Content management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Content management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + contentRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Content management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find applications management routes section to insert content routes');
}