import { nextId } from '../core/id.js';
import { distanceBetween, turnsForDistance } from './distance.js';

export function createFleetFromOrder(order, ownerId, planetsById, mapDiagonal) {
  const origin = planetsById.get(order.originPlanetId);
  const destination = planetsById.get(order.destinationPlanetId);
  const totalTravelTurns = turnsForDistance(distanceBetween(origin, destination), mapDiagonal);

  return {
    id: nextId('fleet'),
    ownerId,
    originPlanetId: origin.id,
    destinationPlanetId: destination.id,
    shipCount: order.shipCount,
    totalTravelTurns,
    turnsRemaining: totalTravelTurns,
    originX: origin.x,
    originY: origin.y,
    destX: destination.x,
    destY: destination.y,
  };
}
