// ============================================
// ANIMAL NAME GENERATOR Application
// ============================================

// -------------------- STATE --------------------
// Application state at the top
let state = {
    isGenerating: false,
    history: [],
    currentAnimal: null,
    uniqueAnimals: new Set()
};

// Configuration constants
const CONFIG = {
    MAX_HISTORY: 10,
    ANIMATION_DURATION: 150
};

// Animal data with emojis
const ANIMALS = [
    { name: 'Lion', emoji: '🦁' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Bear', emoji: '🐻' },
    { name: 'Elephant', emoji: '🐘' },
    { name: 'Giraffe', emoji: '🦒' },
    { name: 'Zebra', emoji: '🦓' },
    { name: 'Panda', emoji: '🐼' },
    { name: 'Koala', emoji: '🐨' },
    { name: 'Monkey', emoji: '🐵' },
    { name: 'Gorilla', emoji: '🦍' },
    { name: 'Fox', emoji: '🦊' },
    { name: 'Wolf', emoji: '🐺' },
    { name: 'Dog', emoji: '🐕' },
    { name: 'Cat', emoji: '🐈' },
    { name: 'Rabbit', emoji: '🐰' },
    { name: 'Hamster', emoji: '🐹' },
    { name: 'Mouse', emoji: '🐭' },
    { name: 'Pig', emoji: '🐷' },
    { name: 'Cow', emoji: '🐄' },
    { name: 'Horse', emoji: '🐴' },
    { name: 'Unicorn', emoji: '🦄' },
    { name: 'Chicken', emoji: '🐔' },
    { name: 'Bird', emoji: '🐦' },
    { name: 'Penguin', emoji: '🐧' },
    { name: 'Eagle', emoji: '🦅' },
    { name: 'Duck', emoji: '🦆' },
    { name: 'Owl', emoji: '🦉' },
    { name: 'Parrot', emoji: '🦜' },
    { name: 'Frog', emoji: '🐸' },
    { name: 'Crocodile', emoji: '🐊' },
    { name: 'Turtle', emoji: '🐢' },
    { name: 'Lizard', emoji: '🦎' },
    { name: 'Snake', emoji: '🐍' },
    { name: 'Dragon', emoji: '🐉' },
    { name: 'Whale', emoji: '🐋' },
    { name: 'Dolphin', emoji: '🐬' },
    { name: 'Fish', emoji: '🐟' },
    { name: 'Shark', emoji: '🦈' },
    { name: 'Octopus', emoji: '🐙' },
    { name: 'Crab', emoji: '🦀' },
    { name: 'Lobster', emoji: '🦞' },
    { name: 'Shrimp', emoji: '🦐' },
    { name: 'Squid', emoji: '🦑' },
    { name: 'Butterfly', emoji: '🦋' },
    { name: 'Bee', emoji: '🐝' },
    { name: 'Ladybug', emoji: '🐞' },
    { name: 'Ant', emoji: '🐜' },
    { name: 'Spider', emoji: '🕷️' },
    { name: 'Scorpion', emoji: '🦂' },
    { name: 'Mosquito', emoji: '🦟' },
    { name: 'Deer', emoji: '🦌' },
    { name: 'Camel', emoji: '🐪' },
    { name: 'Llama', emoji: '🦙' },
    { name: 'Kangaroo', emoji: '🦘' },
    { name: 'Badger', emoji: '🦡' },
    { name: 'Otter', emoji: '🦦' },
    { name: 'Skunk', emoji: '🦨' },
    { name: 'Sloth', emoji: '🦥' },
    { name: 'Hedgehog', emoji: '🦔' },
    { name: 'Bat', emoji: '🦇' },
    { name: 'Peacock', emoji: '🦚' },
    { name: 'Swan', emoji: '🦢' },
    { name: 'Flamingo', emoji: '🦩' },
    { name: 'T-Rex', emoji: '🦖' },
    { name: 'Sauropod', emoji: '🦕' }
];

// -------------------- DOM ELEMENTS --------------------
// Cache DOM elements for better performance
const elements = {
    generateButton: document.getElementById('generateButton'),
    animalName: document.getElementById('animalName'),
    animalEmoji: document.getElementById('animalEmoji'),
    historyContainer: document.getElementById('history'),
    totalCount: document.getElementById('totalCount'),
    uniqueCount: document.getElementById('uniqueCount')
};

// -------------------- CORE FUNCTIONS --------------------
/**
 * Generate a random animal
 */
function generateAnimal() {
    if (state.isGenerating) return;
    
    state.isGenerating = true;
    elements.generateButton.disabled = true;
    
    // Animate the generation
    animateGeneration();
}

/**
 * Animate the animal generation
 */
function animateGeneration() {
    let iterations = 0;
    const maxIterations = 10;
    
    const interval = setInterval(() => {
        const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        elements.animalEmoji.textContent = randomAnimal.emoji;
        elements.animalName.textContent = randomAnimal.name;
        elements.animalEmoji.classList.add('animating');
        
        iterations++;
        
        if (iterations >= maxIterations) {
            clearInterval(interval);
            finalizeGeneration();
        }
    }, CONFIG.ANIMATION_DURATION);
}

/**
 * Finalize the generation with a random animal
 */
function finalizeGeneration() {
    const randomIndex = Math.floor(Math.random() * ANIMALS.length);
    const selectedAnimal = ANIMALS[randomIndex];
    
    state.currentAnimal = selectedAnimal;
    state.uniqueAnimals.add(selectedAnimal.name);
    
    // Update display
    elements.animalEmoji.textContent = selectedAnimal.emoji;
    elements.animalName.textContent = selectedAnimal.name;
    elements.animalEmoji.classList.remove('animating');
    elements.animalEmoji.classList.add('revealed');
    
    setTimeout(() => {
        elements.animalEmoji.classList.remove('revealed');
    }, 500);
    
    // Update state and UI
    updateState();
    updateUI();
    
    state.isGenerating = false;
    elements.generateButton.disabled = false;
}

/**
 * Update application state
 */
function updateState() {
    // Add to history
    state.history.unshift(state.currentAnimal);
    
    // Keep only last MAX_HISTORY items
    if (state.history.length > CONFIG.MAX_HISTORY) {
        state.history = state.history.slice(0, CONFIG.MAX_HISTORY);
    }
}

/**
 * Update UI based on current state
 */
function updateUI() {
    updateHistory();
    updateStatistics();
}

// -------------------- UI UPDATE FUNCTIONS --------------------
/**
 * Update history display
 */
function updateHistory() {
    if (state.history.length === 0) {
        elements.historyContainer.innerHTML = 
            '<p class="empty-message">No animals generated yet.</p>';
        return;
    }
    
    elements.historyContainer.innerHTML = state.history
        .map((animal, index) => createHistoryItemHTML(animal, index))
        .join('');
}

/**
 * Update statistics
 */
function updateStatistics() {
    const total = state.history.length;
    const unique = state.uniqueAnimals.size;
    
    elements.totalCount.textContent = total;
    elements.uniqueCount.textContent = unique;
}

// -------------------- HELPER FUNCTIONS --------------------
/**
 * Create HTML for history item
 */
function createHistoryItemHTML(animal, index) {
    return `
        <div class="history-item">
            <span class="item-number">${index + 1}</span>
            <span class="item-emoji">${animal.emoji}</span>
            <span class="item-value">${animal.name}</span>
        </div>
    `;
}

// -------------------- EVENT HANDLERS --------------------
/**
 * Handle button click
 */
function handleButtonClick() {
    generateAnimal();
}

/**
 * Handle keyboard events
 */
function handleKeyPress(e) {
    if (e.key === 'Enter' && !state.isGenerating) {
        generateAnimal();
    }
}

// -------------------- INITIALIZATION --------------------
/**
 * Initialize the application
 */
function init() {
    // Set up event listeners
    elements.generateButton.addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyPress);
    
    // Initialize UI
    updateUI();
    
    // Log initialization
    console.log('Animal Name Generator initialized');
    console.log(`Available animals: ${ANIMALS.length}`);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
