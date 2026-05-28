# Multi-App Suite - Copilot Instructions

## Project Overview
This is a collection of vanilla JavaScript applications organized in a modular structure. Each app is self-contained with its own HTML, CSS, and JavaScript files, while sharing common styles and conventions.

## Tech Stack
- **HTML5**: For structure and layout.
- **CSS3**: For styling, animations, and responsive design (Custom styles, no external UI frameworks like Tailwind or Bootstrap).
- **Vanilla JavaScript (ES6+)**: For DOM manipulation, logic, and state management (No frameworks like React, Vue, or Angular).

## Directory Structure
```
src/
├── index.html           # Landing page with links to all apps
├── index.css            # Shared styles (base, navigation, common components)
├── main.js              # Landing page initialization
├── apps/
│   ├── diceRoller/
│   │   ├── diceRoller.html    # Dice roller page
│   │   ├── diceRoller.css     # Dice roller specific styles
│   │   └── diceRoller.js      # Dice roller logic
│   ├── colorPicker/
│   │   ├── colorPicker.html   # Color picker page
│   │   ├── colorPicker.css    # Color picker specific styles
│   │   └── colorPicker.js     # Color picker logic
│   └── animalName/
│       ├── animalName.html    # Animal generator page
│       ├── animalName.css     # Animal generator specific styles
│       └── animalName.js      # Animal generator logic
```

### File Organization Principles
1. Each app lives in its own dedicated folder under `src/apps/[appName]/`
2. Each app has three files with matching names: `[appName].html`, `[appName].css`, `[appName].js`
3. App HTML files link to `../../index.css` for common styles, then their own CSS for app-specific styles
4. Navigation bar with "← Home" link back to the landing page is included in each app

## Coding Standards & Guidelines
When generating or modifying code for this project, please adhere to the following guidelines:

1. **Keep it Vanilla**:
   - Do not introduce external libraries or frameworks (e.g., jQuery, React, Lodash) unless explicitly requested.
   - Use standard browser APIs for DOM manipulation (`document.getElementById`, `document.querySelector`, etc.).

2. **JavaScript Best Practices**:
   - Use ES6+ syntax (`let`, `const`, arrow functions, template literals).
   - Keep functions small and single-purpose.
   - Maintain clear state management at the top of the file (e.g., `rollHistory`, `isRolling`).
   - Use descriptive variable and function names.
   - Follow the structure defined in the `vanilla-app-structure` skill

3. **CSS Guidelines**:
   - Continue using the existing color palette and gradient themes (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`).
   - Use relative units (`rem`, `em`, `%`) where appropriate for responsiveness.
   - Maintain the use of CSS variables if they are introduced in the future.
   - Keep animations smooth and performant (e.g., using `transform` and `opacity`).
   - Place common styles in `index.css`, app-specific styles in the app's CSS file

4. **HTML Guidelines**:
   - Use semantic HTML tags where possible.
   - Ensure all interactive elements have appropriate IDs or classes for JavaScript targeting.
   - Each app page should include:
     - A navigation bar with a "← Home" link to `../../index.html`
     - Links to both `../../index.css` and the app's own CSS file
     - A script tag linking to the app's own JavaScript file

## Creating New Apps
When creating a new app:
1. Create a new folder in `src/apps/` with the app name (camelCase)
2. Create three files: `[appName].html`, `[appName].css`, `[appName].js`
3. Follow the HTML structure with navigation and proper stylesheet links
4. Follow the JavaScript structure pattern from the `vanilla-app-structure` skill
5. Add a link card to the landing page (`src/index.html`)

## Common Features Across Apps
- **Navigation**: All apps include a "← Home" link in the navigation bar
- **Animations**: Smooth transitions and animations for user interactions
- **Statistics**: Many apps track usage statistics (total actions, averages, etc.)
- **History**: Apps maintain a history of recent actions/results
- **Keyboard Support**: Support for keyboard shortcuts (e.g., Enter key to trigger actions)
