# Law Bandhu Design System

A comprehensive design system for Law Bandhu platform ensuring consistent UI/UX across all components.

## Overview

The Law Bandhu Design System provides:
- **Consistent Colors**: Blue primary (#3b82f6) and gold secondary (#f59e0b) brand colors
- **Typography**: Inter font family with predefined scales
- **Spacing**: 8px grid system for precise layout control
- **Components**: Reusable UI components with consistent styling
- **Theme**: Centralized design tokens for easy maintenance

## Installation

The design system is already integrated into the project. Import components as needed:

```tsx
import { Button, Card, Input, Badge, Alert, Typography } from '@/shared/design-system';
```

## Core Components

### Button
```tsx
<Button variant="primary" size="md">
  Click me
</Button>

// Available variants: primary, secondary, outline, ghost, success, warning, error
// Available sizes: sm, md, lg, xl
```

### Card
```tsx
<Card variant="default" padding="md">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

// Available variants: default, elevated, outlined, filled
// Available padding: none, sm, md, lg, xl
```

### Input
```tsx
<Input
  label="Email"
  placeholder="Enter your email"
  size="md"
  helperText="We'll never share your email"
/>

// Available sizes: sm, md, lg
```

### Badge
```tsx
<Badge variant="primary" size="md">
  New
</Badge>

// Available variants: primary, secondary, success, warning, error, info
// Available sizes: sm, md, lg
```

### Alert
```tsx
<Alert variant="info" title="Information">
  This is an informational message
</Alert>

// Available variants: info, success, warning, error
```

### Typography
```tsx
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption">Small caption text</Typography>

// Available variants: h1, h2, h3, h4, h5, h6, body, body-sm, caption, overline
```

## Design Tokens

### Colors

#### Brand Colors
- **Primary**: Blue scale (#eff6ff to #1e3a8a)
- **Secondary**: Gold scale (#fffbeb to #78350f)

#### Neutral Colors
- **Slate**: Neutral scale (#f8fafc to #0f172a)

#### Semantic Colors
- **Success**: #10b981
- **Warning**: #f59e0b
- **Error**: #ef4444
- **Info**: #3b82f6

### Typography

#### Font Family
- **Primary**: Inter (web font)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

#### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Spacing (8px Grid)

- **1**: 0.125rem (2px)
- **2**: 0.25rem (4px)
- **3**: 0.375rem (6px)
- **4**: 0.5rem (8px)
- **6**: 0.75rem (12px)
- **8**: 1rem (16px)
- **10**: 1.25rem (20px)
- **12**: 1.5rem (24px)
- **16**: 2rem (32px)
- **20**: 2.5rem (40px)
- **24**: 3rem (48px)
- **32**: 4rem (64px)
- **40**: 5rem (80px)
- **48**: 6rem (96px)
- **64**: 8rem (128px)

### Border Radius

- **none**: 0
- **sm**: 0.125rem (2px)
- **base**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **full**: 9999px

### Shadows

- **sm**: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- **base**: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- **md**: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- **lg**: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
- **xl**: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)

### Transitions

- **fast**: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- **base**: 200ms cubic-bezier(0.4, 0, 0.2, 1)
- **slow**: 300ms cubic-bezier(0.4, 0, 0.2, 1)

## CSS Variables

All design tokens are available as CSS variables with the `--lb-` prefix:

```css
/* Colors */
--lb-primary-500: #3b82f6;
--lb-secondary-500: #f59e0b;

/* Typography */
--lb-font-family: 'Inter', sans-serif;
--lb-font-size-base: 1rem;

/* Spacing */
--lb-space-4: 0.5rem;
--lb-space-8: 1rem;

/* Shadows */
--lb-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

## Utility Classes

### Layout
- `.lb-container`: Max-width container with padding
- `.lb-section`: Section with vertical padding
- `.lb-grid`: Grid layout with gap
- `.lb-flex`: Flex layout with gap
- `.lb-card-grid`: Responsive card grid

### Animations
- `.lb-fade-in`: Fade in animation
- `.lb-slide-up`: Slide up animation

### Responsive
- Responsive utilities for mobile-first design
- Breakpoints follow standard conventions

## Usage Guidelines

### Consistency
- Always use design system components instead of custom elements
- Stick to the defined color palette and spacing scale
- Use consistent typography variants

### Accessibility
- All components include proper focus states
- Color contrast meets WCAG guidelines
- Semantic HTML is used throughout

### Performance
- Components are optimized for bundle size
- CSS variables enable efficient theming
- Animations use transform and opacity for smooth performance

## Migration from Existing Components

The design system is backward-compatible with existing shadcn/ui components:

```tsx
// Old way (still works)
import { Button } from '@/components/ui/button';

// New way (recommended)
import { Button } from '@/shared/design-system';
```

## Future Enhancements

- Dark theme support
- Additional component variants
- Advanced animation utilities
- Mobile-specific optimizations
- Integration with state management

---

For questions or contributions to the design system, please refer to the development team.
