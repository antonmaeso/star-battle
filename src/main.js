import './style.css';
import { init, GameLoop } from 'kontra';
import { createPlayer, createPlanet } from './state/gameState.js';
import { getOrders, addOrder, removeOrder, clearOrders } from './state/ordersState.js';
import { validateOrder, createOrder, availableShips } from './galaxy/orders.js';
import { createGalaxySprites, drawFleets } from './galaxy/galaxyRenderer.js';
import { createGalaxyInput } from './galaxy/galaxyInput.js';
import { createOrderPanel } from './ui/overlays/orderPanel.js';
import { createPassOverlay } from './ui/overlays/passDevice.js';
import { createStateMachine, PHASE } from './state/stateMachine.js';
import { resolveRound } from './galaxy/resolution.js';

const { canvas, context } = init('game-canvas');
const gameRoot = document.getElementById('game-root');

const players = [createPlayer('p1', 'Player 1'), createPlayer('p2', 'Player 2')];
const playerNames = { p1: 'Player 1', p2: 'Player 2' };

const world = {
  round: 1,
  fleets: [],
  planets: [
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
  ],
};

const planetsById = new Map(world.planets.map((planet) => [planet.id, planet]));
const selection = { originPlanetId: null, destinationPlanetId: null };

const planetSprites = createGalaxySprites(world.planets, players, selection);

let activePlayerId = 'p1';

const stateMachine = createStateMachine(handlePhaseChange);

const orderPanel = createOrderPanel({
  onSubmit(shipCount) {
    const origin = planetsById.get(selection.originPlanetId);
    const destination = planetsById.get(selection.destinationPlanetId);
    const error = validateOrder(activePlayerId, origin, destination, shipCount);
    if (error) {
      orderPanel.showError(error);
      return;
    }
    addOrder(activePlayerId, createOrder(origin, destination, shipCount));
    galaxyInput.reset();
    refreshQueue();
  },
  onCancel() {
    galaxyInput.reset();
  },
  onRemove(index) {
    removeOrder(activePlayerId, index);
    refreshQueue();
  },
  onLockIn() {
    galaxyInput.reset();
    if (stateMachine.getPhase() === PHASE.ORDERS_P1) {
      stateMachine.lockInP1();
    } else if (stateMachine.getPhase() === PHASE.ORDERS_P2) {
      stateMachine.lockInP2();
    }
  },
});

gameRoot.appendChild(orderPanel.root);

const passOverlay = createPassOverlay({
  onReady() {
    stateMachine.confirmPassToP2();
  },
});

document.body.appendChild(passOverlay.root);

function refreshQueue() {
  orderPanel.renderQueue(getOrders(activePlayerId));
}

const galaxyInput = createGalaxyInput(canvas, world.planets, {
  onSelectionChange(nextSelection) {
    Object.assign(selection, nextSelection);

    if (selection.originPlanetId && selection.destinationPlanetId) {
      const origin = planetsById.get(selection.originPlanetId);
      const destination = planetsById.get(selection.destinationPlanetId);
      orderPanel.showDraft({
        originLabel: origin.id,
        destinationLabel: destination.id,
        maxShips: Math.max(0, availableShips(activePlayerId, origin)),
      });
    } else {
      orderPanel.hideDraft();
    }
  },
});

function handlePhaseChange(phase) {
  if (phase === PHASE.ORDERS_P1 || phase === PHASE.ORDERS_P2) {
    gameRoot.inert = false;
    activePlayerId = phase === PHASE.ORDERS_P1 ? 'p1' : 'p2';
    passOverlay.hide();
    galaxyInput.reset();
    orderPanel.hideDraft();
    orderPanel.setHeader(playerNames[activePlayerId], world.round);
    refreshQueue();
  } else if (phase === PHASE.PASS_TO_P2) {
    gameRoot.inert = true;
    passOverlay.show(playerNames.p2);
  } else if (phase === PHASE.RESOLVING) {
    gameRoot.inert = true;
    runResolution();
  }
}

function runResolution() {
  const ordersByPlayer = { p1: getOrders('p1').slice(), p2: getOrders('p2').slice() };
  resolveRound(world, ordersByPlayer);
  clearOrders('p1');
  clearOrders('p2');
  world.round += 1;
  stateMachine.finishResolving();
}

orderPanel.setHeader(playerNames.p1, world.round);
refreshQueue();

const loop = GameLoop({
  update() {
    planetSprites.forEach((sprite) => sprite.update());
  },
  render() {
    planetSprites.forEach((sprite) => sprite.render());
    drawFleets(context, world.fleets, activePlayerId, players);
  },
});

loop.start();

if (import.meta.env.DEV) {
  window.__game = { world, stateMachine, PHASE };
}
