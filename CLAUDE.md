# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (port 5173, `strictPort: true` — fails rather than picking another port if 5173 is taken; `host: true` exposes it on the LAN)
- `npm run build` — production build via Vite
- `npm run preview` — preview the production build locally

There is no test runner, linter, or formatter configured in this project yet.

## Architecture

This is currently the unmodified Vite vanilla-JS starter scaffold, not yet built out into the actual game:

- `index.html` — entry HTML, loads `src/main.js` as a module
- `src/main.js` — injects the starter markup into `#app` and wires up `src/counter.js`; this is the placeholder to replace when building the real game
- `src/counter.js` — example click-counter component from the Vite template
- `src/style.css` — global styles, using CSS custom properties defined on `:root` for theme values (colors, fonts, shadows)
- `public/` — static assets served as-is (favicon, icon sprite)

## Docs

`docs/HOW-TO-PLAY.md` is a player-facing rules doc with a stated ownership convention: it is maintained by a `game-docs` agent and is described as "the only file the blackbox tester ever sees." Keep it written for players (no implementation detail) and keep it accurate as game mechanics are implemented — its sections (Aims, Controls, Rules, Win/Lose Conditions) are currently unfilled placeholders since the game itself hasn't been built yet.
