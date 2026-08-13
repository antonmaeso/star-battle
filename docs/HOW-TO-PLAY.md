# Battle for Space — How to Play

> Maintained by the `game-docs` agent. Written for players — no
> implementation detail. This is the only file the blackbox tester ever
> sees, so it must stay accurate and complete.

## Aims

Battle for Space is a two-player game played by two people sharing one
device, taking turns "hotseat" style. You play a galaxy of planets —
some already owned (by you or your opponent), some neutral. Each
planet shows how many ships are stationed there. Each round, you issue
orders to send ships from planets you own toward other planets, aiming
to capture more of the galaxy from your opponent. Wipe out your
opponent's presence in the galaxy entirely — no planets and no fleets
left — to win.

Every game starts with a freshly generated galaxy — the number and
placement of neutral planets varies from game to game. The layout is
always mirrored, though, so both players start on opposite sides of
the map with an identical setup: the same homeworld strength, one
extra already-owned planet each, and matching distances to the
nearby neutral planets. No generated map favors one side over the
other.

## Starting the Game

Before play begins, a start screen appears with a brief how-to-play
summary and a setup form:

- Enter a starting ship count (a whole number greater than zero) for
  each of Player 1 and Player 2's homeworld. If you leave the fields
  as-is, a default value is used.
- Click **Start Game** to begin. If either field is invalid, an error
  message appears and the game doesn't start until it's fixed.
- Once started, each player's homeworld begins with the ship count you
  set, and the first round begins with Player 1's turn.

## Controls

Each round is split into two private turns — first yours, then your
opponent's — followed by an automatic resolution step.

**During your turn:**

- **Click a planet you own** to select it as the origin of a fleet
  order. It gets a yellow outline to show it's selected. Clicking a
  planet you don't own does nothing while you're choosing an origin —
  only your own planets can be selected as one.
- **Click a different planet** to select it as the destination. It
  gets a white outline.
- Once both an origin and a destination are selected, an order panel
  opens on the right side of the screen. It shows the route (origin →
  destination) along with how many rounds the fleet will take to
  arrive, so you know the travel time before you commit:
  - Enter the number of ships you want to send in the "Ships to send"
    field.
  - Click **Queue Order** to add the order to your list of queued
    orders for this round.
  - Click **Cancel** to discard the current selection without queuing
    an order.
- **Click your origin planet again**, or **click empty space** on the
  map, to clear your current selection and start over.
- Each order you queue appears in the "Queued Orders" list on the
  panel, showing the origin, destination, and ship count. Click
  **Remove** next to an order to take it out of the queue.
- The panel header shows whose turn it is and the current round
  number.
- When you're done queuing orders (you can also queue none at all),
  click **Lock In Orders** to end your turn. Once locked in, your
  orders can no longer be changed this round.

**Passing the device:**

- After Player 1 locks in, the screen is covered by a full-screen
  "Pass the device to Player 2" message, and the game underneath is
  completely inaccessible (no clicking through, no keyboard
  navigation) so Player 1's queued orders stay hidden. Hand the device
  to Player 2, then click **I'm ready** to reveal Player 2's turn.
- Player 2 then queues and locks in their own orders the same way.

**Resolution:**

- Once both players have locked in, the round resolves automatically
  (see Rules below).
- If the round's arrivals leave both players with ships on the same
  planet, that planet is fought over in a real-time battle before the
  round can finish — see "Fighting a battle" below.
- Once resolution (and any battles) is complete, play continues into
  the next round, starting again with Player 1's turn.

**Fighting a battle:**

- When a battle starts, control passes briefly to a live, real-time
  duel that both players play at the same time on the shared screen —
  there's no need to pass the device or hide anything, since both
  sides' ships are already known to both players by this point.
- Each side controls a paddle on their own edge of the screen (Player
  1 on the left, Player 2 on the right) and fires shots across at the
  other side:
  - **Player 1:** `W` / `S` to move your paddle up/down, `D` to fire.
  - **Player 2:** `↑` / `↓` (arrow keys) to move your paddle up/down,
    `/` to fire.
- There's a short cooldown between shots, so you can't just hold fire
  down. Whichever side brought more ships into the fight has a shorter
  cooldown and so fires faster, while the outnumbered side fires
  slower — the bigger the ship-count advantage, the bigger the speed
  difference, so numbers matter beyond just soaking up more hits.
- The more ships your side currently has left in the fight, the more
  shots you fire at once in each volley (a wider spread), up to a
  cap — so a large fleet is not just faster to fire but throws more
  shots per volley too. As you take losses during the fight, your
  spread narrows back down along with your shrinking ship count.
- Each shot that hits the other side's paddle costs them one ship —
  your current ship counts for the fight are shown at the top of the
  screen (Player 1's count on the left, Player 2's on the right).
- The first side whose ship count reaches zero loses the planet. The
  other side wins it outright, and their remaining ship count becomes
  that planet's new garrison.
- If more than one planet has a battle to fight this round, they're
  played one after another before the round finishes.

## Rules

- Planets are shown in different colors depending on who owns them —
  your own planets are shown in your color, and unowned (neutral)
  planets are shown in a third color. The number displayed on each
  planet is how many ships are currently there, and that ship count is
  always visible for every planet, including your opponent's.
- Fog of war hides your opponent's true ownership color: any planet
  they own appears in a distinct, obscured "fogged" color instead of
  their player color, so you can tell it isn't neutral or yours but
  not read their color directly off the map. Ownership only becomes
  fully visible again once you capture that planet yourself.
- You can only queue an order from a planet you own.
- The number of ships you send must be a whole number greater than
  zero.
- You can't send more ships from a planet than it currently has
  available. If you've already queued other orders from that same
  planet this round, the ships committed to those orders are
  subtracted from what's available for a new order.
- If you try to submit an invalid order (wrong ownership, zero or
  negative ships, or more ships than are available), the order panel
  shows an inline error message and the order is not queued.
- Ships you send leave the origin planet as soon as you lock in your
  orders — you'll see them subtracted from that planet's ship count
  right away.
- A fleet you send takes longer to arrive the farther apart the two
  planets are — anywhere from 1 round for a short hop up to 10 rounds
  for the longest distances on the map. You can see your own fleets
  moving across the map as small dots in your player color; your
  opponent's fleets stay hidden from you while they're in transit and
  only become visible when they arrive.
- Each round, every planet you own produces additional ships
  automatically, added to its ship count during resolution. How many
  ships a planet produces depends on its resources — richer planets
  produce more. A planet's resource level is shown as a small gold
  badge on the map (planets with no resources show no badge).
- When a fleet arrives at a planet that has no enemy ships on it
  (empty, neutral, or already yours), it captures or reinforces that
  planet — the planet's owner becomes the fleet's owner and its ship
  count is set to (or increased by) the arriving ships.
- If ships from both players end up at the same planet at the end of a
  round (either already stationed there and freshly arrived, or two
  opposing fleets arriving together), a real-time battle is triggered
  for that planet — see "Fighting a battle" under Controls above for
  how it's played and decided.

## Win / Lose Conditions

- You're eliminated once you have no planets left **and** no fleets
  currently in transit. Losing your planets alone doesn't finish you
  off if you still have a fleet on its way somewhere — but once that
  fleet lands (or is lost) with nothing else left, you're out.
- The game ends the moment only one player still has any presence
  (planets or fleets) left in the galaxy — a "Game Over" screen
  appears announcing that player as the winner, and the game stops
  there.
- If both players are eliminated at the same time, the game ends in a
  draw, and the game-over screen shows that instead of a winner.
