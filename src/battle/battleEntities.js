import { CANVAS_HEIGHT, PADDLE_HEIGHT, PADDLE_WIDTH } from '../core/constants.js';

export function createPaddle(x) {
  return { x, y: CANVAS_HEIGHT / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
}

export function clampPaddleY(paddle) {
  const half = paddle.height / 2;
  paddle.y = Math.min(CANVAS_HEIGHT - half, Math.max(half, paddle.y));
}
