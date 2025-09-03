import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
// doit être la toute première ligne
import 'dotenv/config';
import { db } from "./db";

// Database connection test function
async function testDatabaseConnection() {
  try {
    log("🔍 Testing database connection...");
    
    // Test basic connection
    const result = await db.execute("SELECT 1 as test");
    log("✅ Database connection successful!");
    log(`   Test query result: ${JSON.stringify(result)}`);
    
    // Test if we can access the schema
    const tablesResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult && tablesResult.length > 0) {
      log(`✅ Found ${tablesResult.length} tables in database`);
      log(`   Tables: ${tablesResult.map((t: any) => t.table_name).join(', ')}`);
    } else {
      log("⚠️  No tables found in database (this might be expected for a new project)");
    }
    
    return true;
  } catch (error) {
    log("❌ Database connection failed!");
    log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    
    if (error instanceof Error && error.message.includes('ENOTFOUND')) {
      log("   🔍 This looks like a DNS resolution issue.");
      log("   📋 Please check:");
      log("      - Your DATABASE_URL in .env file");
      log("      - If the Supabase project exists");
      log("      - If the hostname is correct");
    }
    
    if (error instanceof Error && error.message.includes('SSL')) {
      log("   🔍 This looks like an SSL connection issue.");
      log("   📋 Please check if your DATABASE_URL includes ?sslmode=require");
    }
    
    return false;
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

(async () => {
  // Test database connection before starting the server
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    log("🚨 Database connection failed! Server will start but API calls will fail.");
    log("   Fix the database connection and restart the server.");
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Use localhost instead of 0.0.0.0 for Windows compatibility
  const host = process.platform === 'win32' ? 'localhost' : '0.0.0.0';
  
  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
    if (dbConnected) {
      log("🚀 Server ready with database connection!");
    } else {
      log("⚠️  Server ready but database connection failed!");
    }
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`❌ Port ${port} is already in use. Trying port ${port + 1}...`);
      server.listen(port + 1, host, () => {
        log(`serving on http://${host}:${port + 1}`);
        if (dbConnected) {
          log("🚀 Server ready with database connection!");
        } else {
          log("⚠️  Server ready but database connection failed!");
        }
      });
    } else if (err.code === 'ENOTSUP') {
      log(`❌ Bind to ${host}:${port} not supported. Trying localhost...`);
      server.listen(port, 'localhost', () => {
        log(`serving on http://localhost:${port}`);
        if (dbConnected) {
          log("🚀 Server ready with database connection!");
        } else {
          log("⚠️  Server ready but database connection failed!");
        }
      });
    } else {
      log(`❌ Server failed to start: ${err.message}`);
      throw err;
    }
  });
})();
