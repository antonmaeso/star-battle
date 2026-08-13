import { createFleetFromOrder } from './fleet.js';
import { applyProduction } from './production.js';

// Runs once per round, at the first player's lock-in, before any new orders
// this round are committed — so a freshly-committed fleet isn't
// double-decremented the same round it departs.
export function advanceFleets(world) {
  world.fleets.forEach((fleet) => {
    fleet.turnsRemaining -= 1;
  });
}

// Runs at each player's own lock-in: their ships leave the origin planet and
// become an in-transit fleet immediately, rather than waiting for both
// players to lock in.
export function commitOrders(world, playerId, orders) {
  const planetsById = new Map(world.planets.map((planet) => [planet.id, planet]));
  orders.forEach((order) => {
    const origin = planetsById.get(order.originPlanetId);
    origin.ships -= order.shipCount;
    world.fleets.push(createFleetFromOrder(order, playerId, planetsById, world.mapDiagonal));
  });
}

// Runs once per round, after both players have locked in (and therefore
// committed their orders): production, then arrivals/ownership/battles.
export function resolveArrivals(world) {
  const planetsById = new Map(world.planets.map((planet) => [planet.id, planet]));

  applyProduction(world.planets);

  const arrived = world.fleets.filter((fleet) => fleet.turnsRemaining <= 0);
  world.fleets = world.fleets.filter((fleet) => fleet.turnsRemaining > 0);

  const arrivalsByPlanet = new Map();
  arrived.forEach((fleet) => {
    const list = arrivalsByPlanet.get(fleet.destinationPlanetId) ?? [];
    list.push(fleet);
    arrivalsByPlanet.set(fleet.destinationPlanetId, list);
  });

  const battlesTriggered = [];

  arrivalsByPlanet.forEach((fleets, planetId) => {
    const planet = planetsById.get(planetId);
    const arrivingP1 = fleets
      .filter((fleet) => fleet.ownerId === 'p1')
      .reduce((sum, fleet) => sum + fleet.shipCount, 0);
    const arrivingP2 = fleets
      .filter((fleet) => fleet.ownerId === 'p2')
      .reduce((sum, fleet) => sum + fleet.shipCount, 0);
    const p1Total = (planet.ownerId === 'p1' ? planet.ships : 0) + arrivingP1;
    const p2Total = (planet.ownerId === 'p2' ? planet.ships : 0) + arrivingP2;

    if (p1Total > 0 && p2Total > 0) {
      // Ownership stays undetermined until the real-time duel resolves it
      // (see battle/battleLoop.js and main.js's battle queue).
      battlesTriggered.push({ planetId, p1Ships: p1Total, p2Ships: p2Total });
      planet.pendingBattle = true;
    } else if (p1Total > 0) {
      planet.ownerId = 'p1';
      planet.ships = p1Total;
    } else if (p2Total > 0) {
      planet.ownerId = 'p2';
      planet.ships = p2Total;
    }
  });

  return battlesTriggered;
}
