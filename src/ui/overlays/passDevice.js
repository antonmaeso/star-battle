export function createPassOverlay({ onReady }) {
  const root = document.createElement('div');
  root.className = 'pass-overlay';
  root.hidden = true;
  root.innerHTML = `
    <div class="pass-overlay-card">
      <p class="pass-overlay-message"></p>
      <button type="button" class="pass-overlay-ready">I'm ready</button>
    </div>
  `;

  const messageEl = root.querySelector('.pass-overlay-message');
  root.querySelector('.pass-overlay-ready').addEventListener('click', () => onReady());

  function show(playerName) {
    messageEl.textContent = `Pass the device to ${playerName}`;
    root.hidden = false;
  }

  function hide() {
    root.hidden = true;
  }

  return { root, show, hide };
}
