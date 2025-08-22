# CLAUDE.md - Next.js Migration

This file provides guidance to Claude Code when working with the NFL Pick'em app converted from Vite+TanStack Router to Next.js App Router.

## Project History & Context

This project was originally built with:
- React 19 + TypeScript + Vite
- TanStack Router for routing
- Custom glass morphism component library
- AWS Amplify Gen2 backend

**Migration Reason**: Build issues with native dependencies (@parcel/watcher) in AWS Amplify deployment. Converted to Next.js for better AWS Amplify compatibility.

## Project Overview

NFL Pick'em League application built with Next.js 14+ (App Router) and AWS Amplify Gen2 serverless backend.

### Technology Stack
- **Frontend**: Next.js 14+ with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom ocean-to-sunset theme
- **Backend**: AWS Amplify Gen2 (Cognito auth, AppSync GraphQL, DynamoDB)
- **Deployment**: AWS Amplify Hosting

## Architecture

### Frontend Structure (Next.js App Router)
```
app/
├── layout.tsx                 # Root layout with AuthContext
├── page.tsx                   # Landing page
├── (auth)/                    # Auth route group
│   ├── login/page.tsx         # Login page
│   ├── register/page.tsx      # Register page
│   └── layout.tsx             # Auth layout
├── (dashboard)/               # Protected routes group
│   ├── dashboard/page.tsx     # Main dashboard
│   ├── make-picks/page.tsx    # Pick selection
│   ├── leagues/page.tsx       # League management
│   ├── stats/page.tsx         # Statistics
│   └── layout.tsx             # Authenticated layout (sidebar)
└── globals.css                # Global styles + Tailwind

components/                    # Reusable UI components
├── ui/                        # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── GameCard.tsx
│   ├── StatusBadge.tsx
│   └── UserAvatar.tsx
├── layout/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── PageTransition.tsx
└── auth/
    ├── LoginForm.tsx
    └── RegisterForm.tsx

lib/                           # Utilities and configurations
├── auth/                      # Auth utilities
├── utils.ts                   # Helper functions
└── types.ts                   # TypeScript interfaces
```

### Backend Integration (AWS Amplify Gen2)
- **Authentication**: AWS Cognito user pools
- **API**: GraphQL with real-time subscriptions
- **Database**: DynamoDB with optimized query patterns
- **Functions**: Lambda for ESPN API data sync

### Core Data Models
```typescript
// Teams, Games, Picks, Leagues, LeagueMembers
// See amplify/data/resource.ts for complete schema
```

## Custom Component Library

### Design System
**Ocean-to-Sunset Color Palette:**
- Midnight Navy (#062440) - Primary dark
- Ocean Blue (#005A7C) - Primary
- Sky Blue (#4DA6D9) - Accent
- Sunset Orange (#FF6B35) - Warning/CTA
- Sunrise Gold (#FFB935) - Success

**Glass Morphism Effects:**
- `bg-navy-900/95 backdrop-blur-lg border border-sky-400/20`
- Subtle animations with `transition-all duration-300 ease-out`
- Hover states with `hover:scale-105` transforms

### Key Components
1. **GameCard** - NFL game display with team info, scores, status
2. **Sidebar** - Static navigation with league quick actions
3. **AuthenticatedLayout** - Dashboard layout with sidebar
4. **Button** - Multiple variants (primary, secondary, ghost)
5. **StatusBadge** - Game status indicators

## Commands

### Development
- **Start dev server**: `npm run dev`
- **Build project**: `npm run build`
- **Start production**: `npm start`
- **Lint code**: `npm run lint`

### AWS Amplify
- **Start sandbox**: `npx ampx sandbox`
- **Deploy backend**: `npx ampx pipeline-deploy --branch main`

## File Transfer Checklist

### Essential Files to Transfer:
- [ ] `amplify/` - Complete backend configuration
- [ ] `data/teams-and-schedule.json` - NFL data
- [ ] `planning/` - PRD and style guide
- [ ] Custom components from `src/react-components/`
- [ ] Auth context from `src/contexts/`
- [ ] Custom utilities and types
- [ ] Tailwind configuration

### Dependencies to Add:
```json
{
  "@aws-amplify/ui-react": "^6.11.2",
  "@headlessui/react": "^2.2.7",
  "@heroicons/react": "^2.2.0",
  "aws-amplify": "^6.15.5",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

## Migration Notes

### Router Conversion
- TanStack Router → Next.js App Router
- File-based routing instead of route trees
- Server/Client component considerations
- Layout hierarchies with route groups

### Component Updates
- Add `'use client'` for interactive components
- Convert router hooks: `useLocation` → `usePathname`
- Update Link components to Next.js `<Link>`

### Authentication
- Maintain AWS Amplify auth flow
- Update context to work with App Router
- Consider server-side auth state

## Development Guidelines

### State Management
- React Context for auth and global state
- AWS Amplify for backend state
- Local state with hooks

### Performance
- Use Next.js Image component for logos
- Implement proper loading states
- Leverage App Router streaming

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Tailwind utilities over custom CSS

## Known Working Patterns

### Successful Implementations
1. ✅ Static sidebar with smooth content transitions
2. ✅ Glass morphism component library
3. ✅ AWS Amplify Gen2 authentication
4. ✅ GraphQL schema with proper relationships
5. ✅ ESPN API integration via Lambda

### Previous Issues (Now Resolved)
- Build failures with @parcel/watcher (fixed by Next.js)
- TanStack Router complexity (replaced with App Router)
- React 19 compatibility issues (Next.js handles this)

## Post-Migration Tasks
1. Test all authentication flows
2. Verify component styling matches original
3. Test AWS Amplify deployment
4. Validate ESPN data integration
5. Ensure responsive design works
6. Test real-time GraphQL subscriptions

---

**Migration Context**: This project was successfully converted from Vite+TanStack Router to Next.js App Router to resolve AWS Amplify build issues while preserving all custom components and backend architecture.