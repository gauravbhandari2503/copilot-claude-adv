# Multi-App Suite - Copilot Instructions

## Project Overview
A modular collection of vanilla JavaScript applications. Each app is self-contained with its own HTML, CSS, and JavaScript files, sharing common styles and conventions.

## Tech Stack
HTML5, CSS3 (custom, no frameworks), Vanilla JavaScript (ES6+, no frameworks).

## Directory Structure
```
src/
├── index.html / index.css / main.js     # Landing page
└── apps/[appName]/
    ├── [appName].html / .css / .js      # App-specific files
```

### File Organization
1. Each app: dedicated `src/apps/[appName]/` folder with three files: `[appName].html`, `.css`, `.js`
2. HTML files link to `../../index.css` + app's own CSS
3. All apps include "← Home" navigation link
4. See `vanilla-app-structure` skill for detailed guidelines and JavaScript structure patterns

## Coding Standards
- **No external libraries** (unless explicitly requested)
- **ES6+ syntax**: Use `const`, `let`, arrow functions, template literals
- **State management**: Keep mutable state in a single object at the top of JS files
- **DOM**: Use standard browser APIs; cache DOM selectors in `const elements = {}`
- **Functions**: Keep single-purpose; organize by category (state → DOM → core → UI → helpers → events → init)
- **Color palette**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Units**: Use relative units (`rem`, `em`, `%`) for responsiveness
- **Animations**: Use CSS transitions/transforms (not JS animations)

## Creating New Apps
1. Create `src/apps/[appName]/` folder
2. Create three files: `[appName].html`, `.css`, `.js` with matching names
3. Follow structure in `vanilla-app-structure` skill
4. Add link card to `src/index.html`

## Common Features
- **Navigation**: "← Home" link in all apps
- **Animations**: Smooth transitions on interactions
- **Statistics**: Track counts, averages, etc. (if applicable)
- **History**: Maintain recent action history (if applicable)
- **Keyboard Support**: Enter key triggering actions (if applicable)
