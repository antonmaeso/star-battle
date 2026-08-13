import { GameLoop, initKeys, keyMap, keyPressed, onKey, offKey } from 'kontra';
import {
  CANVAS_WIDTH,
  FIRE_COOLDOWN_MS,
  PADDLE_MARGIN,
  PADDLE_SPEED,
  PLAYER_COLORS,
  PROJECTILE_RADIUS,
  PROJECTILE_SPEED,
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
export function createBattleDuel({ context, p1Ships, p2Ships, onResolved }) {
  ensureKeys();

  const state = { shipsP1: p1Ships, shipsP2: p2Ships };
  const paddleP1 = createPaddle(PADDLE_MARGIN);
  const paddleP2 = createPaddle(CANVAS_WIDTH - PADDLE_MARGIN);
  let projectiles = [];
  let lastFireP1 = -Infinity;
  let lastFireP2 = -Infinity;
  let resolved = false;

  function fire(owner) {
    if (resolved) return;
    const now = performance.now();
    if (owner === 'p1') {
      if (now - lastFireP1 < FIRE_COOLDOWN_MS) return;
      lastFireP1 = now;
      projectiles.push({
        owner,
        x: paddleP1.x + paddleP1.width,
        y: paddleP1.y,
        dx: PROJECTILE_SPEED,
        radius: PROJECTILE_RADIUS,
      });
    } else {
      if (now - lastFireP2 < FIRE_COOLDOWN_MS) return;
      lastFireP2 = now;
      projectiles.push({
        owner,
        x: paddleP2.x - paddleP2.width,
        y: paddleP2.y,
        dx: -PROJECTILE_SPEED,
        radius: PROJECTILE_RADIUS,
      });
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
    clampPaddleY(paddleP1);
    clampPaddleY(paddleP2);

    projectiles.forEach((projectile) => {
      projectile.x += projectile.dx * dt;
    });

    projectiles = projectiles.filter((projectile) => {
      if (isOffScreen(projectile, CANVAS_WIDTH)) return false;
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

  function drawPaddle(paddle, color) {
    context.fillStyle = color;
    context.fillRect(paddle.x - paddle.width / 2, paddle.y - paddle.height / 2, paddle.width, paddle.height);
  }

  function render() {
    drawPaddle(paddleP1, PLAYER_COLORS.p1);
    drawPaddle(paddleP2, PLAYER_COLORS.p2);

    projectiles.forEach((projectile) => {
      context.beginPath();
      context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
      context.fillStyle = PLAYER_COLORS[projectile.owner];
      context.fill();
    });

    context.font = 'bold 20px system-ui, sans-serif';
    context.textAlign = 'left';
    context.fillStyle = PLAYER_COLORS.p1;
    context.fillText(`P1: ${Math.max(state.shipsP1, 0)}`, 20, 30);
    context.textAlign = 'right';
    context.fillStyle = PLAYER_COLORS.p2;
    context.fillText(`P2: ${Math.max(state.shipsP2, 0)}`, CANVAS_WIDTH - 20, 30);
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
