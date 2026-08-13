import { PADDLE_HEIGHT, PADDLE_WIDTH } from '../core/constants.js';

export function createPaddle(x, canvasHeight) {
  return { x, y: canvasHeight / 2, width: PADDLE_WIDTH, height: PADDLE_HEIGHT };
}

export function clampPaddleY(paddle, canvasHeight) {
  const half = paddle.height / 2;
  paddle.y = Math.min(canvasHeight - half, Math.max(half, paddle.y));
}
