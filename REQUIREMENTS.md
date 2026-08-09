# Requirements — battle-for-space

Developer-facing task list, consumed by the `game-developer` agent. Not
player-facing — `docs/HOW-TO-PLAY.md` is the player-facing doc, maintained
separately by `game-docs`.

Format: one `- [ ]` item per unit of work. The developer picks the
**first** unchecked item, implements it fully, checks it off (`- [x]`) in
the same commit, and moves on next time it wakes. Add new items at the
bottom as they come up (your own ideas, or things you want prioritized
after reviewer/tester feedback settles).

## Backlog

- [ ] **Win/lose condition.** Per `docs/HOW-TO-PLAY.md`'s current "Win /
  Lose Conditions" section, this is the one explicitly-called-out gap:
  rounds resolve indefinitely with no game-over check. Implement:
  - A player is eliminated when they control zero planets and have zero
    ships in transit (no way back into the game) — the other player wins
    immediately.
  - A round cap (pick a reasonable number, e.g. 50 rounds) as a fallback:
    if neither player has been eliminated by then, whoever controls more
    planets wins; if planet counts are tied, whoever has more total ships
    (stationed + in transit) wins; if that's also tied, it's a draw.
  - A clear game-over screen naming the winner (or announcing a draw) and
    stopping further play — no more orders can be queued once the game has
    ended.
  - Update `docs/HOW-TO-PLAY.md`'s "Win / Lose Conditions" section to
    describe this accurately once implemented (or coordinate with
    `game-docs`, which should pick this up automatically as a
    player-facing change on your commit).
