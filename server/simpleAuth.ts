import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import MemoryStore from "memorystore";
import { db } from "./db";
import { sessions } from "@shared/schema";
import { eq, lt } from "drizzle-orm";

// Create a memory store for sessions
const MemoryStoreSession = MemoryStore(session);

// Simple database session store for Railway (using existing sessions table)
class DatabaseSessionStore extends session.Store {
  async get(sid: string, callback: (err?: any, session?: any) => void) {
    try {
      console.log(`📊 DB Session GET: ${sid}`);
      const result = await db.select().from(sessions).where(eq(sessions.sid, sid));
      const sessionData = result[0];
      
      if (sessionData && sessionData.expire > new Date()) {
        console.log(`✅ DB Session found: ${sid}, expires: ${sessionData.expire}`);
        callback(null, sessionData.sess);
      } else {
        if (sessionData) {
          console.log(`⏰ DB Session expired: ${sid}, expired: ${sessionData.expire}`);
          await db.delete(sessions).where(eq(sessions.sid, sid));
        } else {
          console.log(`❌ DB Session not found: ${sid}`);
        }
        callback(null, null);
      }
    } catch (error) {
      console.error(`❌ DB Session get error for ${sid}:`, error);
      callback(error);
    }
  }

  async set(sid: string, session: any, callback?: (err?: any) => void) {
    try {
      const expire = new Date(Date.now() + (session.cookie.maxAge || 7 * 24 * 60 * 60 * 1000));
      console.log(`💾 DB Session SET: ${sid}, expires: ${expire}`);
      console.log(`💾 DB Session data:`, JSON.stringify(session));
      
      // Try to insert, if conflict then update
      await db.insert(sessions)
        .values({
          sid,
          sess: session,
          expire
        })
        .onConflictDoUpdate({
          target: sessions.sid,
          set: {
            sess: session,
            expire
          }
        });
        
      console.log(`✅ DB Session saved: ${sid}`);
      callback?.();
    } catch (error) {
      console.error(`❌ DB Session set error for ${sid}:`, error);
      callback?.(error);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      console.log(`🗑️ DB Session DESTROY: ${sid}`);
      await db.delete(sessions).where(eq(sessions.sid, sid));
      console.log(`✅ DB Session destroyed: ${sid}`);
      callback?.();
    } catch (error) {
      console.error(`❌ DB Session destroy error for ${sid}:`, error);
      callback?.(error);
    }
  }

  // Clean up expired sessions periodically
  async cleanup() {
    try {
      console.log(`🧹 DB Session cleanup started`);
      const result = await db.delete(sessions).where(lt(sessions.expire, new Date()));
      console.log(`🧹 DB Session cleanup completed`);
    } catch (error) {
      console.error('❌ DB Session cleanup error:', error);
    }
  }
}

export function getSession() {
  // Detect if we're on Railway or other HTTPS platform
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
  
  // Always use database store for better persistence
  const sessionStore = new DatabaseSessionStore();
  
  console.log(`🍪 Session configuration: secure=${useSecureCookies}, env=${process.env.NODE_ENV}, railway=${isRailway ? 'detected' : 'false'}, store=database`);
  console.log(`🔍 Railway env vars: RAILWAY_ENVIRONMENT=${process.env.RAILWAY_ENVIRONMENT || 'undefined'}, RAILWAY_STATIC_URL=${process.env.RAILWAY_STATIC_URL || 'undefined'}`);
  
  return session({
    name: 'connect.sid', // Standard session name
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    proxy: true, // Critical: helps express-session honor trust proxy for secure cookies
    cookie: {
      httpOnly: true,
      secure: true, // Always true for Railway HTTPS
      sameSite: 'none', // Required for cross-origin on HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    store: sessionStore,
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
      console.log(`🔍 Auth check - Session ID: ${req.sessionID}`);
      console.log(`🔍 Auth check - Session data: ${JSON.stringify((req.session as any) || {})}`);
      console.log(`🔍 Auth check - Headers: ${JSON.stringify(req.headers.cookie || 'no-cookie')}`);
      
      const userId = (req.session as any).userId;
      console.log(`🔍 Auth check - UserId from session: ${userId || 'undefined'}`);
      
      if (!userId) {
        console.log(`❌ No userId in session - not authenticated`);
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        console.log(`❌ User not found in database: ${userId}`);
        return res.status(401).json({ message: "User not found" });
      }

      console.log(`✅ User found: ${user.email} (${user.role})`);
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo admin login endpoint
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log(`🔐 Admin login attempt: ${email}`);
      console.log(`🍪 Session ID before login: ${req.sessionID}`);
      console.log(`🍪 Session data before: ${JSON.stringify((req.session as any) || {})}`);

      if (!email || !password) {
        console.log(`❌ Missing email or password`);
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Simple admin authentication - accept any email with password "admin123"
      if (password !== 'admin123') {
        console.log(`❌ Invalid password for ${email}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if user exists
      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        console.log(`👤 Creating new admin user: ${email}`);
        // Create a new admin user with a proper UUID
        user = await storage.upsertUser({
          email,
          firstName: email.split('@')[0],
          lastName: '',
          role: 'admin',
        });
      } else if (user.role !== 'admin') {
        console.log(`👤 Updating user ${email} to admin role`);
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

      console.log(`✅ User data set in session: ${JSON.stringify((req.session as any).user)}`);
      console.log(`🍪 Session ID after login: ${req.sessionID}`);
      console.log(`🍪 Session data after: ${JSON.stringify((req.session as any) || {})}`);
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error(`❌ Session save error:`, err);
          return res.status(500).json({ message: "Session save failed" });
        }
        
        console.log(`💾 Session saved successfully`);
        res.json({ 
          message: "Admin login successful",
          user: (req.session as any).user,
          sessionId: req.sessionID
        });
      });
    } catch (error) {
      console.error("❌ Admin login error:", error);
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