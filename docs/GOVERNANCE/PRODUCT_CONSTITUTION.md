# Exit - Product Constitution
## Non-Negotiable Principles & Safety Rails

**Version:** 1.0  
**Status:** IMMUTABLE (Changes require founder approval)  
**Last Updated:** January 2026

---

## PREAMBLE

This document defines the **inviolable principles** that govern Exit's product development. These are not guidelines—they are constitutional constraints that cannot be overridden by feature requests, growth pressure, or competitive dynamics.

Violation of these principles damages the product's core value proposition and user trust.

---

## ARTICLE I: PHILOSOPHY

### Section 1.1: Identity Statement

Exit is a **Personalized Behavioral Recommender System (PBRS)** that helps users develop intentional relationships with their phones through:

- Awareness (not abstinence)
- Maintenance (not debt)
- Signal (not shame)
- Clarity (not punishment)

### Section 1.2: What Exit IS

| Exit IS | Because |
|---------|---------|
| A nervous system regulation tool | Phone addiction is a stress response |
| A personalization engine | One-size-fits-all interventions fail |
| A deterministic learning system | Users need to trust recommendations |
| A premium lifestyle product | Quality users demand quality UX |

### Section 1.3: What Exit IS NOT

| Exit is NOT | Because |
|-------------|---------|
| A content platform | We don't need volume, we need precision |
| A social network | Competition breeds anxiety |
| A punishment system | Shame drives relapse |
| An AI chatbot | Users need agency, not conversation |

---

## ARTICLE II: CONTENT CONSTRAINTS

### Section 2.1: Micro-Action Limits

```
MAXIMUM MICRO-ACTIONS IN PRODUCTION: 50
```

**Rationale:**
- Quality over quantity
- Each action requires extensive tagging
- Testing requires real-world validation
- Personalization requires consistent parameters

**Expansion Protocol:**
1. Identify gap in current coverage
2. Design action with full schema compliance
3. Internal testing (2 weeks minimum)
4. Beta testing (100 users minimum)
5. Approval from behavioral psychologist
6. Only then: Add to production

### Section 2.2: Quest Archetype Limits

```
MAXIMUM QUEST ARCHETYPES: 20
CAPPED PERMANENTLY
```

**Current Archetypes:**
1. Presence (attention)
2. Connection (social)
3. Creation (agency)
4. Restoration (recovery)
5. Mastery (growth)

**Why Capped:**
- Quests are behavioral contracts, not content
- Archetypes define intent, not variety
- Variety comes from personalized assembly
- Adding archetypes dilutes meaning

### Section 2.3: Content Origin Prohibition

```
NO SCRAPED CONTENT
NO AI-GENERATED RECOMMENDATIONS
NO USER-SUBMITTED ACTIONS (without full review)
```

**Prohibited Sources:**
- Web scraping of habit/wellness sites
- LLM-generated action suggestions
- Bulk import from other apps
- Unvetted user submissions

**Required Process:**
- Human curation
- Research citation
- Schema compliance
- Behavioral review

---

## ARTICLE III: ALGORITHM CONSTRAINTS

### Section 3.1: Determinism Requirement

```
EVERY RECOMMENDATION MUST BE DETERMINISTIC AND EXPLAINABLE
```

**This means:**
- Same inputs → same outputs
- No randomness disguised as intelligence
- Every selection traceable through pipeline
- No black-box AI/ML in recommendation path

**Prohibited:**
- Neural network-based recommendations
- "AI suggests" language
- Opaque ranking algorithms
- A/B tests that affect core selection

### Section 3.2: Difficulty Bounds

```
MAXIMUM DIFFICULTY STRETCH: 15%
MAXIMUM SINGLE JUMP: 20%
MINIMUM COMPLETIONS BEFORE INCREASE: 3
AUTOMATIC REGRESSION AFTER 2 ABANDONS
```

**Rationale:**
- Frustration causes abandonment
- Gradual progression builds confidence
- Safety bounds prevent system gaming
- User trust requires predictability

### Section 3.3: Feedback Requirements

```
EVERY USER INTERACTION MUST UPDATE USER STATE
```

**Required Signals:**
- Completion → capacity increase
- Abandon (early) → capacity decrease, potential block
- Abandon (late) → slight capacity decrease
- Skip → category cooldown accumulation

**Prohibited:**
- Ignoring user signals
- Delayed state updates
- Aggregate-only learning
- "Fire and forget" recommendations

---

## ARTICLE IV: DATA CONSTRAINTS

### Section 4.1: Privacy First

```
RAW USAGE DATA NEVER LEAVES THE DEVICE
```

**On-Device Only:**
- Screen time data (per-app)
- Notification events
- Pickup timestamps
- Location coordinates
- Message content

**Sync Permitted (Anonymized):**
- Aggregate dimension scores
- Action completion rates
- Streak data
- Level progression

### Section 4.2: Data Minimization

```
COLLECT ONLY WHAT IS NEEDED FOR PBRS
```

**Required:**
- Screen time (for addiction modeling)
- App categories (for pattern inference)
- Action outcomes (for capacity calibration)

**Prohibited:**
- Browsing history
- Message content
- Contact lists
- Location history (only current context)

### Section 4.3: User Control

```
USERS CAN DELETE ALL DATA INSTANTLY
NO RETENTION AFTER DELETION
```

---

## ARTICLE V: UX CONSTRAINTS

### Section 5.1: No Punishment Mechanics

```
EXIT NEVER MAKES THE USER FEEL WORSE
```

**Prohibited Language:**
- "You failed"
- "You relapsed"
- "Debt"
- "Penalty"
- "Punishment"
- "Addicted"

**Required Language:**
- "Signal"
- "Static"
- "Clarity"
- "Maintenance"
- "Progress"
- "Learning"

### Section 5.2: No FOMO Mechanics

```
EXIT NEVER CREATES ARTIFICIAL URGENCY
```

**Prohibited:**
- "Limited time offers"
- "Streak about to break!"
- "Your friends are ahead of you"
- "Don't miss out"
- Countdown timers (except active exercises)

**Permitted:**
- Gentle streak reminders (1x daily max)
- Progress celebrations
- Milestone acknowledgments

### Section 5.3: No Infinite Content

```
EXIT NEVER BECOMES A SCROLL DESTINATION
```

**Prohibited:**
- Infinite scroll interfaces
- Content feeds
- Social timelines
- Endless "more" buttons

**Required:**
- Finite, curated options
- Clear completion states
- Intentional endings

### Section 5.4: No Social Comparison by Default

```
LEADERBOARDS ARE OPT-IN ONLY
```

**Default State:**
- No public profiles
- No ranking displays
- No "friend activity"

**Opt-In Only:**
- Clarity Circle (private groups)
- Collective Signal (anonymized)

### Section 5.5: iOS-Native, Not iOS-Generic

```
EXIT FEELS CALMER THAN iOS ITSELF
```

Exit uses Apple Human Interface patterns (spacing, gestures, physics) as a foundation, but:

**Avoid:**
- Gamified UI elements
- Achievement badges everywhere
- Dense data displays
- Neon accents
- Streak flames

**Use:**
- Generous whitespace
- Subtle depth (shadows, blur)
- Predictable navigation
- Haptic confirmation

### Section 5.6: Zero Cognitive Debt

```
EVERY SCREEN ANSWERS ONE QUESTION ONLY
```

| Screen | Question |
|--------|----------|
| HOME | "What's my state right now?" |
| MENU | "What can I do to feel better?" |
| QUEST | "What's my intention for today?" |
| YOU | "What have I noticed about myself?" |

**Rules:**
- No multi-purpose screens
- No "while you're here" prompts
- No secondary CTAs competing for attention
- No scroll-to-discover patterns

### Section 5.7: App as Threshold, Not Destination

```
TARGET SESSION LENGTH: < 20 SECONDS
```

Exit is something you **enter briefly** and **leave immediately**.

| Metric | Target |
|--------|--------|
| Average session | < 20 seconds |
| Time to first action | < 5 seconds |
| Decisions per session | ≤ 1 |

**The goal is to get users OFF their phone, not to keep them in the app.**

### Section 5.8: Navigation Constraints

```
EXACTLY 4 TABS, NO MORE
```

```
[ HOME ]   [ MENU ]   [ QUEST ]   [ YOU ]
```

- No fifth tab ever
- No "Explore" or "Discover" tab
- HOME is default open
- No badges/counts on tabs

### Section 5.9: Visual Constraints

```
BRIGHTNESS INDICATES STATE, NOT HUE
```

- Static levels change brightness, not color
- No red/green success/failure coding
- Single accent color (sage, amber, or slate)
- Maximum 2 font families

### Section 5.10: Forbidden UI Patterns

| Pattern | Why Forbidden |
|---------|---------------|
| Shows streak flames | Creates anxiety about breaking |
| Uses confetti | Turns recovery into performance |
| Displays rankings | Introduces comparison |
| Forces decisions | Respects user autonomy |
| Shames relapse | Shame drives relapse |
| Locks features behind performance | Recovery isn't earned |
| Shows countdown timers | Creates urgency/anxiety |
| Uses red for failure | Avoids punishment framing |
| Sends "you're falling behind" notifications | No FOMO |

### Section 5.11: Required UI Patterns

| Principle | Implementation |
|-----------|----------------|
| Allows skipping | Every action has skip option |
| Allows opting out | All features toggleable |
| Adjusts difficulty invisibly | PBRS handles calibration |
| Feels quieter than the phone | Minimal animation, soft colors |
| Respects "not now" | No nag screens |
| Provides graceful exits | One tap to close anything |

---

## ARTICLE VI: MONETIZATION CONSTRAINTS

### Section 6.1: Value Before Revenue

```
FREE TIER MUST DELIVER REAL VALUE
```

**Free Tier Includes:**
- Core PBRS functionality
- 5+ micro-actions
- Basic progress tracking
- Pattern breaks
- Daily quest (1)

**Pro Tier Adds:**
- Full action library
- Deep actions
- Weekly reports
- Clarity Circle
- Priority support

### Section 6.2: No Dark Patterns

```
EXIT NEVER TRICKS USERS INTO PAYING
```

**Prohibited:**
- Fake scarcity
- Hidden costs
- Subscription traps
- Upgrade nag screens
- Paywalled core functionality

**Required:**
- Clear pricing
- Easy cancellation
- Transparent feature gates
- Value-first messaging

---

## ARTICLE VII: TECHNICAL CONSTRAINTS

### Section 7.1: Performance Standards

| Metric | Requirement |
|--------|-------------|
| Recommendation latency | < 100ms |
| State update latency | < 50ms |
| App cold start | < 3 seconds |
| Animation frame rate | 60 FPS |
| Battery drain | < 8% daily |

### Section 7.2: Reliability Standards

```
OFFLINE-FIRST ARCHITECTURE
```

**Required:**
- Full functionality without network
- Local state persistence
- Graceful sync when connected
- No hard network dependencies

### Section 7.3: Accessibility Standards

```
WCAG 2.1 AA COMPLIANCE MINIMUM
```

**Required:**
- Screen reader support
- High contrast mode
- Reduced motion option
- Touch target sizing
- Color-blind friendly palette

---

## ARTICLE VIII: GOVERNANCE

### Section 8.1: Amendment Process

Constitutional changes require:
1. Written proposal with rationale
2. Impact assessment
3. Founder approval
4. 7-day review period
5. Team notification

### Section 8.2: Violation Reporting

Team members are encouraged to report violations:
- No retaliation
- Confidential review
- Mandatory response within 48h

### Section 8.3: Enforcement

Violations result in:
1. First offense: Review and correction
2. Second offense: Post-mortem and process change
3. Repeated: Role reassessment

---

## SIGNATURES

By working on Exit, all team members acknowledge these principles.

```
This Constitution was ratified on [DATE]
Version: 1.0
```

---

## APPENDIX: QUICK REFERENCE CARD

### Always Do:
✅ Personalize based on computed state
✅ Explain every recommendation
✅ Respect user capacity bounds
✅ Process all feedback signals
✅ Protect user privacy
✅ Use positive framing

### Never Do:
❌ Scrape content from web
❌ Use AI for selection
❌ Exceed 15% stretch
❌ Punish or shame users
❌ Create FOMO
❌ Sync raw usage data
❌ Add content without review
❌ Ignore user signals

---

*This document is the constitutional foundation of Exit.*
*It exists to protect users from us, and us from ourselves.*
