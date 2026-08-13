import { MAX_TRAVEL_TURNS } from '../core/constants.js';

export function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// mapDiagonal is the current map's corner-to-corner distance (see
// world.mapDiagonal) — travel time is relative to the chosen map size, not
// a fixed canvas, so callers must always pass it explicitly.
export function turnsForDistance(distance, mapDiagonal) {
  const turns = Math.ceil((distance / mapDiagonal) * MAX_TRAVEL_TURNS);
  return Math.min(MAX_TRAVEL_TURNS, Math.max(1, turns));
}
