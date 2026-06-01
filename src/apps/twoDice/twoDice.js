// ============================================
// TWO DICE Application
// ============================================

// -------------------- STATE --------------------
let state = {
    isRolling: false,
    history: [],
    lastDice1: null,
    lastDice2: null
};

const CONFIG = {
    MAX_HISTORY: 10,
    ROLL_DURATION: 600,
    ANIMATION_STEPS: 10
};

// -------------------- DOM ELEMENTS --------------------
const elements = {
    dice1: document.getElementById('dice1'),
    dice2: document.getElementById('dice2'),
    dice1Number: document.querySelector('#dice1 .dice-number'),
    dice2Number: document.querySelector('#dice2 .dice-number'),
    totalValue: document.getElementById('totalValue'),
    rollButton: document.getElementById('rollButton'),
    history: document.getElementById('history'),
    totalRolls: document.getElementById('totalRolls'),
    average: document.getElementById('average'),
    highest: document.getElementById('highest'),
    lowest: document.getElementById('lowest')
};

// -------------------- CORE FUNCTIONS --------------------
function rollDice() {
    if (state.isRolling) return;

    state.isRolling = true;
    elements.rollButton.disabled = true;
    elements.dice1.classList.add('rolling');
    elements.dice2.classList.add('rolling');

    let step = 0;
    const interval = setInterval(() => {
        elements.dice1Number.textContent = Math.ceil(Math.random() * 6);
        elements.dice2Number.textContent = Math.ceil(Math.random() * 6);
        step++;
        if (step >= CONFIG.ANIMATION_STEPS) {
            clearInterval(interval);
            finalizeRoll();
        }
    }, CONFIG.ROLL_DURATION / CONFIG.ANIMATION_STEPS);
}

function finalizeRoll() {
    const d1 = Math.ceil(Math.random() * 6);
    const d2 = Math.ceil(Math.random() * 6);

    state.lastDice1 = d1;
    state.lastDice2 = d2;

    elements.dice1Number.textContent = d1;
    elements.dice2Number.textContent = d2;
    elements.dice1.classList.remove('rolling');
    elements.dice2.classList.remove('rolling');

    state.history.unshift({ d1, d2, total: d1 + d2 });
    if (state.history.length > CONFIG.MAX_HISTORY) {
        state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
    }

    state.isRolling = false;
    elements.rollButton.disabled = false;

    updateUI();
}

// -------------------- UI UPDATE FUNCTIONS --------------------
function updateUI() {
    updateTotalDisplay();
    updateStatistics();
    updateHistory();
}

function updateTotalDisplay() {
    if (state.lastDice1 === null) return;
    elements.totalValue.textContent = state.lastDice1 + state.lastDice2;
}

function updateStatistics() {
    const count = state.history.length;
    elements.totalRolls.textContent = count;

    if (count === 0) return;

    const totals = state.history.map(r => r.total);
    const sum = totals.reduce((a, b) => a + b, 0);
    elements.average.textContent = (sum / count).toFixed(1);
    elements.highest.textContent = Math.max(...totals);
    elements.lowest.textContent = Math.min(...totals);
}

function updateHistory() {
    if (state.history.length === 0) {
        elements.history.innerHTML = '<p class="empty-message">No rolls yet. Click the button to start!</p>';
        return;
    }

    elements.history.innerHTML = state.history
        .map((roll, index) => createHistoryItemHTML(roll, index))
        .join('');
}

// -------------------- HELPER FUNCTIONS --------------------
function createHistoryItemHTML(roll, index) {
    return `
        <div class="history-item">
            <span class="history-roll-num">#${state.history.length - index}</span>
            <span class="history-dice">
                <span class="history-dice-val">${roll.d1}</span>
                +
                <span class="history-dice-val">${roll.d2}</span>
            </span>
            <span class="history-total">= ${roll.total}</span>
        </div>
    `;
}

// -------------------- EVENT HANDLERS --------------------
function handleRollClick() {
    rollDice();
}

function handleKeyPress(e) {
    if (e.key === 'Enter' && !state.isRolling) {
        rollDice();
    }
}

// -------------------- INITIALIZATION --------------------
function init() {
    elements.rollButton.addEventListener('click', handleRollClick);
    document.addEventListener('keypress', handleKeyPress);
    console.log('[Two Dice] initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
