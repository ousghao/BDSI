import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated, requireAdmin } from "./simpleAuth";
import { buildAdminRouter } from "./routes/admin/supabase";
import { db } from "./db-supabase";
import { 
  projects, 
  news, 
  events, 
  faculty,
  partnerships,
  testimonials,
  settings,
  featureFlags
} from "../shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { admissionsRouter } from "./routes/admissions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Admin router
  app.use('/api/admin', buildAdminRouter());

  // Admissions routes
  app.use('/api/admissions', admissionsRouter);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health check endpoint
  app.get('/api/health', async (req, res) => {
    try {
      // Test database connection
      const result = await db.execute("SELECT 1 as health_check, NOW() as timestamp");
      
      res.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        db_result: result[0]
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Feature flags endpoint (public)
  app.get('/api/feature-flags', async (req, res) => {
    try {
      const flags = await db.select().from(featureFlags).orderBy(featureFlags.key);
      res.json({ flags });
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Public routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await db.select().from(projects).where(eq(projects.isActive, true));
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/projects', async (req, res) => {
    try {
      const { theme, year, featured } = req.query;
      let whereConditions = [eq(projects.isActive, true)];
      
      if (theme) whereConditions.push(eq(projects.theme, theme as string));
      if (year) whereConditions.push(eq(projects.year, parseInt(year as string)));
      if (featured !== undefined) whereConditions.push(eq(projects.isFeatured, featured === 'true'));
      
      const projectsList = await db.select().from(projects).where(and(...whereConditions));
      res.json(projectsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/news', async (req, res) => {
    try {
      const { category, featured } = req.query;
      let whereConditions = [eq(news.isActive, true)];
      
      if (category) whereConditions.push(eq(news.category, category as string));
      if (featured !== undefined) whereConditions.push(eq(news.isFeatured, featured === 'true'));
      
      const newsList = await db.select().from(news).where(and(...whereConditions));
      res.json(newsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const { type, upcoming } = req.query;
      let whereConditions = [eq(events.isActive, true)];
      
      if (type) whereConditions.push(eq(events.type, type as string));
      if (upcoming === 'true') {
        whereConditions.push(gte(events.startDate, new Date()));
      }
      
      const eventsList = await db.select().from(events).where(and(...whereConditions));
      res.json(eventsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/faculty', async (req, res) => {
    try {
      const facultyList = await db.select().from(faculty).where(eq(faculty.isActive, true));
      res.json(facultyList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty" });
    }
  });

  app.get('/api/partnerships', async (req, res) => {
    try {
      const partnershipsList = await db.select().from(partnerships).where(eq(partnerships.isActive, true));
      res.json(partnershipsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnerships" });
    }
  });

  app.get('/api/testimonials', async (req, res) => {
    try {
      const { featured } = req.query;
      let whereConditions = [eq(testimonials.isActive, true)];
      
      if (featured === 'true') {
        whereConditions.push(eq(testimonials.isFeatured, true));
      }
      
      const testimonialsList = await db.select().from(testimonials).where(and(...whereConditions));
      res.json(testimonialsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get('/api/settings', async (req, res) => {
    try {
      const { category } = req.query;
      let whereConditions = [];
      
      if (category) {
        whereConditions.push(eq(settings.category, category as string));
      }
      
      const settingsList = await db.select().from(settings).where(and(...whereConditions));
      res.json(settingsList);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
