# Project Structure

## Root Directory
```
pickem-app/
├── src/                     # Source code
├── public/                  # Static assets
├── data/                    # JSON data files (teams, schedules)
├── planning/                # Product requirements and style guide
├── documentation/           # Project documentation
├── node_modules/           # Dependencies
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # Entry HTML file
├── CLAUDE.md              # Claude Code instructions
└── README.md              # Project readme
```

## Source Directory Structure
```
src/
├── react-components/       # Component library
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── GameCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── UserAvatar.tsx
│   │   └── index.ts
│   ├── styles/           # Component styles
│   │   ├── components.css
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── cn.ts        # Class name utility
│   │   ├── helpers.ts
│   │   └── index.ts
│   ├── examples/         # Usage examples
│   ├── types.ts         # TypeScript type definitions
│   └── tailwind-theme.js # Tailwind theme config
├── assets/              # Images and static assets
├── App.tsx             # Main App component
├── App.css             # App-specific styles
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── vite-env.d.ts       # Vite environment types
```

## Key Configuration Files
- `tsconfig.app.json` - Application TypeScript config
- `tsconfig.node.json` - Node TypeScript config
- `vite.config.ts` - Vite bundler configuration with React, TanStack Router, and Tailwind plugins

## Data Directory
Contains JSON files for:
- NFL team information
- Game schedules
- League data (will be replaced by API calls)

## Planning Directory
- `prd.md` - Product Requirements Document
- `style-guide.md` - UI/UX style guide
- `components-preview/` - Component preview examples