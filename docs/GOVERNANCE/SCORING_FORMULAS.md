# SCORING FORMULAS SPECIFICATION

**Status:** IMMUTABLE LOGIC (Do Not Modify Without Approval)  
**Version:** 2.0 (Native iOS Edition)  
**Date:** January 3, 2026  
**Owner:** Lead Systems Architect

---

## OVERVIEW

This document defines the **mathematical foundations** of Exit's clarity system. These formulas are the source of truth for all score calculations, threshold evaluations, and progression logic.

**Critical:** These formulas have been validated through behavioral psychology research. Changes require approval from the product team and re-validation with beta testers.

---

## SECTION 1: THE CLARITY SCORE

### **1.1 Core Formula**
```typescript
// Primary Clarity Calculation
const calculateClarity = (
  currentClarity: number,
  screenTimeMinutes: number,
  actionsCompleted: number
): number => {
  // Entropy: Screen time reduces clarity
  const entropy = screenTimeMinutes * 0.5;
  
  // Restoration: Actions restore clarity
  const restoration = actionsCompleted * 10;
  
  // New clarity (bounded 0-100)
  const newClarity = currentClarity - entropy + restoration;
  
  return Math.max(0, Math.min(100, Math.round(newClarity)));
};
```

**Example Calculations:**
```typescript
// Scenario 1: User scrolls 30 minutes
const clarity = calculateClarity(100, 30, 0);
// Result: 100 - (30 * 0.5) + 0 = 85%

// Scenario 2: User scrolls 60 minutes, completes 2 actions
const clarity = calculateClarity(100, 60, 2);
// Result: 100 - (60 * 0.5) + (2 * 10) = 90%

// Scenario 3: User scrolls 120 minutes, completes 3 actions
const clarity = calculateClarity(100, 120, 3);
// Result: 100 - (120 * 0.5) + (3 * 10) = 70%
```

---

### **1.2 App-Specific Entropy Rates**

Different apps accumulate entropy at different rates based on their dopamine variance (unpredictability of reward).
```typescript
// Entropy Rate Multipliers
const ENTROPY_RATES: Record<string, number> = {
  // High dopamine variance (infinite scroll, algorithm-driven)
  'com.zhiliaoapp.musically': 1.5,        // TikTok
  'com.instagram.instagram': 1.0,         // Instagram
  'com.facebook.Facebook': 1.0,           // Facebook
  
  // Medium dopamine variance (community-driven)
  'com.twitter.twitter': 0.8,             // Twitter/X
  'com.reddit.Reddit': 0.8,               // Reddit
  
  // Low dopamine variance (passive consumption)
  'com.google.ios.youtube': 0.5,          // YouTube
  'com.netflix.Netflix': 0.3,             // Netflix
  
  // Default for unlisted apps
  'default': 0.5,
};

// Calculate entropy for specific app
const calculateAppEntropy = (
  bundleId: string,
  minutes: number
): number => {
  const rate = ENTROPY_RATES[bundleId] || ENTROPY_RATES['default'];
  return minutes * 0.5 * rate;
};
```

**Example with App-Specific Rates:**
```typescript
// TikTok: 60 minutes
const tiktokEntropy = calculateAppEntropy('com.zhiliaoapp.musically', 60);
// Result: 60 * 0.5 * 1.5 = 45 points

// YouTube: 60 minutes
const youtubeEntropy = calculateAppEntropy('com.google.ios.youtube', 60);
// Result: 60 * 0.5 * 0.5 = 15 points

// User scrolls both
const totalEntropy = tiktokEntropy + youtubeEntropy;
// Result: 45 + 15 = 60 points lost
```

---

### **1.3 Action Restoration Values**
```typescript
// Restoration Points by Action
const RESTORATION_VALUES: Record<string, number> = {
  // Free tier (low-impact)
  'breathing_box': 5,           // 1 min box breathing
  'breathing_478': 8,           // 2 min 4-7-8 breathing
  'hydration': 3,               // 30s drink water
  'brown_noise': 8,             // 10 min brown noise
  
  // Pro tier (medium-impact)
  'stretching': 10,             // 3 min stretch
  'journal': 12,                // 5 min gratitude journal
  
  // Pro tier (high-impact)
  'walk_5min': 15,              // 5 min walk
  'reading': 20,                // 15 min analog reading
};

// Get restoration value for action
const getRestorationValue = (actionId: string): number => {
  return RESTORATION_VALUES[actionId] || 0;
};
```

---

### **1.4 Blur Intensity Mapping**

The UI blur intensity is directly mapped to clarity loss.
```typescript
// Map Clarity (0-100) to Blur Intensity (0-100)
const getBlurIntensity = (clarity: number): number => {
  // Invert: 100% clarity = 0 blur, 0% clarity = 100 blur
  return 100 - clarity;
};

// Map Clarity to Overlay Opacity (0.0-0.5)
const getOverlayOpacity = (clarity: number): number => {
  // Scale clarity loss (0-100) to opacity (0.0-0.5)
  const clarityLoss = 100 - clarity;
  return (clarityLoss / 100) * 0.5;
};
```

**Visual State Mapping:**

| Clarity | Blur Intensity | Overlay Opacity | State |
|---------|----------------|-----------------|-------|
| 100% | 0 | 0.00 | Crystal clear |
| 90% | 10 | 0.05 | Nearly perfect |
| 80% | 20 | 0.10 | Slight haze |
| 70% | 30 | 0.15 | Mild blur |
| 60% | 40 | 0.20 | Moderate blur |
| 50% | 50 | 0.25 | Heavy blur |
| 40% | 60 | 0.30 | Severe blur |
| 30% | 70 | 0.35 | Critical blur |
| 20% | 80 | 0.40 | Nearly unreadable |
| 10% | 90 | 0.45 | Extreme blur |
| 0% | 100 | 0.50 | Maximum blur |

---

## SECTION 2: SHIELD TRIGGER LOGIC

### **2.1 Trigger Conditions**
```typescript
// Determine if shield should appear
const shouldTriggerShield = (
  clarity: number,
  recentOpens: number,      // Count in last 30 minutes
  dismissalCount: number     // Count today
): boolean => {
  // Mandatory shield after 3 dismissals
  if (dismissalCount >= 3) {
    return true;
  }
  
  // Clarity below threshold
  if (clarity < 60) {
    return true;
  }
  
  // Doom loop detected (3+ opens in 30 min)
  if (recentOpens >= 3) {
    return true;
  }
  
  return false;
};
```

**Trigger Table:**

| Clarity | Recent Opens | Dismissals Today | Shield Triggers? |
|---------|--------------|------------------|------------------|
| 85% | 1 | 0 | ❌ No |
| 55% | 1 | 0 | ✅ Yes (clarity < 60%) |
| 70% | 4 | 0 | ✅ Yes (doom loop) |
| 80% | 2 | 3 | ✅ Yes (dismissal limit) |
| 40% | 1 | 0 | ✅ Yes (clarity < 60%) |

---

### **2.2 Recent Opens Tracking**
```typescript
// Track app opens in rolling 30-minute window
interface AppOpen {
  timestamp: number;
  bundleId: string;
}

const countRecentOpens = (
  opens: AppOpen[],
  bundleId: string,
  windowMinutes: number = 30
): number => {
  const cutoff = Date.now() - (windowMinutes * 60 * 1000);
  
  return opens.filter(open => 
    open.bundleId === bundleId && 
    open.timestamp >= cutoff
  ).length;
};
```

---

### **2.3 Unlock Window Duration**
```typescript
// Unlock duration after action completion
const UNLOCK_DURATION_SECONDS = 60;

// Check if still in unlock window
const isUnlockWindowActive = (
  completionTimestamp: number
): boolean => {
  const elapsed = (Date.now() - completionTimestamp) / 1000;
  return elapsed < UNLOCK_DURATION_SECONDS;
};
```

---

## SECTION 3: CONSCIOUS DAY EVALUATION

### **3.1 Definition**

A "Conscious Day" is achieved when:
1. User accepts ≥3 interventions
2. Screen time stays below threshold
3. Final clarity ≥60%
4. Dismissals <3
```typescript
// Evaluate if day qualifies as conscious
interface DayStats {
  interventionsAccepted: number;
  screenTimeMinutes: number;
  finalClarity: number;
  dismissalCount: number;
}

const isConsciousDay = (
  stats: DayStats,
  screenTimeThreshold: number
): boolean => {
  // Must accept at least 3 interventions
  if (stats.interventionsAccepted < 3) {
    return false;
  }
  
  // Must stay below screen time threshold
  if (stats.screenTimeMinutes > screenTimeThreshold) {
    return false;
  }
  
  // Must maintain clarity above 60%
  if (stats.finalClarity < 60) {
    return false;
  }
  
  // Must not exceed dismissal limit
  if (stats.dismissalCount >= 3) {
    return false;
  }
  
  return true;
};
```

**Example Evaluations:**
```typescript
// Scenario 1: Qualified conscious day
const day1 = {
  interventionsAccepted: 4,
  screenTimeMinutes: 150,
  finalClarity: 75,
  dismissalCount: 1,
};
isConsciousDay(day1, 180); // true

// Scenario 2: Failed (too few interventions)
const day2 = {
  interventionsAccepted: 2,
  screenTimeMinutes: 120,
  finalClarity: 80,
  dismissalCount: 0,
};
isConsciousDay(day2, 180); // false

// Scenario 3: Failed (too many dismissals)
const day3 = {
  interventionsAccepted: 5,
  screenTimeMinutes: 100,
  finalClarity: 85,
  dismissalCount: 3,
};
isConsciousDay(day3, 180); // false
```

---

## SECTION 4: LEVEL PROGRESSION SYSTEM

### **4.1 Level Definitions**
```typescript
interface Level {
  id: string;
  name: string;
  thresholds: {
    avgScreenTime: number;         // minutes per day
    consciousDaysPerMonth: number;
    minClarity: number;            // average clarity %
  };
}

const LEVELS: Level[] = [
  {
    id: 'npc',
    name: 'The NPC',
    thresholds: {
      avgScreenTime: 240,      // 4h
      consciousDaysPerMonth: 0,
      minClarity: 0,
    },
  },
  {
    id: 'glitch',
    name: 'The Glitch',
    thresholds: {
      avgScreenTime: 180,      // 3h
      consciousDaysPerMonth: 5,
      minClarity: 60,
    },
  },
  {
    id: 'hacker',
    name: 'The Hacker',
    thresholds: {
      avgScreenTime: 120,      // 2h
      consciousDaysPerMonth: 10,
      minClarity: 70,
    },
  },
  {
    id: 'main_character',
    name: 'The Main Character',
    thresholds: {
      avgScreenTime: 90,       // 1.5h
      consciousDaysPerMonth: 15,
      minClarity: 80,
    },
  },
  {
    id: 'oracle',
    name: 'The Oracle',
    thresholds: {
      avgScreenTime: 60,       // 1h
      consciousDaysPerMonth: 20,
      minClarity: 85,
    },
  },
];
```

---

### **4.2 Level Evaluation Algorithm**
```typescript
// Monthly stats for level evaluation
interface MonthlyStats {
  avgScreenTime: number;        // Average daily minutes
  consciousDays: number;        // Total conscious days
  avgClarity: number;           // Average clarity %
}

// Determine user's current level
const evaluateLevel = (stats: MonthlyStats): Level => {
  // Start from highest level, work down
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    const level = LEVELS[i];
    
    if (
      stats.avgScreenTime <= level.thresholds.avgScreenTime &&
      stats.consciousDays >= level.thresholds.consciousDaysPerMonth &&
      stats.avgClarity >= level.thresholds.minClarity
    ) {
      return level;
    }
  }
  
  // Default to NPC if no thresholds met
  return LEVELS[0];
};
```

**Example Evaluations:**
```typescript
// Month 1: User starts
const month1 = {
  avgScreenTime: 200,
  consciousDays: 3,
  avgClarity: 55,
};
evaluateLevel(month1); // NPC (doesn't meet Glitch threshold)

// Month 2: Progress
const month2 = {
  avgScreenTime: 170,
  consciousDays: 6,
  avgClarity: 65,
};
evaluateLevel(month2); // Glitch (meets all thresholds)

// Month 3: Regression
const month3 = {
  avgScreenTime: 220,
  consciousDays: 2,
  avgClarity: 50,
};
evaluateLevel(month3); // NPC (downgrade)
```

---

### **4.3 Upgrade/Downgrade Detection**
```typescript
// Check if user should upgrade
const shouldUpgrade = (
  currentLevel: Level,
  stats: MonthlyStats
): { upgrade: boolean; newLevel?: Level } => {
  const currentIndex = LEVELS.findIndex(l => l.id === currentLevel.id);
  
  // Already at max level
  if (currentIndex === LEVELS.length - 1) {
    return { upgrade: false };
  }
  
  const nextLevel = LEVELS[currentIndex + 1];
  
  // Check if meets next level thresholds
  if (
    stats.avgScreenTime <= nextLevel.thresholds.avgScreenTime &&
    stats.consciousDays >= nextLevel.thresholds.consciousDaysPerMonth &&
    stats.avgClarity >= nextLevel.thresholds.minClarity
  ) {
    return { upgrade: true, newLevel: nextLevel };
  }
  
  return { upgrade: false };
};

// Check if user should downgrade
const shouldDowngrade = (
  currentLevel: Level,
  stats: MonthlyStats
): { downgrade: boolean; newLevel?: Level } => {
  const currentIndex = LEVELS.findIndex(l => l.id === currentLevel.id);
  
  // Already at minimum level
  if (currentIndex === 0) {
    return { downgrade: false };
  }
  
  // Check if fails current level thresholds
  if (
    stats.avgScreenTime > currentLevel.thresholds.avgScreenTime ||
    stats.consciousDays < currentLevel.thresholds.consciousDaysPerMonth ||
    stats.avgClarity < currentLevel.thresholds.minClarity
  ) {
    // Find highest level user still qualifies for
    const newLevel = evaluateLevel(stats);
    return { downgrade: true, newLevel };
  }
  
  return { downgrade: false };
};
```

---

## SECTION 5: STREAK CALCULATION

### **5.1 Streak Rules**
```typescript
// Calculate current streak
const calculateStreak = (consciousDays: boolean[]): number => {
  // consciousDays is array where index 0 = today, sorted newest first
  let streak = 0;
  
  for (const isConscious of consciousDays) {
    if (isConscious) {
      streak++;
    } else {
      break; // Streak ends on first non-conscious day
    }
  }
  
  return streak;
};
```

**Example:**
```typescript
// Last 7 days: [true, true, true, false, true, true, true]
//              Today ↑                               ↑ 7 days ago
calculateStreak([true, true, true, false, true, true, true]);
// Result: 3 (current streak broke on day 4)

// Last 7 days: [true, true, true, true, true, true, true]
calculateStreak([true, true, true, true, true, true, true]);
// Result: 7 (perfect week)
```

---

### **5.2 Streak Milestones**
```typescript
const STREAK_MILESTONES = {
  7: {
    badge: 'first_week',
    title: 'The First Week',
    clarityBonus: -20, // -20% static accumulation
  },
  30: {
    badge: 'lunar_cycle',
    title: 'The Lunar Cycle',
    perk: 'deep_actions_unlock',
  },
  90: {
    badge: 'the_season',
    title: 'The Season',
    perk: 'oracle_preview',
  },
};

// Check if streak hits milestone
const checkMilestone = (streak: number) => {
  return STREAK_MILESTONES[streak] || null;
};
```

---

## SECTION 6: DAILY RESET LOGIC

### **6.1 Reset Triggers**
```typescript
// Reset at 4 AM local time (industry standard)
const RESET_HOUR = 4;

// Check if new day has started
const shouldResetDay = (lastResetTimestamp: number): boolean => {
  const now = new Date();
  const lastReset = new Date(lastResetTimestamp);
  
  // Get 4 AM today
  const resetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    RESET_HOUR,
    0,
    0
  );
  
  // If current time is after 4 AM and last reset was before 4 AM, reset
  return now >= resetTime && lastReset < resetTime;
};

// Reset daily counters
const resetDailyState = async () => {
  await StorageManager.set('daily_dismissals', 0);
  await StorageManager.set('daily_interventions', 0);
  await StorageManager.set('daily_screen_time', 0);
  await StorageManager.set('last_reset_timestamp', Date.now());
};
```

---

## SECTION 7: CLARITY STATE MACHINE

### **7.1 State Transitions**
```typescript
type ClarityState = 'crystal' | 'clear' | 'moderate' | 'low' | 'critical';

// Get clarity state from score
const getClarityState = (clarity: number): ClarityState => {
  if (clarity >= 90) return 'crystal';
  if (clarity >= 70) return 'clear';
  if (clarity >= 50) return 'moderate';
  if (clarity >= 30) return 'low';
  return 'critical';
};

// State properties
const CLARITY_STATES: Record<ClarityState, {
  color: string;
  sfSymbol: string;
  message: string;
}> = {
  crystal: {
    color: 'systemBlue',
    sfSymbol: 'sparkles',
    message: 'Crystal clear',
  },
  clear: {
    color: 'systemGreen',
    sfSymbol: 'checkmark.circle.fill',
    message: 'Clear',
  },
  moderate: {
    color: 'systemYellow',
    sfSymbol: 'exclamationmark.triangle.fill',
    message: 'Moderate clarity',
  },
  low: {
    color: 'systemOrange',
    sfSymbol: 'exclamationmark.circle.fill',
    message: 'Low clarity',
  },
  critical: {
    color: 'systemRed',
    sfSymbol: 'exclamationmark.octagon.fill',
    message: 'Critical - restore clarity',
  },
};
```

---

## SECTION 8: FORMULA VALIDATION TESTS

### **8.1 Unit Test Cases**
```typescript
// Test Suite: Clarity Calculation
describe('Clarity Calculation', () => {
  it('reduces clarity by 0.5 per minute scrolled', () => {
    const clarity = calculateClarity(100, 60, 0);
    expect(clarity).toBe(70); // 100 - (60 * 0.5)
  });
  
  it('increases clarity by 10 per action', () => {
    const clarity = calculateClarity(50, 0, 3);
    expect(clarity).toBe(80); // 50 + (3 * 10)
  });
  
  it('bounds clarity between 0 and 100', () => {
    const tooLow = calculateClarity(0, 100, 0);
    expect(tooLow).toBe(0); // Cannot go below 0
    
    const tooHigh = calculateClarity(100, 0, 20);
    expect(tooHigh).toBe(100); // Cannot exceed 100
  });
  
  it('applies app-specific entropy rates', () => {
    const tiktok = calculateAppEntropy('com.zhiliaoapp.musically', 60);
    expect(tiktok).toBe(45); // 60 * 0.5 * 1.5
    
    const youtube = calculateAppEntropy('com.google.ios.youtube', 60);
    expect(youtube).toBe(15); // 60 * 0.5 * 0.5
  });
});

// Test Suite: Shield Triggers
describe('Shield Trigger Logic', () => {
  it('triggers when clarity < 60%', () => {
    expect(shouldTriggerShield(55, 1, 0)).toBe(true);
    expect(shouldTriggerShield(65, 1, 0)).toBe(false);
  });
  
  it('triggers on doom loop (3+ opens)', () => {
    expect(shouldTriggerShield(80, 3, 0)).toBe(true);
    expect(shouldTriggerShield(80, 2, 0)).toBe(false);
  });
  
  it('always triggers after 3 dismissals', () => {
    expect(shouldTriggerShield(90, 1, 3)).toBe(true);
  });
});

// Test Suite: Conscious Day
describe('Conscious Day Evaluation', () => {
  it('requires 3+ interventions', () => {
    const day = {
      interventionsAccepted: 2,
      screenTimeMinutes: 100,
      finalClarity: 70,
      dismissalCount: 0,
    };
    expect(isConsciousDay(day, 180)).toBe(false);
  });
  
  it('requires clarity >= 60%', () => {
    const day = {
      interventionsAccepted: 4,
      screenTimeMinutes: 100,
      finalClarity: 55,
      dismissalCount: 0,
    };
    expect(isConsciousDay(day, 180)).toBe(false);
  });
  
  it('passes with all criteria met', () => {
    const day = {
      interventionsAccepted: 4,
      screenTimeMinutes: 150,
      finalClarity: 75,
      dismissalCount: 1,
    };
    expect(isConsciousDay(day, 180)).toBe(true);
  });
});
```

---

## SECTION 9: EDGE CASES & SAFETY NETS

### **9.1 Negative Clarity Protection**
```typescript
// Prevent clarity from going negative
const safeCalculateClarity = (
  current: number,
  entropy: number,
  restoration: number
): number => {
  const result = current - entropy + restoration;
  
  // Floor at 0
  if (result < 0) {
    console.warn('Clarity attempted to go negative, clamped to 0');
    return 0;
  }
  
  return Math.round(result);
};
```

---

### **9.2 Overflow Protection**
```typescript
// Prevent clarity from exceeding 100
const safeCap = (clarity: number): number => {
  if (clarity > 100) {
    console.warn('Clarity exceeded 100, capped');
    return 100;
  }
  
  return clarity;
};
```

---

### **9.3 Invalid Input Handling**
```typescript
// Validate inputs
const validateClarityInputs = (
  clarity: number,
  screenTime: number,
  actions: number
): boolean => {
  if (clarity < 0 || clarity > 100) {
    console.error('Invalid clarity:', clarity);
    return false;
  }
  
  if (screenTime < 0) {
    console.error('Invalid screen time:', screenTime);
    return false;
  }
  
  if (actions < 0) {
    console.error('Invalid action count:', actions);
    return false;
  }
  
  return true;
};
```

---

## APPENDIX: FORMULA REFERENCE CARD

### **Quick Reference**

| Formula | Expression | Notes |
|---------|-----------|-------|
| **Clarity** | `current - (screenTime × 0.5) + (actions × 10)` | Bounded [0, 100] |
| **App Entropy** | `minutes × 0.5 × rate` | Rate varies by app |
| **Blur Intensity** | `100 - clarity` | Direct inverse |
| **Overlay Opacity** | `(100 - clarity) / 100 × 0.5` | Max 0.5 |
| **Shield Trigger** | `clarity < 60 OR opens >= 3 OR dismissals >= 3` | Any condition |
| **Conscious Day** | `interventions >= 3 AND clarity >= 60 AND dismissals < 3` | All required |
| **Unlock Duration** | `60 seconds` | Fixed |
| **Daily Reset** | `4:00 AM local` | Fixed |

---

**Document Status:** IMMUTABLE (Requires Product Approval to Modify)  
**Version:** 2.0 (Native iOS Edition)  
**Last Updated:** January 3, 2026

---
