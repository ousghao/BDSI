import { Router } from 'express';
import { z } from 'zod';
import { db } from '../../db';
import { 
  projects, 
  news, 
  events, 
  users,
  faculty,
  courses,
  partnerships,
  testimonials,
  settings,
  featureFlags,
  contactMessages
} from '@shared/schema';
import { eq, desc } from 'drizzle-orm';

export function buildAdminRouter() {
  const router = Router();

  // ============================================================================
  // PROJECTS
  // ============================================================================
  
  const createProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(500),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description: z.string().min(1, "La description est requise").max(2000),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    summary: z.string().optional(),
    summary_en: z.string().optional(),
    summary_ar: z.string().optional(),
    methodology: z.string().optional(),
    methodology_en: z.string().optional(),
    methodology_ar: z.string().optional(),
    results: z.string().optional(),
    results_en: z.string().optional(),
    results_ar: z.string().optional(),
    theme: z.enum(['IA/ML', 'Data Engineering', 'NLP', 'Computer Vision', 'IoT']),
    year: z.number().min(2020).max(2030),
    students: z.string().optional(), // JSON array as string
    supervisors: z.string().optional(), // JSON array as string
    keywords: z.string().optional(), // JSON array as string
    awards: z.string().optional(), // JSON array as string
    documents: z.string().optional(), // JSON array as string
    video_url: z.string().url().optional(),
    image_url: z.string().url().optional(),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false)
  });

  router.post('/projects', async (req, res) => {
    try {
      const validatedData = createProjectSchema.parse(req.body);
      
      const [project] = await db.insert(projects).values({
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

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
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    summary: z.string().min(1, "Le résumé est requis").max(1000),
    summary_en: z.string().optional(),
    summary_ar: z.string().optional(),
    content: z.string().min(1, "Le contenu est requis").max(10000),
    content_en: z.string().optional(),
    content_ar: z.string().optional(),
    category: z.enum(['event', 'research', 'success_story', 'announcement']),
    image_url: z.string().url().optional(),
    author_id: z.string().uuid().optional(),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    published_at: z.string().datetime().optional()
  });

  router.post('/news', async (req, res) => {
    try {
      const validatedData = createNewsSchema.parse(req.body);
      
      const [newsItem] = await db.insert(news).values({
        ...validatedData,
        publishedAt: validatedData.published_at ? new Date(validatedData.published_at) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
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
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description: z.string().min(1, "La description est requise").max(2000),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    type: z.enum(['seminar', 'defense', 'workshop', 'meetup']),
    location: z.string().min(1, "Le lieu est requis").max(500),
    location_en: z.string().optional(),
    location_ar: z.string().optional(),
    start_date: z.string().datetime(),
    end_date: z.string().datetime(),
    speakers: z.string().optional(), // JSON array as string
    registration_url: z.string().url().optional(),
    documents_url: z.string().url().optional(),
    image_url: z.string().url().optional(),
    is_active: z.boolean().default(true)
  });

  router.post('/events', async (req, res) => {
    try {
      const validatedData = createEventSchema.parse(req.body);
      
      // Validate that end_date is after start_date
      if (new Date(validatedData.end_date) <= new Date(validatedData.start_date)) {
        return res.status(400).json({ 
          ok: false, 
          message: "La date de fin doit être après la date de début" 
        });
      }

      const [event] = await db.insert(events).values({
        ...validatedData,
        startDate: new Date(validatedData.start_date),
        endDate: new Date(validatedData.end_date),
        createdAt: new Date(),
        updatedAt: new Date()
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
  // MEDIA MANAGEMENT
  // ============================================================================
  
  const createMediaSchema = z.object({
    filename: z.string().min(1, "Le nom du fichier est requis"),
    original_name: z.string().min(1, "Le nom original est requis"),
    mime_type: z.string().min(1, "Le type MIME est requis"),
    size: z.number().min(1, "La taille doit être supérieure à 0"),
    url: z.string().url("L'URL doit être valide"),
    alt_text: z.string().optional(),
    category: z.enum(['image', 'document', 'video', 'audio']).default('image'),
    tags: z.string().optional(), // JSON array as string
    uploaded_by: z.string().uuid().optional()
  });

  router.post('/media', async (req, res) => {
    try {
      const validatedData = createMediaSchema.parse(req.body);
      
      // For now, we'll store media info in a simple way
      // In a real app, you'd have a media table
      const mediaInfo = {
        ...validatedData,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Store in settings table as a media entry
      const [mediaSetting] = await db.insert(settings).values({
        key: `media_${Date.now()}`,
        value: JSON.stringify(mediaInfo),
        type: 'json',
        category: 'media',
        updatedAt: new Date()
      }).returning();

      res.status(201).json({ ok: true, id: mediaSetting.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          ok: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error('Media creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création du média" });
    }
  });

  // ============================================================================
  // COURSES
  // ============================================================================

  const createCourseSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(1000),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    description: z.string().optional(),
    description_en: z.string().optional(),
    description_ar: z.string().optional(),
    semester: z.number().int().min(1).max(12),
    credits: z.number().int().min(1).max(60),
    objectives: z.string().optional(),
    objectives_en: z.string().optional(),
    objectives_ar: z.string().optional(),
    prerequisites: z.string().optional(),
    prerequisites_en: z.string().optional(),
    prerequisites_ar: z.string().optional(),
    evaluation: z.string().optional(),
    evaluation_en: z.string().optional(),
    evaluation_ar: z.string().optional(),
    resources: z.string().optional(),
    resources_en: z.string().optional(),
    resources_ar: z.string().optional(),
    instructor_id: z.string().uuid().optional(),
    is_active: z.boolean().default(true)
  });

  router.post('/courses', async (req, res) => {
    try {
      const data = createCourseSchema.parse(req.body);
      const [course] = await db.insert(courses).values({
        title: data.title,
        titleEn: data.title_en || null,
        titleAr: data.title_ar || null,
        description: data.description || null,
        descriptionEn: data.description_en || null,
        descriptionAr: data.description_ar || null,
        semester: data.semester,
        credits: data.credits,
        objectives: data.objectives || null,
        objectivesEn: data.objectives_en || null,
        objectivesAr: data.objectives_ar || null,
        prerequisites: data.prerequisites || null,
        prerequisitesEn: data.prerequisites_en || null,
        prerequisitesAr: data.prerequisites_ar || null,
        evaluation: data.evaluation || null,
        evaluationEn: data.evaluation_en || null,
        evaluationAr: data.evaluation_ar || null,
        resources: data.resources || null,
        resourcesEn: data.resources_en || null,
        resourcesAr: data.resources_ar || null,
        instructorId: data.instructor_id || null,
        isActive: data.is_active ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      res.status(201).json({ ok: true, id: course.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ ok: false, message: 'Données invalides', errors: error.errors });
      }
      console.error('Course creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création du cours" });
    }
  });

  // ============================================================================
  // FACULTY
  // ============================================================================

  const createFacultySchema = z.object({
    user_id: z.string().uuid().optional(),
    name: z.string().min(1, "Le nom est requis").max(1000),
    name_en: z.string().optional(),
    name_ar: z.string().optional(),
    title: z.string().min(1, "Le titre est requis").max(1000),
    title_en: z.string().optional(),
    title_ar: z.string().optional(),
    specialization: z.string().optional(),
    specialization_en: z.string().optional(),
    specialization_ar: z.string().optional(),
    bio: z.string().optional(),
    bio_en: z.string().optional(),
    bio_ar: z.string().optional(),
    research: z.string().optional(),
    research_en: z.string().optional(),
    research_ar: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    linkedin_url: z.string().url().optional(),
    website_url: z.string().url().optional(),
    profile_image_url: z.string().url().optional(),
    order: z.number().int().min(0).optional(),
    is_active: z.boolean().default(true)
  });

  router.post('/faculty', async (req, res) => {
    try {
      const d = createFacultySchema.parse(req.body);
      const [member] = await db.insert(faculty).values({
        userId: d.user_id || null,
        name: d.name,
        nameEn: d.name_en || null,
        nameAr: d.name_ar || null,
        title: d.title,
        titleEn: d.title_en || null,
        titleAr: d.title_ar || null,
        specialization: d.specialization || null,
        specializationEn: d.specialization_en || null,
        specializationAr: d.specialization_ar || null,
        bio: d.bio || null,
        bioEn: d.bio_en || null,
        bioAr: d.bio_ar || null,
        research: d.research || null,
        researchEn: d.research_en || null,
        researchAr: d.research_ar || null,
        email: d.email || null,
        phone: d.phone || null,
        linkedinUrl: d.linkedin_url || null,
        websiteUrl: d.website_url || null,
        profileImageUrl: d.profile_image_url || null,
        order: d.order ?? 0,
        isActive: d.is_active ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      res.status(201).json({ ok: true, id: member.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ ok: false, message: 'Données invalides', errors: error.errors });
      }
      console.error('Faculty creation error:', error);
      res.status(500).json({ ok: false, message: "Erreur lors de la création du membre" });
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
  router.patch('/feature-flags/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ error: 'enabled must be a boolean' });
      }
      
      const result = await db
        .update(featureFlags)
        .set({ 
          enabled,
          updatedBy: (req as any).user?.id 
        })
        .where(eq(featureFlags.key, key))
        .returning();

      if (result.length === 0) {
        return res.status(404).json({ error: 'Feature flag not found' });
      }

      res.json({ 
        ok: true, 
        key, 
        enabled 
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
          updatedBy: (req as any).user?.id
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
  // CONTACT MESSAGES
  // ============================================================================
  
  // GET /api/admin/contact-messages - Get all contact messages
  router.get('/contact-messages', async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      
      let messages;
      
      if (status && typeof status === 'string') {
        messages = await db.select()
          .from(contactMessages)
          .where(eq(contactMessages.status, status))
          .orderBy(desc(contactMessages.createdAt))
          .limit(Number(limit))
          .offset((Number(page) - 1) * Number(limit));
      } else {
        messages = await db.select()
          .from(contactMessages)
          .orderBy(desc(contactMessages.createdAt))
          .limit(Number(limit))
          .offset((Number(page) - 1) * Number(limit));
      }
      
      const total = await db.select().from(contactMessages);
      
      res.json({
        ok: true,
        data: messages,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: total.length,
          pages: Math.ceil(total.length / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PATCH /api/admin/contact-messages/:id/status - Update message status
  router.patch('/contact-messages/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      
      const updateData: any = { updatedAt: new Date() };
      if (status) updateData.status = status;
      if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
      
      const [updatedMessage] = await db
        .update(contactMessages)
        .set(updateData)
        .where(eq(contactMessages.id, Number(id)))
        .returning();
      
      if (!updatedMessage) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.json({ ok: true, data: updatedMessage });
    } catch (error) {
      console.error('Error updating contact message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
