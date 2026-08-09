export function createGalaxyInput(canvas, planets, { onSelectionChange }) {
  let originPlanetId = null;
  let destinationPlanetId = null;

  function planetAt(x, y) {
    return planets.find((planet) => Math.hypot(planet.x - x, planet.y - y) <= planet.radius) ?? null;
  }

  function emitChange() {
    onSelectionChange({ originPlanetId, destinationPlanetId });
  }

  function reset() {
    originPlanetId = null;
    destinationPlanetId = null;
    emitChange();
  }

  function selectOrigin(planetId) {
    originPlanetId = planetId;
    destinationPlanetId = null;
    emitChange();
  }

  function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const clicked = planetAt(x, y);

    if (!clicked) {
      reset();
      return;
    }

    if (!originPlanetId) {
      selectOrigin(clicked.id);
      return;
    }

    if (clicked.id === originPlanetId) {
      reset();
      return;
    }

    if (!destinationPlanetId) {
      destinationPlanetId = clicked.id;
      emitChange();
      return;
    }

    selectOrigin(clicked.id);
  }

  canvas.addEventListener('click', handleClick);

  return {
    reset,
    destroy: () => canvas.removeEventListener('click', handleClick),
  };
}
