import './style.css';
import { init, GameLoop, Sprite } from 'kontra';

const { canvas } = init('game-canvas');

const placeholder = Sprite({
  x: canvas.width / 2,
  y: canvas.height / 2,
  anchor: { x: 0.5, y: 0.5 },
  color: '#aa3bff',
  radius: 24,
  render() {
    this.context.beginPath();
    this.context.arc(0, 0, this.radius, 0, Math.PI * 2);
    this.context.fillStyle = this.color;
    this.context.fill();
  },
});

const loop = GameLoop({
  update() {
    placeholder.update();
  },
  render() {
    placeholder.render();
  },
});

loop.start();
