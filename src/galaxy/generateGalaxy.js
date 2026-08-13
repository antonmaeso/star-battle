import { createPlanet } from '../state/gameState.js';
import { nextId } from '../core/id.js';
import {
  GALAXY_MARGIN,
  HOMEWORLD_MARGIN_X,
  HOMEWORLD_RESOURCES,
  MIN_PLANET_SPACING,
  NEUTRAL_PLANET_RESOURCES_RANGE,
  NEUTRAL_PLANET_SHIPS_RANGE,
  SECONDARY_PLANET_RESOURCES,
  SECONDARY_PLANET_SHIPS_RANGE,
} from '../core/constants.js';

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Builds a galaxy with 180°-point symmetry around the map's center: every
// neutral planet has an identical mirrored twin, and each player's
// homeworld plus one pre-owned secondary planet sit at mirrored positions
// on opposite sides. Both players always start with an identical strategic
// layout, just facing the other way — no generated map favors one side,
// whatever size it is.
export function generateGalaxy({ width, height, shipsP1, shipsP2, neutralPlanetPairCount }) {
  const center = { x: width / 2, y: height / 2 };
  const mirror = (point) => ({ x: width - point.x, y: height - point.y });

  const planets = [];
  const placedPoints = [];

  function farEnough(point) {
    return placedPoints.every((other) => distance(point, other) >= MIN_PLANET_SPACING);
  }

  // A random point in the left half of the map, far enough from every
  // already-placed planet *and* from where its mirror twin would land, so a
  // mirrored pair never ends up overlapping anything. Gives up after a
  // fixed number of attempts rather than looping forever once the map
  // fills up.
  function pickLeftHalfPoint(attempts = 200) {
    const xMin = GALAXY_MARGIN;
    const xMax = center.x - GALAXY_MARGIN;
    const yMin = GALAXY_MARGIN;
    const yMax = height - GALAXY_MARGIN;

    for (let i = 0; i < attempts; i += 1) {
      const point = {
        x: xMin + Math.random() * (xMax - xMin),
        y: yMin + Math.random() * (yMax - yMin),
      };
      if (farEnough(point) && farEnough(mirror(point))) return point;
    }
    return null;
  }

  function place(point, config) {
    planets.push(createPlanet({ id: nextId('planet'), x: point.x, y: point.y, ...config }));
    placedPoints.push(point);
  }

  const homeP1 = { x: HOMEWORLD_MARGIN_X, y: center.y };
  const homeP2 = mirror(homeP1);
  place(homeP1, { ownerId: 'p1', ships: shipsP1, resources: HOMEWORLD_RESOURCES, isHomeworld: true });
  place(homeP2, { ownerId: 'p2', ships: shipsP2, resources: HOMEWORLD_RESOURCES, isHomeworld: true });

  const secondaryShips = randomInt(...SECONDARY_PLANET_SHIPS_RANGE);
  const secondaryP1 = pickLeftHalfPoint() ?? { x: HOMEWORLD_MARGIN_X * 2, y: center.y - 140 };
  place(secondaryP1, { ownerId: 'p1', ships: secondaryShips, resources: SECONDARY_PLANET_RESOURCES });
  place(mirror(secondaryP1), { ownerId: 'p2', ships: secondaryShips, resources: SECONDARY_PLANET_RESOURCES });

  for (let i = 0; i < neutralPlanetPairCount; i += 1) {
    const point = pickLeftHalfPoint();
    if (!point) break;
    const ships = randomInt(...NEUTRAL_PLANET_SHIPS_RANGE);
    const resources = randomInt(...NEUTRAL_PLANET_RESOURCES_RANGE);
    place(point, { ships, resources });
    place(mirror(point), { ships, resources });
  }

  return planets;
}
