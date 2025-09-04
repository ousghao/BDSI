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
    res.json({ 
      message: 'Test session créée', 
      testValue: session.testValue,
      sessionId: session.id 
    });
  });

  app.get('/api/debug/test-session', (req, res) => {
    const session = req.session as any;
    res.json({ 
      message: 'Session récupérée',
      testValue: session.testValue || 'non trouvée',
      sessionId: session.id,
      hasSession: Boolean(session.testValue)
    });
  });
}
