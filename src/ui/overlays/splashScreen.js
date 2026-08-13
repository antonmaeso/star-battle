import { MAX_TRAVEL_TURNS } from '../../core/constants.js';

export function createSplashScreen({ defaultShipsP1, defaultShipsP2, onStart }) {
  const root = document.createElement('div');
  root.className = 'splash-overlay';
  root.innerHTML = `
    <div class="splash-card">
      <h1 class="splash-title">Battle for Space</h1>
      <div class="splash-instructions">
        <h2>How to play</h2>
        <ul>
          <li>Pass the device between turns. Each player secretly queues fleet orders, then locks in.</li>
          <li>Click one of your planets, then a target, to queue a fleet — set how many ships to send.</li>
          <li>Farther targets take longer to reach, up to ${MAX_TRAVEL_TURNS} turns.</li>
          <li>Owned planets produce ships each round, based on their resources.</li>
          <li>If both players' ships arrive on the same planet, it's settled in a real-time duel: W/S and D for Player 1, ↑/↓ and / for Player 2.</li>
          <li>Eliminate the other player's planets and fleets to win.</li>
        </ul>
      </div>
      <div class="splash-setup">
        <label>
          Player 1 starting ships
          <input type="number" class="splash-ships-p1" min="1" step="1" />
        </label>
        <label>
          Player 2 starting ships
          <input type="number" class="splash-ships-p2" min="1" step="1" />
        </label>
        <p class="splash-error" hidden></p>
      </div>
      <button type="button" class="splash-start">Start Game</button>
    </div>
  `;

  const shipsP1Input = root.querySelector('.splash-ships-p1');
  const shipsP2Input = root.querySelector('.splash-ships-p2');
  const errorEl = root.querySelector('.splash-error');
  shipsP1Input.value = String(defaultShipsP1);
  shipsP2Input.value = String(defaultShipsP2);

  root.querySelector('.splash-start').addEventListener('click', () => {
    const shipsP1 = Number(shipsP1Input.value);
    const shipsP2 = Number(shipsP2Input.value);
    const valid = (n) => Number.isInteger(n) && n > 0;
    if (!valid(shipsP1) || !valid(shipsP2)) {
      errorEl.textContent = 'Enter a whole number greater than zero for each player.';
      errorEl.hidden = false;
      return;
    }
    root.hidden = true;
    onStart({ shipsP1, shipsP2 });
  });

  return { root };
}
