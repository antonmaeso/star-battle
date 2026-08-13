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
to capture more of the galaxy from your opponent.

The full win/lose condition for a match (what ends the game) has not
been implemented yet — for now, rounds keep resolving one after
another with no game-over check.

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
  opens on the right side of the screen:
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
  down.
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
  your planets are one color, your opponent's are another, and
  unowned (neutral) planets are a third color. The number displayed on
  each planet is how many ships are currently there. Planet ownership
  and ship counts are always visible to both players.
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
- A fleet you send takes 1, 2, or 3 rounds to arrive, depending on how
  far apart the two planets are — closer planets are faster to reach.
  You can see your own fleets moving across the map as small dots in
  your player color; your opponent's fleets stay hidden from you while
  they're in transit and only become visible when they arrive.
- Each round, every planet you own produces additional ships
  automatically, added to its ship count during resolution.
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

_(Not yet implemented — rounds resolve automatically but there is no
game-over check yet, so a match currently continues indefinitely.)_
