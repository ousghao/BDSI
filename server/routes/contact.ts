import { Router } from "express";
import { db } from "../db";
import { contactMessages, insertContactMessageSchema } from "../../shared/schema";
import { z } from "zod";

const router = Router();

// POST /api/contact - Submit a contact message
router.post("/", async (req, res) => {
  try {
    // Validate the request body
    const validatedData = insertContactMessageSchema.parse(req.body);
    
    // Insert into database
    const [newMessage] = await db
      .insert(contactMessages)
      .values(validatedData)
      .returning();

    res.status(201).json({
      success: true,
      message: "Message envoyé avec succès",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
});

export { router as contactRouter };
