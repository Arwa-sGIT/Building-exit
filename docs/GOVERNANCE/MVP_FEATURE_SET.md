# MVP FEATURE SET

**Status:** THE BUILD LIST (Day 1 Scope)  
**Version:** 2.0 (Native iOS Edition)  
**Date:** January 3, 2026  
**Constraint:** 40% Feature Cut Applied  
**Timeline:** 8 Weeks to TestFlight Beta

---

## OVERVIEW

This document defines the **minimum viable product** for Exit. We've applied a **40% feature cut** from the full vision to focus exclusively on the **core loop**:
```
User scrolls → Clarity drops → Shield appears → User completes action → Clarity restores → Access granted
```

**Design Mandate:** Every feature uses **native iOS components only**. No custom animations, no custom color schemes, no third-party UI libraries.

---

## THE CORE LOOP (ONLY THIS MATTERS)

### **What We're Building:**
```
┌─────────────────────────────────────────────────────────┐
│                   THE MVP CORE LOOP                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. User scrolls monitored app (TikTok, Instagram)     │
│     ↓                                                   │
│  2. Clarity score decreases (100 → 70 → 40...)         │
│     ↓                                                   │
│  3. UI blurs proportionally (UIBlurEffect)              │
│     ↓                                                   │
│  4. User tries to open monitored app again              │
│     ↓                                                   │
│  5. Shield appears (clarity < 60% or 3+ opens)          │
│     ↓                                                   │
│  6. User taps "Restore Clarity"                         │
│     ↓                                                   │
│  7. Action selection screen (native list)               │
│     ↓                                                   │
│  8. User completes action (breathing timer)             │
│     ↓                                                   │
│  9. Clarity restored (+5 to +30 points)                 │
│     ↓                                                   │
│ 10. Shield unlocks for 60 seconds                       │
│     ↓                                                   │
│ 11. Repeat                                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Everything else is Phase 2+.**

---

## SECTION 1: ONBOARDING (3 SCREENS, <2 MIN)

### **1.1 Scope**

**Goal:** Get user to first intervention in under 2 minutes.

**Screens:**
1. Welcome (15 seconds)
2. Screen Time Permission (30 seconds)
3. App Selection (45 seconds)

**Total:** ~90 seconds to core loop.

---

### **1.2 Screen 1: Welcome**

**Native iOS Component:** `UIViewController` with system text styles.
```typescript
// screens/OnboardingWelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeButton } from '../components/NativeButton';
import { useRouter } from 'expo-router';

export default function OnboardingWelcomeScreen() {
  const colors = useSystemColors();
  const router = useRouter();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      {/* App Icon */}
      <Image 
        source={require('../assets/icon.png')}
        style={styles.icon}
      />
      
      {/* Title */}
      <Text style={[typography.largeTitle, { color: colors.label }]}>
        Welcome to Exit
      </Text>
      
      {/* Subtitle */}
      <Text 
        style={[
          typography.body,
          { color: colors.secondaryLabel, textAlign: 'center' }
        ]}
      >
        Restore mental clarity through action.{'\n'}
        Track your attention, not your time.
      </Text>
      
      {/* CTA */}
      <NativeButton
        title="Get Started"
        onPress={() => router.push('/onboarding/permissions')}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 27, // iOS app icon corner radius
    marginBottom: 16,
  },
});
```

---

### **1.3 Screen 2: Screen Time Permission**

**Native iOS Component:** Standard system permission alert + explanation.
```typescript
// screens/OnboardingPermissionsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeButton } from '../components/NativeButton';
import { SFSymbol } from 'react-native-sfsymbols';
import { useRouter } from 'expo-router';
import { AuthorizationCenter } from '@kingstinct/react-native-device-activity';

export default function OnboardingPermissionsScreen() {
  const colors = useSystemColors();
  const router = useRouter();
  
  const requestPermission = async () => {
    try {
      // Request FamilyControls authorization
      await AuthorizationCenter.requestAuthorization();
      
      // If granted, proceed to app selection
      router.push('/onboarding/app-selection');
    } catch (error) {
      Alert.alert(
        'Permission Required',
        'Exit needs Screen Time permission to function. Please grant access in Settings.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      {/* Icon */}
      <SFSymbol
        name="hourglass"
        color={colors.systemBlue}
        size={80}
      />
      
      {/* Title */}
      <Text style={[typography.largeTitle, { color: colors.label }]}>
        Screen Time Access
      </Text>
      
      {/* Explanation */}
      <Text 
        style={[
          typography.body,
          { color: colors.secondaryLabel, textAlign: 'center' }
        ]}
      >
        Exit uses Screen Time to calculate your clarity score and trigger interventions.
        {'\n\n'}
        Your data never leaves your device.
      </Text>
      
      {/* CTA */}
      <NativeButton
        title="Grant Permission"
        onPress={requestPermission}
        variant="primary"
      />
      
      {/* Skip */}
      <NativeButton
        title="I'll Do This Later"
        onPress={() => router.replace('/dashboard')}
        variant="secondary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
});
```

---

### **1.4 Screen 3: App Selection**

**Native iOS Component:** `UITableView` with checkboxes (standard iOS Settings pattern).
```typescript
// screens/OnboardingAppSelectionScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeButton } from '../components/NativeButton';
import { SFSymbol } from 'react-native-sfsymbols';
import { useRouter } from 'expo-router';

// Pre-defined app list (MVP: 6 most common apps)
const SUGGESTED_APPS = [
  { id: 'com.zhiliaoapp.musically', name: 'TikTok', icon: 'music.note' },
  { id: 'com.instagram.instagram', name: 'Instagram', icon: 'camera.fill' },
  { id: 'com.facebook.Facebook', name: 'Facebook', icon: 'person.2.fill' },
  { id: 'com.twitter.twitter', name: 'X (Twitter)', icon: 'bird.fill' },
  { id: 'com.reddit.Reddit', name: 'Reddit', icon: 'bubble.left.and.bubble.right.fill' },
  { id: 'com.google.ios.youtube', name: 'YouTube', icon: 'play.rectangle.fill' },
];

export default function OnboardingAppSelectionScreen() {
  const colors = useSystemColors();
  const router = useRouter();
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  
  const toggleApp = (appId: string) => {
    setSelectedApps(prev => 
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };
  
  const handleContinue = async () => {
    if (selectedApps.length === 0) {
      Alert.alert(
        'Select at least one app',
        'Choose apps you want to monitor.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Save selected apps
    await StorageManager.set('monitored_apps', selectedApps);
    
    // Go to dashboard
    router.replace('/dashboard');
  };
  
  const renderApp = ({ item }: { item: typeof SUGGESTED_APPS[0] }) => {
    const isSelected = selectedApps.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          { 
            backgroundColor: colors.secondarySystemGroupedBackground,
            borderBottomColor: colors.separator,
          },
        ]}
        onPress={() => toggleApp(item.id)}
        activeOpacity={0.7}
      >
        <SFSymbol
          name={item.icon}
          color={colors.secondaryLabel}
          size={24}
        />
        
        <Text style={[typography.body, { color: colors.label, flex: 1 }]}>
          {item.name}
        </Text>
        
        {isSelected && (
          <SFSymbol
            name="checkmark.circle.fill"
            color={colors.systemBlue}
            size={24}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}>
      <View style={styles.header}>
        <Text style={[typography.largeTitle, { color: colors.label }]}>
          Choose Apps
        </Text>
        <Text style={[typography.body, { color: colors.secondaryLabel }]}>
          Select apps you want to monitor. You can change this later.
        </Text>
      </View>
      
      <FlatList
        data={SUGGESTED_APPS}
        renderItem={renderApp}
        keyExtractor={item => item.id}
        style={styles.list}
      />
      
      <View style={styles.footer}>
        <NativeButton
          title={`Continue (${selectedApps.length} selected)`}
          onPress={handleContinue}
          variant="primary"
          disabled={selectedApps.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  list: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
});
```

---

## SECTION 2: HOME SCREEN (DASHBOARD)

### **2.1 Scope**

**Single screen showing:**
1. Clarity score (large number)
2. Today's screen time (hours:minutes)
3. Suggested action card (1 only)
4. This week stats (mini summary)

**No:** Graphs, avatars, animations, custom visual effects.

---

### **2.2 Dashboard Implementation**
```typescript
// screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeCard } from '../components/NativeCard';
import { SFSymbol } from 'react-native-sfsymbols';
import { ClarityOverlay } from '../components/ClarityOverlay';
import { StorageManager } from '../utils/StorageManager';
import { ClarityEngine } from '../utils/ClarityEngine';

export default function DashboardScreen() {
  const colors = useSystemColors();
  const [clarity, setClarity] = useState(100);
  const [screenTime, setScreenTime] = useState(0); // minutes
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const loadData = async () => {
    const state = await StorageManager.getClarityState();
    setClarity(state.clarity);
    setScreenTime(state.screenTimeToday);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Format screen time as hours:minutes
  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Get clarity color
  const getClarityColor = () => {
    if (clarity >= 70) return colors.systemGreen;
    if (clarity >= 40) return colors.systemOrange;
    return colors.systemRed;
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}>
      {/* Clarity Overlay */}
      <ClarityOverlay clarity={clarity} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.label}
          />
        }
      >
        {/* Clarity Score */}
        <NativeCard>
          <View style={styles.clarityCard}>
            <SFSymbol
              name="waveform.circle.fill"
              color={getClarityColor()}
              size={48}
            />
            <Text style={[typography.largeTitle, { color: getClarityColor() }]}>
              {clarity}%
            </Text>
            <Text style={[typography.headline, { color: colors.label }]}>
              Clarity Score
            </Text>
            <Text style={[typography.callout, { color: colors.secondaryLabel }]}>
              {clarity >= 70 ? 'Clear' : clarity >= 40 ? 'Moderate' : 'Needs Restoration'}
            </Text>
          </View>
        </NativeCard>
        
        {/* Today's Stats */}
        <NativeCard>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <SFSymbol
                name="clock.fill"
                color={colors.systemBlue}
                size={20}
              />
              <Text style={[typography.body, { color: colors.label, flex: 1 }]}>
                Screen Time
              </Text>
              <Text style={[typography.headline, { color: colors.label }]}>
                {formatScreenTime(screenTime)}
              </Text>
            </View>
            
            <View style={[styles.statRow, { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.separator }]}>
              <SFSymbol
                name="checkmark.circle.fill"
                color={colors.systemGreen}
                size={20}
              />
              <Text style={[typography.body, { color: colors.label, flex: 1 }]}>
                Actions Today
              </Text>
              <Text style={[typography.headline, { color: colors.label }]}>
                3
              </Text>
            </View>
          </View>
        </NativeCard>
        
        {/* Suggested Action */}
        {clarity < 80 && (
          <NativeCard>
            <View style={styles.suggestionCard}>
              <Text style={[typography.headline, { color: colors.label }]}>
                Suggested Action
              </Text>
              <View style={styles.suggestionContent}>
                <SFSymbol
                  name="waveform.circle.fill"
                  color={colors.systemBlue}
                  size={32}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[typography.body, { color: colors.label }]}>
                    Box Breathing
                  </Text>
                  <Text style={[typography.caption1, { color: colors.secondaryLabel }]}>
                    1 min • +5 clarity
                  </Text>
                </View>
                <SFSymbol
                  name="chevron.right"
                  color={colors.tertiaryLabel}
                  size={16}
                />
              </View>
            </View>
          </NativeCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
  },
  clarityCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  statsCard: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  suggestionCard: {
    gap: 12,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
```

---

## SECTION 3: INTERVENTION FLOW

### **3.1 Scope**

**MVP: Breathing Only**

**Sequence:**
1. Shield appears (modal with blur)
2. User taps "Restore Clarity"
3. Breathing exercise screen (timer-based)
4. Completion confirmation
5. 60-second unlock window

**No:** Squats, walks, GPS, accelerometer (Phase 2).

---

### **3.2 Breathing Exercise Screen**
```typescript
// screens/BreathingExerciseScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeButton } from '../components/NativeButton';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const BREATHING_PATTERN = [
  { phase: 'Inhale', duration: 4 },
  { phase: 'Hold', duration: 4 },
  { phase: 'Exhale', duration: 4 },
  { phase: 'Hold', duration: 4 },
];

const TOTAL_CYCLES = 5;

export default function BreathingExerciseScreen() {
  const colors = useSystemColors();
  const router = useRouter();
  
  const [currentCycle, setCurrentCycle] = useState(1);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(BREATHING_PATTERN[0].duration);
  const [isActive, setIsActive] = useState(false);
  
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = (currentPhase + 1) % BREATHING_PATTERN.length;
          
          // Haptic feedback on phase change
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          // If completed full cycle
          if (nextPhase === 0) {
            if (currentCycle >= TOTAL_CYCLES) {
              // Exercise complete
              handleComplete();
              return 0;
            } else {
              setCurrentCycle(c => c + 1);
            }
          }
          
          setCurrentPhase(nextPhase);
          return BREATHING_PATTERN[nextPhase].duration;
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, currentPhase, currentCycle]);
  
  useEffect(() => {
    // Animate circle based on phase
    const phase = BREATHING_PATTERN[currentPhase];
    
    Animated.timing(scaleAnim, {
      toValue: phase.phase === 'Inhale' ? 1.2 : 0.8,
      duration: phase.duration * 1000,
      useNativeDriver: true,
    }).start();
  }, [currentPhase]);
  
  const handleStart = () => {
    setIsActive(true);
  };
  
  const handleComplete = async () => {
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Update clarity
    await StorageManager.restoreClarity(5);
    
    // Record completion
    await StorageManager.recordActionCompletion('breathing_box');
    
    // Navigate back
    router.back();
  };
  
  const phase = BREATHING_PATTERN[currentPhase];
  
  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      {/* Cycle Counter */}
      <Text style={[typography.headline, { color: colors.secondaryLabel }]}>
        Cycle {currentCycle} of {TOTAL_CYCLES}
      </Text>
      
      {/* Breathing Circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.systemBlue,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[typography.largeTitle, { color: 'white' }]}>
          {secondsRemaining}
        </Text>
      </Animated.View>
      
      {/* Phase Label */}
      <Text style={[typography.title1, { color: colors.label }]}>
        {phase.phase}
      </Text>
      
      {/* Start Button */}
      {!isActive && (
        <NativeButton
          title="Begin"
          onPress={handleStart}
          variant="primary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
    paddingHorizontal: 32,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

---

## SECTION 4: ACTIONS LIBRARY

### **4.1 Scope**

**MVP: 8 Actions (Static List)**

| ID | Name | Duration | Clarity | Pro? |
|----|------|----------|---------|------|
| breathing_box | Box Breathing | 1 min | +5 | ❌ |
| breathing_478 | 4-7-8 Breathing | 2 min | +8 | ❌ |
| hydration | Drink Water | 30s | +3 | ❌ |
| stretching | Quick Stretch | 3 min | +10 | ✅ |
| walk_5min | 5-Min Walk | 5 min | +15 | ✅ |
| journal | Gratitude Journal | 5 min | +12 | ✅ |
| brown_noise | Brown Noise (10m) | 10 min | +8 | ❌ |
| reading | Analog Reading | 15 min | +20 | ✅ |

**No:** AI recommendations, GPS context, weather API (Phase 2).

---

### **4.2 Actions List Screen**
```typescript
// screens/ActionsScreen.tsx
import React from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { SFSymbol } from 'react-native-sfsymbols';
import { useRouter } from 'expo-router';
import { useProStatus } from '../hooks/useProStatus';

const ACTIONS = [
  // Free actions
  {
    id: 'breathing_box',
    name: 'Box Breathing',
    duration: 1,
    clarity: 5,
    icon: 'waveform.circle.fill',
    pro: false,
  },
  {
    id: 'breathing_478',
    name: '4-7-8 Breathing',
    duration: 2,
    clarity: 8,
    icon: 'waveform.circle.fill',
    pro: false,
  },
  {
    id: 'hydration',
    name: 'Drink Water',
    duration: 0.5,
    clarity: 3,
    icon: 'drop.fill',
    pro: false,
  },
  {
    id: 'brown_noise',
    name: 'Brown Noise (10m)',
    duration: 10,
    clarity: 8,
    icon: 'waveform',
    pro: false,
  },
  // Pro actions
  {
    id: 'stretching',
    name: 'Quick Stretch',
    duration: 3,
    clarity: 10,
    icon: 'figure.flexibility',
    pro: true,
  },
  {
    id: 'walk_5min',
    name: '5-Min Walk',
    duration: 5,
    clarity: 15,
    icon: 'figure.walk',
    pro: true,
  },
  {
    id: 'journal',
    name: 'Gratitude Journal',
    duration: 5,
    clarity: 12,
    icon: 'book.fill',
    pro: true,
  },
  {
    id: 'reading',
    name: 'Analog Reading',
    duration: 15,
    clarity: 20,
    icon: 'text.book.closed.fill',
    pro: true,
  },
];

export default function ActionsScreen() {
  const colors = useSystemColors();
  const router = useRouter();
  const { isPro } = useProStatus();
  
  const sections = [
    {
      title: 'Free Actions',
      data: ACTIONS.filter(a => !a.pro),
    },
    {
      title: 'Pro Actions',
      data: ACTIONS.filter(a => a.pro),
    },
  ];
  
  const renderItem = ({ item }: any) => {
    const isLocked = item.pro && !isPro;
    
    return (
      <TouchableOpacity
        style={[
          styles.cell,
          { 
            backgroundColor: colors.secondarySystemGroupedBackground,
            borderBottomColor: colors.separator,
          },
        ]}
        onPress={() => {
          if (isLocked) {
            router.push('/paywall');
          } else {
            router.push(`/action/${item.id}`);
          }
        }}
        activeOpacity={0.7}
      >
        <SFSymbol
          name={item.icon}
          color={isLocked ? colors.tertiaryLabel : colors.systemBlue}
          size={24}
        />
        
        <View style={styles.content}>
          <Text style={[typography.body, { color: isLocked ? colors.tertiaryLabel : colors.label }]}>
            {item.name}
          </Text>
          <Text style={[typography.caption1, { color: colors.secondaryLabel }]}>
            {item.duration >= 1 ? `${item.duration} min` : '30 sec'} • +{item.clarity} clarity
          </Text>
        </View>
        
        {isLocked && (
          <SFSymbol
            name="lock.fill"
            color={colors.tertiaryLabel}
            size={16}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  const renderSectionHeader = ({ section: { title } }: any) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.systemGroupedBackground }]}>
      <Text style={[typography.footnote, { color: colors.secondaryLabel }]}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
  
  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={item => item.id}
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.list, { backgroundColor: colors.systemGroupedBackground }]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
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

## SECTION 5: PROGRESS SCREEN

### **5.1 Scope**

**Simple Stats Only:**
- Current clarity score
- Total actions completed (lifetime)
- Current streak (conscious days)
- This week summary

**No:** Graphs, charts, weekly reports, level animations.

---

### **5.2 Progress Screen**
```typescript
// screens/ProgressScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSystemColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { NativeCard } from '../components/NativeCard';
import { SFSymbol } from 'react-native-sfsymbols';
import { StorageManager } from '../utils/StorageManager';

export default function ProgressScreen() {
  const colors = useSystemColors();
  const [stats, setStats] = useState({
    clarity: 100,
    totalActions: 0,
    streak: 0,
    thisWeekActions: 0,
  });
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    const data = await StorageManager.getProgressStats();
    setStats(data);
  };
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Current Clarity */}
      <NativeCard>
        <View style={styles.statCard}>
          <SFSymbol
            name="waveform.circle.fill"
            color={colors.systemBlue}
            size={48}
          />
          <Text style={[typography.largeTitle, { color: colors.label }]}>
            {stats.clarity}%
          </Text>
          <Text style={[typography.headline, { color: colors.secondaryLabel }]}>
            Current Clarity
          </Text>
        </View>
      </NativeCard>
      
      {/* Lifetime Stats */}
      <NativeCard>
        <View style={styles.statsGrid}>
          <View style={styles.gridItem}>
            <Text style={[typography.title1, { color: colors.label }]}>
              {stats.totalActions}
            </Text>
            <Text style={[typography.callout, { color: colors.secondaryLabel }]}>
              Total Actions
            </Text>
          </View>
          
          <View style={styles.gridItem}>
            <Text style={[typography.title1, { color: colors.systemGreen }]}>
              {stats.streak}
            </Text>
            <Text style={[typography.callout, { color: colors.secondaryLabel }]}>
              Day Streak
            </Text>
          </View>
        </View>
      </NativeCard>
      
      {/* This Week */}
      <NativeCard>
        <View style={styles.weekCard}>
          <Text style={[typography.headline, { color: colors.label }]}>
            This Week
          </Text>
          <View style={styles.weekStat}>
            <SFSymbol
              name="checkmark.circle.fill"
              color={colors.systemGreen}
              size={20}
            />
            <Text style={[typography.body, { color: colors.label }]}>
              {stats.thisWeekActions} actions completed
            </Text>
          </View>
        </View>
      </NativeCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  gridItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  weekCard: {
    gap: 12,
  },
  weekStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
```

---

## SECTION 6: WHAT'S EXPLICITLY CUT (PHASE 2+)

### **6.1 Features Removed from MVP**

❌ **Squat Detection** (CoreMotion complexity)  
❌ **GPS Context** (location permissions, API calls)  
❌ **Smart AI Recommendations** (context engine)  
❌ **Social Leaderboards** (Clarity Circle)  
❌ **Streak System UI** (grace mode, repair ritual)  
❌ **Level Progression Visuals** (avatar, animations)  
❌ **Weekly Reports** (behavioral insights)  
❌ **Custom Actions** (user-created challenges)  
❌ **Audio Guides** (guided meditations)  
❌ **Pattern Break Notifications** (background monitoring)  
❌ **Daily Quests** (quest suggestion engine)  
❌ **Weather Integration** (outdoor action recommendations)  
❌ **Calendar Integration** (scheduling actions)  
❌ **Apple Watch App** (companion experience)

---

## SECTION 7: DEPENDENCIES (MINIMALIST)

### **7.1 Package.json (MVP Only)**
```json
{
  "name": "exit-app",
  "version": "0.1.0",
  "dependencies": {
    "@kingstinct/react-native-device-activity": "^1.2.0",
    "expo": "~50.0.0",
    "expo-blur": "~12.9.0",
    "expo-haptics": "~12.8.0",
    "expo-router": "~3.4.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-purchases": "^7.0.0",
    "react-native-purchases-ui": "^7.0.0",
    "react-native-sfsymbols": "^1.2.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Total Dependencies:** 9 (vs. 20+ in original spec)

**Removed:**
- ❌ Skia
- ❌ Tamagui
- ❌ Moti
- ❌ Rive
- ❌ Firebase (Phase 2)
- ❌ Sensors (Phase 2)
- ❌ Linear Gradient

---
**Document Status:** READY FOR DEVELOPMENT  
**Version:** 2.0 (Native iOS Edition)  
**Timeline:** 8 Weeks to TestFlight  
**Next Document:** Scoring Formulas (Math Spec)

---
