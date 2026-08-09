import './style.css';
import { init, GameLoop } from 'kontra';
import { createPlayer, createPlanet } from './state/gameState.js';
import { getOrders, addOrder, removeOrder } from './state/ordersState.js';
import { validateOrder, createOrder, availableShips } from './galaxy/orders.js';
import { createGalaxySprites } from './galaxy/galaxyRenderer.js';
import { createGalaxyInput } from './galaxy/galaxyInput.js';
import { createOrderPanel } from './ui/overlays/orderPanel.js';

const { canvas } = init('game-canvas');

// Single hardcoded active player for now — pass-and-peek hotseat switching
// between p1/p2 lands in M3 alongside round resolution.
const ACTIVE_PLAYER_ID = 'p1';

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

const planetsById = new Map(planets.map((planet) => [planet.id, planet]));
const selection = { originPlanetId: null, destinationPlanetId: null };

const planetSprites = createGalaxySprites(planets, players, selection);

const orderPanel = createOrderPanel({
  onSubmit(shipCount) {
    const origin = planetsById.get(selection.originPlanetId);
    const destination = planetsById.get(selection.destinationPlanetId);
    const error = validateOrder(ACTIVE_PLAYER_ID, origin, destination, shipCount);
    if (error) {
      orderPanel.showError(error);
      return;
    }
    addOrder(ACTIVE_PLAYER_ID, createOrder(origin, destination, shipCount));
    galaxyInput.reset();
    refreshQueue();
  },
  onCancel() {
    galaxyInput.reset();
  },
  onRemove(index) {
    removeOrder(ACTIVE_PLAYER_ID, index);
    refreshQueue();
  },
});

document.getElementById('game-root').appendChild(orderPanel.root);

function refreshQueue() {
  orderPanel.renderQueue(getOrders(ACTIVE_PLAYER_ID));
}

const galaxyInput = createGalaxyInput(canvas, planets, {
  onSelectionChange(nextSelection) {
    Object.assign(selection, nextSelection);

    if (selection.originPlanetId && selection.destinationPlanetId) {
      const origin = planetsById.get(selection.originPlanetId);
      const destination = planetsById.get(selection.destinationPlanetId);
      orderPanel.showDraft({
        originLabel: origin.id,
        destinationLabel: destination.id,
        maxShips: Math.max(0, availableShips(ACTIVE_PLAYER_ID, origin)),
      });
    } else {
      orderPanel.hideDraft();
    }
  },
});

refreshQueue();

const loop = GameLoop({
  update() {
    planetSprites.forEach((sprite) => sprite.update());
  },
  render() {
    planetSprites.forEach((sprite) => sprite.render());
  },
});

loop.start();
