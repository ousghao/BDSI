import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db-supabase';
import { admissions } from '../../shared/schema';
import { eq, desc, and, like, or, gte, lte } from 'drizzle-orm';
import { requireAdmin } from '../simpleAuth';
import { supabaseAdmin } from '../db-supabase';
import multer from 'multer';
import path from 'path';
import { sql } from 'drizzle-orm';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

// Validation schemas
const createAdmissionSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis").max(200),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Le numéro de téléphone est requis").max(20),
  nationalId: z.string().min(1, "La CIN/passeport est requis").max(50),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  address: z.string().min(1, "L'adresse est requise").max(500),
  priorDegree: z.enum(['bac', 'licence', 'master', 'equivalent']),
  gpaOrScore: z.string().optional(),
  programTrack: z.string().optional(),
});

const updateAdmissionSchema = z.object({
  status: z.enum(['submitted', 'under_review', 'accepted', 'rejected']).optional(),
  notesAdmin: z.string().optional(),
});

// Public endpoint to submit admission application
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    // Validate form data
    const formData = createAdmissionSchema.parse(req.body);
    
    // Check if PDF file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        ok: false, 
        message: "Le fichier PDF est requis" 
      });
    }

    // Upload PDF to Supabase Storage
    const fileName = `admissions/${new Date().getFullYear()}/${Date.now()}-${req.file.originalname}`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(fileName, req.file.buffer, {
        contentType: 'application/pdf',
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ 
        ok: false, 
        message: "Erreur lors du téléchargement du fichier" 
      });
    }

    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create admission record in database
    const [admission] = await db.insert(admissions).values({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      nationalId: formData.nationalId,
      dob: new Date(formData.dob),
      address: formData.address,
      priorDegree: formData.priorDegree,
      gpaOrScore: formData.gpaOrScore || null,
      programTrack: formData.programTrack || null,
      pdfUrl: publicUrl,
      status: 'submitted',
    }).returning();

    res.json({ 
      ok: true, 
      id: admission.id,
      message: "Candidature soumise avec succès" 
    });

  } catch (error) {
    console.error('Admission submission error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        message: "Données invalides", 
        errors: error.errors 
      });
    }

    res.status(500).json({ 
      ok: false, 
      message: "Erreur lors de la soumission de la candidature" 
    });
  }
});

// Admin endpoint to get all admissions with filters
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const { 
      status, 
      programTrack, 
      search, 
      startDate, 
      endDate, 
      page = '1', 
      limit = '20' 
    } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(admissions.status, status as string));
    }

    if (programTrack) {
      conditions.push(eq(admissions.programTrack, programTrack as string));
    }

    if (startDate) {
      conditions.push(gte(admissions.createdAt, new Date(startDate as string)));
    }

    if (endDate) {
      conditions.push(lte(admissions.createdAt, new Date(endDate as string)));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(admissions.fullName, searchTerm),
          like(admissions.email, searchTerm),
          like(admissions.nationalId, searchTerm)
        )
      );
    }

    // Get admissions with pagination
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [admissionsList, totalCount] = await Promise.all([
      db.select()
        .from(admissions)
        .where(whereClause)
        .orderBy(desc(admissions.createdAt))
        .limit(limitNum)
        .offset(offset),
      
      db.select({ count: sql<number>`count(*)` })
        .from(admissions)
        .where(whereClause)
        .then(result => result[0]?.count || 0)
    ]);

    res.json({
      ok: true,
      data: {
        admissions: admissionsList,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ 
      ok: false, 
      message: "Erreur lors de la récupération des candidatures" 
    });
  }
});

// Admin endpoint to get a specific admission
router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        message: "ID de candidature invalide" 
      });
    }

    const [admission] = await db
      .select()
      .from(admissions)
      .where(eq(admissions.id, id));

    if (!admission) {
      return res.status(404).json({ 
        ok: false, 
        message: "Candidature non trouvée" 
      });
    }

    res.json({ 
      ok: true, 
      data: admission 
    });

  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({ 
      ok: false, 
      message: "Erreur lors de la récupération de la candidature" 
    });
  }
});

// Admin endpoint to update admission status and notes
router.patch('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        message: "ID de candidature invalide" 
      });
    }

    const updateData = updateAdmissionSchema.parse(req.body);

    const [updatedAdmission] = await db
      .update(admissions)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(admissions.id, id))
      .returning();

    if (!updatedAdmission) {
      return res.status(404).json({ 
        ok: false, 
        message: "Candidature non trouvée" 
      });
    }

    res.json({ 
      ok: true, 
      data: updatedAdmission,
      message: "Candidature mise à jour avec succès" 
    });

  } catch (error) {
    console.error('Error updating admission:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        ok: false, 
        message: "Données invalides", 
        errors: error.errors 
      });
    }

    res.status(500).json({ 
      ok: false, 
      message: "Erreur lors de la mise à jour de la candidature" 
    });
  }
});

// Admin endpoint to get signed URL for PDF download
router.get('/admin/:id/pdf', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ 
        ok: false, 
        message: "ID de candidature invalide" 
      });
    }

    const [admission] = await db
      .select({ pdfUrl: admissions.pdfUrl })
      .from(admissions)
      .where(eq(admissions.id, id));

    if (!admission) {
      return res.status(404).json({ 
        ok: false, 
        message: "Candidature non trouvée" 
      });
    }

    // Extract file path from URL
    const url = new URL(admission.pdfUrl);
    const filePath = url.pathname.split('/').slice(-2).join('/'); // Get year/filename

    // Generate signed URL for secure download
    const { data: signedUrl, error } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Error generating signed URL:', error);
      return res.status(500).json({ 
        ok: false, 
        message: "Erreur lors de la génération du lien de téléchargement" 
      });
    }

    res.json({ 
      ok: true, 
      data: { downloadUrl: signedUrl.signedUrl } 
    });

  } catch (error) {
    console.error('Error generating PDF download URL:', error);
    res.status(500).json({ 
      ok: false, 
      message: "Erreur lors de la génération du lien de téléchargement" 
    });
  }
});

export { router as admissionsRouter };
