export const NEUTRAL_COLOR = '#6b6375';

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
