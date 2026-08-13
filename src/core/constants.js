export const NEUTRAL_COLOR = '#6b6375';
// Fog-of-war fill for planets owned by the other player — distinct from
// NEUTRAL_COLOR so "unclaimed" and "enemy-owned but hidden" read differently.
export const FOG_COLOR = '#23212b';

export const PLAYER_COLORS = {
  p1: '#4a86e8',
  p2: '#ff5a5a',
};

export const PLANET_RADIUS = 22;

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 640;
const CANVAS_DIAGONAL = Math.hypot(CANVAS_WIDTH, CANVAS_HEIGHT);

// Distance→travel-time thresholds, as fractions of the canvas diagonal so
// they keep scaling sensibly once the map size varies with procedural
// generation (M5) instead of this fixed hardcoded layout.
export const ONE_TURN_MAX_DISTANCE = CANVAS_DIAGONAL * 0.25;
export const TWO_TURN_MAX_DISTANCE = CANVAS_DIAGONAL * 0.55;

// Battle-phase (dodge-duel) tuning.
export const PADDLE_MARGIN = 40;
export const PADDLE_WIDTH = 14;
export const PADDLE_HEIGHT = 70;
export const PADDLE_SPEED = 320; // px/second
export const PROJECTILE_RADIUS = 5;
export const PROJECTILE_SPEED = 520; // px/second
export const FIRE_COOLDOWN_MS = 300;
// The side that brought more ships into the fight fires faster — up to this
// fraction faster/slower at a full ships advantage (e.g. one side present,
// the other wiped out before the duel even starts).
export const POWER_ADVANTAGE_MAX = 0.4;
