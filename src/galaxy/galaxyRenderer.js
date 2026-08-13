import { Sprite } from 'kontra';
import { NEUTRAL_COLOR } from '../core/constants.js';

function ownerColor(planet, players) {
  if (!planet.ownerId) return NEUTRAL_COLOR;
  const owner = players.find((player) => player.id === planet.ownerId);
  return owner ? owner.color : NEUTRAL_COLOR;
}

function drawCircle(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

export function createPlanetSprite(planet, players, selection) {
  return Sprite({
    x: planet.x,
    y: planet.y,
    anchor: { x: 0.5, y: 0.5 },
    planet,
    render() {
      const { context } = this;

      drawCircle(context, 0, 0, this.planet.radius, ownerColor(this.planet, players));

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
      // Render at the midpoint of the fleet's *current* remaining turn, not
      // the start of it — turnsRemaining only changes once per round, so
      // rendering at the segment boundary would place a freshly-departed (or
      // 1-turn) fleet exactly on top of its origin planet for its entire
      // first round, making it visually indistinguishable from "not sent".
      const elapsedTurns = fleet.totalTravelTurns - fleet.turnsRemaining + 0.5;
      const progress = elapsedTurns / fleet.totalTravelTurns;
      const x = fleet.originX + (fleet.destX - fleet.originX) * progress;
      const y = fleet.originY + (fleet.destY - fleet.originY) * progress;
      const owner = players.find((player) => player.id === fleet.ownerId);

      drawCircle(context, x, y, 6, owner ? owner.color : '#ffffff');
    });
}
