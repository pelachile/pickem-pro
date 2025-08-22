# Task Completion Checklist

When completing any development task, ensure you:

## 1. Code Quality Checks
- [ ] Run `npm run lint` to check for ESLint errors and warnings
- [ ] Run `npm run build` to ensure TypeScript compilation succeeds
- [ ] Fix any linting errors or TypeScript compilation issues

## 2. Code Style Verification
- [ ] Verify components follow the established React.FC pattern
- [ ] Ensure proper TypeScript types are defined for all props
- [ ] Check that Tailwind utilities are used consistently
- [ ] Confirm color palette variables are used (not hardcoded colors)

## 3. Component Guidelines
- [ ] New components are placed in `src/react-components/components/`
- [ ] Component exports are added to the appropriate index.ts file
- [ ] Props interfaces are properly defined with TypeScript
- [ ] Default props are handled via destructuring

## 4. Testing Considerations
- [ ] Manual testing in development server (`npm run dev`)
- [ ] Verify hot module replacement (HMR) works correctly
- [ ] Check component renders correctly in both light and dark modes
- [ ] Test responsive behavior at different viewport sizes

## 5. Pre-commit Checklist
- [ ] All lint errors are resolved
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Code follows project conventions
- [ ] CLAUDE.md is updated if new commands or patterns are introduced

## Important Notes
- Currently no automated tests to run
- Always verify changes in the dev server before considering task complete
- If adding new dependencies, update package.json and run `npm install`