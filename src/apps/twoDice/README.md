# Two Dice App

Short description
- A small vanilla JavaScript app that simulates rolling two six-sided dice, shows the total, keeps a short history, and displays basic statistics (average, highest, lowest, total rolls).

Files
- `twoDice.html` — app page (includes navigation back to home)
- `twoDice.css` — app-specific styles
- `twoDice.js` — core logic and UI updates

Usage
- Open `src/apps/twoDice/twoDice.html` in your browser or navigate to it from the landing page.
- Click the "Roll" button or press `Enter` to roll the dice.

Configuration
- `CONFIG` in `twoDice.js` contains:
  - `MAX_HISTORY` — number of recent rolls to store (default 10)
  - `ROLL_DURATION` — total animation duration in ms (default 600)
  - `ANIMATION_STEPS` — number of animation frames (default 10)

Behavior overview
- `rollDice()` prevents concurrent rolls via `state.isRolling`, animates intermediate random values using `setInterval`, then calls `finalizeRoll()` to generate final values, update `state.history`, and refresh the UI.
- `finalizeRoll()` sets `state.lastDice1` and `state.lastDice2`, trims history to `MAX_HISTORY`, and calls `updateUI()`.

Key functions & DOM hooks
- `rollDice()` — starts the roll animation; wired to `rollButton` click and `Enter` key.
- `finalizeRoll()` — computes final dice, updates state, and toggles UI enabled.
- `updateUI()` — orchestrates `updateTotalDisplay()`, `updateStatistics()`, and `updateHistory()`.
- DOM elements expected (in `twoDice.js`): `#dice1`, `#dice2`, `#totalValue`, `#rollButton`, `#history`, `#totalRolls`, `#average`, `#highest`, `#lowest`.

Testing tips
- Reduce `ROLL_DURATION` to 200ms and `ANIMATION_STEPS` to 5 for faster manual testing.
- Open the browser console to see the initialization log: `[Two Dice] initialized`.

Extending
- Persist history to `localStorage` if long-term retention is desired.
- Add animation easing using CSS transitions for smoother visuals (the code currently toggles a `.rolling` class).
