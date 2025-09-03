import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db-supabase';
import { 
  projects, 
  news, 
  events, 
  users,
  faculty,
  partnerships,
  testimonials,
  settings,
  featureFlags
} from '../../../shared/schema';
import { eq, desc } from 'drizzle-orm';

export function buildAdminRouter() {
  const router = Router();

  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  
  // GET /api/admin/feature-flags - Get all feature flags
  router.get('/feature-flags', async (req, res) => {
    try {
      const flags = await db.select().from(featureFlags).orderBy(featureFlags.key);
      res.json({ flags });
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /api/admin/feature-flags/:key - Update a feature flag
  const updateFlagSchema = z.object({
    enabled: z.boolean(),
  });

  router.patch('/feature-flags/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const body = updateFlagSchema.parse(req.body);
      
      const result = await db
        .update(featureFlags)
        .set({ 
          enabled: body.enabled,
          updatedBy: req.session?.user?.id 
        })
        .where(eq(featureFlags.key, key))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: 'Feature flag not found' });
      }

      res.json({ 
        ok: true, 
        key, 
        enabled: body.enabled 
      });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/admin/feature-flags/seed - Seed missing feature flags
  router.post('/feature-flags/seed', async (req, res) => {
    try {
      const requiredKeys = [
        'home', 'program', 'admissions', 'projects', 'news', 
        'events', 'faculty', 'partnerships', 'alumni', 'contact'
      ];

      const existingFlags = await db.select().from(featureFlags);
      const existingKeys = existingFlags.map(f => f.key);
      
      const missingKeys = requiredKeys.filter(key => !existingKeys.includes(key));
      
      if (missingKeys.length > 0) {
        const insertData = missingKeys.map(key => ({
          key,
          enabled: true,
          updatedBy: req.session?.user?.id
        }));

        await db.insert(featureFlags).values(insertData);
      }

      res.json({ 
        ok: true, 
        message: `Seeded ${missingKeys.length} missing feature flags`,
        seeded: missingKeys 
      });
    } catch (error) {
      console.error('Error seeding feature flags:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ============================================================================
  // PROJECTS
  // ============================================================================
  
  const createProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(500),
    titleEn: z.string().optional(),
    titleAr: z.string().optional(),
    description: z.string().min(1, "La description est requise").max(2000),
    descriptionEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    summary: z.string().optional(),
    summaryEn: z.string().optional(),
    summaryAr: z.string().optional(),
    methodology: z.string().optional(),
    methodologyEn: z.string().optional(),
    methodologyAr: z.string().optional(),
    results: z.string().optional(),
    resultsEn: z.string().optional(),
    resultsAr: z.string().optional(),
    theme: z.enum(['IA/ML', 'Data Engineering', 'NLP', 'Computer Vision', 'IoT']),
    year: z.number().min(2020).max(2030),
    students: z.string().optional(), // JSON array as string
    supervisors: z.string().optional(), // JSON array as string
    keywords: z.string().optional(), // JSON array as string
    awards: z.string().optional(), // JSON array as string
    documents: z.string().optional(), // JSON array as string
    videoUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false)
  });

  router.post('/projects', async (req, res) => {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      
      const [project] = await db.insert(projects).values(validatedData).returning();

      res.status(201).json({ ok: true, id: project.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error('Project creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création du projet" });
    }
  });

  // ============================================================================
  // NEWS
  // ============================================================================
  
  const createNewsSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(500),
    titleEn: z.string().optional(),
    titleAr: z.string().optional(),
    summary: z.string().min(1, "Le résumé est requis").max(1000),
    summaryEn: z.string().optional(),
    summaryAr: z.string().optional(),
    content: z.string().min(1, "Le contenu est requis").max(10000),
    contentEn: z.string().optional(),
    contentAr: z.string().optional(),
    category: z.enum(['event', 'research', 'success_story', 'announcement']),
    imageUrl: z.string().url().optional(),
    authorId: z.string().uuid().optional(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    publishedAt: z.string().datetime().optional()
  });

  router.post('/news', async (req, res) => {
    try {
      const validatedData = createNewsSchema.parse(req.body);
      
      const [newsItem] = await db.insert(news).values({
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : new Date()
      }).returning();

      res.status(201).json({ ok: true, id: newsItem.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error('News creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création de l'actualité" });
    }
  });

  // ============================================================================
  // EVENTS
  // ============================================================================
  
  const createEventSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(500),
    titleEn: z.string().optional(),
    titleAr: z.string().optional(),
    description: z.string().min(1, "La description est requise").max(2000),
    descriptionEn: z.string().optional(),
    descriptionAr: z.string().optional(),
    type: z.enum(['seminar', 'defense', 'workshop', 'meetup']),
    location: z.string().min(1, "Le lieu est requis").max(500),
    locationEn: z.string().optional(),
    locationAr: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    speakers: z.string().optional(), // JSON array as string
    registrationUrl: z.string().url().optional(),
    documentsUrl: z.string().url().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().default(true)
  });

  router.post('/events', async (req, res) => {
    try {
      const validatedData = createEventSchema.parse(req.body);
      
      // Validate that end_date is after start_date
      if (new Date(validatedData.endDate) <= new Date(validatedData.startDate)) {
        return res.status(400).json({ 
          ok: false, 
          message: "La date de fin doit être après la date de début" 
        });
      }

      const [event] = await db.insert(events).values({
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate)
      }).returning();

      res.status(201).json({ ok: true, id: event.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error('Event creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création de l'événement" });
    }
  });

  // ============================================================================
  // LIST ENDPOINTS (for forms that need dropdown data)
  // ============================================================================
  
  router.get('/dropdowns', async (req, res) => {
    try {
      // Get users for author/uploader dropdowns
      const usersList = await db.select({
        id: users.id,
        name: users.firstName,
        email: users.email
      }).from(users).where(eq(users.role, 'admin'));

      // Get faculty for supervisor dropdowns
      const facultyList = await db.select({
        id: faculty.id,
        name: faculty.name,
        title: faculty.title
      }).from(faculty).where(eq(faculty.isActive, true));

      res.json({
        users: usersList,
        faculty: facultyList,
        themes: ['IA/ML', 'Data Engineering', 'NLP', 'Computer Vision', 'IoT'],
        categories: ['event', 'research', 'success_story', 'announcement'],
        eventTypes: ['seminar', 'defense', 'workshop', 'meetup']
      });
    } catch (error) {
      console.error('Dropdowns error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la récupération des données" });
    }
  });

  return router;
}
