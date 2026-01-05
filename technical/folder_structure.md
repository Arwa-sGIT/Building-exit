# CODEBASE FILE STRUCTURE

**Version:** 1.0  
**Status:** IMPLEMENTATION READY  
**Last Updated:** January 3, 2026  
**Architecture:** Feature-Based Organization

---

## OVERVIEW

Exit uses a **feature-based folder structure** rather than layer-based (e.g., `components/`, `screens/`, `utils/`). This keeps related code together and makes the codebase more maintainable as it scales.

**Philosophy:** "Code that changes together, stays together."

---

## SECTION 1: WHY FEATURE-BASED?

### **1.1 Comparison: Layer-Based vs Feature-Based**

#### **Layer-Based (Traditional)**
```
src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ShieldModal.tsx
│   ├── BreathingCircle.tsx
│   └── ActionsList.tsx
├── screens/
│   ├── DashboardScreen.tsx
│   ├── ActionsScreen.tsx
│   └── BreathingScreen.tsx
├── utils/
│   ├── storage.ts
│   ├── clarity.ts
│   ├── haptics.ts
│   └── colors.ts
└── hooks/
    ├── useClarity.ts
    ├── useActions.ts
    └── useShield.ts
```

**Problems:**
- ❌ Hard to find all code related to a feature (scattered across 4+ folders)
- ❌ Difficult to delete a feature (files in multiple locations)
- ❌ Unclear ownership (who maintains `utils/storage.ts`?)
- ❌ Import hell (`../../../components/ShieldModal`)

---

#### **Feature-Based (Exit)**
```
src/
├── features/
│   ├── shield/
│   │   ├── components/
│   │   │   └── SomaticShield.tsx
│   │   ├── hooks/
│   │   │   └── useShieldTrigger.ts
│   │   └── utils/
│   │       └── shieldLogic.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── ClarityOverlay.tsx
│   │   │   └── ClarityScore.tsx
│   │   └── hooks/
│   │       └── useClarityState.ts
│   └── actions/
│       ├── components/
│       │   └── ActionsList.tsx
│       ├── screens/
│       │   └── BreathingExercise.tsx
│       └── data/
│           └── actionsLoader.ts
└── shared/
    ├── components/
    │   ├── NativeButton.tsx
    │   └── NativeCard.tsx
    ├── hooks/
    │   ├── useSystemColors.ts
    │   └── useHaptics.ts
    └── utils/
        ├── ClarityEngine.ts
        └── StorageManager.ts
```

**Benefits:**
- ✅ All shield code in one place (`features/shield/`)
- ✅ Easy to delete a feature (delete one folder)
- ✅ Clear ownership (shield team owns `features/shield/`)
- ✅ Short imports (`./components/SomaticShield`)

---

### **1.2 When to Use Feature vs Shared**

| Code Type | Location | Example |
|-----------|----------|---------|
| **Feature-Specific** | `features/[name]/` | ShieldModal (only used in shield feature) |
| **Used by 2-3 Features** | `features/[name]/` | ClarityOverlay (used by dashboard + shield) → Move to dashboard, import from there |
| **Used by 4+ Features** | `shared/` | NativeButton (used everywhere) |
| **Core Business Logic** | `shared/utils/` | ClarityEngine (core algorithm) |

**Rule of Thumb:** Start in `features/`. Move to `shared/` only when 4+ features need it.

---

## SECTION 2: COMPLETE FOLDER STRUCTURE
```
exit-app-core/
├── README.md
├── package.json
├── tsconfig.json
├── app.json
├── babel.config.js
├── metro.config.js
├── .env.example
├── .env                            # GITIGNORED
├── .gitignore
│
├── ios/                            # Native iOS code
│   ├── exit/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   ├── exit.entitlements
│   │   └── Images.xcassets/
│   ├── DeviceActivityMonitorExtension/
│   │   ├── Info.plist
│   │   └── ExitMonitor.swift
│   ├── ShieldConfigurationExtension/
│   │   ├── Info.plist
│   │   └── ExitShieldConfig.swift
│   ├── ShieldActionExtension/
│   │   ├── Info.plist
│   │   └── ExitShieldAction.swift
│   ├── Podfile
│   └── Podfile.lock
│
├── android/                        # Future (Phase 3+)
│
├── src/
│   ├── app/                        # Expo Router screens
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx           # Dashboard (home)
│   │   │   ├── actions.tsx         # Actions list
│   │   │   └── progress.tsx        # Stats/Progress
│   │   ├── onboarding/
│   │   │   ├── _layout.tsx
│   │   │   ├── welcome.tsx
│   │   │   ├── permissions.tsx
│   │   │   └── app-selection.tsx
│   │   ├── intervention/
│   │   │   ├── breathing.tsx
│   │   │   └── [actionId].tsx      # Dynamic action screen
│   │   ├── paywall.tsx
│   │   ├── settings.tsx
│   │   └── _layout.tsx             # Root layout
│   │
│   ├── features/
│   │   │
│   │   ├── shield/                 # Somatic Shield
│   │   │   ├── components/
│   │   │   │   └── SomaticShield.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useShieldTrigger.ts
│   │   │   │   └── useUnlockWindow.ts
│   │   │   ├── utils/
│   │   │   │   ├── shieldLogic.ts
│   │   │   │   └── dismissalTracker.ts
│   │   │   └── index.ts            # Barrel export
│   │   │
│   │   ├── dashboard/              # Clarity visualization
│   │   │   ├── components/
│   │   │   │   ├── ClarityOverlay.tsx
│   │   │   │   ├── ClarityScore.tsx
│   │   │   │   └── TodayStats.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useClarityState.ts
│   │   │   │   └── useScreenTime.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── actions/                # Dopamine Menu
│   │   │   ├── components/
│   │   │   │   ├── ActionsList.tsx
│   │   │   │   └── ActionCell.tsx
│   │   │   ├── screens/
│   │   │   │   └── BreathingExercise.tsx
│   │   │   ├── data/
│   │   │   │   └── actionsLoader.ts
│   │   │   ├── hooks/
│   │   │   │   └── useActionRecommendations.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── onboarding/             # First-time user flow
│   │   │   ├── components/
│   │   │   │   ├── WelcomeCard.tsx
│   │   │   │   └── AppSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useOnboardingFlow.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── progress/               # Stats & history
│   │   │   ├── components/
│   │   │   │   ├── StreakDisplay.tsx
│   │   │   │   └── WeeklyChart.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProgressStats.ts
│   │   │   └── index.ts
│   │   │
│   │   └── paywall/                # RevenueCat monetization
│   │       ├── components/
│   │       │   └── PricingCard.tsx
│   │       ├── hooks/
│   │       │   └── useProStatus.ts
│   │       └── index.ts
│   │
│   ├── shared/                     # Shared across 4+ features
│   │   │
│   │   ├── components/             # Reusable UI components
│   │   │   ├── NativeButton.tsx
│   │   │   ├── NativeCard.tsx
│   │   │   └── SFSymbol.tsx
│   │   │
│   │   ├── hooks/                  # Reusable hooks
│   │   │   ├── useSystemColors.ts
│   │   │   ├── useHaptics.ts
│   │   │   └── useNetworkStatus.ts
│   │   │
│   │   ├── utils/                  # Core business logic
│   │   │   ├── ClarityEngine.ts
│   │   │   ├── StorageManager.ts
│   │   │   ├── AppGroupStorage.ts
│   │   │   ├── TimeValidator.ts
│   │   │   └── SecurityMonitoring.ts
│   │   │
│   │   ├── theme/                  # Design system
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── animations.ts
│   │   │
│   │   └── constants/              # App-wide constants
│   │       ├── config.ts
│   │       └── routes.ts
│   │
│   ├── data/                       # JSON databases (synced from public repo)
│   │   ├── dopamine_menu.json
│   │   └── daily_quests.json
│   │
│   └── types/                      # TypeScript definitions
│       ├── MicroAction.ts
│       ├── DailyQuest.ts
│       ├── ClarityState.ts
│       ├── UserProfile.ts
│       └── index.ts                # Barrel export
│
├── assets/
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── fonts/                      # SF Pro (system font, no files needed)
│
└── .github/
    └── workflows/
        └── pull-data.yml           # Auto-sync JSON from public repo
```

---

## SECTION 3: FILE NAMING CONVENTIONS

### **3.1 Component Files**
```
PascalCase.tsx
```

**Examples:**
- `NativeButton.tsx`
- `SomaticShield.tsx`
- `ClarityOverlay.tsx`

---

### **3.2 Utility Files**
```
camelCase.ts
```

**Examples:**
- `clarityEngine.ts`
- `storageManager.ts`
- `appGroupStorage.ts`

---

### **3.3 Hook Files**
```
useCamelCase.ts
```

**Examples:**
- `useClarityState.ts`
- `useShieldTrigger.ts`
- `useSystemColors.ts`

---

### **3.4 Screen Files (Expo Router)**
```
kebab-case.tsx
```

**Examples:**
- `app-selection.tsx`
- `breathing-exercise.tsx`
- `[actionId].tsx` (dynamic route)

---

## SECTION 4: IMPORT PATTERNS

### **4.1 Barrel Exports**

Each feature should have an `index.ts` that exports its public API:
```typescript
// src/features/shield/index.ts
export { SomaticShield } from './components/SomaticShield';
export { useShieldTrigger } from './hooks/useShieldTrigger';
export { useUnlockWindow } from './hooks/useUnlockWindow';
export { shieldLogic } from './utils/shieldLogic';
```

**Usage:**
```typescript
// Instead of this:
import { SomaticShield } from '../features/shield/components/SomaticShield';
import { useShieldTrigger } from '../features/shield/hooks/useShieldTrigger';

// Do this:
import { SomaticShield, useShieldTrigger } from '@/features/shield';
```

---

### **4.2 Path Aliases**

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/features/*": ["features/*"],
      "@/shared/*": ["shared/*"],
      "@/data/*": ["data/*"],
      "@/types/*": ["types/*"],
      "@/app/*": ["app/*"]
    }
  }
}
```

**Usage:**
```typescript
// Instead of this:
import { NativeButton } from '../../../shared/components/NativeButton';

// Do this:
import { NativeButton } from '@/shared/components/NativeButton';
```

---

## SECTION 5: FEATURE DEPENDENCY RULES

### **5.1 Allowed Dependencies**
```
┌─────────────────────────────────┐
│         app/ (screens)          │  ← Can import from features/ and shared/
├─────────────────────────────────┤
│         features/               │  ← Can import from shared/ and other features/
├─────────────────────────────────┤
│         shared/                 │  ← Can ONLY import from shared/ (no features/)
└─────────────────────────────────┘
```

**Rules:**
1. ✅ `app/` can import from `features/` and `shared/`
2. ✅ `features/[feature-a]/` can import from `features/[feature-b]/` (if needed)
3. ✅ `features/` can import from `shared/`
4. ❌ `shared/` CANNOT import from `features/` (circular dependency)

---

### **5.2 Example Dependency Graph**
```
app/(tabs)/index.tsx (Dashboard)
  ↓ imports
features/dashboard/
  ↓ imports
shared/components/NativeCard
shared/hooks/useSystemColors
shared/utils/ClarityEngine

app/intervention/breathing.tsx
  ↓ imports
features/actions/
  ↓ imports
shared/components/NativeButton
shared/hooks/useHaptics
data/dopamine_menu.json
```

---

## SECTION 6: TESTING STRUCTURE
```
src/
├── features/
│   └── shield/
│       ├── components/
│       │   ├── SomaticShield.tsx
│       │   └── __tests__/
│       │       └── SomaticShield.test.tsx
│       ├── hooks/
│       │   ├── useShieldTrigger.ts
│       │   └── __tests__/
│       │       └── useShieldTrigger.test.ts
│       └── utils/
│           ├── shieldLogic.ts
│           └── __tests__/
│               └── shieldLogic.test.ts
```

**Test files live next to the code they test.**

---

## SECTION 7: MAINTENANCE GUIDE

### **7.1 Adding a New Feature**
```bash
# 1. Create feature folder
mkdir -p src/features/new-feature/{components,hooks,utils}

# 2. Create barrel export
touch src/features/new-feature/index.ts

# 3. Add components
touch src/features/new-feature/components/NewComponent.tsx

# 4. Add hooks
touch src/features/new-feature/hooks/useNewFeature.ts

# 5. Export public API in index.ts
```

**index.ts:**
```typescript
export { NewComponent } from './components/NewComponent';
export { useNewFeature } from './hooks/useNewFeature';
```

---

### **7.2 Deleting a Feature**
```bash
# Simply delete the feature folder
rm -rf src/features/deprecated-feature

# Remove imports from other files (TypeScript will error)
# Update app/ screens that used the feature
```

**Much easier than layer-based where you'd have to hunt down files in 5+ folders!**

---

### **7.3 Moving Code to Shared**

**When:** A component is used by 4+ features.

**Process:**
```bash
# 1. Move file
mv src/features/feature-a/components/SharedThing.tsx src/shared/components/

# 2. Update imports in all features
# Find: @/features/feature-a
# Replace: @/shared/components

# 3. Update barrel exports
```

---

## SECTION 8: SCALABILITY BENEFITS

### **8.1 Team Growth**

**With Feature-Based:**
- Team A owns `features/shield/`
- Team B owns `features/actions/`
- No merge conflicts (separate folders)
- Clear code ownership

**With Layer-Based:**
- Team A edits `components/` (conflict)
- Team B edits `components/` (conflict)
- Unclear ownership of `utils/`

---

### **8.2 Feature Flags**
```typescript
// src/shared/constants/features.ts
export const FEATURES = {
  SHIELD: true,
  ACTIONS: true,
  QUESTS: false,           // Phase 2
  SOCIAL: false,           // Phase 2
  APPLE_WATCH: false,      // Phase 3
};

// Usage in app
if (FEATURES.QUESTS) {
  // Show quests tab
}
```

Easy to disable entire features by removing `features/quests/` from imports.

---

## APPENDIX: MIGRATION CHECKLIST

If migrating from layer-based to feature-based:

- [ ] Create `features/` folder structure
- [ ] Move screen-specific components to `features/[name]/components/`
- [ ] Move screen-specific hooks to `features/[name]/hooks/`
- [ ] Move screen-specific utils to `features/[name]/utils/`
- [ ] Keep truly shared code in `shared/`
- [ ] Add barrel exports (`index.ts`) to each feature
- [ ] Update all imports to use new paths
- [ ] Configure path aliases in `tsconfig.json`
- [ ] Update tests to match new structure
- [ ] Update `.gitignore` if needed

---
**Architecture:** Feature-Based  
