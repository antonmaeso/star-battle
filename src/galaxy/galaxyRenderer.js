import { Sprite } from 'kontra';
import { NEUTRAL_COLOR } from '../core/constants.js';

function ownerColor(planet, players) {
  if (!planet.ownerId) return NEUTRAL_COLOR;
  const owner = players.find((player) => player.id === planet.ownerId);
  return owner ? owner.color : NEUTRAL_COLOR;
}

export function createPlanetSprite(planet, players, selection) {
  return Sprite({
    x: planet.x,
    y: planet.y,
    anchor: { x: 0.5, y: 0.5 },
    planet,
    render() {
      const { context } = this;

      context.beginPath();
      context.arc(0, 0, this.planet.radius, 0, Math.PI * 2);
      context.fillStyle = ownerColor(this.planet, players);
      context.fill();

      if (selection?.originPlanetId === this.planet.id) {
        context.lineWidth = 3;
        context.strokeStyle = '#ffe066';
        context.stroke();
      } else if (selection?.destinationPlanetId === this.planet.id) {
        context.lineWidth = 3;
        context.strokeStyle = '#ffffff';
        context.stroke();
      }

      context.font = 'bold 14px system-ui, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = '#05050a';
      context.fillText(String(this.planet.ships), 0, 1);
    },
  });
}

export function createGalaxySprites(planets, players, selection) {
  return planets.map((planet) => createPlanetSprite(planet, players, selection));
}
