// Dice Roller Application
let rollHistory = [];
let isRolling = false;

// DOM Elements
const diceDisplay = document.getElementById('diceDisplay');
const diceNumber = diceDisplay.querySelector('.dice-number');
const rollButton = document.getElementById('rollButton');
const historyContainer = document.getElementById('history');
const totalRollsElement = document.getElementById('totalRolls');
const averageElement = document.getElementById('average');

// Roll the dice
function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    rollButton.disabled = true;
    diceDisplay.classList.add('rolling');
    
    // Animation: cycle through random numbers
    let cycles = 0;
    const maxCycles = 15;
    const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        diceNumber.textContent = randomNum;
        cycles++;
        
        if (cycles >= maxCycles) {
            clearInterval(interval);
            // Final result
            const finalResult = Math.floor(Math.random() * 6) + 1;
            diceNumber.textContent = finalResult;
            
            // Add to history
            addToHistory(finalResult);
            updateStatistics();
            
            // Reset state
            setTimeout(() => {
                diceDisplay.classList.remove('rolling');
                isRolling = false;
                rollButton.disabled = false;
            }, 200);
        }
    }, 80);
}

// Add roll to history
function addToHistory(result) {
    rollHistory.unshift(result);
    
    // Keep only last 10 rolls in display
    if (rollHistory.length > 10) {
        rollHistory = rollHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    if (rollHistory.length === 0) {
        historyContainer.innerHTML = '<p class="empty-message">No rolls yet. Click the button to start!</p>';
        return;
    }
    
    historyContainer.innerHTML = rollHistory
        .map((roll, index) => `
            <div class="history-item">
                <span class="roll-number">${rollHistory.length - index}</span>
                <span class="roll-value">${roll}</span>
            </div>
        `)
        .join('');
}

// Update statistics
function updateStatistics() {
    const totalRolls = rollHistory.length;
    totalRollsElement.textContent = totalRolls;
    
    if (totalRolls > 0) {
        const sum = rollHistory.reduce((acc, val) => acc + val, 0);
        const average = (sum / totalRolls).toFixed(2);
        averageElement.textContent = average;
    } else {
        averageElement.textContent = '0.0';
    }
}

// Event listeners
rollButton.addEventListener('click', rollDice);

// Allow Enter key to roll
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isRolling) {
        rollDice();
    }
});

// Initialize display
updateHistoryDisplay();
