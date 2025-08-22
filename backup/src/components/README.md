# Ocean-to-Sunset React Components

A collection of beautiful, accessible React TypeScript components with glass morphism effects and a ocean-to-sunset color palette. Perfect for drop-in use with Vite + React + Tailwind CSS v4 projects.

## 🎨 Design System

This component library features:
- **Ocean-to-sunset color palette**: From deep midnight navy to warm sunrise gold
- **Glass morphism effects**: Subtle backdrop blur and transparency
- **Accessible design**: WCAG compliant with proper ARIA attributes
- **TypeScript first**: Full type safety and IntelliSense support
- **Modern animations**: Smooth transitions and micro-interactions

## 📦 Installation

### Prerequisites

- React 18+
- TypeScript 4.5+
- Tailwind CSS v4
- A bundler like Vite, Next.js, or Create React App

### Quick Setup

1. **Copy the react-components folder** to your project root:
```bash
cp -r /path/to/react-components ./src/
```

2. **Install required dependencies**:
```bash
npm install clsx tailwind-merge
```

3. **Add the Tailwind theme** to your `tailwind.config.js`:
```javascript
import { tailwindTheme } from './src/react-components';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: tailwindTheme,
  },
  plugins: [],
}
```

4. **Import component styles** in your main CSS file:
```css
@import "tailwindcss";
@import "./react-components/styles/components.css";
```

5. **Start using components**:
```tsx
import { Button, Card, StatusBadge } from './react-components';

function App() {
  return (
    <Card glass hover>
      <h1>Welcome to Ocean-to-Sunset UI</h1>
      <StatusBadge status="live" animate showIndicator />
      <Button variant="primary">Get Started</Button>
    </Card>
  );
}
```

## 🧩 Components

### Button
Flexible button component with multiple variants and loading states.

```tsx
import { Button } from './react-components';

// Primary button
<Button variant="primary">Save Changes</Button>

// Secondary with loading
<Button variant="secondary" loading>
  Submitting...
</Button>

// Ghost button with click handler
<Button variant="ghost" onClick={() => alert('Hello!')}>
  Cancel
</Button>

// Destructive action
<Button variant="destructive" size="lg">
  Delete Account
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'`
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `loading`: boolean
- `disabled`: boolean
- `onClick`: () => void

### Card
Glass morphism card component with flexible content areas.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './react-components';

<Card glass hover padding="lg">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Your content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button variant="outline">Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `glass`: boolean (default: true)
- `hover`: boolean (default: true)
- `padding`: `'sm' | 'md' | 'lg' | 'xl'`

### StatusBadge
Displays status information with optional animations and indicators.

```tsx
import { StatusBadge } from './react-components';

// Live status with animation
<StatusBadge 
  status="live" 
  animate 
  showIndicator 
  indicatorType="pulse" 
/>

// Custom text
<StatusBadge 
  status="scheduled" 
  text="Game starts soon"
  size="lg" 
/>

// Red zone indicator
<StatusBadge 
  status="red_zone" 
  animate 
  showIndicator 
  indicatorType="double-pulse" 
/>
```

**Props:**
- `status`: Various status types including 'live', 'scheduled', 'final', etc.
- `animate`: boolean
- `showIndicator`: boolean
- `indicatorType`: `'pulse' | 'double-pulse'`
- `size`: `'sm' | 'default' | 'lg'`
- `text`: Custom text override

### UserAvatar
User avatar component with customizable icons and colors.

```tsx
import { UserAvatar } from './react-components';

<UserAvatar 
  user={{
    name: "John Doe",
    avatar_icon: "users",
    avatar_color: "ocean-blue"
  }}
  size="lg"
/>
```

**Props:**
- `user.name`: string (optional)
- `user.avatar_icon`: string (icon name)
- `user.avatar_color`: Color from the ocean-to-sunset palette
- `size`: `'sm' | 'md' | 'lg' | 'xl'`

### GameCard
Comprehensive game display component for sports applications.

```tsx
import { GameCard } from './react-components';

const gameData = {
  id: 1,
  status: 'live',
  homeTeam: { id: 1, name: 'Patriots', abbreviation: 'NE' },
  awayTeam: { id: 2, name: 'Bills', abbreviation: 'BUF' },
  homeScore: 14,
  awayScore: 21,
  gameTime: '2024-01-01T20:00:00Z',
  venue: 'Gillette Stadium'
};

<GameCard
  game={gameData}
  showPicks={true}
  userPickTeamId={2}
  onPickTeam={(teamId) => console.log('Picked:', teamId)}
  onRefresh={() => console.log('Refreshing...')}
/>
```

## 🎨 Color System

The ocean-to-sunset palette includes:

- **Midnight Navy**: Deep, professional blue (`#062440`)
- **Ocean Blue**: Rich primary blue (`#005A7C`) 
- **Sky Blue**: Bright accent blue (`#4DA6D9`)
- **Sunset Orange**: Warm attention color (`#FF6B35`)
- **Sunrise Gold**: Golden highlight (`#FFB935`)

## 🔧 Customization

### Extending Colors
Add custom colors to your Tailwind config:

```javascript
theme: {
  extend: {
    ...tailwindTheme,
    colors: {
      ...tailwindTheme.colors,
      brand: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Custom Animations
Override or extend animations in your CSS:

```css
@keyframes custom-bounce {
  /* your animation */
}

.custom-animation {
  animation: custom-bounce 0.5s ease-in-out;
}
```

### Icon Integration
Replace the placeholder icons with your preferred library:

```tsx
// In your components, replace Icon component with:
import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
// or
import { Check, Plus } from 'lucide-react';
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- **Buttons**: Text hides on mobile, shows on `sm:` breakpoint
- **Cards**: Adaptive padding and spacing
- **GameCard**: Compact mode for mobile layouts
- **StatusBadge**: Size variations for different screen sizes

## ♿ Accessibility

Built with accessibility in mind:

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA attributes**: Labels, roles, and states
- **Keyboard navigation**: Focus management and tab order
- **Screen reader support**: Hidden content and descriptive text
- **Color contrast**: WCAG AA compliant color combinations

## 🚀 Performance

Optimized for performance:

- **Tree-shakeable**: Import only what you need
- **TypeScript**: Compile-time optimizations
- **CSS-in-JS free**: Pure CSS classes for better performance
- **Minimal dependencies**: Only `clsx` and `tailwind-merge`

## 📄 License

This component library is extracted from a private NFL Pick'em application and is provided as-is for educational and development purposes.

## 🤝 Contributing

Since this is a extracted component library, modifications should be made by:

1. Copying the components to your project
2. Customizing them for your specific needs
3. Maintaining the design system principles

## 📚 Examples

Check the `examples/` folder for complete usage examples including:

- Dashboard layout
- Form implementations
- Game listings
- User profiles

---

**Happy coding!** 🌊→🌅