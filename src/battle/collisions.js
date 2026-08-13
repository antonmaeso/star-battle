export function projectileHitsPaddle(projectile, paddle) {
  return (
    Math.abs(projectile.x - paddle.x) <= paddle.width / 2 + projectile.radius &&
    Math.abs(projectile.y - paddle.y) <= paddle.height / 2 + projectile.radius
  );
}

export function isOffScreen(projectile, canvasWidth) {
  return projectile.x < -20 || projectile.x > canvasWidth + 20;
}
