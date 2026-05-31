const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the content management routes section and add analytics routes after it
const contentManagementPattern = '// Content Management Routes';
const contentManagementEndPattern = '[SERVER] Content management routes not available:';

const contentManagementIndex = serverJsContent.indexOf(contentManagementPattern);
const contentManagementEndIndex = serverJsContent.indexOf(contentManagementEndPattern, contentManagementIndex);

if (contentManagementIndex !== -1 && contentManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', contentManagementEndIndex);
  
  const analyticsRoutes = `
// Analytics Management Routes
try {
  const analyticsManagementRoutes = require("./backend/routes/analytics-management");
  app.use("/api/analytics", analyticsManagementRoutes);
  console.log("[SERVER] Analytics management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Analytics management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + analyticsRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Analytics management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find content management routes section to insert analytics routes');
}