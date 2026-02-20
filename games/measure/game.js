(function() {
  'use strict';

  const { Settings, Audio, Speech, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA - 30+ questions, 10 per game
  // ============================================

  const ALL_QUESTIONS = [
    // --- Type A: Compare mass (heavy/light) ---
    {
      type: 'compare',
      icon: 'elephant-feather',
      question: 'Which is heavier?',
      options: ['elephant', 'feather', 'pencil'],
      answer: 'elephant',
      speech: 'An elephant is much heavier than a feather!'
    },
    {
      type: 'compare',
      icon: 'book-leaf',
      question: 'Which is lighter?',
      options: ['a leaf', 'a book', 'a chair'],
      answer: 'a leaf',
      speech: 'A leaf is lighter than a book!'
    },
    {
      type: 'compare',
      icon: 'rock-balloon',
      question: 'Which is heavier?',
      options: ['a rock', 'a balloon', 'a feather'],
      answer: 'a rock',
      speech: 'A rock is heavier than a balloon!'
    },
    {
      type: 'compare',
      icon: 'watermelon-grape',
      question: 'Which is heavier?',
      options: ['a watermelon', 'a grape', 'an apple'],
      answer: 'a watermelon',
      speech: 'A watermelon is heavier than a grape!'
    },
    {
      type: 'compare',
      icon: 'cotton-brick',
      question: 'Which is lighter?',
      options: ['cotton ball', 'brick', 'stone'],
      answer: 'cotton ball',
      speech: 'A cotton ball is lighter than a brick!'
    },
    // --- Type B: Compare capacity (full/empty) ---
    {
      type: 'capacity',
      icon: 'bucket-cup',
      question: 'Which holds more water?',
      options: ['a bucket', 'a cup', 'a spoon'],
      answer: 'a bucket',
      speech: 'A bucket holds more water than a cup!'
    },
    {
      type: 'capacity',
      icon: 'pool-glass',
      question: 'Which holds more water?',
      options: ['a swimming pool', 'a glass', 'a bottle'],
      answer: 'a swimming pool',
      speech: 'A swimming pool holds much more water!'
    },
    {
      type: 'capacity',
      icon: 'bottle-spoon',
      question: 'Which holds less water?',
      options: ['a spoon', 'a bottle', 'a jug'],
      answer: 'a spoon',
      speech: 'A spoon holds less water than a bottle!'
    },
    {
      type: 'capacity',
      icon: 'bathtub-cup',
      question: 'Which holds more water?',
      options: ['a bathtub', 'a cup', 'a bowl'],
      answer: 'a bathtub',
      speech: 'A bathtub holds much more water!'
    },
    {
      type: 'capacity',
      icon: 'jug-glass',
      question: 'Which holds less?',
      options: ['a glass', 'a jug', 'a bucket'],
      answer: 'a glass',
      speech: 'A glass holds less than a jug!'
    },
    // --- Type C: Temperature ---
    {
      type: 'temperature',
      icon: 'ice-cream',
      question: 'Ice cream is...',
      options: ['cold', 'hot', 'warm'],
      answer: 'cold',
      speech: 'Ice cream is cold! It is freezing cold.'
    },
    {
      type: 'temperature',
      icon: 'soup',
      question: 'Hot soup is...',
      options: ['hot', 'cold', 'freezing'],
      answer: 'hot',
      speech: 'Soup is hot! Be careful!'
    },
    {
      type: 'temperature',
      icon: 'snowman',
      question: 'Snow is...',
      options: ['freezing', 'warm', 'hot'],
      answer: 'freezing',
      speech: 'Snow is freezing cold!'
    },
    {
      type: 'temperature',
      icon: 'sun',
      question: 'A sunny day in summer is...',
      options: ['hot', 'freezing', 'cold'],
      answer: 'hot',
      speech: 'A sunny summer day is hot!'
    },
    {
      type: 'temperature',
      icon: 'warm-milk',
      question: 'Warm milk is...',
      options: ['warm', 'freezing', 'hot'],
      answer: 'warm',
      speech: 'Warm milk is not too hot, not too cold!'
    },
    {
      type: 'temperature',
      icon: 'spring',
      question: 'A cool spring morning is...',
      options: ['cool', 'hot', 'freezing'],
      answer: 'cool',
      speech: 'A spring morning is cool and fresh!'
    },
    // --- Type D: Measuring tools ---
    {
      type: 'tool',
      question: 'What do we use to measure mass?',
      options: ['a scale', 'a thermometer', 'a measuring jug'],
      answer: 'a scale',
      speech: 'We use a scale to measure mass!'
    },
    {
      type: 'tool',
      question: 'What do we use to measure temperature?',
      options: ['a thermometer', 'a scale', 'a meter stick'],
      answer: 'a thermometer',
      speech: 'We use a thermometer to measure temperature!'
    },
    {
      type: 'tool',
      question: 'What do we use to measure how much water is in a jug?',
      options: ['a measuring jug', 'a thermometer', 'a scale'],
      answer: 'a measuring jug',
      speech: 'We use a measuring jug to measure capacity!'
    },
    {
      type: 'tool',
      question: 'What do we use to measure length?',
      options: ['a meter stick', 'a scale', 'a thermometer'],
      answer: 'a meter stick',
      speech: 'We use a meter stick to measure length!'
    },
    {
      type: 'tool',
      question: 'A balance is used to compare...',
      options: ['mass', 'temperature', 'capacity'],
      answer: 'mass',
      speech: 'A balance is used to compare mass! Which side is heavier?'
    },
    {
      type: 'tool',
      question: 'To find out if something is hot or cold, use a...',
      options: ['thermometer', 'measuring jug', 'meter stick'],
      answer: 'thermometer',
      speech: 'Use a thermometer to measure temperature!'
    },
    // --- Type E: Full/Empty/Same ---
    {
      type: 'state',
      icon: 'glass-full',
      question: 'This glass has water to the top. It is...',
      options: ['full', 'empty', 'half full'],
      answer: 'full',
      speech: 'The glass is full! No more room for water.'
    },
    {
      type: 'state',
      icon: 'glass-empty',
      question: 'This glass has no water. It is...',
      options: ['empty', 'full', 'heavy'],
      answer: 'empty',
      speech: 'The glass is empty! No water inside.'
    },
    {
      type: 'state',
      icon: 'balance-equal',
      question: 'Both sides of the balance are level. The mass is...',
      options: ['the same', 'different', 'more'],
      answer: 'the same',
      speech: 'The mass is the same! They are equal.'
    },
    // --- Type F: Sentence fill ---
    {
      type: 'sentence',
      sentences: [
        { text: 'A stone is', blank: 'heavy', suffix: '.' },
        { text: 'A feather is', blank: 'light', suffix: '.' }
      ],
      wordBank: ['heavy', 'light', 'hot', 'full']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'We measure temperature with a', blank: 'thermometer', suffix: '.' },
        { text: 'We measure mass with a', blank: 'scale', suffix: '.' }
      ],
      wordBank: ['thermometer', 'scale', 'jug', 'meter']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'The bottle is', blank: 'full', suffix: 'of water.' },
        { text: 'The cup has nothing inside. It is', blank: 'empty', suffix: '.' }
      ],
      wordBank: ['full', 'empty', 'cold', 'heavy']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'Ice is', blank: 'freezing', suffix: 'cold.' },
        { text: 'Tea is very', blank: 'hot', suffix: '.' }
      ],
      wordBank: ['freezing', 'hot', 'light', 'empty']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'An elephant has', blank: 'more', suffix: 'mass than a cat.' },
        { text: 'A mouse has', blank: 'less', suffix: 'mass than a dog.' }
      ],
      wordBank: ['more', 'less', 'full', 'warm']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'We use a', blank: 'balance', suffix: 'to compare mass.' },
        { text: 'A', blank: 'measuring jug', suffix: 'shows how much water.' }
      ],
      wordBank: ['balance', 'measuring jug', 'thermometer', 'scale']
    }
  ];

  // ============================================
  // SVG ICONS
  // ============================================

  const ICONS = {
    'elephant-feather': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="35" cy="50" rx="25" ry="20" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="18" cy="40" r="12" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 10,52 Q 5,65 10,70" stroke="#555" stroke-width="2" fill="none"/>
      <circle cx="15" cy="38" r="3" fill="#555"/>
      <line x1="25" y1="70" x2="25" y2="85" stroke="#555" stroke-width="3"/>
      <line x1="38" y1="70" x2="38" y2="85" stroke="#555" stroke-width="3"/>
      <text x="62" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 78,30 Q 85,40 82,55 Q 80,65 75,70" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 78,30 Q 82,32 84,30" stroke="#555" stroke-width="1.5" fill="none"/>
      <path d="M 80,38 Q 84,40 86,38" stroke="#555" stroke-width="1.5" fill="none"/>
      <path d="M 81,46 Q 85,48 87,46" stroke="#555" stroke-width="1.5" fill="none"/>
    </svg>`,
    'book-leaf': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="30" height="40" rx="2" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="35" x2="40" y2="35" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="42" x2="38" y2="42" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="49" x2="35" y2="49" stroke="#555" stroke-width="2"/>
      <text x="52" y="50" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 75,30 Q 85,45 75,60 Q 70,55 72,40 Z" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="75" y1="32" x2="73" y2="55" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    'rock-balloon': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,50 Q 15,40 25,35 Q 35,30 40,40 Q 42,50 30,55 Z" fill="none" stroke="#555" stroke-width="3"/>
      <text x="48" y="50" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <ellipse cx="75" cy="38" rx="15" ry="18" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="75" y1="56" x2="75" y2="70" stroke="#555" stroke-width="1.5"/>
      <path d="M 72,70 L 75,65 L 78,70" stroke="#555" stroke-width="1.5" fill="none"/>
    </svg>`,
    'watermelon-grape': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10,55 A 25,25 0 0,1 50,55 Z" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="52" x2="22" y2="45" stroke="#555" stroke-width="1.5"/>
      <line x1="30" y1="53" x2="30" y2="42" stroke="#555" stroke-width="1.5"/>
      <line x1="40" y1="52" x2="38" y2="45" stroke="#555" stroke-width="1.5"/>
      <text x="55" y="50" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <circle cx="80" cy="48" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 78" y1="40" x2="80" y2="35" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    'cotton-brick': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15,45 Q 20,35 30,38 Q 35,30 42,38 Q 48,32 50,40 Q 48,50 30,50 Q 15,50 15,45" fill="none" stroke="#555" stroke-width="2"/>
      <text x="55" y="50" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <rect x="68" y="38" width="25" height="18" rx="2" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="78" y1="38" x2="78" y2="56" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    'bucket-cup': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15,30 L 10,70 L 45,70 L 40,30 Z" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 12,30 Q 27,25 43,30" stroke="#555" stroke-width="2" fill="none"/>
      <text x="48" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 65,40 L 63,65 L 82,65 L 80,40 Z" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 82,48 Q 90,52 82,58" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    'pool-glass': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="35" width="40" height="30" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 15,42 Q 25,38 35,42 Q 45,46 48,42" stroke="#555" stroke-width="2" fill="none"/>
      <text x="52" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 70,35 L 68,65 L 87,65 L 85,35 Z" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    'bottle-spoon': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="40" width="20" height="35" rx="3" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 22,40 L 22,30 Q 28,22 34,30 L 34,40" fill="none" stroke="#555" stroke-width="2"/>
      <text x="45" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <ellipse cx="72" cy="42" rx="10" ry="7" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="72" y1="49" x2="72" y2="72" stroke="#555" stroke-width="3"/>
    </svg>`,
    'bathtub-cup': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 8,45 L 8,65 Q 8,75 18,75 L 42,75 Q 50,75 50,65 L 50,45" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="5" y1="45" x2="53" y2="45" stroke="#555" stroke-width="3"/>
      <text x="55" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 70,40 L 68,65 L 87,65 L 85,40 Z" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 87,48 Q 93,52 87,58" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    'jug-glass': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15,30 L 12,70 L 42,70 L 38,30 Z" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 38,40 Q 48,45 38,55" stroke="#555" stroke-width="2" fill="none"/>
      <line x1="18" y1="45" x2="35" y2="45" stroke="#555" stroke-width="1.5"/>
      <line x1="17" y1="55" x2="36" y2="55" stroke="#555" stroke-width="1.5"/>
      <text x="52" y="55" font-size="10" fill="#555" font-family="sans-serif">vs</text>
      <path d="M 68,35 L 66,65 L 85,65 L 83,35 Z" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    'ice-cream': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="35" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="60" cy="35" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="22" r="14" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 35,48 L 50,85 L 65,48" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="38" y1="60" x2="62" y2="60" stroke="#555" stroke-width="1.5"/>
      <line x1="40" y1="70" x2="60" y2="70" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    soup: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,50 Q 20,75 50,75 Q 80,75 80,50" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="15" y1="50" x2="85" y2="50" stroke="#555" stroke-width="3"/>
      <path d="M 35,42 Q 35,35 38,30" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 50,40 Q 50,32 53,25" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 65,42 Q 65,35 68,30" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    snowman: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="25" r="12" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="50" r="16" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="78" r="18" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="45" cy="22" r="2" fill="#555"/>
      <circle cx="55" cy="22" r="2" fill="#555"/>
      <path d="M 47,28 L 50,30 L 53,28" stroke="#555" stroke-width="1.5" fill="none"/>
      <line x1="34" y1="48" x2="18" y2="40" stroke="#555" stroke-width="2"/>
      <line x1="66" y1="48" x2="82" y2="40" stroke="#555" stroke-width="2"/>
      <circle cx="50" cy="45" r="2" fill="#555"/>
      <circle cx="50" cy="52" r="2" fill="#555"/>
    </svg>`,
    sun: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="20" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="10" x2="50" y2="25" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="75" x2="50" y2="90" stroke="#555" stroke-width="3"/>
      <line x1="10" y1="50" x2="25" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="75" y1="50" x2="90" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="22" y1="22" x2="33" y2="33" stroke="#555" stroke-width="2"/>
      <line x1="67" y1="33" x2="78" y2="22" stroke="#555" stroke-width="2"/>
      <line x1="22" y1="78" x2="33" y2="67" stroke="#555" stroke-width="2"/>
      <line x1="67" y1="67" x2="78" y2="78" stroke="#555" stroke-width="2"/>
    </svg>`,
    'warm-milk': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="35" width="35" height="45" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 65,45 Q 75,50 65,58" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 40,30 Q 40,25 43,20" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 50,28 Q 50,22 53,18" stroke="#555" stroke-width="2" fill="none"/>
      <line x1="35" y1="50" x2="60" y2="50" stroke="#555" stroke-width="1.5"/>
    </svg>`,
    spring: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,70 L 30,40 Q 30,25 45,25" stroke="#555" stroke-width="3" fill="none"/>
      <circle cx="55" cy="22" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="65" cy="30" r="6" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="42" cy="18" r="5" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 25,70 L 35,70" stroke="#555" stroke-width="2"/>
      <path d="M 20,75 Q 35,72 50,75 Q 65,78 80,75" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 70,68 L 70,60" stroke="#555" stroke-width="2"/>
      <circle cx="70" cy="55" r="5" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    'glass-full': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,25 L 27,80 L 73,80 L 70,25 Z" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="30" y="30" width="39" height="48" rx="1" fill="none" stroke="#1565C0" stroke-width="2" stroke-dasharray="3,2"/>
      <path d="M 32,32 Q 45,28 58,32 Q 65,35 68,32" stroke="#1565C0" stroke-width="2" fill="none"/>
    </svg>`,
    'glass-empty': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,25 L 27,80 L 73,80 L 70,25 Z" fill="none" stroke="#555" stroke-width="3"/>
    </svg>`,
    'balance-equal': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="20" x2="50" y2="80" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="40" x2="80" y2="40" stroke="#555" stroke-width="3"/>
      <path d="M 15,45 L 20,60 L 30,60 L 35,45" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 65,45 L 70,60 L 80,60 L 85,45" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="40" y="75" width="20" height="8" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="50" cy="20" r="4" fill="#555"/>
    </svg>`
  };

  // ============================================
  // GAME STATE
  // ============================================

  const TOTAL_ROUNDS = 10;
  let gameState = {
    currentRound: 0,
    score: 0,
    hasRetried: false,
    roundSequence: [],
    isPlaying: false,
    selectedWord: null,
    sentenceAnswers: {}
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================

  const elements = {
    gameArea: document.getElementById('game-area'),
    gameComplete: document.getElementById('game-complete'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    currentStars: document.getElementById('current-stars'),
    question: document.getElementById('question'),
    gameContent: document.getElementById('game-content'),
    feedback: document.getElementById('feedback'),
    finalStars: document.getElementById('final-stars'),
    finalScore: document.getElementById('final-score'),
    finalTotal: document.getElementById('final-total'),
    finalMessage: document.getElementById('final-message'),
    playAgainBtn: document.getElementById('play-again-btn'),
    wordBankBtn: document.getElementById('word-bank-btn'),
    wordBankModal: document.getElementById('word-bank-modal'),
    wordBankSections: document.getElementById('word-bank-sections'),
    wordBankClose: document.getElementById('word-bank-close')
  };

  // ============================================
  // GAME LOGIC
  // ============================================

  function startGame() {
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.hasRetried = false;
    gameState.isPlaying = true;
    gameState.selectedWord = null;
    gameState.sentenceAnswers = {};

    // Pick 10 random questions from pool of 30+
    gameState.roundSequence = pickRandom(ALL_QUESTIONS, TOTAL_ROUNDS);

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn about measuring things!");
  }

  function nextRound() {
    gameState.currentRound++;
    gameState.hasRetried = false;
    gameState.selectedWord = null;
    gameState.sentenceAnswers = {};

    if (gameState.currentRound > TOTAL_ROUNDS) {
      endGame();
      return;
    }

    elements.currentRound.textContent = gameState.currentRound;
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';
    elements.gameContent.classList.remove('bounce', 'shake');

    const q = gameState.roundSequence[gameState.currentRound - 1];

    if (q.type === 'sentence') {
      displaySentenceRound(q);
    } else {
      displayChoiceRound(q);
    }
  }

  // ============================================
  // ROUND TYPE: Choice (compare, capacity, temperature, tool, state)
  // ============================================

  function displayChoiceRound(q) {
    elements.question.textContent = q.question;

    const options = shuffleArray([...q.options]);
    const icon = q.icon ? ICONS[q.icon] : null;

    const html = `
      ${icon ? `<div class="item-display"><div class="item-icon">${icon}</div></div>` : ''}
      <div class="choice-buttons">
        ${options.map(opt => `
          <button class="choice-btn" data-choice="${opt}">${opt}</button>
        `).join('')}
      </div>
    `;

    elements.gameContent.innerHTML = html;

    const buttons = elements.gameContent.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handleChoice(btn, q.answer, q.speech));
    });

    setTimeout(() => Speech.speak(q.question), 300);
  }

  function handleChoice(button, correctAnswer, speechText) {
    const choice = button.dataset.choice;
    const isCorrect = choice === correctAnswer;
    const allButtons = elements.gameContent.querySelectorAll('.choice-btn');

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      elements.gameContent.classList.add('bounce');

      elements.feedback.textContent = speechText;
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');
      Speech.speak(speechText);

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2500);
    } else {
      button.classList.add('incorrect');
      Audio.playError();
      elements.gameContent.classList.add('shake');

      if (!gameState.hasRetried) {
        gameState.hasRetried = true;
        elements.feedback.textContent = 'Try again!';
        elements.feedback.className = 'feedback error';
        elements.feedback.classList.remove('hidden');
        Speech.speak('Try again!');

        setTimeout(() => {
          button.classList.remove('incorrect');
          button.disabled = true;
          elements.feedback.classList.add('hidden');
          elements.gameContent.classList.remove('shake');
        }, 1000);
      } else {
        allButtons.forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.choice === correctAnswer) {
            btn.classList.add('correct');
          }
        });

        elements.feedback.textContent = speechText;
        elements.feedback.className = 'feedback error';
        elements.feedback.classList.remove('hidden');
        Speech.speak(speechText);

        setTimeout(() => {
          updateStarsDisplay();
          nextRound();
        }, 2500);
      }
    }
  }

  // ============================================
  // ROUND TYPE: Sentence Fill
  // ============================================

  function displaySentenceRound(q) {
    elements.question.textContent = 'Fill in the blanks!';

    let html = '<div class="sentences-container">';
    q.sentences.forEach((sentence, idx) => {
      html += `
        <div class="sentence-row">
          <span>${sentence.text}</span>
          <span class="blank-slot" data-index="${idx}" data-answer="${sentence.blank}"></span>
          <span>${sentence.suffix}</span>
        </div>
      `;
    });
    html += '</div>';

    html += '<div class="word-bank-tiles" id="word-tiles">';
    shuffleArray([...q.wordBank]).forEach(word => {
      html += `<button class="word-tile" data-word="${word}">${word}</button>`;
    });
    html += '</div>';

    html += `
      <div class="action-buttons">
        <button class="action-btn" id="clear-btn">Clear</button>
        <button class="action-btn check" id="check-btn" disabled>Check</button>
      </div>
    `;

    elements.gameContent.innerHTML = html;

    const wordTiles = elements.gameContent.querySelectorAll('.word-tile');
    const blankSlots = elements.gameContent.querySelectorAll('.blank-slot');

    wordTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        if (tile.classList.contains('used')) return;
        wordTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        gameState.selectedWord = tile.dataset.word;
      });
    });

    blankSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        if (gameState.selectedWord && !slot.classList.contains('filled')) {
          slot.textContent = gameState.selectedWord;
          slot.classList.add('filled');
          gameState.sentenceAnswers[slot.dataset.index] = gameState.selectedWord;

          wordTiles.forEach(t => {
            if (t.dataset.word === gameState.selectedWord) {
              t.classList.add('used');
              t.classList.remove('selected');
            }
          });
          gameState.selectedWord = null;

          const filled = Object.keys(gameState.sentenceAnswers).length === q.sentences.length;
          document.getElementById('check-btn').disabled = !filled;
        }
      });
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
      blankSlots.forEach(slot => {
        slot.textContent = '';
        slot.classList.remove('filled', 'correct', 'incorrect');
      });
      wordTiles.forEach(tile => {
        tile.classList.remove('used', 'selected');
        tile.disabled = false;
      });
      gameState.sentenceAnswers = {};
      gameState.selectedWord = null;
      document.getElementById('check-btn').disabled = true;
      Audio.playClick();
    });

    document.getElementById('check-btn').addEventListener('click', () => handleSentenceCheck(q));

    setTimeout(() => Speech.speak('Fill in the blanks with the right words!'), 300);
  }

  function handleSentenceCheck(q) {
    const blankSlots = elements.gameContent.querySelectorAll('.blank-slot');
    const wordTiles = elements.gameContent.querySelectorAll('.word-tile');
    let allCorrect = true;

    blankSlots.forEach(slot => {
      const idx = slot.dataset.index;
      const correctAnswer = slot.dataset.answer;
      const userAnswer = gameState.sentenceAnswers[idx];

      if (userAnswer === correctAnswer) {
        slot.classList.add('correct');
      } else {
        slot.classList.add('incorrect');
        allCorrect = false;
      }
    });

    wordTiles.forEach(tile => tile.disabled = true);
    document.getElementById('check-btn').disabled = true;
    document.getElementById('clear-btn').disabled = true;

    if (allCorrect) {
      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;
      Audio.playSuccess();
      elements.gameContent.classList.add('bounce');

      elements.feedback.textContent = 'Great job! All correct!';
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');
      Speech.speak('Great job! All correct!');

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2000);
    } else if (!gameState.hasRetried) {
      gameState.hasRetried = true;
      Audio.playError();
      elements.gameContent.classList.add('shake');

      elements.feedback.textContent = 'Some are wrong. Try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');
      Speech.speak('Some are wrong. Try again!');

      setTimeout(() => {
        blankSlots.forEach(slot => {
          slot.textContent = '';
          slot.classList.remove('filled', 'correct', 'incorrect');
        });
        wordTiles.forEach(tile => {
          tile.classList.remove('used', 'selected');
          tile.disabled = false;
        });
        gameState.sentenceAnswers = {};
        document.getElementById('clear-btn').disabled = false;
        elements.feedback.classList.add('hidden');
        elements.gameContent.classList.remove('shake');
      }, 1500);
    } else {
      Audio.playError();

      blankSlots.forEach(slot => {
        const correctAnswer = slot.dataset.answer;
        if (!slot.classList.contains('correct')) {
          slot.textContent = correctAnswer;
          slot.classList.remove('incorrect');
          slot.classList.add('correct');
        }
      });

      elements.feedback.textContent = 'Check the correct answers!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');
      Speech.speak('Check the correct answers!');

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2500);
    }
  }

  // ============================================
  // SCORING & END GAME
  // ============================================

  function updateStarsDisplay() {
    let displayStars;
    if (gameState.score >= 8) displayStars = 3;
    else if (gameState.score >= 6) displayStars = 2;
    else if (gameState.score >= 4) displayStars = 1;
    else displayStars = 0;

    elements.currentStars.innerHTML = renderStars(displayStars);
  }

  function endGame() {
    gameState.isPlaying = false;

    let finalStarCount;
    if (gameState.score >= 8) finalStarCount = 3;
    else if (gameState.score >= 6) finalStarCount = 2;
    else if (gameState.score >= 4) finalStarCount = 1;
    else finalStarCount = 0;

    Settings.setBestStars('measure', finalStarCount);

    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    const messages = {
      3: "Amazing! You're a measuring expert!",
      2: "Great job learning about measuring!",
      1: "Good try! Keep learning about measures!",
      0: "Nice effort! Try again to learn more!"
    };
    elements.finalMessage.textContent = messages[finalStarCount];

    Audio.playFanfare();
    Speech.speak(messages[finalStarCount]);
  }

  // ============================================
  // WORD BANK
  // ============================================

  function setupWordBank() {
    elements.wordBankBtn.addEventListener('click', () => {
      elements.wordBankModal.classList.add('show');
      Audio.playClick();
    });

    elements.wordBankClose.addEventListener('click', () => {
      elements.wordBankModal.classList.remove('show');
      Audio.playClick();
    });

    elements.wordBankModal.addEventListener('click', (e) => {
      if (e.target === elements.wordBankModal) {
        elements.wordBankModal.classList.remove('show');
      }
    });

    let html = '';

    html += '<div class="word-bank-section"><h3>Mass</h3><div class="word-bank-list">';
    ['heavy', 'heavier', 'light', 'lighter', 'mass', 'balance', 'scale', 'the same as'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Capacity</h3><div class="word-bank-list">';
    ['capacity', 'full', 'empty', 'more', 'less', 'measuring jug'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Temperature</h3><div class="word-bank-list">';
    ['temperature', 'thermometer', 'freezing', 'cold', 'cool', 'warm', 'hot'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Measuring tools</h3><div class="word-bank-list">';
    ['scale', 'balance', 'thermometer', 'measuring jug', 'meter stick'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    elements.wordBankSections.innerHTML = html;

    elements.wordBankSections.querySelectorAll('.word-bank-item').forEach(item => {
      item.addEventListener('click', () => {
        Speech.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(item.dataset.word);
        utterance.voice = Speech.voice;
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        Speech.synth.speak(utterance);
        Audio.playClick();
      });
    });
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  elements.playAgainBtn.addEventListener('click', () => {
    Audio.init();
    Audio.playClick();
    startGame();
  });

  document.querySelector('.home-btn').addEventListener('click', () => {
    Audio.init();
    Audio.playClick();
  });

  // ============================================
  // INITIALIZE
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    setupWordBank();
    startGame();
  });

})();
