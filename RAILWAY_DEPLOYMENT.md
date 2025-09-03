# 🚀 Railway Deployment Guide

This guide explains how to deploy your full-stack React + Express + Supabase application to Railway.

## 📋 Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **Supabase Project**: Make sure your Supabase project is set up and running
3. **GitHub Repository**: Your code should be in a GitHub repository

## 🔧 Pre-deployment Setup

### 1. Test Local Build
Before deploying, test that your production build works locally:

```bash
# Build the application
npm run build

# Test the production server
npm run start
```

Visit `http://localhost:5000` to verify everything works.

### 2. Environment Variables
Make sure your environment variables are correctly configured. The app needs both server-side and client-side environment variables:

**Server-side variables** (available at runtime):
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`
- `NODE_ENV`

**Client-side variables** (required at build time):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🚂 Railway Deployment Steps

### 1. Create New Project
1. Go to [railway.app](https://railway.app) and create a new project
2. Choose "Deploy from GitHub repo"
3. Select your repository

### 2. Configure Environment Variables
In the Railway dashboard, go to your project and add these environment variables:

```env
NODE_ENV=production
DATABASE_URL=your_database_connection_string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SESSION_SECRET=your_super_secure_session_secret
```

**Important**: Both `SUPABASE_*` and `VITE_SUPABASE_*` variables are needed because:
- `SUPABASE_*` variables are used by the server
- `VITE_SUPABASE_*` variables are used by Vite during the client build process

### 3. Railway Configuration
The `railway.toml` file is already configured with:
- Dockerfile builder
- Health check endpoint (`/api/health`)
- Restart policy
- Basic environment variables

### 4. Deploy
1. Push your changes to GitHub
2. Railway will automatically detect the changes and start building
3. The build process will:
   - Install dependencies
   - Build the client (React app)
   - Build the server (Express app)
   - Create a production Docker image
   - Deploy to Railway

### 5. Monitor Deployment
1. Watch the build logs in Railway dashboard
2. Once deployed, visit the provided URL
3. Check the health endpoint: `https://your-app.railway.app/api/health`

## 🔒 Post-deployment Setup

### 1. Update Supabase Configuration
In your Supabase dashboard:

1. Go to **Authentication > Settings**
2. Add your Railway URL to **Site URL**: `https://your-app.railway.app`
3. Add your Railway URL to **Redirect URLs**: `https://your-app.railway.app/**`

### 2. Create Admin User
1. Go to your Supabase Authentication dashboard
2. Create a new user manually
3. Copy the user UUID
4. In your database, add the user to the `users` table with admin role:

```sql
INSERT INTO users (id, email, full_name, role, created_at, updated_at)
VALUES (
  'user-uuid-from-auth',
  'admin@yourdomain.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
);
```

## 🔍 Troubleshooting

### Build Fails
- Check that all required environment variables are set
- Verify the build works locally with `npm run build`
- Check Railway build logs for specific errors

### Runtime Errors
- Check Railway logs for server errors
- Verify database connection with the health endpoint
- Ensure all environment variables are set correctly

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if your database allows connections from Railway's IP ranges
- Test the health endpoint: `/api/health`

### Frontend Issues
- Verify `VITE_*` environment variables were available during build
- Check browser console for JavaScript errors
- Ensure Supabase URLs in client and server environment variables match

## 📊 Monitoring

### Health Check
Visit `https://your-app.railway.app/api/health` to check:
- Server status
- Database connectivity
- Environment configuration

### Railway Metrics
Railway provides built-in monitoring for:
- CPU usage
- Memory usage
- Network traffic
- Request logs

## 🔄 Updates and Maintenance

### Automatic Deployments
Railway automatically deploys when you push to your main branch.

### Manual Deployments
You can trigger manual deployments from the Railway dashboard.

### Database Migrations
Run database migrations using Railway's terminal or scheduled tasks:

```bash
npm run db:push
npm run db:seed
```

## 📚 Architecture Summary

**Production Architecture:**
```
Railway Container
├── Node.js Server (Express)
│   ├── API Routes (/api/*)
│   ├── Authentication
│   ├── Database Operations
│   └── Static File Serving
├── Built React App (served as static files)
├── Health Check Endpoint (/api/health)
└── Database Connection (Supabase/PostgreSQL)
```

**Key Files:**
- `server/production.ts` - Production server (no Vite dependencies)
- `server/static.ts` - Static file serving
- `server/database-check.ts` - Database connection verification
- `Dockerfile` - Container configuration
- `railway.toml` - Railway-specific settings

This architecture ensures:
✅ Fast cold starts (no Vite in production)
✅ Efficient static file serving
✅ Proper environment variable handling
✅ Health monitoring
✅ Graceful error handling
