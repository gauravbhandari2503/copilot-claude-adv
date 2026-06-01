# Project documentation

Overview
- This workspace contains a collection of small vanilla JavaScript apps in `src/apps/` (dice roller, color picker, animal name generator, etc.). Each app follows the pattern: an HTML page, a CSS file, and a JS file in its own folder.

How to run locally
- Open `src/index.html` in your browser (double-click or use a simple static server such as `npx serve` or `python -m http.server`).

Structure
- `src/index.html` — landing page linking to apps
- `src/index.css` — common styles
- `src/main.js` — landing page behaviour
- `src/apps/*` — individual app folders (each contains `.html`, `.css`, `.js`)

Documentation pointers
- Per-app README files live next to each app when present. For example: `src/apps/twoDice/README.md`.

Next steps
- Add README files for other apps (diceRoller, colorPicker, animalName, etc.).
- Optionally add a generated `docs/` site or update `src/index.html` with direct README links.

Contact
- Maintainer: repository owner in this workspace.
