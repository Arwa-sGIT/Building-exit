# THE TRUE MVP FEATURE SET

**Status:** THE BUILD LIST (Day 1 Scope)  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Constraint:** Core Loop Only — 40% Feature Cut Applied

---

## PHILOSOPHY: RUTHLESS SIMPLIFICATION

**The MVP Rule:** If it's not essential to proving the core loop works, it's cut.

**Core Loop Definition:**
1. User tries to open distracting app
2. Shield interrupts with breathing exercise
3. User completes exercise
4. Clarity restores, dashboard clears
5. Repeat

**Everything else is decoration.**

---

## SECTION 1: WHAT'S IN (THE BUILD LIST)

### 1.1 ONBOARDING (3 Screens, <2 Minutes)

**Screen 1: Welcome**
```
┌─────────────────────────────┐
│                             │
│    [Exit App Icon]          │
│                             │
│    Train Your Awareness     │
│                             │
│    We interrupt autopilot,  │
│    not access.              │
│                             │
│    [Continue]               │
│                             │
└─────────────────────────────┘
```

**Screen 2: Screen Time Permission**
```
┌─────────────────────────────┐
│                             │
│  Grant Screen Time Access   │
│                             │
│  We need this to:           │
│  • Detect app usage         │
│  • Show interventions       │
│                             │
│  Your data stays on your    │
│  device. Always.            │
│                             │
│  [Grant Access]             │
│                             │
└─────────────────────────────┘
```

**Screen 3: Select Apps to Monitor**
```
┌─────────────────────────────┐
│                             │
│  Which apps trigger         │
│  autopilot for you?         │
│                             │
│  ☑ TikTok                   │
│  ☑ Instagram                │
│  ☑ Twitter/X                │
│  ☐ YouTube                  │
│  ☐ Reddit                   │
│                             │
│  [+ Add More]               │
│                             │
│  [Start]                    │
│                             │
└─────────────────────────────┘
```

**Technical Requirements:**
- iOS FamilyControls authorization flow
- ManagedSettings API to set up shield
- Local storage (UserDefaults) for selected apps
- No analytics tracking during onboarding

**Duration:** User completes in <2 minutes

---

### 1.2 HOME SCREEN (Dashboard)

**Layout (Native iOS List):**
```
Navigation Bar:
[Exit]

┌─────────────────────────────┐
│ Clarity Score               │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░        │
│ 65%                         │
│                             │
│ Today's Screen Time         │
│ 2h 15min                    │
│ ↓ 15% from yesterday        │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Suggested Action            │
│                             │
│ Box Breathing               │
│ 2 minutes • +10% clarity    │
│                             │
│ [Start]                     │
└─────────────────────────────┘

┌─────────────────────────────┐
│ This Week                   │
│                             │
│ Conscious Days: 3           │
│ Avg Clarity: 58%            │
└─────────────────────────────┘

Tab Bar:
[Home] [Actions] [Progress]
```

**Components:**
- `ProgressBar` (UIProgressView) for Clarity Score
- `Card` (UIView with layer.cornerRadius) for sections
- `Button` (UIButton, system style)
- Static overlay view (opacity based on Clarity Score)

**Data Sources:**
- Screen Time API (pulled every 6 hours)
- Local Clarity Score calculation
- Action completion history (last 7 days)

**No Custom Animations:** Use standard UIView.animate() only

---

### 1.3 THE SOMATIC SHIELD (Intervention Screen)

**Trigger Logic:**
```swift
func shouldShowShield(for app: String) -> Bool {
    let isMonitored = monitoredApps.contains(app)
    let clarityScore = ClarityCalculator.getCurrentScore()
    let recentOpens = getRecentOpens(for: app, within: .minutes(30))
    
    return isMonitored && (clarityScore < 60 || recentOpens >= 3)
}
```

**Shield UI (System Style):**
```
┌─────────────────────────────┐
│                             │
│     [App Icon]              │
│                             │
│  System Entropy: 45%        │
│                             │
│  Complete breathing         │
│  exercise to continue       │
│                             │
│  [Begin Breathing]          │
│                             │
│  [Dismiss]                  │
│  (3 dismissals = 24h break) │
│                             │
└─────────────────────────────┘
```

**Shield Extension (Native iOS):**
- Uses ShieldConfiguration API
- System blur background (.systemMaterial)
- Standard button styling
- No custom graphics

---

### 1.4 BREATHING EXERCISE SCREEN

**Box Breathing Implementation:**
```
┌─────────────────────────────┐
│                             │
│    Box Breathing            │
│    4-4-4-4 Pattern          │
│                             │
│    [Animated Circle]        │
│    Expands/Contracts        │
│                             │
│    Inhale                   │
│    3... 2... 1...           │
│                             │
│    Cycle 1 of 5             │
│                             │
│    [Cancel]                 │
│                             │
└─────────────────────────────┘
```

**Breathing Patterns (MVP - 3 Only):**

| Pattern | Duration | Cycles | Clarity +Points |
|---------|----------|--------|-----------------|
| Box (4-4-4-4) | 2 min | 5 | 10 |
| 4-7-8 | 90 sec | 4 | 10 |
| Coherence (5 breaths/min) | 3 min | 15 | 15 |

**Technical Implementation:**
- Timer-based (no sensor detection)
- Visual guide only (no audio for MVP)
- Haptic feedback at phase transitions (weak impact)
- Completion triggers shield unlock

**Animation:**
- Use UIView.animate(withDuration:) for circle
- Scale transform 0.5 → 1.0 → 0.5
- No complex particle effects

---

### 1.5 ACTIONS LIBRARY (Static JSON Menu)

**Tab 2: Actions Screen**
```
┌─────────────────────────────┐
│ Actions                     │
│                             │
│ [Search]                    │
│                             │
│ Low Energy (8)              │
│ • Box Breathing        10pt │
│ • Drink Water           5pt │
│ • Gratitude Journal    10pt │
│ • Gentle Stretching    10pt │
│ [Show More]                 │
│                             │
│ Medium Energy (6)           │
│ • 5-Minute Walk        15pt │
│ • Creative Doodling    10pt │
│ [Show More]                 │
│                             │
│ High Energy (4)             │
│ • 10-Minute Run        20pt │
│ • Cold Shower          25pt │
│ [Show More]                 │
│                             │
└─────────────────────────────┘
```

**Data Source:** `actions.json` (bundled with app)
```json
[
  {
    "id": "act_001",
    "name": "Box Breathing",
    "energy": "low",
    "duration_min": 2,
    "clarity_points": 10,
    "description": "4-4-4-4 breathing pattern",
    "category": "breathing"
  },
  {
    "id": "act_002",
    "name": "Drink Water",
    "energy": "low",
    "duration_min": 1,
    "clarity_points": 5,
    "description": "Drink a full glass of water slowly",
    "category": "hydration"
  }
]
```

**MVP Library Size:** 20 actions total
- 8 Low Energy
- 8 Medium Energy  
- 4 High Energy

**No Smart Recommendations:** Simple filter by energy level only (user selects manually)

**Action Completion Flow:**
1. User taps action → Detail screen
2. User taps "Start" → Timer begins
3. Timer completes → Local storage updated
4. Clarity Score recalculated
5. Return to Home with updated score

---

### 1.6 PROGRESS SCREEN (Basic Stats)

**Tab 3: Progress**
```
┌─────────────────────────────┐
│ Progress                    │
│                             │
│ This Month                  │
│ Conscious Days: 12          │
│ Avg Clarity: 62%            │
│ Actions Completed: 45       │
│                             │
│ This Week                   │
│ Mon  Tue  Wed  Thu  Fri     │
│  ✓    ✓    ✗    ✓    ✓     │
│                             │
│ Most Used Actions           │
│ 1. Box Breathing (12×)      │
│ 2. 5-Minute Walk (8×)       │
│ 3. Drink Water (7×)         │
│                             │
│ [View History]              │
│                             │
└─────────────────────────────┘
```

**Data Display:**
- Current month stats (rolling 30 days)
- Weekly calendar view (checkmarks for Conscious Days)
- Top 3 completed actions

**No Graphs:** Simple text/number display only

**No Social Features:** No leaderboards, no sharing

---

## SECTION 2: WHAT'S OUT (EXPLICITLY CUT)

### ❌ Cut from Original Spec

| Feature | Reason for Cut | Future Phase |
|---------|----------------|--------------|
| **Squat Detection** | Requires CoreMotion sensors + deep link hack — too complex for MVP | Phase 2 |
| **GPS Context** | Location permission + logic overhead — not core loop | Phase 2 |
| **Smart Action Recommendations** | Requires ML model or complex rules engine — overkill for 20 actions | Phase 2 |
| **Social Leaderboards** | Adds social graph, privacy concerns, not essential to prove concept | Phase 3 |
| **Mode Repas** | France-specific feature, nice-to-have | Phase 2 |
| **Streak System** | Gamification layer, not core mechanic | Phase 2 |
| **Level Progression UI** | Visual design work, can be added post-validation | Phase 2 |
| **Weekly Reports** | Analytics complexity, not day-1 critical | Phase 2 |
| **Custom Actions** | User-generated content = moderation issues | Phase 3 |
| **Audio Guides** | Audio asset creation + playback logic | Phase 2 |
| **Avatar System** | Animated graphics, not native iOS style | Phase 3 |
| **Pattern Break Notifications** | Push notification logic + user annoyance risk | Phase 2 |
| **Grace Mode** | Complex streak repair logic | Phase 2 |
| **Daily Quests** | Content creation burden (20+ quests) | Phase 2 |

### ✂️ Simplified Versions

**Original:** Dynamic noise shader (Skia GPU rendering)  
**MVP:** Static grain PNG overlay with opacity adjustment

**Original:** Liquid wipe animation when clearing Static  
**MVP:** Fade transition (0.3s)

**Original:** Rive-animated breathing circle  
**MVP:** UIView scale animation

**Original:** Firebase Cloud Functions for analytics  
**MVP:** Local storage only, manual export for analysis

---

## SECTION 3: IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure (Week 1-2)

**Sprint 1 (Week 1):**
- [ ] Project setup (React Native + Expo)
- [ ] iOS FamilyControls entitlement request
- [ ] DeviceActivityMonitor extension scaffold
- [ ] ShieldConfiguration extension scaffold
- [ ] Local storage setup (MMKV or UserDefaults)
- [ ] Clarity Score calculation engine

**Sprint 2 (Week 2):**
- [ ] Onboarding flow (3 screens)
- [ ] Screen Time permission flow
- [ ] App selection UI
- [ ] Basic Shield display
- [ ] App Group communication (extension ↔ main app)

**Deliverable:** User can grant permissions and select apps to monitor

---

### Phase 2: Core Loop (Week 3-4)

**Sprint 3 (Week 3):**
- [ ] Home screen dashboard (native list)
- [ ] Clarity Score display + progress bar
- [ ] Screen Time data integration
- [ ] Static overlay implementation (PNG + opacity)
- [ ] Shield trigger logic

**Sprint 4 (Week 4):**
- [ ] Breathing exercise screen (Box Breathing only)
- [ ] Timer implementation
- [ ] Haptic feedback integration
- [ ] Shield unlock mechanism
- [ ] 60-second access window logic

**Deliverable:** Full intervention flow works (Shield → Breathing → Unlock)

---

### Phase 3: Actions & Polish (Week 5-6)

**Sprint 5 (Week 5):**
- [ ] Actions library screen (static JSON)
- [ ] 20 action entries created
- [ ] Action detail view
- [ ] Manual action completion flow
- [ ] Clarity Score update on action complete

**Sprint 6 (Week 6):**
- [ ] Progress screen (basic stats)
- [ ] Conscious Day calculation
- [ ] Weekly calendar view
- [ ] Settings screen (minimal)
- [ ] App icon + splash screen

**Deliverable:** Feature-complete MVP ready for internal testing

---

### Phase 4: Testing & Refinement (Week 7-8)

**Sprint 7 (Week 7):**
- [ ] Internal dogfooding (team uses app for 1 week)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Edge case handling (force quit, airplane mode, etc.)

**Sprint 8 (Week 8):**
- [ ] Privacy policy + terms of service
- [ ] App Store submission preparation
- [ ] Screenshots + app preview video
- [ ] TestFlight build for closed beta (20 users)

**Deliverable:** TestFlight beta live

---

## SECTION 4: SUCCESS CRITERIA (MVP Validation)

### After 2 Weeks of Beta (20 Users)

**Primary Metrics:**

✅ **Intervention Acceptance Rate:** 60%+ of shields result in completed breathing exercise  
✅ **Conscious Days:** Average 8+ per user per 2 weeks  
✅ **Retention:** 70%+ of users open app daily  
✅ **Clarity Improvement:** Average +15% from Week 1 to Week 2

**Qualitative Validation:**

✅ **User Feedback:** "This actually interrupts my autopilot" (not "This is annoying")  
✅ **Perceived Value:** Users report feeling "more aware" in post-survey  
✅ **No Circumvention:** <5% of users report finding workarounds

**Technical Validation:**

✅ **Shield Display:** <200ms latency  
✅ **No Crashes:** 0 critical bugs in 2-week period  
✅ **Battery Impact:** <5% additional drain per day

### If These Metrics Pass → Proceed to Phase 2

**Phase 2 Adds:**
- Squat detection + CoreMotion sensors
- Smart action recommendations
- Streak system
- Weekly reports

### If Metrics Fail → Iterate

**Possible Pivots:**
- Intervention too long (reduce breathing from 2 min to 1 min)
- Shield too aggressive (increase threshold from 60% to 40%)
- Actions not compelling (replace static list with better curation)

---

## SECTION 5: TECHNICAL STACK (MVP-Specific)

### Frontend
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo-router": "~3.4.0",
    "@react-native-mmkv/mmkv": "^2.10.0",
    "expo-haptics": "~12.8.0"
  }
}
```

**No Additional UI Libraries:** Use native components only

### iOS Extensions
```
exit-app/
├── ios/
│   ├── DeviceActivityMonitorExtension/
│   │   └── ExitMonitor.swift
│   ├── ShieldConfigurationExtension/
│   │   └── ExitShieldConfig.swift
│   └── ShieldActionExtension/
│       └── ExitShieldAction.swift
```

### Data Storage

**Local Only (No Cloud for MVP):**
- `@react-native-mmkv/mmkv` for fast key-value storage
- Keys:
  - `clarity_score` (number)
  - `screen_time_today` (number, minutes)
  - `actions_completed` (array of action IDs)
  - `conscious_days` (array of date strings)
  - `monitored_apps` (array of bundle IDs)

**No Firebase:** Cloud sync deferred to Phase 2

### Analytics

**MVP: None**

Use Xcode Console + manual logs only. No third-party analytics SDKs.

**Post-MVP:** Firebase Analytics (anonymized only)

---

## SECTION 6: MVP CONSTRAINTS & BOUNDARIES

### What We Will NOT Do in MVP

**User Requests:**
- "Can you add a timer to track my focus sessions?" → No, not in scope
- "Can I customize the breathing pattern duration?" → No, fixed patterns only
- "Can I see which apps I use most?" → Screen Time app already does this
- "Can I invite friends?" → No social features
- "Can I export my data?" → Not in MVP (Phase 2)

**Feature Creep Detector:**

If someone suggests a feature, ask:
1. **Is it essential to proving the core loop?** If no → Phase 2
2. **Does it require >2 days of engineering?** If yes → Phase 2
3. **Does it add external dependencies?** If yes → Phase 2

### Scope Protection Checklist

Before adding ANY feature to MVP, it must pass:

- [ ] Can be built with native iOS components
- [ ] Can be implemented in <2 days
- [ ] Directly supports Shield → Breathing → Clarity restoration flow
- [ ] Requires zero external APIs or services
- [ ] Adds <50KB to app bundle size

If it fails any check → DEFERRED

---

## SECTION 7: MVP ASSET LIST

### Required Assets (All Native iOS)

**Icons:**
- App Icon (1024×1024, required by App Store)
- SF Symbols for UI (built into iOS, no custom icons)

**Images:**
- `grain-texture.png` (512×512, tileable noise pattern for static overlay)

**Copy:**
- Onboarding text (3 screens)
- Action descriptions (20 entries)
- Privacy policy (1 page)
- Terms of service (1 page)

**No Custom Fonts:** SF Pro (system font) only

**No Custom Animations:** UIView.animate() only

**No Audio Files:** Silent MVP (audio in Phase 2)

---

## SECTION 8: DEVELOPMENT RULES

### Code Standards (MVP-Specific)

**1. No Premature Optimization**
- Write straightforward code first
- Profile performance only if users report issues
- Don't optimize until there's data proving it's needed

**2. No Over-Engineering**
- Use simple if/else before state machines
- Use UserDefaults before databases
- Use local calculations before cloud functions

**3. No Unnecessary Abstractions**
- Copy-paste is okay for MVP
- DRY (Don't Repeat Yourself) can wait for Phase 2
- Focus on working code, not perfect code

### Testing Requirements

**Manual Testing Only:**
- No unit tests for MVP
- No integration tests for MVP
- Manual QA checklist before each TestFlight build

**Why:** Tests take time. For MVP, shipping fast > shipping perfect.

**Post-MVP:** Add tests when refactoring for Phase 2

---

## SECTION 9: LAUNCH CHECKLIST

### Pre-TestFlight

- [ ] App builds without errors
- [ ] All 3 onboarding screens work
- [ ] Shield displays on monitored apps
- [ ] Breathing exercise completes full cycle
- [ ] Clarity Score updates after action
- [ ] App doesn't crash on force quit
- [ ] Privacy policy accessible in app
- [ ] Terms of service accessible in app

### TestFlight Requirements

- [ ] App Store Connect account ready
- [ ] Bundle ID registered
- [ ] FamilyControls entitlement approved by Apple
- [ ] App icon uploaded (1024×1024)
- [ ] 6.5" and 5.5" screenshots prepared
- [ ] App description written (<4000 chars)
- [ ] Privacy policy URL live
- [ ] Support email address set up

### Beta Tester Instructions

**Email Template:**
```
Subject: You're invited to test Exit (Digital Awareness App)

Hi [Name],

You've been selected to beta test Exit, a new app that helps you
become more aware of unconscious phone use.

How it works:
1. Install from TestFlight (link below)
2. Grant Screen Time permission
3. Select 2-3 apps that trigger autopilot (TikTok, Instagram, etc.)
4. Use your phone normally
5. When you try to open a monitored app, complete a 2-minute 
   breathing exercise

We want to know:
- Does this interrupt your autopilot?
- Is the breathing exercise too long/short?
- Did anything break or feel confusing?

Please use the app for at least 7 days, then reply with feedback.

TestFlight Link: [LINK]

Thanks for helping build this.
- Exit Team
```

---

## SECTION 10: POST-MVP ROADMAP (Phase 2 Teaser)

### What's Next After Validation

**If MVP succeeds** (hits success criteria), we add:

**Phase 2 Features (Week 9-16):**
- Squat detection (CoreMotion sensors)
- Smart action recommendations (time/context-aware)
- Streak system with Grace Mode
- Weekly reports (analytics)
- Firebase sync (optional cloud backup)
- Level progression UI (5 levels)

**Phase 3 Features (Week 17-24):**
- Social Clarity Circles (opt-in leaderboards)
- Daily Quests (20+ templates)
- Custom actions (user-generated)
- Mode Repas (France-specific scheduling)
- Pattern Break notifications
- Audio-guided meditations

**Phase 4 (Future):**
- Android version
- API for third-party integrations
- B2B enterprise version (team dashboards)

---

## FINAL WORD: DISCIPLINE OVER FEATURES

**The MVP is intentionally minimal.**

Every feature not in this document is a feature we're NOT building yet.

**Our job is to prove one thing:**

> "Physiological interruption (breathing) can disrupt dopamine loops (autopilot phone use)."

If we prove that, we build Phase 2.  
If we don't, we iterate or pivot.

**Discipline wins.**

---

**Document Status:** LOCKED FOR MVP DEVELOPMENT  
**Review Date:** Week 8 (Post-Beta)  
**Change Requests:** Require Product Lead approval

---
