import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireAdmin } from "./simpleAuth";
import { buildAdminRouter } from "./routes/admin";
import { contactRouter } from "./routes/contact";
import { migrateRouter } from "./routes/migrate";
import { 
  insertProjectSchema,
  insertNewsSchema,
  insertEventSchema,
  insertCourseSchema,
  insertFacultySchema,
  insertPartnershipSchema,
  insertTestimonialSchema,
  insertSettingSchema,
  featureFlags,
  settings
} from "@shared/schema";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Health check endpoint for monitoring
function setupHealthCheck(app: Express) {
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      await db.execute("SELECT 1 as test");
      
      res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        database: "connected"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}


// Settings schema for validation: accept any key with primitive value types
// This aligns server validation with the flexible key/value settings UI.
const settingsSchema = z.record(z.union([
  z.string(),
  z.number(),
  z.boolean(),
]));

// Default settings (keys align with client expectations)
const defaultSettings = {
  site_title: "Master Big Data & Systèmes Intelligents",
  site_description: "Formation d'excellence en Big Data et Intelligence Artificielle",
  contact_email: "contact@bdsi.ma",
  contact_phone: "+212 5 37 77 77 77",
  contact_address: "FS Dhar El Mehraz, Fès, Maroc",
  social_linkedin: "https://linkedin.com/company/bdsi-fes",
  social_facebook: "https://facebook.com/bdsi.fes",
  social_twitter: "",
  social_youtube: "",
  enable_dark_mode: true,
  enable_multilingual: true,
  enable_search: true,
  featured_projects_limit: 6,
  featured_news_limit: 4,
  upcoming_events_limit: 5,
  maintenanceMode: false,
  maintenanceMessage: "Le site est temporairement en maintenance. Nous serons bientôt de retour.",
};

// Lightweight cache for settings rows to reduce DB pressure
let cachedSettingsRows: any[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

const getAllSettingsRows = async (): Promise<any[]> => {
  const now = Date.now();
  if (cachedSettingsRows && now - cachedAt < CACHE_TTL_MS) {
    return cachedSettingsRows;
  }
  const rows = await db.select().from(settings);
  cachedSettingsRows = rows;
  cachedAt = now;
  return rows;
};

const invalidateSettingsCache = () => {
  cachedSettingsRows = null;
  cachedAt = 0;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint (should be first for monitoring)
  setupHealthCheck(app);
  
  // Auth middleware
  await setupAuth(app);

  // Admin router
  app.use('/api/admin', buildAdminRouter());

  // Contact routes
  app.use('/api/contact', contactRouter);

  // Migration routes (temporary)
  app.use('/api/migrate', migrateRouter);

  // Test route for contact API
  app.get('/test-contact', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'test-contact-api.html'));
  });

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
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const course = await storage.getCourse(parseInt(id));
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.get('/api/projects', async (req, res) => {
    try {
      const { theme, year, featured } = req.query;
      const filters: any = {};
      
      if (theme) filters.theme = theme as string;
      if (year) filters.year = parseInt(year as string);
      if (featured !== undefined) filters.featured = featured === 'true';
      
      const projects = await storage.getProjects(filters);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(parseInt(id));
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.get('/api/news', async (req, res) => {
    try {
      const { category, featured } = req.query;
      const filters: any = {};
      
      if (category) filters.category = category as string;
      if (featured !== undefined) filters.featured = featured === 'true';
      
      const news = await storage.getNews(filters);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.get('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const newsItem = await storage.getNewsItem(parseInt(id));
      
      if (!newsItem) {
        return res.status(404).json({ message: "News item not found" });
      }
      
      res.json(newsItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch news item" });
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const { type, upcoming } = req.query;
      const filters: any = {};
      
      if (type) filters.type = type as string;
      if (upcoming !== undefined) filters.upcoming = upcoming === 'true';
      
      const events = await storage.getEvents(filters);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const event = await storage.getEvent(parseInt(id));
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.get('/api/faculty', async (req, res) => {
    try {
      const faculty = await storage.getFaculty();
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty" });
    }
  });

  app.get('/api/partnerships', async (req, res) => {
    try {
      const partnerships = await storage.getPartnerships();
      res.json(partnerships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnerships" });
    }
  });

  app.get('/api/testimonials', async (req, res) => {
    try {
      const { featured } = req.query;
      const testimonials = await storage.getTestimonials(featured === 'true');
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Keep a raw list endpoint (non-authoritative) without conflicting with the
  // authoritative consolidated settings endpoint defined later.
  app.get('/api/settings/list', async (req, res) => {
    try {
      const { category } = req.query;
      const list = await storage.getSettings(category as string);
      res.json(list);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const results = await storage.searchContent(q as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search content" });
    }
  });

  // Protected admin routes
  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post('/api/admin/news', requireAdmin, async (req, res) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(newsData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.put('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const newsData = insertNewsSchema.partial().parse(req.body);
      const news = await storage.updateNews(id, newsData);
      res.json(news);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid news data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news" });
    }
  });

  app.delete('/api/admin/news/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNews(id);
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  app.post('/api/admin/events', requireAdmin, async (req, res) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put('/api/admin/events/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, eventData);
      res.json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid event data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete('/api/admin/events/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEvent(id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.post('/api/admin/courses', requireAdmin, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put('/api/admin/courses/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const courseData = insertCourseSchema.partial().parse(req.body);
      const course = await storage.updateCourse(id, courseData);
      res.json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete('/api/admin/courses/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCourse(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  app.post('/api/admin/faculty', requireAdmin, async (req, res) => {
    try {
      const facultyData = insertFacultySchema.parse(req.body);
      const faculty = await storage.createFaculty(facultyData);
      res.json(faculty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid faculty data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create faculty" });
    }
  });

  app.put('/api/admin/faculty/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const facultyData = insertFacultySchema.partial().parse(req.body);
      const faculty = await storage.updateFaculty(id, facultyData);
      res.json(faculty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid faculty data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update faculty" });
    }
  });

  app.delete('/api/admin/faculty/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFaculty(id);
      res.json({ message: "Faculty deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete faculty" });
    }
  });

  app.post('/api/admin/partnerships', requireAdmin, async (req, res) => {
    try {
      const partnershipData = insertPartnershipSchema.parse(req.body);
      const partnership = await storage.createPartnership(partnershipData);
      res.json(partnership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid partnership data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create partnership" });
    }
  });

  app.put('/api/admin/partnerships/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partnershipData = insertPartnershipSchema.partial().parse(req.body);
      const partnership = await storage.updatePartnership(id, partnershipData);
      res.json(partnership);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid partnership data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update partnership" });
    }
  });

  app.delete('/api/admin/partnerships/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartnership(id);
      res.json({ message: "Partnership deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete partnership" });
    }
  });

  app.post('/api/admin/testimonials', requireAdmin, async (req, res) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(testimonialData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonialData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, testimonialData);
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete('/api/admin/testimonials/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  app.post('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const settingData = insertSettingSchema.parse(req.body);
      const setting = await storage.upsertSetting(settingData);
      res.json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save setting" });
    }
  });

  app.delete('/api/admin/settings/:key', requireAdmin, async (req, res) => {
    try {
      const key = req.params.key;
      await storage.deleteSetting(key);
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });



  // ============================================================================
  // SITE SETTINGS ENDPOINTS
  // ============================================================================
  
  // Helper function to get all settings as an object with i18n-aware values
  const getSettingsObject = async (lang?: string) => {
    const dbSettings = await getAllSettingsRows();
    const settingsObj: any = { ...defaultSettings };

    const pickValue = (row: any): string | null => {
      // Fallback order based on requested language
      const l = (lang || 'fr').toLowerCase();
      const vMap: Record<string, any> = {
        fr: row.value,
        en: row.valueEn ?? row.value_en,
        ar: row.valueAr ?? row.value_ar,
      };
      const chosen = vMap[l] ?? row.value;
      return (chosen === undefined || chosen === null || chosen === '') ? row.value : chosen;
    };

    dbSettings.forEach((settingRow) => {
      const raw = pickValue(settingRow);
      if (raw === undefined || raw === null) return;
      const rawStr = String(raw);
      try {
        const parsed = JSON.parse(rawStr);
        settingsObj[settingRow.key] = parsed;
      } catch {
        if (rawStr === 'true' || rawStr === 'false') {
          settingsObj[settingRow.key] = rawStr === 'true';
        } else if (!isNaN(Number(rawStr))) {
          settingsObj[settingRow.key] = Number(rawStr);
        } else {
          settingsObj[settingRow.key] = rawStr;
        }
      }
    });

    return settingsObj;
  };

  // Helper function to upsert a setting
  const upsertSetting = async (key: string, value: any) => {
    let stringValue: string;
    let settingType: string;
    
    if (typeof value === 'boolean') {
      stringValue = value ? 'true' : 'false';
      settingType = 'boolean';
    } else if (typeof value === 'number') {
      stringValue = String(value);
      settingType = 'number';
    } else if (typeof value === 'object') {
      stringValue = JSON.stringify(value);
      settingType = 'json';
    } else {
      stringValue = String(value);
      settingType = 'text';
    }
    
    await db
      .insert(settings)
      .values({
        key,
        value: stringValue,
        type: settingType,
        category: 'site_settings'
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: stringValue,
          type: settingType,
          updatedAt: new Date()
        }
      });
  };

  // GET /api/settings - Get all site settings (public)
  app.get('/api/settings', async (req, res) => {
    try {
      const lang = (req.query.lang as string) || undefined;
      const settingsObj = await getSettingsObject(lang);
      res.json({ 
        ok: true, 
        settings: settingsObj 
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ 
        ok: false, 
        error: 'Internal server error',
        settings: defaultSettings 
      });
    }
  });

  // GET /api/admin/settings - Get all site settings (admin)
  app.get('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const lang = (req.query.lang as string) || undefined;
      const settingsObj = await getSettingsObject(lang);
      res.json({ 
        ok: true, 
        settings: settingsObj 
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ 
        ok: false, 
        error: 'Internal server error',
        settings: defaultSettings 
      });
    }
  });

  // PATCH /api/admin/settings - Update site settings (admin)
  app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
    try {
      const updates = req.body;
      
      // Validate updates (schema accepts arbitrary keys with primitive values)
      const validatedUpdates = settingsSchema.parse(updates);
      
      // Update each setting
      for (const [key, value] of Object.entries(validatedUpdates)) {
        await upsertSetting(key, value);
      }
      // Invalidate cache so subsequent reads are fresh
      invalidateSettingsCache();
      
      // Return updated settings
      const updatedSettings = await getSettingsObject();
      
      res.json({ 
        ok: true, 
        message: 'Settings updated successfully',
        settings: updatedSettings 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          error: 'Validation error', 
          details: error.errors 
        });
      }
      console.error('Error updating settings:', error);
      res.status(500).json({ 
        ok: false, 
        error: 'Internal server error' 
      });
    }
  });

  // POST /api/admin/settings/seed - Seed default settings
  app.post('/api/admin/settings/seed', requireAdmin, async (req, res) => {
    try {
      // Insert all default settings
      for (const [key, value] of Object.entries(defaultSettings)) {
        await upsertSetting(key, value);
      }
      invalidateSettingsCache();
      
      res.json({ 
        ok: true, 
        message: 'Default settings seeded successfully' 
      });
    } catch (error) {
      console.error('Error seeding settings:', error);
      res.status(500).json({ 
        ok: false, 
        error: 'Internal server error' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
