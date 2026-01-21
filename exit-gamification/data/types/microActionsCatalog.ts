/**
 * Exit - Production Micro-Actions Catalog
 * 
 * PBRS-Compliant Schema v1.0
 * 
 * Each action is tagged across:
 * - Behavioral classification
 * - Nervous system effect
 * - Difficulty dimensions (friction, embodiment, stillness, novelty)
 * - Context requirements
 * - Psychotype compatibility
 * - Addiction compatibility
 * 
 * Total: 30 production-grade actions (quality over quantity)
 */

import { MicroAction } from '../types/pbrs';

export const microActionsCatalog: MicroAction[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // BREATHING CATEGORY (5 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'breathing_001',
    title: 'Box Breathing',
    description: '4-4-4-4 pattern to activate parasympathetic response',
    instructions: 'Inhale for 4 counts. Hold for 4. Exhale for 4. Hold for 4. Repeat 5 cycles.',
    icon: '🫁',
    
    // Behavioral Classification
    category: 'breathing',
    nervous_system_effect: 'calming',
    
    // Difficulty Dimensions (0.0 - 1.0)
    friction: 0.1,      // Very easy to start
    embodiment: 0.2,    // Minimal physical
    stillness: 0.7,     // Requires sitting still
    novelty: 0.1,       // Well-known technique
    
    // Context Requirements
    valid_contexts: ['home', 'work', 'transit', 'outside', 'anywhere'],
    valid_times: ['morning', 'afternoon', 'evening', 'night', 'anytime'],
    
    // Psychotype Compatibility (0.0 - 1.0)
    psychotype_compatibility: {
      novelty_seeking: 0.3,      // May find boring
      dissociation: 0.9,         // Excellent for grounders
      control_seeking: 0.8,      // Structured, predictable
      social_dependency: 0.5,    // Neutral
    },
    
    // Addiction Compatibility (0.0 - 1.0)
    addiction_compatibility: {
      high_intensity: 0.8,       // Good for heavy users
      high_fragmentation: 0.9,   // Excellent for scattered attention
      high_compulsion: 0.7,      // Helps with reactivity
      high_avoidance: 0.8,       // Grounding alternative
    },
    
    // Operational
    duration_min: 3,
    duration_max: 5,
    static_cleared: 10,
    cooldown_hours: 2,
    
    // Access Control
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'breathing_002',
    title: '4-7-8 Relaxation Breath',
    description: 'Dr. Weil\'s technique for deep relaxation and sleep prep',
    instructions: 'Inhale through nose for 4 counts. Hold for 7 counts. Exhale through mouth for 8 counts. Repeat 4 cycles.',
    icon: '😮‍💨',
    
    category: 'breathing',
    nervous_system_effect: 'calming',
    
    friction: 0.2,
    embodiment: 0.2,
    stillness: 0.8,
    novelty: 0.3,
    
    valid_contexts: ['home', 'work', 'anywhere'],
    valid_times: ['evening', 'night', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.4,
      dissociation: 0.9,
      control_seeking: 0.7,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.8,
      high_compulsion: 0.8,
      high_avoidance: 0.9,
    },
    
    duration_min: 3,
    duration_max: 5,
    static_cleared: 12,
    cooldown_hours: 3,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'breathing_003',
    title: 'Physiological Sigh',
    description: 'Double inhale + long exhale for instant calm (Stanford research)',
    instructions: 'Take a deep breath in. At the top, take another small sip of air. Then exhale slowly and fully. Repeat 3 times.',
    icon: '💨',
    
    category: 'breathing',
    nervous_system_effect: 'regulating',
    
    friction: 0.05,
    embodiment: 0.1,
    stillness: 0.3,
    novelty: 0.5,
    
    valid_contexts: ['home', 'work', 'transit', 'outside', 'anywhere'],
    valid_times: ['morning', 'afternoon', 'evening', 'night', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.6,
      dissociation: 0.7,
      control_seeking: 0.6,
      social_dependency: 0.6,
    },
    
    addiction_compatibility: {
      high_intensity: 0.9,
      high_fragmentation: 0.9,
      high_compulsion: 0.9,
      high_avoidance: 0.7,
    },
    
    duration_min: 1,
    duration_max: 2,
    static_cleared: 5,
    cooldown_hours: 0.5,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'breathing_004',
    title: 'Energizing Breath (Kapalabhati)',
    description: 'Rapid belly pumps to increase alertness and energy',
    instructions: 'Sit tall. Exhale sharply through nose while pulling belly in. Let inhale happen naturally. 30 pumps, then rest. 3 rounds.',
    icon: '🔥',
    
    category: 'breathing',
    nervous_system_effect: 'activating',
    
    friction: 0.3,
    embodiment: 0.5,
    stillness: 0.5,
    novelty: 0.6,
    
    valid_contexts: ['home', 'outside'],
    valid_times: ['morning', 'afternoon'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.8,
      dissociation: 0.3,
      control_seeking: 0.5,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.5,
      high_fragmentation: 0.6,
      high_compulsion: 0.4,
      high_avoidance: 0.3,
    },
    
    duration_min: 5,
    duration_max: 8,
    static_cleared: 15,
    cooldown_hours: 4,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'breathing_005',
    title: 'Coherent Breathing',
    description: '5 breaths per minute for heart-brain coherence',
    instructions: 'Breathe in for 6 seconds. Breathe out for 6 seconds. No pauses. Continue for 5 minutes. Use a timer or guided audio.',
    icon: '💚',
    
    category: 'breathing',
    nervous_system_effect: 'regulating',
    
    friction: 0.2,
    embodiment: 0.2,
    stillness: 0.8,
    novelty: 0.4,
    
    valid_contexts: ['home', 'work', 'anywhere'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.4,
      dissociation: 0.8,
      control_seeking: 0.9,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.9,
      high_compulsion: 0.8,
      high_avoidance: 0.7,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 15,
    cooldown_hours: 3,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MOVEMENT CATEGORY (7 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'movement_001',
    title: '10 Squats',
    description: 'Quick lower body activation to reset nervous system',
    instructions: 'Stand with feet shoulder-width apart. Lower slowly (3 sec). Push up firmly (1 sec). Keep chest up. 10 reps.',
    icon: '🏋️',
    
    category: 'movement',
    nervous_system_effect: 'activating',
    
    friction: 0.3,
    embodiment: 0.7,
    stillness: 0.0,
    novelty: 0.1,
    
    valid_contexts: ['home', 'work', 'outside'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.6,
      dissociation: 0.3,
      control_seeking: 0.7,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.4,
    },
    
    duration_min: 2,
    duration_max: 3,
    static_cleared: 10,
    cooldown_hours: 2,
    
    unlock_level: 'npc',
    is_free_tier: false,
  },
  
  {
    id: 'movement_002',
    title: '20 Pushups',
    description: 'Upper body reset with cardiovascular activation',
    instructions: 'Plank position. Lower chest to floor (2 sec). Push up (1 sec). Modify on knees if needed. 20 reps or max effort.',
    icon: '💪',
    
    category: 'movement',
    nervous_system_effect: 'activating',
    
    friction: 0.4,
    embodiment: 0.8,
    stillness: 0.0,
    novelty: 0.1,
    
    valid_contexts: ['home', 'outside'],
    valid_times: ['morning', 'afternoon', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.5,
      dissociation: 0.2,
      control_seeking: 0.7,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.6,
      high_compulsion: 0.5,
      high_avoidance: 0.3,
    },
    
    duration_min: 3,
    duration_max: 5,
    static_cleared: 15,
    cooldown_hours: 3,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'movement_003',
    title: 'Phone-Free Walk (10 min)',
    description: 'Leave phone behind. Walk with awareness. Return clearer.',
    instructions: 'Leave your phone at home or in a drawer. Walk outside for 10 minutes. Notice your surroundings. No destination needed.',
    icon: '🚶',
    
    category: 'movement',
    nervous_system_effect: 'regulating',
    
    friction: 0.6,
    embodiment: 0.4,
    stillness: 0.1,
    novelty: 0.3,
    
    valid_contexts: ['outside'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.7,
      dissociation: 0.6,
      control_seeking: 0.4,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.9,
      high_fragmentation: 0.8,
      high_compulsion: 0.9,
      high_avoidance: 0.7,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 25,
    cooldown_hours: 4,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'movement_004',
    title: 'Stretching Flow (8 Poses)',
    description: '8 stretches, 30 seconds each. No equipment needed.',
    instructions: 'Neck rolls, shoulder shrugs, forward fold, cat-cow, quad stretch, hip circles, calf raises, spinal twist. 30 sec each.',
    icon: '🧘',
    
    category: 'movement',
    nervous_system_effect: 'regulating',
    
    friction: 0.2,
    embodiment: 0.5,
    stillness: 0.3,
    novelty: 0.2,
    
    valid_contexts: ['home', 'work'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.4,
      dissociation: 0.6,
      control_seeking: 0.8,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.6,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 15,
    cooldown_hours: 3,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'movement_005',
    title: 'Jump Rope (5 min)',
    description: 'High-intensity cardio burst for dopamine reset',
    instructions: 'Jump rope for 5 minutes. Rest when needed. Keep going. No phone. Just movement and breath.',
    icon: '⏱️',
    
    category: 'movement',
    nervous_system_effect: 'activating',
    
    friction: 0.5,
    embodiment: 0.9,
    stillness: 0.0,
    novelty: 0.3,
    
    valid_contexts: ['home', 'outside'],
    valid_times: ['morning', 'afternoon'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.7,
      dissociation: 0.2,
      control_seeking: 0.5,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.6,
      high_fragmentation: 0.5,
      high_compulsion: 0.4,
      high_avoidance: 0.2,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 25,
    cooldown_hours: 6,
    
    unlock_level: 'hacker',
    is_free_tier: false,
  },
  
  {
    id: 'movement_006',
    title: 'Sun Salutations (5 Rounds)',
    description: 'Yoga flow to synchronize breath and movement',
    instructions: 'Follow the classic sun salutation sequence. Move with your breath. 5 complete rounds. Beginner modifications okay.',
    icon: '☀️',
    
    category: 'movement',
    nervous_system_effect: 'regulating',
    
    friction: 0.4,
    embodiment: 0.6,
    stillness: 0.2,
    novelty: 0.4,
    
    valid_contexts: ['home', 'outside'],
    valid_times: ['morning', 'afternoon', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.5,
      dissociation: 0.5,
      control_seeking: 0.7,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.6,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.5,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 20,
    cooldown_hours: 4,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'movement_007',
    title: 'One-Song Dance Break',
    description: 'Play one song. Dance badly. Move your body. No one\'s watching.',
    instructions: 'Pick a high-energy song. Turn it up. Move however your body wants. No choreography. Just vibes. Full song.',
    icon: '💃',
    
    category: 'movement',
    nervous_system_effect: 'activating',
    
    friction: 0.3,
    embodiment: 0.6,
    stillness: 0.0,
    novelty: 0.5,
    
    valid_contexts: ['home'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.9,
      dissociation: 0.4,
      control_seeking: 0.3,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.8,
      high_compulsion: 0.7,
      high_avoidance: 0.5,
    },
    
    duration_min: 3,
    duration_max: 5,
    static_cleared: 15,
    cooldown_hours: 2,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HYDRATION CATEGORY (2 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hydration_001',
    title: 'Drink Water (Full Glass)',
    description: 'Hydrate mindfully. Notice the sensation. Reset.',
    instructions: 'Fill a glass with cold water. Drink it slowly over 2-3 minutes. Focus on the sensation of hydration.',
    icon: '💧',
    
    category: 'hydration',
    nervous_system_effect: 'grounding',
    
    friction: 0.05,
    embodiment: 0.1,
    stillness: 0.3,
    novelty: 0.0,
    
    valid_contexts: ['home', 'work', 'anywhere'],
    valid_times: ['morning', 'afternoon', 'evening', 'night', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.3,
      dissociation: 0.7,
      control_seeking: 0.8,
      social_dependency: 0.6,
    },
    
    addiction_compatibility: {
      high_intensity: 0.9,
      high_fragmentation: 0.9,
      high_compulsion: 0.8,
      high_avoidance: 0.8,
    },
    
    duration_min: 2,
    duration_max: 3,
    static_cleared: 5,
    cooldown_hours: 1,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'hydration_002',
    title: 'Tea Ceremony (Slow Brew)',
    description: 'Make tea the slow way. Boil water. Steep properly. Sip without multitasking.',
    instructions: 'Choose good tea. Boil water to right temp. Steep for correct time. Sip slowly. Taste each note. No phone.',
    icon: '🍵',
    
    category: 'hydration',
    nervous_system_effect: 'calming',
    
    friction: 0.3,
    embodiment: 0.2,
    stillness: 0.6,
    novelty: 0.3,
    
    valid_contexts: ['home', 'work'],
    valid_times: ['morning', 'afternoon', 'evening'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.4,
      dissociation: 0.8,
      control_seeking: 0.9,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.8,
      high_compulsion: 0.7,
      high_avoidance: 0.8,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 15,
    cooldown_hours: 4,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORY CATEGORY (5 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'sensory_001',
    title: 'Cold Face Plunge',
    description: 'Submerge face in ice water for 30 seconds. Instant nervous system reset.',
    instructions: 'Fill a large bowl with cold water + ice. Take a deep breath. Dunk your face for 20-30 seconds. Repeat if needed.',
    icon: '🧊',
    
    category: 'sensory',
    nervous_system_effect: 'regulating',
    
    friction: 0.4,
    embodiment: 0.3,
    stillness: 0.2,
    novelty: 0.6,
    
    valid_contexts: ['home'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.8,
      dissociation: 0.4,
      control_seeking: 0.5,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.7,
      high_compulsion: 0.9,
      high_avoidance: 0.5,
    },
    
    duration_min: 2,
    duration_max: 5,
    static_cleared: 20,
    cooldown_hours: 4,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'sensory_002',
    title: 'Cold Shower (2 min)',
    description: 'End your shower with cold water. Breathe through it. Feel alive.',
    instructions: 'Finish your normal shower. Turn temp to cold. Stay for 1-2 min. Breathe slowly. Embrace the discomfort.',
    icon: '🚿',
    
    category: 'sensory',
    nervous_system_effect: 'activating',
    
    friction: 0.6,
    embodiment: 0.5,
    stillness: 0.1,
    novelty: 0.5,
    
    valid_contexts: ['home'],
    valid_times: ['morning', 'afternoon', 'evening'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.7,
      dissociation: 0.2,
      control_seeking: 0.4,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.6,
      high_fragmentation: 0.5,
      high_compulsion: 0.7,
      high_avoidance: 0.3,
    },
    
    duration_min: 2,
    duration_max: 5,
    static_cleared: 30,
    cooldown_hours: 12,
    
    unlock_level: 'hacker',
    is_free_tier: false,
  },
  
  {
    id: 'sensory_003',
    title: 'Brown Noise Bath (20 min)',
    description: 'Low-frequency audio to let your brain defrag',
    instructions: 'Find a comfortable position. Play brown noise (YouTube, Spotify, app). Headphones on. Close your eyes. 20 minutes.',
    icon: '🎵',
    
    category: 'sensory',
    nervous_system_effect: 'calming',
    
    friction: 0.2,
    embodiment: 0.1,
    stillness: 0.9,
    novelty: 0.3,
    
    valid_contexts: ['home', 'transit'],
    valid_times: ['afternoon', 'evening', 'night'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.3,
      dissociation: 0.9,
      control_seeking: 0.7,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.9,
      high_compulsion: 0.7,
      high_avoidance: 0.9,
    },
    
    duration_min: 15,
    duration_max: 20,
    static_cleared: 20,
    cooldown_hours: 6,
    
    unlock_level: 'glitch',
    is_free_tier: true,
  },
  
  {
    id: 'sensory_004',
    title: 'Sensory Shower',
    description: 'Shower with full attention. Notice temperature, sound, smell. Just sensation.',
    instructions: 'Step into shower. Close your eyes. Feel the water. Listen to the sound. Smell the soap. Stay present. No planning.',
    icon: '🌊',
    
    category: 'sensory',
    nervous_system_effect: 'grounding',
    
    friction: 0.2,
    embodiment: 0.3,
    stillness: 0.4,
    novelty: 0.2,
    
    valid_contexts: ['home'],
    valid_times: ['morning', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.4,
      dissociation: 0.8,
      control_seeking: 0.6,
      social_dependency: 0.5,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.8,
      high_compulsion: 0.6,
      high_avoidance: 0.8,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 15,
    cooldown_hours: 8,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'sensory_005',
    title: 'Barefoot Grounding (10 min)',
    description: 'Stand barefoot on grass, dirt, or sand. Connect to earth.',
    instructions: 'Find grass, sand, or dirt. Remove shoes and socks. Stand or walk barefoot for 10 min. Feel the ground.',
    icon: '🌿',
    
    category: 'sensory',
    nervous_system_effect: 'grounding',
    
    friction: 0.5,
    embodiment: 0.3,
    stillness: 0.5,
    novelty: 0.4,
    
    valid_contexts: ['outside'],
    valid_times: ['morning', 'afternoon', 'evening'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.6,
      dissociation: 0.7,
      control_seeking: 0.4,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.6,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 20,
    cooldown_hours: 8,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CREATIVE CATEGORY (4 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'creative_001',
    title: 'Doodle Session (10 min)',
    description: 'Draw or doodle for 10 minutes. No judgment. Just move the pen.',
    instructions: 'Grab paper and pen. Doodle anything: shapes, patterns, faces. No judgment. No Instagram post. Just create.',
    icon: '✏️',
    
    category: 'creative',
    nervous_system_effect: 'regulating',
    
    friction: 0.2,
    embodiment: 0.2,
    stillness: 0.5,
    novelty: 0.4,
    
    valid_contexts: ['home', 'work'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.7,
      dissociation: 0.6,
      control_seeking: 0.5,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.7,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 15,
    cooldown_hours: 4,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'creative_002',
    title: 'Freewriting (10 min)',
    description: 'Write whatever comes to mind. Don\'t stop. Don\'t edit. Purge the mental cache.',
    instructions: 'Set a timer for 10 min. Write continuously. If stuck, write "I don\'t know what to write" until something comes.',
    icon: '📝',
    
    category: 'creative',
    nervous_system_effect: 'regulating',
    
    friction: 0.2,
    embodiment: 0.2,
    stillness: 0.6,
    novelty: 0.3,
    
    valid_contexts: ['home', 'work'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.5,
      dissociation: 0.7,
      control_seeking: 0.6,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.7,
      high_compulsion: 0.6,
      high_avoidance: 0.8,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 15,
    cooldown_hours: 6,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'creative_003',
    title: 'Gratitude Dump (3 Things)',
    description: 'Write 3 things you\'re grateful for. By hand. Be specific.',
    instructions: 'Grab paper and pen. Write down 3 things from today that didn\'t suck. Be specific. Feel it.',
    icon: '🙏',
    
    category: 'creative',
    nervous_system_effect: 'calming',
    
    friction: 0.15,
    embodiment: 0.1,
    stillness: 0.5,
    novelty: 0.2,
    
    valid_contexts: ['home', 'work', 'anywhere'],
    valid_times: ['morning', 'evening', 'night', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.3,
      dissociation: 0.6,
      control_seeking: 0.7,
      social_dependency: 0.6,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.6,
      high_compulsion: 0.5,
      high_avoidance: 0.8,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 10,
    cooldown_hours: 12,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'creative_004',
    title: 'Playlist Curation',
    description: 'Create a new playlist. 10-15 songs. Theme it. Name it something real.',
    instructions: 'Open your music app. Create a new playlist. Pick a theme or mood. Add 10-15 songs. Name it. Feel the curation.',
    icon: '🎧',
    
    category: 'creative',
    nervous_system_effect: 'regulating',
    
    friction: 0.3,
    embodiment: 0.1,
    stillness: 0.4,
    novelty: 0.5,
    
    valid_contexts: ['home'],
    valid_times: ['afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.8,
      dissociation: 0.5,
      control_seeking: 0.6,
      social_dependency: 0.6,
    },
    
    addiction_compatibility: {
      high_intensity: 0.6,
      high_fragmentation: 0.6,
      high_compulsion: 0.5,
      high_avoidance: 0.6,
    },
    
    duration_min: 15,
    duration_max: 20,
    static_cleared: 15,
    cooldown_hours: 24,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RESTORATION CATEGORY (4 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'restoration_001',
    title: 'Floor Time (Rot for 5 min)',
    description: 'Lie on the floor. Do nothing. Exist. Let your nervous system decompress.',
    instructions: 'Lie flat on the floor (carpet, rug, yoga mat). Set a 5-min timer. Close eyes or stare at ceiling. No phone. Just be.',
    icon: '🛋️',
    
    category: 'restoration',
    nervous_system_effect: 'calming',
    
    friction: 0.1,
    embodiment: 0.1,
    stillness: 0.9,
    novelty: 0.2,
    
    valid_contexts: ['home'],
    valid_times: ['afternoon', 'evening', 'night', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.2,
      dissociation: 0.9,
      control_seeking: 0.5,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.9,
      high_compulsion: 0.7,
      high_avoidance: 0.9,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 15,
    cooldown_hours: 4,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'restoration_002',
    title: 'Power Nap (15 min)',
    description: 'Set an alarm. Close your eyes. Drift. Wake refreshed.',
    instructions: 'Set a 15-min alarm. Lie down or recline. Close eyes. Don\'t force sleep—just rest. Wake when alarm rings.',
    icon: '😴',
    
    category: 'restoration',
    nervous_system_effect: 'calming',
    
    friction: 0.2,
    embodiment: 0.1,
    stillness: 1.0,
    novelty: 0.1,
    
    valid_contexts: ['home'],
    valid_times: ['afternoon', 'evening'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.2,
      dissociation: 0.9,
      control_seeking: 0.6,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.9,
      high_fragmentation: 0.8,
      high_compulsion: 0.6,
      high_avoidance: 0.9,
    },
    
    duration_min: 15,
    duration_max: 20,
    static_cleared: 20,
    cooldown_hours: 8,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },
  
  {
    id: 'restoration_003',
    title: 'Silence Sit (10 min)',
    description: 'Sit in silence. No music, no podcast, no sounds. Just you and your thoughts.',
    instructions: 'Find a quiet spot. Sit comfortably. Set timer for 10 min. Close eyes or soften gaze. Just be.',
    icon: '🤫',
    
    category: 'restoration',
    nervous_system_effect: 'grounding',
    
    friction: 0.3,
    embodiment: 0.1,
    stillness: 1.0,
    novelty: 0.5,
    
    valid_contexts: ['home', 'outside'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.2,
      dissociation: 0.7,
      control_seeking: 0.5,
      social_dependency: 0.2,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.9,
      high_compulsion: 0.8,
      high_avoidance: 0.6,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 20,
    cooldown_hours: 6,
    
    unlock_level: 'hacker',
    is_free_tier: false,
  },
  
  {
    id: 'restoration_004',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release each muscle group. Toes to head. Release what you\'re holding.',
    instructions: 'Lie down. Tense toes for 5 sec, then release. Move up: calves, thighs, core, arms, face. Notice the release.',
    icon: '🧘‍♀️',
    
    category: 'restoration',
    nervous_system_effect: 'calming',
    
    friction: 0.2,
    embodiment: 0.4,
    stillness: 0.8,
    novelty: 0.3,
    
    valid_contexts: ['home'],
    valid_times: ['afternoon', 'evening', 'night'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.3,
      dissociation: 0.8,
      control_seeking: 0.8,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.8,
      high_compulsion: 0.7,
      high_avoidance: 0.9,
    },
    
    duration_min: 10,
    duration_max: 15,
    static_cleared: 20,
    cooldown_hours: 6,
    
    unlock_level: 'glitch',
    is_free_tier: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE CATEGORY (3 actions)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cognitive_001',
    title: 'Analog Read (15 min)',
    description: 'Read something physical. Book, magazine, newspaper. Not backlit.',
    instructions: 'Pick up a physical book or magazine. Set a timer. Read without checking phone. Notice the difference.',
    icon: '📚',
    
    category: 'cognitive',
    nervous_system_effect: 'calming',
    
    friction: 0.3,
    embodiment: 0.1,
    stillness: 0.7,
    novelty: 0.3,
    
    valid_contexts: ['home', 'transit'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.5,
      dissociation: 0.7,
      control_seeking: 0.7,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.7,
      high_fragmentation: 0.8,
      high_compulsion: 0.6,
      high_avoidance: 0.7,
    },
    
    duration_min: 15,
    duration_max: 30,
    static_cleared: 20,
    cooldown_hours: 4,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'cognitive_002',
    title: 'Window Gaze (5 min)',
    description: 'Look out a window. Watch the sky, trees, people. No judgment. Just observe.',
    instructions: 'Find a window. Set a timer. Watch what\'s outside. Notice movement, light, weather. Let your mind wander.',
    icon: '🪟',
    
    category: 'cognitive',
    nervous_system_effect: 'grounding',
    
    friction: 0.1,
    embodiment: 0.0,
    stillness: 0.8,
    novelty: 0.2,
    
    valid_contexts: ['home', 'work'],
    valid_times: ['morning', 'afternoon', 'evening', 'anytime'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.3,
      dissociation: 0.8,
      control_seeking: 0.6,
      social_dependency: 0.4,
    },
    
    addiction_compatibility: {
      high_intensity: 0.8,
      high_fragmentation: 0.9,
      high_compulsion: 0.7,
      high_avoidance: 0.8,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 10,
    cooldown_hours: 2,
    
    unlock_level: 'npc',
    is_free_tier: true,
  },
  
  {
    id: 'cognitive_003',
    title: 'Candle Stare (Trataka)',
    description: 'Light a candle. Stare at the flame. Ancient meditation. Modern reset.',
    instructions: 'Light a candle. Sit 2 feet away. Stare at flame without blinking (as long as comfortable). Breathe slowly.',
    icon: '🕯️',
    
    category: 'cognitive',
    nervous_system_effect: 'grounding',
    
    friction: 0.4,
    embodiment: 0.1,
    stillness: 0.9,
    novelty: 0.6,
    
    valid_contexts: ['home'],
    valid_times: ['evening', 'night'],
    
    psychotype_compatibility: {
      novelty_seeking: 0.5,
      dissociation: 0.7,
      control_seeking: 0.6,
      social_dependency: 0.3,
    },
    
    addiction_compatibility: {
      high_intensity: 0.6,
      high_fragmentation: 0.8,
      high_compulsion: 0.7,
      high_avoidance: 0.7,
    },
    
    duration_min: 5,
    duration_max: 10,
    static_cleared: 15,
    cooldown_hours: 12,
    
    unlock_level: 'hacker',
    is_free_tier: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CATALOG METADATA
// ═══════════════════════════════════════════════════════════════════════════

export const CATALOG_METADATA = {
  version: '1.0.0',
  total_actions: microActionsCatalog.length,
  
  by_category: {
    breathing: microActionsCatalog.filter(a => a.category === 'breathing').length,
    movement: microActionsCatalog.filter(a => a.category === 'movement').length,
    hydration: microActionsCatalog.filter(a => a.category === 'hydration').length,
    sensory: microActionsCatalog.filter(a => a.category === 'sensory').length,
    creative: microActionsCatalog.filter(a => a.category === 'creative').length,
    restoration: microActionsCatalog.filter(a => a.category === 'restoration').length,
    cognitive: microActionsCatalog.filter(a => a.category === 'cognitive').length,
  },
  
  by_level: {
    npc: microActionsCatalog.filter(a => a.unlock_level === 'npc').length,
    glitch: microActionsCatalog.filter(a => a.unlock_level === 'glitch').length,
    hacker: microActionsCatalog.filter(a => a.unlock_level === 'hacker').length,
    main_character: microActionsCatalog.filter(a => a.unlock_level === 'main_character').length,
    oracle: microActionsCatalog.filter(a => a.unlock_level === 'oracle').length,
  },
  
  free_tier_count: microActionsCatalog.filter(a => a.is_free_tier).length,
  
  by_effect: {
    calming: microActionsCatalog.filter(a => a.nervous_system_effect === 'calming').length,
    activating: microActionsCatalog.filter(a => a.nervous_system_effect === 'activating').length,
    regulating: microActionsCatalog.filter(a => a.nervous_system_effect === 'regulating').length,
    grounding: microActionsCatalog.filter(a => a.nervous_system_effect === 'grounding').length,
  },
};

// Export helper functions
export function getActionById(id: string): MicroAction | undefined {
  return microActionsCatalog.find(a => a.id === id);
}

export function getActionsByCategory(category: string): MicroAction[] {
  return microActionsCatalog.filter(a => a.category === category);
}

export function getActionsByLevel(level: string): MicroAction[] {
  const levels = ['npc', 'glitch', 'hacker', 'main_character', 'oracle'];
  const levelIndex = levels.indexOf(level);
  return microActionsCatalog.filter(a => levels.indexOf(a.unlock_level) <= levelIndex);
}

export function getFreeTierActions(): MicroAction[] {
  return microActionsCatalog.filter(a => a.is_free_tier);
}
