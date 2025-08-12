import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertProjectSchema,
  insertNewsSchema,
  insertEventSchema,
  insertCourseSchema,
  insertFacultySchema,
  insertPartnershipSchema,
  insertTestimonialSchema,
  insertSettingSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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

  app.get('/api/settings', async (req, res) => {
    try {
      const { category } = req.query;
      const settings = await storage.getSettings(category as string);
      res.json(settings);
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
  app.post('/api/admin/projects', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/projects/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/projects/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  app.post('/api/admin/news', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/news/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/news/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNews(id);
      res.json({ message: "News deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  app.post('/api/admin/events', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/events/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/events/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEvent(id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.post('/api/admin/courses', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/courses/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/courses/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCourse(id);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  app.post('/api/admin/faculty', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/faculty/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/faculty/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFaculty(id);
      res.json({ message: "Faculty deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete faculty" });
    }
  });

  app.post('/api/admin/partnerships', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/partnerships/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/partnerships/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePartnership(id);
      res.json({ message: "Partnership deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete partnership" });
    }
  });

  app.post('/api/admin/testimonials', isAuthenticated, async (req, res) => {
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

  app.put('/api/admin/testimonials/:id', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/testimonials/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  app.post('/api/admin/settings', isAuthenticated, async (req, res) => {
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

  app.delete('/api/admin/settings/:key', isAuthenticated, async (req, res) => {
    try {
      const key = req.params.key;
      await storage.deleteSetting(key);
      res.json({ message: "Setting deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
