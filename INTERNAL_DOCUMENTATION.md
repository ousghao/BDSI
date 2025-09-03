# Master BDSI - Internal Documentation

## Repository Overview

**Project**: Official website for Master "Big Data & Systèmes Intelligents – FS Dhar El Mehraz"  
**Architecture**: Full-stack TypeScript application with React frontend and Express backend  
**Database**: PostgreSQL with Drizzle ORM  
**Authentication**: Replit Auth (OpenID Connect)  
**Deployment**: Replit platform  

---

## 🏗️ Repository Structure

```
DataIntelliGate/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   ├── Layout/     # Layout components
│   │   │   └── ui/         # Base UI components (shadcn/ui)
│   │   ├── contexts/       # React contexts (Language, Theme)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configurations
│   │   └── pages/          # Page components
│   │       ├── admin/      # Admin pages
│   │       └── public/     # Public pages
├── server/                 # Backend Express application
│   ├── db.ts              # Database connection
│   ├── index.ts           # Server entry point
│   ├── replitAuth.ts      # Authentication setup
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data access layer
├── shared/                 # Shared code between client/server
│   └── schema.ts          # Database schema and types
└── Configuration files
    ├── package.json       # Dependencies and scripts
    ├── drizzle.config.ts  # Database migration config
    ├── tailwind.config.ts # Styling configuration
    └── vite.config.ts     # Build configuration
```

---

## 📊 Data Model

### Core Entities

#### 1. Users (Authentication)
```typescript
users: {
  id: string (UUID, primary key)
  email: string (unique)
  firstName: string
  lastName: string
  profileImageUrl: string
  role: "student" | "faculty" | "admin" | "editor"
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 2. Courses (Programme/Matières)
```typescript
courses: {
  id: number (serial, primary key)
  title: text (FR)
  titleEn: text (EN)
  titleAr: text (AR)
  description: text (FR)
  descriptionEn: text (EN)
  descriptionAr: text (AR)
  semester: integer
  credits: integer
  objectives: text (FR/EN/AR)
  prerequisites: text (FR/EN/AR)
  evaluation: text (FR/EN/AR)
  resources: text (FR/EN/AR)
  instructorId: string (references users.id)
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 3. Projects (Projets/PFE)
```typescript
projects: {
  id: number (serial, primary key)
  title: text (FR/EN/AR)
  description: text (FR/EN/AR)
  summary: text (FR/EN/AR)
  methodology: text (FR/EN/AR)
  results: text (FR/EN/AR)
  theme: "IA/ML" | "Data Engineering" | "NLP" | "Computer Vision" | "IoT"
  year: integer
  students: text (JSON array)
  supervisors: text (JSON array)
  keywords: text (JSON array)
  awards: text (JSON array)
  documents: text (JSON array of URLs)
  videoUrl: string
  imageUrl: string
  isActive: boolean
  isFeatured: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 4. News (Actualités)
```typescript
news: {
  id: number (serial, primary key)
  title: text (FR/EN/AR)
  summary: text (FR/EN/AR)
  content: text (FR/EN/AR)
  category: "event" | "research" | "success_story" | "announcement"
  imageUrl: string
  authorId: string (references users.id)
  isActive: boolean
  isFeatured: boolean
  publishedAt: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 5. Events (Événements)
```typescript
events: {
  id: number (serial, primary key)
  title: text (FR/EN/AR)
  description: text (FR/EN/AR)
  type: "seminar" | "defense" | "workshop" | "meetup"
  location: text (FR/EN/AR)
  startDate: timestamp
  endDate: timestamp
  speakers: text (JSON array)
  registrationUrl: string
  documentsUrl: string
  imageUrl: string
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 6. Faculty (Équipe)
```typescript
faculty: {
  id: number (serial, primary key)
  userId: string (references users.id)
  name: text (FR/EN/AR)
  title: text (FR/EN/AR)
  specialization: text (FR/EN/AR)
  bio: text (FR/EN/AR)
  research: text (FR/EN/AR)
  email: string
  phone: string
  linkedinUrl: string
  websiteUrl: string
  profileImageUrl: string
  order: integer
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 7. Partnerships (Partenaires)
```typescript
partnerships: {
  id: number (serial, primary key)
  name: text (FR/EN/AR)
  type: "company" | "laboratory" | "institution"
  description: text (FR/EN/AR)
  logoUrl: string
  websiteUrl: string
  contactEmail: string
  contactPerson: text
  isActive: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 8. Testimonials (Accomplissements)
```typescript
testimonials: {
  id: number (serial, primary key)
  name: text
  role: text (FR/EN/AR)
  content: text (FR/EN/AR)
  company: text
  imageUrl: string
  graduationYear: integer
  isActive: boolean
  isFeatured: boolean
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### 9. Settings (Feature Flags & Configuration)
```typescript
settings: {
  id: number (serial, primary key)
  key: string (unique)
  value: text (FR)
  valueEn: text (EN)
  valueAr: text (AR)
  type: "text" | "number" | "boolean" | "json"
  category: string
  updatedAt: timestamp
}
```

---

## 🌐 Page Inventory

### Public Pages (Non-authenticated)
1. **Landing** (`/`) - Splash page with program overview
2. **Program** (`/program`) - Course curriculum and structure
3. **Projects** (`/projects`) - Student projects and PFE showcase
4. **News** (`/news`) - Latest news and announcements
5. **Events** (`/events`) - Upcoming events and seminars
6. **Faculty** (`/faculty`) - Teaching team and researchers
7. **Contact** (`/contact`) - Contact information and form

### Authenticated Pages (All users)
- **Home** (`/`) - Personalized dashboard with recent content

### Admin Pages (Admin role only)
1. **Dashboard** (`/admin`) - Overview of content and statistics
2. **Content** (`/admin/content`) - CRUD operations for all content types
3. **Media Library** (`/admin/media`) - File management and uploads
4. **Settings** (`/admin/settings`) - Feature flags and site configuration

---

## 🔌 API Contract

### Authentication Endpoints
```
GET  /api/auth/user          # Get current user info
GET  /api/login              # Redirect to Replit Auth
GET  /api/callback           # OAuth callback
POST /api/logout             # Logout user
```

### Public Content Endpoints
```
GET  /api/courses            # List all courses
GET  /api/projects           # List projects (with filters)
GET  /api/news               # List news (with filters)
GET  /api/events             # List events (with filters)
GET  /api/faculty            # List faculty members
GET  /api/partnerships       # List partnerships
GET  /api/testimonials       # List testimonials
GET  /api/settings           # Get settings by category
GET  /api/search             # Search across all content
```

### Admin CRUD Endpoints
```
# Projects
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id

# News
POST   /api/admin/news
PUT    /api/admin/news/:id
DELETE /api/admin/news/:id

# Events
POST   /api/admin/events
PUT    /api/admin/events/:id
DELETE /api/admin/events/:id

# Courses
POST   /api/admin/courses
PUT    /api/admin/courses/:id
DELETE /api/admin/courses/:id

# Faculty
POST   /api/admin/faculty
PUT    /api/admin/faculty/:id
DELETE /api/admin/faculty/:id

# Partnerships
POST   /api/admin/partnerships
PUT    /api/admin/partnerships/:id
DELETE /api/admin/partnerships/:id

# Testimonials
POST   /api/admin/testimonials
PUT    /api/admin/testimonials/:id
DELETE /api/admin/testimonials/:id

# Settings
POST   /api/admin/settings
DELETE /api/admin/settings/:key
```

---

## 🔐 Role-Based Access Control (RBAC)

### User Roles
1. **student** - Basic authenticated access
2. **faculty** - Teaching staff access
3. **editor** - Content management access
4. **admin** - Full administrative access

### Permission Matrix
| Role | Public Pages | Authenticated Pages | Content Management | Admin Panel |
|------|-------------|-------------------|-------------------|-------------|
| Guest | ✅ | ❌ | ❌ | ❌ |
| Student | ✅ | ✅ | ❌ | ❌ |
| Faculty | ✅ | ✅ | ❌ | ❌ |
| Editor | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 State Management & Data Flow

### Frontend State Architecture
```
App
├── ThemeProvider (Dark/Light mode)
├── LanguageProvider (FR/EN/AR)
├── QueryClientProvider (React Query)
└── Router
    ├── Public Routes (Non-authenticated)
    ├── Authenticated Routes
    └── Admin Routes (Role-based)
```

### Data Flow Patterns

#### 1. Public Content Loading
```
Page Component → useQuery → API Endpoint → Storage Layer → Database
```

#### 2. Admin Content Management
```
Admin Form → Form Validation → API Endpoint → Storage Layer → Database
                ↓
            Optimistic Updates → Query Invalidation → UI Refresh
```

#### 3. Authentication Flow
```
Login Button → Replit Auth → OAuth Callback → Session Storage → User Context
```

### Key State Management Libraries
- **React Query** - Server state management and caching
- **React Context** - Theme and language preferences
- **React Hook Form** - Form state management
- **Zod** - Schema validation

---

## 🌍 Internationalization (i18n)

### Supported Languages
- **French (FR)** - Primary language
- **English (EN)** - Secondary language  
- **Arabic (AR)** - Tertiary language

### Implementation
- **Context-based**: `LanguageContext` manages current language
- **Local Storage**: Language preference persisted
- **Database**: All content fields have FR/EN/AR variants
- **UI Components**: Language selector in navigation

### Translation Structure
```typescript
translations: {
  'nav.home': { fr: 'Accueil', en: 'Home', ar: 'الرئيسية' },
  'common.loading': { fr: 'Chargement...', en: 'Loading...', ar: 'جارٍ التحميل...' }
}
```

---

## 🎨 UI/UX Architecture

### Design System
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Lucide React** - Icon library

### Theme System
- **Light Mode** - Default theme
- **Dark Mode** - Toggleable via `ThemeProvider`
- **CSS Variables** - Dynamic theming
- **System Preference** - Auto-detection

### Responsive Design
- **Mobile-first** approach
- **Breakpoints**: sm, md, lg, xl
- **Grid System**: CSS Grid + Flexbox
- **Typography**: Responsive font scaling

---

## 🔧 Runtime Interactions

### Frontend ↔ Backend Communication
```
1. React Query manages API calls and caching
2. Axios-like fetch wrapper for HTTP requests
3. Automatic error handling and retry logic
4. Optimistic updates for better UX
```

### Backend ↔ Database Communication
```
1. Drizzle ORM for type-safe database operations
2. Connection pooling via Neon PostgreSQL
3. Transaction support for complex operations
4. Automatic schema validation via Zod
```

### Authentication Flow
```
1. Replit Auth handles OAuth 2.0 flow
2. Session storage in PostgreSQL
3. Passport.js middleware for route protection
4. Role-based access control on frontend and backend
```

---

## 🚀 Deployment & Environment

### Platform
- **Replit** - Hosting and development environment
- **Neon PostgreSQL** - Database service
- **Vite** - Build tool and dev server

### Environment Variables
```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=...
REPLIT_DOMAINS=...
ISSUER_URL=...
REPL_ID=...
```

### Build Process
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run db:push  # Database migrations
```

---

## 📈 Performance Considerations

### Frontend Optimization
- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Responsive images and lazy loading
- **Caching** - React Query cache management
- **Bundle Size** - Tree shaking and optimization

### Backend Optimization
- **Database Indexing** - Optimized queries
- **Connection Pooling** - Efficient database connections
- **Caching** - Memoization for expensive operations
- **Rate Limiting** - API protection

---

## 🔍 Search & Discovery

### Search Implementation
- **Global Search** - Cross-content type search
- **Filters** - Category, date, status filtering
- **Pagination** - Efficient data loading
- **SEO** - Meta tags and structured data

### Content Discovery
- **Featured Content** - Highlighted projects and news
- **Related Content** - Cross-references between entities
- **Tagging System** - Keywords and categories
- **Social Sharing** - Share buttons and metadata

---

## 🛡️ Security Considerations

### Authentication Security
- **OAuth 2.0** - Secure authentication flow
- **Session Management** - Secure session storage
- **CSRF Protection** - Built-in Express protection
- **Role Validation** - Server-side role checks

### Data Security
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Drizzle ORM
- **XSS Protection** - React automatic escaping
- **HTTPS** - Secure communication

---

## 📝 Content Management Workflow

### Content Creation Flow
```
1. Admin logs into admin panel
2. Navigates to Content Management
3. Selects content type (Projects, News, etc.)
4. Fills multilingual form
5. Uploads media files
6. Sets publication status
7. Publishes or saves as draft
```

### Content Approval Process
```
Draft → Review → Published → Archived
```

### Media Management
```
Upload → Process → Store → Serve
```

---

This documentation provides a comprehensive overview of the Master BDSI website architecture, enabling developers to understand the system's structure, data flow, and implementation details for effective maintenance and feature development. 