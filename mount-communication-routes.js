const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the reports management routes section and add communication routes after it
const reportsManagementPattern = '// Reports Management Routes';
const reportsManagementEndPattern = '[SERVER] Reports management routes not available:';

const reportsManagementIndex = serverJsContent.indexOf(reportsManagementPattern);
const reportsManagementEndIndex = serverJsContent.indexOf(reportsManagementEndPattern, reportsManagementIndex);

if (reportsManagementIndex !== -1 && reportsManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', reportsManagementEndIndex);
  
  const communicationRoutes = `
// Communication Management Routes
try {
  const communicationManagementRoutes = require("./backend/routes/communication-management");
  app.use("/api/communication", communicationManagementRoutes);
  console.log("[SERVER] Communication management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Communication management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + communicationRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Communication management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find reports management routes section to insert communication routes');
}