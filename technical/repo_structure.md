# REPOSITORY STRUCTURE & CONTEXT MAP

**Version:** 1.0  
**Status:** CANONICAL REFERENCE  
**Last Updated:** January 3, 2026  
**Purpose:** Define the two-repo architecture and navigation guide for AI agents

## REPOSITORY 1: `building-exit` (PUBLIC)

**URL:** `https://github.com/[username]/building-exit`  
**Visibility:** Public  
**Purpose:** Strategy, research, and design documentation

### **Directory Structure**
```
building-exit/
├── README.md                          # Project overview & philosophy
├── CONSTITUTION.md                    # Immutable design principles (v2.0 Native iOS)
├── docs/
│   ├── prd/
│   │   ├── PRD_v17.0_NATIVE_IOS.md   # Complete product requirements
│   │   ├── CORE_MECHANICS.md         # 4 pillars behavioral system (v2.0)
│   │   ├── MVP_FEATURE_SET.md        # 8-week build scope (v2.0)
│   │   └── SCORING_FORMULAS.md       # Math & algorithms (v2.0)
│   ├── design/
│   │   ├── ux_architecture.md        # User flows & component library (THIS FILE)
│   │   ├── native_ios_guidelines.md  # SF Symbols, system colors, typography
│   │   ├── haptics_guide.md          # iOS haptic feedback patterns
│   │   └── accessibility.md          # VoiceOver, Dynamic Type support
│   ├── gamification/
│   │   ├── GAMIFICATION.md           # Signal & Static framework
│   │   ├── dopamine_menu.json        # 50+ micro-actions database
│   │   └── daily_quests.json         # 20+ quest templates
│   ├── research/
│   │   ├── behavioral_psychology.md  # Dopamine research citations
│   │   ├── competitor_analysis.md    # Opal, One Sec, Freedom comparison
│   │   └── user_interviews.md        # Beta tester feedback
│   └── technical/
│       ├── repo_structure.md         # THIS FILE
│       ├── security_architecture.md  # Threat model & mitigations
│       ├── data_architecture.md      # Schemas & algorithms
│       ├── folder_structure.md       # Codebase organization
│       └── API_SPECIFICATIONS.md     # iOS extensions IPC
├── exit-gamification/
│   ├── UML_DIAGRAMS.md               # Mermaid flowcharts
│   ├── data/
│   │   ├── dopamine_menu.json        # Synced to private repo
│   │   └── daily_quests.json         # Synced to private repo
│   └── GAMIFICATION.md               # Strategy doc
└── .github/
    └── workflows/
        └── sync-data.yml             # Auto-sync JSON to private repo
```

### **Key Files**

| File | Purpose | Target Audience |
|------|---------|-----------------|
| `CONSTITUTION.md` | Immutable principles (Article V: Native iOS) | All stakeholders |
| `PRD_v17.0_NATIVE_IOS.md` | Complete product spec | Engineers, designers |
| `CORE_MECHANICS.md` | Behavioral intervention logic | Engineers, psychologists |
| `MVP_FEATURE_SET.md` | 8-week build scope | Engineers |
| `SCORING_FORMULAS.md` | Math & algorithms | Engineers, data scientists |
| `dopamine_menu.json` | Micro-actions database | Content team, engineers |
| `daily_quests.json` | Quest templates | Content team, engineers |

---

## REPOSITORY 2: `exit-app-core` (PRIVATE)

**URL:** `https://github.com/[username]/exit-app-core`  
**Visibility:** Private  
**Purpose:** Production code, API keys, builds

### **Directory Structure**
```
exit-app-core/
├── README.md                          # Setup instructions (private)
├── package.json                       # Dependencies (Native iOS stack)
├── app.json                           # Expo configuration
├── .env.example                       # Environment variables template
├── .env                               # API keys (NEVER COMMITTED)
├── ios/                               # Native iOS code
│   ├── exit/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── exit.entitlements         # FamilyControls permissions
│   ├── DeviceActivityMonitorExtension/
│   │   └── ExitMonitor.swift         # Screen time tracking
│   ├── ShieldConfigurationExtension/
│   │   └── ExitShieldConfig.swift    # Custom shield UI
│   └── ShieldActionExtension/
│       └── ExitShieldAction.swift    # Shield button handler
├── src/
│   ├── app/                           # Expo Router screens
│   │   ├── (tabs)/
│   │   │   ├── index.tsx             # Dashboard
│   │   │   ├── actions.tsx           # Actions list
│   │   │   └── progress.tsx          # Stats screen
│   │   ├── onboarding/
│   │   │   ├── welcome.tsx
│   │   │   ├── permissions.tsx
│   │   │   └── app-selection.tsx
│   │   ├── intervention/
│   │   │   └── breathing.tsx         # Breathing exercise
│   │   └── _layout.tsx               # Root layout
│   ├── features/
│   │   ├── shield/
│   │   │   ├── components/
│   │   │   │   └── SomaticShield.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useShieldTrigger.ts
│   │   │   └── utils/
│   │   │       └── shieldLogic.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── ClarityOverlay.tsx    # UIBlurEffect wrapper
│   │   │   │   └── ClarityScore.tsx
│   │   │   └── hooks/
│   │   │       └── useClarityState.ts
│   │   ├── actions/
│   │   │   ├── components/
│   │   │   │   └── ActionsList.tsx       # Native list
│   │   │   ├── screens/
│   │   │   │   └── BreathingExercise.tsx
│   │   │   └── data/
│   │   │       └── actionsLoader.ts      # Imports JSON
│   │   └── onboarding/
│   │       ├── components/
│   │       │   └── AppSelector.tsx
│   │       └── hooks/
│   │           └── useOnboardingFlow.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── NativeButton.tsx          # System-styled button
│   │   │   ├── NativeCard.tsx            # Grouped background card
│   │   │   └── SFSymbol.tsx              # Wrapper for SF Symbols
│   │   ├── hooks/
│   │   │   ├── useSystemColors.ts        # Light/Dark mode colors
│   │   │   ├── useHaptics.ts             # iOS haptic patterns
│   │   │   └── useScreenTime.ts          # FamilyControls wrapper
│   │   ├── utils/
│   │   │   ├── ClarityEngine.ts          # Score calculation
│   │   │   ├── StorageManager.ts         # MMKV wrapper
│   │   │   └── AppGroupStorage.ts        # Native module bridge
│   │   └── theme/
│   │       ├── colors.ts                 # System color mappings
│   │       ├── typography.ts             # SF Pro text styles
│   │       └── spacing.ts                # 4/8/16/24/32px scale
│   ├── data/
│   │   ├── dopamine_menu.json            # Synced from public repo
│   │   └── daily_quests.json             # Synced from public repo
│   └── types/
│       ├── MicroAction.ts
│       ├── DailyQuest.ts
│       └── ClarityState.ts
├── assets/
│   ├── icon.png                       # App icon
│   ├── splash.png                     # Launch screen
│   └── adaptive-icon.png              # Android (future)
└── .github/
    └── workflows/
        └── pull-data.yml              # Auto-pull JSON from public repo
```

### **Key Files**

| File | Purpose | Links To |
|------|---------|----------|
| `src/app/(tabs)/index.tsx` | Dashboard screen | `PRD_v17.0` Section 2 |
| `src/features/shield/components/SomaticShield.tsx` | Shield modal | `CORE_MECHANICS.md` Pillar 1 |
| `src/shared/utils/ClarityEngine.ts` | Score calculation | `SCORING_FORMULAS.md` Section 1 |
| `src/data/dopamine_menu.json` | Actions database | `building-exit/exit-gamification/data/dopamine_menu.json` |
| `ios/DeviceActivityMonitorExtension/` | Screen time tracking | `API_SPECIFICATIONS.md` Section 5 |

---

## DATA FLOW: PUBLIC → PRIVATE

### **Automated Sync (GitHub Actions)**
```yaml
# .github/workflows/sync-data.yml (in building-exit repo)
name: Sync JSON to Private Repo

on:
  push:
    paths:
      - 'exit-gamification/data/dopamine_menu.json'
      - 'exit-gamification/data/daily_quests.json'

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout public repo
        uses: actions/checkout@v3
        
      - name: Checkout private repo
        uses: actions/checkout@v3
        with:
          repository: [username]/exit-app-core
          token: ${{ secrets.PRIVATE_REPO_TOKEN }}
          path: private
          
      - name: Copy JSON files
        run: |
          cp exit-gamification/data/dopamine_menu.json private/src/data/
          cp exit-gamification/data/daily_quests.json private/src/data/
          
      - name: Commit and push
        run: |
          cd private
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/data/*.json
          git commit -m "chore: sync content from building-exit"
          git push
```

### **Manual Sync (If Needed)**
```bash
# From exit-app-core directory
cd ../building-exit
git pull origin main

# Copy updated JSON files
cp exit-gamification/data/dopamine_menu.json ../exit-app-core/src/data/
cp exit-gamification/data/daily_quests.json ../exit-app-core/src/data/

cd ../exit-app-core
git add src/data/*.json
git commit -m "chore: sync content from building-exit"
git push
```

---

## IMPORT STRATEGY (CODE ↔ DATA)

### **Loading JSON at Build Time**
```typescript
// src/features/actions/data/actionsLoader.ts
import rawActions from '../../../data/dopamine_menu.json';
import { MicroAction } from '../../../types/MicroAction';

export class ActionsLoader {
  
  private static cachedActions: MicroAction[] | null = null;
  
  static getAllActions(): MicroAction[] {
    // Cache on first load
    if (!this.cachedActions) {
      this.cachedActions = rawActions.dopamine_menu as MicroAction[];
    }
    
    return this.cachedActions;
  }
  
  static getActionById(id: string): MicroAction | null {
    const actions = this.getAllActions();
    return actions.find(a => a.id === id) || null;
  }
  
  static getActionsByCategory(category: string): MicroAction[] {
    return this.getAllActions().filter(a => a.category === category);
  }
  
  static getFreeActions(): MicroAction[] {
    return this.getAllActions().filter(a => !a.proOnly);
  }
  
  static getProActions(): MicroAction[] {
    return this.getAllActions().filter(a => a.proOnly);
  }
}
```

### **Type Safety**
```typescript
// src/types/MicroAction.ts
export interface MicroAction {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'movement' | 'hydration' | 'sensory' | 'social';
  energy: 'low' | 'medium' | 'high';
  duration: number;
  clarityPoints: number;
  sfSymbol: string;
  proOnly: boolean;
  verification: 'timer' | 'accelerometer' | 'gps' | 'self_report';
  contextMatch?: ('home' | 'work' | 'outside' | 'transit')[];
}
```

### **Runtime Validation**
```typescript
// src/data/validator.ts
import Ajv from 'ajv';
import { MicroAction } from '../types/MicroAction';

const schema = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[a-z_]+$' },
    title: { type: 'string', minLength: 1 },
    clarityPoints: { type: 'number', minimum: 1, maximum: 30 },
    // ... full schema
  },
  required: ['id', 'title', 'category', 'energy', 'duration', 'clarityPoints'],
};

export const validateActions = (actions: unknown): actions is MicroAction[] => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  
  if (!validate(actions)) {
    console.error('Invalid actions data:', validate.errors);
    return false;
  }
  
  return true;
};
```

---

## AI AGENT NAVIGATION GUIDE

### **For Strategy Questions:**
```
Read: building-exit/CONSTITUTION.md
Then: building-exit/docs/prd/PRD_v17.0_NATIVE_IOS.md
```

### **For Design Questions:**
```
Read: building-exit/docs/design/ux_architecture.md
Then: building-exit/docs/design/native_ios_guidelines.md
```

### **For Implementation Questions:**
```
Read: building-exit/docs/technical/folder_structure.md
Then: exit-app-core/src/[relevant-feature]/
```

### **For Content Updates:**
```
Edit: building-exit/exit-gamification/data/dopamine_menu.json
Auto-sync: GitHub Action pushes to exit-app-core/src/data/
```

---

## DEPENDENCY GRAPH
```
CONSTITUTION.md (immutable)
    ↓
PRD_v17.0_NATIVE_IOS.md (requirements)
    ↓
CORE_MECHANICS.md (behavioral logic)
    ↓
MVP_FEATURE_SET.md (build scope)
    ↓
folder_structure.md (code organization)
    ↓
exit-app-core/src/ (implementation)
```

---

**Document Status:** CANONICAL  
**Next Review:** Post-MVP (Week 8)  
**Maintainer:** Lead Architect

---
