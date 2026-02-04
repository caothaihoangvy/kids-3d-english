(function() {
  'use strict';

  const { Settings, Audio, Speech, setup3DCard, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA
  // ============================================

  // Needs vocabulary
  const NEEDS = ['air', 'food', 'water', 'shelter'];

  // Body/breathing vocabulary
  const BREATHING_WORDS = ['breathe', 'lungs', 'gills', 'skin'];

  // Healthy foods
  const HEALTHY_FOODS = [
    { name: 'fruit', icon: 'fruit', explanation: 'Fruit gives you vitamins!' },
    { name: 'vegetables', icon: 'vegetables', explanation: 'Vegetables make you strong!' },
    { name: 'rice', icon: 'rice', explanation: 'Rice gives you energy!' },
    { name: 'seafood', icon: 'seafood', explanation: 'Seafood is good for your brain!' },
    { name: 'meat', icon: 'meat', explanation: 'Meat helps you grow!' },
    { name: 'pasta', icon: 'pasta', explanation: 'Pasta gives you energy!' },
    { name: 'milk', icon: 'milk', explanation: 'Milk makes your bones strong!' },
    { name: 'water', icon: 'water', explanation: 'Water helps you stay alive!' }
  ];

  // Unhealthy foods
  const UNHEALTHY_FOODS = [
    { name: 'cupcake', icon: 'cupcake', explanation: 'Too much sugar is not healthy.' },
    { name: 'sweets', icon: 'sweets', explanation: 'Sweets have too much sugar.' },
    { name: 'ketchup', icon: 'ketchup', explanation: 'Ketchup has lots of sugar.' },
    { name: 'pizza', icon: 'pizza', explanation: 'Too much pizza is not healthy.' },
    { name: 'fried chicken', icon: 'fried-chicken', explanation: 'Fried food is not healthy.' },
    { name: 'french fries', icon: 'fries', explanation: 'French fries are fried in oil.' },
    { name: 'soda', icon: 'soda', explanation: 'Soda has too much sugar.' }
  ];

  // Sentence fill data (pairs of sentences per round)
  const SENTENCE_ROUNDS = [
    {
      sentences: [
        { text: 'All animals need', blank: 'air', prefix: '', suffix: '.' },
        { text: 'All animals need', blank: 'water', prefix: '', suffix: '.' }
      ],
      wordBank: ['air', 'water', 'shelter', 'breathe']
    },
    {
      sentences: [
        { text: 'All animals need', blank: 'food', prefix: '', suffix: '.' },
        { text: 'Humans need these things to stay', blank: 'alive', prefix: '', suffix: '.' }
      ],
      wordBank: ['food', 'alive', 'healthy', 'air']
    },
    {
      sentences: [
        { text: 'If you eat the wrong food you will be', blank: 'unhealthy', prefix: '', suffix: '.' },
        { text: 'We', blank: 'breathe', prefix: '', suffix: 'with our lungs.' }
      ],
      wordBank: ['unhealthy', 'breathe', 'alive', 'water']
    }
  ];

  // Animal breathing data
  const ANIMALS = [
    { name: 'fish', breathesWith: 'gills', explanation: 'A fish uses gills to breathe underwater!' },
    { name: 'human', breathesWith: 'lungs', explanation: 'Humans use lungs to breathe air!' },
    { name: 'frog', breathesWith: 'skin', explanation: 'A frog can breathe through its skin!' },
    { name: 'worm', breathesWith: 'skin', explanation: 'A worm breathes through its skin!' }
  ];

  const BREATHING_OPTIONS = ['lungs', 'gills', 'skin'];

  // ============================================
  // SVG ICONS
  // ============================================

  const FOOD_ICONS = {
    fruit: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="55" rx="35" ry="30" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 50,25 Q 55,15 65,20" stroke="#555" stroke-width="3" fill="none"/>
      <ellipse cx="50" cy="55" rx="25" ry="20" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    vegetables: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="60" rx="20" ry="30" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 40,35 Q 50,20 60,35" stroke="#555" stroke-width="3" fill="none"/>
      <line x1="50" y1="30" x2="50" y2="45" stroke="#555" stroke-width="2"/>
    </svg>`,
    rice: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25,70 Q 25,40 50,40 Q 75,40 75,70 Z" fill="none" stroke="#555" stroke-width="3"/>
      <ellipse cx="40" cy="55" rx="5" ry="8" fill="none" stroke="#555" stroke-width="2"/>
      <ellipse cx="55" cy="50" rx="5" ry="8" fill="none" stroke="#555" stroke-width="2"/>
      <ellipse cx="60" cy="62" rx="5" ry="8" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    seafood: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="45" cy="50" rx="30" ry="20" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 75,50 L 90,35 L 90,65 Z" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="30" cy="45" r="4" fill="#555"/>
      <path d="M 35,55 Q 45,60 55,55" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    meat: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="#555" stroke-width="3"/>
      <ellipse cx="50" cy="50" rx="20" ry="12" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="25" cy="50" r="8" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    pasta: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,60 Q 30,40 50,50 Q 70,60 80,40" stroke="#555" stroke-width="4" fill="none"/>
      <path d="M 25,70 Q 40,55 55,65 Q 70,75 85,55" stroke="#555" stroke-width="4" fill="none"/>
      <ellipse cx="50" cy="80" rx="35" ry="10" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    milk: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="40" height="55" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="35" y="20" width="30" height="15" rx="3" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="40" y1="50" x2="60" y2="50" stroke="#555" stroke-width="2"/>
      <line x1="40" y1="60" x2="55" y2="60" stroke="#555" stroke-width="2"/>
    </svg>`,
    water: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50,20 Q 25,50 25,65 Q 25,85 50,85 Q 75,85 75,65 Q 75,50 50,20 Z" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 40,55 Q 50,50 60,55" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    cupcake: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,50 Q 30,30 50,30 Q 70,30 70,50" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 25,50 L 35,85 L 65,85 L 75,50 Z" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="50" cy="25" r="8" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="35" y1="60" x2="35" y2="75" stroke="#555" stroke-width="2"/>
      <line x1="50" y1="55" x2="50" y2="80" stroke="#555" stroke-width="2"/>
      <line x1="65" y1="60" x2="65" y2="75" stroke="#555" stroke-width="2"/>
    </svg>`,
    sweets: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="25" ry="20" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 25,50 L 15,45 L 15,55 Z" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 75,50 L 85,45 L 85,55 Z" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 35,45 Q 50,55 65,45" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    ketchup: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="35" width="30" height="50" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 40,35 L 40,25 Q 50,15 60,25 L 60,35" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="40" y="50" width="20" height="25" rx="2" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    pizza: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50,20 L 20,80 L 80,80 Z" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="45" cy="50" r="6" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="55" cy="65" r="6" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="40" cy="70" r="5" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    'fried-chicken': `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="55" cy="50" rx="30" ry="25" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="20" y="45" width="15" height="35" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 40,35 Q 55,25 70,35" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 45,55 Q 55,50 65,55" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    fries: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 30,85 L 25,45 L 75,45 L 70,85 Z" fill="none" stroke="#555" stroke-width="3"/>
      <rect x="32" y="25" width="8" height="35" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="45" y="20" width="8" height="40" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="58" y="28" width="8" height="32" rx="2" fill="none" stroke="#555" stroke-width="2"/>
    </svg>`,
    soda: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="25" width="40" height="60" rx="5" fill="none" stroke="#555" stroke-width="3"/>
      <ellipse cx="50" cy="25" rx="20" ry="5" fill="none" stroke="#555" stroke-width="2"/>
      <rect x="35" y="40" width="30" height="20" rx="2" fill="none" stroke="#555" stroke-width="2"/>
      <line x1="45" y1="15" x2="45" y2="20" stroke="#555" stroke-width="2"/>
      <line x1="55" y1="12" x2="55" y2="20" stroke="#555" stroke-width="2"/>
    </svg>`
  };

  const ANIMAL_ICONS = {
    fish: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="45" cy="50" rx="35" ry="25" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 80,50 L 95,30 L 95,70 Z" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="25" cy="45" r="5" fill="#555"/>
      <path d="M 30,55 Q 45,62 60,55" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 50,40 L 55,25 L 60,40" stroke="#555" stroke-width="2" fill="none"/>
      <line x1="65" y1="45" x2="70" y2="45" stroke="#555" stroke-width="2"/>
      <line x1="65" y1="50" x2="72" y2="50" stroke="#555" stroke-width="2"/>
      <line x1="65" y1="55" x2="70" y2="55" stroke="#555" stroke-width="2"/>
    </svg>`,
    human: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="25" r="15" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="40" x2="50" y2="70" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="50" x2="30" y2="60" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="50" x2="70" y2="60" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="70" x2="35" y2="90" stroke="#555" stroke-width="3"/>
      <line x1="50" y1="70" x2="65" y2="90" stroke="#555" stroke-width="3"/>
      <circle cx="43" cy="22" r="2" fill="#555"/>
      <circle cx="57" cy="22" r="2" fill="#555"/>
      <path d="M 45,30 Q 50,35 55,30" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    frog: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="55" rx="35" ry="25" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="35" cy="35" r="12" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="65" cy="35" r="12" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="35" cy="35" r="5" fill="#555"/>
      <circle cx="65" cy="35" r="5" fill="#555"/>
      <path d="M 40,60 Q 50,70 60,60" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 20,70 L 10,85 L 25,80" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 80,70 L 90,85 L 75,80" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    worm: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20,50 Q 30,30 45,50 Q 60,70 75,50 Q 85,35 90,50" stroke="#555" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="90" cy="50" r="8" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="87" cy="48" r="2" fill="#555"/>
      <path d="M 85,55 Q 90,58 95,55" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`
  };

  const ORGAN_ICONS = {
    lungs: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50,20 L 50,45" stroke="#555" stroke-width="3"/>
      <path d="M 50,35 Q 30,35 25,50 Q 20,70 35,80 Q 50,85 50,60" fill="none" stroke="#555" stroke-width="3"/>
      <path d="M 50,35 Q 70,35 75,50 Q 80,70 65,80 Q 50,85 50,60" fill="none" stroke="#555" stroke-width="3"/>
    </svg>`,
    gills: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="30" ry="35" fill="none" stroke="#555" stroke-width="3"/>
      <line x1="30" y1="35" x2="45" y2="35" stroke="#555" stroke-width="3"/>
      <line x1="30" y1="50" x2="50" y2="50" stroke="#555" stroke-width="3"/>
      <line x1="30" y1="65" x2="45" y2="65" stroke="#555" stroke-width="3"/>
      <path d="M 55,30 Q 70,35 55,40" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 60,45 Q 75,50 60,55" stroke="#555" stroke-width="2" fill="none"/>
      <path d="M 55,60 Q 70,65 55,70" stroke="#555" stroke-width="2" fill="none"/>
    </svg>`,
    skin: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" rx="10" fill="none" stroke="#555" stroke-width="3"/>
      <circle cx="40" cy="40" r="4" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="55" cy="45" r="4" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="45" cy="58" r="4" fill="none" stroke="#555" stroke-width="2"/>
      <circle cx="60" cy="60" r="3" fill="none" stroke="#555" stroke-width="2"/>
      <path d="M 35,68 Q 38,72 42,68" stroke="#555" stroke-width="2" fill="none"/>
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
    gameCard: document.getElementById('game-card'),
    cardContent: document.getElementById('card-content'),
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

    // Create round sequence: 5 healthy + 3 sentence + 2 breathing
    const allFoods = [...HEALTHY_FOODS.map(f => ({ ...f, isHealthy: true })),
                      ...UNHEALTHY_FOODS.map(f => ({ ...f, isHealthy: false }))];
    const selectedFoods = pickRandom(allFoods, 5);

    const shuffledSentences = shuffleArray([...SENTENCE_ROUNDS]);
    const shuffledAnimals = pickRandom(ANIMALS, 2);

    gameState.roundSequence = [
      ...selectedFoods.map(food => ({ type: 'healthy', data: food })),
      ...shuffledSentences.slice(0, 3).map(s => ({ type: 'sentence', data: s })),
      ...shuffledAnimals.map(animal => ({ type: 'breathing', data: animal }))
    ];

    // Shuffle all rounds
    gameState.roundSequence = shuffleArray(gameState.roundSequence);

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    setup3DCard(elements.gameCard);
    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn about staying alive!");
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
    elements.gameCard.classList.remove('bounce', 'shake');

    const roundInfo = gameState.roundSequence[gameState.currentRound - 1];

    switch (roundInfo.type) {
      case 'healthy':
        displayHealthyRound(roundInfo.data);
        break;
      case 'sentence':
        displaySentenceRound(roundInfo.data);
        break;
      case 'breathing':
        displayBreathingRound(roundInfo.data);
        break;
    }
  }

  // ============================================
  // ROUND TYPE A: Healthy vs Not Healthy
  // ============================================

  function displayHealthyRound(food) {
    elements.question.textContent = 'Is this healthy or not healthy?';

    const html = `
      <div class="item-display">
        <div class="item-icon">${FOOD_ICONS[food.icon] || FOOD_ICONS.fruit}</div>
        <div class="item-name">${food.name}</div>
      </div>
      <div class="health-choices">
        <button class="health-btn healthy" data-choice="healthy">
          <div class="checkbox"></div>
          <span>Healthy</span>
        </button>
        <button class="health-btn unhealthy" data-choice="unhealthy">
          <div class="checkbox"></div>
          <span>Not healthy</span>
        </button>
      </div>
      <div class="explanation hidden" id="explanation"></div>
    `;

    elements.cardContent.innerHTML = html;

    // Setup button handlers
    const buttons = elements.cardContent.querySelectorAll('.health-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handleHealthyChoice(btn, food));
    });

    setTimeout(() => Speech.speak(`Is ${food.name} healthy or not healthy?`), 300);
  }

  function handleHealthyChoice(button, food) {
    const choice = button.dataset.choice;
    const isCorrect = (choice === 'healthy' && food.isHealthy) || (choice === 'unhealthy' && !food.isHealthy);
    const allButtons = elements.cardContent.querySelectorAll('.health-btn');
    const explanation = document.getElementById('explanation');

    button.classList.add('selected');
    button.querySelector('.checkbox').textContent = '✓';

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      elements.gameCard.classList.add('bounce');

      explanation.textContent = food.explanation;
      explanation.className = 'explanation success';
      explanation.classList.remove('hidden');

      Speech.speak(`Good choice! ${food.explanation}`);

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2500);
    } else {
      button.classList.add('incorrect');
      Audio.playError();
      elements.gameCard.classList.add('shake');

      if (!gameState.hasRetried) {
        gameState.hasRetried = true;
        explanation.textContent = 'Try again!';
        explanation.className = 'explanation error';
        explanation.classList.remove('hidden');
        Speech.speak('Try again!');

        setTimeout(() => {
          button.classList.remove('incorrect', 'selected');
          button.querySelector('.checkbox').textContent = '';
          explanation.classList.add('hidden');
          elements.gameCard.classList.remove('shake');
        }, 1000);
      } else {
        // Show correct answer
        allButtons.forEach(btn => {
          btn.disabled = true;
          const isCorrectBtn = (btn.dataset.choice === 'healthy' && food.isHealthy) ||
                              (btn.dataset.choice === 'unhealthy' && !food.isHealthy);
          if (isCorrectBtn) {
            btn.classList.add('correct');
            btn.querySelector('.checkbox').textContent = '✓';
          }
        });

        explanation.textContent = food.explanation;
        explanation.className = 'explanation error';
        explanation.classList.remove('hidden');
        Speech.speak(food.explanation);

        setTimeout(() => {
          updateStarsDisplay();
          nextRound();
        }, 2500);
      }
    }
  }

  // ============================================
  // ROUND TYPE B: Sentence Fill
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
    html += '<div class="word-bank" id="word-tiles">';
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

    elements.cardContent.innerHTML = html;

    // Setup word tile handlers
    const wordTiles = elements.cardContent.querySelectorAll('.word-tile');
    const blankSlots = elements.cardContent.querySelectorAll('.blank-slot');

    wordTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        if (tile.classList.contains('used')) return;

        // Deselect previous
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

          // Mark tile as used
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
    const blankSlots = elements.cardContent.querySelectorAll('.blank-slot');
    const wordTiles = elements.cardContent.querySelectorAll('.word-tile');
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
      elements.gameCard.classList.add('bounce');

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
      elements.gameCard.classList.add('shake');

      elements.feedback.textContent = 'Some are wrong. Try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');
      Speech.speak('Some are wrong. Try again!');

      setTimeout(() => {
        // Reset for retry
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
        elements.gameCard.classList.remove('shake');
      }, 1500);
    } else {
      // Show correct answers
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
  // ROUND TYPE C: Animal Breathing
  // ============================================

  function displayBreathingRound(animal) {
    elements.question.textContent = 'How does this animal breathe?';

    const html = `
      <div class="animal-display">
        <div class="animal-icon">${ANIMAL_ICONS[animal.name]}</div>
        <div class="animal-name">${animal.name}</div>
      </div>
      <div class="breathing-question">How does it breathe?</div>
      <div class="breathing-choices">
        ${BREATHING_OPTIONS.map(opt => `
          <button class="breathing-btn" data-choice="${opt}">
            <div class="organ-icon">${ORGAN_ICONS[opt]}</div>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    elements.cardContent.innerHTML = html;

    // Setup button handlers
    const buttons = elements.cardContent.querySelectorAll('.breathing-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => handleBreathingChoice(btn, animal));
    });

    setTimeout(() => Speech.speak(`How does a ${animal.name} breathe?`), 300);
  }

  function handleBreathingChoice(button, animal) {
    const choice = button.dataset.choice;
    const isCorrect = choice === animal.breathesWith;
    const allButtons = elements.cardContent.querySelectorAll('.breathing-btn');

    if (isCorrect) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      elements.gameCard.classList.add('bounce');

      elements.feedback.textContent = animal.explanation;
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');
      Speech.speak(animal.explanation);

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2500);
    } else {
      button.classList.add('incorrect');
      Audio.playError();
      elements.gameCard.classList.add('shake');

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
          elements.gameCard.classList.remove('shake');
        }, 1000);
      } else {
        // Show correct answer
        allButtons.forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.choice === animal.breathesWith) {
            btn.classList.add('correct');
          }
        });

        elements.feedback.textContent = animal.explanation;
        elements.feedback.className = 'feedback error';
        elements.feedback.classList.remove('hidden');
        Speech.speak(animal.explanation);

        setTimeout(() => {
          updateStarsDisplay();
          nextRound();
        }, 2500);
      }
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

    Settings.setBestStars('staying_alive', finalStarCount);

    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    const messages = {
      3: "Amazing! You know how to stay alive and healthy!",
      2: "Great job learning about staying alive!",
      1: "Good try! Keep learning about health!",
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

    // Needs
    html += '<div class="word-bank-section"><h3>What we need</h3><div class="word-bank-list">';
    NEEDS.forEach(word => {
      html += `<div class="word-bank-item" data-word="${word}">${word}</div>`;
    });
    html += '</div></div>';

    // Healthy foods
    html += '<div class="word-bank-section"><h3>Healthy foods</h3><div class="word-bank-list">';
    HEALTHY_FOODS.forEach(food => {
      html += `<div class="word-bank-item" data-word="${food.name}">${food.name}</div>`;
    });
    html += '</div></div>';

    // Unhealthy foods
    html += '<div class="word-bank-section"><h3>Not healthy foods</h3><div class="word-bank-list">';
    UNHEALTHY_FOODS.forEach(food => {
      html += `<div class="word-bank-item" data-word="${food.name}">${food.name}</div>`;
    });
    html += '</div></div>';

    // Breathing
    html += '<div class="word-bank-section"><h3>Breathing words</h3><div class="word-bank-list">';
    BREATHING_WORDS.forEach(word => {
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
