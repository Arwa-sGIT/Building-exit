# Exit - UX Principles
## Design System for Nervous System Regulation

**Version:** 1.0  
**Status:** Canonical Reference  
**Last Updated:** January 2026

---

## PREAMBLE

Exit is designed for users whose nervous systems are **already dysregulated**. Every pixel, every animation, every word must respect this context.

This document defines the immutable UX principles that govern all design decisions.

---

## 1. NON-NEGOTIABLE DESIGN PRINCIPLES

### 1.1 iOS-Native, Not iOS-Generic

Exit follows **Apple Human Interface Guidelines** as a foundation:
- Native spacing rhythms (8pt grid)
- System gestures (swipe, long-press)
- Physics-based animations (spring, damping)
- SF Pro typography characteristics

**Exit is calmer than iOS itself.**

What we **use**:
- Generous whitespace
- Subtle depth (shadows, blur)
- Predictable navigation
- Haptic confirmation

What we **avoid**:
- Gamified UI elements
- Achievement badges everywhere
- Dense data displays
- Neon accents
- Streak flames

---

### 1.2 Zero Cognitive Debt

Every screen answers **ONE question only**:

| Screen | Question |
|--------|----------|
| HOME | "What's my state right now?" |
| MENU | "What can I do to feel better?" |
| QUEST | "What's my intention for today?" |
| YOU | "What have I noticed about myself?" |

**Rules:**
- No multi-purpose screens
- No "while you're here" prompts
- No secondary CTAs competing for attention
- No scroll-to-discover patterns

---

### 1.3 App as Threshold, Not Destination

Exit is something you **enter briefly** and **leave immediately**.

| Metric | Target |
|--------|--------|
| Average session | < 20 seconds |
| Time to first action | < 5 seconds |
| Decisions per session | ≤ 1 |

**The goal is to get users OFF their phone, not to keep them in the app.**

---

### 1.4 Calming, Not Motivating

Exit's tone is **observational, not cheerleading**.

❌ "You got this!"  
❌ "Keep up the streak!"  
❌ "Don't break the chain!"  

✅ "Your signal is scattered."  
✅ "You tend to scroll when transitioning."  
✅ "Time to clean up."  

Motivation creates pressure. Observation creates awareness.

---

## 2. SESSION LENGTH CONSTRAINTS

### 2.1 Target Durations

| Interaction | Max Duration |
|-------------|--------------|
| Check state | 3 seconds |
| Select action | 5 seconds |
| Start action | 10 seconds |
| View progress | 15 seconds |
| Full exploration | 60 seconds |

If a user is in the app for > 60 seconds without starting an action, something is wrong.

### 2.2 Implementation Rules

- No infinite scroll
- No content feeds
- No "more" buttons
- No pagination
- Maximum 6 choices on any screen
- Default selections pre-computed by PBRS

---

## 3. COGNITIVE LOAD RULES

### 3.1 The 3-Second Rule

Any screen must communicate its primary message within **3 seconds** of viewing.

- Hero element is immediately visible
- Primary action is obvious
- State is understood without reading

### 3.2 Progressive Disclosure

Information is revealed **only when relevant**:

| Hidden by Default | Revealed When |
|-------------------|---------------|
| Static percentage | User taps indicator |
| Action difficulty | Never (PBRS handles) |
| Addiction scores | Never |
| Psychotype labels | Never |
| Capacity model | Never |

Users feel understood without being diagnosed.

### 3.3 Decision Minimization

| Scenario | Design Response |
|----------|-----------------|
| User opens app | PBRS pre-selects best action |
| User wants alternatives | Show max 6 options |
| User starts quest | Reveal steps one at a time |
| User completes action | Auto-return to previous context |

---

## 4. TONE CONSTRAINTS

### 4.1 Voice Characteristics

| Attribute | Description |
|-----------|-------------|
| Observational | Describes state, not judgment |
| Quiet | Short sentences, generous silence |
| Grounded | Physical, sensory language |
| Respectful | Assumes intelligence and agency |

### 4.2 Forbidden Language

Never use:
- "Addict" / "Addiction"
- "Debt" / "Penalty" / "Punishment"
- "Failed" / "Relapsed"
- "You should" / "You must"
- "Don't give up"
- Exclamation points (except celebration)
- Emoji (except action icons)

### 4.3 Tone by State

| User State | Tone |
|------------|------|
| High static | Calm, grounding ("Time to clean up.") |
| Quest incomplete | Accepting ("We'll adjust tomorrow.") |
| Streak broken | Matter-of-fact ("New chain begins with your next Conscious Day.") |
| Level up | Understated ("You've progressed. Welcome to [Level].") |

---

## 5. FORBIDDEN PATTERNS

### 5.1 Exit NEVER

| Pattern | Why Forbidden |
|---------|---------------|
| Shows streak flames | Creates anxiety about breaking |
| Uses confetti | Turns recovery into performance |
| Displays rankings | Introduces comparison |
| Forces decisions | Respects user autonomy |
| Shames relapse | Shame drives relapse |
| Locks features behind performance | Recovery isn't earned |
| Shows countdown timers | Creates urgency/anxiety |
| Uses red for failure | Avoids punishment framing |
| Sends "you're falling behind" notifications | No FOMO |

### 5.2 Exit ALWAYS

| Principle | Implementation |
|-----------|----------------|
| Allows skipping | Every action has skip option |
| Allows opting out | All features toggleable |
| Adjusts difficulty invisibly | PBRS handles calibration |
| Feels quieter than the phone | Minimal animation, soft colors |
| Respects "not now" | No nag screens |
| Provides graceful exits | One tap to close anything |

---

## 6. VISUAL LANGUAGE

### 6.1 Color Philosophy

Exit uses **brightness to indicate state**, not hue.

| State | Visual Treatment |
|-------|------------------|
| Low static (0-20%) | Bright, clear, ethereal |
| Medium static (20-60%) | Slightly muted, soft grain |
| High static (60-100%) | Dim, textured, obscured |

**Base Palette:**
- Background: Near-black (#050505) or soft off-white (#F8F8F6)
- Text: Ethereal white (#F5F5F0) or charcoal (#1A1A1A)
- Accent: Single desaturated tone (sage, amber, blue-grey)
- Success: Soft mint (#06FFA5) - never bright green
- Warning: Soft amber (#F6AD55) - never red

**Color Rules:**
- No red/green success/failure coding
- Accent color used sparingly (buttons, key indicators)
- Static level changes brightness, not hue
- High contrast for accessibility, low saturation for calm

### 6.2 Typography

| Element | Style |
|---------|-------|
| Hero numbers | Large, monospace (Space Mono) |
| Headings | Sans-serif, medium weight |
| Body | Sans-serif, regular, generous line-height (1.6) |
| Labels | Small caps or reduced opacity |

**Typography Rules:**
- Maximum 2 font families
- Minimum 16px for body text
- Generous margins (24px minimum sides)
- Text must breathe - never cramped

### 6.3 Motion & Animation

| Use Case | Animation Style |
|----------|-----------------|
| Screen transitions | Slow ease-out (400-600ms) |
| State changes | Subtle fade (200-300ms) |
| Button feedback | Quick spring (100ms) |
| Static clearing | Smooth wipe (800-1000ms) |
| Level transitions | Particle dispersion (2-3s) |

**Motion Rules:**
- All animations respect "Reduce Motion" setting
- No bouncing, no shaking
- Prefer opacity changes over position changes
- Haptics complement motion, don't replace it

### 6.4 Haptics

| Event | Pattern |
|-------|---------|
| Pattern break interruption | Short-short-long |
| Action completion | Single medium tap |
| Static cleared | Soft ascending |
| Level up | Triple burst |
| Button press | Light tap |

**Haptic Rules:**
- Never for rewards (no celebration buzz)
- Always for confirmation
- Respect system haptic settings
- Subtle > dramatic

---

## 7. ACCESSIBILITY REQUIREMENTS

### 7.1 Minimum Standards

- WCAG 2.1 AA compliance
- VoiceOver full support
- Dynamic Type support (up to 200%)
- Reduce Motion respect
- High Contrast mode support

### 7.2 Touch Targets

- Minimum 44x44pt for all interactive elements
- Adequate spacing between targets (8pt minimum)
- Edge targets have comfortable reach zones

### 7.3 Color Independence

- Information never conveyed by color alone
- All states have text or icon alternatives
- Patterns/textures used alongside color

---

## 8. SCREEN-SPECIFIC CONSTRAINTS

### 8.1 HOME Screen

**Allowed:**
- Single hero state indicator
- One primary CTA
- One secondary text link
- One contextual insight

**Forbidden:**
- Multiple CTAs competing
- Charts or graphs
- Scrollable content
- Tabs or segmented controls

### 8.2 MENU Screen

**Allowed:**
- Maximum 6 action cards
- Icon + title + duration per card
- Single-tap to start

**Forbidden:**
- Difficulty labels
- Categories/filters
- Search
- "Show more"

### 8.3 QUEST Screen

**Allowed:**
- Single quest card, centered
- Quest name + intent
- Steps revealed one at a time
- Implicit progress (no checklist)

**Forbidden:**
- Multiple quests displayed
- Explicit step numbers
- Progress bar
- "X of Y complete"

### 8.4 YOU Screen

**Allowed:**
- Accordion-style sections
- 2-3 inferred insights
- Current level
- Minimal history

**Forbidden:**
- Streak counters (prominently)
- Detailed charts
- Comparison to others
- Achievement walls

---

## 9. HOW UI SUPPORTS PBRS

### 9.1 PBRS Controls UI

| PBRS Output | UI Manifestation |
|-------------|------------------|
| Best action | HOME primary button |
| Top 6 actions | MENU card selection |
| Difficulty calibration | Never shown to user |
| Psychotype inference | Tone of insights |
| Static level | Hero indicator state |

### 9.2 UI Never Exposes

| Hidden Data | Why |
|-------------|-----|
| Addiction score | Prevents identity formation |
| Capacity model | Technical implementation detail |
| Psychotype labels | Feels diagnostic |
| Selection algorithm | Creates gaming behavior |
| Difficulty adjustments | Maintains flow |

### 9.3 Personalization Feels Invisible

Users notice:
- "This action feels right for me"
- "The app seems to understand when I'm struggling"
- "I don't have to think about what to do"

Users never think:
- "My novelty-seeking score is 0.7"
- "I'm in the high-fragmentation category"
- "The algorithm gave me an easy one"

---

## 10. COMPONENT LIBRARY RULES

### 10.1 Core Components

| Component | Variants | States |
|-----------|----------|--------|
| Button | Primary, Secondary, Ghost | Default, Pressed, Disabled |
| Card | Action, Quest, Insight | Default, Active, Completed |
| Indicator | Static, Progress, Level | Low, Medium, High |
| Text | Hero, Heading, Body, Label | Default, Muted, Accent |

### 10.2 Component Constraints

- Maximum 3 button variants
- Maximum 2 card sizes
- All components must work at 200% text size
- No custom components without design review

### 10.3 Spacing System

```
4px  - micro (icon padding)
8px  - tight (related elements)
16px - default (standard spacing)
24px - loose (section separation)
32px - zen (major sections)
48px - breath (screen margins)
```

---

## SUMMARY: THE EXIT DIFFERENCE

| Typical App | Exit |
|-------------|------|
| Maximize engagement | Minimize session time |
| Motivate with rewards | Ground with awareness |
| Show all data | Hide complexity |
| Force decisions | Pre-compute choices |
| Celebrate streaks | Accept imperfection |
| Feel like a game | Feel like a breath |

---

*This document is the canonical UX reference for Exit.*
*All design decisions must align with these principles.*
