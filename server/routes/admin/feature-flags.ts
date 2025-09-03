import { Router } from 'express';
import { db } from '../../db-supabase';
import { featureFlags } from '../../../shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.session?.user?.role || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// GET /api/admin/feature-flags - Get all feature flags
router.get('/', requireAdmin, async (req, res) => {
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

router.patch('/:key', requireAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const body = updateFlagSchema.parse(req.body);
    
    const result = await db
      .update(featureFlags)
      .set({ 
        enabled: body.enabled,
        updatedBy: req.session.user.id 
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
router.post('/seed', requireAdmin, async (req, res) => {
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
        updatedBy: req.session.user.id
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

export default router;
