import { Sprite } from 'kontra';
import { FOG_COLOR, NEUTRAL_COLOR } from '../core/constants.js';
import { shade } from '../core/color.js';

function ownerColor(planet, players) {
  if (!planet.ownerId) return NEUTRAL_COLOR;
  const owner = players.find((player) => player.id === planet.ownerId);
  return owner ? owner.color : NEUTRAL_COLOR;
}

// Fog of war: a planet owned by someone other than the viewer shows as
// fogged (owner identity hidden) rather than its true owner color. Neutral
// planets and the viewer's own planets are never fogged. Ship counts are
// intentionally still shown even when fogged.
function isFoggedFor(planet, viewerPlayerId) {
  return Boolean(planet.ownerId) && planet.ownerId !== viewerPlayerId;
}

function drawCircle(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

// Shaded-sphere look for a "known" planet: a lit highlight offset toward the
// upper-left, fading to a darker rim, so it reads as a lit orb rather than a
// flat disc. Fogged planets skip this and stay a flat, unlit matte color.
function drawPlanetBody(context, radius, baseColor) {
  const gradient = context.createRadialGradient(
    -radius * 0.35,
    -radius * 0.4,
    radius * 0.15,
    0,
    0,
    radius * 1.1
  );
  gradient.addColorStop(0, shade(baseColor, 0.45));
  gradient.addColorStop(0.55, baseColor);
  gradient.addColorStop(1, shade(baseColor, -0.4));
  drawCircle(context, 0, 0, radius, gradient);
}

function drawOwnedGlow(context, radius, color) {
  context.save();
  context.shadowColor = color;
  context.shadowBlur = 16;
  context.beginPath();
  context.arc(0, 0, radius + 1.5, 0, Math.PI * 2);
  context.strokeStyle = color;
  context.globalAlpha = 0.7;
  context.lineWidth = 1.5;
  context.stroke();
  context.restore();
}

// A thin tilted ring, like a targeting/strategic marker, for homeworlds —
// only drawn when the viewer actually knows the planet's true identity.
function drawHomeworldRing(context, radius, color) {
  context.save();
  context.strokeStyle = color;
  context.globalAlpha = 0.55;
  context.lineWidth = 1.5;
  context.beginPath();
  context.ellipse(0, 0, radius * 1.55, radius * 0.55, -0.35, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function drawShipCountBadge(context, radius, ships) {
  const label = String(ships);
  context.font = 'bold 12px ui-monospace, Consolas, monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const textWidth = context.measureText(label).width;
  const badgeY = radius + 6;

  roundRect(context, -textWidth / 2 - 6, badgeY, textWidth + 12, 16, 5);
  context.fillStyle = 'rgba(5, 5, 15, 0.72)';
  context.fill();

  context.fillStyle = '#f4f3ec';
  context.fillText(label, 0, badgeY + 8);
}

export function createPlanetSprite(planet, players, selection, getViewerPlayerId) {
  return Sprite({
    x: planet.x,
    y: planet.y,
    anchor: { x: 0.5, y: 0.5 },
    planet,
    render() {
      const { context } = this;
      const { radius } = this.planet;
      const fogged = isFoggedFor(this.planet, getViewerPlayerId());
      const color = ownerColor(this.planet, players);

      if (fogged) {
        drawCircle(context, 0, 0, radius, FOG_COLOR);
        context.save();
        context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        context.setLineDash([3, 3]);
        context.lineWidth = 1;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      } else {
        drawPlanetBody(context, radius, color);
        if (this.planet.ownerId) drawOwnedGlow(context, radius, color);
        if (this.planet.isHomeworld) drawHomeworldRing(context, radius, color);
      }

      if (selection?.originPlanetId === this.planet.id) {
        context.save();
        context.lineWidth = 2.5;
        context.strokeStyle = '#ffe066';
        context.shadowColor = '#ffe066';
        context.shadowBlur = 10;
        context.beginPath();
        context.arc(0, 0, radius + 4, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      } else if (selection?.destinationPlanetId === this.planet.id) {
        context.save();
        context.lineWidth = 2;
        context.strokeStyle = '#ffffff';
        context.setLineDash([4, 4]);
        context.beginPath();
        context.arc(0, 0, radius + 4, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }

      drawShipCountBadge(context, radius, this.planet.ships);
    },
  });
}

export function createGalaxySprites(planets, players, selection, getViewerPlayerId) {
  return planets.map((planet) => createPlanetSprite(planet, players, selection, getViewerPlayerId));
}

function drawShip(context, x, y, angle, color) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);

  const trail = context.createLinearGradient(-16, 0, -3, 0);
  trail.addColorStop(0, 'rgba(255, 255, 255, 0)');
  trail.addColorStop(1, color);
  context.fillStyle = trail;
  context.beginPath();
  context.moveTo(-16, -1.5);
  context.lineTo(-3, 0);
  context.lineTo(-16, 1.5);
  context.closePath();
  context.fill();

  context.beginPath();
  context.moveTo(7, 0);
  context.lineTo(-5, -4);
  context.lineTo(-5, 4);
  context.closePath();
  context.fillStyle = color;
  context.shadowColor = color;
  context.shadowBlur = 6;
  context.fill();

  context.restore();
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
      const angle = Math.atan2(fleet.destY - fleet.originY, fleet.destX - fleet.originX);
      const owner = players.find((player) => player.id === fleet.ownerId);

      drawShip(context, x, y, angle, owner ? owner.color : '#ffffff');
    });
}
