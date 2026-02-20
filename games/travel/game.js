(function() {
  'use strict';

  const { Settings, Audio, Speech, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA - 30+ questions, 10 per game
  // ============================================

  // All questions in a single pool
  const ALL_QUESTIONS = [
    // --- Type A: Match vehicle to picture ---
    {
      type: 'vehicle',
      icon: 'car',
      name: 'car',
      question: 'What vehicle is this?',
      options: ['car', 'bus', 'train'],
      answer: 'car',
      speech: 'This is a car. Cars drive on roads!'
    },
    {
      type: 'vehicle',
      icon: 'bus',
      name: 'bus',
      question: 'What vehicle is this?',
      options: ['bus', 'boat', 'car'],
      answer: 'bus',
      speech: 'This is a bus. Many people ride the bus!'
    },
    {
      type: 'vehicle',
      icon: 'plane',
      name: 'plane',
      question: 'What vehicle is this?',
      options: ['plane', 'boat', 'train'],
      answer: 'plane',
      speech: 'This is a plane. Planes fly in the sky!'
    },
    {
      type: 'vehicle',
      icon: 'train',
      name: 'train',
      question: 'What vehicle is this?',
      options: ['train', 'bus', 'boat'],
      answer: 'train',
      speech: 'This is a train. Trains ride on tracks!'
    },
    {
      type: 'vehicle',
      icon: 'boat',
      name: 'boat',
      question: 'What vehicle is this?',
      options: ['boat', 'plane', 'car'],
      answer: 'boat',
      speech: 'This is a boat. Boats float on water!'
    },
    {
      type: 'vehicle',
      icon: 'motorcycle',
      name: 'motorcycle',
      question: 'What vehicle is this?',
      options: ['motorcycle', 'car', 'bus'],
      answer: 'motorcycle',
      speech: 'This is a motorcycle. It has two wheels!'
    },
    {
      type: 'vehicle',
      icon: 'taxi',
      name: 'taxi',
      question: 'What vehicle is this?',
      options: ['taxi', 'bus', 'train'],
      answer: 'taxi',
      speech: 'This is a taxi. You pay to ride in a taxi!'
    },
    {
      type: 'vehicle',
      icon: 'snowmobile',
      name: 'snowmobile',
      question: 'What vehicle is this?',
      options: ['snowmobile', 'motorcycle', 'boat'],
      answer: 'snowmobile',
      speech: 'This is a snowmobile. It drives on snow!'
    },
    {
      type: 'vehicle',
      icon: 'seaplane',
      name: 'seaplane',
      question: 'What vehicle is this?',
      options: ['seaplane', 'plane', 'boat'],
      answer: 'seaplane',
      speech: 'This is a seaplane. It can land on water!'
    },
    // --- Type B: How does it travel? ---
    {
      type: 'how',
      vehicle: 'plane',
      question: 'How does a plane travel?',
      options: ['It flies in the sky', 'It drives on roads', 'It floats on water'],
      answer: 'It flies in the sky',
      speech: 'A plane flies in the sky!'
    },
    {
      type: 'how',
      vehicle: 'boat',
      question: 'How does a boat travel?',
      options: ['It floats on water', 'It flies in the sky', 'It drives on roads'],
      answer: 'It floats on water',
      speech: 'A boat floats on water!'
    },
    {
      type: 'how',
      vehicle: 'car',
      question: 'How does a car travel?',
      options: ['It drives on roads', 'It flies in the sky', 'It floats on water'],
      answer: 'It drives on roads',
      speech: 'A car drives on roads!'
    },
    {
      type: 'how',
      vehicle: 'train',
      question: 'How does a train travel?',
      options: ['It rides on tracks', 'It floats on water', 'It flies in the sky'],
      answer: 'It rides on tracks',
      speech: 'A train rides on tracks!'
    },
    {
      type: 'how',
      vehicle: 'snowmobile',
      question: 'How does a snowmobile travel?',
      options: ['It drives on snow', 'It flies in the sky', 'It floats on water'],
      answer: 'It drives on snow',
      speech: 'A snowmobile drives on snow!'
    },
    {
      type: 'how',
      vehicle: 'seaplane',
      question: 'What is special about a seaplane?',
      options: ['It can land on water', 'It drives on roads', 'It has no wings'],
      answer: 'It can land on water',
      speech: 'A seaplane can land on water!'
    },
    // --- Type C: Action matching ---
    {
      type: 'action',
      icon: 'fly',
      name: 'fly',
      question: 'What action is this?',
      options: ['fly', 'drive', 'climb'],
      answer: 'fly',
      speech: 'This means to fly! Birds and planes fly.'
    },
    {
      type: 'action',
      icon: 'climb',
      name: 'climb',
      question: 'What action is this?',
      options: ['climb', 'slide', 'float'],
      answer: 'climb',
      speech: 'This means to climb! You climb up.'
    },
    {
      type: 'action',
      icon: 'float',
      name: 'float down',
      question: 'What action is this?',
      options: ['float down', 'climb', 'drive'],
      answer: 'float down',
      speech: 'This means to float down! Like a feather.'
    },
    {
      type: 'action',
      icon: 'drive',
      name: 'drive',
      question: 'What action is this?',
      options: ['drive', 'fly', 'slide'],
      answer: 'drive',
      speech: 'This means to drive! Cars and buses drive.'
    },
    {
      type: 'action',
      icon: 'slide-action',
      name: 'slide',
      question: 'What action is this?',
      options: ['slide', 'fly', 'climb'],
      answer: 'slide',
      speech: 'This means to slide! Like going down a slide.'
    },
    // --- Type D: Sentence fill ---
    {
      type: 'sentence',
      sentences: [
        { text: 'A plane can', blank: 'fly', suffix: 'in the sky.' },
        { text: 'A car can', blank: 'drive', suffix: 'on roads.' }
      ],
      wordBank: ['fly', 'drive', 'swim', 'climb']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'A boat floats on the', blank: 'river', suffix: '.' },
        { text: 'Many people live in a', blank: 'city', suffix: '.' }
      ],
      wordBank: ['river', 'city', 'tower', 'winter']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'In Alaska, people use a', blank: 'snowmobile', suffix: 'in winter.' },
        { text: 'A seaplane can land on', blank: 'water', suffix: '.' }
      ],
      wordBank: ['snowmobile', 'water', 'taxi', 'summer']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'A motorcycle has two', blank: 'wheels', suffix: '.' },
        { text: 'A bus has a big', blank: 'motor', suffix: 'to go fast.' }
      ],
      wordBank: ['wheels', 'motor', 'wings', 'river']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'We', blank: 'travel', suffix: 'to visit new places.' },
        { text: 'A tall building is called a', blank: 'tower', suffix: '.' }
      ],
      wordBank: ['travel', 'tower', 'drive', 'boat']
    },
    {
      type: 'sentence',
      sentences: [
        { text: 'You take a', blank: 'taxi', suffix: 'to get somewhere quickly.' },
        { text: 'People ride a', blank: 'bus', suffix: 'to school.' }
      ],
      wordBank: ['taxi', 'bus', 'plane', 'tower']
    },
    // --- Type E: Season/place matching ---
    {
      type: 'choose',
      question: 'Which vehicle is best for traveling on snow?',
      options: ['snowmobile', 'boat', 'seaplane'],
      answer: 'snowmobile',
      speech: 'A snowmobile is best for snow! It is used in winter.'
    },
    {
      type: 'choose',
      question: 'Which vehicle travels on water?',
      options: ['boat', 'car', 'motorcycle'],
      answer: 'boat',
      speech: 'A boat travels on water!'
    },
    {
      type: 'choose',
      question: 'Which vehicle flies in the sky?',
      options: ['plane', 'train', 'bus'],
      answer: 'plane',
      speech: 'A plane flies in the sky!'
    },
    {
      type: 'choose',
      question: 'Which vehicle rides on tracks?',
      options: ['train', 'car', 'boat'],
      answer: 'train',
      speech: 'A train rides on tracks!'
    },
    {
      type: 'choose',
      question: 'In summer, which is best for crossing a river?',
      options: ['boat', 'snowmobile', 'train'],
      answer: 'boat',
      speech: 'A boat is best for crossing a river in summer!'
    },
    {
      type: 'choose',
      question: 'Which has only two wheels?',
      options: ['motorcycle', 'car', 'bus'],
      answer: 'motorcycle',
      speech: 'A motorcycle has only two wheels!'
    }
  ];

  // ============================================
  // SVG ICONS
  // ============================================

  const ICONS = {
    car: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,55 L 25,40 L 40,30 L 65,30 L 80,40 L 85,55" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="15" y="55" width="70" height="20" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="30" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="70" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="30" x2="40" y2="55" stroke="#555" stroke-width="2"/>
      <line x1="60" y1="30" x2="60" y2="55" stroke="#555" stroke-width="2"/>
    </svg>`,
    bus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="70" height="50" rx="8" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="15" y1="50" x2="85" y2="50" stroke="#555" stroke-width="2"/>
      <rect x="22" y="28" width="18" height="18" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="45" y="28" width="18" height="18" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="68" y="28" width="12" height="18" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="30" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="70" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="40" y="52" width="15" height="18" rx="2" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    plane: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="10" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 15,50 L 10,48 L 5,50" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 30,50 L 40,25 L 55,25 L 50,50" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 60,50 L 65,35 L 72,35 L 68,50" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 85,50 L 92,42 L 95,50" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="25" cy="48" r="3" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="35" cy="48" r="3" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    train: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="55" height="40" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="70" y="30" width="20" height="35" rx="8" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="20" y="30" width="20" height="15" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="45" y="30" width="20" height="15" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="10" y1="75" x2="95" y2="75" stroke="#555" stroke-width="3"/>
      <circle cx="25" cy="72" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="72" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="80" cy="72" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="75" y="20" width="10" height="10" rx="2" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    boat: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15,60 Q 15,75 50,75 Q 85,75 85,60 Z" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="25" x2="50" y2="60" stroke="#555" stroke-width="3"/>
      <path d="M 50,25 L 70,45 L 50,45 Z" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 10,82 Q 25,78 40,82 Q 55,86 70,82 Q 85,78 95,82" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    motorcycle: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="65" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="75" cy="65" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 25,65 L 40,45 L 60,40 L 75,65" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 55,40 L 65,30 L 72,30" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="38" y="42" width="20" height="10" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="25" cy="65" r="5" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="75" cy="65" r="5" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    taxi: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,55 L 25,40 L 40,30 L 65,30 L 80,40 L 85,55" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="15" y="55" width="70" height="20" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="30" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="70" cy="78" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="30" x2="40" y2="55" stroke="#555" stroke-width="2"/>
      <line x1="60" y1="30" x2="60" y2="55" stroke="#555" stroke-width="2"/>
      <rect x="42" y="22" width="18" height="8" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <text x="46" y="29" font-size="7" fill="#555" font-family="sans-serif">TAXI</text>
    </svg>`,
    snowmobile: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25,55 L 35,40 L 60,35 L 75,45 L 80,55" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 60,35 L 70,25 L 78,28" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 15,65 L 85,65 Q 90,65 90,70 L 10,70 Q 10,65 15,65" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="67" x2="80" y2="67" stroke="#555" stroke-width="2"/>
      <path d="M 40,55 L 40,65" stroke="#555" stroke-width="2"/>
      <path d="M 60,55 L 60,65" stroke="#555" stroke-width="2"/>
      <circle cx="15" cy="42" r="3" fill="#555"/>
      <circle cx="22" cy="38" r="3" fill="#555"/>
      <circle cx="18" cy="50" r="2" fill="#555"/>
    </svg>`,
    seaplane: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="45" rx="35" ry="10" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 30,45 L 40,20 L 55,20 L 50,45" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 85,45 L 92,37 L 95,45" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 30,55 L 25,70 L 40,70 L 35,55" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 60,55 L 55,70 L 70,70 L 65,55" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 5,75 Q 25,70 50,75 Q 75,80 95,75" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    fly: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="40" x2="50" y2="65" stroke="#555" stroke-width="3"/>
      <path d="M 50,48 L 25,35" stroke="#555" stroke-width="3"/>
      <path d="M 50,48 L 75,35" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="65" x2="40" y2="80" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="65" x2="60" y2="80" stroke="#555" stroke-width="3"/>
      <path d="M 20,30 Q 25,25 30,30" stroke="#1565C0" stroke-width="2" fill="none"/>
      <path d="M 70,30 Q 75,25 80,30" stroke="#1565C0" stroke-width="2" fill="none"/>
      <path d="M 30,85 Q 50,90 70,85" stroke="#555" stroke-width="2" fill="none" stroke-dasharray="3,3"/>
    </svg>`,
    climb: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="60" y1="10" x2="60" y2="90" stroke="#555" stroke-width="4"/>
      <line x1="50" y1="20" x2="70" y2="20" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="40" x2="70" y2="40" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="60" x2="70" y2="60" stroke="#555" stroke-width="3"/>
      <circle cx="38" cy="35" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="38" y1="43" x2="38" y2="58" stroke="#555" stroke-width="2"/>
      <path d="M 38,48 L 50,40" stroke="#555" stroke-width="2"/>
      <path d="M 38,48 L 28,55" stroke="#555" stroke-width="2"/>
      <path d="M 38,58 L 50,60" stroke="#555" stroke-width="2"/>
      <path d="M 38,58 L 30,70" stroke="#555" stroke-width="2"/>
      <path d="M 32,28 L 28,22" stroke="#1565C0" stroke-width="2" stroke-linecap="round"/>
      <path d="M 38,26 L 38,20" stroke="#1565C0" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    float: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 45,20 Q 40,35 42,45 Q 50,55 55,45 Q 58,35 50,20" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 38,48 L 35,55 L 30,48" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 55,48 L 60,55 L 65,48" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 40,60 Q 48,65 50,75" stroke="#555" stroke-width="2" fill="none" stroke-dasharray="3,3"/>
      <path d="M 55,58 Q 52,65 50,75" stroke="#555" stroke-width="2" fill="none" stroke-dasharray="3,3"/>
      <path d="M 15,82 Q 35,76 55,82 Q 75,88 95,82" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    drive: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="50" y1="32" x2="50" y2="20" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="68" x2="50" y2="80" stroke="#555" stroke-width="3"/>
      <line x1="32" y1="50" x2="20" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="68" y1="50" x2="80" y2="50" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="50" r="5" fill="#555"/>
    </svg>`,
    'slide-action': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25,20 L 75,70 Q 80,78 85,78" stroke="#555" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="25" y1="20" x2="25" y2="80" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="80" x2="30" y2="80" stroke="#555" stroke-width="3"/>
      <circle cx="40" cy="32" r="6" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="42" y1="38" x2="48" y2="48" stroke="#555" stroke-width="2"/>
      <path d="M 78,80 L 85,78 L 88,85" stroke="#1565C0" stroke-width="2" fill="none" stroke-linecap="round"/>
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

    // Pick 10 random questions from the pool of 30+
    gameState.roundSequence = pickRandom(ALL_QUESTIONS, TOTAL_ROUNDS);

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn about travel and vehicles!");
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

    switch (q.type) {
      case 'vehicle':
        displayVehicleRound(q);
        break;
      case 'how':
      case 'choose':
        displayChoiceRound(q);
        break;
      case 'action':
        displayActionRound(q);
        break;
      case 'sentence':
        displaySentenceRound(q);
        break;
    }
  }

  // ============================================
  // ROUND TYPE: Vehicle identification
  // ============================================

  function displayVehicleRound(q) {
    elements.question.textContent = q.question;

    const options = shuffleArray([...q.options]);
    const html = `
      <div class="item-display">
        <div class="item-icon">${ICONS[q.icon] || ''}</div>
        <div class="item-name">?</div>
      </div>
      <div class="choice-buttons">
        ${options.map(opt => `
          <button class="choice-btn" data-choice="${opt}">${opt}</button>
        `).join('')}
      </div>
    `;

    elements.gameContent.innerHTML = html;

    const buttons = elements.gameContent.querySelectorAll('.choice-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handleChoice(btn, q.answer, q.speech, q.name));
    });

    setTimeout(() => Speech.speak(q.question), 300);
  }

  // ============================================
  // ROUND TYPE: How/Choose questions
  // ============================================

  function displayChoiceRound(q) {
    elements.question.textContent = q.question;

    const options = shuffleArray([...q.options]);
    const icon = q.vehicle ? ICONS[q.vehicle] : null;

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

  // ============================================
  // ROUND TYPE: Action identification
  // ============================================

  function displayActionRound(q) {
    elements.question.textContent = q.question;

    const options = shuffleArray([...q.options]);
    const html = `
      <div class="item-display">
        <div class="item-icon">${ICONS[q.icon] || ''}</div>
      </div>
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

  // ============================================
  // SHARED: Choice handler
  // ============================================

  function handleChoice(button, correctAnswer, speechText, revealName) {
    const choice = button.dataset.choice;
    const isCorrect = choice === correctAnswer;
    const allButtons = elements.gameContent.querySelectorAll('.choice-btn');

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      if (revealName) {
        const nameEl = elements.gameContent.querySelector('.item-name');
        if (nameEl) nameEl.textContent = revealName;
      }

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

        if (revealName) {
          const nameEl = elements.gameContent.querySelector('.item-name');
          if (nameEl) nameEl.textContent = revealName;
        }

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

    Settings.setBestStars('travel', finalStarCount);

    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    const messages = {
      3: "Amazing! You're a travel expert!",
      2: "Great job learning about vehicles!",
      1: "Good try! Keep exploring the world!",
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

    html += '<div class="word-bank-section"><h3>Vehicles</h3><div class="word-bank-list">';
    ['car', 'bus', 'train', 'plane', 'boat', 'motorcycle', 'taxi', 'snowmobile', 'seaplane'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Travel actions</h3><div class="word-bank-list">';
    ['fly', 'drive', 'climb', 'float down', 'slide', 'travel'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Vehicle parts</h3><div class="word-bank-list">';
    ['motor', 'wheels'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    html += '<div class="word-bank-section"><h3>Places &amp; seasons</h3><div class="word-bank-list">';
    ['city', 'river', 'tower', 'Alaska', 'winter', 'summer'].forEach(word => {
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
