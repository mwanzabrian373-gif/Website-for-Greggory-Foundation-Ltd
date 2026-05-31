const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the user management routes section and add projects routes after it
const userManagementPattern = '// User Management Routes';
const userManagementEndPattern = '[SERVER] User management routes not available:';

const userManagementIndex = serverJsContent.indexOf(userManagementPattern);
const userManagementEndIndex = serverJsContent.indexOf(userManagementEndPattern, userManagementIndex);

if (userManagementIndex !== -1 && userManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', userManagementEndIndex);
  
  const projectsRoutes = `
// Projects Management Routes
try {
  const projectsManagementRoutes = require("./backend/routes/projects-management");
  app.use("/api/projects", projectsManagementRoutes);
  console.log("[SERVER] Projects management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Projects management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + projectsRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Projects management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find user management routes section to insert projects routes');
}