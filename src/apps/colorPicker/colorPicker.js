// Color Picker Application
let colorHistory = [];
let isGenerating = false;

// DOM Elements for Color Picker
const colorBox = document.getElementById('colorBox');
const colorCode = document.getElementById('colorCode');
const generateButton = document.getElementById('generateButton');
const copyButton = document.getElementById('copyButton');
const colorHistoryContainer = document.getElementById('colorHistory');

// Generate random color
function generateRandomColor() {
    if (isGenerating) return;
    
    isGenerating = true;
    generateButton.disabled = true;
    
    // Animation: cycle through random colors
    let cycles = 0;
    const maxCycles = 10;
    const interval = setInterval(() => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        colorBox.style.backgroundColor = randomColor;
        colorCode.textContent = randomColor.toUpperCase();
        cycles++;
        
        if (cycles >= maxCycles) {
            clearInterval(interval);
            // Final color
            const finalColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            colorBox.style.backgroundColor = finalColor;
            colorCode.textContent = finalColor.toUpperCase();
            
            // Add to history
            addColorToHistory(finalColor.toUpperCase());
            
            // Reset state
            setTimeout(() => {
                isGenerating = false;
                generateButton.disabled = false;
            }, 200);
        }
    }, 100);
}

// Add color to history
function addColorToHistory(color) {
    colorHistory.unshift(color);
    
    // Keep only last 8 colors
    if (colorHistory.length > 8) {
        colorHistory = colorHistory.slice(0, 8);
    }
    
    updateColorHistoryDisplay();
}

// Update color history display
function updateColorHistoryDisplay() {
    if (colorHistory.length === 0) {
        colorHistoryContainer.innerHTML = '<p class="empty-message">No colors generated yet. Click the button to start!</p>';
        return;
    }
    
    colorHistoryContainer.innerHTML = colorHistory
        .map((color) => `
            <div class="color-history-item" data-color="${color}">
                <div class="color-swatch" style="background-color: ${color}"></div>
                <span class="color-label">${color}</span>
            </div>
        `)
        .join('');
    
    // Add click listeners to history items
    document.querySelectorAll('.color-history-item').forEach(item => {
        item.addEventListener('click', () => {
            const color = item.dataset.color;
            colorBox.style.backgroundColor = color;
            colorCode.textContent = color;
        });
    });
}

// Copy color code to clipboard
function copyColorCode() {
    const text = colorCode.textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        copyButton.textContent = '✓ Copied!';
        setTimeout(() => {
            copyButton.textContent = '📋 Copy Code';
        }, 2000);
    });
}

// Event listeners for Color Picker
generateButton.addEventListener('click', generateRandomColor);
copyButton.addEventListener('click', copyColorCode);

// Initialize display
updateColorHistoryDisplay();
