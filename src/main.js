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
import { advanceFleets, commitOrders, resolveArrivals } from './galaxy/resolution.js';
import { createBattleDuel } from './battle/battleLoop.js';

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
    const phase = stateMachine.getPhase();
    if (phase === PHASE.ORDERS_P1) {
      // Advance in-transit fleets once at the top of the round, before this
      // round's own orders are committed, so a freshly-departed fleet isn't
      // double-decremented the same round it leaves.
      advanceFleets(world);
      commitOrders(world, 'p1', getOrders('p1'));
      clearOrders('p1');
      stateMachine.lockInP1();
    } else if (phase === PHASE.ORDERS_P2) {
      commitOrders(world, 'p2', getOrders('p2'));
      clearOrders('p2');
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
  getActivePlayerId: () => activePlayerId,
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

let battleQueue = [];
let activeBattle = null;

function handlePhaseChange(phase) {
  if (phase === PHASE.ORDERS_P1 || phase === PHASE.ORDERS_P2) {
    gameRoot.inert = false;
    orderPanel.root.hidden = false;
    activePlayerId = phase === PHASE.ORDERS_P1 ? 'p1' : 'p2';
    passOverlay.hide();
    galaxyInput.reset();
    orderPanel.hideDraft();
    orderPanel.setHeader(playerNames[activePlayerId], world.round);
    refreshQueue();
    galaxyLoop.start();
  } else if (phase === PHASE.PASS_TO_P2) {
    gameRoot.inert = true;
    passOverlay.show(playerNames.p2);
  } else if (phase === PHASE.RESOLVING) {
    gameRoot.inert = true;
    runResolution();
  } else if (phase === PHASE.BATTLE_ACTIVE) {
    gameRoot.inert = true;
    orderPanel.root.hidden = true;
    galaxyLoop.stop();
    startNextBattle();
  }
}

function runResolution() {
  const battlesTriggered = resolveArrivals(world);

  if (battlesTriggered.length > 0) {
    battleQueue = battlesTriggered;
    stateMachine.startBattle();
  } else {
    world.round += 1;
    stateMachine.finishResolving();
  }
}

function startNextBattle() {
  const battle = battleQueue.shift();
  activeBattle = createBattleDuel({
    context,
    p1Ships: battle.p1Ships,
    p2Ships: battle.p2Ships,
    onResolved({ winnerId, survivingShips }) {
      const planet = planetsById.get(battle.planetId);
      planet.ownerId = winnerId;
      planet.ships = survivingShips;
      planet.pendingBattle = false;
      activeBattle = null;

      if (battleQueue.length > 0) {
        startNextBattle();
      } else {
        world.round += 1;
        stateMachine.finishResolving();
      }
    },
  });
  activeBattle.start();
}

orderPanel.setHeader(playerNames.p1, world.round);
refreshQueue();

const galaxyLoop = GameLoop({
  context,
  update() {
    planetSprites.forEach((sprite) => sprite.update());
  },
  render() {
    planetSprites.forEach((sprite) => sprite.render());
    drawFleets(context, world.fleets, activePlayerId, players);
  },
});

galaxyLoop.start();

if (import.meta.env.DEV) {
  window.__game = {
    world,
    stateMachine,
    PHASE,
    getBattleQueue: () => battleQueue,
    getActiveBattle: () => activeBattle,
  };
}
