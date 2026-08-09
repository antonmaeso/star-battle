export function applyProduction(planets) {
  planets.forEach((planet) => {
    if (planet.ownerId) {
      planet.ships += planet.productionRate;
    }
  });
}
