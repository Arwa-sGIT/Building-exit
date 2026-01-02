# DATABASE SCHEMA

**Status:** DATA ARCHITECTURE  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Philosophy:** Local-First, Privacy-Preserving

---

## OVERVIEW

Exit uses a **local-first** architecture where all sensitive data remains on-device. The database layer consists of three tiers:

1. **Hot Storage (MMKV):** Fast key-value store for current state
2. **App Group Storage (UserDefaults):** Shared data between app and extensions
3. **Cold Storage (Optional Cloud Sync - Phase 2):** Anonymized aggregate statistics only

**Critical Principle:** Raw screen time data (specific apps, timestamps) NEVER leaves the device.

---

## SECTION 1: LOCAL STORAGE (MMKV)

### 1.1 Why MMKV?

**Comparison:**

| Storage | Read Speed | Write Speed | Size Limit | Use Case |
|---------|-----------|-------------|------------|----------|
| **MMKV** | ~1μs | ~1μs | ~100MB | Current state, hot data |
| **UserDefaults** | ~10μs | ~50μs | ~10MB | Simple key-value, shared data |
| **SQLite** | ~100μs | ~500μs | Unlimited | Historical records (Phase 2) |
| **CoreData** | ~200μs | ~1ms | Unlimited | Complex relationships (NOT NEEDED) |

**Decision:** MMKV for MVP (fastest, simplest, sufficient for 90 days of data).

### 1.2 Installation
```bash
npm install react-native-mmkv
cd ios && pod install && cd ..
```

### 1.3 Schema Definition
```typescript
// src/storage/schema.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'exit-main-storage',
  encryptionKey: 'exit-secure-key-v1' // Encrypts data at rest
});

// Type-safe storage keys
export enum StorageKey {
  // Current State
  CLARITY_SCORE = 'clarity_score',
  SCREEN_TIME_TODAY = 'screen_time_today',
  ACTIONS_COMPLETED_TODAY = 'actions_completed_today',
  INTERVENTIONS_TODAY = 'interventions_today',
  
  // User Profile
  USER_LEVEL = 'user_level',
  ONBOARDING_COMPLETED = 'onboarding_completed',
  MONITORED_APPS = 'monitored_apps',
  
  // Historical Data (Last 90 Days)
  DAILY_HISTORY = 'daily_history',
  ACTION_COMPLETION_HISTORY = 'action_completion_history',
  
  // Streak & Progress
  CONSCIOUS_DAYS_ARRAY = 'conscious_days_array',
  CURRENT_STREAK = 'current_streak',
  PEAK_STREAK = 'peak_streak',
  
  // Settings
  NOTIFICATIONS_ENABLED = 'notifications_enabled',
  HAPTICS_ENABLED = 'haptics_enabled',
  
  // System
  LAST_SYNC_TIMESTAMP = 'last_sync_timestamp',
  APP_VERSION = 'app_version',
}
```

### 1.4 Data Models
```typescript
// src/storage/models.ts

// ===== CURRENT STATE =====

export interface ClarityState {
  score: number;                    // 0-100
  lastUpdated: number;              // Unix timestamp (ms)
  entropyAccumulated: number;       // Points
  restorationPoints: number;        // Points
}

export interface ScreenTimeToday {
  totalMinutes: number;
  breakdown: AppUsageRecord[];      // Per-app breakdown
}

export interface AppUsageRecord {
  bundleId: string;
  durationMinutes: number;
  lastOpened: number;               // Unix timestamp (ms)
}

export interface ActionCompletedToday {
  actionId: string;
  completedAt: number;              // Unix timestamp (ms)
  clarityPointsEarned: number;
}

export interface InterventionToday {
  timestamp: number;                // Unix timestamp (ms)
  triggeredBy: string;              // Bundle ID
  accepted: boolean;                // true = completed, false = dismissed
  actionId?: string;                // Which action was completed (if accepted)
}

// ===== USER PROFILE =====

export enum UserLevel {
  NPC = 'npc',
  GLITCH = 'glitch',
  HACKER = 'hacker',
  MAIN_CHARACTER = 'main_character',
  ORACLE = 'oracle',
}

export interface UserProfile {
  level: UserLevel;
  levelSince: number;               // Unix timestamp (ms)
  onboardingCompletedAt: number;    // Unix timestamp (ms)
  monitoredApps: string[];          // Array of bundle IDs
}

// ===== HISTORICAL DATA =====

export interface DayRecord {
  date: string;                     // YYYY-MM-DD
  screenTimeMinutes: number;
  clarityScoreFinal: number;        // End-of-day score
  interventionsAccepted: number;
  actionsCompleted: string[];       // Array of action IDs
  wasConsciousDay: boolean;
}

export interface ActionHistory {
  actionId: string;
  lastCompleted: number;            // Unix timestamp (ms)
  timesCompleted: number;           // Lifetime count
  avgClarityGain: number;           // Average points earned
}

// ===== STREAK DATA =====

export interface StreakData {
  current: number;
  peak: number;
  lastBrokenDate: string | null;   // YYYY-MM-DD
  totalConsciousDays: number;       // Lifetime
}
```

### 1.5 Storage Utilities
```typescript
// src/storage/utils.ts
import { storage, StorageKey } from './schema';

export class StorageManager {
  
  // ===== CURRENT STATE =====
  
  static getClarityScore(): number {
    return storage.getNumber(StorageKey.CLARITY_SCORE) ?? 100;
  }
  
  static setClarityScore(score: number): void {
    storage.set(StorageKey.CLARITY_SCORE, score);
  }
  
  static getScreenTimeToday(): ScreenTimeToday {
    const json = storage.getString(StorageKey.SCREEN_TIME_TODAY);
    if (!json) return { totalMinutes: 0, breakdown: [] };
    return JSON.parse(json);
  }
  
  static setScreenTimeToday(data: ScreenTimeToday): void {
    storage.set(StorageKey.SCREEN_TIME_TODAY, JSON.stringify(data));
  }
  
  static getActionsCompletedToday(): ActionCompletedToday[] {
    const json = storage.getString(StorageKey.ACTIONS_COMPLETED_TODAY);
    if (!json) return [];
    return JSON.parse(json);
  }
  
  static addActionCompleted(action: ActionCompletedToday): void {
    const current = this.getActionsCompletedToday();
    current.push(action);
    storage.set(StorageKey.ACTIONS_COMPLETED_TODAY, JSON.stringify(current));
  }
  
  static getInterventionsToday(): InterventionToday[] {
    const json = storage.getString(StorageKey.INTERVENTIONS_TODAY);
    if (!json) return [];
    return JSON.parse(json);
  }
  
  static addIntervention(intervention: InterventionToday): void {
    const current = this.getInterventionsToday();
    current.push(intervention);
    storage.set(StorageKey.INTERVENTIONS_TODAY, JSON.stringify(current));
  }
  
  // ===== USER PROFILE =====
  
  static getUserProfile(): UserProfile | null {
    const levelStr = storage.getString(StorageKey.USER_LEVEL);
    if (!levelStr) return null;
    
    const monitoredAppsJson = storage.getString(StorageKey.MONITORED_APPS);
    const monitoredApps = monitoredAppsJson ? JSON.parse(monitoredAppsJson) : [];
    
    return {
      level: levelStr as UserLevel,
      levelSince: 0, // TODO: Track this
      onboardingCompletedAt: storage.getNumber(StorageKey.ONBOARDING_COMPLETED) ?? 0,
      monitoredApps,
    };
  }
  
  static setUserLevel(level: UserLevel): void {
    storage.set(StorageKey.USER_LEVEL, level);
  }
  
  static setMonitoredApps(apps: string[]): void {
    storage.set(StorageKey.MONITORED_APPS, JSON.stringify(apps));
  }
  
  // ===== HISTORICAL DATA =====
  
  static getDailyHistory(): DayRecord[] {
    const json = storage.getString(StorageKey.DAILY_HISTORY);
    if (!json) return [];
    return JSON.parse(json);
  }
  
  static addDayRecord(record: DayRecord): void {
    const history = this.getDailyHistory();
    
    // Check if record for this date already exists
    const existingIndex = history.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      history[existingIndex] = record; // Update
    } else {
      history.push(record); // Add new
    }
    
    // Keep only last 90 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    
    const pruned = history.filter(r => r.date >= cutoffStr);
    
    storage.set(StorageKey.DAILY_HISTORY, JSON.stringify(pruned));
  }
  
  static getActionHistory(): ActionHistory[] {
    const json = storage.getString(StorageKey.ACTION_COMPLETION_HISTORY);
    if (!json) return [];
    return JSON.parse(json);
  }
  
  static updateActionHistory(actionId: string, clarityGained: number): void {
    const history = this.getActionHistory();
    const existing = history.find(h => h.actionId === actionId);
    
    if (existing) {
      existing.lastCompleted = Date.now();
      existing.timesCompleted++;
      existing.avgClarityGain = 
        (existing.avgClarityGain * (existing.timesCompleted - 1) + clarityGained) / 
        existing.timesCompleted;
    } else {
      history.push({
        actionId,
        lastCompleted: Date.now(),
        timesCompleted: 1,
        avgClarityGain: clarityGained,
      });
    }
    
    storage.set(StorageKey.ACTION_COMPLETION_HISTORY, JSON.stringify(history));
  }
  
  // ===== STREAK DATA =====
  
  static getStreak(): StreakData {
    const json = storage.getString(StorageKey.CONSCIOUS_DAYS_ARRAY);
    if (!json) {
      return {
        current: 0,
        peak: 0,
        lastBrokenDate: null,
        totalConsciousDays: 0,
      };
    }
    
    const consciousDays: string[] = JSON.parse(json); // Array of YYYY-MM-DD dates
    
    // Calculate current streak (consecutive days from today backward)
    let current = 0;
    const today = new Date();
    
    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (consciousDays.includes(dateStr)) {
        current++;
      } else {
        break;
      }
    }
    
    return {
      current,
      peak: storage.getNumber(StorageKey.PEAK_STREAK) ?? 0,
      lastBrokenDate: null, // TODO: Track this
      totalConsciousDays: consciousDays.length,
    };
  }
  
  static addConsciousDay(date: string): void {
    const json = storage.getString(StorageKey.CONSCIOUS_DAYS_ARRAY);
    const days: string[] = json ? JSON.parse(json) : [];
    
    if (!days.includes(date)) {
      days.push(date);
      storage.set(StorageKey.CONSCIOUS_DAYS_ARRAY, JSON.stringify(days));
    }
    
    // Update peak if needed
    const streakData = this.getStreak();
    if (streakData.current > streakData.peak) {
      storage.set(StorageKey.PEAK_STREAK, streakData.current);
    }
  }
  
  // ===== DAILY RESET =====
  
  static performDailyReset(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Finalize yesterday's record
    const record: DayRecord = {
      date: yesterdayStr,
      screenTimeMinutes: this.getScreenTimeToday().totalMinutes,
      clarityScoreFinal: this.getClarityScore(),
      interventionsAccepted: this.getInterventionsToday().filter(i => i.accepted).length,
      actionsCompleted: this.getActionsCompletedToday().map(a => a.actionId),
      wasConsciousDay: false, // Will be calculated
    };
    
    // Calculate if yesterday was a Conscious Day
    const profile = this.getUserProfile();
    const threshold = LEVEL_THRESHOLDS[profile?.level ?? UserLevel.NPC];
    
    record.wasConsciousDay = 
      record.interventionsAccepted >= 3 &&
      record.screenTimeMinutes <= threshold &&
      record.clarityScoreFinal >= 60;
    
    this.addDayRecord(record);
    
    if (record.wasConsciousDay) {
      this.addConsciousDay(yesterdayStr);
    }
    
    // Reset today's counters
    storage.set(StorageKey.SCREEN_TIME_TODAY, JSON.stringify({ 
      totalMinutes: 0, 
      breakdown: [] 
    }));
    storage.set(StorageKey.ACTIONS_COMPLETED_TODAY, JSON.stringify([]));
    storage.set(StorageKey.INTERVENTIONS_TODAY, JSON.stringify([]));
    
    // Clarity score carries over (does NOT reset)
  }
  
  // ===== BACKUP & RESTORE =====
  
  static exportAllData(): string {
    const allKeys = [
      StorageKey.CLARITY_SCORE,
      StorageKey.SCREEN_TIME_TODAY,
      StorageKey.ACTIONS_COMPLETED_TODAY,
      StorageKey.INTERVENTIONS_TODAY,
      StorageKey.USER_LEVEL,
      StorageKey.MONITORED_APPS,
      StorageKey.DAILY_HISTORY,
      StorageKey.ACTION_COMPLETION_HISTORY,
      StorageKey.CONSCIOUS_DAYS_ARRAY,
      StorageKey.PEAK_STREAK,
    ];
    
    const data: Record<string, any> = {};
    
    allKeys.forEach(key => {
      const value = storage.getString(key);
      if (value) {
        data[key] = value;
      }
    });
    
    return JSON.stringify(data, null, 2);
  }
  
  static importAllData(json: string): void {
    const data = JSON.parse(json);
    
    Object.keys(data).forEach(key => {
      storage.set(key, data[key]);
    });
  }
  
  // ===== UTILITIES =====
  
  static clearAllData(): void {
    storage.clearAll();
  }
}

// Level thresholds for reference
const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  [UserLevel.NPC]: 240,
  [UserLevel.GLITCH]: 180,
  [UserLevel.HACKER]: 120,
  [UserLevel.MAIN_CHARACTER]: 90,
  [UserLevel.ORACLE]: 60,
};
```

---

## SECTION 2: APP GROUP STORAGE (SHARED)

### 2.1 Schema

**Already documented in API_SPECIFICATIONS.md, repeated here for completeness:**
```typescript
interface AppGroupStorage {
  // Core State (read by extensions)
  clarity_score: number;              // 0-100
  screen_time_today: number;          // Minutes
  monitored_apps: string;             // JSON array of bundle IDs
  user_level: string;                 // Level enum as string
  
  // Intervention Flow (bidirectional)
  intervention_requested: boolean;    // Shield → Main App
  blocked_app: string;                // Shield → Main App
  unlock_timestamp: number;           // Main App → Shield
  
  // System Health
  extension_heartbeat: number;        // Unix timestamp (seconds)
}
```

### 2.2 Synchronization Strategy

**Main App is source of truth.** Extensions read-only except for intervention signals.
```typescript
// Sync MMKV → App Group every 6 hours
async function syncToAppGroup(): Promise<void> {
  const clarity = StorageManager.getClarityScore();
  const screenTime = StorageManager.getScreenTimeToday();
  const profile = StorageManager.getUserProfile();
  
  await SharedStorage.setClarity(clarity);
  await SharedStorage.setInt('screen_time_today', screenTime.totalMinutes);
  await SharedStorage.setString('user_level', profile?.level ?? UserLevel.NPC);
  await SharedStorage.setMonitoredApps(profile?.monitoredApps ?? []);
}

// Run on:
// - App foreground
// - Clarity score change
// - Level change
// - Background task (every 6 hours)
```

---

## SECTION 3: CLOUD STORAGE (PHASE 2 - FIREBASE)

### 3.1 Firestore Schema

**Principle:** Only anonymized aggregate statistics. NO raw screen time data.
```typescript
// Firestore Collection: users/{userId}/stats/{date}

interface DailyStats {
  date: string;                       // YYYY-MM-DD
  
  // Aggregates Only
  clarityScore: number;               // End-of-day score (0-100)
  screenTimeMinutes: number;          // Total only, no app breakdown
  interventionsAccepted: number;      // Count only, no timestamps
  actionsCompleted: number;           // Count only, no IDs
  consciousDay: boolean;
  
  // Metadata
  userLevel: string;                  // Level at end of day
  appVersion: string;                 // App version
  platform: 'ios' | 'android';
  
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```
```typescript
// Firestore Collection: users/{userId}/profile

interface UserProfileCloud {
  level: string;
  levelSince: FirebaseFirestore.Timestamp;
  
  // Streak Data
  currentStreak: number;
  peakStreak: number;
  totalConsciousDays: number;
  
  // Account
  createdAt: FirebaseFirestore.Timestamp;
  lastActiveAt: FirebaseFirestore.Timestamp;
  
  // Settings (synced across devices)
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
}
```

### 3.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Stats collection
      match /stats/{date} {
        allow read: if request.auth != null && request.auth.uid == userId;
        
        // Only allow writes from Cloud Functions (not direct client writes)
        allow write: if false;
      }
    }
  }
}
```

### 3.3 Cloud Functions (Data Ingestion)
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Callable function to sync daily stats
export const syncDailyStats = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const userId = context.auth.uid;
  const { date, stats } = data;
  
  // Validate data
  if (!date || !stats) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }
  
  // Ensure no raw app data
  if ('appBreakdown' in stats || 'actionIds' in stats) {
    throw new functions.https.HttpsError('invalid-argument', 'Cannot sync raw data');
  }
  
  // Write to Firestore
  const docRef = admin.firestore()
    .collection('users')
    .doc(userId)
    .collection('stats')
    .doc(date);
  
  await docRef.set({
    ...stats,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  
  return { success: true };
});
```

### 3.4 Sync Strategy
```typescript
// src/services/CloudSync.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export class CloudSyncService {
  
  static async syncLastWeek(): Promise<void> {
    const user = auth().currentUser;
    if (!user) return;
    
    const history = StorageManager.getDailyHistory();
    const lastWeek = history.filter(record => {
      const recordDate = new Date(record.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });
    
    // Sync each day
    for (const record of lastWeek) {
      const stats: DailyStats = {
        date: record.date,
        clarityScore: record.clarityScoreFinal,
        screenTimeMinutes: record.screenTimeMinutes,
        interventionsAccepted: record.interventionsAccepted,
        actionsCompleted: record.actionsCompleted.length, // Count only
        consciousDay: record.wasConsciousDay,
        userLevel: StorageManager.getUserProfile()?.level ?? UserLevel.NPC,
        appVersion: DeviceInfo.getVersion(),
        platform: 'ios',
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      };
      
      await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('stats')
        .doc(record.date)
        .set(stats, { merge: true });
    }
  }
  
  static async syncUserProfile(): Promise<void> {
    const user = auth().currentUser;
    if (!user) return;
    
    const profile = StorageManager.getUserProfile();
    const streak = StorageManager.getStreak();
    
    if (!profile) return;
    
    await firestore()
      .collection('users')
      .doc(user.uid)
      .set({
        level: profile.level,
        levelSince: firestore.Timestamp.fromMillis(profile.levelSince),
        currentStreak: streak.current,
        peakStreak: streak.peak,
        totalConsciousDays: streak.totalConsciousDays,
        lastActiveAt: firestore.Timestamp.now(),
        notificationsEnabled: storage.getBoolean(StorageKey.NOTIFICATIONS_ENABLED) ?? true,
        hapticsEnabled: storage.getBoolean(StorageKey.HAPTICS_ENABLED) ?? true,
      }, { merge: true });
  }
}
```

---

## SECTION 4: DATA MIGRATIONS

### 4.1 Schema Versioning
```typescript
const SCHEMA_VERSION = 1;

export function checkSchemaVersion(): void {
  const currentVersion = storage.getNumber('schema_version') ?? 0;
  
  if (currentVersion < SCHEMA_VERSION) {
    runMigrations(currentVersion, SCHEMA_VERSION);
    storage.set('schema_version', SCHEMA_VERSION);
  }
}

function runMigrations(from: number, to: number): void {
  console.log(`Migrating schema from v${from} to v${to}`);
  
  // Example: v0 → v1 migration
  if (from < 1 && to >= 1) {
    migrateV0toV1();
  }
  
  // Future migrations go here
}

function migrateV0toV1(): void {
  // Example: Rename old keys
  const oldClarityKey = 'user_clarity';
  const oldClarity = storage.getNumber(oldClarityKey);
  
  if (oldClarity !== undefined) {
    storage.set(StorageKey.CLARITY_SCORE, oldClarity);
    storage.delete(oldClarityKey);
  }
  
  console.log('Migration v0→v1 complete');
}
```

### 4.2 Backup Before Migration
```typescript
export function performSafeMigration(): void {
  // Create backup
  const backup = StorageManager.exportAllData();
  storage.set('migration_backup', backup);
  storage.set('migration_backup_timestamp', Date.now());
  
  try {
    checkSchemaVersion();
    console.log('Migration successful');
  } catch (error) {
    console.error('Migration failed, restoring backup', error);
    
    // Restore backup
    const backupData = storage.getString('migration_backup');
    if (backupData) {
      StorageManager.importAllData(backupData);
    }
  }
}
```

---

## SECTION 5: PERFORMANCE OPTIMIZATIONS

### 5.1 Lazy Loading Historical Data
```typescript
// Don't load all 90 days at once
export class HistoryLoader {
  
  static getLast7Days(): DayRecord[] {
    const history = StorageManager.getDailyHistory();
    return history.slice(-7);
  }
  
  static getLast30Days(): DayRecord[] {
    const history = StorageManager.getDailyHistory();
    return history.slice(-30);
  }
  
  static getLast90Days(): DayRecord[] {
    // Only call when necessary (e.g., level evaluation)
    return StorageManager.getDailyHistory();
  }
}
```

### 5.2 Batch Writes
```typescript
// Instead of multiple individual writes
StorageManager.setClarityScore(75);
StorageManager.setScreenTimeToday({ totalMinutes: 120, breakdown: [] });
StorageManager.addIntervention({ timestamp: Date.now(), triggeredBy: 'tiktok', accepted: true });

// Batch transaction
export class StorageBatch {
  private operations: Array<() => void> = [];
  
  setClarityScore(score: number): void {
    this.operations.push(() => StorageManager.setClarityScore(score));
  }
  
  setScreenTimeToday(data: ScreenTimeToday): void {
    this.operations.push(() => StorageManager.setScreenTimeToday(data));
  }
  
  commit(): void {
    // Execute all operations
    this.operations.forEach(op => op());
    this.operations = [];
  }
}

// Usage
const batch = new StorageBatch();
batch.setClarityScore(75);
batch.setScreenTimeToday({ totalMinutes: 120, breakdown: [] });
batch.commit(); // Single synchronous block
```

### 5.3 Indexed Queries
```typescript
// For fast lookups, maintain indexes

export class ActionIndex {
  
  // Map: actionId → last completed timestamp
  private static getIndex(): Map<string, number> {
    const json = storage.getString('action_index');
    if (!json) return new Map();
    return new Map(JSON.parse(json));
  }
  
  private static setIndex(map: Map<string, number>): void {
    storage.set('action_index', JSON.stringify(Array.from(map.entries())));
  }
  
  static wasCompletedRecently(actionId: string, withinHours: number = 24): boolean {
    const index = this.getIndex();
    const lastCompleted = index.get(actionId);
    
    if (!lastCompleted) return false;
    
    const hoursSince = (Date.now() - lastCompleted) / 3600000;
    return hoursSince < withinHours;
  }
  
  static markCompleted(actionId: string): void {
    const index = this.getIndex();
    index.set(actionId, Date.now());
    this.setIndex(index);
  }
}
```

---

## SECTION 6: DATA PRIVACY & SECURITY

### 6.1 Encryption at Rest
```typescript
// MMKV with encryption enabled
export const storage = new MMKV({
  id: 'exit-main-storage',
  encryptionKey: 'exit-secure-key-v1' // AES-256
});
```

**Note:** Encryption key is hardcoded in app. For enhanced security (Phase 2), derive key from user passcode.

### 6.2 Data Anonymization Pipeline
```typescript
export class DataAnonymizer {
  
  static anonymizeDayRecord(record: DayRecord): DailyStats {
    // Remove all PII and raw data
    return {
      date: record.date,
      clarityScore: record.clarityScoreFinal,
      screenTimeMinutes: record.screenTimeMinutes, // Total only
      interventionsAccepted: record.interventionsAccepted, // Count only
      actionsCompleted: record.actionsCompleted.length, // Count only
      consciousDay: record.wasConsciousDay,
      userLevel: StorageManager.getUserProfile()?.level ?? UserLevel.NPC,
      appVersion: DeviceInfo.getVersion(),
      platform: 'ios',
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    };
    
    // NOT included:
    // - App breakdown (which apps, when)
    // - Action IDs (which actions)
    // - Timestamps (when interventions occurred)
  }
}
```

### 6.3 User Data Export (GDPR Compliance)
```typescript
export class DataExporter {
  
  static async exportUserData(): Promise<string> {
    const profile = StorageManager.getUserProfile();
    const history = StorageManager.getDailyHistory();
    const streak = StorageManager.getStreak();
    const actionHistory = StorageManager.getActionHistory();
    
    const exportData = {
      profile,
      history,
      streak,
      actionHistory,
      exportedAt: new Date().toISOString(),
      appVersion: DeviceInfo.getVersion(),
    };
    
    return JSON.stringify(exportData, null, 2);
  }
  
  static async exportToFile(): Promise<string> {
    const data = await this.exportUserData();
    const filename = `exit-data-${Date.now()}.json`;
    const filepath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    
    await RNFS.writeFile(filepath, data, 'utf8');
    
    return filepath;
  }
}
```

### 6.4 Right to Deletion
```typescript
export class DataDeletion {
  
  static async deleteAllLocalData(): Promise<void> {
    // Clear MMKV
    StorageManager.clearAllData();
    
    // Clear App Group
    await SharedStorage.clearAll();
    
    console.log('All local data deleted');
  }
  
  static async deleteCloudData(): Promise<void> {
    const user = auth().currentUser;
    if (!user) return;
    
    // Delete Firestore data
    const batch = firestore().batch();
    
    // Delete stats collection
    const statsSnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('stats')
      .get();
    
    statsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete profile
    const profileRef = firestore().collection('users').doc(user.uid);
    batch.delete(profileRef);
    
    await batch.commit();
    
    // Delete Firebase Auth account
    await user.delete();
    
    console.log('All cloud data deleted');
  }
}
```

---

## SECTION 7: TESTING & VALIDATION

### 7.1 Data Integrity Tests
```typescript
describe('Storage Integrity', () => {
  beforeEach(() => {
    StorageManager.clearAllData();
  });
  
  test('Clarity score persists across app restarts', () => {
    StorageManager.setClarityScore(75);
    
    // Simulate app restart (re-read from storage)
    const score = StorageManager.getClarityScore();
    
    expect(score).toBe(75);
  });
  
  test('Daily history never exceeds 90 days', () => {
    // Add 100 days of history
    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const record: DayRecord = {
        date: date.toISOString().split('T')[0],
        screenTimeMinutes: 120,
        clarityScoreFinal: 70,
        interventionsAccepted: 3,
        actionsCompleted: ['act_001'],
        wasConsciousDay: true,
      };
      StorageManager.addDayRecord(record);
    }
    
    const history = StorageManager.getDailyHistory();
    expect(history.length).toBeLessThanOrEqual(90);
  });
  
  test('Concurrent writes do not corrupt data', async () => {
    const promises = [];
    
    for (let i = 0; i < 100; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          StorageManager.addActionCompleted({
            actionId: `act_${i}`,
            completedAt: Date.now(),
            clarityPointsEarned: 10,
          });
          resolve();
        })
      );
    }
    
    await Promise.all(promises);
    
    const actions = StorageManager.getActionsCompletedToday();
    expect(actions.length).toBe(100);
  });
});
```

### 7.2 Migration Tests
```typescript
describe('Schema Migrations', () => {
  test('v0 to v1 migration preserves data', () => {
    // Set up v0 data
    storage.set('user_clarity', 85);
    storage.set('schema_version', 0);
    
    // Run migration
    checkSchemaVersion();
    
    // Verify v1 data
    const clarity = StorageManager.getClarityScore();
    expect(clarity).toBe(85);
    
    // Verify old key removed
    const oldValue = storage.getNumber('user_clarity');
    expect(oldValue).toBeUndefined();
  });
});
```

---

## APPENDIX A: COMPLETE KEY REGISTRY
```typescript
// All storage keys used across app

export const ALL_STORAGE_KEYS = {
  
  // MMKV (Local Storage)
  LOCAL: {
    CLARITY_SCORE: 'clarity_score',
    SCREEN_TIME_TODAY: 'screen_time_today',
    ACTIONS_COMPLETED_TODAY: 'actions_completed_today',
    INTERVENTIONS_TODAY: 'interventions_today',
    USER_LEVEL: 'user_level',
    MONITORED_APPS: 'monitored_apps',
    DAILY_HISTORY: 'daily_history',
    ACTION_COMPLETION_HISTORY: 'action_completion_history',
    CONSCIOUS_DAYS_ARRAY: 'conscious_days_array',
    CURRENT_STREAK: 'current_streak',
    PEAK_STREAK: 'peak_streak',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    NOTIFICATIONS_ENABLED: 'notifications_enabled',
    HAPTICS_ENABLED: 'haptics_enabled',
    SCHEMA_VERSION: 'schema_version',
    LAST_SYNC_TIMESTAMP: 'last_sync_timestamp',
    APP_VERSION: 'app_version',
  },
  
  // App Group (Shared with Extensions)
  APP_GROUP: {
    CLARITY_SCORE: 'clarity_score',
    SCREEN_TIME_TODAY: 'screen_time_today',
    MONITORED_APPS: 'monitored_apps',
    USER_LEVEL: 'user_level',
    INTERVENTION_REQUESTED: 'intervention_requested',
    BLOCKED_APP: 'blocked_app',
    UNLOCK_TIMESTAMP: 'unlock_timestamp',
    EXTENSION_HEARTBEAT: 'extension_heartbeat',
  },
  
  // Firestore (Cloud)
  FIRESTORE: {
    USERS_COLLECTION: 'users',
    STATS_SUBCOLLECTION: 'stats',
  },
} as const;
```

---

## APPENDIX B: STORAGE SIZE ESTIMATES

| Data Type | Single Record Size | 90-Day Storage | Notes |
|-----------|-------------------|----------------|-------|
| DayRecord | ~200 bytes | ~18 KB | JSON-serialized |
| ActionHistory (20 actions) | ~100 bytes | ~10 KB | Lifetime stats |
| ScreenTimeToday | ~500 bytes | ~500 bytes | Current day only |
| Conscious Days Array | ~10 bytes/day | ~900 bytes | 90 dates |
| **Total Estimated** | — | **~30 KB** | Well under 100MB limit |

**Conclusion:** MMKV storage will never exceed 1 MB for 90 days of data. No concerns about storage limits.

---

**Document Status:** SCHEMA FINALIZED  
**Implementation Priority:** HIGH  
**Dependencies:** react-native-mmkv  
**Next Review:** Post-MVP (Week 8)

---
