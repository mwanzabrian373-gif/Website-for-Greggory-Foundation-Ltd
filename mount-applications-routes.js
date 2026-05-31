const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Find the projects management routes section and add applications routes after it
const projectsManagementPattern = '// Projects Management Routes';
const projectsManagementEndPattern = '[SERVER] Projects management routes not available:';

const projectsManagementIndex = serverJsContent.indexOf(projectsManagementPattern);
const projectsManagementEndIndex = serverJsContent.indexOf(projectsManagementEndPattern, projectsManagementIndex);

if (projectsManagementIndex !== -1 && projectsManagementEndIndex !== -1) {
  const insertPoint = serverJsContent.indexOf('}', projectsManagementEndIndex);
  
  const applicationsRoutes = `
// Applications Management Routes
try {
  const applicationsManagementRoutes = require("./backend/routes/applications-management");
  app.use("/api/applications", applicationsManagementRoutes);
  console.log("[SERVER] Applications management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Applications management routes not available:", error.message);
}
`;
  
  const updatedContent = serverJsContent.substring(0, insertPoint + 1) + applicationsRoutes + serverJsContent.substring(insertPoint + 1);
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[MOUNT] Applications management routes added to server.js');
} else {
  console.log('[MOUNT] Could not find projects management routes section to insert applications routes');
}