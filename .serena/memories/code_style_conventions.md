# Code Style and Conventions

## TypeScript Configuration
- **Strict mode** is enabled
- Target: ES2022
- Module: ESNext with bundler module resolution
- JSX: react-jsx transform
- Linting rules:
  - `noUnusedLocals`: true
  - `noUnusedParameters`: true
  - `noFallthroughCasesInSwitch`: true
  - `noUncheckedSideEffectImports`: true

## React Conventions
- **Functional components** with hooks (no class components)
- Use `React.FC<Props>` for component type definitions
- Props interfaces are defined for all components
- Default props are provided using destructuring with defaults

## Component Structure Pattern
```typescript
interface ComponentNameProps {
  prop1?: string;
  prop2?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1 = 'default',
  prop2 = false,
  className,
  children,
  ...props
}) => {
  // Component logic
  return <div>{/* JSX */}</div>;
};
```

## Styling Conventions
- **Tailwind CSS utilities** are preferred over custom CSS
- Component styles use the `cn()` utility function for class name merging
- Glass morphism effects with backdrop-blur
- Consistent color palette variables (ocean-blue, sky-blue, etc.)
- Dark mode support with dark: prefixes

## File Organization
- Components in `src/react-components/components/`
- Types in `src/react-components/types.ts`
- Utils in `src/react-components/utils/`
- Styles in `src/react-components/styles/`
- Use index.ts files for barrel exports

## Naming Conventions
- Components: PascalCase (e.g., `GameCard.tsx`)
- Utilities: camelCase (e.g., `helpers.ts`)
- Types/Interfaces: PascalCase with descriptive suffixes (e.g., `ButtonProps`)
- CSS classes: kebab-case or Tailwind utilities

## Import Organization
1. React and external libraries
2. Internal components and utilities
3. Types and interfaces
4. Styles

## ESLint Rules
- Follows @eslint/js recommended rules
- TypeScript ESLint recommended rules
- React Hooks rules enforced
- React Refresh rules for Vite