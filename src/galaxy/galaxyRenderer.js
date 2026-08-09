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

// Only the viewing player's own fleets are drawn — an opponent's in-transit
// fleet stays hidden until it arrives, per the galaxy phase's hidden orders.
export function drawFleets(context, fleets, viewerPlayerId, players) {
  fleets
    .filter((fleet) => fleet.ownerId === viewerPlayerId)
    .forEach((fleet) => {
      const progress = 1 - fleet.turnsRemaining / fleet.totalTravelTurns;
      const x = fleet.originX + (fleet.destX - fleet.originX) * progress;
      const y = fleet.originY + (fleet.destY - fleet.originY) * progress;
      const owner = players.find((player) => player.id === fleet.ownerId);

      context.beginPath();
      context.arc(x, y, 6, 0, Math.PI * 2);
      context.fillStyle = owner ? owner.color : '#ffffff';
      context.fill();
    });
}
