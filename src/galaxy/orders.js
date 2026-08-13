import { getOrders } from '../state/ordersState.js';

export function shipsQueuedFrom(playerId, planetId) {
  return getOrders(playerId)
    .filter((order) => order.originPlanetId === planetId)
    .reduce((sum, order) => sum + order.shipCount, 0);
}

export function availableShips(playerId, planet) {
  return planet.ships - shipsQueuedFrom(playerId, planet.id);
}

export function validateOrder(playerId, originPlanet, destinationPlanet, shipCount) {
  if (!originPlanet || !destinationPlanet) {
    return 'Select a source and target planet.';
  }
  if (originPlanet.id === destinationPlanet.id) {
    return 'Source and target must be different planets.';
  }
  if (originPlanet.ownerId !== playerId) {
    return 'You do not own the source planet.';
  }
  if (!Number.isInteger(shipCount)) {
    return 'Enter a whole number of ships.';
  }
  if (shipCount <= 0) {
    return 'Enter a ship count greater than zero.';
  }
  if (shipCount > availableShips(playerId, originPlanet)) {
    return 'Not enough ships available at the source planet.';
  }
  return null;
}

export function createOrder(originPlanet, destinationPlanet, shipCount) {
  return {
    originPlanetId: originPlanet.id,
    destinationPlanetId: destinationPlanet.id,
    shipCount,
  };
}
