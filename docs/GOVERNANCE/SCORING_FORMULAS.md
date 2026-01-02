# THE EXACT SCORING FORMULA

**Status:** ENGINEERING SPECIFICATION  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Owner:** Lead Systems Architect

---

## OVERVIEW

This document contains the precise mathematical formulas and algorithms that govern Exit's scoring system. All calculations are deterministic and run locally on-device.

**Key Principle:** These formulas are the "physics engine" of the app. They must be consistent, predictable, and transparent to users.

---

## SECTION 1: CLARITY SCORE CALCULATION

### 1.1 Base Formula
```
Clarity = 100 - (Entropy - Restoration)

Where:
Clarity ∈ [0, 100]  (clamped to bounds)
Entropy = Accumulated screen time penalty
Restoration = Points earned from completed actions
```

### 1.2 Entropy Accumulation

**Per-App Entropy Rate:**
```typescript
const ENTROPY_RATES: Record<string, number> = {
  // High dopamine variance (unpredictable rewards)
  'com.zhiliaoapp.musically': 0.75,      // TikTok (1.5× base rate)
  'com.instagram.instagram': 0.50,       // Instagram (1.0× base rate)
  'com.facebook.Facebook': 0.50,         // Facebook (1.0× base rate)
  
  // Medium dopamine variance
  'com.twitter.twitter': 0.40,           // Twitter/X (0.8× base rate)
  'com.reddit.Reddit': 0.40,             // Reddit (0.8× base rate)
  
  // Low dopamine variance (passive consumption)
  'com.google.ios.youtube': 0.25,        // YouTube (0.5× base rate)
  'com.netflix.Netflix': 0.15,           // Netflix (0.3× base rate)
  
  // Default for unlisted apps
  'default': 0.50,
};

function calculateEntropy(screenTimeData: ScreenTimeRecord[]): number {
  let totalEntropy = 0;
  
  for (const record of screenTimeData) {
    const rate = ENTROPY_RATES[record.bundleId] || ENTROPY_RATES['default'];
    const minutes = record.durationMinutes;
    
    // Entropy = minutes × rate
    totalEntropy += minutes * rate;
  }
  
  return totalEntropy;
}
```

**Example Calculations:**

| App | Usage Time | Rate | Entropy Added |
|-----|------------|------|---------------|
| TikTok | 60 min | 0.75 | 45 points |
| Instagram | 60 min | 0.50 | 30 points |
| YouTube | 60 min | 0.25 | 15 points |
| Netflix | 120 min | 0.15 | 18 points |

**Total Entropy = Sum of all app contributions**

### 1.3 Restoration Calculation

**Action Completion Points:**
```typescript
interface Action {
  id: string;
  clarityPoints: number;
}

function calculateRestoration(completedActions: Action[]): number {
  return completedActions.reduce((sum, action) => {
    return sum + action.clarityPoints;
  }, 0);
}
```

**Action Point Values (MVP):**

| Action | Points | Duration |
|--------|--------|----------|
| Box Breathing | 10 | 2 min |
| 4-7-8 Breathing | 10 | 90 sec |
| Coherence Breathing | 15 | 3 min |
| Drink Water | 5 | 1 min |
| Gratitude Journal | 10 | 5 min |
| 5-Minute Walk | 15 | 5 min |
| Gentle Stretching | 10 | 5 min |
| Creative Doodling | 10 | 10 min |

### 1.4 Final Clarity Calculation
```typescript
function calculateClarity(
  screenTimeRecords: ScreenTimeRecord[],
  completedActions: Action[]
): number {
  const entropy = calculateEntropy(screenTimeRecords);
  const restoration = calculateRestoration(completedActions);
  
  // Base formula
  const rawClarity = 100 - (entropy - restoration);
  
  // Clamp to valid range [0, 100]
  return Math.max(0, Math.min(100, rawClarity));
}
```

**Example Daily Cycle:**
```
Morning (8 AM):
├─ Starting Clarity: 100
├─ Screen Time: 0 min
└─ Entropy: 0, Restoration: 0

Mid-Morning (11 AM):
├─ TikTok: 30 min → +22.5 entropy
├─ Instagram: 20 min → +10 entropy
├─ Total Entropy: 32.5
└─ Clarity: 100 - 32.5 = 67.5%

Lunch (12 PM):
├─ User completes "Box Breathing" → +10 restoration
├─ Net: 32.5 entropy - 10 restoration = 22.5
└─ Clarity: 100 - 22.5 = 77.5%

Evening (8 PM):
├─ Additional screen time: 90 min mixed apps → +45 entropy
├─ User completes "5-Min Walk" → +15 restoration
├─ Total: 77.5 entropy - 25 restoration = 52.5
└─ Final Clarity: 100 - 52.5 = 47.5%
```

---

## SECTION 2: STATIC OVERLAY OPACITY

### 2.1 Visual Mapping Formula

The static overlay opacity is directly derived from Clarity Score:
```typescript
function calculateStaticOpacity(clarityScore: number): number {
  // Invert clarity to get entropy percentage
  const entropyPercent = 100 - clarityScore;
  
  // Map to opacity range [0.0, 0.5]
  // We cap at 50% opacity to keep UI usable
  const opacity = (entropyPercent / 100) * 0.5;
  
  return opacity;
}
```

**Opacity Table:**

| Clarity Score | Entropy % | Static Opacity | Visual State |
|---------------|-----------|----------------|--------------|
| 100% | 0% | 0.00 | Crystal clear |
| 90% | 10% | 0.05 | Barely visible |
| 80% | 20% | 0.10 | Subtle grain |
| 70% | 30% | 0.15 | Light texture |
| 60% | 40% | 0.20 | Noticeable |
| 50% | 50% | 0.25 | Foggy |
| 40% | 60% | 0.30 | Heavy static |
| 30% | 70% | 0.35 | Degraded |
| 20% | 80% | 0.40 | Critical |
| 10% | 90% | 0.45 | Nearly obscured |
| 0% | 100% | 0.50 | Maximum static |

### 2.2 Implementation
```swift
// iOS SwiftUI Implementation
struct StaticOverlay: View {
    let clarityScore: Int
    
    var opacity: Double {
        let entropy = 100 - clarityScore
        return min(Double(entropy) / 100.0 * 0.5, 0.5)
    }
    
    var body: some View {
        Image("grain-texture")
            .resizable(resizingMode: .tile)
            .opacity(opacity)
            .allowsHitTesting(false)
            .blendMode(.multiply)
    }
}
```

**Performance Note:** Static overlay must maintain 60 FPS. Use GPU-accelerated rendering.

---

## SECTION 3: CONSCIOUS DAY LOGIC

### 3.1 Boolean Formula

A day qualifies as "Conscious" if ALL three conditions are met:
```typescript
function isConsciousDay(dayData: DayData): boolean {
  const condition1 = dayData.interventionsAccepted >= 3;
  const condition2 = dayData.screenTimeMinutes <= dayData.userThreshold;
  const condition3 = dayData.finalClarityScore >= 60;
  
  return condition1 && condition2 && condition3;
}
```

### 3.2 Condition Breakdown

**Condition 1: Interventions Accepted ≥ 3**
```typescript
interface Intervention {
  timestamp: Date;
  accepted: boolean;  // true if completed, false if dismissed
}

function countAcceptedInterventions(interventions: Intervention[]): number {
  return interventions.filter(i => i.accepted).length;
}
```

**What counts as "accepted":**
- User completed breathing exercise to unlock app
- User manually completed action from Actions tab

**What does NOT count:**
- User dismissed shield (3× before 24h lockout)
- User force-quit app during exercise

**Condition 2: Screen Time Below Threshold**
```typescript
const LEVEL_THRESHOLDS: Record<Level, number> = {
  'npc': 240,           // 4 hours
  'glitch': 180,        // 3 hours
  'hacker': 120,        // 2 hours
  'main_character': 90, // 1.5 hours
  'oracle': 60,         // 1 hour
};

function checkScreenTimeThreshold(
  totalMinutes: number,
  userLevel: Level
): boolean {
  const threshold = LEVEL_THRESHOLDS[userLevel];
  return totalMinutes <= threshold;
}
```

**Condition 3: Final Clarity ≥ 60%**

At 11:59 PM each day, the system calculates final Clarity Score for that day. If ≥ 60%, condition passes.

**Why 60%?** This represents a state where the user has actively managed their entropy. Below 60% indicates passive accumulation without restoration.

### 3.3 Example Evaluations

**Day 1: Conscious Day = TRUE**
```
User: Glitch level (threshold: 180 min)
Screen Time: 165 min ✓
Interventions Accepted: 4 ✓
Final Clarity: 68% ✓
Result: TRUE
```

**Day 2: Conscious Day = FALSE (Failed Condition 2)**
```
User: Glitch level (threshold: 180 min)
Screen Time: 210 min ✗ (exceeded threshold)
Interventions Accepted: 5 ✓
Final Clarity: 55% ✗
Result: FALSE
```

**Day 3: Conscious Day = FALSE (Failed Condition 1)**
```
User: Glitch level (threshold: 180 min)
Screen Time: 120 min ✓
Interventions Accepted: 2 ✗ (need 3+)
Final Clarity: 75% ✓
Result: FALSE
```

---

## SECTION 4: LEVEL PROGRESSION ALGORITHM

### 4.1 Monthly Evaluation Formula

**Runs on last day of each month (11:59 PM):**
```typescript
enum Level {
  NPC = 'npc',
  GLITCH = 'glitch',
  HACKER = 'hacker',
  MAIN_CHARACTER = 'main_character',
  ORACLE = 'oracle',
}

interface MonthlyStats {
  avgScreenTimeMinutes: number;
  consciousDaysCount: number;
  totalDays: number;
}

function evaluateLevel(stats: MonthlyStats): Level {
  const avgScreenTime = stats.avgScreenTimeMinutes;
  const consciousDays = stats.consciousDaysCount;
  
  // Check thresholds in descending order (highest level first)
  if (avgScreenTime <= 60 && consciousDays >= 20) {
    return Level.ORACLE;
  }
  
  if (avgScreenTime <= 90 && consciousDays >= 15) {
    return Level.MAIN_CHARACTER;
  }
  
  if (avgScreenTime <= 120 && consciousDays >= 10) {
    return Level.HACKER;
  }
  
  if (avgScreenTime <= 180 && consciousDays >= 5) {
    return Level.GLITCH;
  }
  
  return Level.NPC;
}
```

### 4.2 Average Screen Time Calculation
```typescript
function calculateAvgScreenTime(last30Days: DayData[]): number {
  const totalMinutes = last30Days.reduce((sum, day) => {
    return sum + day.screenTimeMinutes;
  }, 0);
  
  return totalMinutes / last30Days.length;
}
```

**Example:**
```
Days 1-10: 120 min/day average
Days 11-20: 150 min/day average
Days 21-30: 90 min/day average

Total: (120×10) + (150×10) + (90×10) = 3600 min
Average: 3600 / 30 = 120 min/day

Result: Qualifies for Hacker if 10+ Conscious Days
```

### 4.3 Level Transition Matrix

| From Level | To Level | Requirement |
|------------|----------|-------------|
| NPC → Glitch | 7 days: <180 min/day + 5 Conscious Days in month |
| Glitch → Hacker | 30 days: <120 min/day + 10 Conscious Days |
| Hacker → Main Character | 60 days: <90 min/day + 15 Conscious Days |
| Main Character → Oracle | 90 days: <60 min/day + 20 Conscious Days |
| Any → NPC | 30 days: >240 min/day average OR <3 Conscious Days |

**Note:** Levels can skip. If user goes from NPC to meeting Hacker criteria in one month, they jump directly to Hacker.

---

## SECTION 5: DOWNGRADE PROTECTION (GRACE PERIOD)

### 5.1 Grace Period Logic

**Rule:** User must exceed threshold for **7 consecutive days** before downgrade.
```typescript
function shouldDowngrade(user: User, last7Days: DayData[]): boolean {
  const currentLevel = user.level;
  const threshold = LEVEL_THRESHOLDS[currentLevel];
  
  // Check if ALL 7 days exceeded threshold
  const allDaysExceeded = last7Days.every(day => {
    return day.screenTimeMinutes > threshold;
  });
  
  return allDaysExceeded;
}
```

**Example Timeline:**
```
User: Hacker (threshold: 120 min/day)

Day 1: 150 min ⚠️
Day 2: 140 min ⚠️
Day 3: 160 min ⚠️
Day 4: 110 min ✓ (breaks streak)
Day 5: 145 min ⚠️
Day 6: 130 min ⚠️
Day 7: 125 min ⚠️

Result: No downgrade (Day 4 broke consecutive streak)
```

**Continuous Violation:**
```
Day 1: 150 min ⚠️ (Grace day 1/7)
Day 2: 140 min ⚠️ (Grace day 2/7)
Day 3: 160 min ⚠️ (Grace day 3/7)
Day 4: 155 min ⚠️ (Grace day 4/7)
Day 5: 145 min ⚠️ (Grace day 5/7)
Day 6: 130 min ⚠️ (Grace day 6/7)
Day 7: 125 min ⚠️ (Grace day 7/7)

Result: Downgrade to Glitch on Day 8
```

### 5.2 Downgrade Calculation
```typescript
function determineDowngrade(currentLevel: Level): Level {
  const levels = [
    Level.NPC,
    Level.GLITCH,
    Level.HACKER,
    Level.MAIN_CHARACTER,
    Level.ORACLE,
  ];
  
  const currentIndex = levels.indexOf(currentLevel);
  
  // Move down one level
  const newIndex = Math.max(0, currentIndex - 1);
  
  return levels[newIndex];
}
```

**Downgrade is always one level at a time.** You cannot fall from Oracle → NPC in one step.

---

## SECTION 6: SHIELD TRIGGER ALGORITHM

### 6.1 Should Shield Appear?
```typescript
function shouldShowShield(
  app: string,
  clarityScore: number,
  recentOpens: number
): boolean {
  // Check if app is monitored
  const isMonitored = monitoredApps.includes(app);
  if (!isMonitored) return false;
  
  // Trigger if Clarity below 60%
  if (clarityScore < 60) return true;
  
  // Trigger if app opened 3+ times in last 30 minutes (autopilot pattern)
  if (recentOpens >= 3) return true;
  
  return false;
}
```

### 6.2 Recent Opens Tracking
```typescript
interface AppOpen {
  bundleId: string;
  timestamp: Date;
}

function countRecentOpens(
  app: string,
  history: AppOpen[],
  windowMinutes: number = 30
): number {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60000);
  
  return history.filter(open => {
    return open.bundleId === app && 
           open.timestamp >= windowStart;
  }).length;
}
```

**Example:**
```
Time: 3:00 PM
User opens Instagram → Check recent opens

Recent history:
- 2:35 PM: Instagram
- 2:50 PM: Instagram
- 3:00 PM: Instagram (current)

Count = 3 → Trigger shield (autopilot detected)
```

---

## SECTION 7: STREAK CALCULATION (PHASE 2)

### 7.1 Streak Definition

**Note:** Streaks are NOT in MVP, but the formula is defined here for future implementation.
```typescript
function calculateStreak(consciousDays: boolean[]): number {
  let currentStreak = 0;
  
  // Iterate backwards from today
  for (let i = consciousDays.length - 1; i >= 0; i--) {
    if (consciousDays[i]) {
      currentStreak++;
    } else {
      break; // Streak broken
    }
  }
  
  return currentStreak;
}
```

**Example:**
```
Last 10 days: [true, true, false, true, true, true, true, true, true, true]
                                           ↑ Current day

Current Streak = 7 (last 7 consecutive days)
```

### 7.2 Peak Streak Tracking
```typescript
interface StreakData {
  current: number;
  peak: number;
  lastBrokenDate: Date | null;
}

function updateStreak(data: StreakData, todayConscious: boolean): StreakData {
  if (todayConscious) {
    data.current++;
    
    // Update peak if exceeded
    if (data.current > data.peak) {
      data.peak = data.current;
    }
  } else {
    // Streak broken
    data.current = 0;
    data.lastBrokenDate = new Date();
  }
  
  return data;
}
```

---

## SECTION 8: UNLOCK WINDOW LOGIC

### 8.1 60-Second Access Window

After completing an intervention, the user gets 60 seconds of unrestricted access to the blocked app.
```typescript
interface UnlockWindow {
  appBundleId: string;
  unlockedAt: Date;
  expiresAt: Date;
}

function createUnlockWindow(app: string): UnlockWindow {
  const now = new Date();
  const expires = new Date(now.getTime() + 60000); // +60 seconds
  
  return {
    appBundleId: app,
    unlockedAt: now,
    expiresAt: expires,
  };
}

function isWindowActive(window: UnlockWindow): boolean {
  const now = new Date();
  return now < window.expiresAt;
}
```

### 8.2 Shield Re-Lock Timing
```swift
// iOS ShieldConfiguration Extension
override func configuration(shielding application: Application) -> ShieldConfiguration {
    let appGroup = UserDefaults(suiteName: "group.exit.app")
    let unlockTimestamp = appGroup?.double(forKey: "unlock_timestamp") ?? 0
    let now = Date().timeIntervalSince1970
    
    // Check if within 60-second window
    if now - unlockTimestamp < 60 {
        let remaining = Int(60 - (now - unlockTimestamp))
        
        return ShieldConfiguration(
            backgroundBlurStyle: .light,
            backgroundColor: .systemGreen,
            title: ShieldConfiguration.Label(
                text: "Access Granted",
                color: .white
            ),
            subtitle: ShieldConfiguration.Label(
                text: "\(remaining)s remaining",
                color: .white
            )
        )
    }
    
    // Window expired, show normal shield
    return normalShieldConfiguration()
}
```

---

## SECTION 9: EDGE CASE HANDLING

### 9.1 Division by Zero Protection
```typescript
function safeAverage(values: number[]): number {
  if (values.length === 0) return 0;
  
  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}
```

### 9.2 Negative Clarity Prevention
```typescript
function clampClarity(raw: number): number {
  return Math.max(0, Math.min(100, raw));
}
```

**Example:**
```
Entropy: 150
Restoration: 20
Raw Clarity: 100 - (150 - 20) = -30

Clamped: max(0, min(100, -30)) = 0
```

### 9.3 First Day Initialization

On first launch, all values default to neutral/optimal state:
```typescript
const INITIAL_STATE = {
  clarityScore: 100,
  screenTimeToday: 0,
  actionsCompleted: [],
  consciousDays: [],
  level: Level.NPC,
  streak: 0,
};
```

### 9.4 Day Rollover Logic

At midnight (00:00), the system:

1. Calculates final Clarity Score for previous day
2. Evaluates Conscious Day status
3. Resets daily counters:
   - Screen time → 0
   - Actions completed → []
   - Intervention history → []
4. Carries over Clarity Score (doesn't reset to 100)
```typescript
function performDayRollover(currentState: AppState): AppState {
  // Evaluate yesterday
  const wasConscious = isConsciousDay({
    interventionsAccepted: currentState.todayInterventions.length,
    screenTimeMinutes: currentState.todayScreenTime,
    finalClarityScore: currentState.clarityScore,
    userThreshold: LEVEL_THRESHOLDS[currentState.level],
  });
  
  // Update history
  currentState.consciousDays.push(wasConscious);
  
  // Reset daily counters
  currentState.todayScreenTime = 0;
  currentState.todayInterventions = [];
  currentState.todayActions = [];
  
  // Clarity carries over (does NOT reset)
  
  return currentState;
}
```

---

## SECTION 10: PERFORMANCE OPTIMIZATION

### 10.1 Calculation Frequency

| Calculation | Frequency | Trigger |
|-------------|-----------|---------|
| **Clarity Score** | Every 6 hours | Screen Time API refresh |
| **Static Opacity** | Real-time | Clarity Score update |
| **Conscious Day** | Daily | Midnight rollover |
| **Level Evaluation** | Monthly | Last day of month, 11:59 PM |
| **Shield Trigger** | Instant | App open attempt |

### 10.2 Caching Strategy
```typescript
class ClarityCalculator {
  private cachedScore: number = 100;
  private lastCalculated: Date = new Date();
  
  public getClarity(): number {
    const now = new Date();
    const hoursSinceCalc = (now.getTime() - this.lastCalculated.getTime()) / 3600000;
    
    // Recalculate if >6 hours old
    if (hoursSinceCalc >= 6) {
      this.cachedScore = this.recalculate();
      this.lastCalculated = now;
    }
    
    return this.cachedScore;
  }
  
  private recalculate(): number {
    // Full calculation logic here
  }
}
```

### 10.3 Memory Constraints

**Store only last 90 days of detailed data:**
```typescript
function pruneOldData(history: DayData[]): DayData[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  
  return history.filter(day => day.date >= cutoff);
}
```

---

## SECTION 11: TESTING SCENARIOS

### 11.1 Unit Test Cases
```typescript
describe('Clarity Score Calculation', () => {
  test('Zero screen time = 100% clarity', () => {
    const clarity = calculateClarity([], []);
    expect(clarity).toBe(100);
  });
  
  test('TikTok usage applies 1.5× entropy', () => {
    const screenTime = [
      { bundleId: 'com.zhiliaoapp.musically', durationMinutes: 60 }
    ];
    const entropy = calculateEntropy(screenTime);
    expect(entropy).toBe(45); // 60 × 0.75
  });
  
  test('Clarity cannot go below 0', () => {
    const screenTime = [
      { bundleId: 'com.instagram.instagram', durationMinutes: 300 }
    ];
    const clarity = calculateClarity(screenTime, []);
    expect(clarity).toBe(0);
  });
  
  test('Action completion restores clarity', () => {
    const screenTime = [
      { bundleId: 'com.instagram.instagram', durationMinutes: 60 }
    ];
    const actions = [
      { id: 'act_001', clarityPoints: 10 }
    ];
    const clarity = calculateClarity(screenTime, actions);
    expect(clarity).toBe(80); // 100 - (30 - 10)
  });
});
```

### 11.2 Integration Test Scenarios

**Scenario 1: Full Day Cycle**
```
1. User starts day at 100% clarity
2. Uses TikTok for 30 min → Clarity drops to 77.5%
3. Completes Box Breathing → Clarity rises to 87.5%
4. Uses Instagram for 60 min → Clarity drops to 57.5%
5. Completes 5-Min Walk → Clarity rises to 72.5%
6. Day ends at 72.5% (Conscious Day = TRUE if 3+ interventions)
```

**Scenario 2: Level Progression**
```
1. User starts at NPC (new account)
2. Week 1: Avg 150 min/day, 3 Conscious Days
3. Week 2: Avg 140 min/day, 4 Conscious Days
4. Week 3: Avg 160 min/day, 2 Conscious Days
5. Week 4: Avg 170 min/day, 3 Conscious Days
6. Month End: Avg 155 min/day, 12 Conscious Days total
7. Result: Promoted to Glitch (threshold: <180 min, 5+ days)
```

---

## SECTION 12: FORMULA VERSIONING

### 12.1 Change Log

**v1.0 (Current):**
- Initial formulas defined
- Entropy rates established
- Conscious Day logic finalized

**Future Consideration (v2.0):**
- Context-aware entropy (late-night usage = higher entropy)
- Diminishing returns on repeated actions (3rd walk = only +10 instead of +15)
- Bonus multipliers for diverse action types

### 12.2 Migration Strategy

If formulas change in future versions:
```typescript
const FORMULA_VERSION = '1.0';

interface UserData {
  formulaVersion: string;
  clarityScore: number;
  // ...other fields
}

function migrateUserData(data: UserData): UserData {
  if (data.formulaVersion === '1.0' && FORMULA_VERSION === '2.0') {
    // Apply migration logic
    data.clarityScore = recalculateWithV2(data);
    data.formulaVersion = '2.0';
  }
  
  return data;
}
```

---

## APPENDIX A: QUICK REFERENCE

### Core Constants
```typescript
const BASE_ENTROPY_RATE = 0.5;          // Points per minute
const TIKTOK_MULTIPLIER = 1.5;
const YOUTUBE_MULTIPLIER = 0.5;
const CONSCIOUS_DAY_THRESHOLD = 60;     // Clarity %
const SHIELD_TRIGGER_CLARITY = 60;      // Clarity %
const SHIELD_TRIGGER_OPENS = 3;         // Opens in 30 min
const UNLOCK_WINDOW_SECONDS = 60;
const GRACE_PERIOD_DAYS = 7;
const INTERVENTION_DAILY_MIN = 3;
```

### Level Thresholds
```typescript
const LEVEL_SCREEN_TIME: Record<Level, number> = {
  npc: 240,           // 4h
  glitch: 180,        // 3h
  hacker: 120,        // 2h
  main_character: 90, // 1.5h
  oracle: 60,         // 1h
};
```

---

## APPENDIX B: PSEUDOCODE SUMMARY
```
EVERY 6 HOURS:
  ScreenTime ← GetFromiOS()
  Entropy ← CalculateEntropy(ScreenTime)
  Restoration ← SumActionPoints(CompletedActions)
  Clarity ← Clamp(100 - (Entropy - Restoration), 0, 100)
  StaticOpacity ← (100 - Clarity) / 100 * 0.5

ON APP OPEN:
  IF (App IN MonitoredApps) AND (Clarity < 60 OR RecentOpens ≥ 3):
    SHOW Shield
    IF UserCompletesIntervention:
      CreateUnlockWindow(60 seconds)
      AllowAccess()

AT MIDNIGHT:
  ConsciousDay ← (Interventions ≥ 3) AND (ScreenTime ≤ Threshold) AND (Clarity ≥ 60)
  AppendToHistory(ConsciousDay)
  ResetDailyCounters()

AT MONTH END:
  AvgScreenTime ← Mean(Last30Days.ScreenTime)
  ConsciousDaysCount ← Count(Last30Days.ConsciousDays)
  NewLevel ← EvaluateLevel(AvgScreenTime, ConsciousDaysCount)
  IF NewLevel ≠ CurrentLevel:
    TransitionToLevel(NewLevel)
```

---

**Document Status:** ENGINEERING READY  
**Implementation Priority:** HIGH  
**Dependencies:** None (all local calculations)

---
