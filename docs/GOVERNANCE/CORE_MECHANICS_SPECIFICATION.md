# CORE MECHANICS SPECIFICATION

**Status:** SEMI-LOCKED (System Logic)  
**Version:** 2.0 (Native iOS Edition)  
**Date:** January 3, 2026  
**Owner:** Lead Systems Architect

---

## OVERVIEW

This document defines the **four pillars** of Exit's behavioral intervention system. The logic and psychology remain unchanged, but all implementations now follow **Native iOS / Invisible Design** constraints.

**Design Mandate:** Every mechanic must feel like it was built by Apple. Use only system components, colors, and animations.

---

## PILLAR 1: THE INTERRUPT (Somatic Shield)

### **1.1 Core Principle**

**Interrupt autopilot BEFORE the dopamine loop starts.**

Traditional screen time apps block access (friction after the fact). Exit inserts a **physiological pause** at the moment of attempted access. The user must complete a physical action (breathing, movement) to proceed.

**Psychology:** The goal is not to prevent access—it's to force conscious decision-making. By requiring a 60-second breathing exercise, we break the automatic "open → scroll" reflex.

---

### **1.2 Trigger Conditions**

The Somatic Shield activates when:
```typescript
// Trigger Logic
const shouldShowShield = (
  isMonitoredApp: boolean,
  clarity: number,
  recentOpens: number
): boolean => {
  // Condition 1: App is user-selected for monitoring
  if (!isMonitoredApp) return false;
  
  // Condition 2: Clarity is below threshold (60%)
  if (clarity < 60) return true;
  
  // Condition 3: User opened this app 3+ times in last 30 minutes
  if (recentOpens >= 3) return true;
  
  return false;
};
```

**Example Scenarios:**

| Clarity | Recent Opens | Shield Triggers? | Reason |
|---------|--------------|------------------|---------|
| 85% | 1 | ❌ No | Above threshold, infrequent use |
| 55% | 1 | ✅ Yes | Below 60% clarity threshold |
| 70% | 4 | ✅ Yes | Doom loop detected (3+ opens) |
| 40% | 1 | ✅ Yes | Critical clarity level |

---

### **1.3 Shield UI Design (Native iOS)**

**Implementation:** Standard iOS modal presentation with system blur.
```typescript
// components/SomaticShield.tsx
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeButton } from '../components/NativeButton';
import { SFSymbol } from 'react-native-sfsymbols';

interface SomaticShieldProps {
  visible: boolean;
  clarity: number;
  onBeginAction: () => void;
  onDismiss: () => void;
}

export const SomaticShield: React.FC<SomaticShieldProps> = ({
  visible,
  clarity,
  onBeginAction,
  onDismiss,
}) => {
  const colors = useSystemColors();
  
  // Determine message based on clarity
  const getMessage = () => {
    if (clarity < 40) return {
      title: 'Critical Clarity',
      subtitle: 'Restore clarity to continue',
      color: colors.systemRed,
      icon: 'exclamationmark.triangle.fill',
    };
    if (clarity < 60) return {
      title: 'Low Clarity',
      subtitle: 'Take a moment to restore',
      color: colors.systemOrange,
      icon: 'exclamationmark.circle.fill',
    };
    return {
      title: 'Pattern Detected',
      subtitle: 'Frequent opens detected',
      color: colors.systemYellow,
      icon: 'arrow.clockwise.circle.fill',
    };
  };
  
  const message = getMessage();
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
      onRequestClose={onDismiss}
    >
      <BlurView
        intensity={80}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <SFSymbol
              name={message.icon}
              color={message.color}
              size={64}
            />
          </View>
          
          {/* Clarity Score */}
          <Text style={[typography.largeTitle, { color: message.color }]}>
            {clarity}%
          </Text>
          
          {/* Message */}
          <Text style={[typography.title2, { color: colors.label }]}>
            {message.title}
          </Text>
          <Text 
            style={[
              typography.body, 
              { color: colors.secondaryLabel, textAlign: 'center' }
            ]}
          >
            {message.subtitle}
          </Text>
          
          {/* Actions */}
          <View style={styles.buttons}>
            <NativeButton
              title="Restore Clarity"
              onPress={onBeginAction}
              variant="primary"
            />
            <NativeButton
              title="Dismiss"
              onPress={onDismiss}
              variant="secondary"
            />
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  iconContainer: {
    marginBottom: 8,
  },
  buttons: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
});
```

**Visual Flow:**
```
┌──────────────────────────────────────┐
│                                      │
│        🔺 (systemRed icon)           │
│                                      │
│              42%                     │
│         (largeTitle)                 │
│                                      │
│       Critical Clarity               │
│         (title2)                     │
│                                      │
│    Restore clarity to continue       │
│      (body, secondaryLabel)          │
│                                      │
│  ┌────────────────────────────────┐ │
│  │     Restore Clarity            │ │
│  │      (systemBlue button)       │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │         Dismiss                │ │
│  │  (secondarySystemFill button)  │ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

---

### **1.4 Intervention Types (MVP Phase)**

**Phase 1 (MVP): Breathing Only**
```json
{
  "id": "breathing_box",
  "name": "Box Breathing",
  "duration": 60,
  "pattern": "4-4-4-4",
  "clarityRestored": 5,
  "verification": "timer"
}
```

**Phase 2: Add Movement**
```json
{
  "id": "squats_10",
  "name": "10 Squats",
  "duration": 120,
  "clarityRestored": 10,
  "verification": "accelerometer"
}
```

---

### **1.5 Dismissal Limits**

**Rule:** User can dismiss shield **3 times per day**. After 3 dismissals, shield becomes mandatory.
```typescript
// Dismissal Logic
interface DismissalState {
  count: number;
  lastResetDate: string; // YYYY-MM-DD
}

const canDismiss = (state: DismissalState): boolean => {
  const today = new Date().toISOString().split('T')[0];
  
  // Reset counter if new day
  if (state.lastResetDate !== today) {
    return true; // Fresh day, allow dismissal
  }
  
  // Check if under limit
  return state.count < 3;
};

const handleDismiss = async (state: DismissalState) => {
  const today = new Date().toISOString().split('T')[0];
  
  if (state.lastResetDate !== today) {
    // New day, reset counter
    await StorageManager.set('dismissal_state', {
      count: 1,
      lastResetDate: today,
    });
  } else {
    // Increment counter
    await StorageManager.set('dismissal_state', {
      count: state.count + 1,
      lastResetDate: today,
    });
  }
  
  // If at limit, show warning
  if (state.count + 1 >= 3) {
    Alert.alert(
      'Final Dismissal',
      'This is your last dismissal for today. Next intervention will be required.',
      [{ text: 'OK', style: 'default' }]
    );
  }
};
```

---

## PILLAR 2: THE NEURAL CLARITY SYSTEM

### **2.1 Core Principle**

**Make entropy visible. Make clarity tangible.**

The user interface becomes a **mirror of attention state**. As clarity decreases, the UI becomes harder to read (blur + opacity). This creates **functional friction**—you literally cannot see your stats until you restore clarity.

**Psychology:** This is not punishment—it's physics. Cognitive entropy accumulates naturally. The UI reflects that reality.

---

### **2.2 The Clarity Formula**
```typescript
// Clarity Calculation Engine
class ClarityEngine {
  
  // Base formula
  static calculateClarity(
    screenTimeMinutes: number,
    actionsCompleted: number,
    currentClarity: number = 100
  ): number {
    // Entropy: Screen time reduces clarity
    const entropy = screenTimeMinutes * 0.5;
    
    // Restoration: Actions restore clarity
    const restoration = actionsCompleted * 10;
    
    // New clarity (clamped 0-100)
    const newClarity = Math.max(
      0, 
      Math.min(100, currentClarity - entropy + restoration)
    );
    
    return Math.round(newClarity);
  }
  
  // App-specific entropy rates
  static getEntropyRate(bundleId: string): number {
    const rates: Record<string, number> = {
      'com.zhiliaoapp.musically': 1.5,    // TikTok
      'com.instagram.instagram': 1.0,     // Instagram
      'com.facebook.Facebook': 1.0,       // Facebook
      'com.twitter.twitter': 0.8,         // Twitter/X
      'com.reddit.Reddit': 0.8,           // Reddit
      'com.google.ios.youtube': 0.5,      // YouTube
      'com.netflix.Netflix': 0.3,         // Netflix
    };
    
    return rates[bundleId] || 0.5; // Default rate
  }
  
  // Calculate entropy for specific app
  static calculateAppEntropy(
    bundleId: string,
    minutes: number
  ): number {
    const rate = this.getEntropyRate(bundleId);
    return minutes * 0.5 * rate;
  }
}
```

**Example Calculations:**
```typescript
// Scenario 1: User scrolls TikTok for 60 minutes
const entropy = ClarityEngine.calculateAppEntropy('com.zhiliaoapp.musically', 60);
// entropy = 60 * 0.5 * 1.5 = 45 points lost

// Scenario 2: User completes 3 breathing exercises
const restoration = 3 * 10; // 30 points restored

// Final clarity
const clarity = ClarityEngine.calculateClarity(60, 3, 100);
// clarity = 100 - 45 + 30 = 85%
```

---

### **2.3 Visual Degradation (Native iOS Blur)**

**Implementation:** UIBlurEffect intensity scales with clarity loss.
```typescript
// components/ClarityOverlay.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

interface ClarityOverlayProps {
  clarity: number; // 0-100
}

export const ClarityOverlay: React.FC<ClarityOverlayProps> = ({ clarity }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Map clarity (0-100) to opacity (0.0-0.5)
    const targetOpacity = (100 - clarity) / 100 * 0.5;
    
    // Animate opacity change (standard iOS timing)
    Animated.timing(opacityAnim, {
      toValue: targetOpacity,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [clarity]);
  
  // Map clarity to blur intensity (0-100)
  const blurIntensity = 100 - clarity;
  
  if (clarity >= 90) {
    // Near-perfect clarity: no overlay
    return null;
  }
  
  return (
    <View 
      style={styles.container}
      pointerEvents="none"
    >
      {/* System blur */}
      <BlurView
        intensity={blurIntensity}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFill}
      />
      
      {/* Opacity layer for additional degradation */}
      <Animated.View 
        style={[
          styles.opacityLayer,
          { opacity: opacityAnim }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  opacityLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000', // System black
  },
});
```

**Visual States:**

| Clarity Range | Blur Intensity | Opacity | User Experience |
|---------------|----------------|---------|-----------------|
| **90-100%** | 0-10 | 0.00-0.05 | Crystal clear |
| **70-89%** | 11-30 | 0.06-0.15 | Slight haze |
| **50-69%** | 31-50 | 0.16-0.25 | Moderate blur |
| **30-49%** | 51-70 | 0.26-0.35 | Heavy blur |
| **0-29%** | 71-100 | 0.36-0.50 | Nearly unreadable |

---

### **2.4 Restoration Animation (Native Fade)**

When user completes an action, the overlay fades away.
```typescript
// components/ClarityRestoreEffect.tsx
import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSystemColors } from '../theme/colors';
import * as Haptics from 'expo-haptics';

interface ClarityRestoreEffectProps {
  visible: boolean;
  pointsRestored: number;
  onComplete: () => void;
}

export const ClarityRestoreEffect: React.FC<ClarityRestoreEffectProps> = ({
  visible,
  pointsRestored,
  onComplete,
}) => {
  const colors = useSystemColors();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Success haptic (native iOS pattern)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Standard iOS fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(onComplete);
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: colors.systemGreen,
        },
      ]}
      pointerEvents="none"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## PILLAR 3: THE REPLACEMENT (Dopamine Menu)

### **3.1 Core Principle**

**Replace cheap dopamine (scrolling) with expensive dopamine (movement).**

When shield triggers, the user is presented with a menu of **offline micro-actions**. Each action has a clarity restoration value. The user chooses based on:
- Current energy level
- Time of day
- Context (home, work, outside)

**Psychology:** Choice creates agency. We're not forcing a specific action—we're offering tools. The user decides what feels right.

---

### **3.2 Action Database Schema**
```typescript
// types/MicroAction.ts
interface MicroAction {
  id: string;
  category: 'breathing' | 'movement' | 'hydration' | 'sensory' | 'social';
  energy: 'low' | 'medium' | 'high';
  duration: number; // minutes
  clarityPoints: number; // 1-30
  title: string;
  description: string;
  instruction: string;
  sfSymbol: string; // SF Symbol name
  proOnly: boolean;
  verification: 'timer' | 'accelerometer' | 'gps' | 'self_report';
  contextMatch?: ('home' | 'work' | 'outside' | 'transit')[];
}
```

**Example Actions:**
```json
[
  {
    "id": "breathing_box",
    "category": "breathing",
    "energy": "low",
    "duration": 1,
    "clarityPoints": 5,
    "title": "Box Breathing",
    "description": "4-4-4-4 pattern",
    "instruction": "Inhale 4s, hold 4s, exhale 4s, hold 4s",
    "sfSymbol": "waveform.circle.fill",
    "proOnly": false,
    "verification": "timer",
    "contextMatch": ["home", "work", "transit"]
  },
  {
    "id": "movement_squats",
    "category": "movement",
    "energy": "medium",
    "duration": 2,
    "clarityPoints": 10,
    "title": "10 Squats",
    "description": "Quick leg activation",
    "instruction": "Descend slowly, rise powerfully",
    "sfSymbol": "figure.strengthtraining.traditional",
    "proOnly": true,
    "verification": "accelerometer",
    "contextMatch": ["home"]
  }
]
```

---

### **3.3 Menu UI (Native iOS List)**

**Design:** Standard grouped table view with SF Symbol icons.
```typescript
// screens/ActionSelectionScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  SectionList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { SFSymbol } from 'react-native-sfsymbols';
import { MicroAction } from '../types';

interface ActionSelectionScreenProps {
  actions: MicroAction[];
  onSelect: (action: MicroAction) => void;
}

export const ActionSelectionScreen: React.FC<ActionSelectionScreenProps> = ({
  actions,
  onSelect,
}) => {
  const colors = useSystemColors();
  
  // Group actions by category
  const sections = [
    {
      title: 'Quick Actions (1-2 min)',
      data: actions.filter(a => a.duration <= 2),
    },
    {
      title: 'Standard Actions (3-10 min)',
      data: actions.filter(a => a.duration > 2 && a.duration <= 10),
    },
    {
      title: 'Deep Actions (10+ min)',
      data: actions.filter(a => a.duration > 10),
    },
  ].filter(section => section.data.length > 0);
  
  const renderItem = ({ item }: { item: MicroAction }) => (
    <TouchableOpacity
      style={[
        styles.cell,
        { 
          backgroundColor: colors.secondarySystemGroupedBackground,
          borderBottomColor: colors.separator,
        },
      ]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <SFSymbol
          name={item.sfSymbol}
          color={colors.systemBlue}
          size={24}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[typography.body, { color: colors.label }]}>
          {item.title}
        </Text>
        <Text style={[typography.caption1, { color: colors.secondaryLabel }]}>
          {item.description} • {item.duration} min
        </Text>
      </View>
      
      <Text style={[typography.footnote, { color: colors.systemGreen }]}>
        +{item.clarityPoints}
      </Text>
    </TouchableOpacity>
  );
  
  const renderSectionHeader = ({ section: { title } }: any) => (
    <View 
      style={[
        styles.sectionHeader,
        { backgroundColor: colors.systemGroupedBackground }
      ]}
    >
      <Text style={[typography.footnote, { color: colors.secondaryLabel }]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
```

---

### **3.4 Smart Recommendation Engine**
```typescript
// utils/ActionRecommender.ts
class ActionRecommender {
  
  static recommend(
    actions: MicroAction[],
    context: {
      clarity: number;
      timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      location: 'home' | 'work' | 'outside' | 'transit';
      userEnergy: 'low' | 'medium' | 'high';
      isPro: boolean;
    },
    limit: number = 5
  ): MicroAction[] {
    
    // Filter by Pro status
    let candidates = actions.filter(a => !a.proOnly || context.isPro);
    
    // Filter by energy level
    candidates = candidates.filter(a => a.energy === context.userEnergy);
    
    // Filter by context (if action specifies)
    candidates = candidates.filter(a => 
      !a.contextMatch || a.contextMatch.includes(context.location)
    );
    
    // If clarity is critical (<40), prioritize high-impact actions
    if (context.clarity < 40) {
      candidates.sort((a, b) => b.clarityPoints - a.clarityPoints);
    }
    
    // Time-based weighting
    const timeWeights: Record<string, string[]> = {
      morning: ['movement', 'hydration'],
      afternoon: ['movement', 'social'],
      evening: ['breathing', 'sensory'],
      night: ['breathing', 'sensory'],
    };
    
    const preferredCategories = timeWeights[context.timeOfDay];
    candidates.sort((a, b) => {
      const aMatch = preferredCategories.includes(a.category) ? -1 : 0;
      const bMatch = preferredCategories.includes(b.category) ? -1 : 0;
      return aMatch - bMatch;
    });
    
    return candidates.slice(0, limit);
  }
}
```

---

## PILLAR 4: THE PROGRESSION (Levels of Consciousness)

### **4.1 Core Principle**

**Progression shows growth. Levels show mastery.**

Users advance through 5 consciousness levels based on **monthly behavior**:
1. The NPC (Autopilot)
2. The Glitch (Awareness Building)
3. The Hacker (Active Regulation)
4. The Main Character (Intentional Presence)
5. The Oracle (Mastery)

**Psychology:** Levels are aspirational, not punitive. Downgrading is framed as "signal drift" (temporary), not failure.

---

### **4.2 Level Definitions**
```typescript
// types/Level.ts
interface Level {
  id: string;
  name: string;
  description: string;
  sfSymbol: string;
  thresholds: {
    avgScreenTime: number; // minutes per day
    consciousDaysPerMonth: number;
    minClarity: number; // average clarity %
  };
  perks: string[];
}

const LEVELS: Level[] = [
  {
    id: 'npc',
    name: 'The NPC',
    description: 'Autopilot mode. Building awareness.',
    sfSymbol: 'person.fill.questionmark',
    thresholds: {
      avgScreenTime: 240, // 4h
      consciousDaysPerMonth: 0,
      minClarity: 0,
    },
    perks: [
      'Basic breathing exercises',
      'Water reminders',
      'Clarity tracking',
    ],
  },
  {
    id: 'glitch',
    name: 'The Glitch',
    description: 'Disrupting patterns. Awareness growing.',
    sfSymbol: 'bolt.fill',
    thresholds: {
      avgScreenTime: 180, // 3h
      consciousDaysPerMonth: 5,
      minClarity: 60,
    },
    perks: [
      'All NPC perks',
      'Movement actions unlocked',
      'Weekly insights',
    ],
  },
  {
    id: 'hacker',
    name: 'The Hacker',
    description: 'Reclaiming control. Active regulation.',
    sfSymbol: 'chevron.left.forwardslash.chevron.right',
    thresholds: {
      avgScreenTime: 120, // 2h
      consciousDaysPerMonth: 10,
      minClarity: 70,
    },
    perks: [
      'All Glitch perks',
      'Deep actions unlocked',
      'Custom reminders',
    ],
  },
  {
    id: 'main_character',
    name: 'The Main Character',
    description: 'Intentional presence. Mastery emerging.',
    sfSymbol: 'star.fill',
    thresholds: {
      avgScreenTime: 90, // 1.5h
      consciousDaysPerMonth: 15,
      minClarity: 80,
    },
    perks: [
      'All Hacker perks',
      'Priority support',
      'Beta features',
    ],
  },
  {
    id: 'oracle',
    name: 'The Oracle',
    description: 'Sovereign attention. Guiding others.',
    sfSymbol: 'eye.fill',
    thresholds: {
      avgScreenTime: 60, // 1h
      consciousDaysPerMonth: 20,
      minClarity: 85,
    },
    perks: [
      'All Main Character perks',
      'Mentor features',
      'Custom actions',
    ],
  },
];
```

---

### **4.3 Level Evaluation (Monthly)**
```typescript
// utils/LevelEvaluator.ts
class LevelEvaluator {
  
  static evaluateLevel(stats: MonthlyStats): Level {
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
    
    // Default to NPC
    return LEVELS[0];
  }
  
  static shouldUpgrade(
    currentLevel: Level,
    stats: MonthlyStats
  ): { upgrade: boolean; newLevel?: Level } {
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
  }
}
```

---

### **4.4 Level Transition UI (Native iOS)**
```typescript
// components/LevelTransition.tsx
import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { SFSymbol } from 'react-native-sfsymbols';
import { NativeButton } from './NativeButton';
import * as Haptics from 'expo-haptics';

interface LevelTransitionProps {
  visible: boolean;
  oldLevel: Level;
  newLevel: Level;
  isUpgrade: boolean;
  onDismiss: () => void;
}

export const LevelTransition: React.FC<LevelTransitionProps> = ({
  visible,
  oldLevel,
  newLevel,
  isUpgrade,
  onDismiss,
}) => {
  const colors = useSystemColors();
  
  React.useEffect(() => {
    if (visible) {
      // Celebration haptic for upgrade, gentle for downgrade
      if (isUpgrade) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [visible, isUpgrade]);
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent
    >
      <BlurView
        intensity={80}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFill}
      >
        <View style={styles.container}>
          <SFSymbol
            name={newLevel.sfSymbol}
            color={isUpgrade ? colors.systemGreen : colors.systemOrange}
            size={80}
          />
          
          <Text style={[typography.largeTitle, { color: colors.label }]}>
            {isUpgrade ? 'Level Up' : 'Level Adjusted'}
          </Text>
          
          <Text style={[typography.title2, { color: colors.label }]}>
            {newLevel.name}
          </Text>
          
          <Text 
            style={[
              typography.body,
              { color: colors.secondaryLabel, textAlign: 'center' }
            ]}
          >
            {newLevel.description}
          </Text>
          
          {isUpgrade && (
            <View style={styles.perks}>
              <Text style={[typography.headline, { color: colors.label }]}>
                New Perks Unlocked
              </Text>
              {newLevel.perks.map((perk, i) => (
                <Text 
                  key={i}
                  style={[typography.callout, { color: colors.secondaryLabel }]}
                >
                  • {perk}
                </Text>
              ))}
            </View>
          )}
          
          <NativeButton
            title="Continue"
            onPress={onDismiss}
            variant="primary"
          />
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  perks: {
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
  },
});
```

---

## CONSCIOUS DAY LOGIC

### **Definition**

A "Conscious Day" is achieved when the user demonstrates intentional phone use:
```typescript
// utils/ConsciousDayEvaluator.ts
interface DayStats {
  interventionsAccepted: number;
  screenTimeMinutes: number;
  finalClarity: number;
  dismissalCount: number;
}

const isConsciousDay = (stats: DayStats, userLevel: Level): boolean => {
  // Must accept at least 3 interventions
  if (stats.interventionsAccepted < 3) return false;
  
  // Must stay below level's screen time threshold
  if (stats.screenTimeMinutes > userLevel.thresholds.avgScreenTime) return false;
  
  // Must maintain clarity above 60%
  if (stats.finalClarity < 60) return false;
  
  // Must not exceed dismissal limit
  if (stats.dismissalCount >= 3) return false;
  
  return true;
};
```

---
**Document Status:** READY FOR DEVELOPMENT  
**Version:** 2.0 (Native iOS Edition)  
**Last Updated:** January 3, 2026  
**Next Document:** MVP Feature Set (Native iOS Scope)

---
