# Exit - Data Architecture Specification
## Behavioral Learning Loop & Data Flow

**Version:** 1.0  
**Status:** Implementation Ready  
**Last Updated:** January 2026

---

## OVERVIEW

This document specifies how data flows through Exit's system, from raw OS signals to personalized recommendations and back through feedback loops.

---

## 1. SYSTEM DATA FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXIT DATA ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    DATA SOURCES (iOS)                      │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Screen Time  │  │ CoreMotion   │  │ Notifications │    │ │
│  │  │ API          │  │ (Sensors)    │  │ Center        │    │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │ │
│  │         │                 │                 │             │ │
│  │         └─────────────────┼─────────────────┘             │ │
│  │                           ▼                               │ │
│  └───────────────────────────┼───────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    LOCAL STORAGE                           │ │
│  │                    (On-Device Only)                        │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Raw Events   │  │ UserState    │  │ Action       │    │ │
│  │  │ (SQLite)     │  │ (MMKV)       │  │ History      │    │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │ │
│  │         │                 │                 │             │ │
│  │         └─────────────────┼─────────────────┘             │ │
│  │                           ▼                               │ │
│  └───────────────────────────┼───────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PBRS ENGINE                             │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ State        │  │ Recommend    │  │ Feedback     │    │ │
│  │  │ Computation  │──▶│ Engine       │──▶│ Processor    │    │ │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘    │ │
│  │                                             │             │ │
│  │                           ┌─────────────────┘             │ │
│  │                           ▼                               │ │
│  └───────────────────────────┼───────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PRESENTATION LAYER                      │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │ Dashboard    │  │ Dopamine     │  │ Progress     │    │ │
│  │  │ (Static UI)  │  │ Menu         │  │ Screen       │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    CLOUD SYNC (Optional)                   │ │
│  │                    (Anonymized Only)                       │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐                      │ │
│  │  │ Firebase     │  │ Analytics    │                      │ │
│  │  │ (User Prefs) │  │ (Aggregate)  │                      │ │
│  │  └──────────────┘  └──────────────┘                      │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. RAW DATA COLLECTION

### 2.1 Screen Time API Data

```typescript
interface ScreenTimeEvent {
  timestamp: Date;
  app_bundle_id: string;        // e.g., "com.zhiliaoapp.musically"
  app_category: string;         // e.g., "Social Networking"
  duration_seconds: number;     // Session duration
  event_type: 'session_start' | 'session_end' | 'app_switch';
}

interface PickupEvent {
  timestamp: Date;
  first_app_opened: string;     // What they opened immediately
  time_to_first_unlock: number; // Seconds from wake to unlock
}

interface NotificationEvent {
  timestamp: Date;
  app_bundle_id: string;
  response_time_seconds: number | null;  // null if ignored
  action_taken: 'opened' | 'dismissed' | 'ignored';
}
```

### 2.2 Data Collection Frequency

| Data Type | Collection Method | Frequency |
|-----------|-------------------|-----------|
| Screen Time | DeviceActivityMonitor | Real-time events |
| Pickups | DeviceActivityMonitor | On each unlock |
| Notifications | NotificationCenter | On each notification |
| App Switches | DeviceActivityMonitor | On each switch |

### 2.3 Data Retention

```
RAW EVENTS: 30 days rolling window
COMPUTED STATE: Indefinite (until user deletes)
ACTION HISTORY: 90 days rolling window
```

---

## 3. BEHAVIORAL LEARNING LOOP

### 3.1 The Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                   BEHAVIORAL LEARNING LOOP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     ┌───────────────────────────────────────────────┐           │
│     │                                               │           │
│     ▼                                               │           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │           │
│  │ OBSERVE  │───▶│ COMPUTE  │───▶│ RECOMMEND│      │           │
│  │          │    │          │    │          │      │           │
│  │ Raw OS   │    │ UserState│    │ Actions  │      │           │
│  │ Events   │    │ Update   │    │ Selection│      │           │
│  └──────────┘    └──────────┘    └──────────┘      │           │
│                                        │            │           │
│                                        ▼            │           │
│                                 ┌──────────┐       │           │
│                                 │ PRESENT  │       │           │
│                                 │          │       │           │
│                                 │ UI       │       │           │
│                                 │ Display  │       │           │
│                                 └──────────┘       │           │
│                                        │            │           │
│                                        ▼            │           │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │           │
│  │ UPDATE   │◀───│ PROCESS  │◀───│ CAPTURE  │      │           │
│  │          │    │          │    │          │      │           │
│  │ UserState│    │ Feedback │    │ User     │      │           │
│  │ Persist  │    │ Logic    │    │ Action   │      │           │
│  └──────────┘    └──────────┘    └──────────┘      │           │
│       │                                             │           │
│       └─────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Loop Timing

| Stage | Trigger | Latency Target |
|-------|---------|----------------|
| OBSERVE | Continuous | Real-time |
| COMPUTE | On demand / scheduled | < 50ms |
| RECOMMEND | On menu open | < 100ms |
| PRESENT | After recommend | Immediate |
| CAPTURE | On user interaction | Immediate |
| PROCESS | After capture | < 50ms |
| UPDATE | After process | < 20ms |

### 3.3 Scheduled Computations

```typescript
const COMPUTATION_SCHEDULE = {
  // Daily at 4 AM local time
  daily: {
    tasks: [
      'recompute_addiction_profile',
      'update_trends',
      'check_level_transition',
      'clear_expired_cooldowns',
      'prune_old_events',
    ],
    time: '04:00',
  },
  
  // Weekly on Sunday at 4 AM
  weekly: {
    tasks: [
      'recompute_cognitive_pattern',
      'generate_weekly_report',
      'apply_capacity_decay',
      'analyze_abandon_patterns',
    ],
    time: 'Sunday 04:00',
  },
  
  // Monthly on 1st at 4 AM
  monthly: {
    tasks: [
      'evaluate_level_progression',
      'full_model_validation',
      'reset_monthly_metrics',
      'archive_old_data',
    ],
    time: '1st 04:00',
  },
};
```

---

## 4. STATE COMPUTATION PIPELINE

### 4.1 Addiction Profile Computation

```typescript
async function computeAddictionProfile(
  events: ScreenTimeEvent[],
  pickups: PickupEvent[],
  notifications: NotificationEvent[]
): Promise<AddictionProfile> {
  // Filter to last 7 days
  const window = last7Days(events);
  
  // 4.1.1 Compute Intensity
  const dailyTotals = groupByDay(window).map(day => 
    day.reduce((sum, e) => sum + e.duration_seconds, 0) / 60
  );
  const avgDailyMinutes = average(dailyTotals);
  const intensity = Math.min(1.0, avgDailyMinutes / 360);
  
  // 4.1.2 Compute Fragmentation
  const dailySessions = groupByDay(window).map(day => day.length);
  const avgSessions = average(dailySessions);
  const avgSessionLength = avgDailyMinutes / avgSessions;
  const sessionBrevity = 1 - Math.min(1.0, avgSessionLength / 30);
  const fragmentation = Math.min(1.0, 
    (avgSessions / 100) * sessionBrevity
  );
  
  // 4.1.3 Compute Compulsion
  const notifReactivity = computeNotificationReactivity(notifications);
  const firstHourUsage = computeFirstHourUsage(events, pickups);
  const appSwitchFreq = computeAppSwitchFrequency(events);
  const compulsion = 
    0.4 * notifReactivity +
    0.3 * firstHourUsage +
    0.3 * appSwitchFreq;
  
  // 4.1.4 Compute Avoidance
  const eveningSurge = computeEveningSurge(events);
  const weekendIncrease = computeWeekendIncrease(events);
  const passiveRatio = computePassiveRatio(events);
  const avoidance = 
    0.35 * eveningSurge +
    0.25 * weekendIncrease +
    0.40 * passiveRatio;
  
  // 4.1.5 Compute Overall
  const overallSeverity = 
    0.30 * intensity +
    0.20 * fragmentation +
    0.30 * compulsion +
    0.20 * avoidance;
  
  // 4.1.6 Determine Dominant Pattern
  const dominantPattern = computeDominantPattern(events);
  
  // 4.1.7 Assess Data Quality
  const dataQuality = Math.min(1.0, window.length / 100);
  
  return {
    intensity,
    fragmentation,
    compulsion,
    avoidance,
    overallSeverity,
    dominantPattern,
    primaryProblemCategory: findProblemCategory(events),
    lastComputed: new Date(),
    dataWindowDays: 7,
    dataQuality,
    trend: computeTrend(/* previous profile */),
  };
}
```

### 4.2 Cognitive Pattern Inference

```typescript
async function inferCognitivePattern(
  events: ScreenTimeEvent[],
  profile: AddictionProfile
): Promise<CognitivePattern> {
  const window = last14Days(events);
  
  // 4.2.1 Novelty Seeking
  const appDiversity = computeAppDiversity(window);
  const sessionDepth = computeSessionDepth(window);
  const feedRatio = computeFeedContentRatio(window);
  const novelty_raw = 
    0.40 * appDiversity +
    0.30 * (1 - sessionDepth) +
    0.30 * feedRatio;
  
  // 4.2.2 Dissociation
  const passiveSessions = computePassiveSessionRatio(window);
  const interactionRate = computeInteractionRate(window);
  const lateNightUsage = computeLateNightRatio(window);
  const dissociation_raw = 
    0.45 * passiveSessions +
    0.25 * (1 - interactionRate) +
    0.30 * lateNightUsage;
  
  // 4.2.3 Control Seeking
  const routineStrength = computeRoutineStrength(window);
  const appConcentration = computeAppConcentration(window);
  const patternConsistency = computePatternConsistency(window);
  const control_raw = 
    0.35 * routineStrength +
    0.35 * appConcentration +
    0.30 * patternConsistency;
  
  // 4.2.4 Social Dependency
  const socialRatio = computeSocialAppRatio(window);
  const notifReactivity = profile.compulsion * 0.8; // Reuse
  const messagingFreq = computeMessagingFrequency(window);
  const social_raw = 
    0.40 * socialRatio +
    0.30 * notifReactivity +
    0.30 * messagingFreq;
  
  // 4.2.5 Normalize to sum to 1.0
  const total = novelty_raw + dissociation_raw + control_raw + social_raw;
  const novelty_seeking = novelty_raw / total;
  const dissociation = dissociation_raw / total;
  const control_seeking = control_raw / total;
  const social_dependency = social_raw / total;
  
  // 4.2.6 Derive Modality Preferences
  const modalities = computeModalityPreferences({
    novelty_seeking,
    dissociation,
    control_seeking,
    social_dependency,
  });
  
  return {
    novelty_seeking,
    dissociation,
    control_seeking,
    social_dependency,
    preferredModality: modalities.preferred,
    aversionModality: modalities.aversion,
    neededEffect: computeNeededEffect(profile),
    confidence: Math.min(1.0, window.length / 200),
    lastInferred: new Date(),
  };
}
```

---

## 5. LOCAL STORAGE SCHEMA

### 5.1 SQLite Tables (Raw Events)

```sql
-- Screen time events (30-day retention)
CREATE TABLE screen_time_events (
  id INTEGER PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  app_bundle_id TEXT NOT NULL,
  app_category TEXT,
  duration_seconds INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_ste_timestamp ON screen_time_events(timestamp);
CREATE INDEX idx_ste_app ON screen_time_events(app_bundle_id);

-- Pickup events (30-day retention)
CREATE TABLE pickup_events (
  id INTEGER PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  first_app_opened TEXT,
  time_to_first_unlock INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Notification events (30-day retention)
CREATE TABLE notification_events (
  id INTEGER PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  app_bundle_id TEXT NOT NULL,
  response_time_seconds INTEGER,
  action_taken TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

-- Action outcomes (90-day retention)
CREATE TABLE action_outcomes (
  id INTEGER PRIMARY KEY,
  action_id TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  outcome TEXT NOT NULL, -- 'completed', 'abandoned', 'skipped'
  completion_percentage REAL,
  static_before INTEGER,
  static_after INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX idx_ao_action ON action_outcomes(action_id);
CREATE INDEX idx_ao_outcome ON action_outcomes(outcome);
```

### 5.2 MMKV Keys (Computed State)

```typescript
const MMKV_KEYS = {
  // User State (JSON)
  USER_STATE: 'user_state_v1',
  
  // Component Models (JSON)
  ADDICTION_PROFILE: 'addiction_profile_v1',
  COGNITIVE_PATTERN: 'cognitive_pattern_v1',
  CAPACITY_MODEL: 'capacity_model_v1',
  
  // Progression
  CURRENT_LEVEL: 'current_level',
  TOTAL_XP: 'total_xp',
  CURRENT_STREAK: 'current_streak',
  LONGEST_STREAK: 'longest_streak',
  BADGES: 'badges_v1', // JSON array
  
  // Session State
  CURRENT_STATIC: 'current_static',
  LAST_ACTION_TIME: 'last_action_time',
  ACTIONS_TODAY: 'actions_today',
  
  // Metadata
  LAST_DAILY_COMPUTE: 'last_daily_compute',
  LAST_WEEKLY_COMPUTE: 'last_weekly_compute',
  LAST_MONTHLY_COMPUTE: 'last_monthly_compute',
  SCHEMA_VERSION: 'schema_version',
};
```

---

## 6. CLOUD SYNC (Optional)

### 6.1 What Gets Synced

```typescript
interface SyncPayload {
  // User identity (pseudonymous)
  user_id: string;  // Device-generated UUID
  
  // Aggregate metrics only
  metrics: {
    severity_score: number;      // 0-1
    dominant_pattern: string;
    current_level: string;
    streak_days: number;
    total_completions: number;
    avg_completion_rate: number;
  };
  
  // Preferences (user-controlled)
  preferences: {
    notifications_enabled: boolean;
    theme: string;
    language: string;
  };
  
  // Timestamps
  last_active: Date;
  app_version: string;
}
```

### 6.2 What NEVER Gets Synced

```typescript
// PROHIBITED FROM SYNC
interface NeverSync {
  // Raw usage data
  screen_time_events: never;
  pickup_events: never;
  notification_events: never;
  
  // Identifying information
  app_bundle_ids: never;
  location_coordinates: never;
  
  // Detailed state
  raw_addiction_dimensions: never;
  raw_cognitive_weights: never;
  action_history_with_timestamps: never;
}
```

### 6.3 Sync Frequency

```
ON LEVEL CHANGE: Immediate sync
ON STREAK MILESTONE: Immediate sync
DAILY: Background sync at 4 AM
ON APP CLOSE: Queue sync if changed
```

---

## 7. DATA INTEGRITY

### 7.1 Validation Rules

```typescript
const VALIDATION_RULES = {
  addiction_dimensions: {
    min: 0.0,
    max: 1.0,
    sum_check: false,
  },
  
  cognitive_patterns: {
    min: 0.0,
    max: 1.0,
    sum_check: true,  // Must sum to 1.0
    tolerance: 0.01,
  },
  
  capacity_tolerances: {
    min: 0.1,  // Floor
    max: 0.9,  // Ceiling
  },
  
  static_level: {
    min: 0,
    max: 100,
  },
  
  streak: {
    min: 0,
    max: 9999,
  },
};

function validateUserState(state: UserState): ValidationResult {
  const errors: string[] = [];
  
  // Check addiction bounds
  for (const dim of ['intensity', 'fragmentation', 'compulsion', 'avoidance']) {
    const value = state.addiction[dim];
    if (value < 0 || value > 1) {
      errors.push(`Addiction.${dim} out of bounds: ${value}`);
    }
  }
  
  // Check cognitive sum
  const cogSum = 
    state.cognitive.novelty_seeking +
    state.cognitive.dissociation +
    state.cognitive.control_seeking +
    state.cognitive.social_dependency;
  if (Math.abs(cogSum - 1.0) > 0.01) {
    errors.push(`Cognitive patterns don't sum to 1.0: ${cogSum}`);
  }
  
  // Check capacity bounds
  for (const dim of ['friction', 'embodiment', 'stillness', 'novelty']) {
    const value = state.capacity[`${dim}_tolerance`];
    if (value < 0.1 || value > 0.9) {
      errors.push(`Capacity.${dim} out of bounds: ${value}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### 7.2 Recovery Procedures

```typescript
async function recoverFromCorruption(): Promise<void> {
  // 1. Try to load from MMKV
  const state = await loadUserState();
  
  if (!state) {
    // 2. Rebuild from raw events
    const events = await queryAllEvents();
    const rebuilt = await rebuildUserState(events);
    await saveUserState(rebuilt);
    return;
  }
  
  // 3. Validate
  const validation = validateUserState(state);
  
  if (!validation.valid) {
    // 4. Attempt repair
    const repaired = repairUserState(state, validation.errors);
    await saveUserState(repaired);
    
    // 5. Log for debugging
    await logCorruptionEvent(validation.errors);
  }
}

function repairUserState(
  state: UserState,
  errors: string[]
): UserState {
  const repaired = { ...state };
  
  // Clamp out-of-bounds values
  for (const dim of ['intensity', 'fragmentation', 'compulsion', 'avoidance']) {
    repaired.addiction[dim] = clamp(repaired.addiction[dim], 0, 1);
  }
  
  // Renormalize cognitive if needed
  const cogSum = 
    repaired.cognitive.novelty_seeking +
    repaired.cognitive.dissociation +
    repaired.cognitive.control_seeking +
    repaired.cognitive.social_dependency;
  
  if (cogSum !== 1.0) {
    repaired.cognitive.novelty_seeking /= cogSum;
    repaired.cognitive.dissociation /= cogSum;
    repaired.cognitive.control_seeking /= cogSum;
    repaired.cognitive.social_dependency /= cogSum;
  }
  
  // Clamp capacity
  for (const dim of ['friction', 'embodiment', 'stillness', 'novelty']) {
    repaired.capacity[`${dim}_tolerance`] = clamp(
      repaired.capacity[`${dim}_tolerance`], 0.1, 0.9
    );
  }
  
  return repaired;
}
```

---

## 8. MIGRATION STRATEGY

### 8.1 Schema Versioning

```typescript
const CURRENT_SCHEMA_VERSION = 1;

async function migrateIfNeeded(): Promise<void> {
  const storedVersion = await getSchemaVersion();
  
  if (storedVersion < CURRENT_SCHEMA_VERSION) {
    await runMigrations(storedVersion, CURRENT_SCHEMA_VERSION);
    await setSchemaVersion(CURRENT_SCHEMA_VERSION);
  }
}

const MIGRATIONS: Record<number, Migration> = {
  1: {
    from: 0,
    to: 1,
    description: 'Initial schema',
    up: async () => {
      // Create tables, initialize state
    },
  },
  // Future migrations...
};
```

### 8.2 Rollback Safety

```typescript
async function safeStateUpdate(
  updater: (state: UserState) => UserState
): Promise<void> {
  // 1. Backup current state
  const backup = await loadUserState();
  
  try {
    // 2. Apply update
    const updated = updater(backup);
    
    // 3. Validate
    const validation = validateUserState(updated);
    if (!validation.valid) {
      throw new Error(`Invalid state: ${validation.errors.join(', ')}`);
    }
    
    // 4. Save
    await saveUserState(updated);
    
  } catch (error) {
    // 5. Rollback on failure
    await saveUserState(backup);
    throw error;
  }
}
```

---

*This document is the data architecture specification for Exit.*
*All data operations must conform to these patterns.*
