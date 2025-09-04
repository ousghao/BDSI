import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { ensureDatabaseReady } from "./database-check";
import { serveStaticFiles } from "./static";
import path from "path";
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function log(message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`Error ${status}: ${message}`);
  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({ message });
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

async function startServer() {
  try {
    log("🚀 Starting production server...");
    log(`Environment: ${process.env.NODE_ENV || 'unknown'}`);
    log(`Node version: ${process.version}`);
    
    // Test database connection
    const dbConnected = await ensureDatabaseReady();
    
    if (!dbConnected) {
      log("🚨 Database connection failed! Server will start but API calls may fail.");
      log("   Please check your DATABASE_URL environment variable.");
    }
    
    // Register API routes
    const server = await registerRoutes(app);
    
    // Add debug routes (remove in final production)
    if (process.env.NODE_ENV === 'production') {
      const { setupDebugRoutes } = await import("./debug");
      setupDebugRoutes(app);
    }
    
    // Serve static files (built React app)
    serveStaticFiles(app);
    
    // Start server
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    server.listen(port, host, () => {
      log(`🎯 Server running on http://${host}:${port}`);
      if (dbConnected) {
        log("✅ Server ready with database connection!");
      } else {
        log("⚠️  Server ready but database connection failed!");
      }
      
      // Log environment info
      log(`📊 Environment variables loaded:`);
      log(`   - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
      log(`   - DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'not set'}`);
      log(`   - SUPABASE_URL: ${process.env.SUPABASE_URL ? 'configured' : 'not set'}`);
      log(`   - SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'configured' : 'not set'}`);
      log(`   - RAILWAY_ENVIRONMENT: ${process.env.RAILWAY_ENVIRONMENT || 'not set'}`);
      log(`   - SESSION_SECRET: ${process.env.SESSION_SECRET ? 'configured' : 'not set'}`);
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        log(`❌ Port ${port} is already in use.`);
        process.exit(1);
      } else {
        log(`❌ Server failed to start: ${err.message}`);
        console.error(err);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
