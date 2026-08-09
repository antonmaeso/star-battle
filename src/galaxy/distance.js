import { ONE_TURN_MAX_DISTANCE, TWO_TURN_MAX_DISTANCE } from '../core/constants.js';

export function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function turnsForDistance(distance) {
  if (distance < ONE_TURN_MAX_DISTANCE) return 1;
  if (distance < TWO_TURN_MAX_DISTANCE) return 2;
  return 3;
}
