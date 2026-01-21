/**
 * Exit - PBRS Type Definitions
 * 
 * Canonical type definitions for the Personalized Behavioral Recommender System.
 * All other modules must import from this file.
 */

// ═══════════════════════════════════════════════════════════════════════════
// USER STATE MODELS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Quantifies phone dependency across four orthogonal dimensions.
 * Computed daily from raw usage data.
 */
export interface AddictionProfile {
  // Core dimensions (0.0 - 1.0)
  intensity: number;
  fragmentation: number;
  compulsion: number;
  avoidance: number;
  
  // Derived metrics
  overallSeverity: number;
  dominantPattern: 'social' | 'entertainment' | 'information' | 'gaming';
  primaryProblemCategory: string;
  
  // Metadata
  lastComputed: Date;
  dataWindowDays: number;
  dataQuality: number;
  trend: 'improving' | 'stable' | 'worsening';
}

/**
 * Infers psychological relationship with phone from behavior.
 * Determines which interventions will resonate.
 */
export interface CognitivePattern {
  // Pattern weights (must sum to 1.0)
  novelty_seeking: number;
  dissociation: number;
  control_seeking: number;
  social_dependency: number;
  
  // Derived preferences
  preferredModality: 'movement' | 'stillness' | 'sensory' | 'cognitive';
  aversionModality: 'movement' | 'stillness' | 'sensory' | 'cognitive';
  neededEffect: 'activating' | 'calming' | 'regulating' | 'grounding';
  
  // Metadata
  confidence: number;
  lastInferred: Date;
}

/**
 * Tracks tolerance for different challenge types.
 * Enables the 15% stretch principle.
 */
export interface CapacityModel {
  // Tolerance levels (0.0 - 1.0)
  friction_tolerance: number;
  embodiment_tolerance: number;
  stillness_tolerance: number;
  novelty_tolerance: number;
  
  // Calibration state
  current_stretch: number;
  consecutive_completions: number;
  consecutive_abandons: number;
  
  // Safety bounds
  floor: number;
  ceiling: number;
  
  // History
  blocked_actions: string[];
  category_cooldowns: Record<string, Date>;
  recent_completions: ActionCompletion[];
}

export interface ActionCompletion {
  action_id: string;
  category: string;
  timestamp: Date;
}

/**
 * Real-time situational awareness for recommendation filtering.
 */
export interface ContextState {
  // Temporal
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayType: 'weekday' | 'weekend';
  localHour: number;
  
  // Location (privacy-preserving)
  locationContext: 'home' | 'work' | 'transit' | 'outside' | 'unknown';
  isStationary: boolean;
  
  // Session
  currentStaticLevel: number;
  minutesSinceLastAction: number;
  actionsCompletedToday: number;
  categoriesUsedToday: string[];
  
  // Environmental (optional)
  weather?: 'clear' | 'rain' | 'extreme';
  ambientNoise?: 'quiet' | 'moderate' | 'loud';
}

/**
 * Complete user state composite.
 */
export interface UserState {
  // Identity
  userId: string;
  level: UserLevel;
  isPro: boolean;
  
  // Component models
  addiction: AddictionProfile;
  cognitive: CognitivePattern;
  capacity: CapacityModel;
  context: ContextState;
  
  // Progression
  xp: number;
  streak: {
    current: number;
    longest: number;
    lastConsciousDay: Date | null;
  };
  badges: string[];
  
  // Timestamps
  createdAt: Date;
  lastActive: Date;
  lastFullCompute: Date;
}

export type UserLevel = 'npc' | 'glitch' | 'hacker' | 'main_character' | 'oracle';

// ═══════════════════════════════════════════════════════════════════════════
// MICRO-ACTION SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export type ActionCategory = 
  | 'breathing' 
  | 'movement' 
  | 'hydration' 
  | 'sensory' 
  | 'creative' 
  | 'social' 
  | 'restoration' 
  | 'cognitive';

export type NervousSystemEffect = 'activating' | 'calming' | 'regulating' | 'grounding';

export type LocationContext = 'home' | 'work' | 'transit' | 'outside' | 'anywhere';

export type TimeContext = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';

/**
 * Full micro-action schema with all PBRS-required tagging.
 */
export interface MicroAction {
  // Identity
  id: string;
  title: string;
  description: string;
  instructions: string;
  icon: string;
  
  // Behavioral Classification
  category: ActionCategory;
  nervous_system_effect: NervousSystemEffect;
  
  // Difficulty Dimensions (0.0 - 1.0)
  friction: number;
  embodiment: number;
  stillness: number;
  novelty: number;
  
  // Context Requirements
  valid_contexts: LocationContext[];
  valid_times: TimeContext[];
  
  // Psychotype Compatibility (0.0 - 1.0)
  psychotype_compatibility: {
    novelty_seeking: number;
    dissociation: number;
    control_seeking: number;
    social_dependency: number;
  };
  
  // Addiction Compatibility (0.0 - 1.0)
  addiction_compatibility: {
    high_intensity: number;
    high_fragmentation: number;
    high_compulsion: number;
    high_avoidance: number;
  };
  
  // Operational
  duration_min: number;
  duration_max: number;
  static_cleared: number;
  cooldown_hours: number;
  
  // Access Control
  unlock_level: UserLevel;
  is_free_tier: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// QUEST SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export type QuestArchetype = 'presence' | 'connection' | 'creation' | 'restoration' | 'mastery';

/**
 * Quest template - a behavioral contract, not content.
 */
export interface QuestTemplate {
  // Identity
  id: string;
  archetype: QuestArchetype;
  name: string;
  description: string;
  
  // Eligibility Constraints
  eligibility: {
    min_level: UserLevel;
    min_capacity_friction: number;
    min_capacity_embodiment: number;
    min_capacity_stillness: number;
    max_addiction_severity: number;
    required_contexts: LocationContext[];
    blocked_if_recent_abandon: boolean;
  };
  
  // Assembly Rules
  assembly: {
    required_categories: ActionCategory[];
    banned_categories: ActionCategory[];
    min_actions: number;
    max_actions: number;
    nervous_system_sequence: NervousSystemEffect[];
    max_total_friction: number;
    max_total_embodiment: number;
  };
  
  // Behavioral Intent
  intent: {
    target_capacity_dimension: keyof CapacityModel;
    stretch_amount: number;
    success_criteria: string;
  };
  
  // Rewards
  rewards: {
    xp_base: number;
    xp_streak_multiplier: number;
    static_cleared: number;
    conscious_day_credit: boolean;
    badge_id?: string;
  };
  
  // Operational
  duration_min: number;
  duration_max: number;
  cooldown_days: number;
}

/**
 * Assembled quest instance.
 */
export interface QuestAssembly {
  quest_id: string;
  template: QuestTemplate;
  actions: MicroAction[];
  total_duration: number;
  total_static_cleared: number;
  assembled_at: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// RECOMMENDATION ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Scored action with explanation.
 */
export interface ScoredAction {
  action: MicroAction;
  relevanceScore: number;
  difficultyScore: number;
  diversityScore: number;
  efficiencyScore: number;
  finalScore: number;
  explanation: string;
}

/**
 * Recommendation request.
 */
export interface RecommendationRequest {
  user: UserState;
  count: number;
  urgency: 'low' | 'medium' | 'high';
  filterCategories?: ActionCategory[];
  excludeActions?: string[];
}

/**
 * Recommendation response.
 */
export interface RecommendationResponse {
  recommendations: ScoredAction[];
  computed_at: Date;
  pipeline_duration_ms: number;
  eligible_count: number;
  filtered_count: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// FEEDBACK TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ActionOutcomeType = 'completed' | 'abandoned' | 'skipped';

/**
 * Action outcome for feedback processing.
 */
export interface ActionOutcome {
  action_id: string;
  outcome: ActionOutcomeType;
  started_at: Date;
  ended_at?: Date;
  completion_percentage?: number;
  static_before: number;
  static_after?: number;
}

/**
 * State update result after feedback processing.
 */
export interface FeedbackResult {
  user_state_updated: boolean;
  capacity_changes: Partial<CapacityModel>;
  xp_gained: number;
  static_cleared: number;
  badges_earned: string[];
  level_changed: boolean;
  new_level?: UserLevel;
}

// ═══════════════════════════════════════════════════════════════════════════
// RAW DATA TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Screen time event from iOS API.
 */
export interface ScreenTimeEvent {
  timestamp: Date;
  app_bundle_id: string;
  app_category: string;
  duration_seconds: number;
  event_type: 'session_start' | 'session_end' | 'app_switch';
}

/**
 * Phone pickup event.
 */
export interface PickupEvent {
  timestamp: Date;
  first_app_opened: string;
  time_to_first_unlock: number;
}

/**
 * Notification interaction event.
 */
export interface NotificationEvent {
  timestamp: Date;
  app_bundle_id: string;
  response_time_seconds: number | null;
  action_taken: 'opened' | 'dismissed' | 'ignored';
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PBRS_CONSTANTS = {
  // Addiction calculation
  INTENSITY_CAP: 360,
  SESSION_CAP: 100,
  AVG_SESSION_CAP: 30,
  APP_SWITCH_CAP: 30,
  MESSAGE_CAP: 200,
  
  // Capacity bounds
  CAPACITY_FLOOR: 0.1,
  CAPACITY_CEILING: 0.9,
  
  // Adjustment rates
  COMPLETION_CAPACITY_INCREASE: 0.02,
  ABANDON_EARLY_CAPACITY_DECREASE: 0.05,
  ABANDON_LATE_CAPACITY_DECREASE: 0.02,
  STRETCH_INCREASE: 0.01,
  STRETCH_DECREASE: 0.05,
  
  // Target stretch
  DEFAULT_STRETCH: 0.15,
  MAX_STRETCH: 0.20,
  MIN_STRETCH: 0.05,
  
  // Scoring weights
  RELEVANCE_WEIGHT: 0.35,
  DIFFICULTY_WEIGHT: 0.30,
  DIVERSITY_WEIGHT: 0.20,
  EFFICIENCY_WEIGHT: 0.15,
  
  // Cooldowns
  ACTION_COOLDOWN_HOURS: 4,
  CATEGORY_COOLDOWN_HOURS: 24,
  QUEST_COOLDOWN_DAYS: 7,
  
  // Consecutive thresholds
  COMPLETIONS_FOR_INCREASE: 3,
  ABANDONS_FOR_DECREASE: 2,
  SKIPS_FOR_COOLDOWN: 3,
  ABANDONS_FOR_PERMANENT_BLOCK: 3,
  
  // Level thresholds (XP)
  LEVEL_XP: {
    npc: 0,
    glitch: 500,
    hacker: 1500,
    main_character: 3500,
    oracle: 7000,
  },
  
  // Screen time thresholds per level (minutes)
  LEVEL_SCREEN_TIME: {
    npc: 240,
    glitch: 180,
    hacker: 120,
    main_character: 90,
    oracle: 60,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT VALUES
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_ADDICTION_PROFILE: AddictionProfile = {
  intensity: 0.5,
  fragmentation: 0.5,
  compulsion: 0.5,
  avoidance: 0.5,
  overallSeverity: 0.5,
  dominantPattern: 'social',
  primaryProblemCategory: 'Social Networking',
  lastComputed: new Date(),
  dataWindowDays: 0,
  dataQuality: 0,
  trend: 'stable',
};

export const DEFAULT_COGNITIVE_PATTERN: CognitivePattern = {
  novelty_seeking: 0.25,
  dissociation: 0.25,
  control_seeking: 0.25,
  social_dependency: 0.25,
  preferredModality: 'movement',
  aversionModality: 'stillness',
  neededEffect: 'regulating',
  confidence: 0,
  lastInferred: new Date(),
};

export const DEFAULT_CAPACITY_MODEL: CapacityModel = {
  friction_tolerance: 0.3,
  embodiment_tolerance: 0.3,
  stillness_tolerance: 0.3,
  novelty_tolerance: 0.3,
  current_stretch: PBRS_CONSTANTS.DEFAULT_STRETCH,
  consecutive_completions: 0,
  consecutive_abandons: 0,
  floor: PBRS_CONSTANTS.CAPACITY_FLOOR,
  ceiling: PBRS_CONSTANTS.CAPACITY_CEILING,
  blocked_actions: [],
  category_cooldowns: {},
  recent_completions: [],
};

export const DEFAULT_CONTEXT_STATE: ContextState = {
  timeOfDay: 'afternoon',
  dayType: 'weekday',
  localHour: 14,
  locationContext: 'home',
  isStationary: true,
  currentStaticLevel: 0,
  minutesSinceLastAction: 0,
  actionsCompletedToday: 0,
  categoriesUsedToday: [],
};

/**
 * Create a default user state for new users.
 */
export function createDefaultUserState(userId: string): UserState {
  return {
    userId,
    level: 'npc',
    isPro: false,
    addiction: { ...DEFAULT_ADDICTION_PROFILE },
    cognitive: { ...DEFAULT_COGNITIVE_PATTERN },
    capacity: { ...DEFAULT_CAPACITY_MODEL },
    context: { ...DEFAULT_CONTEXT_STATE },
    xp: 0,
    streak: {
      current: 0,
      longest: 0,
      lastConsciousDay: null,
    },
    badges: [],
    createdAt: new Date(),
    lastActive: new Date(),
    lastFullCompute: new Date(),
  };
}
