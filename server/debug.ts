import type { Express } from "express";

export function setupDebugRoutes(app: Express) {
  // Debug endpoint pour Railway - SUPPRIMER EN PRODUCTION FINALE
  app.get('/api/debug/env', (req, res) => {
    // Ne pas exposer les secrets, juste indiquer s'ils existent
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasSessionSecret: Boolean(process.env.SESSION_SECRET),
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasSupabaseUrl: Boolean(process.env.SUPABASE_URL),
      railwayVars: {
        RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'undefined',
        RAILWAY_STATIC_URL: process.env.RAILWAY_STATIC_URL || 'undefined',
        RAILWAY_GIT_COMMIT_SHA: process.env.RAILWAY_GIT_COMMIT_SHA || 'undefined',
        RAILWAY_SERVICE_NAME: process.env.RAILWAY_SERVICE_NAME || 'undefined',
      },
      sessionConfig: {
        secure: Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_STATIC_URL),
      }
    };
    
    res.json(debugInfo);
  });

  // Test de session
  app.post('/api/debug/test-session', (req, res) => {
    const session = req.session as any;
    session.testValue = 'railway-test-' + Date.now();
    console.log(`🧪 Debug session SET - ID: ${req.sessionID}, value: ${session.testValue}`);
    res.json({ 
      message: 'Test session créée', 
      testValue: session.testValue,
      sessionId: req.sessionID,
      cookies: req.headers.cookie
    });
  });

  app.get('/api/debug/test-session', (req, res) => {
    const session = req.session as any;
    console.log(`🧪 Debug session GET - ID: ${req.sessionID}, data:`, JSON.stringify(session || {}));
    res.json({ 
      message: 'Session récupérée',
      testValue: session.testValue || 'non trouvée',
      sessionId: req.sessionID,
      hasSession: Boolean(session.testValue),
      fullSession: session,
      cookies: req.headers.cookie
    });
  });

  // Nouveau endpoint pour voir le contenu de la table sessions
  app.get('/api/debug/sessions-db', async (req, res) => {
    try {
      const { db } = await import("./db");
      const { sessions } = await import("@shared/schema");
      
      const allSessions = await db.select().from(sessions).limit(10);
      const now = new Date();
      
      const sessionInfo = allSessions.map(s => ({
        sid: s.sid.substring(0, 10) + '...',
        hasData: Boolean(s.sess),
        expired: s.expire < now,
        expires: s.expire.toISOString()
      }));
      
      res.json({
        totalSessions: allSessions.length,
        sessions: sessionInfo,
        currentTime: now.toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: String(error) });
    }
  });
}
