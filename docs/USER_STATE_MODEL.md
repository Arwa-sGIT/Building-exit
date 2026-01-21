# Exit - User State Model Specification
## Canonical Reference for All User Models

**Version:** 1.0  
**Status:** Canonical Reference  
**Last Updated:** January 2026

---

## OVERVIEW

The User State Model is the **single source of truth** for how Exit understands each user. It comprises four interconnected models that together enable personalized, adaptive interventions.

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER STATE COMPOSITE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐        ┌─────────────────┐                │
│  │ AddictionProfile │        │ CognitivePattern │               │
│  │                 │        │                 │                │
│  │ • intensity     │        │ • novelty_seeking│               │
│  │ • fragmentation │        │ • dissociation   │               │
│  │ • compulsion    │        │ • control_seeking│               │
│  │ • avoidance     │        │ • social_depend. │               │
│  └────────┬────────┘        └────────┬────────┘                │
│           │                          │                          │
│           └──────────┬───────────────┘                          │
│                      │                                          │
│                      ▼                                          │
│           ┌─────────────────┐                                   │
│           │  CapacityModel  │                                   │
│           │                 │                                   │
│           │ • friction_tol. │                                   │
│           │ • embodiment_t. │                                   │
│           │ • stillness_tol.│                                   │
│           │ • novelty_tol.  │                                   │
│           └────────┬────────┘                                   │
│                    │                                            │
│                    ▼                                            │
│           ┌─────────────────┐                                   │
│           │  ContextState   │                                   │
│           │                 │                                   │
│           │ • time/location │                                   │
│           │ • static_level  │                                   │
│           │ • session_data  │                                   │
│           └─────────────────┘                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. ADDICTION PROFILE

### Purpose
Quantifies the user's phone dependency across four orthogonal dimensions. This is computed daily from raw usage data.

### Schema

```typescript
interface AddictionProfile {
  // ═══════════════════════════════════════════════════════════════
  // CORE DIMENSIONS (0.0 - 1.0)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * INTENSITY: How much raw time is spent on phone
   * 
   * Computed from: daily_screen_time / INTENSITY_CAP
   * High value indicates: Excessive time investment
   * Intervention focus: Reduce total usage
   */
  intensity: number;
  
  /**
   * FRAGMENTATION: How scattered attention is across sessions
   * 
   * Computed from: session_count × session_brevity
   * High value indicates: Constant micro-checking
   * Intervention focus: Consolidate usage into intentional blocks
   */
  fragmentation: number;
  
  /**
   * COMPULSION: Reactivity to triggers and inability to resist
   * 
   * Computed from: notification_reactivity + first_hour_usage + app_switching
   * High value indicates: Autopilot behavior, low impulse control
   * Intervention focus: Pattern breaks, delay mechanisms
   */
  compulsion: number;
  
  /**
   * AVOIDANCE: Using phone to escape negative emotions
   * 
   * Computed from: evening_surge + weekend_increase + passive_consumption
   * High value indicates: Phone as coping mechanism
   * Intervention focus: Emotional awareness, alternative coping
   */
  avoidance: number;
  
  // ═══════════════════════════════════════════════════════════════
  // DERIVED METRICS
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Overall severity score (weighted composite)
   * Used for: Level assignment, global thresholds
   */
  overallSeverity: number;
  
  /**
   * Dominant addiction pattern
   * Used for: Intervention prioritization, content selection
   */
  dominantPattern: 'social' | 'entertainment' | 'information' | 'gaming';
  
  /**
   * Primary problematic app category
   * Used for: Shield configuration, targeted nudges
   */
  primaryProblemCategory: string;
  
  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════
  
  /** When this profile was last computed */
  lastComputed: Date;
  
  /** Days of data used in computation */
  dataWindowDays: number;
  
  /** Confidence in measurements (0.0 - 1.0) */
  dataQuality: number;
  
  /** Trend direction over last 7 days */
  trend: 'improving' | 'stable' | 'worsening';
}
```

### Dimension Thresholds

| Dimension | Low (0.0-0.25) | Moderate (0.25-0.5) | High (0.5-0.75) | Critical (0.75-1.0) |
|-----------|----------------|---------------------|-----------------|---------------------|
| **Intensity** | < 1.5h/day | 1.5-3h/day | 3-4.5h/day | > 4.5h/day |
| **Fragmentation** | < 30 pickups | 30-60 pickups | 60-90 pickups | > 90 pickups |
| **Compulsion** | Intentional use | Some reactivity | Frequent autopilot | Unable to resist |
| **Avoidance** | Tool usage | Occasional escape | Regular escape | Primary coping |

### Update Frequency
- **Full recomputation:** Daily at 4 AM local time
- **Incremental updates:** Every 6 hours
- **Trend calculation:** Every 7 days

---

## 2. COGNITIVE PATTERN

### Purpose
Infers the user's psychological relationship with their phone. This determines **which interventions will resonate** rather than what to block.

### Schema

```typescript
interface CognitivePattern {
  // ═══════════════════════════════════════════════════════════════
  // PATTERN WEIGHTS (must sum to 1.0)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * NOVELTY SEEKING: Craves new stimulation
   * 
   * Behavioral signals:
   * - High app diversity (many apps, low time each)
   * - Frequent feed refreshing
   * - Low completion of long-form content
   * 
   * Intervention preference: Varied, short, stimulating
   * Intervention aversion: Repetitive, long, still
   */
  novelty_seeking: number;
  
  /**
   * DISSOCIATION: Uses phone to zone out
   * 
   * Behavioral signals:
   * - Long passive sessions (videos, scrolling)
   * - Low interaction rate (few taps per minute)
   * - Late night usage spikes
   * 
   * Intervention preference: Gentle, grounding, sensory
   * Intervention aversion: Demanding, cognitive, energetic
   */
  dissociation: number;
  
  /**
   * CONTROL SEEKING: Uses phone for predictability
   * 
   * Behavioral signals:
   * - Same apps at same times
   * - Low app diversity
   * - Consistent daily patterns
   * 
   * Intervention preference: Structured, routine-compatible
   * Intervention aversion: Unpredictable, disruptive
   */
  control_seeking: number;
  
  /**
   * SOCIAL DEPENDENCY: Uses phone for connection
   * 
   * Behavioral signals:
   * - High messaging app usage
   * - Fast notification response
   * - Anxiety when disconnected
   * 
   * Intervention preference: Connection-oriented
   * Intervention aversion: Isolation-inducing
   */
  social_dependency: number;
  
  // ═══════════════════════════════════════════════════════════════
  // DERIVED PREFERENCES
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Best intervention modality for this user
   * Computed from pattern weights
   */
  preferredModality: 'movement' | 'stillness' | 'sensory' | 'cognitive';
  
  /**
   * Worst intervention modality for this user
   * Should be avoided except for intentional growth
   */
  aversionModality: 'movement' | 'stillness' | 'sensory' | 'cognitive';
  
  /**
   * Optimal nervous system effect
   */
  neededEffect: 'activating' | 'calming' | 'regulating' | 'grounding';
  
  // ═══════════════════════════════════════════════════════════════
  // METADATA
  // ═══════════════════════════════════════════════════════════════
  
  /** Confidence in inference (0.0 - 1.0) */
  confidence: number;
  
  /** Last computation timestamp */
  lastInferred: Date;
}
```

### Inference Rules

| Pattern | Primary Signal | Secondary Signal | Tertiary Signal |
|---------|---------------|------------------|-----------------|
| **Novelty Seeking** | High app diversity | Short sessions | Feed-heavy usage |
| **Dissociation** | Long passive sessions | Low interaction | Late night spikes |
| **Control Seeking** | Consistent patterns | Low diversity | Same apps daily |
| **Social Dependency** | High social app % | Fast notification response | Messaging volume |

### Update Frequency
- **Full recomputation:** Weekly
- **Confidence adjustment:** Daily based on new signals

---

## 3. CAPACITY MODEL

### Purpose
Tracks the user's tolerance for different types of challenge. This enables the **15% stretch principle** - always recommending slightly above current comfort, never dramatically above.

### Schema

```typescript
interface CapacityModel {
  // ═══════════════════════════════════════════════════════════════
  // TOLERANCE LEVELS (0.0 - 1.0)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * FRICTION TOLERANCE: Can handle inconvenience
   * 
   * Low: Needs seamless, easy actions
   * High: Can handle multi-step, preparatory actions
   * 
   * Affected by: Compulsion, fragmentation
   */
  friction_tolerance: number;
  
  /**
   * EMBODIMENT TOLERANCE: Can handle physical actions
   * 
   * Low: Prefers passive, mental activities
   * High: Ready for movement, exercise, body-based work
   * 
   * Affected by: Avoidance, dissociation
   */
  embodiment_tolerance: number;
  
  /**
   * STILLNESS TOLERANCE: Can handle doing nothing
   * 
   * Low: Needs activity, stimulation
   * High: Comfortable with meditation, waiting, boredom
   * 
   * Affected by: Novelty seeking, fragmentation
   */
  stillness_tolerance: number;
  
  /**
   * NOVELTY TOLERANCE: Can handle unfamiliar actions
   * 
   * Low: Needs predictable, known activities
   * High: Open to experimentation, new challenges
   * 
   * Affected by: Control seeking, avoidance
   */
  novelty_tolerance: number;
  
  // ═══════════════════════════════════════════════════════════════
  // CALIBRATION STATE
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Current stretch target (0.05 - 0.20)
   * How much above capacity we recommend
   * Default: 0.15 (15% stretch)
   */
  current_stretch: number;
  
  /**
   * Consecutive successful completions
   * At 3, we increase capacity slightly
   */
  consecutive_completions: number;
  
  /**
   * Consecutive abandons
   * At 2, we decrease stretch
   */
  consecutive_abandons: number;
  
  // ═══════════════════════════════════════════════════════════════
  // SAFETY BOUNDS
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Minimum difficulty floor
   * Never recommend below this (prevents stagnation)
   */
  floor: number;
  
  /**
   * Maximum difficulty ceiling
   * Never recommend above this (prevents frustration)
   */
  ceiling: number;
  
  // ═══════════════════════════════════════════════════════════════
  // HISTORY
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Actions permanently blocked (abandoned 3x)
   */
  blocked_actions: string[];
  
  /**
   * Categories on temporary cooldown
   */
  category_cooldowns: Record<string, Date>;
  
  /**
   * Recent completions for diversity
   */
  recent_completions: {
    action_id: string;
    category: string;
    timestamp: Date;
  }[];
}
```

### Adjustment Rules

```
ON COMPLETION:
  consecutive_completions++
  consecutive_abandons = 0
  
  IF consecutive_completions >= 3:
    capacity[dimension] += 0.02
    consecutive_completions = 0
    current_stretch = min(0.20, current_stretch + 0.01)

ON ABANDON (< 30% complete):
  consecutive_abandons++
  capacity[dimension] -= 0.05
  
  IF consecutive_abandons >= 2:
    current_stretch = max(0.05, current_stretch - 0.05)
    consecutive_abandons = 0

ON ABANDON (30-70% complete):
  consecutive_abandons++
  capacity[dimension] -= 0.02

ON SKIP:
  skipped_categories[category]++
  
  IF skipped_categories[category] >= 3:
    category_cooldowns[category] = now + 24h
```

### Update Frequency
- **Immediate:** After every action interaction
- **Decay:** Capacity slowly regresses toward baseline over 7 days without use

---

## 4. CONTEXT STATE

### Purpose
Captures the user's **current situation** for real-time recommendation filtering.

### Schema

```typescript
interface ContextState {
  // ═══════════════════════════════════════════════════════════════
  // TEMPORAL CONTEXT
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Current time bucket
   * Affects: Energy-appropriate recommendations
   */
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  /**
   * Day type
   * Affects: Duration tolerance, quest availability
   */
  dayType: 'weekday' | 'weekend';
  
  /**
   * Local hour (0-23)
   * Used for: Precise time-based filtering
   */
  localHour: number;
  
  // ═══════════════════════════════════════════════════════════════
  // LOCATION CONTEXT (Privacy-Preserving)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Location category (not coordinates)
   * Inferred from: WiFi, motion, time patterns
   */
  locationContext: 'home' | 'work' | 'transit' | 'outside' | 'unknown';
  
  /**
   * Is user likely stationary?
   * From: Accelerometer patterns
   */
  isStationary: boolean;
  
  // ═══════════════════════════════════════════════════════════════
  // SESSION CONTEXT
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Current neural static level (0-100)
   * Core metric for urgency
   */
  currentStaticLevel: number;
  
  /**
   * Minutes since last completed action
   * Affects: Recommendation urgency
   */
  minutesSinceLastAction: number;
  
  /**
   * Actions completed today
   * For: Daily limits, variety enforcement
   */
  actionsCompletedToday: number;
  
  /**
   * Categories used today
   * For: Diversity enforcement
   */
  categoriesUsedToday: string[];
  
  // ═══════════════════════════════════════════════════════════════
  // ENVIRONMENTAL (OPTIONAL)
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Weather conditions (if available)
   * Affects: Outdoor action recommendations
   */
  weather?: 'clear' | 'rain' | 'extreme';
  
  /**
   * Ambient noise level (if available)
   * Affects: Meditation/stillness feasibility
   */
  ambientNoise?: 'quiet' | 'moderate' | 'loud';
}
```

### Update Frequency
- **Continuous:** Time-based fields update in real-time
- **On app open:** Full context refresh
- **Every 5 minutes:** Background refresh when app is active

---

## 5. COMPOSITE USER STATE

### Full Schema

```typescript
interface UserState {
  // Identity
  userId: string;
  level: 'npc' | 'glitch' | 'hacker' | 'main_character' | 'oracle';
  
  // Component models
  addiction: AddictionProfile;
  cognitive: CognitivePattern;
  capacity: CapacityModel;
  context: ContextState;
  
  // Progression
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastConsciosDay: Date;
  };
  badges: string[];
  
  // Timestamps
  createdAt: Date;
  lastActive: Date;
  lastFullCompute: Date;
}
```

### State Transitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATE UPDATE TRIGGERS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐                                               │
│  │  APP OPEN    │──▶ Refresh ContextState                       │
│  └──────────────┘    Check for daily recompute                  │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  ACTION      │──▶ Update CapacityModel                       │
│  │  COMPLETE    │    Clear static                               │
│  └──────────────┘    Award XP                                   │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  ACTION      │──▶ Update CapacityModel (decrease)            │
│  │  ABANDON     │    Log for pattern analysis                   │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  DAILY       │──▶ Recompute AddictionProfile                 │
│  │  4 AM        │    Update trends                              │
│  └──────────────┘    Check level transitions                    │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  WEEKLY      │──▶ Recompute CognitivePattern                 │
│  │  SUNDAY      │    Generate weekly report                     │
│  └──────────────┘    Capacity decay                             │
│                                                                  │
│  ┌──────────────┐                                               │
│  │  MONTHLY     │──▶ Level evaluation                           │
│  │  1ST         │    Full model validation                      │
│  └──────────────┘    Reset monthly metrics                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. PRIVACY GUARANTEES

### What STAYS on device:
- Raw screen time data
- App-specific usage logs
- Location coordinates
- Notification content

### What CAN be synced (anonymized):
- Aggregate dimension scores
- Action completion rates
- Streak data
- Level progression

### Never collected:
- Which specific apps are used
- Message content
- Browsing history
- Contact information

---

## APPENDIX: DEFAULT VALUES

```typescript
const DEFAULT_USER_STATE: Partial<UserState> = {
  level: 'npc',
  
  addiction: {
    intensity: 0.5,
    fragmentation: 0.5,
    compulsion: 0.5,
    avoidance: 0.5,
    overallSeverity: 0.5,
    dominantPattern: 'social',
    dataQuality: 0.0,  // No data yet
  },
  
  cognitive: {
    novelty_seeking: 0.25,
    dissociation: 0.25,
    control_seeking: 0.25,
    social_dependency: 0.25,
    preferredModality: 'movement',
    aversionModality: 'stillness',
    confidence: 0.0,  // No inference yet
  },
  
  capacity: {
    friction_tolerance: 0.3,
    embodiment_tolerance: 0.3,
    stillness_tolerance: 0.3,
    novelty_tolerance: 0.3,
    current_stretch: 0.15,
    consecutive_completions: 0,
    consecutive_abandons: 0,
    floor: 0.1,
    ceiling: 0.9,
    blocked_actions: [],
    category_cooldowns: {},
    recent_completions: [],
  },
  
  xp: 0,
  streak: {
    current: 0,
    longest: 0,
  },
  badges: [],
};
```

---

*This document is the canonical reference for user state modeling.*
*All PBRS components must read from and write to these models.*
