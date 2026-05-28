---
description: Guidelines for adding new vanilla JavaScript applications to this project and structuring each app's JavaScript file properly. Use when creating new apps/pages or refactoring existing code.
---

# Vanilla App Structure Skill

## Overview
This skill provides guidelines for creating and structuring new applications in this vanilla JavaScript project. Each app should follow consistent patterns for maintainability and scalability.

## When to Use This Skill
- Creating a new app/page (e.g., coin flip, counter, timer)
- Refactoring existing code into proper structure
- Reviewing code structure for consistency
- Adding features to existing apps

## Project Structure

### File Organization
```
src/
  ├── index.html          # Main landing page with links to all apps
  ├── index.css           # Global shared styles
  ├── main.js             # Landing page initialization
  ├── apps/
  │   ├── diceRoller/
  │   │   ├── diceRoller.html   # Dice roller page
  │   │   ├── diceRoller.css    # Dice roller specific styles
  │   │   └── diceRoller.js     # Dice roller logic
  │   ├── colorPicker/
  │   │   ├── colorPicker.html  # Color picker page
  │   │   ├── colorPicker.css   # Color picker specific styles
  │   │   └── colorPicker.js    # Color picker logic
  │   └── [appName]/
  │       ├── [appName].html    # Other app page
  │       ├── [appName].css     # Other app specific styles
  │       └── [appName].js      # Other app logic
```

**Important**: Each app must be in its own dedicated folder under `src/apps/[appName]/` with three files that share the same base name.

## JavaScript File Structure Pattern

Each app's JavaScript file should follow this structure:

```javascript
// ============================================
// [APP NAME] Application
// ============================================

// -------------------- STATE --------------------
// Application state at the top
let state = {
    // All mutable state variables here
    isProcessing: false,
    history: [],
    currentValue: null
};

// Configuration constants
const CONFIG = {
    MAX_HISTORY: 10,
    ANIMATION_DURATION: 200,
    // Other constants
};

// -------------------- DOM ELEMENTS --------------------
// Cache DOM elements for better performance
const elements = {
    // Group related elements
    mainButton: document.getElementById('mainButton'),
    display: document.getElementById('display'),
    historyContainer: document.getElementById('history'),
    // Stats elements
    totalCount: document.getElementById('totalCount'),
    average: document.getElementById('average')
};

// -------------------- CORE FUNCTIONS --------------------
/**
 * Main action function
 * Description of what it does
 */
function performMainAction() {
    if (state.isProcessing) return;
    
    state.isProcessing = true;
    // Implementation
    
    // Update state and UI
    updateState();
    updateUI();
}

/**
 * Update application state
 */
function updateState() {
    // State mutations here
}

/**
 * Update UI based on current state
 */
function updateUI() {
    updateDisplay();
    updateHistory();
    updateStatistics();
}

// -------------------- UI UPDATE FUNCTIONS --------------------
/**
 * Update main display
 */
function updateDisplay() {
    // Update main display element
}

/**
 * Update history display
 */
function updateHistory() {
    if (state.history.length === 0) {
        elements.historyContainer.innerHTML = 
            '<p class="empty-message">No history yet.</p>';
        return;
    }
    
    elements.historyContainer.innerHTML = state.history
        .map((item, index) => createHistoryItemHTML(item, index))
        .join('');
}

/**
 * Update statistics
 */
function updateStatistics() {
    // Calculate and display stats
    const total = state.history.length;
    elements.totalCount.textContent = total;
    
    if (total > 0) {
        // Calculate other stats
    }
}

// -------------------- HELPER FUNCTIONS --------------------
/**
 * Create HTML for history item
 */
function createHistoryItemHTML(item, index) {
    return `
        <div class="history-item">
            <span class="item-number">${index + 1}</span>
            <span class="item-value">${item}</span>
        </div>
    `;
}

/**
 * Other helper functions
 */
function helperFunction() {
    // Helper logic
}

// -------------------- EVENT HANDLERS --------------------
/**
 * Handle button click
 */
function handleButtonClick() {
    performMainAction();
}

/**
 * Handle keyboard events
 */
function handleKeyPress(e) {
    if (e.key === 'Enter' && !state.isProcessing) {
        performMainAction();
    }
}

// -------------------- INITIALIZATION --------------------
/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    elements.mainButton.addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyPress);
    
    // Initialize UI
    updateUI();
    
    // Log initialization (optional, remove in production)
    console.log('[App Name] initialized');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

## HTML Page Structure

Each app should have its own HTML page in its dedicated folder:

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
    <!-- Navigation -->
    <nav class="nav-bar">
        <a href="../../index.html" class="nav-link">← Home</a>
    </nav>
    
    <!-- Main Container -->
    <div class="container">
        <h1>[App Name]</h1>
        
        <!-- Main Display Area -->
        <div class="display-area" id="display">
            <!-- App specific content -->
        </div>
        
        <!-- Main Action Button -->
        <button id="mainButton" class="action-button">
            [Action Text]
        </button>
        
        <!-- Statistics Section -->
        <div class="stats-section">
            <h2>Statistics</h2>
            <div class="stats">
                <div class="stat-item">
                    <span class="stat-label">Total:</span>
                    <span class="stat-value" id="totalCount">0</span>
                </div>
                <!-- More stats -->
            </div>
        </div>
        
        <!-- History Section -->
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

**Note**: Since apps are now in `src/apps/[appName]/`, the paths to shared resources use `../../` to go up two levels to reach `src/`.

## CSS Structure

Each app can have its own CSS file for specific styles:

```css
/* [App Name] Specific Styles */

/* Main display area */
.display-area {
    /* Specific display styles */
}

/* Animations */
@keyframes customAnimation {
    /* App-specific animation */
}

/* App-specific classes */
.custom-element {
    /* Styles */
}
```

## Coding Standards

### JavaScript Best Practices
1. **Use ES6+ syntax**: `const`, `let`, arrow functions, template literals
2. **State Management**: Keep all mutable state in a single object at the top
3. **Pure Functions**: Separate business logic from DOM manipulation where possible
4. **Single Responsibility**: Each function should do one thing well
5. **Descriptive Names**: Use clear, descriptive variable and function names
6. **Comments**: Add JSDoc-style comments for main functions
7. **Error Handling**: Add try-catch for operations that might fail
8. **No External Libraries**: Use only vanilla JavaScript APIs

### Code Organization Rules
1. **Sections**: Use comment dividers to separate code sections
2. **Order**: State → DOM → Core Functions → UI Updates → Helpers → Events → Init
3. **DOM Queries**: Cache all DOM elements at the top, avoid repeated queries
4. **Event Listeners**: Set up in the init function, not at the module level

### Performance Considerations
1. **Minimize Reflows**: Batch DOM updates when possible
2. **Use Event Delegation**: For dynamic content
3. **Debounce/Throttle**: For frequent events (resize, scroll)
4. **Use CSS for Animations**: Prefer CSS transitions/animations over JS

## Example: Creating a New App

### Step 1: Create Files
Create three files in the `src/apps/` directory:
- `coinFlip.html`
- `coinFlip.js`
- `coinFlip.css`

### Step 2: Implement HTML Structure
Follow the HTML page structure template above.

### Step 3: Implement JavaScript
Follow the JavaScript file structure pattern above with:
- State object with necessary properties
- DOM element caching
- Core flip logic
- UI update functions
- Event handlers
- Initialization

### Step 4: Add Styles
Create app-specific styles in `coinFlip.css`.

### Step 5: Add Navigation
Update `src/index.html` to include a link to the new app.

## Refactoring Existing Code

When refactoring existing code (like `main.js`):

1. **Create app directory structure** if it doesn't exist
2. **Move HTML** to `apps/diceRoll.html`
3. **Restructure JS** following the pattern:
   - Extract state variables into state object
   - Group DOM queries into elements object
   - Organize functions by category
   - Add init function
4. **Create separate CSS** for app-specific styles
5. **Update imports** and file references

## Tips & Best Practices

### State Management
- Keep state predictable and easy to reason about
- Avoid global variables outside the state object
- Document state shape with comments

### DOM Manipulation
- Cache selectors that are used multiple times
- Use template literals for HTML generation
- Validate elements exist before manipulation

### Event Handling
- Use named functions for event handlers (easier to debug)
- Remove event listeners when they're no longer needed
- Prevent default behavior explicitly when needed

### Debugging
- Use meaningful console.log messages during development
- Add data attributes to elements for easier selection
- Use browser DevTools for performance profiling

### Accessibility
- Add ARIA labels where appropriate
- Ensure keyboard navigation works
- Maintain semantic HTML structure

## Common Patterns

### Animation Pattern
```javascript
function animateElement() {
    element.classList.add('animating');
    
    setTimeout(() => {
        // Animation complete
        element.classList.remove('animating');
    }, CONFIG.ANIMATION_DURATION);
}
```

### History Management Pattern
```javascript
function addToHistory(item) {
    state.history.unshift(item);
    
    if (state.history.length > CONFIG.MAX_HISTORY) {
        state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
    }
    
    updateHistory();
}
```

### Debounce Pattern (if needed)
```javascript
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## Checklist for New Apps

- [ ] Created HTML file in `src/apps/`
- [ ] Created JS file following the structure pattern
- [ ] Created CSS file for app-specific styles
- [ ] State object defined with all mutable state
- [ ] DOM elements cached in elements object
- [ ] Functions organized by category with comments
- [ ] Event listeners set up in init function
- [ ] History management implemented (if applicable)
- [ ] Statistics calculation implemented (if applicable)
- [ ] Keyboard shortcuts implemented (if applicable)
- [ ] Responsive design tested
- [ ] Browser console shows no errors
- [ ] Code follows ES6+ syntax
- [ ] Added navigation link in main index.html

## Resources

### Browser APIs to Use
- `document.querySelector()` / `document.getElementById()`
- `Element.classList` for class manipulation
- `addEventListener()` for event handling
- `setTimeout()` / `setInterval()` for timing
- `localStorage` for persistence (if needed)

### Avoid
- jQuery or other libraries
- External frameworks
- Inline event handlers in HTML
- Global namespace pollution
