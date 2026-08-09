const buckets = { p1: [], p2: [] };

export function getOrders(playerId) {
  return buckets[playerId];
}

export function addOrder(playerId, order) {
  buckets[playerId].push(order);
}

export function removeOrder(playerId, index) {
  buckets[playerId].splice(index, 1);
}

export function clearOrders(playerId) {
  buckets[playerId] = [];
}

export function resetAllOrders() {
  buckets.p1 = [];
  buckets.p2 = [];
}
