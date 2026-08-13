import { CANVAS_DIAGONAL, MAX_TRAVEL_TURNS } from '../core/constants.js';

export function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function turnsForDistance(distance) {
  const turns = Math.ceil((distance / CANVAS_DIAGONAL) * MAX_TRAVEL_TURNS);
  return Math.min(MAX_TRAVEL_TURNS, Math.max(1, turns));
}
