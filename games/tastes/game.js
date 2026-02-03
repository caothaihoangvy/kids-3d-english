/* ============================================
   Food Tastes Game - Kids 3D English
   Learn about: sweet, salty, sour, bitter, spicy
   ============================================ */

(function() {
  'use strict';

  // Get utilities from shared module
  const { Settings, Audio, Speech, setup3DCard, makeSpeakable, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // Game Data
  // ============================================

  const TASTES = ['sweet', 'salty', 'sour', 'bitter', 'spicy'];

  // Taste emojis for visual hint
  const TASTE_EMOJIS = {
    sweet: '&#127852;',    // Candy
    salty: '&#129472;',    // Salt
    sour: '&#128530;',     // Face puckering
    bitter: '&#128556;',   // Yuck face
    spicy: '&#128293;'     // Fire
  };

  // Foods and their tastes
  const FOODS = [
    // Sweet foods
    { name: 'candy', taste: 'sweet', icon: '&#127852;' },
    { name: 'cake', taste: 'sweet', icon: '&#127874;' },
    { name: 'ice cream', taste: 'sweet', icon: '&#127846;' },
    { name: 'cookie', taste: 'sweet', icon: '&#127850;' },
    { name: 'honey', taste: 'sweet', icon: '&#127855;' },
    { name: 'chocolate', taste: 'sweet', icon: '&#127851;' },
    { name: 'banana', taste: 'sweet', icon: '&#127820;' },
    { name: 'watermelon', taste: 'sweet', icon: '&#127817;' },

    // Salty foods
    { name: 'chips', taste: 'salty', icon: '&#127839;' },
    { name: 'pretzel', taste: 'salty', icon: '&#129384;' },
    { name: 'popcorn', taste: 'salty', icon: '&#127871;' },
    { name: 'fries', taste: 'salty', icon: '&#127839;' },
    { name: 'crackers', taste: 'salty', icon: '&#129372;' },
    { name: 'cheese', taste: 'salty', icon: '&#129472;' },

    // Sour foods
    { name: 'lemon', taste: 'sour', icon: '&#127819;' },
    { name: 'lime', taste: 'sour', icon: '&#127818;' },
    { name: 'grapefruit', taste: 'sour', icon: '&#129386;' },
    { name: 'pickle', taste: 'sour', icon: '&#129362;' },
    { name: 'vinegar', taste: 'sour', icon: '&#127863;' },
    { name: 'green apple', taste: 'sour', icon: '&#127823;' },

    // Bitter foods
    { name: 'dark chocolate', taste: 'bitter', icon: '&#127851;' },
    { name: 'coffee', taste: 'bitter', icon: '&#9749;' },
    { name: 'broccoli', taste: 'bitter', icon: '&#129382;' },
    { name: 'kale', taste: 'bitter', icon: '&#129388;' },
    { name: 'grapefruit peel', taste: 'bitter', icon: '&#129386;' },

    // Spicy foods
    { name: 'chili', taste: 'spicy', icon: '&#127798;' },
    { name: 'hot sauce', taste: 'spicy', icon: '&#129746;' },
    { name: 'jalapeño', taste: 'spicy', icon: '&#127798;' },
    { name: 'wasabi', taste: 'spicy', icon: '&#129388;' },
    { name: 'pepper', taste: 'spicy', icon: '&#127798;' },
    { name: 'curry', taste: 'spicy', icon: '&#127835;' }
  ];

  // ============================================
  // Game State
  // ============================================

  const TOTAL_ROUNDS = 5;

  let gameState = {
    currentRound: 0,
    score: 0,
    stars: 0,
    hasRetried: false,
    roundFoods: [],
    isPlaying: false
  };

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    foodIcon: document.getElementById('food-icon'),
    foodName: document.getElementById('food-name'),
    choicesContainer: document.getElementById('choices-container'),
    feedback: document.getElementById('feedback'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    currentStars: document.getElementById('current-stars'),
    gameArea: document.querySelector('.game-area:not(.game-complete)'),
    gameComplete: document.getElementById('game-complete'),
    finalStars: document.getElementById('final-stars'),
    finalScore: document.getElementById('final-score'),
    finalTotal: document.getElementById('final-total'),
    finalMessage: document.getElementById('final-message'),
    playAgainBtn: document.getElementById('play-again-btn'),
    card3d: document.getElementById('food-card')
  };

  // ============================================
  // Game Logic
  // ============================================

  function startGame() {
    // Reset state
    gameState = {
      currentRound: 0,
      score: 0,
      stars: 0,
      hasRetried: false,
      roundFoods: selectRoundFoods(),
      isPlaying: true
    };

    // Update UI
    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');
    updateStarsDisplay();

    // Start first round
    nextRound();

    // Welcome voice
    Speech.speak('Let\'s learn about food tastes!');
  }

  function selectRoundFoods() {
    // Pick one food from each taste, shuffled
    const selected = [];
    const shuffledTastes = shuffleArray(TASTES);

    shuffledTastes.forEach(taste => {
      const tasteFoods = FOODS.filter(food => food.taste === taste);
      const randomFood = tasteFoods[Math.floor(Math.random() * tasteFoods.length)];
      selected.push(randomFood);
    });

    return selected.slice(0, TOTAL_ROUNDS);
  }

  function nextRound() {
    gameState.currentRound++;
    gameState.hasRetried = false;

    if (gameState.currentRound > TOTAL_ROUNDS) {
      endGame();
      return;
    }

    // Update round display
    elements.currentRound.textContent = gameState.currentRound;

    // Get current food
    const currentFood = gameState.roundFoods[gameState.currentRound - 1];

    // Display food
    displayFood(currentFood);

    // Generate choices
    generateChoices(currentFood);

    // Clear feedback
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';

    // Speak the question
    setTimeout(() => {
      Speech.speak(`How does ${currentFood.name} taste?`);
    }, 500);
  }

  function displayFood(food) {
    elements.foodIcon.innerHTML = food.icon;
    elements.foodName.textContent = food.name;

    // Make the food name speakable (click to hear pronunciation)
    // Remove old speakable class and re-add with new word
    elements.foodName.classList.remove('speakable', 'speaking');
    makeSpeakable(elements.foodName, food.name);

    // Reset card animation
    elements.card3d.classList.remove('idle');
    elements.card3d.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // Restart idle animation after a moment
    setTimeout(() => {
      elements.card3d.classList.add('idle');
    }, 100);
  }

  function generateChoices(currentFood) {
    elements.choicesContainer.innerHTML = '';

    // Get correct answer and 2 wrong answers
    const correctTaste = currentFood.taste;
    const wrongTastes = TASTES.filter(t => t !== correctTaste);
    const selectedWrong = pickRandom(wrongTastes, 2);

    // Combine and shuffle
    const allChoices = shuffleArray([correctTaste, ...selectedWrong]);

    // Create buttons with taste-specific styling
    allChoices.forEach(taste => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.taste = taste;

      // Create text span with taste name
      const textSpan = document.createElement('span');
      const tasteName = taste.charAt(0).toUpperCase() + taste.slice(1);
      textSpan.textContent = tasteName;

      // Add taste emoji
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'taste-emoji';
      emojiSpan.innerHTML = TASTE_EMOJIS[taste];

      // Create speaker icon for pronunciation
      const speakIcon = document.createElement('span');
      speakIcon.className = 'speak-icon';
      speakIcon.innerHTML = '&#128264;';
      speakIcon.title = 'Click to hear';
      speakIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger answer selection
        Audio.init();
        Audio.playClick();
        // Speak the word
        Speech.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(taste);
        utterance.voice = Speech.voice;
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        Speech.synth.speak(utterance);
      });

      btn.appendChild(textSpan);
      btn.appendChild(emojiSpan);
      btn.appendChild(speakIcon);
      btn.addEventListener('click', () => handleChoice(taste, currentFood, btn));
      elements.choicesContainer.appendChild(btn);
    });
  }

  function handleChoice(selectedTaste, currentFood, buttonElement) {
    Audio.init();
    const isCorrect = selectedTaste === currentFood.taste;

    // Disable all buttons temporarily
    const allButtons = elements.choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      handleCorrectAnswer(currentFood, buttonElement);
    } else {
      handleWrongAnswer(buttonElement, allButtons);
    }
  }

  function handleCorrectAnswer(currentFood, buttonElement) {
    buttonElement.classList.add('correct');

    // Calculate stars for this round
    const roundStars = gameState.hasRetried ? 1 : 3;
    gameState.score++;

    // Update stars
    gameState.stars += roundStars;
    updateStarsDisplay();

    // Play sounds
    Audio.playSuccess();
    for (let i = 0; i < roundStars; i++) {
      setTimeout(() => Audio.playStar(), 300 + i * 200);
    }

    // Show feedback
    const taste = currentFood.taste;
    elements.feedback.innerHTML = `&#127881; Yummy! ${currentFood.name} tastes <strong>${taste}</strong>!`;
    elements.feedback.className = 'feedback success';
    elements.feedback.classList.remove('hidden');

    // Celebrate animation
    elements.card3d.classList.add('celebrate');
    setTimeout(() => elements.card3d.classList.remove('celebrate'), 600);

    // Voice feedback
    Speech.speak(`Yummy! ${currentFood.name} tastes ${taste}!`);

    // Next round after delay
    setTimeout(nextRound, 2500);
  }

  function handleWrongAnswer(buttonElement, allButtons) {
    buttonElement.classList.add('incorrect');
    Audio.playError();

    if (!gameState.hasRetried) {
      // First wrong attempt - allow retry
      gameState.hasRetried = true;

      elements.feedback.innerHTML = '&#128528; Hmm, try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak('Hmm, try again!');

      // Re-enable buttons except the wrong one
      setTimeout(() => {
        allButtons.forEach(btn => {
          if (!btn.classList.contains('incorrect')) {
            btn.disabled = false;
          }
        });
      }, 800);
    } else {
      // Second wrong attempt - show correct answer and move on
      const currentFood = gameState.roundFoods[gameState.currentRound - 1];

      // Highlight correct answer
      allButtons.forEach(btn => {
        if (btn.dataset.taste === currentFood.taste) {
          btn.classList.add('correct');
        }
      });

      elements.feedback.innerHTML = `${currentFood.name} tastes <strong>${currentFood.taste}</strong>. Let's try another food!`;
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak(`That's okay! ${currentFood.name} tastes ${currentFood.taste}. Let's try another food!`);

      // Next round after delay
      setTimeout(nextRound, 3000);
    }
  }

  function updateStarsDisplay() {
    // Calculate average stars (simplified: use score-based calculation)
    const maxPossibleStars = gameState.currentRound * 3;
    const percentage = maxPossibleStars > 0 ? gameState.stars / maxPossibleStars : 0;

    let displayStars;
    if (percentage >= 0.8) displayStars = 3;
    else if (percentage >= 0.5) displayStars = 2;
    else if (percentage > 0) displayStars = 1;
    else displayStars = 0;

    elements.currentStars.innerHTML = renderStars(displayStars);
  }

  function endGame() {
    gameState.isPlaying = false;

    // Calculate final stars
    const maxStars = TOTAL_ROUNDS * 3;
    const percentage = gameState.stars / maxStars;

    let finalStarCount;
    if (percentage >= 0.8) finalStarCount = 3;
    else if (percentage >= 0.5) finalStarCount = 2;
    else if (percentage > 0) finalStarCount = 1;
    else finalStarCount = 0;

    // Save best score
    Settings.setBestStars('tastes', finalStarCount);

    // Show game complete screen
    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    // Set message based on performance
    const messages = [
      'Keep practicing! You\'ll get better!',
      'Good try! Keep tasting!',
      'Great job! You know your tastes!',
      'Amazing! You\'re a taste expert!'
    ];
    elements.finalMessage.textContent = messages[finalStarCount];

    // Play fanfare and speak
    Audio.playFanfare();
    setTimeout(() => {
      Speech.speak(`Yummy! You got ${gameState.score} correct! ${messages[finalStarCount]}`);
    }, 600);
  }

  // ============================================
  // Event Listeners
  // ============================================

  elements.playAgainBtn.addEventListener('click', () => {
    Audio.playClick();
    startGame();
  });

  // Home button sound
  document.querySelector('.home-btn').addEventListener('click', () => {
    Audio.playClick();
  });

  // ============================================
  // Initialize
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    // Setup 3D card interaction
    setup3DCard(elements.card3d);

    // Start the game
    startGame();
  });

})();
