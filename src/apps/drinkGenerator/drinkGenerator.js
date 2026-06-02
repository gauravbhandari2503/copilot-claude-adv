// STATE & CONFIG
let state = {
    isGenerating: false,
    history: [],
    currentDrink: null
};

const CONFIG = {
    MAX_HISTORY: 20,
    ANIMATION_DURATION: 600
};

const DRINKS = [
    'Margarita',
    'Mojito',
    'Piña Colada',
    'Daiquiri',
    'Cosmopolitan',
    'Old Fashioned',
    'Manhattan',
    'Martini',
    'Margarita',
    'Caipirinha',
    'Bloody Mary',
    'Long Island Iced Tea',
    'Mimosa',
    'Bellini',
    'Sangria',
    'Paloma',
    'Sazerac',
    'Negroni',
    'Aperol Spritz',
    'Moscow Mule',
    'Whiskey Sour',
    'Sex on the Beach',
    'Blue Lagoon',
    'Hurricane',
    'Zombie',
    'Mai Tai',
    'Tiki Punch',
    'Punch Bowl',
    'Mint Julep',
    'Gimlet'
];

// DOM ELEMENTS
const elements = {
    generateButton: document.getElementById('generateButton'),
    display: document.getElementById('display'),
    history: document.getElementById('history'),
    totalCount: document.getElementById('totalCount')
};

// CORE FUNCTIONS
function generateDrink() {
    if (state.isGenerating) return;

    state.isGenerating = true;
    elements.generateButton.disabled = true;
    elements.display.classList.add('generating');

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * DRINKS.length);
        state.currentDrink = DRINKS[randomIndex];

        addToHistory(state.currentDrink);
        updateUI();

        elements.display.classList.remove('generating');
        state.isGenerating = false;
        elements.generateButton.disabled = false;
    }, CONFIG.ANIMATION_DURATION);
}

function addToHistory(drink) {
    state.history.unshift(drink);
    if (state.history.length > CONFIG.MAX_HISTORY) {
        state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
    }
}

// UI UPDATE FUNCTIONS
function updateUI() {
    updateDisplay();
    updateHistory();
    updateStatistics();
}

function updateDisplay() {
    if (state.currentDrink) {
        elements.display.textContent = state.currentDrink;
    }
}

function updateHistory() {
    if (state.history.length === 0) {
        elements.history.innerHTML = '<p class="empty-message">No drinks generated yet.</p>';
        return;
    }

    elements.history.innerHTML = state.history
        .map((drink, idx) => `<div class="history-item">${idx + 1}. ${drink}</div>`)
        .join('');
}

function updateStatistics() {
    elements.totalCount.textContent = state.history.length;
}

// EVENT HANDLERS
function handleGenerateClick() {
    generateDrink();
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !state.isGenerating) {
        generateDrink();
    }
}

// INITIALIZATION
function init() {
    elements.generateButton.addEventListener('click', handleGenerateClick);
    document.addEventListener('keypress', handleKeyPress);
    updateUI();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
