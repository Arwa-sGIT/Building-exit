# Product Requirements Document (PRD): Project "Exit"
**Version:** 17.0 (Native iOS Edition - Production Ready)  
**Status:** Ready for Development  
**Date:** January 3, 2026  
**Owner:** Head of Product / Lead Architect  
**Target Market:** France (Launch), Global (Phase 2)  
**Core Philosophy:** "Maintenance, not Debt. Clearing the Static."  
**Design Mandate:** Native iOS / Invisible Design

---

## EXECUTIVE SUMMARY

Exit is a premium iOS application that reframes digital wellbeing from moral failure to **neural hygiene**. Unlike competitors who position screen time as "debt" that creates shame, Exit positions it as **neural static**—cognitive entropy that naturally accumulates and must be cleared through positive offline actions.

**The Paradigm Shift:**

| Traditional Apps | Exit's Innovation |
|-----------------|-------------------|
| "You failed again" (Shame) | "Time to clean up" (Maintenance) |
| Binary: Good day vs. Bad day | Gradient: Clarity Level (0-100%) |
| Punishment-based friction | Reward-based restoration |
| Virtual rewards (trees) | Physical regulation (nervous system) |

**Strategic Positioning:**

| Competitor | Value Proposition | Exit's Advantage |
|------------|------------------|------------------|
| **Opal/Freedom** | Productivity (Work Focus) | **Clarity** (Neural Hygiene) |
| **One Sec** | Mindfulness (Waiting) | **Mobilization** (Active Cleaning) |
| **Forest** | Virtual Trees | **Real Nervous System Regulation** |

**Design Philosophy:**

Exit looks and feels like it was built by Apple. We use **only** native iOS components, system colors, San Francisco font, and standard UIKit/SwiftUI patterns. First-time users should not be able to distinguish it from Screen Time, Health, or other system apps.

**The Opportunity:** Gen Z & Millennials experience "Functional Freeze"—knowing they should stop scrolling but physically unable due to dopamine/cortisol loops. Exit monetizes the transition from Freeze → Mobilization through **physiological friction** (breathing, movement) while maintaining the **trust and familiarity** of native iOS design.

---

## SECTION 1: THE NEURAL CLARITY MECHANIC

### **1.1 The Core Metaphor**

**The Problem:**  
Every minute spent scrolling social media adds **neural static**—cognitive noise that makes it harder to think clearly, make decisions, or feel present.

**The Solution:**  
Exit visualizes this static in real-time and provides **cleaning tools** (physical actions) to restore clarity.

**The Metaphor:**
```
Scrolling = Getting your glasses dirty
Physical Actions = Wiping them clean
```

You don't wipe your glasses because you're "in debt" to dirt. You wipe them to **maintain visibility**.

---

### **1.2 The Noise Accumulation Formula**

#### **Algorithm: How Noise is Calculated**
```typescript
// The Neural Static Formula
const calculateClarity = (screenTimeMinutes: number, actionsCompleted: number): number => {
  // Base entropy from scrolling
  const entropy = screenTimeMinutes * 0.5;
  
  // Restoration from actions
  const restoration = actionsCompleted * 10; // Each action = 10 points
  
  // Final clarity score (capped at 0-100)
  const clarity = Math.max(0, Math.min(100, 100 - entropy + restoration));
  
  return Math.round(clarity);
}

// Example Scenarios:
// 1. User scrolls for 60 mins, no actions
//    Clarity = 100 - (60 * 0.5) = 70%
//
// 2. User scrolls for 120 mins (2 hours), no actions
//    Clarity = 100 - (120 * 0.5) = 40%
//
// 3. User scrolls for 120 mins, then completes 3 actions
//    Clarity = 100 - (120 * 0.5) + (3 * 10) = 70%
//
// 4. User scrolls for 60 mins, completes 5 actions
//    Clarity = 100 - (60 * 0.5) + (5 * 10) = 100% (capped)
```

#### **App-Specific Entropy Rates**

Different apps have different "dopamine variance" and thus accumulate entropy at different rates:
```typescript
const ENTROPY_RATES: Record<string, number> = {
  // High dopamine variance (unpredictable reward)
  'com.zhiliaoapp.musically': 1.5,        // TikTok
  'com.instagram.instagram': 1.0,         // Instagram
  'com.facebook.Facebook': 1.0,           // Facebook
  
  // Medium dopamine variance
  'com.twitter.twitter': 0.8,             // Twitter/X
  'com.reddit.Reddit': 0.8,               // Reddit
  
  // Low dopamine variance (passive consumption)
  'com.google.ios.youtube': 0.5,          // YouTube
  'com.netflix.Netflix': 0.3,             // Netflix
  
  // Default for unknown apps
  'default': 0.5,
};

// Calculate entropy per app
const getEntropyRateForApp = (bundleId: string): number => {
  return ENTROPY_RATES[bundleId] || ENTROPY_RATES['default'];
};
```

---

### **1.3 Visual Consequences: Native iOS Blur System**

**Design Constraint:** We use ONLY native iOS blur effects and system opacity. No custom shaders, no Skia, no complex visual effects.

#### **Implementation: UIBlurEffect + Opacity Overlay**
```typescript
// components/StaticOverlay.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

interface StaticOverlayProps {
  clarity: number; // 0-100
}

export const StaticOverlay: React.FC<StaticOverlayProps> = ({ clarity }) => {
  // Map clarity (0-100) to overlay opacity (0.0-0.5)
  // Lower clarity = higher opacity
  const opacity = (100 - clarity) / 100 * 0.5;
  
  // Map clarity to blur intensity (0-100)
  // Lower clarity = more blur
  const blurIntensity = (100 - clarity);
  
  if (clarity >= 90) {
    // Near-perfect clarity: no overlay needed
    return null;
  }
  
  return (
    <View 
      style={styles.container}
      pointerEvents="none" // Don't block touch events
    >
      {/* System blur effect */}
      <BlurView
        intensity={blurIntensity}
        tint="systemChromeMaterialDark"
        style={StyleSheet.absoluteFill}
      />
      
      {/* Opacity overlay for additional degradation */}
      <View 
        style={[
          styles.opacityLayer,
          { opacity }
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

#### **Visual State Progression (Native iOS)**

| Clarity | Visual State | Blur Intensity | Opacity | User Experience |
|---------|--------------|----------------|---------|-----------------|
| **90-100%** | Crystal Clear | 0 | 0.0 | Perfect visibility |
| **70-89%** | Slight Haze | 20 | 0.1 | Minimal interference |
| **50-69%** | Moderate Blur | 40 | 0.2 | Noticeable degradation |
| **30-49%** | Heavy Blur | 60 | 0.3 | Difficult to read |
| **0-29%** | Critical | 80 | 0.4 | Barely usable |

**Critical UX Principle:** The user **literally cannot see their stats clearly** until they restore clarity. This creates **functional friction** through native iOS blur APIs—no custom visual effects needed.

---

### **1.4 The "Restore" Animation: Native Fade Transition**

When a user completes an action, the static overlay fades away using standard iOS animation timing.

#### **Implementation: UIView.animate() Pattern**
```typescript
// components/RestoreAnimation.tsx
import React, { useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface RestoreAnimationProps {
  visible: boolean;
  clarityRestored: number; // How much clarity was restored (e.g., 10%)
  onComplete: () => void;
}

export const RestoreAnimation: React.FC<RestoreAnimationProps> = ({
  visible,
  clarityRestored,
  onComplete,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Success haptic (native pattern)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Standard iOS fade animation (0.3s default)
      Animated.sequence([
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        // Hold
        Animated.delay(300),
        // Fade out
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete();
      });
    }
  }, [visible]);
  
  if (!visible) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          backgroundColor: 'rgba(52, 199, 89, 0.9)', // systemGreen with transparency
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

**Usage Example:**
```typescript
// screens/ActionCompletionScreen.tsx
const [showRestore, setShowRestore] = useState(false);

const handleActionComplete = async (action: MicroAction) => {
  // Restore clarity
  await restoreClarity(action.clarityPoints);
  
  // Trigger restore animation
  setShowRestore(true);
};

return (
  <>
    <BreathingExercise />
    <RestoreAnimation
      visible={showRestore}
      clarityRestored={10}
      onComplete={() => {
        setShowRestore(false);
        router.back();
      }}
    />
  </>
);
```

---

## SECTION 2: NATIVE iOS DESIGN SYSTEM

### **2.1 Design Philosophy: Invisible Design**

Exit adopts **100% native iOS patterns**. Every component, color, font, and animation uses system APIs. The goal: users cannot distinguish Exit from Screen Time, Health, or other Apple apps.

**Key Principles:**
- **Trust Through Familiarity:** System design = instant credibility
- **Zero Learning Curve:** Users already know how to use these patterns
- **Performance:** Native components are GPU-optimized by Apple
- **Accessibility:** System components have built-in VoiceOver support

---

### **2.2 Typography System (San Francisco Only)**
```typescript
// theme/typography.ts
import { StyleSheet } from 'react-native';

export const typography = StyleSheet.create({
  // Large Title (iOS standard)
  largeTitle: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
  },
  
  // Title 1
  title1: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.36,
  },
  
  // Title 2
  title2: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.35,
  },
  
  // Title 3
  title3: {
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.38,
  },
  
  // Headline
  headline: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  
  // Body
  body: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.41,
  },
  
  // Callout
  callout: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.32,
  },
  
  // Subhead
  subhead: {
    fontFamily: 'System',
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: -0.24,
  },
  
  // Footnote
  footnote: {
    fontFamily: 'System',
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.08,
  },
  
  // Caption 1
  caption1: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
  },
  
  // Caption 2
  caption2: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.07,
  },
});
```

---

### **2.3 Color System (iOS Dynamic Colors)**
```typescript
// theme/colors.ts
import { useColorScheme } from 'react-native';

// System colors adapt to Light/Dark mode automatically
export const useSystemColors = () => {
  const scheme = useColorScheme();
  
  return {
    // Labels (Text)
    label: scheme === 'dark' ? '#FFFFFF' : '#000000',
    secondaryLabel: scheme === 'dark' ? '#EBEBF599' : '#3C3C4399',
    tertiaryLabel: scheme === 'dark' ? '#EBEBF54D' : '#3C3C434D',
    quaternaryLabel: scheme === 'dark' ? '#EBEBF52D' : '#3C3C432D',
    
    // Backgrounds
    systemBackground: scheme === 'dark' ? '#000000' : '#FFFFFF',
    secondarySystemBackground: scheme === 'dark' ? '#1C1C1E' : '#F2F2F7',
    tertiarySystemBackground: scheme === 'dark' ? '#2C2C2E' : '#FFFFFF',
    
    // Grouped Backgrounds (for lists)
    systemGroupedBackground: scheme === 'dark' ? '#000000' : '#F2F2F7',
    secondarySystemGroupedBackground: scheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
    tertiarySystemGroupedBackground: scheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
    
    // System Colors
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemIndigo: '#5856D6',
    systemOrange: '#FF9500',
    systemPink: '#FF2D55',
    systemPurple: '#AF52DE',
    systemRed: '#FF3B30',
    systemTeal: '#5AC8FA',
    systemYellow: '#FFCC00',
    systemGray: '#8E8E93',
    
    // Semantic Colors for Exit
    clarity: '#34C759',      // systemGreen (high clarity)
    warning: '#FF9500',      // systemOrange (medium clarity)
    critical: '#FF3B30',     // systemRed (low clarity)
    
    // Fills (for components)
    systemFill: scheme === 'dark' ? '#78788033' : '#78788033',
    secondarySystemFill: scheme === 'dark' ? '#78788028' : '#78788028',
    tertiarySystemFill: scheme === 'dark' ? '#7676801E' : '#7676801E',
    quaternarySystemFill: scheme === 'dark' ? '#74748014' : '#74748014',
    
    // Separators
    separator: scheme === 'dark' ? '#54545899' : '#3C3C4349',
    opaqueSeparator: scheme === 'dark' ? '#38383A' : '#C6C6C8',
  };
};
```

---

### **2.4 Standard Component Library**
```typescript
// components/NativeCard.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSystemColors } from '../theme/colors';

interface NativeCardProps {
  children: React.ReactNode;
  style?: any;
}

export const NativeCard: React.FC<NativeCardProps> = ({ children, style }) => {
  const colors = useSystemColors();
  
  return (
    <View 
      style={[
        styles.card,
        {
          backgroundColor: colors.secondarySystemGroupedBackground,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10, // iOS standard corner radius
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
```
```typescript
// components/NativeButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';

interface NativeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
}

export const NativeButton: React.FC<NativeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const colors = useSystemColors();
  
  const backgroundColor = {
    primary: colors.systemBlue,
    secondary: colors.secondarySystemFill,
    destructive: colors.systemRed,
  }[variant];
  
  const textColor = {
    primary: '#FFFFFF',
    secondary: colors.label,
    destructive: '#FFFFFF',
  }[variant];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          typography.headline,
          { color: textColor },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50, // iOS standard touch target
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  disabled: {
    opacity: 0.3,
  },
});
```

---

### **2.5 Standard Spacing & Layout**
```typescript
// theme/spacing.ts

// iOS uses an 8pt grid system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Standard iOS margins
export const margins = {
  screen: 16,      // Edge-to-edge content margin
  card: 16,        // Card internal padding
  section: 24,     // Section spacing
};

// Standard iOS component heights
export const heights = {
  touchTarget: 44,  // Minimum touch target (Apple HIG)
  button: 50,       // Standard button height
  cell: 44,         // Table view cell height
  header: 28,       // Section header height
  navigationBar: 44, // Navigation bar height
  tabBar: 49,       // Tab bar height
};
```

---

## SECTION 3: THE DOPAMINE MENU (POSITIVE ACCOUNTABILITY)

### **3.1 Philosophical Reframe**

**Traditional Framing:**
- "You must pay back screen time debt"
- "Complete this punishment to unlock"
- Focus: What you did wrong

**Exit's Framing:**
- "Here are tools to restore your clarity"
- "Choose an action that feels right now"
- Focus: What feels good to do

The Dopamine Menu is a **reward**, not a punishment. Users don't feel coerced; they feel empowered.

---

### **3.2 Micro-Actions Database**
```json
// data/microActions.json
[
  {
    "id": "ma_001",
    "category": "breathing",
    "energy": "low",
    "duration": 1,
    "clarityPoints": 5,
    "title": "Box Breathing",
    "description": "4-4-4-4 breathing pattern",
    "instruction": "Inhale 4s, hold 4s, exhale 4s, hold 4s",
    "sfSymbol": "waveform.circle.fill",
    "proOnly": false
  },
  {
    "id": "ma_002",
    "category": "movement",
    "energy": "medium",
    "duration": 2,
    "clarityPoints": 10,
    "title": "10 Squats",
    "description": "Quick leg activation",
    "instruction": "Descend slowly, rise powerfully",
    "sfSymbol": "figure.strengthtraining.traditional",
    "proOnly": true
  },
  {
    "id": "ma_003",
    "category": "movement",
    "energy": "high",
    "duration": 3,
    "clarityPoints": 15,
    "title": "20 Push-ups",
    "description": "Upper body reset",
    "instruction": "Keep body straight, descend to floor",
    "sfSymbol": "figure.core.training",
    "proOnly": true
  },
  {
    "id": "ma_004",
    "category": "movement",
    "energy": "high",
    "duration": 10,
    "clarityPoints": 20,
    "title": "Walk 500 Steps",
    "description": "Get outside and move",
    "instruction": "Step outside, breathe fresh air",
    "sfSymbol": "figure.walk",
    "proOnly": true
  },
  {
    "id": "ma_005",
    "category": "hydration",
    "energy": "low",
    "duration": 0.5,
    "clarityPoints": 3,
    "title": "Drink Water",
    "description": "One glass (250ml)",
    "instruction": "Drink slowly, feel the hydration",
    "sfSymbol": "drop.fill",
    "proOnly": false
  },
  {
    "id": "ma_006",
    "category": "sensory",
    "energy": "medium",
    "duration": 5,
    "clarityPoints": 30,
    "title": "Cold Shower (5 min)",
    "description": "Complete nervous system reset",
    "instruction": "Start warm, end cold",
    "sfSymbol": "snowflake",
    "proOnly": true
  },
  {
    "id": "ma_007",
    "category": "sensory",
    "energy": "low",
    "duration": 10,
    "clarityPoints": 8,
    "title": "Brown Noise (10 min)",
    "description": "Soothing low-frequency audio",
    "instruction": "Lie down, close eyes, listen",
    "sfSymbol": "waveform",
    "proOnly": false
  },
  {
    "id": "ma_008",
    "category": "social",
    "energy": "medium",
    "duration": 5,
    "clarityPoints": 12,
    "title": "Call a Friend",
    "description": "Real connection, not digital",
    "instruction": "Voice call, minimum 5 minutes",
    "sfSymbol": "phone.fill",
    "proOnly": true
  }
]
```

---

### **3.3 Native List Interface (Replaces "Spin the Wheel")**

The Dopamine Menu is presented as a **standard iOS grouped table view** with SF Symbol icons. Clean, familiar, fast.

#### **Implementation: UITableView Pattern**
```typescript
// screens/DopamineMenuScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { SFSymbol } from 'react-native-sfsymbols';
import { MicroAction } from '../types';
import { useProStatus } from '../hooks/useProStatus';

interface DopamineMenuScreenProps {
  actions: MicroAction[];
  onSelect: (action: MicroAction) => void;
}

export const DopamineMenuScreen: React.FC<DopamineMenuScreenProps> = ({
  actions,
  onSelect,
}) => {
  const colors = useSystemColors();
  const { isPro } = useProStatus();
  
  const renderAction = ({ item }: { item: MicroAction }) => {
    const isLocked = item.proOnly && !isPro;
    
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          { 
            backgroundColor: colors.secondarySystemGroupedBackground,
            borderBottomColor: colors.separator,
          },
        ]}
        onPress={() => !isLocked && onSelect(item)}
        disabled={isLocked}
        activeOpacity={0.7}
      >
        {/* SF Symbol Icon */}
        <View style={styles.iconContainer}>
          <SFSymbol
            name={item.sfSymbol}
            color={isLocked ? colors.tertiaryLabel : colors.systemBlue}
            size={24}
          />
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text 
            style={[
              typography.body,
              { color: isLocked ? colors.tertiaryLabel : colors.label },
            ]}
          >
            {item.title}
          </Text>
          <Text 
            style={[
              typography.caption1,
              { color: colors.secondaryLabel },
            ]}
          >
            {item.description} • {item.duration} min
          </Text>
        </View>
        
        {/* Clarity Points */}
        <View style={styles.trailing}>
          <Text 
            style={[
              typography.footnote,
              { color: colors.systemGreen },
            ]}
          >
            +{item.clarityPoints}
          </Text>
          {isLocked && (
            <SFSymbol
              name="lock.fill"
              color={colors.tertiaryLabel}
              size={16}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}>
      <FlatList
        data={actions}
        renderItem={renderAction}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[typography.largeTitle, { color: colors.label }]}>
              Restore Clarity
            </Text>
            <Text style={[typography.callout, { color: colors.secondaryLabel }]}>
              Choose an action to restore your clarity
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
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
  trailing: {
    alignItems: 'flex-end',
    gap: 4,
  },
});
```

---

### **3.4 Context-Aware Recommendations**

The app suggests actions based on:
- **Time of day** (morning = high energy, night = low energy)
- **Current clarity** (low clarity = high-impact actions)
- **Recent actions** (diversity to prevent boredom)
- **Pro status** (free users see limited options)
```typescript
// utils/MicroActionRecommender.ts
interface RecommendationContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  clarity: number;
  userEnergy: 'low' | 'medium' | 'high';
  recentCategories: string[];
  isPro: boolean;
}

export class MicroActionRecommender {
  static getRecommendations(
    context: RecommendationContext,
    count: number = 5
  ): MicroAction[] {
    // Filter by Pro status
    let candidates = microActions.filter(
      (action) => !action.proOnly || context.isPro
    );
    
    // Filter by energy level
    candidates = candidates.filter(
      (action) => action.energy === context.userEnergy
    );
    
    // CRITICAL: If clarity is low, prioritize high-impact actions
    if (context.clarity <= 40) {
      candidates = candidates.filter(
        (action) => action.clarityPoints >= 15
      );
    }
    
    // Diversity: Deprioritize recently used categories
    candidates.sort((a, b) => {
      const aRecent = context.recentCategories.includes(a.category) ? 1 : 0;
      const bRecent = context.recentCategories.includes(b.category) ? 1 : 0;
      return aRecent - bRecent;
    });
    
    // Time-based filtering
    const timeWeights: Record<string, string[]> = {
      morning: ['movement', 'hydration'],
      afternoon: ['movement', 'social'],
      evening: ['breathing', 'sensory'],
      night: ['breathing', 'sensory'],
    };
    
    // Boost actions that match time of day
    candidates.sort((a, b) => {
      const aMatch = timeWeights[context.timeOfDay].includes(a.category) ? -1 : 0;
      const bMatch = timeWeights[context.timeOfDay].includes(b.category) ? -1 : 0;
      return aMatch - bMatch;
    });
    
    return candidates.slice(0, count);
  }
}
```

---

## SECTION 4: THE 3-PHASE ROLLOUT STRATEGY

### **Phase 1: Alpha (Internal Testing - Weeks 1-4)**

**Goal:** Validate core mechanics with internal team (10-20 people).

**Features:**
- ✅ Somatic Shield (Breathing only)
- ✅ Basic blur visualization (native UIBlurEffect)
- ✅ Native iOS dashboard design
- ✅ Onboarding flow
- ✅ Manual action logging (no sensor detection yet)

**Success Criteria:**
- Shield appears < 200ms after opening blocked app
- Clarity formula feels intuitive (60 mins = 70% clarity)
- Blur transitions smoothly (no janky animations)
- Zero crashes in 7-day usage
- Beta testers say "This looks like Apple made it"

**Deliverables:**
- Internal TestFlight build
- Feedback form (Google Forms)
- Video walkthrough for team

---

### **Phase 2: Beta (TestFlight - Weeks 5-10)**

**Goal:** Test with real users in France (1,000 users).

**Features:**
- ✅ All Phase 1 features
- ✅ Squat Detection (Accelerometer + Deep Link Hack)
- ✅ Dopamine Menu (8 actions minimum)
- ✅ Native list UI (standard UITableView)
- ✅ Push Notifications:
  - "Morning Check" (9 AM): "How's your clarity today?"
  - "Low Clarity Alert": "Clarity at 35%. Time to restore."
- ✅ In-App Support (Intercom or Crisp chat)
- ✅ Basic analytics (Firebase)

**Success Criteria:**
- Day-7 retention > 50%
- Average 3 actions per day per active user
- < 5% uninstall rate
- NPS > 40
- Qualitative: "Feels native" feedback

**User Acquisition:**
- ProductHunt launch (France-specific)
- Reddit r/nosurf community
- Instagram ads targeting France (Gen Z)

**Deliverables:**
- Public TestFlight link
- Feedback loop (in-app + email)
- Weekly metrics dashboard

---

### **Phase 3: Launch (App Store - Weeks 11-16)**

**Goal:** Full public launch in France with monetization.

**Features:**
- ✅ All Phase 2 features
- ✅ **Founding Member Paywall** (RevenueCat):
  - Free: Breathing + Water (5-8 clarity points)
  - Pro: All actions (up to 30 clarity points)
  - Pricing: €9.99/month, €59.99/year (save 50%)
- ✅ **Clarity Circle** (optional social):
  - Invite friends
  - See group average clarity
  - Supportive rankings (not competitive)
- ✅ **Smart Ratings Prompt**:
  - Trigger after 3 successful restorations
  - "You're restoring clarity. Help others discover Exit."

**Success Criteria:**
- 10,000 downloads in first month
- 5% conversion to Pro (500 paid users)
- Day-30 retention > 40%
- NPS > 50
- App Store rating 4.5+

**Marketing:**
- PR: TechCrunch, The Verge coverage
- Influencers: French wellness/productivity creators
- Content: "How I quit TikTok" testimonials

**Deliverables:**
- App Store submission with Family Controls justification
- Localized App Store screenshots + video
- Press kit + media outreach

---

## SECTION 5: TECHNICAL SPECIFICATIONS (iOS FIRST)

### **5.1 iOS Extensions (FamilyControls)**

Exit requires **three native iOS app extensions**:

1. **DeviceActivityMonitor** - Tracks usage thresholds
2. **ShieldConfiguration** - Custom shield UI
3. **ShieldAction** - Handle shield button taps

#### **ShieldConfiguration Extension (Native iOS Colors)**
```swift
// ShieldConfigurationExtension/ExitShieldConfig.swift
import ManagedSettings
import ManagedSettingsUI
import DeviceActivity
import UIKit

class ExitShieldConfigurationDataSource: ShieldConfigurationDataSource {
    let appGroup = "group.com.exit.app"
    
    override func configuration(
        shielding application: Application
    ) -> ShieldConfiguration {
        let defaults = UserDefaults(suiteName: appGroup)
        let clarity = defaults?.integer(forKey: "clarity_score") ?? 100
        let completedAt = defaults?.double(forKey: "last_action_completed") ?? 0
        let now = Date().timeIntervalSince1970
        
        // If action completed within 60 seconds, allow access
        if now - completedAt < 60 {
            return ShieldConfiguration(
                backgroundBlurStyle: .systemChromeMaterialLight,
                backgroundColor: UIColor.systemGreen,
                title: ShieldConfiguration.Label(
                    text: "Clarity Restored ✓",
                    color: .white
                ),
                subtitle: ShieldConfiguration.Label(
                    text: "You have 60 seconds",
                    color: .white
                )
            )
        }
        
        // Show intervention prompt with current clarity
        let titleColor: UIColor = clarity < 40 ? .systemRed : .systemOrange
        
        return ShieldConfiguration(
            backgroundBlurStyle: .systemChromeMaterialDark,
            backgroundColor: UIColor.systemBackground,
            title: ShieldConfiguration.Label(
                text: "Clarity: \(clarity)%",
                color: titleColor
            ),
            subtitle: ShieldConfiguration.Label(
                text: "Restore your clarity to continue",
                color: .label
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Restore Clarity",
                color: .white
            ),
            primaryButtonBackgroundColor: UIColor.systemBlue
        )
    }
}
```

---

### **5.2 The "Sensor Hack" Architecture**

**Problem:** iOS shield extensions are sandboxed and cannot access CoreMotion (accelerometer) or microphone.

**Solution:** Deep Link Loop
```
┌─────────────────────────────────────────────────────────────┐
│                      SENSOR HACK FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User opens blocked app (e.g., Instagram)               │
│     ↓                                                       │
│  2. ShieldConfiguration displays native iOS UI             │
│     ↓                                                       │
│  3. User taps "Restore Clarity"                            │
│     ↓                                                       │
│  4. ShieldAction extension sets flag in App Group:         │
│     - action_requested = true                              │
│     - blocked_app = "instagram"                            │
│     ↓                                                       │
│  5. Main app polls App Group every 1 second                │
│     ↓                                                       │
│  6. Main app detects flag, opens Action screen             │
│     → NOW HAS FULL SENSOR ACCESS                           │
│     ↓                                                       │
│  7. User completes action (CoreMotion detects if movement) │
│     ↓                                                       │
│  8. Completion timestamp written to App Group              │
│     - last_action_completed = Date.now()                   │
│     ↓                                                       │
│  9. Shield reads timestamp, allows 60s access              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### **Implementation: Deep Link Handler**
```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SharedStorage } from '../utils/SharedStorage';

export default function RootLayout() {
  const router = useRouter();
  
  useEffect(() => {
    // Poll for action requests from shield extension
    const pollInterval = setInterval(async () => {
      const requested = await SharedStorage.get<boolean>('action_requested');
      
      if (requested) {
        const blockedApp = await SharedStorage.get<string>('blocked_app');
        
        // Clear flag
        await SharedStorage.set('action_requested', false);
        
        // Navigate to action selection
        router.push(`/actions?app=${blockedApp || 'unknown'}`);
      }
    }, 1000); // Poll every second
    
    return () => clearInterval(pollInterval);
  }, []);
  
  return <Slot />;
}
```

---

### **5.3 Privacy: Local-First Architecture**

**Principle:** User privacy is paramount. Raw screen time data NEVER leaves the device.

#### **What Gets Stored Locally (On-Device)**
```typescript
interface LocalState {
  // SENSITIVE - NEVER SYNCED
  appUsageLog: AppUsageRecord[];        // Package names + timestamps
  patternEvents: PatternEvent[];         // Detected patterns
  interventionHistory: Intervention[];   // When shields were triggered
  
  // SANITIZED - SYNCED TO FIREBASE
  dailyStreak: number;
  currentLevel: string;
  clarityScore: number; // 0-100
  totalMinutesRestored: number;
  lastSyncTimestamp: number;
}
```

#### **What Gets Synced to Firebase**
```typescript
// Firestore: users/{uid}/stats/{date}
interface UserStats {
  date: string;              // YYYY-MM-DD
  streak: number;
  clarityScore: number;      // Average clarity for the day
  minutesRestored: number;
  interventionsTriggered: number; // Count only, no details
  
  // Metadata
  lastUpdated: FirebaseFirestore.Timestamp;
  appVersion: string;
}
```

**Zero PII Transmission:** Firebase never sees which apps the user opened or when. Only aggregate statistics.

---

## SECTION 6: MONETIZATION (REVENUECAT IMPLEMENTATION)

### **6.1 Free vs Pro: Clarity Tools**

| Feature | Free Tier | Pro Tier (€9.99/mo) |
|---------|-----------|---------------------|
| **Breathing** | ✅ +5 clarity | ✅ +5 clarity |
| **Drink Water** | ✅ +3 clarity | ✅ +3 clarity |
| **Brown Noise** | ✅ +8 clarity | ✅ +8 clarity |
| **10 Squats** | ❌ Locked | ✅ +10 clarity |
| **20 Push-ups** | ❌ Locked | ✅ +15 clarity |
| **Walk 500 Steps** | ❌ Locked | ✅ +20 clarity |
| **Cold Shower** | ❌ Locked | ✅ +30 clarity |
| **Blur Visualization** | Up to 50 blur | Up to 100 blur |
| **Clarity Circle** | ❌ | ✅ Social features |

---

### **6.2 RevenueCat Implementation**

RevenueCat provides native Paywall UI for React Native that supports localization, intro offers, and A/B testing out of the box.

#### **Setup**
```bash
npm install react-native-purchases react-native-purchases-ui
cd ios && pod install && cd ..
```

#### **Configuration**
```typescript
// utils/RevenueCatConfig.ts
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

export const initializeRevenueCat = async () => {
  Purchases.configure({
    apiKey: Platform.OS === 'ios'
      ? process.env.REVENUECAT_IOS_API_KEY!
      : process.env.REVENUECAT_ANDROID_API_KEY!,
  });
  
  // Enable debug logging in development
  if (__DEV__) {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
  }
};
```

#### **Paywall Presentation**
```typescript
// screens/PaywallScreen.tsx
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const router = useRouter();
  
  const handlePresentPaywall = async () => {
    const result = await RevenueCatUI.presentPaywall({
      // RevenueCat displays native iOS paywall
    });
    
    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        router.replace('/dashboard');
        break;
        
      case PAYWALL_RESULT.CANCELLED:
        // User dismissed
        break;
        
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.NOT_PRESENTED:
        console.error('Paywall error');
        break;
    }
  };
  
  useEffect(() => {
    handlePresentPaywall();
  }, []);
  
  return null; // RevenueCat handles UI
}
```

#### **Checking Pro Status**
```typescript
// hooks/useProStatus.ts
import { useState, useEffect } from 'react';
import Purchases from 'react-native-purchases';

export const useProStatus = () => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkProStatus();
    
    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      setIsPro(customerInfo.entitlements.active['pro'] !== undefined);
    });
  }, []);
  
  const checkProStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setIsPro(customerInfo.entitlements.active['pro'] !== undefined);
    } catch (error) {
      console.error('Error checking pro status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return { isPro, loading };
};
```

---

## SECTION 7: SUCCESS METRICS & ANALYTICS

### **7.1 Key Performance Indicators (KPIs)**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Day-7 Retention** | 60% | (Active users Day 7) / (Completed onboarding) |
| **Day-30 Retention** | 40% | (Active users Day 30) / (Completed onboarding) |
| **Average Clarity Score** | 70% | Average of daily clarity scores |
| **Daily Actions** | 4 | Avg completed actions per active user per day |
| **Pro Conversion Rate** | 5% | (Pro subscribers) / (Free users 7+ days active) |
| **Weekly Clarity Improvement** | +15% | (Week 2 clarity) - (Week 1 clarity) |
| **NPS (Net Promoter Score)** | 50+ | Survey after 14 days |
| **"Feels Native" Score** | 80%+ | Beta tester survey: "App looks like Apple made it" |

### **7.2 Analytics Events (Firebase)**
```typescript
// Track key user actions
import analytics from '@react-native-firebase/analytics';

// Onboarding completion
await analytics().logEvent('onboarding_completed', {
  time_to_complete_seconds: 120,
});

// Clarity change
await analytics().logEvent('clarity_updated', {
  clarity_change: -15,
  new_clarity: 55,
  time_of_day: 14,
  app_category: 'social', // Never log specific app
});

// Action completed
await analytics().logEvent('action_completed', {
  action_type: 'breathing',
  action_id: 'ma_001',
  clarity_restored: 5,
  new_clarity: 60,
  time_to_complete_seconds: 65,
});

// Shield triggered
await analytics().logEvent('shield_triggered', {
  clarity_at_trigger: 35,
  time_of_day: 22,
});

// Pro conversion
await analytics().logEvent('purchase', {
  package_identifier: 'monthly',
  price_string: '€9,99',
});
```

---

## SECTION 8: TESTING & QUALITY ASSURANCE

### **8.1 Critical Test Scenarios**

#### **Clarity Calculation Test**
```
1. Scenario: User scrolls TikTok for 60 minutes
   Expected: Clarity decreases to 55% (100 - (60 * 0.5 * 1.5))
   Verification: Check SharedStorage.get('clarity_score')
   
2. Scenario: User scrolls Instagram for 60 minutes
   Expected: Clarity decreases to 70% (100 - (60 * 0.5 * 1.0))
   Visual Check: Blur intensity increases proportionally
   
3. Scenario: User completes 3 actions (+30 clarity)
   Expected: Clarity increases by 30 points
   Expected: Blur reduces correspondingly
```

#### **Action Completion Test**
```
1. Scenario: User completes box breathing (5 points)
   Expected: Clarity increases by 5%
   Expected: Native fade animation plays
   Expected: Success haptic fires
   
2. Scenario: User completes 10 squats (10 points)
   Expected: Clarity increases by 10%
   Expected: Accelerometer validates movement
```

#### **Shield Integration Test**
```
1. Scenario: Clarity reaches 35%
   Expected: Shield triggers on next blocked app open
   Expected: Shield displays "Clarity: 35%" in systemRed
   
2. Scenario: User taps "Restore Clarity"
   Expected: ShieldAction sets flag in App Group
   Expected: Main app detects flag within 1 second
   Expected: Action screen opens with sensor access
   
3. Scenario: User completes action
   Expected: Completion timestamp written
   Expected: Shield allows 60-second access
   Expected: After 60s, shield blocks again
```

### **8.2 Performance Benchmarks**

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| Shield Display Latency | < 200ms | Xcode Instruments |
| Blur Animation Frame Rate | 60 FPS | React Native Profiler |
| CPU Usage (with blur) | < 5% | Xcode Instruments |
| Battery Drain | < 5% per day | TestFlight Battery Logs |
| App Cold Start Time | < 2 seconds | Firebase Performance |
| Fade Animation Smoothness | 60 FPS | Visual inspection |

### **8.3 Device Testing Matrix**

| Device | iOS Version | Priority | Notes |
|--------|-------------|----------|-------|
| iPhone 12 Mini | iOS 16.0 | High | Minimum supported |
| iPhone 13 Pro | iOS 17.0 | Medium | Common user device |
| iPhone 14 Pro Max | iOS 17.2 | High | Dynamic Island |
| iPhone 15 Pro | iOS 18.0 | Critical | Latest hardware |

---

## SECTION 9: TECHNICAL DEPENDENCIES

### **9.1 Complete Package.json (Native iOS Focus)**
```json
{
  "name": "exit-app",
  "version": "1.0.0",
  "dependencies": {
    "@expo/vector-icons": "^14.0.0",
    "@kingstinct/react-native-device-activity": "^1.2.0",
    "@react-native-firebase/analytics": "^18.7.0",
    "@react-native-firebase/app": "^18.7.0",
    "@react-native-firebase/firestore": "^18.7.0",
    "expo": "~50.0.0",
    "expo-blur": "~12.9.0",
    "expo-haptics": "~12.8.0",
    "expo-router": "~3.4.0",
    "expo-sensors": "~12.9.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-purchases": "^7.0.0",
    "react-native-purchases-ui": "^7.0.0",
    "react-native-sfsymbols": "^1.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@types/react": "~18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**REMOVED from v16.0:**
- ❌ `@shopify/react-native-skia` (custom shaders not needed)
- ❌ `@tamagui/config` (using native components)
- ❌ `moti` (using Animated API)
- ❌ `expo-linear-gradient` (no custom gradients)
- ❌ `rive-react-native` (no custom animations)

---

## SECTION 10: APP STORE SUBMISSION

### **10.1 App Store Metadata**

**App Name:**
```
Exit: Clarity Tracker
```

**Subtitle:**
```
Restore focus through action
```

**Keywords:**
```
screen time,digital wellbeing,focus,clarity,mindfulness,phone addiction,productivity,breathing,health
```

**Description:**
```
Exit helps you maintain mental clarity through physiological interventions.

The Problem
Every minute of mindless scrolling adds cognitive noise that makes it harder to think clearly, make decisions, or be present.

The Solution
Exit visualizes this noise in real-time and provides tools (breathing, movement, hydration) to restore clarity.

How It Works
1. Scrolling reduces your clarity score (0-100%)
2. Your interface blurs proportionally to clarity loss
3. When you try to open distracting apps, Exit prompts an action
4. Complete the action (breathing, squats, etc.) to restore clarity
5. App unlocks for 60 seconds

Features
- Native iOS design (looks like Screen Time)
- Real-time clarity tracking
- 8+ restoration actions
- Privacy-first (all data stays on-device)

Free vs Pro
Free: Breathing + Water (restore 5-8 points)
Pro: All actions (restore up to 30 points)

Subscription: €9.99/month or €59.99/year

Built with Apple's Human Interface Guidelines.
```

---

Exit v17.0 represents a **complete design pivot** to Native iOS / Invisible Design. By adopting Apple's design language 100%, we:

1. **Build Instant Trust:** Users recognize familiar patterns
2. **Eliminate Learning Curve:** No custom UI to learn
3. **Maximize Performance:** Native components are GPU-optimized
4. **Ensure Accessibility:** System components have built-in VoiceOver
5. **Reduce Development Time:** No custom animations to debug
---

**Document Version:** 17.0 (Native iOS Edition)  
**Last Updated:** January 3, 2026  
**Authors:** Chief Product Officer + Lead Systems Architect  
**Status:** **PRODUCTION READY** 🚀  
**Next Action:** Begin Week 1 development sprint

---
