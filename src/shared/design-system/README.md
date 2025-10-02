# Law Bandhu Design System

A comprehensive, professional design system for the Law Bandhu legal services platform.

## 🎨 Overview

The Law Bandhu Design System provides a consistent, scalable, and professional foundation for building legal services interfaces. It includes design tokens, components, patterns, and utilities that ensure consistency across the entire platform.

## 📁 Structure

```
src/shared/design-system/
├── tokens/
│   ├── colors.ts          # Color palette and semantic colors
│   ├── typography.ts      # Font scales, weights, and text styles
│   ├── spacing.ts         # Spacing, shadows, borders, z-index
│   └── components.ts      # Component-specific tokens
├── components/
│   ├── Button.tsx         # Button variants and specialized buttons
│   ├── Input.tsx          # Input component with variants
│   ├── Card.tsx           # Card component with sub-components
│   ├── Badge.tsx          # Badge component with status variants
│   └── Alert.tsx          # Alert component with legal-specific variants
├── utils/
│   ├── classNames.ts      # Class name utilities and helpers
│   └── responsive.ts      # Responsive design utilities
├── theme.ts               # Main theme configuration
└── index.ts               # Main exports
```

## 🎯 Design Tokens

### Colors
- **Primary**: Blue color scale (blue-50 to blue-950)
- **Secondary**: Slate color scale for text and backgrounds
- **Status**: Success (green), Warning (amber), Error (red)
- **Legal**: Gold and purple accents for legal contexts
- **Semantic**: Pre-defined color purposes (text, background, border)

### Typography
- **Font Family**: Inter (primary), Source Serif Pro (legal documents)
- **Scale**: From 12px (xs) to 128px (9xl)
- **Semantic Styles**: h1-h6, body, button, legal text
- **Responsive Classes**: Mobile-first typography scaling

### Spacing
- **Base Scale**: 4px base unit (0.25rem)
- **Semantic Spacing**: Component padding, margins, gaps
- **Layout Spacing**: Section, container, grid spacing
- **Border Radius**: From 2px (sm) to 24px (3xl)

## 🧩 Components

### Button Component
```tsx
import { Button, MicrophoneButton, AnalyzeButton } from '@/shared/design-system';

// Standard variants
<Button variant="primary" size="md">Primary Button</Button>
<Button variant="outline" size="lg">Outline Button</Button>

// Specialized buttons
<MicrophoneButton isLoading={isListening} />
<AnalyzeButton size="lg" isLoading={isAnalyzing}>Analyze Legal Rights</AnalyzeButton>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`, `destructive`  
**Sizes**: `sm`, `md`, `lg`, `xl`, `icon`

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/design-system';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Legal Analysis</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

**Variants**: `default`, `elevated`, `outline`, `ghost`  
**Padding**: `sm`, `md`, `lg`

### Badge Component
```tsx
import { Badge, StatusBadge, LegalBadge, RiskBadge } from '@/shared/design-system';

<Badge variant="primary" size="md">Legal</Badge>
<StatusBadge status="active">Active Case</StatusBadge>
<RiskBadge risk="medium">Medium Risk</RiskBadge>
<LegalBadge>Legal Document</LegalBadge>
```

### Alert Component
```tsx
import { Alert, LegalNoticeAlert, ErrorAlert } from '@/shared/design-system';

<LegalNoticeAlert 
  title="Legal Notice" 
  description="This analysis is for informational purposes only." 
/>

<ErrorAlert 
  title="Analysis Error" 
  description="Please provide a valid legal concern." 
  dismissible 
/>
```

## 🛠 Utilities

### Class Name Utilities
```tsx
import { cn, colorVariant, focusRing } from '@/shared/design-system/utils/classNames';

const buttonClass = cn(
  'px-4 py-2 rounded',
  colorVariant('blue', 'solid'),
  focusRing('blue')
);
```

### Responsive Utilities
```tsx
import { useResponsive, responsivePatterns } from '@/shared/design-system/utils/responsive';

const { isMobile, isDesktop } = useResponsive();

<div className={responsivePatterns.cardGrid}>
  {/* Responsive card grid */}
</div>
```

## 🎨 Theme Usage

### CSS Custom Properties
The design system automatically generates CSS custom properties for theming:

```css
:root {
  --theme-primary: #2563eb;
  --theme-primary-hover: #1d4ed8;
  --theme-text-primary: #0f172a;
  --theme-background: #ffffff;
}
```

### Theme Configuration
```tsx
import { theme, applyTheme } from '@/shared/design-system';

// Apply theme to document
applyTheme();

// Access theme values
const primaryColor = theme.semantic.primary;
const spacing = theme.spacing[4];
```

## 📱 Responsive Design

### Breakpoints
- `xs`: 475px
- `sm`: 640px  
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Responsive Patterns
```tsx
// Pre-built responsive layouts
<div className={responsivePatterns.twoColumn}>
  <div>Content 1</div>
  <div>Content 2</div>
</div>

<div className={responsivePatterns.cardGrid}>
  {/* Auto-responsive card grid */}
</div>
```

## 🎯 Legal-Specific Features

### Legal Components
- **LegalBadge**: Gold-themed badges for legal content
- **LegalNoticeAlert**: Warning alerts for legal disclaimers
- **Legal Document Styles**: Serif typography for formal documents

### Legal Color Palette
- **Legal Gold**: For certifications and achievements
- **Legal Purple**: For legal authority and professionalism
- **Analysis Blue**: For AI analysis sections

## 🚀 Best Practices

### Component Usage
1. **Always use design system components** instead of custom styling
2. **Use semantic color tokens** rather than specific color values
3. **Apply responsive patterns** for consistent layouts
4. **Use specialized components** (MicrophoneButton, AnalyzeButton) for common patterns

### Consistency Guidelines
1. **Spacing**: Use the 4px grid system consistently
2. **Typography**: Use semantic text styles (h1-h6, body, etc.)
3. **Colors**: Stick to the defined color palette
4. **Shadows**: Use predefined shadow tokens

### Performance
1. **Tree-shaking friendly**: Import only what you need
2. **CSS-in-JS optimized**: Minimal runtime overhead
3. **TypeScript support**: Full type safety

## 🔄 Updates Applied

The Legal Rights Checker has been updated to use the new design system:

✅ **Microphone Button**: Now matches dashboard style (small, integrated)  
✅ **Analyze Button**: Consistent with dashboard analyze button  
✅ **Layout**: Dashboard-style input + button layout  
✅ **Status Messages**: Compact, dashboard-style feedback  
✅ **Color Consistency**: Uses website color scheme (blue-600/blue-700)  

### Before vs After
- **Before**: Large, custom-styled buttons with inconsistent colors
- **After**: Small, professional buttons matching dashboard exactly
- **Improvement**: Consistent user experience across all sections

## 📖 Usage Examples

### Dashboard-Style Input Section
```tsx
// The new Legal Rights Checker uses this exact pattern
<div className="flex gap-4">
  <div className="flex-1 relative">
    <Textarea
      placeholder="Describe your legal issue..."
      className="min-h-[80px] pr-12 text-sm resize-none border border-slate-300 rounded-md"
    />
    <button className="absolute right-2 top-2 p-1.5 rounded-sm transition-colors">
      <Mic className="h-4 w-4" />
    </button>
  </div>
  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 h-10">
    <Send className="h-3 w-3 mr-1" />
    Analyze
  </Button>
</div>
```

This provides a comprehensive, professional design system that ensures consistency across the entire Law Bandhu platform while maintaining the specific legal services context and requirements.