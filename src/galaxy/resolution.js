import { createFleetFromOrder } from './fleet.js';
import { applyProduction } from './production.js';

// Temporary stand-in for the real-time duel (arrives in M4): whichever side
// brought more ships wins outright, surviving with the difference.
function resolveContestedStub(p1Ships, p2Ships) {
  if (p1Ships === p2Ships) {
    const winnerId = Math.random() < 0.5 ? 'p1' : 'p2';
    return { winnerId, survivingShips: 1 };
  }
  const winnerId = p1Ships > p2Ships ? 'p1' : 'p2';
  const survivingShips = Math.abs(p1Ships - p2Ships);
  return { winnerId, survivingShips };
}

export function resolveRound(world, ordersByPlayer) {
  const planetsById = new Map(world.planets.map((planet) => [planet.id, planet]));

  // 1. Advance fleets already in transit before this round's new orders exist,
  // so a freshly-committed 1-turn fleet isn't double-decremented.
  world.fleets.forEach((fleet) => {
    fleet.turnsRemaining -= 1;
  });

  // 2. Commit this round's locked-in orders as new fleets; ships leave the
  // origin planet immediately so they can't be double-spent across orders.
  for (const playerId of ['p1', 'p2']) {
    for (const order of ordersByPlayer[playerId]) {
      const origin = planetsById.get(order.originPlanetId);
      origin.ships -= order.shipCount;
      world.fleets.push(createFleetFromOrder(order, playerId, planetsById));
    }
  }

  // 3. Apply production to owned planets.
  applyProduction(world.planets);

  // 4. Partition arrivals from fleets still traveling.
  const arrived = world.fleets.filter((fleet) => fleet.turnsRemaining <= 0);
  world.fleets = world.fleets.filter((fleet) => fleet.turnsRemaining > 0);

  // 5. Group arrivals by destination planet and resolve ownership.
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
      battlesTriggered.push({ planetId, p1Ships: p1Total, p2Ships: p2Total });
      planet.pendingBattle = true;
      const { winnerId, survivingShips } = resolveContestedStub(p1Total, p2Total);
      planet.ownerId = winnerId;
      planet.ships = survivingShips;
      planet.pendingBattle = false;
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
