import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import MemoryStore from "memorystore";

// Create a memory store for sessions
const MemoryStoreSession = MemoryStore(session);

export function getSession() {
  // Detect if we're on Railway or other HTTPS platform
  // Railway sets RAILWAY_STATIC_URL, RAILWAY_GIT_COMMIT_SHA, etc.
  const isRailway = Boolean(
    process.env.RAILWAY_ENVIRONMENT || 
    process.env.RAILWAY_STATIC_URL || 
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.RAILWAY_SERVICE_NAME
  );
  
  const isHttpsPlatform = 
    isRailway ||
    process.env.VERCEL || 
    process.env.HEROKU_APP_NAME || 
    process.env.NODE_ENV === 'production' && (process.env.HTTPS === 'true' || process.env.FORCE_HTTPS === 'true');
  
  // Use secure cookies only on HTTPS platforms, not for local production testing
  const useSecureCookies = Boolean(isHttpsPlatform);
  
  console.log(`🍪 Session configuration: secure=${useSecureCookies}, env=${process.env.NODE_ENV}, railway=${isRailway ? 'detected' : 'false'}`);
  console.log(`🔍 Railway env vars: RAILWAY_ENVIRONMENT=${process.env.RAILWAY_ENVIRONMENT || 'undefined'}, RAILWAY_STATIC_URL=${process.env.RAILWAY_STATIC_URL || 'undefined'}`);
  
  return session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: useSecureCookies,
      sameSite: 'lax', // Important for Railway
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Simple login endpoint
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // For demo purposes, accept any email with a simple password check
      // In production, you should implement proper password hashing and validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Simple demo authentication - accept any email with password "demo123"
      if (password !== 'demo123') {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user exists, create if not
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create a new user with default role
        const userId = nanoid();
        user = await storage.upsertUser({
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'student',
        });
      }

      // Set user in session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
      };

      res.json({ 
        message: "Login successful",
        user: (req.session as any).user 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current user endpoint
  app.get('/api/auth/user', async (req, res) => {
    try {
      const userId = (req.session as any).userId;
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo admin login endpoint
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Simple admin authentication - accept any email with password "admin123"
      if (password !== 'admin123') {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create a new admin user with a proper UUID
        user = await storage.upsertUser({
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'admin',
        });
      } else if (user.role !== 'admin') {
        // Update existing user to admin role if they're not already admin
        user = await storage.upsertUser({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'admin',
        });
      }

      // Set user in session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
      };

      res.json({ 
        message: "Admin login successful",
        user: (req.session as any).user 
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user to request object
    (req as any).user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Add user to request object
    (req as any).user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
}; 