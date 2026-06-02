---
description: Guidelines for adding new vanilla JavaScript applications to this project and structuring each app's JavaScript file properly. Use when creating new apps/pages or refactoring existing code.
---

# Vanilla App Structure Skill

## When to Use
- Creating a new app/page (e.g., coin flip, counter, timer)
- Refactoring existing code into proper structure
- Adding features to existing apps

## Project Structure

Each app: dedicated `src/apps/[appName]/` folder with three files: `[appName].html`, `.css`, `.js`

```
src/
  ├── index.html / index.css / main.js
  └── apps/[appName]/
      ├── [appName].html
      ├── [appName].css
      └── [appName].js
```

## JavaScript File Structure Pattern

Order: State → DOM → Core Functions → UI Updates → Helpers → Event Handlers → Init

```javascript
// STATE & CONFIG
let state = {
    isProcessing: false,
    history: [],
    currentValue: null
};

const CONFIG = {
    MAX_HISTORY: 10,
    ANIMATION_DURATION: 200
};

// DOM ELEMENTS (cache selectors)
const elements = {
    mainButton: document.getElementById('mainButton'),
    display: document.getElementById('display'),
    historyContainer: document.getElementById('history'),
    totalCount: document.getElementById('totalCount')
};

// CORE FUNCTIONS
function performMainAction() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    updateState();
    updateUI();
}

function updateState() {
    // State mutations here
}

// UI UPDATE FUNCTIONS
function updateUI() {
    updateDisplay();
    updateHistory();
    updateStatistics();
}

function updateDisplay() {
    // Update display element
}

function updateHistory() {
    if (state.history.length === 0) {
        elements.historyContainer.innerHTML = '<p class="empty-message">No history yet.</p>';
        return;
    }
    elements.historyContainer.innerHTML = state.history
        .map((item, idx) => `<div class="history-item"><span>${idx + 1}</span> ${item}</div>`)
        .join('');
}

function updateStatistics() {
    elements.totalCount.textContent = state.history.length;
}

// HELPER FUNCTIONS
function createHistoryItemHTML(item, index) {
    return `<div class="history-item">${index + 1}: ${item}</div>`;
}

// EVENT HANDLERS
function handleButtonClick() {
    performMainAction();
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !state.isProcessing) {
        performMainAction();
    }
}

// INITIALIZATION
function init() {
    elements.mainButton.addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyPress);
    updateUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

## HTML Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[App Name] - Vanilla Apps</title>
    <link rel="stylesheet" href="../../index.css">
    <link rel="stylesheet" href="[appName].css">
</head>
<body>
    <nav class="nav-bar">
        <a href="../../index.html" class="nav-link">← Home</a>
    </nav>
    
    <div class="container">
        <h1>[App Name]</h1>
        <div class="display-area" id="display"></div>
        <button id="mainButton" class="action-button">[Action Text]</button>
        
        <div class="stats-section">
            <h2>Statistics</h2>
            <div class="stat-item">
                <span class="stat-label">Total:</span>
                <span class="stat-value" id="totalCount">0</span>
            </div>
        </div>
        
        <div class="history-section">
            <h2>History</h2>
            <div id="history" class="history-list">
                <p class="empty-message">No history yet.</p>
            </div>
        </div>
    </div>
    
    <script src="[appName].js"></script>
</body>
</html>
```

**Note**: Apps use `../../` paths to reach resources in `src/` (parent directories).

## CSS Structure

```css
/* App-specific styles */
.display-area {
    /* Display styles */
}

@keyframes customAnimation {
    /* Animation */
}

.custom-element {
    /* Other styles */
}
```

See CLAUDE.md for coding standards (ES6+, state management, no external libraries, etc.)

## Creating a New App

1. Create `src/apps/[appName]/` with three files: `.html`, `.css`, `.js`
2. Follow structure above (state → DOM → functions → init)
3. Use `../../` paths for shared resources
4. Add link to `src/index.html`

## Common Patterns

**Animation**:
```javascript
element.classList.add('animating');
setTimeout(() => element.classList.remove('animating'), CONFIG.ANIMATION_DURATION);
```

**History Management**:
```javascript
function addToHistory(item) {
    state.history.unshift(item);
    if (state.history.length > CONFIG.MAX_HISTORY) {
        state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
    }
    updateHistory();
}
```

**Debounce**:
```javascript
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
```

## Quick Checklist

- [ ] Created `src/apps/[appName]/` with three matching files
- [ ] State object and DOM elements cached
- [ ] Functions organized by category
- [ ] Event listeners in init function
- [ ] Added link to `src/index.html`
- [ ] No external libraries
