function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const full = value.length === 3
    ? value.split('').map((c) => c + c).join('')
    : value;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

// Mixes a hex color toward white (percent > 0) or black (percent < 0).
// percent is clamped to [-1, 1].
export function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const p = Math.max(-1, Math.min(1, percent));
  const target = p < 0 ? 0 : 255;
  const amount = Math.abs(p);
  const mix = (channel) => Math.round(channel + (target - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
