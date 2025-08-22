# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an NFL Pick'em League application built with React 19 and TypeScript, using Vite as the build tool and Tailwind CSS v4 for styling. The project includes TanStack Router for routing and is prepared for Supabase backend integration.

## Commands

### Development
- **Start dev server**: `npm run dev` - Runs the Vite development server with hot module replacement
- **Build project**: `npm run build` - Runs TypeScript compiler then creates production build with Vite
- **Preview build**: `npm run preview` - Preview the production build locally
- **Lint code**: `npm run lint` - Run ESLint to check code quality

### Testing
No test configuration is currently set up. When adding tests, consider using Vitest which integrates well with Vite.

## Architecture

### Frontend Stack
- **React 19** with TypeScript for the UI layer
- **Vite** for fast development and optimized builds
- **Tailwind CSS v4** with @tailwindcss/vite plugin for utility-first styling
- **TanStack Router** for type-safe routing with code splitting enabled
- **Component Library**: Custom ocean-to-sunset themed components in `src/react-components/`

### Project Structure
- `src/react-components/` - Reusable UI component library with glass morphism design
  - `components/` - Individual components (Button, Card, GameCard, StatusBadge, UserAvatar)
  - `styles/` - Component-specific CSS
  - `utils/` - Helper functions and utilities
  - `types.ts` - TypeScript interfaces and types
- `data/` - JSON data files for teams and schedules (will be replaced by API calls)
- `planning/` - Product requirements document and style guide

### Backend Integration (Supabase Ready)
The application is prepared for Supabase backend integration with:

**Authentication (To Be Implemented)**
- Supabase Auth for user authentication and authorization
- Sign-up, sign-in, password reset, and user profile management
- Row Level Security (RLS) for data access control

**Database & API (To Be Implemented)**
- PostgreSQL database with Supabase
- Real-time subscriptions for live updates
- Auto-generated REST and GraphQL APIs

**Core Features (To Be Implemented)**
- League management (create, join, standings)
- Pick submission and tracking with real-time updates
- User profiles and authentication state management
- Third-party API integrations for NFL data

**Key Files**
- `src/contexts/AuthContext.tsx` - Placeholder authentication context (ready for Supabase integration)
- Future: Supabase client configuration and type definitions

### Routing Configuration
TanStack Router is configured in `vite.config.ts` with:
- Auto code-splitting enabled for better performance
- React as the target framework

### Component Design System
The project uses a custom ocean-to-sunset color palette with glass morphism effects:
- **Midnight Navy** (#062440)
- **Ocean Blue** (#005A7C)
- **Sky Blue** (#4DA6D9)
- **Sunset Orange** (#FF6B35)
- **Sunrise Gold** (#FFB935)

Components follow atomic design principles and are fully typed with TypeScript.

## Development Guidelines

### State Management
Currently using React hooks and Context API (ready for Supabase integration):
- AuthContext for authentication state (placeholder implementation)
- Future: LeagueContext for active league management
- Future: PickContext for game picks and real-time updates
- Future: Supabase real-time subscriptions for cross-app updates

### API Integration
When implementing API calls with Supabase:
1. Set up Supabase client with environment-specific configuration
2. Use Supabase auto-generated TypeScript types for type safety
3. Implement proper error handling and loading states
4. Use Supabase real-time subscriptions for live data updates
5. Leverage Supabase's built-in caching and offline capabilities

### Component Development
When creating new components:
1. Follow the existing pattern in `src/react-components/`
2. Use the established color palette and glass morphism effects
3. Ensure components are accessible with proper ARIA attributes
4. Include TypeScript types for all props

### Code Style
- TypeScript strict mode is enabled
- Use functional components with hooks
- Follow ESLint rules configured in `eslint.config.js`
- Tailwind utilities are preferred over custom CSS
- Don't ask to run npm run dev, it is already running
- User will run the dev server
- dev server is already running