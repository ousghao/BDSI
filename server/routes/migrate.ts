import express from 'express';
import { db } from '../db';

const router = express.Router();

// POST /api/migrate/contact-messages - Create contact_messages table
router.post('/contact-messages', async (req, res) => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email VARCHAR NOT NULL,
        phone VARCHAR,
        organization TEXT,
        reason VARCHAR NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR DEFAULT 'new',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    res.json({ 
      success: true, 
      message: 'Contact messages table created successfully' 
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create contact messages table',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export { router as migrateRouter };
