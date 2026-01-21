# Exit - Screen Map
## Complete Screen Specifications

**Version:** 1.0  
**Status:** Implementation Ready  
**Last Updated:** January 2026

---

## NAVIGATION ARCHITECTURE

### Primary Navigation (Bottom Tab Bar)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                         [ CONTENT AREA ]                         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│    [ HOME ]      [ MENU ]      [ QUEST ]      [ YOU ]           │
│      ●             ○             ○             ○                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Rules:**
- Exactly 4 tabs (no fifth tab ever)
- HOME is default open
- No badges/counts on tabs
- No "Explore" or "Discover" tab
- Tab icons only, labels optional

---

## SCREEN 1: HOME (State Screen)

### Purpose
Reflect current state. Answer: "What's my state right now?"

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │                    STATIC INDICATOR                      │   │
│  │                                                          │   │
│  │              ╭─────────────────────────╮                │   │
│  │              │                         │                │   │
│  │              │    [WAVEFORM/CIRCLE]   │                │   │
│  │              │                         │                │   │
│  │              │       Low Static        │                │   │
│  │              │                         │                │   │
│  │              ╰─────────────────────────╯                │   │
│  │                                                          │   │
│  │                    Tap for details                       │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │   "You tend to scroll when transitioning between tasks." │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                                                                  │
│           ╭───────────────────────────────────╮                 │
│           │                                   │                 │
│           │       Interrupt the loop          │                 │
│           │                                   │                 │
│           ╰───────────────────────────────────╯                 │
│                                                                  │
│                                                                  │
│                    Choose something else                         │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Static Indicator (Hero)
- **Type:** Circular visualization or waveform
- **Size:** 40-50% of screen height
- **States:**
  - Low (0-20%): Calm, ethereal glow
  - Medium (20-60%): Subtle grain texture
  - High (60-100%): Heavy interference pattern
- **Interaction:** Tap to reveal exact percentage
- **Animation:** Subtle pulse, breathing rhythm
- **Label:** "Low Static" / "Medium Static" / "High Static"

#### B. Contextual Insight
- **Source:** PBRS CognitivePattern inference
- **Format:** Single sentence, max 60 characters
- **Tone:** Observational, never judgmental
- **Examples:**
  - "You tend to scroll when transitioning between tasks."
  - "Late evenings are your vulnerable hours."
  - "App switching increased today."
- **Update:** Changes daily, or on significant pattern detection

#### C. Primary Action Button
- **Label:** "Interrupt the loop"
- **Action:** Navigates to PBRS-selected best action
- **Style:** Large, full-width, accent color
- **Position:** Lower third of screen

#### D. Secondary Action (Text Link)
- **Label:** "Choose something else"
- **Action:** Navigates to MENU
- **Style:** Text link, muted color, smaller
- **Position:** Below primary button

### Behavior
- **On Open:** Immediate state display (< 1s)
- **No Scrolling:** Everything above the fold
- **Refresh:** Pull-to-refresh updates state (subtle)

---

## SCREEN 2: MENU (Dopamine Menu)

### Purpose
Offer relief options. Answer: "What can I do to feel better?"

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│     Dopamine Menu                                               │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │                  │  │                  │  │              │  │
│  │       🫁         │  │       💧         │  │      🚶      │  │
│  │                  │  │                  │  │              │  │
│  │  Box Breathing   │  │  Drink Water     │  │  Walk 10min  │  │
│  │                  │  │                  │  │              │  │
│  │      90s         │  │      2min        │  │     10min    │  │
│  │                  │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │                  │  │                  │  │              │  │
│  │       🧘         │  │       ✏️         │  │      🎵      │  │
│  │                  │  │                  │  │              │  │
│  │  Floor Time      │  │  Doodle          │  │  Brown Noise │  │
│  │                  │  │                  │  │              │  │
│  │      5min        │  │     10min        │  │     15min    │  │
│  │                  │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Header
- **Label:** "Dopamine Menu"
- **Style:** Simple, left-aligned
- **No:** Filters, search, categories

#### B. Action Cards (Grid)
- **Layout:** 2 rows × 3 columns = 6 cards max
- **Card Contents:**
  - Icon (emoji or custom)
  - Action title
  - Duration
- **No:** Difficulty labels, descriptions, badges
- **Selection:** PBRS determines which 6 appear
- **Order:** Most relevant first (top-left)

### Card Interaction
- **Tap:** Opens action execution screen immediately
- **Long Press:** None (no preview)
- **Swipe:** None

### Behavior
- **No Scrolling:** All 6 visible without scroll
- **No Filtering:** PBRS pre-filters
- **No "Show More":** These are the options
- **Refresh:** Auto-refreshes on context change

---

## SCREEN 3: QUEST (Behavioral Contract)

### Purpose
Set daily intention. Answer: "What's my intention for today?"

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │                                                       │   │
│     │                   THE MORNING PLEDGE                  │   │
│     │                                                       │   │
│     │                                                       │   │
│     │         "Reduce fragmentation today."                │   │
│     │                                                       │   │
│     │                                                       │   │
│     │    ┌─────────────────────────────────────────────┐   │   │
│     │    │                                             │   │   │
│     │    │   Don't touch your phone for 1 hour        │   │   │
│     │    │   after waking.                            │   │   │
│     │    │                                             │   │   │
│     │    │            [ Begin ]                        │   │   │
│     │    │                                             │   │   │
│     │    └─────────────────────────────────────────────┘   │   │
│     │                                                       │   │
│     │                                                       │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                  │
│                                                                  │
│                    Skip today's quest                            │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Quest Card (Centered)
- **Quest Name:** Large, abstract title
- **Intent Statement:** One line explaining behavioral goal
- **Current Step:** Single step revealed at a time
- **Action Button:** "Begin" / "Continue" / "Complete"

#### B. Skip Option
- **Label:** "Skip today's quest"
- **Style:** Subtle text link
- **Action:** Skips without penalty messaging

### States

#### State: Available
- Full card displayed
- "Begin" button active

#### State: In Progress
- Current step displayed
- Previous steps hidden (not checked off)
- Progress implicit in step content

#### State: Completed
- Calm acknowledgment: "Quest complete. Signal restored."
- No celebration, no points displayed
- Auto-returns to HOME after 3 seconds

#### State: Skipped/Missed
- Message: "We'll adjust tomorrow."
- No red, no penalty language
- Same visual weight as completion

### Behavior
- **Single Quest:** Only one quest visible at a time
- **No List:** No "browse quests" option
- **Steps Hidden:** Revealed one at a time as user progresses
- **No Progress Bar:** Completion is experiential, not visual

---

## SCREEN 4: YOU (Reflection Screen)

### Purpose
Help users notice patterns. Answer: "What have I noticed about myself?"

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│     You                                                          │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │     THE GLITCH                                           │   │
│  │     Level 2                                              │   │
│  │                                                          │   │
│  │     [Avatar Visualization]                               │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│                                                                  │
│  ▼ This Month                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Signal has strengthened.                                │   │
│  │  Fragmentation improved by 15%.                          │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ▶ Your Patterns                                                │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ▶ History                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│                                                                  │
│                         Settings                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Level Display (Hero)
- **Level Name:** e.g., "THE GLITCH"
- **Level Number:** Subtle ("Level 2")
- **Avatar:** Abstract visualization matching level
- **No:** XP bar, progress percentage, "next level" countdown

#### B. Accordion Sections

##### This Month (Default Open)
- What improved (1-2 lines)
- What was difficult (1-2 lines)
- Net direction: "Signal strengthening" or "Signal drifting"

##### Your Patterns (Collapsed by Default)
- 2-3 PBRS-derived insights
- Phrased as observations, not diagnoses
- Examples:
  - "Evening scrolling has decreased."
  - "Movement actions work better for you than stillness."
  - "Fragmentation spikes after stressful days."

##### History (Collapsed by Default)
- Minimal timeline
- Streak NOT prominently displayed
- Shows: Conscious days, level changes, notable achievements

#### C. Settings Link
- **Position:** Bottom of screen
- **Style:** Subtle text link
- **Leads to:** Account, notifications, data export, etc.

### Behavior
- **Scrollable:** This screen may scroll (only exception)
- **Accordions:** Expand one at a time
- **No Charts by Default:** Data visualizations only on tap
- **No Comparison:** Only user's own history

---

## SCREEN 5: ACTION EXECUTION

### Purpose
Guide through selected micro-action.

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│     ✕                                                           │
│                                                                  │
│                                                                  │
│                                                                  │
│                          🫁                                      │
│                                                                  │
│                    BOX BREATHING                                 │
│                                                                  │
│                        3:42                                      │
│                                                                  │
│     ┌───────────────────────────────────────────────────────┐   │
│     │                                                       │   │
│     │                                                       │   │
│     │              [BREATHING ANIMATION]                    │   │
│     │                                                       │   │
│     │                     Inhale                            │   │
│     │                                                       │   │
│     │                                                       │   │
│     └───────────────────────────────────────────────────────┘   │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                    I'm done                                      │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Close Button
- **Position:** Top left
- **Style:** X icon, subtle
- **Action:** Confirms exit, returns to previous screen

#### B. Action Info
- **Icon:** Large, centered
- **Title:** Action name
- **Timer:** Countdown or elapsed (depending on action type)

#### C. Guidance Area
- **Content:** Varies by action type
  - Breathing: Animated orb with phase labels
  - Movement: Rep counter or simple instruction
  - Sensory: Timer + ambient visualization
  - Cognitive: Simple instruction text
- **Style:** Minimal, non-distracting

#### D. Completion Button
- **Label:** "I'm done" (not "Complete" or "Finish")
- **Style:** Text link, not prominent
- **Available:** Throughout (user controls pace)

### Behavior
- **Full Screen:** No navigation visible
- **No Back Button:** Only close (X)
- **Haptic Cues:** At phase transitions
- **Auto-Complete:** Some actions auto-complete after timer

---

## SCREEN 6: COMPLETION CONFIRMATION

### Purpose
Acknowledge action completion. Bridge back to life.

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                    [WIPE ANIMATION]                              │
│                                                                  │
│                                                                  │
│                    Signal restored.                              │
│                                                                  │
│                       -10%                                       │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Elements

#### A. Wiper Animation
- Visual sweep clearing static
- Duration: 1-2 seconds
- Haptic accompaniment

#### B. Confirmation Message
- Primary: "Signal restored." or "Clarity improving."
- Secondary: "-10%" (static cleared amount)
- No: Points, XP, badges, streaks

### Behavior
- **Auto-Dismiss:** Returns to HOME after 2-3 seconds
- **Tap Anywhere:** Immediate dismiss
- **No Required Action:** Just acknowledgment

---

## SETTINGS SCREEN

### Purpose
User control over app behavior.

### Sections

#### Account
- Profile info
- Subscription status
- Sign out

#### Notifications
- Pattern break toggles
- Frequency settings
- Quiet hours

#### Privacy
- Data export
- Delete all data
- Analytics opt-out

#### Accessibility
- Reduce motion
- High contrast
- Text size

#### About
- Version
- Support link
- Legal

---

## NAVIGATION FLOWS

### Primary Flow: Interrupt Loop
```
HOME → (tap primary button) → ACTION EXECUTION → COMPLETION → HOME
```

### Alternative Flow: Choose Action
```
HOME → (tap secondary link) → MENU → (tap card) → ACTION EXECUTION → COMPLETION → HOME
```

### Quest Flow
```
QUEST → (tap Begin) → QUEST (step revealed) → (complete step) → QUEST (next step) → ... → COMPLETION → HOME
```

### Reflection Flow
```
YOU → (expand section) → (read insights) → (collapse) → YOU
```

---

## EMPTY STATES

### No Quest Available
```
"Your next quest arrives tomorrow morning."
[No action required]
```

### All Actions on Cooldown
```
"You've done enough for now. Return in [time]."
[Shows time until next available action]
```

### First Launch (No Data)
```
"Exit is learning your patterns. This takes a few days."
[Shows generic starter actions]
```

---

## ERROR STATES

### Network Error
```
"Exit works offline. Your progress is saved locally."
[Continue button]
```

### Permission Denied (Screen Time)
```
"Exit needs Screen Time access to understand your patterns."
[Open Settings button]
```

### Sync Failed
```
"We'll try again later."
[No action required - handled silently]
```

---

*This document is the screen specification for Exit.*
*All implementation must follow these layouts and behaviors.*
