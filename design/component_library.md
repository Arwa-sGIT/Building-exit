# Exit - Component Library
## UI Component Specifications

**Version:** 1.0  
**Status:** Implementation Ready  
**Last Updated:** January 2026

---

## DESIGN TOKENS

### Color Tokens

```typescript
const colors = {
  // Base
  void_black: '#050505',
  void_dark: '#0A0A0A',
  charcoal: '#1A1A1A',
  
  // Text
  ethereal_white: '#F5F5F0',
  muted_white: 'rgba(245, 245, 240, 0.7)',
  subtle_white: 'rgba(245, 245, 240, 0.4)',
  
  // Accent (choose ONE for the app)
  accent_sage: '#8B9D83',
  accent_amber: '#D4A574',
  accent_slate: '#7B8C9D',
  
  // Semantic
  clarity: '#06FFA5',      // Success, static cleared
  warning: '#F6AD55',      // Caution (rare)
  
  // Static levels (brightness-based)
  static_low: '#F5F5F0',
  static_medium: '#A0A0A0',
  static_high: '#505050',
  
  // Glass surfaces
  glass_surface: 'rgba(255, 255, 255, 0.08)',
  glass_border: 'rgba(255, 255, 255, 0.1)',
};
```

### Typography Tokens

```typescript
const typography = {
  // Font Families
  family: {
    sans: 'SF Pro Display, -apple-system, sans-serif',
    mono: 'Space Mono, monospace',
  },
  
  // Sizes
  size: {
    hero: 72,       // Static percentage, level name
    title: 32,      // Screen titles
    heading: 24,    // Section headings
    body: 17,       // Primary text
    caption: 14,    // Secondary text
    label: 12,      // Labels, timestamps
  },
  
  // Weights
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};
```

### Spacing Tokens

```typescript
const spacing = {
  micro: 4,       // Icon padding
  tight: 8,       // Related elements
  default: 16,    // Standard spacing
  loose: 24,      // Section separation
  zen: 32,        // Major sections
  breath: 48,     // Screen margins
};
```

### Animation Tokens

```typescript
const animation = {
  // Durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    deliberate: 800,
  },
  
  // Easing
  easing: {
    standard: 'ease-out',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
```

---

## CORE COMPONENTS

### 1. Button

#### Primary Button
```
┌─────────────────────────────────────────┐
│                                         │
│          Interrupt the loop             │
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**
- Height: 56px
- Corner Radius: 16px
- Background: accent color
- Text: 17px, semibold, white
- Padding: 16px horizontal

**States:**
| State | Visual |
|-------|--------|
| Default | Solid accent |
| Pressed | 10% darker, scale 0.98 |
| Disabled | 40% opacity |

**Haptic:** Light tap on press

---

#### Secondary Button
```
┌─────────────────────────────────────────┐
│                                         │
│            Choose action                │
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**
- Height: 48px
- Corner Radius: 12px
- Background: glass_surface
- Border: 1px glass_border
- Text: 17px, medium, ethereal_white

**States:**
| State | Visual |
|-------|--------|
| Default | Glass surface |
| Pressed | Slightly brighter |
| Disabled | 40% opacity |

---

#### Ghost Button (Text Link)
```
        Choose something else
```

**Specs:**
- Height: 44px (touch target)
- Background: transparent
- Text: 14px, regular, muted_white
- No border

**States:**
| State | Visual |
|-------|--------|
| Default | Muted text |
| Pressed | Ethereal white |

---

### 2. Card

#### Action Card (Menu)
```
┌────────────────────────┐
│                        │
│          🫁            │
│                        │
│    Box Breathing       │
│                        │
│         90s            │
│                        │
└────────────────────────┘
```

**Specs:**
- Size: Flexible (fills grid cell)
- Aspect Ratio: 1:1 (square)
- Corner Radius: 20px
- Background: glass_surface
- Border: 1px glass_border
- Padding: 16px

**Content:**
- Icon: 32px emoji or custom icon
- Title: 14px, medium, ethereal_white
- Duration: 12px, regular, muted_white

**States:**
| State | Visual |
|-------|--------|
| Default | Glass surface |
| Pressed | Scale 0.96, brighter border |
| Disabled | 50% opacity |

---

#### Quest Card
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│            THE MORNING PLEDGE                   │
│                                                 │
│                                                 │
│       "Reduce fragmentation today."             │
│                                                 │
│    ┌───────────────────────────────────────┐   │
│    │                                       │   │
│    │   Don't touch your phone for 1 hour  │   │
│    │   after waking.                      │   │
│    │                                       │   │
│    │            [ Begin ]                  │   │
│    │                                       │   │
│    └───────────────────────────────────────┘   │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specs:**
- Width: Full width - 48px margins
- Corner Radius: 24px
- Background: glass_surface
- Border: 1px glass_border
- Padding: 24px

**Content:**
- Quest Name: 24px, semibold, ethereal_white
- Intent: 14px, regular, muted_white
- Step Area: Nested card, darker background
- Action Button: Primary button style

---

#### Insight Card
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Signal has strengthened.                      │
│   Fragmentation improved by 15%.                │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specs:**
- Corner Radius: 16px
- Background: glass_surface
- Padding: 16px

---

### 3. Static Indicator (Hero)

#### Circular Variant
```
           ╭─────────────────╮
          ╱                   ╲
         │                     │
         │    [WAVEFORM]       │
         │                     │
          ╲                   ╱
           ╰─────────────────╯
           
              Low Static
```

**Specs:**
- Size: 240px × 240px
- Animation: Breathing pulse (2s cycle)

**Visual States:**
| Static Level | Visual |
|--------------|--------|
| 0-20% (Low) | Calm, ethereal glow, slow pulse |
| 20-60% (Medium) | Grain overlay, faster pulse |
| 60-100% (High) | Heavy grain, color shift, erratic pulse |

**Interaction:**
- Tap: Reveals exact percentage overlay (3s then fades)

---

### 4. Accordion

#### Collapsed
```
▶ Your Patterns
────────────────────────────────────────────────
```

#### Expanded
```
▼ Your Patterns
┌─────────────────────────────────────────────┐
│                                             │
│   • Evening scrolling has decreased.        │
│   • Movement actions work better for you.   │
│   • Fragmentation spikes after stress.      │
│                                             │
└─────────────────────────────────────────────┘
```

**Specs:**
- Header Height: 48px
- Icon: Chevron, rotates 90° on expand
- Animation: 300ms ease-out
- Content Padding: 16px

---

### 5. Tab Bar

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   [home]     [menu]     [quest]     [you]      │
│     ●          ○          ○          ○          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specs:**
- Height: 83px (includes safe area)
- Background: void_dark
- Border Top: 1px glass_border

**Tab Item:**
- Icon Size: 24px
- Active: Ethereal white, filled icon
- Inactive: Muted white, outline icon
- Indicator: 4px dot below active
- No labels (icons only)

---

### 6. Timer Display

```
         3:42
```

**Specs:**
- Font: Space Mono, 48px
- Color: Ethereal white
- Monospace for consistent width

---

### 7. Progress Indicators

#### Implicit Progress (Quest Steps)
Progress is shown by content change, not bars.

❌ Don't:
```
Step 2 of 4
[████████░░░░░░░░░░░░]
```

✅ Do:
```
Current step visible
Previous steps hidden
Next steps unrevealed
```

---

### 8. Wiper Animation

```
  ┌────────────────────────────────────────────┐
  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░│ ← Sweeping right
  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░│
  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░│
  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░│
  └────────────────────────────────────────────┘
  
  ▓ = Cleared (clarity color)
  ░ = Static remaining
```

**Specs:**
- Duration: 1000ms
- Easing: ease-out
- Direction: Left to right
- Color: Clarity green gradient
- Haptic: Heavy at start, light at end

---

## SPACING GUIDELINES

### Screen Margins
```
┌────────────────────────────────────────────────────┐
│ 24px                                          24px │
│ ┌──────────────────────────────────────────────┐  │
│ │                                              │  │
│ │                   CONTENT                    │  │
│ │                                              │  │
│ └──────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Element Spacing
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Title                                         │
│                         ← 8px (tight)           │
│   Subtitle                                      │
│                         ← 24px (loose)          │
│   ┌─────────────────────────────────────────┐  │
│   │                                         │  │
│   │           Card Content                  │  │
│   │                                         │  │
│   └─────────────────────────────────────────┘  │
│                         ← 16px (default)        │
│   ┌─────────────────────────────────────────┐  │
│   │                                         │  │
│   │           Card Content                  │  │
│   │                                         │  │
│   └─────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## HAPTIC PATTERNS

### Pattern Definitions

```typescript
const haptics = {
  // Button interactions
  buttonPress: 'impactLight',
  
  // State changes
  staticCleared: 'notificationSuccess',
  levelUp: ['impactMedium', 'impactMedium', 'impactHeavy'], // Triple burst
  
  // Guidance
  breatheIn: 'impactLight',
  breatheOut: 'impactLight',
  phaseChange: 'selectionChanged',
  
  // Interruptions
  patternBreak: ['impactLight', 'impactLight', 'impactMedium'], // Short-short-long
  
  // Completion
  actionComplete: 'impactMedium',
  questComplete: 'notificationSuccess',
};
```

### Usage Rules
- ALWAYS fire on button press
- ALWAYS fire on completion
- NEVER fire for rewards/celebrations
- RESPECT system haptic settings

---

## ACCESSIBILITY SPECIFICATIONS

### Touch Targets
- Minimum: 44pt × 44pt
- Recommended: 48pt × 48pt
- Spacing between targets: 8pt minimum

### Dynamic Type Support
- All text must scale up to 200%
- Layouts must remain usable at large sizes
- Consider truncation with ellipsis

### VoiceOver Labels

```typescript
// Static Indicator
accessibilityLabel: "Static level: 45 percent, medium"
accessibilityHint: "Double tap for more details"

// Action Card
accessibilityLabel: "Box Breathing, 90 seconds"
accessibilityHint: "Double tap to begin"

// Quest
accessibilityLabel: "Today's quest: The Morning Pledge. Reduce fragmentation today."
accessibilityHint: "Double tap to begin quest"
```

### Reduce Motion
When enabled:
- Replace animations with fades
- Disable pulse animations
- Keep haptics (separate setting)

### High Contrast Mode
- Increase border contrast
- Use solid backgrounds instead of glass
- Increase text contrast ratios

---

## COMPONENT VARIANTS SUMMARY

| Component | Variants | Max Allowed |
|-----------|----------|-------------|
| Button | Primary, Secondary, Ghost | 3 |
| Card | Action, Quest, Insight | 3 |
| Indicator | Circular Static | 1 |
| Accordion | Standard | 1 |
| Timer | Standard | 1 |

**Rule:** No new component variants without design review.

---

*This document is the component specification for Exit.*
*All UI implementation must use these exact specifications.*
