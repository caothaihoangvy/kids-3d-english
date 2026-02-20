(function() {
  'use strict';

  const { Settings, Audio, Speech, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA
  // ============================================

  // Push or Pull scenarios
  const PUSH_PULL_SCENARIOS = [
    { name: 'pushing a cart', force: 'push', icon: 'cart', explanation: 'You push a shopping cart forward!' },
    { name: 'kicking a ball', force: 'push', icon: 'kick', explanation: 'Kicking uses a push force!' },
    { name: 'closing a door', force: 'push', icon: 'door-close', explanation: 'You push a door to close it!' },
    { name: 'throwing a ball', force: 'push', icon: 'throw', explanation: 'Throwing uses a push force!' },
    { name: 'pressing a button', force: 'push', icon: 'button-press', explanation: 'Pressing uses a push force!' },
    { name: 'rolling a ball', force: 'push', icon: 'roll-ball', explanation: 'You push a ball to make it roll!' },
    { name: 'opening a drawer', force: 'pull', icon: 'drawer', explanation: 'You pull a drawer to open it!' },
    { name: 'pulling a wagon', force: 'pull', icon: 'wagon', explanation: 'You pull a wagon behind you!' },
    { name: 'tug of war', force: 'pull', icon: 'tug', explanation: 'In tug of war, you pull the rope!' },
    { name: 'pulling a rope', force: 'pull', icon: 'rope', explanation: 'You use pull force on a rope!' },
    { name: 'stretching a rubber band', force: 'pull', icon: 'rubber', explanation: 'Stretching uses a pull force!' },
    { name: 'reeling in a fish', force: 'pull', icon: 'fishing', explanation: 'You pull the fishing line to catch a fish!' }
  ];

  // Movement actions for matching rounds
  const MOVEMENTS = [
    { name: 'jump', icon: 'jump', description: 'Going up in the air!' },
    { name: 'spin', icon: 'spin', description: 'Going round and round in one spot!' },
    { name: 'swing', icon: 'swing', description: 'Moving back and forth in the air!' },
    { name: 'slide', icon: 'slide', description: 'Moving smoothly down!' },
    { name: 'bounce', icon: 'bounce', description: 'Going up and down again and again!' },
    { name: 'roll', icon: 'roll', description: 'Turning over and over while moving!' },
    { name: 'run', icon: 'run', description: 'Moving fast on your feet!' },
    { name: 'turn', icon: 'turn', description: 'Changing direction!' }
  ];

  // Sentence fill data
  const SENTENCE_ROUNDS = [
    {
      sentences: [
        { text: 'When you kick a ball, you use a', blank: 'push', prefix: '', suffix: 'force.' },
        { text: 'When you open a drawer, you use a', blank: 'pull', prefix: '', suffix: 'force.' }
      ],
      wordBank: ['push', 'pull', 'spin', 'roll']
    },
    {
      sentences: [
        { text: 'A spinning top goes round and round. It is', blank: 'rotating', prefix: '', suffix: '.' },
        { text: 'A rocking chair moves back and forth. It is', blank: 'rocking', prefix: '', suffix: '.' }
      ],
      wordBank: ['rotating', 'rocking', 'jumping', 'pushing']
    },
    {
      sentences: [
        { text: 'A heavy rock is', blank: 'hard', prefix: '', suffix: 'to move.' },
        { text: 'A feather is', blank: 'easy', prefix: '', suffix: 'to move.' }
      ],
      wordBank: ['hard', 'easy', 'push', 'fast']
    },
    {
      sentences: [
        { text: 'A child on a playground goes back and forth on a', blank: 'swing', prefix: '', suffix: '.' },
        { text: 'You use a', blank: 'force', prefix: '', suffix: 'to make things move.' }
      ],
      wordBank: ['swing', 'force', 'slide', 'rope']
    }
  ];

  // ============================================
  // SVG ICONS
  // ============================================

  const SCENARIO_ICONS = {
    cart: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15,30 L 25,30 L 40,65 L 80,65" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="35" y="35" width="45" height="30" rx="3" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="42" cy="75" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="72" cy="75" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 8,30 L 15,30" stroke="#555" stroke-width="4" stroke-linecap="round"/>
      <path d="M 5,35 L 2,30 L 5,25" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    kick: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="20" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="30" x2="40" y2="55" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="40" x2="25" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="40" x2="55" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="55" x2="30" y2="75" stroke="#555" stroke-width="3"/>
      <line x1="40" y1="55" x2="60" y2="65" stroke="#555" stroke-width="3"/>
      <circle cx="72" cy="65" r="12" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 78,55 L 85,50" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 82,62 L 90,58" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'door-close': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="15" width="40" height="70" rx="2" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="62" cy="50" r="4" fill="#555"/>
      <path d="M 15,40 L 30,50" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 15,40 L 20,35" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 15,40 L 20,45" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    throw: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="20" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="35" y1="30" x2="35" y2="55" stroke="#555" stroke-width="3"/>
      <line x1="35" y1="40" x2="20" y2="50" stroke="#555" stroke-width="3"/>
      <path d="M 35,40 Q 55,25 65,30" stroke="#555" stroke-width="3" fill="none"/>
      <circle cx="72" cy="28" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="35" y1="55" x2="25" y2="75" stroke="#555" stroke-width="3"/>
      <line x1="35" y1="55" x2="45" y2="75" stroke="#555" stroke-width="3"/>
      <path d="M 78,22 L 85,18" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 80,28 L 88,26" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'button-press': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="40" width="40" height="30" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <ellipse cx="50" cy="55" rx="12" ry="8" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 50,15 L 50,40" stroke="#555" stroke-width="4" stroke-linecap="round"/>
      <path d="M 42,20 L 50,15 L 58,20" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 45,32 L 55,32" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 50,28 L 50,36" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    'roll-ball': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="55" r="20" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 38,42 Q 48,38 55,35" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 15,45 L 35,50" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 15,45 L 20,40" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 15,45 L 20,50" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 70,68 L 78,74" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 75,62 L 83,66" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    drawer: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="50" height="55" rx="2" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="38" x2="70" y2="38" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="56" x2="70" y2="56" stroke="#555" stroke-width="2"/>
      <rect x="38" y="60" width="14" height="4" rx="2" fill="#555"/>
      <path d="M 52,68 L 52,80 L 70,80 L 70,56" stroke="#555" stroke-width="2" fill="none" stroke-dasharray="4,3"/>
      <path d="M 80,68 L 90,68" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 87,63 L 92,68 L 87,73" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    wagon: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="35" width="50" height="30" rx="3" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="40" cy="72" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="70" cy="72" r="7" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 30,50 L 15,40" stroke="#555" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 8,35 L 15,40" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 12,30 L 8,35 L 12,40" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    tug: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="50" x2="70" y2="50" stroke="#555" stroke-width="4"/>
      <circle cx="20" cy="30" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="38" x2="20" y2="52" stroke="#555" stroke-width="2"/>
      <path d="M 20,45 L 30,50" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="52" x2="15" y2="70" stroke="#555" stroke-width="2"/>
      <line x1="20" y1="52" x2="25" y2="70" stroke="#555" stroke-width="2"/>
      <circle cx="80" cy="30" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="80" y1="38" x2="80" y2="52" stroke="#555" stroke-width="2"/>
      <path d="M 80,45 L 70,50" stroke="#555" stroke-width="2"/>
      <line x1="80" y1="52" x2="75" y2="70" stroke="#555" stroke-width="2"/>
      <line x1="80" y1="52" x2="85" y2="70" stroke="#555" stroke-width="2"/>
      <path d="M 10,48 L 5,48" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 90,48 L 95,48" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    rope: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,50 Q 35,35 50,50 Q 65,65 80,50" stroke="#555" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="10" y="42" width="15" height="16" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="75" y="42" width="15" height="16" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 5,48 L 2,48" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 5,52 L 2,52" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 93,48 L 96,48" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 93,52 L 96,52" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    rubber: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="15" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="8" y="42" width="12" height="16" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="80" y="42" width="12" height="16" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 3,48 L -2,45" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 3,52 L -2,55" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 97,48 L 102,45" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 97,52 L 102,55" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    fishing: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,15 Q 60,15 65,45" stroke="#555" stroke-width="3" fill="none"/>
      <line x1="65" y1="45" x2="65" y2="70" stroke="#555" stroke-width="2"/>
      <path d="M 60,70 L 65,78 L 70,70" stroke="#555" stroke-width="2" fill="none"/>
      <ellipse cx="65" cy="85" rx="15" ry="8" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="60" cy="83" r="2" fill="#555"/>
      <path d="M 25,18 L 25,10" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 22,12 L 25,8 L 28,12" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`
  };

  const MOVEMENT_ICONS = {
    jump: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="20" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="30" x2="50" y2="52" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="38" x2="35" y2="30" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="38" x2="65" y2="30" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="52" x2="38" y2="65" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="52" x2="62" y2="65" stroke="#555" stroke-width="3"/>
      <path d="M 35,75 L 45,80 L 55,80 L 65,75" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 42,82 L 42,88" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 50,84 L 50,90" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 58,82 L 58,88" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    spin: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50,25 L 40,75 L 60,75 Z" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="25" r="5" fill="#555"/>
      <path d="M 25,40 A 30,30 0 0,1 75,40" stroke="#F57C00" stroke-width="3" fill="none"/>
      <path d="M 72,35 L 78,42 L 70,45" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 75,65 A 30,30 0 0,1 25,65" stroke="#F57C00" stroke-width="3" fill="none"/>
      <path d="M 28,60 L 22,67 L 30,70" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    swing: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="10" x2="80" y2="10" stroke="#555" stroke-width="4"/>
      <line x1="45" y1="10" x2="40" y2="50" stroke="#555" stroke-width="2"/>
      <line x1="65" y1="10" x2="60" y2="50" stroke="#555" stroke-width="2"/>
      <rect x="38" y="50" width="24" height="5" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="50" cy="42" r="7" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="50" y1="49" x2="50" y2="50" stroke="#555" stroke-width="2"/>
      <path d="M 30,70 Q 50,85 70,70" stroke="#F57C00" stroke-width="2" fill="none" stroke-dasharray="4,3"/>
      <path d="M 66,72 L 72,68 L 72,75" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    slide: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25,20 L 75,70 Q 80,78 85,78" stroke="#555" stroke-width="4" fill="none" stroke-linecap="round"/>
      <line x1="25" y1="20" x2="25" y2="80" stroke="#555" stroke-width="3"/>
      <line x1="20" y1="80" x2="30" y2="80" stroke="#555" stroke-width="3"/>
      <circle cx="40" cy="32" r="6" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="42" y1="38" x2="48" y2="48" stroke="#555" stroke-width="2"/>
      <path d="M 78,80 L 85,78 L 88,85" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    bounce: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="30" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 50,45 L 50,60 Q 50,75 60,80 Q 70,75 70,60 L 70,55" stroke="#F57C00" stroke-width="2" fill="none" stroke-dasharray="4,3"/>
      <line x1="20" y1="85" x2="80" y2="85" stroke="#555" stroke-width="2"/>
      <circle cx="70" cy="50" r="8" fill="none" stroke="#555" stroke-width="2" stroke-dasharray="3,3"/>
      <path d="M 35,25 Q 50,22 55,25" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    roll: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="55" r="22" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="55" r="5" fill="#555"/>
      <line x1="50" y1="33" x2="50" y2="40" stroke="#555" stroke-width="2"/>
      <line x1="50" y1="70" x2="50" y2="77" stroke="#555" stroke-width="2"/>
      <line x1="28" y1="55" x2="35" y2="55" stroke="#555" stroke-width="2"/>
      <line x1="65" y1="55" x2="72" y2="55" stroke="#555" stroke-width="2"/>
      <path d="M 78,50 L 88,45" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 78,60 L 88,65" stroke="#F57C00" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 85,42 L 90,45 L 86,50" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    run: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="18" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="28" x2="48" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="48" y1="38" x2="30" y2="35" stroke="#555" stroke-width="3"/>
      <line x1="48" y1="38" x2="65" y2="30" stroke="#555" stroke-width="3"/>
      <line x1="48" y1="50" x2="30" y2="70" stroke="#555" stroke-width="3"/>
      <line x1="48" y1="50" x2="65" y2="68" stroke="#555" stroke-width="3"/>
      <path d="M 70,25 L 78,22" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 72,30 L 80,28" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
      <path d="M 74,35 L 82,34" stroke="#F57C00" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    turn: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="20" r="10" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="30" x2="50" y2="55" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="40" x2="35" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="40" x2="65" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="55" x2="40" y2="75" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="55" x2="60" y2="75" stroke="#555" stroke-width="3"/>
      <path d="M 30,15 A 25,25 0 0,1 70,15" stroke="#F57C00" stroke-width="3" fill="none"/>
      <path d="M 67,10 L 73,16 L 65,20" stroke="#F57C00" stroke-width="2" fill="none" stroke-linecap="round"/>
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

    // Create round sequence: 5 push/pull + 3 movement + 2 sentence
    const selectedScenarios = pickRandom(PUSH_PULL_SCENARIOS, 5);
    const selectedMovements = pickRandom(MOVEMENTS, 3);
    const shuffledSentences = shuffleArray([...SENTENCE_ROUNDS]);

    gameState.roundSequence = [
      ...selectedScenarios.map(s => ({ type: 'pushpull', data: s })),
      ...selectedMovements.map(m => ({ type: 'movement', data: m })),
      ...shuffledSentences.slice(0, 2).map(s => ({ type: 'sentence', data: s }))
    ];

    // Shuffle all rounds
    gameState.roundSequence = shuffleArray(gameState.roundSequence);

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn about moving things!");
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

    const roundInfo = gameState.roundSequence[gameState.currentRound - 1];

    switch (roundInfo.type) {
      case 'pushpull':
        displayPushPullRound(roundInfo.data);
        break;
      case 'movement':
        displayMovementRound(roundInfo.data);
        break;
      case 'sentence':
        displaySentenceRound(roundInfo.data);
        break;
    }
  }

  // ============================================
  // ROUND TYPE A: Push or Pull
  // ============================================

  function displayPushPullRound(scenario) {
    elements.question.textContent = 'Is this a PUSH or a PULL?';

    const html = `
      <div class="item-display">
        <div class="item-icon">${SCENARIO_ICONS[scenario.icon] || ''}</div>
        <div class="item-name">${scenario.name}</div>
      </div>
      <div class="force-choices">
        <button class="force-btn push-btn" data-choice="push">
          <div class="force-arrow push-arrow">&#10145;</div>
          <span>Push</span>
        </button>
        <button class="force-btn pull-btn" data-choice="pull">
          <div class="force-arrow pull-arrow">&#11013;</div>
          <span>Pull</span>
        </button>
      </div>
      <div class="explanation hidden" id="explanation"></div>
    `;

    elements.gameContent.innerHTML = html;

    const buttons = elements.gameContent.querySelectorAll('.force-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handlePushPullChoice(btn, scenario));
    });

    setTimeout(() => Speech.speak(`Is ${scenario.name} a push or a pull?`), 300);
  }

  function handlePushPullChoice(button, scenario) {
    const choice = button.dataset.choice;
    const isCorrect = choice === scenario.force;
    const allButtons = elements.gameContent.querySelectorAll('.force-btn');
    const explanation = document.getElementById('explanation');

    button.classList.add('selected');

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      elements.gameContent.classList.add('bounce');

      explanation.textContent = scenario.explanation;
      explanation.className = 'explanation success';
      explanation.classList.remove('hidden');

      Speech.speak(`Correct! ${scenario.explanation}`);

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
        explanation.textContent = 'Try again!';
        explanation.className = 'explanation error';
        explanation.classList.remove('hidden');
        Speech.speak('Try again!');

        setTimeout(() => {
          button.classList.remove('incorrect', 'selected');
          explanation.classList.add('hidden');
          elements.gameContent.classList.remove('shake');
        }, 1000);
      } else {
        allButtons.forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.choice === scenario.force) {
            btn.classList.add('correct');
          }
        });

        explanation.textContent = scenario.explanation;
        explanation.className = 'explanation error';
        explanation.classList.remove('hidden');
        Speech.speak(scenario.explanation);

        setTimeout(() => {
          updateStarsDisplay();
          nextRound();
        }, 2500);
      }
    }
  }

  // ============================================
  // ROUND TYPE B: Name the Movement
  // ============================================

  function displayMovementRound(movement) {
    elements.question.textContent = 'What movement is this?';

    // Get 2 wrong options
    const otherMovements = MOVEMENTS.filter(m => m.name !== movement.name);
    const wrongOptions = pickRandom(otherMovements, 2).map(m => m.name);
    const allOptions = shuffleArray([movement.name, ...wrongOptions]);

    const html = `
      <div class="movement-display">
        <div class="movement-icon">${MOVEMENT_ICONS[movement.icon]}</div>
      </div>
      <div class="movement-choices">
        ${allOptions.map(opt => `
          <button class="movement-btn" data-choice="${opt}">
            ${opt}
          </button>
        `).join('')}
      </div>
    `;

    elements.gameContent.innerHTML = html;

    const buttons = elements.gameContent.querySelectorAll('.movement-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handleMovementChoice(btn, movement));
    });

    setTimeout(() => Speech.speak('What movement is this?'), 300);
  }

  function handleMovementChoice(button, movement) {
    const choice = button.dataset.choice;
    const isCorrect = choice === movement.name;
    const allButtons = elements.gameContent.querySelectorAll('.movement-btn');

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      elements.gameContent.classList.add('bounce');

      elements.feedback.textContent = `Yes! That's ${movement.name}! ${movement.description}`;
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');
      Speech.speak(`Yes! That's ${movement.name}! ${movement.description}`);

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
          if (btn.dataset.choice === movement.name) {
            btn.classList.add('correct');
          }
        });

        elements.feedback.textContent = `It was ${movement.name}! ${movement.description}`;
        elements.feedback.className = 'feedback error';
        elements.feedback.classList.remove('hidden');
        Speech.speak(`It was ${movement.name}. ${movement.description}`);

        setTimeout(() => {
          updateStarsDisplay();
          nextRound();
        }, 2500);
      }
    }
  }

  // ============================================
  // ROUND TYPE C: Sentence Fill
  // ============================================

  function displaySentenceRound(roundData) {
    elements.question.textContent = 'Fill in the blanks!';

    let html = '<div class="sentences-container">';

    roundData.sentences.forEach((sentence, idx) => {
      html += `
        <div class="sentence-row">
          <span>${sentence.text}</span>
          <span class="blank-slot" data-index="${idx}" data-answer="${sentence.blank}">${sentence.prefix}</span>
          <span>${sentence.suffix}</span>
        </div>
      `;
    });

    html += '</div>';
    html += '<div class="word-bank-tiles" id="word-tiles">';
    shuffleArray([...roundData.wordBank]).forEach(word => {
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

    // Setup word tile handlers
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

          checkSentencesFilled(roundData);
        }
      });
    });

    // Clear button
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

    // Check button
    document.getElementById('check-btn').addEventListener('click', () => handleSentenceCheck(roundData));

    setTimeout(() => Speech.speak('Fill in the blanks with the right words!'), 300);
  }

  function checkSentencesFilled(roundData) {
    const filled = Object.keys(gameState.sentenceAnswers).length === roundData.sentences.length;
    document.getElementById('check-btn').disabled = !filled;
  }

  function handleSentenceCheck(roundData) {
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

    Settings.setBestStars('moving_things', finalStarCount);

    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    const messages = {
      3: "Amazing! You're a force expert!",
      2: "Great job learning about push and pull!",
      1: "Good try! Keep learning about forces!",
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

    // Populate word bank
    let html = '';

    // Forces
    html += '<div class="word-bank-section"><h3>Forces</h3><div class="word-bank-list">';
    ['push', 'pull', 'force'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    // Actions
    html += '<div class="word-bank-section"><h3>Actions</h3><div class="word-bank-list">';
    ['jump', 'run', 'roll', 'spin', 'swing', 'slide', 'bounce', 'turn'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    // Describing movement
    html += '<div class="word-bank-section"><h3>Describing movement</h3><div class="word-bank-list">';
    ['rotating', 'rocking', 'easy to move', 'hard to move'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    // Things that move
    html += '<div class="word-bank-section"><h3>Things that move</h3><div class="word-bank-list">';
    ['rope', 'wheel', 'ball', 'cart', 'wagon', 'rubber band'].forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    elements.wordBankSections.innerHTML = html;

    // Add click-to-speak
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
