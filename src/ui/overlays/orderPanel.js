export function createOrderPanel({ onSubmit, onCancel, onRemove }) {
  const root = document.createElement('div');
  root.className = 'order-panel';
  root.innerHTML = `
    <div class="order-draft" hidden>
      <p class="order-draft-route"></p>
      <label>
        Ships to send
        <input type="number" class="order-draft-count" min="0" step="1" />
      </label>
      <p class="order-draft-error" hidden></p>
      <div class="order-draft-actions">
        <button type="button" class="order-draft-submit">Queue Order</button>
        <button type="button" class="order-draft-cancel">Cancel</button>
      </div>
    </div>
    <div class="order-queue">
      <h3>Queued Orders</h3>
      <ul class="order-queue-list"></ul>
    </div>
  `;

  const draftEl = root.querySelector('.order-draft');
  const routeEl = root.querySelector('.order-draft-route');
  const countInput = root.querySelector('.order-draft-count');
  const errorEl = root.querySelector('.order-draft-error');
  const queueListEl = root.querySelector('.order-queue-list');

  root.querySelector('.order-draft-submit').addEventListener('click', () => {
    onSubmit(Number(countInput.value));
  });
  root.querySelector('.order-draft-cancel').addEventListener('click', () => onCancel());

  function showDraft({ originLabel, destinationLabel, maxShips }) {
    draftEl.hidden = false;
    routeEl.textContent = `${originLabel} → ${destinationLabel}`;
    countInput.max = String(maxShips);
    countInput.value = '';
    errorEl.hidden = true;
  }

  function hideDraft() {
    draftEl.hidden = true;
    errorEl.hidden = true;
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function renderQueue(orders) {
    queueListEl.innerHTML = '';
    orders.forEach((order, index) => {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${order.originPlanetId} → ${order.destinationPlanetId}: ${order.shipCount}`;
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => onRemove(index));
      li.append(label, removeBtn);
      queueListEl.appendChild(li);
    });
  }

  return { root, showDraft, hideDraft, showError, renderQueue };
}
