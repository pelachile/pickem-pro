# Usage Examples

This folder contains complete, runnable examples demonstrating how to use the Ocean-to-Sunset component library.

## 🏁 Quick Start

Copy any example file to your React project and import the components:

```tsx
import { BasicUsage } from './react-components/examples';

function App() {
  return <BasicUsage />;
}
```

## 📁 Examples

### BasicUsage.tsx
Comprehensive showcase of all component variants and their basic usage patterns. Perfect for understanding component APIs and visual design.

**Features:**
- All button variants and states
- Status badge animations and indicators  
- User avatar sizes and colors
- Card layouts with glass morphism
- Interactive loading states

### GamesDashboard.tsx
Real-world dashboard implementation for a sports application. Shows how components work together in a complete interface.

**Features:**
- Live game cards with real-time updates
- User pick functionality
- Responsive grid layouts
- Status filtering and organization
- Summary statistics display

## 🛠️ Customization

Each example can be customized by:

1. **Modifying colors**: Update the Tailwind theme configuration
2. **Changing animations**: Override CSS animation classes
3. **Adding features**: Extend component props and functionality
4. **Styling adjustments**: Add custom CSS classes

## 🚀 Integration

To integrate these examples into your project:

1. Copy the example files to your `src/` directory
2. Install dependencies: `npm install clsx tailwind-merge`
3. Configure Tailwind with the provided theme
4. Import and use the example components

## 💡 Best Practices

- **Mobile-first**: Examples demonstrate responsive design patterns
- **Accessibility**: Proper ARIA attributes and semantic HTML
- **Performance**: Efficient state management and rendering
- **Type safety**: Full TypeScript integration

## 🔮 Future Examples

Planned additions:
- Form validation patterns
- Data table implementations
- Modal and overlay patterns
- Navigation and routing
- Chart and data visualization