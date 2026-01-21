# ByondWork Design System
## "Calm Corporate Energy" Theme Implementation

## Overview
This document outlines the design system implemented for ByondWork — a B2B2C sports & wellness platform for corporate professionals.

### Design Philosophy
**Calm Corporate Energy**: A visual language that balances corporate professionalism with human warmth, optimized for daily use by working professionals.

---

## Design Tokens

### Color System

#### Background Colors
```css
background: #fafafa        /* Off-white base - reduces eye strain */
background-subtle: #f5f5f5 /* Subtle gray for hover states */
background-card: #ffffff   /* Cards stand out slightly from base */
```

**Rationale**: Off-white backgrounds reduce screen glare and create a softer, more comfortable reading experience compared to pure white. This is crucial for corporate professionals spending hours on the platform.

#### Text Colors
```css
text-primary: #1e293b   /* Slate-800 - main content */
text-secondary: #64748b /* Slate-500 - supporting text */
text-tertiary: #94a3b8  /* Slate-400 - metadata, timestamps */
```

**Rationale**: Charcoal tones (not pure black) reduce harsh contrast. Clear hierarchy ensures scannable content at a glance.

#### Accent Color - Wellness Teal
```css
accent-500: #14b8a6  /* Primary CTA and active states */
accent-600: #0d9488  /* Hover state */
accent-700: #0f766e  /* Active/pressed state */
accent-50: #f0fdfa   /* Subtle backgrounds */
```

**Rationale**: 
- **Teal** chosen over blue for wellness association (calm, balance, growth)
- Single accent color prevents visual noise
- Used sparingly: only for CTAs, active states, and highlights
- No gradients — maintains minimal aesthetic

#### Border & Destructive
```css
border: #e2e8f0         /* Soft borders (slate-200) */
border-subtle: #f1f5f9  /* Very subtle dividers */
destructive: #dc2626    /* Muted red for delete/cancel */
```

---

### Typography

**Font Family**: Inter (from Next.js)
- Sans-serif, modern, highly legible
- Similar to Geist/system fonts
- Excellent for both UI and data display

**Hierarchy**:
```css
h1: text-3xl, font-semibold (30px)   /* Page titles */
h2: text-2xl, font-semibold (24px)   /* Section headers */
h3: text-xl, font-semibold (20px)    /* Card/component titles */
h4: text-lg, font-medium (18px)      /* Subsections */
p: text-base, text-secondary         /* Body text */
```

**Rationale**: Clear size jumps make hierarchy obvious. Medium/semibold weights feel professional without being heavy.

---

### Spacing & Layout

**Border Radius**:
- Cards: `0.75rem` (12px) — consistent rounded corners
- Buttons/inputs: `0.5rem` (8px) — slightly tighter
- Badges: `0.375rem` (6px) — compact

**Spacing Scale**: Uses Tailwind default (4px base unit)
- Generous padding: `p-6` (24px) on cards
- Content breathing room: `mb-8` (32px) between sections
- Constrained width: `max-w-content` (1280px) prevents line length issues

**Rationale**: Whitespace communicates calm. Constrained widths keep content scannable on large monitors.

---

## Component Patterns

### 1. Buttons

#### Primary Button (`.btn-primary`)
```tsx
className="btn-primary"
// Solid accent color, white text
// Use for: Main CTAs (Create Event, Join, Submit)
```

#### Secondary Button (`.btn-secondary`)
```tsx
className="btn-secondary"
// Outline style with border
// Use for: Cancel, back actions, Google sign-in
```

#### Destructive Button (`.btn-destructive`)
```tsx
className="btn-destructive"
// Muted red, never loud
// Use for: Delete, leave community, destructive actions
```

**Rationale**: Three variants cover all use cases. Consistent classes ensure uniform behavior (hover, focus, disabled states).

---

### 2. Cards

**Standard Card** (`.card`):
```tsx
className="card"
// White background, soft border, subtle shadow
// 24px padding, 12px border radius
```

**Interactive Cards**:
```tsx
className="card hover:shadow-md transition-shadow cursor-pointer group"
// Subtle shadow lift on hover
// Group hover for nested elements (e.g., title color change)
```

**Rationale**: Cards create clear visual grouping. Subtle shadows avoid heavy UI feel. Group hover provides interaction feedback without animation complexity.

---

### 3. Forms

**Input Field** (`.input-field`):
```tsx
className="input-field"
// Full width, clear borders, accent focus ring
// Consistent padding and sizing
```

**Label** (`.input-label`):
```tsx
className="input-label"
// Small, medium weight, proper spacing
```

**Validation**:
- Inline error messages below fields
- Red-50 background with red text (calm, not alarming)
- No shake animations or aggressive visuals

**Rationale**: Single-column layouts reduce cognitive load. Clear labels and placeholders guide users. Calm error states maintain professional tone.

---

### 4. Layout Components

#### DashboardLayout
**Purpose**: Sidebar navigation for authenticated pages

**Features**:
- Fixed 256px sidebar with navigation
- Logo/brand at top
- User profile at bottom
- Active state highlighting with accent-50 background
- Corporate Admin section visually separated
- Logout button always accessible

**Rationale**: 
- Sidebar provides persistent navigation context
- User knows where they are at all times
- Corporate Admin visually scoped (border-top separator)
- Profile info always visible (builds trust)

#### PageLayout
**Purpose**: Simple wrapper for pages without sidebar (auth, landing)

**Features**:
- Centers content
- Max-width constraint
- Consistent padding

---

### 5. Empty States & Loading

**EmptyState Component**:
```tsx
<EmptyState 
  title="No events found"
  description="Try adjusting your filters"
  actionLabel="Create the first event"
  actionHref="/events/create"
/>
```

**Loading Skeleton**:
```tsx
<LoadingState message="Loading events..." />
// Spinning teal ring, calm messaging
```

**Rationale**: 
- Empty states guide users toward next action
- No harsh spinners — skeletal loaders feel calmer
- Always explain what's loading/missing

---

## UX Rules (Applied)

### 1. **Orientation**
Every page clearly shows:
- ✅ **Where you are**: Page title (h1), breadcrumb via sidebar active state
- ✅ **What you can do**: Primary action button (top-right), navigation options
- ✅ **What happens next**: Empty states guide to create content

### 2. **Feedback**
- ✅ Loading states: Skeleton loaders, not spinners
- ✅ Hover states: Subtle shadow lift on cards, color shift on buttons
- ✅ Focus states: Accent-colored ring on inputs
- ✅ Errors: Calm red background with human-readable text

### 3. **Corporate Admin Scoping**
- ✅ Visually separated in sidebar (border-top, label)
- ✅ Banner on corporate pages: "Corporate Admin Mode" in accent-50
- ✅ No loud colors (no purple gradients)

---

## File Structure

```
src/
├── app/
│   ├── globals.css              # Design tokens, component classes
│   ├── page.tsx                 # Landing page (themed)
│   ├── login/page.tsx           # Auth page (themed)
│   ├── signup/page.tsx          # Auth page (themed)
│   ├── dashboard/page.tsx       # Main dashboard (DashboardLayout)
│   ├── events/page.tsx          # Events list (DashboardLayout)
│   └── communities/page.tsx     # Communities list (DashboardLayout)
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx  # Sidebar layout for authenticated pages
│   │   └── PageLayout.tsx       # Simple wrapper for auth/landing
│   │
│   ├── ui/
│   │   └── EmptyState.tsx       # Empty states & loading skeletons
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx        # Themed auth form
│   │   └── SignupForm.tsx       # Themed auth form
│   │
│   ├── events/
│   │   ├── EventCard.tsx        # Themed card
│   │   └── EventFilters.tsx     # Themed filter sidebar
│   │
│   └── communities/
│       └── CommunityCard.tsx    # Themed card
│
└── tailwind.config.ts           # Design tokens defined
```

---

## Best Practices

### ✅ DO
- Use design tokens (text-text-primary, bg-background)
- Apply `.card`, `.btn-primary`, `.input-field` classes
- Use DashboardLayout for authenticated pages
- Provide empty states for all lists
- Use LoadingState for async operations
- Constrain content width (max-w-content)
- Use group hover for interactive cards

### ❌ DON'T
- Use pure white (#fff) for backgrounds
- Use pure black (#000) for text
- Use multiple accent colors
- Use gradients (except for special cases)
- Use spinners instead of skeletons
- Use animations beyond hover/focus
- Use modals unless absolutely necessary
- Create full-bleed layouts (always pad/constrain)

---

## Theme Consistency Checklist

When adding new pages/components:

- [ ] Uses semantic color tokens (not raw hex)
- [ ] Uses predefined component classes (btn-*, card, input-field)
- [ ] Wrapped in DashboardLayout (if authenticated page)
- [ ] Has empty state with helpful action
- [ ] Has loading state with skeleton/spinner
- [ ] Errors are human-readable and calm
- [ ] Spacing feels generous (p-6, mb-8)
- [ ] Content is constrained (max-w-content)
- [ ] Interactive elements have hover states
- [ ] Focus states are visible (ring-accent)
- [ ] Corporate Admin pages have visual scope indicator

---

## Implementation Summary

### Files Modified
1. `tailwind.config.ts` — Design tokens
2. `globals.css` — Base styles, component classes
3. `page.tsx` (landing) — Themed
4. `login/page.tsx` — Themed
5. `signup/page.tsx` — Themed
6. `dashboard/page.tsx` — DashboardLayout + themed
7. `events/page.tsx` — DashboardLayout + themed
8. `communities/page.tsx` — DashboardLayout + themed
9. `LoginForm.tsx` — Themed
10. `SignupForm.tsx` — Themed
11. `EventCard.tsx` — Themed
12. `CommunityCard.tsx` — Themed
13. `EventFilters.tsx` — Themed

### Files Created
1. `components/layout/DashboardLayout.tsx` — Sidebar layout
2. `components/layout/PageLayout.tsx` — Simple wrapper
3. `components/ui/EmptyState.tsx` — Empty/loading states

---

## Design Rationale Summary

**Why off-white?** Reduces eye strain for professionals using the platform daily.

**Why teal?** Associates with wellness/balance, distinct from typical corporate blue.

**Why no animations?** MVP focus; maintains calm, professional feel; reduces complexity.

**Why sidebar?** Persistent navigation context; users always know where they are.

**Why generous spacing?** Communicates calm, makes content scannable.

**Why card-based layout?** Creates visual grouping, easier to scan than flat lists.

**Why single accent?** Prevents visual noise, maintains minimal aesthetic.

**Why no gradients?** Keeps UI calm and predictable, reduces "flashy" feel.

---

## Next Steps (Post-MVP)

If expanding beyond MVP:
1. **Dark mode**: Already token-based, easy to extend
2. **Motion**: Subtle page transitions (if desired)
3. **Illustrations**: Empty state illustrations (maintain calm aesthetic)
4. **Advanced states**: Skeleton loaders for specific components
5. **Accessibility**: ARIA labels, keyboard navigation enhancements

---

**Theme Status**: ✅ **Production Ready**

All constraints met:
- ✅ No new libraries
- ✅ MVP scope only
- ✅ No architectural changes
- ✅ Styling and layout only
- ✅ Tailwind + shadcn/ui best practices
- ✅ Calm corporate energy achieved
