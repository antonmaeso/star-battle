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

// Map-size presets the player chooses on the splash screen — the galaxy
// canvas's pixel dimensions for that game. The battle duel and starfield
// aren't tied to a fixed size either; they take whatever the current
// canvas dimensions are at the time they're created, so everything scales
// with the chosen map.
export const MAP_SIZE_PRESETS = {
  small: { label: 'Small', width: 768, height: 480 },
  medium: { label: 'Medium', width: 1024, height: 640 },
  large: { label: 'Large', width: 1280, height: 800 },
};
export const DEFAULT_MAP_SIZE = 'medium';

// A fleet's travel time scales continuously with distance, as a fraction of
// the current map's diagonal — from 1 turn for a short hop up to this cap
// for a full corner-to-corner crossing, regardless of chosen map size.
export const MAX_TRAVEL_TURNS = 10;

export const DEFAULT_STARTING_SHIPS = 30;

// Procedural galaxy generation (galaxy/generateGalaxy.js). The map is built
// with 180°-point symmetry around its center, so p1 and p2 always start on
// opposite sides with an identical layout facing them.
export const GALAXY_MARGIN = PLANET_RADIUS + 24; // keep planets off the canvas edge
export const MIN_PLANET_SPACING = PLANET_RADIUS * 3.2;
export const HOMEWORLD_MARGIN_X = 120; // each homeworld's distance from its canvas edge
export const HOMEWORLD_RESOURCES = 3;
export const SECONDARY_PLANET_RESOURCES = 1;
export const SECONDARY_PLANET_SHIPS_RANGE = [8, 14];
export const MIN_NEUTRAL_PLANETS = 2;
export const MAX_NEUTRAL_PLANETS = 16;
export const DEFAULT_NEUTRAL_PLANETS = 6;
export const NEUTRAL_PLANET_RESOURCES_RANGE = [0, 2];
export const NEUTRAL_PLANET_SHIPS_RANGE = [3, 8];

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
