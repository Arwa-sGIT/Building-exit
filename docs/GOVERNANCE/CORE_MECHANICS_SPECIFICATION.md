# CORE MECHANICS SPECIFICATION

**Status:** SEMI-LOCKED (System Logic)  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Owner:** Lead Systems Architect

---

## OVERVIEW

Exit operates on four interconnected mechanical systems. Each system has specific inputs, outputs, and state transitions. This document defines the "physics" of the app.

---

## PILLAR 1: THE INTERRUPT

### Concept

**The Somatic Shield is a pre-emptive intervention that triggers BEFORE the dopamine loop begins.**

Traditional app blockers show a message after you've already opened the app. By then, the craving is activated. We interrupt at the threshold—the moment of anticipation.

### Trigger Conditions

The Shield activates when:

1. **User attempts to open a Monitored App** (e.g., TikTok, Instagram)
2. **Current Clarity Score < 30%** (High entropy state)
3. **OR: App opened >3x in last 30 minutes** (Autopilot pattern detected)

### Shield States

| State | Condition | UI Behavior |
|-------|-----------|-------------|
| **Locked** | Default | Full-screen shield with action prompt |
| **Challenge Active** | User initiated action | Timer/counter interface (breathing/movement) |
| **Unlocked** | Action completed | 60-second access window, then re-lock |
| **Bypassed** | User dismissed 3x | 24-hour cooldown, shield disabled |

### Intervention Types (MVP)

**Breathing Only for MVP:**

- **Box Breathing (4-4-4-4):** 5 cycles, 2 minutes
- **4-7-8 Breathing:** 4 cycles, 90 seconds
- **Coherence Breathing:** 5 breaths/min, 3 minutes

**Verification Method:**

- iOS native timer (no sensor detection needed for breathing)
- User completes timer → Unlock triggered
- User exits early → Challenge failed, remains locked

### Implementation Notes
```swift
// ShieldConfigurationExtension
override func configuration(shielding application: Application) -> ShieldConfiguration {
    let clarityScore = UserDefaults(suiteName: "group.exit.app")?.integer(forKey: "clarity_score") ?? 100
    
    if clarityScore < 30 {
        return ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: .systemBackground,
            title: ShieldConfiguration.Label(
                text: "System Entropy: \(100 - clarityScore)%",
                color: .label
            ),
            subtitle: ShieldConfiguration.Label(
                text: "Complete breathing exercise to continue",
                color: .secondaryLabel
            ),
            primaryButtonLabel: ShieldConfiguration.Label(
                text: "Begin",
                color: .white
            ),
            primaryButtonBackgroundColor: .systemBlue
        )
    }
    
    return defaultConfiguration()
}
```

---

## PILLAR 2: THE NEURAL CLARITY SYSTEM

### Concept

**The user interface itself becomes a mirror of attention state.**

As screen time accumulates, visual entropy (Static) increases. The dashboard becomes harder to read—not through gamification, but through literal signal degradation.

### Clarity Score Formula
```
Clarity = 100 - (Entropy - Restoration)

Where:
Entropy = ScreenTime_Minutes × 0.5
Restoration = Actions_Completed × 10
```

**Example Calculations:**

| Scenario | Screen Time | Actions | Entropy | Restoration | Clarity |
|----------|-------------|---------|---------|-------------|---------|
| Clean Start | 0 min | 0 | 0 | 0 | 100% |
| Light Use | 60 min | 0 | 30 | 0 | 70% |
| Heavy Use | 120 min | 0 | 60 | 0 | 40% |
| Restored | 120 min | 3 | 60 | 30 | 70% |

**Bounds:** Clarity is clamped to [0, 100]

### Visual States

| Clarity Range | State Name | Visual Effect | User Experience |
|---------------|------------|---------------|-----------------|
| **80-100%** | Crystal | Clean, standard iOS | Full readability |
| **60-79%** | Clear | Subtle grain texture (5% opacity) | Slightly noticeable |
| **40-59%** | Foggy | Grain texture (15% opacity) | Harder to read stats |
| **20-39%** | Static | Heavy grain (30% opacity) | Dashboard degraded |
| **0-19%** | Critical | Grain + blur (50% opacity) | Nearly unreadable |

### Implementation Notes
```swift
// Static Overlay (SwiftUI)
struct StaticOverlay: View {
    let clarityScore: Int
    
    var opacity: Double {
        let entropy = 100 - clarityScore
        return min(Double(entropy) / 100.0 * 0.5, 0.5)
    }
    
    var body: some View {
        Rectangle()
            .fill(
                Image("grain-texture")
                    .resizable(resizingMode: .tile)
            )
            .opacity(opacity)
            .allowsHitTesting(false)
            .blendMode(.multiply)
    }
}
```

**Asset:** `grain-texture.png` (512×512 tileable noise pattern)

---

## PILLAR 3: THE REPLACEMENT (DOPAMINE MENU)

### Concept

**When entropy is high, the system suggests specific, context-aware actions to restore clarity.**

This is not a generic "go for a walk" suggestion. The menu adapts to:
- Time of day
- Location (home/work/outside)
- Energy level (user-reported)
- Recent completion history

### Action Structure

Each action in the database has:
```json
{
  "id": "act_001",
  "name": "Box Breathing",
  "description": "4-4-4-4 breathing pattern",
  "energy": "low",
  "context": ["home", "work", "outside", "anywhere"],
  "duration_min": 2,
  "clarity_restored": 10,
  "instructions": "Inhale 4 counts, hold 4, exhale 4, hold 4. Repeat 5 cycles.",
  "unlock_level": "npc"
}
```

### Selection Algorithm (MVP)

**Simple Rule-Based System (No AI):**
```typescript
function selectActions(context: UserContext): Action[] {
  const { timeOfDay, energy, location, recentActions } = context;
  
  // Filter by energy level
  let candidates = actions.filter(a => a.energy === energy);
  
  // Filter by context
  candidates = candidates.filter(a => 
    a.context.includes(location) || a.context.includes('anywhere')
  );
  
  // Remove recently completed (last 7 days)
  candidates = candidates.filter(a => 
    !recentActions.includes(a.id)
  );
  
  // Time-based weighting
  if (timeOfDay === 'evening') {
    // Prioritize low-energy actions
    candidates = candidates.filter(a => a.energy === 'low');
  }
  
  // Return top 3 by clarity_restored (descending)
  return candidates
    .sort((a, b) => b.clarity_restored - a.clarity_restored)
    .slice(0, 3);
}
```

### Menu Presentation

**Home Screen Card:**
```
┌─────────────────────────────┐
│  Clarity: 45%               │
│  ▓▓▓▓▓▓▓▓▓░░░░░░░░░░        │
│                             │
│  Suggested Actions:         │
│                             │
│  • Box Breathing (2 min)    │
│    +10% clarity             │
│                             │
│  • Drink Water (1 min)      │
│    +5% clarity              │
│                             │
│  • 5-min Walk (5 min)       │
│    +15% clarity             │
│                             │
│  [View All Actions]         │
└─────────────────────────────┘
```

### Completion Flow

1. User taps action → Timer screen opens
2. Timer completes → Clarity updated immediately
3. Haptic feedback (single medium impact)
4. Dashboard refreshes with new Clarity Score
5. Success message: "Clarity restored to 55%"

---

## PILLAR 4: THE PROGRESSION (LEVELS OF CONSCIOUSNESS)

### Concept

**Users progress through 5 phases based on monthly behavior. Levels are descriptive, not prescriptive—they reflect current state, not permanent identity.**

### Level Definitions

| Level | Name | Unlock Criteria | Average Screen Time | Conscious Days/Month |
|-------|------|----------------|---------------------|---------------------|
| **1** | The NPC | Default (Onboarding) | 4+ hours/day | 0-5 |
| **2** | The Glitch | 7 days <3h/day + 5 interventions/week | 2-3 hours/day | 10-15 |
| **3** | The Hacker | 30 days <2h/day + 15 Conscious Days | 1-2 hours/day | 20-25 |
| **4** | The Main Character | 60 days <1.5h/day + 30 Conscious Days | <1.5 hours/day | 25+ |
| **5** | The Oracle | 90 days <1h/day + 60 Conscious Days | <1 hour/day | 28+ |

### Conscious Day Definition

A day qualifies as "Conscious" if:
```typescript
function isConsciousDay(day: DayData): boolean {
  return (
    day.interventionsAccepted >= 3 &&
    day.screenTimeMinutes < day.userLevelThreshold &&
    day.clarityScore >= 60
  );
}
```

**Example:**
- User at Glitch level (threshold: 180 min/day)
- Screen time: 150 min ✓
- Interventions accepted: 4 ✓
- Clarity score at end of day: 65% ✓
- **Result:** Conscious Day = TRUE

### Level Evaluation Logic

**Monthly Recalibration (Last day of month):**
```typescript
function evaluateLevel(user: User): Level {
  const last30Days = user.getLast30Days();
  
  const avgScreenTime = calculateAverage(last30Days.map(d => d.screenTimeMinutes));
  const consciousDaysCount = last30Days.filter(d => d.isConscious).length;
  
  // Check upgrade thresholds (ascending)
  if (avgScreenTime < 60 && consciousDaysCount >= 60) return Level.Oracle;
  if (avgScreenTime < 90 && consciousDaysCount >= 30) return Level.MainCharacter;
  if (avgScreenTime < 120 && consciousDaysCount >= 15) return Level.Hacker;
  if (avgScreenTime < 180 && consciousDaysCount >= 5) return Level.Glitch;
  
  return Level.NPC;
}
```

### Downgrade Rules

**Grace Period:** User must exceed threshold for **7 consecutive days** before downgrade.

**Example:**
- User at Hacker (threshold: 120 min/day)
- Days 1-7: 150, 140, 160, 155, 145, 150, 140 min
- **Result:** Downgrade to Glitch on Day 8

**Messaging:**
- No shame language
- Frame as "Your signal is drifting. Let's stabilize."
- Provide specific action plan: "Focus on 3 interventions daily this week."

### Level Perks (UI Only)

| Level | Unlocks |
|-------|---------|
| **Glitch** | Extended action library (20 → 30 actions) |
| **Hacker** | Weekly detailed analytics |
| **Main Character** | Custom action creation |
| **Oracle** | Full system customization |

**Note:** These are UI unlocks, not paywalled features. Progression is earned, not purchased.

---

## MECHANICAL INTERACTIONS

### System Loop (Daily Cycle)
```
Morning (6 AM):
├─ Clarity resets to previous day's ending score
├─ Entropy counter starts at 0
└─ Daily suggested actions refresh

Throughout Day:
├─ Screen time accumulates → Entropy increases
├─ App switches detected → Pattern flags set
├─ Interventions triggered → Shield activates
└─ Actions completed → Clarity restored

Evening (11 PM):
├─ Day evaluated for Conscious Day status
├─ Streak updated (if qualified)
├─ Data logged for monthly evaluation
└─ Dashboard shows final Clarity Score
```

### State Persistence

**On-Device (MMKV):**
- Current Clarity Score
- Today's screen time breakdown
- Intervention history (timestamps only)
- Action completion history

**Cloud Sync (Firebase - Anonymized):**
- Daily aggregate: Clarity Score, Conscious Day boolean
- Monthly aggregate: Level, Streak count
- No raw app usage data

---

## EDGE CASES & FAILSAFES

### If User Force-Quits During Intervention

- **Behavior:** Challenge marked as "Abandoned"
- **Consequence:** Shield remains locked
- **Recovery:** User can retry immediately (no cooldown)

### If User Puts Phone in Airplane Mode

- **Behavior:** System continues to function (local-first)
- **Sync:** Data syncs when connection restored
- **No Penalty:** Offline mode does not affect Clarity Score

### If User Uninstalls and Reinstalls

- **Behavior:** Cloud data restores (Level, Streak, History)
- **Local Data:** Recent actions lost (last 7 days)
- **Grace:** First 3 days after reinstall are "recalibration period" (no downgrades)

---

## PERFORMANCE REQUIREMENTS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Shield Display Latency | <150ms | Xcode Instruments |
| Clarity Score Update | <100ms | Local computation |
| Action Suggestion Load | <200ms | Database query |
| Static Overlay Frame Rate | 60 FPS | Xcode GPU profiler |

---

## APPENDIX: FORMULAS REFERENCE

### Entropy Accumulation
```
Entropy(t) = Σ(ScreenTime_per_app × App_Weight × 0.5)

App Weights:
- TikTok, Instagram: 1.5× (high dopamine variance)
- Twitter, Reddit: 1.0× (medium)
- YouTube, Netflix: 0.5× (passive consumption)
```

### Restoration Rate
```
Restoration = Σ(Action_Clarity_Value)

Action Values:
- Breathing exercises: 10-15 points
- Movement (walk, stretch): 15-20 points
- Deep actions (30+ min): 25-30 points
```

### Conscious Day Score
```
Score = (Interventions_Accepted × 20) + (Clarity_End_of_Day × 0.5)

Threshold: Score >= 80 → Conscious Day = TRUE
```

---

**Document Status:** Ready for Engineering Implementation  
**Next Review:** Post-MVP Beta (Week 8)  
**Questions:** Contact Lead Systems Architect

---
