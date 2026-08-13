import { GameLoop, initKeys, keyMap, keyPressed, onKey, offKey } from 'kontra';
import {
  FIRE_COOLDOWN_MS,
  MAX_SIMULTANEOUS_SHOTS,
  PADDLE_MARGIN,
  PADDLE_SPEED,
  PLAYER_COLORS,
  POWER_ADVANTAGE_MAX,
  PROJECTILE_RADIUS,
  PROJECTILE_SPEED,
  PROJECTILE_SPREAD_GAP,
  SHIPS_PER_EXTRA_SHOT,
} from '../core/constants.js';
import { clampPaddleY, createPaddle } from './battleEntities.js';
import { isOffScreen, projectileHitsPaddle } from './collisions.js';

let keysReady = false;
function ensureKeys() {
  if (keysReady) return;
  initKeys();
  keyMap['Slash'] = 'slash';
  keysReady = true;
}

// One real-time dodge duel: ship counts brought into the fight act as each
// side's lives. Whoever's count hits zero first loses; the survivor's
// remaining ships become the planet's new garrison (see resolveRound's
// Case B in galaxy/resolution.js and the caller's onResolved handler).
// A ship-count advantage translates into a firing-rate edge (not just extra
// lives), so a numerically superior fleet feels stronger in the fight
// itself: the side that brought more ships fires faster, up to
// POWER_ADVANTAGE_MAX at a full advantage, and the outnumbered side fires
// correspondingly slower. Fixed for the duration of the duel, based on the
// ship counts the fleets arrived with.
function fireCooldownFor(myShips, theirShips) {
  const advantage = (myShips / (myShips + theirShips) - 0.5) * 2;
  return FIRE_COOLDOWN_MS * (1 - advantage * POWER_ADVANTAGE_MAX);
}

// More ships currently alive means more guns firing at once, in the same
// volley — this reads off the *current* (not starting) count, so a side's
// spread visibly shrinks as it takes losses.
function shotCountFor(currentShips) {
  const extraShots = Math.floor(Math.max(0, currentShips - 1) / SHIPS_PER_EXTRA_SHOT);
  return Math.min(MAX_SIMULTANEOUS_SHOTS, 1 + extraShots);
}

export function createBattleDuel({ context, width, height, p1Ships, p2Ships, onResolved, starfield }) {
  ensureKeys();

  const state = { shipsP1: p1Ships, shipsP2: p2Ships };
  const fireCooldownP1 = fireCooldownFor(p1Ships, p2Ships);
  const fireCooldownP2 = fireCooldownFor(p2Ships, p1Ships);
  const paddleP1 = createPaddle(PADDLE_MARGIN, height);
  const paddleP2 = createPaddle(width - PADDLE_MARGIN, height);
  let projectiles = [];
  let lastFireP1 = -Infinity;
  let lastFireP2 = -Infinity;
  let resolved = false;

  function spawnVolley(owner, x, y, dx, shotCount) {
    const spread = (shotCount - 1) * PROJECTILE_SPREAD_GAP;
    for (let i = 0; i < shotCount; i += 1) {
      const offsetY = shotCount === 1 ? 0 : -spread / 2 + i * PROJECTILE_SPREAD_GAP;
      projectiles.push({ owner, x, y: y + offsetY, dx, radius: PROJECTILE_RADIUS });
    }
  }

  function fire(owner) {
    if (resolved) return;
    const now = performance.now();
    if (owner === 'p1') {
      if (now - lastFireP1 < fireCooldownP1) return;
      lastFireP1 = now;
      spawnVolley('p1', paddleP1.x + paddleP1.width, paddleP1.y, PROJECTILE_SPEED, shotCountFor(state.shipsP1));
    } else {
      if (now - lastFireP2 < fireCooldownP2) return;
      lastFireP2 = now;
      spawnVolley('p2', paddleP2.x - paddleP2.width, paddleP2.y, -PROJECTILE_SPEED, shotCountFor(state.shipsP2));
    }
  }

  const fireP1 = () => fire('p1');
  const fireP2 = () => fire('p2');
  onKey('d', fireP1, { handler: 'keydown' });
  onKey('slash', fireP2, { handler: 'keydown' });

  function update(dt) {
    if (resolved) return;

    if (keyPressed('w')) paddleP1.y -= PADDLE_SPEED * dt;
    if (keyPressed('s')) paddleP1.y += PADDLE_SPEED * dt;
    if (keyPressed('arrowup')) paddleP2.y -= PADDLE_SPEED * dt;
    if (keyPressed('arrowdown')) paddleP2.y += PADDLE_SPEED * dt;
    clampPaddleY(paddleP1, height);
    clampPaddleY(paddleP2, height);

    projectiles.forEach((projectile) => {
      projectile.x += projectile.dx * dt;
    });

    projectiles = projectiles.filter((projectile) => {
      if (isOffScreen(projectile, width)) return false;
      if (projectile.owner === 'p1' && projectileHitsPaddle(projectile, paddleP2)) {
        state.shipsP2 -= 1;
        return false;
      }
      if (projectile.owner === 'p2' && projectileHitsPaddle(projectile, paddleP1)) {
        state.shipsP1 -= 1;
        return false;
      }
      return true;
    });

    if (state.shipsP1 <= 0 || state.shipsP2 <= 0) {
      resolved = true;
      const winnerId = state.shipsP1 > 0 ? 'p1' : 'p2';
      const survivingShips = Math.max(state.shipsP1, state.shipsP2);
      teardown();
      onResolved({ winnerId, survivingShips });
    }
  }

  // A small fighter-craft silhouette in place of a flat paddle rect, nosed
  // toward the opposing side (p1 faces right, p2 faces left).
  function drawShip(paddle, color, facing) {
    context.save();
    context.translate(paddle.x, paddle.y);
    if (facing === 'left') context.scale(-1, 1);
    context.beginPath();
    context.moveTo(paddle.width / 2, 0);
    context.lineTo(-paddle.width / 2, -paddle.height / 2);
    context.lineTo(-paddle.width / 3, 0);
    context.lineTo(-paddle.width / 2, paddle.height / 2);
    context.closePath();
    context.fillStyle = color;
    context.shadowColor = color;
    context.shadowBlur = 12;
    context.fill();
    context.restore();
  }

  function render() {
    starfield?.render(context);

    drawShip(paddleP1, PLAYER_COLORS.p1, 'right');
    drawShip(paddleP2, PLAYER_COLORS.p2, 'left');

    projectiles.forEach((projectile) => {
      context.save();
      context.shadowColor = PLAYER_COLORS[projectile.owner];
      context.shadowBlur = 10;
      context.beginPath();
      context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      context.fillStyle = PLAYER_COLORS[projectile.owner];
      context.fill();
      context.restore();
    });

    context.font = 'bold 20px system-ui, sans-serif';
    context.textAlign = 'left';
    context.fillStyle = PLAYER_COLORS.p1;
    context.fillText(`P1: ${Math.max(state.shipsP1, 0)}`, 20, 30);
    context.textAlign = 'right';
    context.fillStyle = PLAYER_COLORS.p2;
    context.fillText(`P2: ${Math.max(state.shipsP2, 0)}`, width - 20, 30);
  }

  const loop = GameLoop({ context, update, render });

  function teardown() {
    offKey('d', { handler: 'keydown' });
    offKey('slash', { handler: 'keydown' });
    loop.stop();
  }

  return {
    start: () => loop.start(),
    stop: teardown,
  };
}
