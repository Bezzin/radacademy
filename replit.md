# Overview

RadAcademy is a full-stack medical education platform built with React and Express, specifically designed for radiology learning. The application provides an interactive learning experience with video lessons, quizzes, progress tracking, and community features for medical professionals studying CT scans, MRI, and X-Ray imaging.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-based session storage
- **API Pattern**: RESTful APIs with JSON responses

# Key Components

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared schema definition in `/shared/schema.ts`
- **Tables**: Users, courses, lessons, quizzes, progress, enrollments, discussions, certificates
- **Migration**: Drizzle Kit for schema migrations

## Authentication & Authorization
- **Role-based Access**: ADMIN, STUDENT, INSTRUCTOR roles
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **User Management**: Profile management with avatar support

## Learning Management System
- **Course Structure**: Hierarchical organization (courses → lessons → quizzes)
- **Progress Tracking**: Lesson completion and quiz performance tracking
- **Video Learning**: Custom video player with progress tracking
- **Assessment**: Interactive quizzes with immediate feedback

## User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Context-based theme switching
- **Medical Theme**: Custom color palette optimized for medical education
- **Component Library**: Consistent UI components with Radix UI primitives

# Data Flow

1. **User Authentication**: Session-based authentication with PostgreSQL storage
2. **Course Discovery**: Users browse courses filtered by specialty (CT, MRI, X-Ray)
3. **Learning Path**: Sequential lesson progression with video content and quizzes
4. **Progress Tracking**: Real-time updates to user progress and completion status
5. **Community Interaction**: Discussion threads and peer interaction
6. **Achievement System**: Certificate generation upon course completion

# External Dependencies

## Production Dependencies
- **UI Framework**: React ecosystem (@tanstack/react-query, wouter)
- **Database**: Drizzle ORM with @neondatabase/serverless
- **UI Components**: Comprehensive Radix UI component library
- **Styling**: Tailwind CSS with PostCSS
- **Utilities**: date-fns, clsx, class-variance-authority

## Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support across client and server
- **Replit Integration**: Custom Vite plugins for Replit environment

# Deployment Strategy

## Development Environment
- **Command**: `npm run dev` - Runs server with tsx for TypeScript execution
- **Hot Reload**: Vite HMR for client-side development
- **Port Configuration**: Server runs on port 5000, mapped to external port 80

## Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Replit autoscale deployment with build and start commands

## Database Configuration
- **Provider**: PostgreSQL (configurable with DATABASE_URL)
- **Migrations**: Drizzle migrations in `/migrations` directory
- **Schema Push**: `npm run db:push` for development schema updates

# User Preferences

Preferred communication style: Simple, everyday language.

# Changelog

Changelog:
- June 16, 2025. Initial setup