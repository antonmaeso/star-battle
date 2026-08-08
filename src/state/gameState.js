import { PLANET_RADIUS, PLAYER_COLORS } from '../core/constants.js';

export function createPlayer(id, name) {
  return { id, name, color: PLAYER_COLORS[id], isEliminated: false };
}

export function createPlanet({
  id,
  x,
  y,
  ownerId = null,
  ships = 0,
  productionRate = 0,
  isHomeworld = false,
  radius = PLANET_RADIUS,
}) {
  return {
    id,
    x,
    y,
    radius,
    ownerId,
    ships,
    productionRate,
    isHomeworld,
    pendingBattle: false,
  };
}
