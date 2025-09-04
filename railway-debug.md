# Railway Deployment Debug Guide

## Variables d'environnement requises sur Railway

Assurez-vous que ces variables sont configurées dans Railway Dashboard :

### Base de données
- `DATABASE_URL` - URL de connexion Supabase PostgreSQL
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_ANON_KEY` - Clé anonyme Supabase

### Session & Sécurité
- `SESSION_SECRET` - Clé secrète pour les sessions (générer une clé forte)
- `NODE_ENV=production`

### Optionnel
- `VITE_SUPABASE_URL` - Même que SUPABASE_URL (pour le build client)
- `VITE_SUPABASE_ANON_KEY` - Même que SUPABASE_ANON_KEY (pour le build client)

## Commandes utiles Railway CLI

```bash
# Voir les logs en temps réel
railway logs -f

# Déployer manuellement
railway up

# Voir les variables d'environnement
railway variables

# Se connecter à la base de données
railway connect postgresql
```

## Debug des sessions

Les logs de production doivent montrer :
```
Session configuration: secure=true, env=production, railway=production
```

Si `secure=false` sur Railway, alors `RAILWAY_ENVIRONMENT` n'est pas définie.

## Solutions possibles

1. **Vérifier les variables d'environnement Railway**
2. **Générer une SESSION_SECRET forte** : `openssl rand -base64 32`
3. **S'assurer que l'admin existe** : utiliser `npm run db:create-admin` en local puis redéployer
4. **Vérifier que Railway détecte bien l'environnement de production**
