import './style.css';
import { init, GameLoop } from 'kontra';
import { createPlayer, createPlanet } from './state/gameState.js';
import { createGalaxySprites } from './galaxy/galaxyRenderer.js';

init('game-canvas');

const players = [createPlayer('p1', 'Player 1'), createPlayer('p2', 'Player 2')];

const planets = [
  createPlanet({
    id: 'alpha',
    x: 120,
    y: 320,
    ownerId: 'p1',
    ships: 30,
    productionRate: 3,
    isHomeworld: true,
  }),
  createPlanet({ id: 'beta', x: 400, y: 150, ships: 6 }),
  createPlanet({ id: 'gamma', x: 512, y: 320, ships: 4 }),
  createPlanet({ id: 'delta', x: 400, y: 490, ownerId: 'p1', ships: 12, productionRate: 1 }),
  createPlanet({ id: 'epsilon', x: 620, y: 150, ownerId: 'p2', ships: 10, productionRate: 1 }),
  createPlanet({
    id: 'zeta',
    x: 904,
    y: 320,
    ownerId: 'p2',
    ships: 30,
    productionRate: 3,
    isHomeworld: true,
  }),
  createPlanet({ id: 'eta', x: 620, y: 490, ships: 5 }),
];

const planetSprites = createGalaxySprites(planets, players);

const loop = GameLoop({
  update() {
    planetSprites.forEach((sprite) => sprite.update());
  },
  render() {
    planetSprites.forEach((sprite) => sprite.render());
  },
});

loop.start();
