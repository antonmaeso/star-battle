export const NEUTRAL_COLOR = '#6b6375';
// Fog-of-war fill for planets owned by the other player — distinct from
// NEUTRAL_COLOR so "unclaimed" and "enemy-owned but hidden" read differently.
export const FOG_COLOR = '#23212b';

export const PLAYER_COLORS = {
  p1: '#4a86e8',
  p2: '#ff5a5a',
};

export const PLANET_RADIUS = 22;

// Ships produced per round, per point of a planet's resources.
export const PRODUCTION_PER_RESOURCE = 1;

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 640;
export const CANVAS_DIAGONAL = Math.hypot(CANVAS_WIDTH, CANVAS_HEIGHT);

// A fleet's travel time scales continuously with distance, as a fraction of
// the canvas diagonal (so it keeps scaling sensibly once the map size varies
// with procedural generation, M5) — from 1 turn for a short hop up to this
// cap for a full corner-to-corner crossing.
export const MAX_TRAVEL_TURNS = 10;

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
// Every SHIPS_PER_EXTRA_SHOT ships you currently have alive fires one more
// projectile in the same volley (a spread, not a faster rate), capped at
// MAX_SIMULTANEOUS_SHOTS so a big fleet doesn't fill the screen.
export const SHIPS_PER_EXTRA_SHOT = 5;
export const MAX_SIMULTANEOUS_SHOTS = 4;
export const PROJECTILE_SPREAD_GAP = 9; // px between shots in the same volley
