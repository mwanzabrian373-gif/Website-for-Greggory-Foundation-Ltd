const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the analytics management routes section and add reports routes after it
const analyticsManagementPattern = '// Analytics Management Routes';
const analyticsManagementEndPattern = '[SERVER] Analytics management routes not available:';

const analyticsManagementIndex = serverJsContent.indexOf(analyticsManagementPattern);
const analyticsManagementEndIndex = serverJsContent.indexOf(analyticsManagementEndPattern, analyticsManagementIndex);

if (analyticsManagementIndex !== -1 && analyticsManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', analyticsManagementEndIndex);
  
  const reportsRoutes = `
// Reports Management Routes
try {
  const reportsManagementRoutes = require("./backend/routes/reports-management");
  app.use("/api/reports", reportsManagementRoutes);
  console.log("[SERVER] Reports management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Reports management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + reportsRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Reports management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find analytics management routes section to insert reports routes');
}