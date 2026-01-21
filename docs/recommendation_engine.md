# Exit - Recommendation Engine Specification
## Technical Implementation Guide for PBRS

**Version:** 1.0  
**Status:** Implementation Ready  
**Last Updated:** January 2026

---

## OVERVIEW

This document specifies the **exact algorithm** for selecting micro-actions and assembling quests. It is written for implementation by both human developers and agentic coding systems.

---

## 1. PIPELINE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                   RECOMMENDATION PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  INPUT                                                           │
│  ─────                                                           │
│  • UserState (full composite)                                   │
│  • ActionCatalog (all micro-actions)                            │
│  • RequestContext { type, count, urgency }                      │
│                                                                  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGE 1: ELIGIBILITY FILTER                             │   │
│  │                                                          │   │
│  │  Remove actions that are:                                │   │
│  │  • Above user's unlock level                             │   │
│  │  • Incompatible with current context                     │   │
│  │  • On cooldown                                           │   │
│  │  • Permanently blocked                                   │   │
│  │                                                          │   │
│  │  Output: EligibleActions[]                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGE 2: RELEVANCE SCORING                              │   │
│  │                                                          │   │
│  │  Score each action on:                                   │   │
│  │  • Psychotype compatibility                              │   │
│  │  • Addiction profile match                               │   │
│  │  • Nervous system need                                   │   │
│  │  • Context freshness                                     │   │
│  │                                                          │   │
│  │  Output: ScoredActions[]                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGE 3: DIFFICULTY CALIBRATION                         │   │
│  │                                                          │   │
│  │  For each action:                                        │   │
│  │  • Compute difficulty fit vs capacity + stretch          │   │
│  │  • Penalize if too easy or too hard                      │   │
│  │  • Apply safety bounds                                   │   │
│  │                                                          │   │
│  │  Output: CalibratedActions[]                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGE 4: DIVERSITY ENFORCEMENT                          │   │
│  │                                                          │   │
│  │  Boost actions from:                                     │   │
│  │  • Unused categories                                     │   │
│  │  • Different modalities                                  │   │
│  │  • Different nervous system effects                      │   │
│  │                                                          │   │
│  │  Output: DiversifiedActions[]                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  STAGE 5: FINAL SELECTION                                │   │
│  │                                                          │   │
│  │  • Compute final weighted score                          │   │
│  │  • Sort descending                                       │   │
│  │  • Take top N                                            │   │
│  │  • Apply final constraints                               │   │
│  │                                                          │   │
│  │  Output: SelectedActions[]                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  OUTPUT                                                          │
│  ──────                                                          │
│  • Ordered list of recommended actions                          │
│  • Explanation for each (debuggable)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. STAGE 1: ELIGIBILITY FILTER

### Purpose
Binary pass/fail filter to remove impossible or inappropriate actions.

### Algorithm

```typescript
function filterEligible(
  actions: MicroAction[],
  user: UserState
): MicroAction[] {
  return actions.filter(action => {
    // 1. Level check
    if (!isUnlocked(action.unlock_level, user.level)) {
      return false;
    }
    
    // 2. Context check
    if (!action.valid_contexts.includes(user.context.locationContext) &&
        !action.valid_contexts.includes('anywhere')) {
      return false;
    }
    
    // 3. Time check
    if (!action.valid_times.includes(user.context.timeOfDay) &&
        !action.valid_times.includes('anytime')) {
      return false;
    }
    
    // 4. Cooldown check
    const lastUse = user.capacity.recent_completions
      .find(c => c.action_id === action.id);
    if (lastUse) {
      const hoursSince = hoursBetween(lastUse.timestamp, now());
      if (hoursSince < action.cooldown_hours) {
        return false;
      }
    }
    
    // 5. Category cooldown check
    const categoryCooldown = user.capacity.category_cooldowns[action.category];
    if (categoryCooldown && categoryCooldown > now()) {
      return false;
    }
    
    // 6. Permanent block check
    if (user.capacity.blocked_actions.includes(action.id)) {
      return false;
    }
    
    // 7. Free tier check
    if (!user.isPro && !action.is_free_tier) {
      return false;
    }
    
    return true;
  });
}

function isUnlocked(required: string, current: string): boolean {
  const levels = ['npc', 'glitch', 'hacker', 'main_character', 'oracle'];
  return levels.indexOf(current) >= levels.indexOf(required);
}
```

### Expected Reduction
Typically filters out 40-60% of catalog.

---

## 3. STAGE 2: RELEVANCE SCORING

### Purpose
Score each action on how well it matches the user's psychological profile.

### Algorithm

```typescript
function scoreRelevance(
  action: MicroAction,
  user: UserState
): number {
  // 3.1 Psychotype compatibility (35%)
  const psychotypeScore = dotProduct(
    [
      action.psychotype_compatibility.novelty_seeking,
      action.psychotype_compatibility.dissociation,
      action.psychotype_compatibility.control_seeking,
      action.psychotype_compatibility.social_dependency,
    ],
    [
      user.cognitive.novelty_seeking,
      user.cognitive.dissociation,
      user.cognitive.control_seeking,
      user.cognitive.social_dependency,
    ]
  );
  
  // 3.2 Addiction profile match (30%)
  const addictionScore = computeAddictionMatch(action, user.addiction);
  
  // 3.3 Nervous system need (20%)
  const nsScore = computeNervousSystemNeed(action, user);
  
  // 3.4 Context freshness (15%)
  const freshnessScore = computeFreshness(action, user);
  
  return (
    0.35 * psychotypeScore +
    0.30 * addictionScore +
    0.20 * nsScore +
    0.15 * freshnessScore
  );
}

function computeAddictionMatch(
  action: MicroAction,
  addiction: AddictionProfile
): number {
  // Higher compatibility scores for higher addiction dimensions
  let score = 0;
  
  if (addiction.intensity > 0.5) {
    score += action.addiction_compatibility.high_intensity;
  }
  if (addiction.fragmentation > 0.5) {
    score += action.addiction_compatibility.high_fragmentation;
  }
  if (addiction.compulsion > 0.5) {
    score += action.addiction_compatibility.high_compulsion;
  }
  if (addiction.avoidance > 0.5) {
    score += action.addiction_compatibility.high_avoidance;
  }
  
  // Normalize to 0-1
  return score / 4;
}

function computeNervousSystemNeed(
  action: MicroAction,
  user: UserState
): number {
  const staticLevel = user.context.currentStaticLevel;
  
  // High static → need calming/grounding
  // Low static → can handle activating
  const needsCalming = staticLevel > 60;
  const needsGrounding = staticLevel > 40;
  
  if (needsCalming) {
    return action.nervous_system_effect === 'calming' ? 1.0 :
           action.nervous_system_effect === 'regulating' ? 0.7 :
           action.nervous_system_effect === 'grounding' ? 0.5 : 0.2;
  }
  
  if (needsGrounding) {
    return action.nervous_system_effect === 'grounding' ? 1.0 :
           action.nervous_system_effect === 'regulating' ? 0.8 :
           action.nervous_system_effect === 'calming' ? 0.6 : 0.4;
  }
  
  // Low static - any effect is fine
  return 0.7;
}

function computeFreshness(
  action: MicroAction,
  user: UserState
): number {
  // Time since last use of this category
  const categoryUses = user.capacity.recent_completions
    .filter(c => c.category === action.category);
  
  if (categoryUses.length === 0) {
    return 1.0; // Never used - maximum freshness
  }
  
  const lastUse = categoryUses[categoryUses.length - 1];
  const hoursSince = hoursBetween(lastUse.timestamp, now());
  
  // Freshness increases with time, capped at 24h
  return Math.min(1.0, hoursSince / 24);
}
```

---

## 4. STAGE 3: DIFFICULTY CALIBRATION

### Purpose
Ensure actions are within the **15% stretch zone** - challenging but achievable.

### Algorithm

```typescript
function calibrateDifficulty(
  action: MicroAction,
  user: UserState
): number {
  const capacity = user.capacity;
  const stretch = capacity.current_stretch;
  
  // Compute target for each dimension
  const targets = {
    friction: capacity.friction_tolerance + stretch,
    embodiment: capacity.embodiment_tolerance + stretch,
    stillness: capacity.stillness_tolerance + stretch,
    novelty: capacity.novelty_tolerance + stretch,
  };
  
  // Compute delta for each dimension
  const deltas = {
    friction: Math.abs(action.friction - targets.friction),
    embodiment: Math.abs(action.embodiment - targets.embodiment),
    stillness: Math.abs(action.stillness - targets.stillness),
    novelty: Math.abs(action.novelty - targets.novelty),
  };
  
  // Average delta (lower is better)
  const avgDelta = (
    deltas.friction + 
    deltas.embodiment + 
    deltas.stillness + 
    deltas.novelty
  ) / 4;
  
  // Convert to score (0-1 where 1 is perfect match)
  let difficultyFit = 1.0 - avgDelta;
  
  // Apply safety bounds
  const actionAvgDifficulty = (
    action.friction + 
    action.embodiment + 
    action.stillness + 
    action.novelty
  ) / 4;
  
  // Penalize if below floor
  if (actionAvgDifficulty < capacity.floor) {
    difficultyFit *= 0.5;
  }
  
  // Penalize if above ceiling
  if (actionAvgDifficulty > capacity.ceiling) {
    difficultyFit *= 0.3;
  }
  
  // Heavy penalty for poor fit
  if (difficultyFit < 0.7) {
    difficultyFit *= 0.5;
  }
  
  return Math.max(0, difficultyFit);
}
```

---

## 5. STAGE 4: DIVERSITY ENFORCEMENT

### Purpose
Prevent monotony by boosting variety across categories, modalities, and effects.

### Algorithm

```typescript
function enforceDiversity(
  action: MicroAction,
  user: UserState
): number {
  // 5.1 Category recency (40%)
  const categoryRecency = computeCategoryRecency(action.category, user);
  
  // 5.2 Modality recency (35%)
  const modalityRecency = computeModalityRecency(action, user);
  
  // 5.3 Effect recency (25%)
  const effectRecency = computeEffectRecency(action, user);
  
  return (
    0.40 * categoryRecency +
    0.35 * modalityRecency +
    0.25 * effectRecency
  );
}

function computeCategoryRecency(
  category: string,
  user: UserState
): number {
  const uses = user.capacity.recent_completions
    .filter(c => c.category === category);
  
  if (uses.length === 0) return 1.0;
  
  const lastUse = uses[uses.length - 1];
  const hoursSince = hoursBetween(lastUse.timestamp, now());
  
  return Math.min(1.0, hoursSince / 24);
}

function computeModalityRecency(
  action: MicroAction,
  user: UserState
): number {
  // Map action to modality
  const modality = inferModality(action);
  
  const uses = user.capacity.recent_completions
    .filter(c => inferModality(getActionById(c.action_id)) === modality);
  
  if (uses.length === 0) return 1.0;
  
  const lastUse = uses[uses.length - 1];
  const hoursSince = hoursBetween(lastUse.timestamp, now());
  
  return Math.min(1.0, hoursSince / 12);
}

function inferModality(action: MicroAction): string {
  if (action.embodiment > 0.6) return 'movement';
  if (action.stillness > 0.6) return 'stillness';
  if (action.category === 'sensory') return 'sensory';
  return 'cognitive';
}
```

---

## 6. STAGE 5: FINAL SELECTION

### Purpose
Combine all scores and select the top N actions.

### Algorithm

```typescript
interface ScoredAction {
  action: MicroAction;
  relevanceScore: number;
  difficultyScore: number;
  diversityScore: number;
  finalScore: number;
  explanation: string;
}

function selectActions(
  eligibleActions: MicroAction[],
  user: UserState,
  count: number = 5
): ScoredAction[] {
  // Score all actions
  const scored: ScoredAction[] = eligibleActions.map(action => {
    const relevanceScore = scoreRelevance(action, user);
    const difficultyScore = calibrateDifficulty(action, user);
    const diversityScore = enforceDiversity(action, user);
    
    // Compute efficiency bonus
    const efficiencyScore = action.static_cleared / action.duration_max;
    
    // Weighted final score
    const finalScore = (
      0.35 * relevanceScore +
      0.30 * difficultyScore +
      0.20 * diversityScore +
      0.15 * efficiencyScore
    );
    
    // Generate explanation
    const explanation = generateExplanation(
      action, relevanceScore, difficultyScore, diversityScore
    );
    
    return {
      action,
      relevanceScore,
      difficultyScore,
      diversityScore,
      finalScore,
      explanation,
    };
  });
  
  // Apply final penalties
  scored.forEach(s => {
    // Permanent block (should already be filtered, but safety check)
    if (user.capacity.blocked_actions.includes(s.action.id)) {
      s.finalScore = 0;
    }
    
    // Aversion category penalty
    if (isAversionCategory(s.action.category, user)) {
      s.finalScore *= 0.5;
    }
  });
  
  // Sort by final score
  scored.sort((a, b) => b.finalScore - a.finalScore);
  
  // Take top N
  return scored.slice(0, count);
}

function generateExplanation(
  action: MicroAction,
  relevance: number,
  difficulty: number,
  diversity: number
): string {
  const reasons: string[] = [];
  
  if (relevance > 0.7) {
    reasons.push('Matches your thinking patterns');
  }
  if (difficulty > 0.8) {
    reasons.push('Right challenge level for you');
  }
  if (diversity > 0.8) {
    reasons.push('Something different from recent actions');
  }
  
  return reasons.join('. ') || 'Good option based on your current state';
}
```

---

## 7. FEEDBACK PROCESSING

### Purpose
Update user state based on action outcomes.

### Algorithm

```typescript
interface ActionOutcome {
  action_id: string;
  started_at: Date;
  ended_at: Date;
  outcome: 'completed' | 'abandoned' | 'skipped';
  completion_percentage?: number;
}

function processFeedback(
  outcome: ActionOutcome,
  user: UserState
): UserState {
  const action = getActionById(outcome.action_id);
  
  switch (outcome.outcome) {
    case 'completed':
      return processCompletion(outcome, action, user);
    case 'abandoned':
      return processAbandon(outcome, action, user);
    case 'skipped':
      return processSkip(outcome, action, user);
  }
}

function processCompletion(
  outcome: ActionOutcome,
  action: MicroAction,
  user: UserState
): UserState {
  const updated = { ...user };
  
  // Update capacity
  updated.capacity.consecutive_completions++;
  updated.capacity.consecutive_abandons = 0;
  
  if (updated.capacity.consecutive_completions >= 3) {
    // Increase capacity in primary dimension
    const primaryDimension = getPrimaryDimension(action);
    updated.capacity[`${primaryDimension}_tolerance`] = Math.min(
      0.9,
      updated.capacity[`${primaryDimension}_tolerance`] + 0.02
    );
    
    // Slightly increase stretch
    updated.capacity.current_stretch = Math.min(
      0.20,
      updated.capacity.current_stretch + 0.01
    );
    
    updated.capacity.consecutive_completions = 0;
  }
  
  // Record completion
  updated.capacity.recent_completions.push({
    action_id: action.id,
    category: action.category,
    timestamp: outcome.ended_at,
  });
  
  // Limit recent history
  if (updated.capacity.recent_completions.length > 50) {
    updated.capacity.recent_completions.shift();
  }
  
  // Award XP
  const xpGained = computeXP(action, user);
  updated.xp += xpGained;
  
  // Clear static
  // (Handled by main app, not PBRS)
  
  return updated;
}

function processAbandon(
  outcome: ActionOutcome,
  action: MicroAction,
  user: UserState
): UserState {
  const updated = { ...user };
  const completion = outcome.completion_percentage || 0;
  
  updated.capacity.consecutive_abandons++;
  updated.capacity.consecutive_completions = 0;
  
  const primaryDimension = getPrimaryDimension(action);
  
  if (completion < 0.3) {
    // Early abandon - action was too hard
    updated.capacity[`${primaryDimension}_tolerance`] = Math.max(
      0.1,
      updated.capacity[`${primaryDimension}_tolerance`] - 0.05
    );
    
    // Track for potential permanent block
    const abandonCount = countAbandons(action.id, updated);
    if (abandonCount >= 3) {
      updated.capacity.blocked_actions.push(action.id);
    }
  } else {
    // Late abandon - slightly too hard
    updated.capacity[`${primaryDimension}_tolerance`] = Math.max(
      0.1,
      updated.capacity[`${primaryDimension}_tolerance`] - 0.02
    );
  }
  
  if (updated.capacity.consecutive_abandons >= 2) {
    // Reduce stretch
    updated.capacity.current_stretch = Math.max(
      0.05,
      updated.capacity.current_stretch - 0.05
    );
    updated.capacity.consecutive_abandons = 0;
  }
  
  return updated;
}

function processSkip(
  outcome: ActionOutcome,
  action: MicroAction,
  user: UserState
): UserState {
  const updated = { ...user };
  
  // Track category skips
  const skipKey = `skipped_${action.category}`;
  updated.capacity[skipKey] = (updated.capacity[skipKey] || 0) + 1;
  
  if (updated.capacity[skipKey] >= 3) {
    // Put category on cooldown
    updated.capacity.category_cooldowns[action.category] = 
      new Date(Date.now() + 24 * 60 * 60 * 1000);
    updated.capacity[skipKey] = 0;
  }
  
  return updated;
}
```

---

## 8. QUEST ASSEMBLY

### Purpose
Assemble a quest by selecting micro-actions that satisfy constraints.

### Algorithm

```typescript
interface QuestAssembly {
  quest_id: string;
  actions: MicroAction[];
  total_duration: number;
  total_static_cleared: number;
}

function assembleQuest(
  template: QuestTemplate,
  user: UserState,
  catalog: MicroAction[]
): QuestAssembly | null {
  // Check eligibility
  if (!isQuestEligible(template, user)) {
    return null;
  }
  
  // Get eligible actions
  const eligible = filterEligible(catalog, user);
  
  // Apply quest-specific filters
  const questFiltered = eligible.filter(action => {
    // Required categories
    if (template.assembly.required_categories.length > 0 &&
        !template.assembly.required_categories.includes(action.category)) {
      return false;
    }
    
    // Banned categories
    if (template.assembly.banned_categories.includes(action.category)) {
      return false;
    }
    
    return true;
  });
  
  // Select actions to meet constraints
  const selected: MicroAction[] = [];
  let totalFriction = 0;
  let totalEmbodiment = 0;
  
  // Follow nervous system sequence if specified
  const sequence = template.assembly.nervous_system_sequence;
  
  for (let i = 0; i < sequence.length; i++) {
    const effect = sequence[i];
    
    const candidates = questFiltered
      .filter(a => a.nervous_system_effect === effect)
      .filter(a => !selected.includes(a));
    
    if (candidates.length === 0) {
      // Can't fulfill sequence
      return null;
    }
    
    // Select best fit
    const scored = candidates.map(a => ({
      action: a,
      score: scoreRelevance(a, user) + calibrateDifficulty(a, user),
    }));
    scored.sort((a, b) => b.score - a.score);
    
    const chosen = scored[0].action;
    
    // Check cumulative constraints
    if (totalFriction + chosen.friction > template.assembly.max_total_friction) {
      continue; // Skip this one, try next
    }
    if (totalEmbodiment + chosen.embodiment > template.assembly.max_total_embodiment) {
      continue;
    }
    
    selected.push(chosen);
    totalFriction += chosen.friction;
    totalEmbodiment += chosen.embodiment;
    
    if (selected.length >= template.assembly.max_actions) {
      break;
    }
  }
  
  // Check minimum actions met
  if (selected.length < template.assembly.min_actions) {
    return null;
  }
  
  return {
    quest_id: template.id,
    actions: selected,
    total_duration: selected.reduce((sum, a) => sum + a.duration_max, 0),
    total_static_cleared: selected.reduce((sum, a) => sum + a.static_cleared, 0),
  };
}
```

---

## 9. DEBUGGING & EXPLAINABILITY

### Purpose
Every recommendation must be traceable for debugging and user trust.

### Explanation Format

```typescript
interface RecommendationExplanation {
  action_id: string;
  
  // Why this action passed filtering
  eligibility: {
    level_check: 'pass' | 'fail';
    context_check: 'pass' | 'fail';
    cooldown_check: 'pass' | 'fail';
  };
  
  // Score breakdown
  scores: {
    relevance: number;
    relevance_breakdown: {
      psychotype_match: number;
      addiction_match: number;
      ns_need: number;
      freshness: number;
    };
    difficulty: number;
    difficulty_breakdown: {
      friction_delta: number;
      embodiment_delta: number;
      stillness_delta: number;
      novelty_delta: number;
      within_bounds: boolean;
    };
    diversity: number;
    final: number;
  };
  
  // Human-readable reason
  human_explanation: string;
}
```

### Logging Requirements

All PBRS operations must log:
1. Input user state hash
2. Catalog version
3. Filter results (count in → count out)
4. Top 10 scores (for debugging)
5. Final selection
6. Processing time

---

## 10. PERFORMANCE REQUIREMENTS

| Operation | Max Latency | Notes |
|-----------|-------------|-------|
| Full recommendation (5 actions) | 100ms | Including all stages |
| Single action score | 2ms | Per action |
| Feedback processing | 50ms | State update |
| Quest assembly | 200ms | More complex |

### Optimization Guidelines
- Pre-filter catalog on app open (cache eligible set)
- Cache computed scores for 5 minutes
- Use incremental updates for user state (not full recompute)

---

*This document is the implementation specification for PBRS.*
*All code must follow these algorithms exactly.*
