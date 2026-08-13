const LAYERS = [
  { count: 90, size: [0.5, 1.1], alpha: [0.15, 0.35] },
  { count: 50, size: [1.0, 1.7], alpha: [0.35, 0.6] },
  { count: 20, size: [1.5, 2.4], alpha: [0.55, 0.95] },
];

function randomBetween([min, max]) {
  return min + Math.random() * (max - min);
}

// A static field of stars with a gentle per-star twinkle, shared by the
// galaxy map and the battle scene so the backdrop feels continuous across
// the phase transition rather than resetting.
export function createStarfield(width, height) {
  const stars = LAYERS.flatMap((layer) =>
    Array.from({ length: layer.count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randomBetween(layer.size),
      baseAlpha: randomBetween(layer.alpha),
      twinkleSpeed: 0.4 + Math.random() * 1.4,
      twinklePhase: Math.random() * Math.PI * 2,
    }))
  );

  const nebula = [
    { x: width * 0.18, y: height * 0.25, radius: width * 0.32, color: 'rgba(74, 60, 130, 0.10)' },
    { x: width * 0.82, y: height * 0.75, radius: width * 0.32, color: 'rgba(58, 90, 130, 0.10)' },
  ];

  function render(context) {
    const t = performance.now() / 1000;

    nebula.forEach((cloud) => {
      const gradient = context.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
      gradient.addColorStop(0, cloud.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    });

    stars.forEach((star) => {
      const twinkle = 0.7 + 0.3 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
      context.globalAlpha = star.baseAlpha * twinkle;
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = '#ffffff';
      context.fill();
    });
    context.globalAlpha = 1;
  }

  return { render };
}
