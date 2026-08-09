# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (port 5173, `strictPort: true` — fails rather than picking another port if 5173 is taken; `host: true` exposes it on the LAN)
- `npm run build` — production build via Vite
- `npm run preview` — preview the production build locally

There is no test runner, linter, or formatter configured in this project yet.

## Architecture

Battle for Space is a two-player local hotseat game built on Vite + vanilla JS, rendered with [Kontra.js](https://straker.github.io/kontra/) on a single `<canvas id="game-canvas">`. All non-canvas UI (order forms, pass-device overlay, HUD) is plain DOM, mounted into `#game-root` alongside the canvas.

The game has two phases:

- **Galaxy phase** (turn-based): players take hidden, simultaneous-feeling turns via a same-device "pass-and-peek" flow — `src/state/stateMachine.js` drives `ORDERS_P1 → PASS_TO_P2 → ORDERS_P2 → RESOLVING → (loop)`. Orders are queued per-player in `src/state/ordersState.js` and never merged into shared state until both players lock in, so neither player's UI can see the other's pending orders. `src/galaxy/resolution.js` runs each round: advance in-transit fleets, commit new orders as fleets, apply production (`galaxy/production.js`), then resolve arrivals — a planet with only one player's ships present is captured/reinforced, a planet with both is a contested battle.
- **Battle phase**: real-time local-multiplayer duel when a galaxy round leaves both players' ships on the same planet (currently stubbed in `resolution.js` as an instant higher-ship-count-wins resolution — the real Kontra-driven duel lands in a later milestone).

Key modules:
- `src/state/` — `gameState.js` (Player/Planet factories), `ordersState.js` (per-player pending-order buffers), `stateMachine.js` (round-flow FSM)
- `src/galaxy/` — `distance.js` (distance→travel-turns), `fleet.js` (fleet creation), `production.js`, `resolution.js`, `orders.js` (order validation), `galaxyRenderer.js` (Kontra sprites for planets/fleets), `galaxyInput.js` (click-to-select-and-target)
- `src/ui/overlays/` — `orderPanel.js` (order draft form + queue + lock-in), `passDevice.js` (full-screen "pass the device" blocker, uses the `inert` attribute on `#game-root` to block pointer/keyboard access to the hidden player's UI underneath)
- `src/core/constants.js` — tunable numbers (colors, canvas size, distance thresholds)

The galaxy map is currently a hardcoded set of planets in `main.js`; procedural generation is planned for a later milestone. A dev-only `window.__game` handle (gated behind `import.meta.env.DEV`) exposes `{ world, stateMachine, PHASE }` in the browser console for manual state inspection — there is no automated test suite in this project.

**CSS gotcha:** an element toggled via the `hidden` attribute must not have its own `display` rule set unconditionally in an author stylesheet (e.g. `.foo { display: flex }`) — that overrides the UA's `[hidden] { display: none }` and the element stays visible/interactive. Pair any such rule with `.foo[hidden] { display: none; }`.

## Docs

`docs/HOW-TO-PLAY.md` is a player-facing rules doc with a stated ownership convention: it is maintained by a `game-docs` agent and is described as "the only file the blackbox tester ever sees." Keep it written for players (no implementation detail) and keep it accurate as game mechanics are implemented — its sections (Aims, Controls, Rules, Win/Lose Conditions) are currently unfilled placeholders since the game itself hasn't been built yet.

## Git workflow

Other agents work against this same repo concurrently (a `game-docs` bot updates `docs/HOW-TO-PLAY.md`, and a blackbox-tester bot drives the running dev server from a container via `host.docker.internal`, see `vite.config.js`'s `allowedHosts`). Commit and push after each milestone/change lands, and pull before starting new work, so everyone is working off current state and docs/tests can track the game as it's built. 