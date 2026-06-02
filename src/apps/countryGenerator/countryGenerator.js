// ============================================
// Country Generator Application
// ============================================

// -------------------- STATE --------------------
let state = {
    currentCountry: null,
    history: [],
    totalCount: 0
};

// Countries array
const COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
    'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
    'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
    'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
    'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
    'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
    'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea',
    'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
    'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
    'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// -------------------- DOM ELEMENTS --------------------
const elements = {
    mainButton: document.getElementById('mainButton'),
    countryName: document.getElementById('countryName'),
    display: document.getElementById('display'),
    historyContainer: document.getElementById('history'),
    totalCount: document.getElementById('totalCount')
};

// -------------------- CORE FUNCTIONS --------------------
function generateCountry() {
    const randomIndex = Math.floor(Math.random() * COUNTRIES.length);
    state.currentCountry = COUNTRIES[randomIndex];
    state.totalCount++;

    addToHistory(state.currentCountry);
    updateUI();
}

function addToHistory(country) {
    state.history.unshift(country);

    if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
    }
}

// -------------------- UI UPDATE FUNCTIONS --------------------
function updateUI() {
    updateDisplay();
    updateHistory();
    updateStatistics();
}

function updateDisplay() {
    elements.countryName.textContent = state.currentCountry;
    elements.countryName.classList.add('pop');

    setTimeout(() => {
        elements.countryName.classList.remove('pop');
    }, 300);
}

function updateHistory() {
    if (state.history.length === 0) {
        elements.historyContainer.innerHTML = '<p class="empty-message">No history yet.</p>';
        return;
    }

    elements.historyContainer.innerHTML = state.history
        .map((country, index) => `
            <div class="history-item">
                <span class="item-number">${index + 1}</span>
                <span class="item-value">${country}</span>
            </div>
        `)
        .join('');
}

function updateStatistics() {
    elements.totalCount.textContent = state.totalCount;
}

// -------------------- EVENT HANDLERS --------------------
function handleButtonClick() {
    generateCountry();
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        generateCountry();
    }
}

// -------------------- INITIALIZATION --------------------
function init() {
    elements.mainButton.addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyPress);

    updateUI();
    console.log('[Country Generator] initialized');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
