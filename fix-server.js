const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

// Fix the broken try-catch structure
const brokenContent = `// Content Routes
try {
  const contentRoutes = require("./backend/routes/content");
  app.use("/api/content", contentRoutes);
  console.log("[SERVER] Content routes loaded successfully");
}
// User Management Routes
try {
  const userManagementRoutes = require("./backend/routes/user-management");
  app.use("/api/users", userManagementRoutes);
  console.log("[SERVER] User management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] User management routes not available:", error.message);
}
 catch (error) {
  console.error("[SERVER] Error loading content routes:", error.message);
}`;

const fixedContent = `// Content Routes
try {
  const contentRoutes = require("./backend/routes/content");
  app.use("/api/content", contentRoutes);
  console.log("[SERVER] Content routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Content routes not available:", error.message);
}

// User Management Routes
try {
  const userManagementRoutes = require("./backend/routes/user-management");
  app.use("/api/users", userManagementRoutes);
  console.log("[SERVER] User management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] User management routes not available:", error.message);
}`;

if (serverJsContent.includes(brokenContent)) {
  const updatedContent = serverJsContent.replace(brokenContent, fixedContent);
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[FIX] server.js syntax error corrected successfully');
} else {
  console.log('[FIX] Broken content not found, trying alternative fix...');
  
  // Alternative fix - just remove the orphaned catch block
  const altBrokenContent = `  console.log("[SERVER] Content routes loaded successfully");
}
// User Management Routes
try {
  const userManagementRoutes = require("./backend/routes/user-management");
  app.use("/api/users", userManagementRoutes);
  console.log("[SERVER] User management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] User management routes not available:", error.message);
}
 catch (error) {
  console.error("[SERVER] Error loading content routes:", error.message);
}`;

  const altFixedContent = `  console.log("[SERVER] Content routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Content routes not available:", error.message);
}

// User Management Routes
try {
  const userManagementRoutes = require("./backend/routes/user-management");
  app.use("/api/users", userManagementRoutes);
  console.log("[SERVER] User management routes loaded successfully");
} catch (error) {
  console.log("[SERVER] User management routes not available:", error.message);
}`;

  if (serverJsContent.includes(altBrokenContent)) {
    const updatedContent = serverJsContent.replace(altBrokenContent, altFixedContent);
    fs.writeFileSync(serverJsPath, updatedContent);
    console.log('[FIX] server.js syntax error corrected (alternative fix)');
  } else {
    console.log('[FIX] Could not find the broken content to fix');
  }
}