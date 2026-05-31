const fs = require('fs');
const path = require('path');

const serverJsPath = path.join(__dirname, 'server.js');
const serverJsContent = fs.readFileSync(serverJsPath, 'utf8');

console.log('[FIX] Fixing server.js syntax error...');

// Fix the specific syntax error caused by the mount script
const brokenContent = `  console.log("[SERVER] Content routes loaded successfully");
} catch (error) {
  console.log("[SERVER] Content routes not available:", error.message);
}
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

const fixedContent = `  console.log("[SERVER] Content routes loaded successfully");
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
  console.log('[FIX] server.js syntax error fixed successfully');
} else {
  console.log('[FIX] Trying alternative fix...');
  
  // Alternative: just remove the extra brace and orphaned catch
  const updatedContent = serverJsContent
    .replace('}\n}\n// User Management Routes', '}\n\n// User Management Routes')
    .replace('} catch (error) {\n  console.error("[SERVER] Error loading content routes:", error.message);\n}', '');
  
  fs.writeFileSync(serverJsPath, updatedContent);
  console.log('[FIX] Applied alternative fix');
}