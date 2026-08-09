# Battle for Space — How to Play

> Maintained by the `game-docs` agent. Written for players — no
> implementation detail. This is the only file the blackbox tester ever
> sees, so it must stay accurate and complete.

## Aims

You play as Player 1 in a galaxy of planets. Some planets are already
owned (by you or your opponent), and some are neutral. Each planet shows
how many ships are stationed on it. You issue orders to send ships from
planets you own toward other planets.

The full aim of a match (how you win a game) has not been implemented
yet — there is currently no turn resolution or win/lose check. For now,
you can freely select planets and queue up fleet orders.

## Controls

- **Click a planet you own** to select it as the origin of a fleet order.
  It gets a yellow outline to show it's selected.
- **Click a different planet** to select it as the destination. It gets
  a white outline.
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

## Rules

- Planets are shown in different colors depending on who owns them —
  your planets are one color, your opponent's are another, and
  unowned (neutral) planets are a third color. The number displayed on
  each planet is how many ships are currently there.
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
- Orders you've queued stay in the list until you remove them or they
  are otherwise resolved.

## Win / Lose Conditions

_(Not yet implemented — there is no round resolution or win/lose check
in the game yet.)_
