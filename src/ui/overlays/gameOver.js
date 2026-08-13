export function createGameOverOverlay() {
  const root = document.createElement('div');
  root.className = 'pass-overlay game-over-overlay';
  root.hidden = true;
  root.innerHTML = `
    <div class="pass-overlay-card">
      <p class="pass-overlay-message game-over-message"></p>
    </div>
  `;

  const messageEl = root.querySelector('.game-over-message');

  function show(winnerName) {
    messageEl.textContent = winnerName ? `${winnerName} wins!` : 'Draw — both fleets were wiped out.';
    root.hidden = false;
  }

  return { root, show };
}
