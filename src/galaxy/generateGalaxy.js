import { createPlanet } from '../state/gameState.js';
import { nextId } from '../core/id.js';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GALAXY_MARGIN,
  HOMEWORLD_MARGIN_X,
  HOMEWORLD_RESOURCES,
  MIN_PLANET_SPACING,
  NEUTRAL_PLANET_PAIR_RANGE,
  NEUTRAL_PLANET_RESOURCES_RANGE,
  NEUTRAL_PLANET_SHIPS_RANGE,
  SECONDARY_PLANET_RESOURCES,
  SECONDARY_PLANET_SHIPS_RANGE,
} from '../core/constants.js';

const CENTER = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };

// 180° rotation about the canvas center — the map's whole symmetry trick.
function mirror(point) {
  return { x: CANVAS_WIDTH - point.x, y: CANVAS_HEIGHT - point.y };
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function farEnough(point, placedPoints) {
  return placedPoints.every((other) => distance(point, other) >= MIN_PLANET_SPACING);
}

// A random point in the left half of the canvas, far enough from every
// already-placed planet *and* from where its mirror twin would land, so a
// mirrored pair never ends up overlapping anything. Gives up after a fixed
// number of attempts rather than looping forever once the map fills up.
function pickLeftHalfPoint(placedPoints, attempts = 200) {
  const xMin = GALAXY_MARGIN;
  const xMax = CENTER.x - GALAXY_MARGIN;
  const yMin = GALAXY_MARGIN;
  const yMax = CANVAS_HEIGHT - GALAXY_MARGIN;

  for (let i = 0; i < attempts; i += 1) {
    const point = {
      x: xMin + Math.random() * (xMax - xMin),
      y: yMin + Math.random() * (yMax - yMin),
    };
    if (farEnough(point, placedPoints) && farEnough(mirror(point), placedPoints)) return point;
  }
  return null;
}

// Builds a galaxy with 180°-point symmetry around the canvas center: every
// neutral planet has an identical mirrored twin, and each player's
// homeworld plus one pre-owned secondary planet sit at mirrored positions
// on opposite sides. Both players always start with an identical strategic
// layout, just facing the other way — no generated map favors one side.
export function generateGalaxy({ homeworldShips }) {
  const planets = [];
  const placedPoints = [];

  function place(point, config) {
    planets.push(createPlanet({ id: nextId('planet'), x: point.x, y: point.y, ...config }));
    placedPoints.push(point);
  }

  const homeP1 = { x: HOMEWORLD_MARGIN_X, y: CENTER.y };
  const homeP2 = mirror(homeP1);
  place(homeP1, { ownerId: 'p1', ships: homeworldShips, resources: HOMEWORLD_RESOURCES, isHomeworld: true });
  place(homeP2, { ownerId: 'p2', ships: homeworldShips, resources: HOMEWORLD_RESOURCES, isHomeworld: true });

  const secondaryShips = randomInt(...SECONDARY_PLANET_SHIPS_RANGE);
  const secondaryP1 = pickLeftHalfPoint(placedPoints) ?? { x: HOMEWORLD_MARGIN_X * 2, y: CENTER.y - 140 };
  place(secondaryP1, { ownerId: 'p1', ships: secondaryShips, resources: SECONDARY_PLANET_RESOURCES });
  place(mirror(secondaryP1), { ownerId: 'p2', ships: secondaryShips, resources: SECONDARY_PLANET_RESOURCES });

  const pairCount = randomInt(...NEUTRAL_PLANET_PAIR_RANGE);
  for (let i = 0; i < pairCount; i += 1) {
    const point = pickLeftHalfPoint(placedPoints);
    if (!point) break;
    const ships = randomInt(...NEUTRAL_PLANET_SHIPS_RANGE);
    const resources = randomInt(...NEUTRAL_PLANET_RESOURCES_RANGE);
    place(point, { ships, resources });
    place(mirror(point), { ships, resources });
  }

  return planets;
}
