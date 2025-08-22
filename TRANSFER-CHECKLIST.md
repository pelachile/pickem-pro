# Next.js Transfer Checklist

## Essential Files to Copy (in order of priority):

### 1. Backend Configuration
- [ ] `amplify/` (entire directory) - Complete AWS backend
- [ ] `amplify_outputs.json` - Generated config file

### 2. Project Documentation & Context
- [ ] `CLAUDE-NEXTJS-TRANSFER.md` → `CLAUDE.md` (rename)
- [ ] `planning/prd.md` - Product requirements
- [ ] `planning/style-guide.md` - Design system docs

### 3. Custom Component Library
- [ ] `src/react-components/` → `components/`
- [ ] `src/components/layout/` → `components/layout/`
- [ ] `src/components/ui/` → `components/ui/`

### 4. Authentication & Context
- [ ] `src/contexts/AuthContext.tsx` → `lib/contexts/`

### 5. Data & Content
- [ ] `data/teams-and-schedule.json` → `data/`
- [ ] `public/images/teams/` → `public/images/teams/`
- [ ] `scripts/` (for data updates)

### 6. GraphQL & API
- [ ] `src/graphql/` → `lib/graphql/`

### 7. Utilities & Types
- [ ] `src/utils/` → `lib/utils/`
- [ ] Custom types from `src/components/types.ts`

### 8. Styling
- [ ] Color palette values from `tailwind.config.js`
- [ ] Custom CSS from `src/index.css`

## Package.json Dependencies to Add:
```json
{
  "@aws-amplify/ui-react": "^6.11.2",
  "@headlessui/react": "^2.2.7", 
  "@heroicons/react": "^2.2.0",
  "aws-amplify": "^6.15.5",
  "axios": "^1.11.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

## Custom Tailwind Colors:
```js
// Add to tailwind.config.js
colors: {
  'navy': {
    900: '#062440',
  },
  'ocean': {
    600: '#005A7C', 
  },
  'sky': {
    400: '#4DA6D9',
  },
  'sunset': {
    500: '#FF6B35',
  },
  'sunrise': {
    500: '#FFB935',
  }
}
```

## Route Conversion Guide:
- `src/routes/_authenticated/dashboard.tsx` → `app/(dashboard)/dashboard/page.tsx`
- `src/routes/_authenticated/make-picks.tsx` → `app/(dashboard)/make-picks/page.tsx`
- `src/routes/_authenticated/leagues.tsx` → `app/(dashboard)/leagues/page.tsx`
- `src/routes/_authenticated/stats.tsx` → `app/(dashboard)/stats/page.tsx`
- `src/routes/login.tsx` → `app/(auth)/login/page.tsx`
- `src/routes/register.tsx` → `app/(auth)/register/page.tsx`

## Component Updates Needed:
1. Add `'use client'` to interactive components
2. Convert `Link` from TanStack to Next.js
3. Update `useLocation` → `usePathname`
4. Convert layouts to Next.js layout files

## Key Context to Preserve:
- Ocean-to-sunset color palette
- Glass morphism design system  
- Static sidebar architecture
- NFL Pick'em domain logic
- AWS Amplify Gen2 setup
- Custom authentication flow