import { PRODUCTION_PER_RESOURCE } from '../core/constants.js';

export function applyProduction(planets) {
  planets.forEach((planet) => {
    if (planet.ownerId) {
      planet.ships += planet.resources * PRODUCTION_PER_RESOURCE;
    }
  });
}
