import express, { type Express } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStaticFiles(app: Express): void {
  // Path to the built client files
  // In production, the structure is: dist/production.js and dist/public/*
  const distPath = path.join(__dirname, "public");
  const indexPath = path.join(distPath, "index.html");
  
  console.log(`📁 Looking for static files in: ${distPath}`);
  console.log(`📄 Index file path: ${indexPath}`);
  console.log(`📄 Index file exists: ${existsSync(indexPath)}`);
  
  if (existsSync(distPath)) {
    // Serve static files from the dist/public directory
    app.use(express.static(distPath, {
      maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
      etag: true,
      lastModified: true
    }));
    
    console.log("✅ Static file serving configured for production");
  } else {
    console.warn("⚠️  Static files directory not found:", distPath);
    console.warn("   Make sure to run 'npm run build' first");
  }

  // SPA fallback - serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Application not built. Run 'npm run build' first.");
    }
  });
}
