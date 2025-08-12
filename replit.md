# Replit Configuration

## Overview

This is a full-stack web application for the "Master Big Data & Systèmes Intelligents" program at FS Dhar El Mehraz. It serves as an official portal presenting the master's program, showcasing student projects, centralizing news and events, and strengthening connections with industry and research partners. The platform features both public-facing content and an administrative interface for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built with React and TypeScript, using modern development practices:
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Theme System**: Dark/light mode support with persistent user preferences
- **Internationalization**: Multi-language support (French, English, Arabic) with custom i18n implementation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture  
The server follows a RESTful API design pattern:
- **Framework**: Express.js with TypeScript for the web server
- **Database Layer**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **API Structure**: Resource-based endpoints for courses, projects, news, events, faculty, and settings
- **File Organization**: Modular structure with separate routing, storage, and database layers

### Database Design
PostgreSQL database with comprehensive schema:
- **User Management**: Users table with role-based access (student, faculty, admin, editor)
- **Content Tables**: Separate entities for courses, projects, news, events, faculty, partnerships, and testimonials
- **Multilingual Support**: Fields for French, English, and Arabic content versions
- **Session Storage**: Dedicated sessions table for authentication persistence
- **Rich Metadata**: Support for images, tags, keywords, and structured data (JSON fields)

### Component Architecture
Modular React component system:
- **Layout Components**: Reusable header, footer, and navigation with responsive design
- **Content Cards**: Specialized components for projects, news, events, and faculty display
- **Admin Interface**: Separate administrative components for content management
- **UI Library**: shadcn/ui components for consistent design patterns
- **Theme Provider**: Context-based theme management with system preference detection

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database via Neon serverless PostgreSQL
- **Connection Pooling**: @neondatabase/serverless for optimized database connections

### Authentication & Security
- **Replit Auth**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware with OpenID Client strategy
- **Session Storage**: connect-pg-simple for PostgreSQL-backed sessions

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing with Tailwind CSS integration

### Runtime & Deployment
- **Node.js**: Server runtime environment
- **Express**: Web application framework
- **Vite**: Frontend development server and build tool
- **WebSocket**: Real-time connection support via ws library