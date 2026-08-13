// A player is eliminated once they hold no planets and have no fleets in
// transit — checked only at round boundaries (after arrivals/battles have
// resolved), so a player isn't judged mid-flight while their last fleet is
// still travelling.
function isEliminated(world, playerId) {
  const ownsPlanet = world.planets.some((planet) => planet.ownerId === playerId);
  const hasFleet = world.fleets.some((fleet) => fleet.ownerId === playerId);
  return !ownsPlanet && !hasFleet;
}

// Returns { over: false } while the game continues, or { over: true, winnerId }
// once only one player has any presence left. winnerId is null on a
// simultaneous double-elimination (draw).
export function checkGameOver(world, players) {
  const survivors = players.filter((player) => !isEliminated(world, player.id));
  if (survivors.length === players.length) return { over: false };
  if (survivors.length === 1) return { over: true, winnerId: survivors[0].id };
  return { over: true, winnerId: null };
}
