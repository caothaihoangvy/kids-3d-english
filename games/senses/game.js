/* ============================================
   Five Senses Game - Kids 3D English
   Learn about: sight, hearing, smell, taste, touch
   ============================================ */

(function() {
  'use strict';

  // Get utilities from shared module
  const { Settings, Audio, Speech, setup3DCard, makeSpeakable, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // Game Data
  // ============================================

  const SENSES = ['sight', 'hearing', 'smell', 'taste', 'touch'];

  // Sense info with emojis and body parts
  const SENSE_INFO = {
    sight: {
      emoji: '&#128064;',      // Eyes
      bodyPart: 'eyes',
      verb: 'see'
    },
    hearing: {
      emoji: '&#128066;',      // Ear
      bodyPart: 'ears',
      verb: 'hear'
    },
    smell: {
      emoji: '&#128067;',      // Nose
      bodyPart: 'nose',
      verb: 'smell'
    },
    taste: {
      emoji: '&#128069;',      // Tongue
      bodyPart: 'tongue',
      verb: 'taste'
    },
    touch: {
      emoji: '&#9995;',        // Hand
      bodyPart: 'hands',
      verb: 'feel'
    }
  };

  // Items and which sense we primarily use for them
  const ITEMS = [
    // Sight items (things we see)
    { name: 'rainbow', sense: 'sight', icon: '&#127752;' },
    { name: 'stars', sense: 'sight', icon: '&#11088;' },
    { name: 'sunset', sense: 'sight', icon: '&#127751;' },
    { name: 'book', sense: 'sight', icon: '&#128214;' },
    { name: 'painting', sense: 'sight', icon: '&#127912;' },
    { name: 'fireworks', sense: 'sight', icon: '&#127878;' },
    { name: 'movie', sense: 'sight', icon: '&#127916;' },
    { name: 'butterfly', sense: 'sight', icon: '&#129419;' },

    // Hearing items (things we hear)
    { name: 'music', sense: 'hearing', icon: '&#127925;' },
    { name: 'bell', sense: 'hearing', icon: '&#128276;' },
    { name: 'thunder', sense: 'hearing', icon: '&#9889;' },
    { name: 'bird song', sense: 'hearing', icon: '&#128038;' },
    { name: 'drum', sense: 'hearing', icon: '&#129345;' },
    { name: 'whistle', sense: 'hearing', icon: '&#128251;' },
    { name: 'phone ring', sense: 'hearing', icon: '&#128222;' },
    { name: 'clapping', sense: 'hearing', icon: '&#128079;' },

    // Smell items (things we smell)
    { name: 'flower', sense: 'smell', icon: '&#127804;' },
    { name: 'perfume', sense: 'smell', icon: '&#129521;' },
    { name: 'fresh bread', sense: 'smell', icon: '&#127838;' },
    { name: 'coffee', sense: 'smell', icon: '&#9749;' },
    { name: 'cookies baking', sense: 'smell', icon: '&#127850;' },
    { name: 'rose', sense: 'smell', icon: '&#127801;' },
    { name: 'popcorn', sense: 'smell', icon: '&#127871;' },
    { name: 'garbage', sense: 'smell', icon: '&#128465;' },

    // Taste items (things we taste)
    { name: 'candy', sense: 'taste', icon: '&#127852;' },
    { name: 'lemon', sense: 'taste', icon: '&#127819;' },
    { name: 'ice cream', sense: 'taste', icon: '&#127846;' },
    { name: 'pizza', sense: 'taste', icon: '&#127829;' },
    { name: 'chocolate', sense: 'taste', icon: '&#127851;' },
    { name: 'apple', sense: 'taste', icon: '&#127822;' },
    { name: 'cookie', sense: 'taste', icon: '&#127850;' },
    { name: 'juice', sense: 'taste', icon: '&#129380;' },

    // Touch items (things we feel/touch)
    { name: 'ice cube', sense: 'touch', icon: '&#129482;' },
    { name: 'soft blanket', sense: 'touch', icon: '&#128716;' },
    { name: 'hot water', sense: 'touch', icon: '&#128167;' },
    { name: 'fuzzy teddy', sense: 'touch', icon: '&#129528;' },
    { name: 'sandpaper', sense: 'touch', icon: '&#128203;' },
    { name: 'cold snow', sense: 'touch', icon: '&#10052;' },
    { name: 'soft pillow', sense: 'touch', icon: '&#128716;' },
    { name: 'warm sunshine', sense: 'touch', icon: '&#9728;' }
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
    roundItems: [],
    isPlaying: false
  };

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    itemIcon: document.getElementById('item-icon'),
    itemName: document.getElementById('item-name'),
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
    card3d: document.getElementById('item-card')
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
      roundItems: selectRoundItems(),
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
    Speech.speak('Let\'s learn about the five senses!');
  }

  function selectRoundItems() {
    // Pick one item from each sense, shuffled
    const selected = [];
    const shuffledSenses = shuffleArray(SENSES);

    shuffledSenses.forEach(sense => {
      const senseItems = ITEMS.filter(item => item.sense === sense);
      const randomItem = senseItems[Math.floor(Math.random() * senseItems.length)];
      selected.push(randomItem);
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

    // Get current item
    const currentItem = gameState.roundItems[gameState.currentRound - 1];

    // Display item
    displayItem(currentItem);

    // Generate choices
    generateChoices(currentItem);

    // Clear feedback
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';

    // Speak the question
    setTimeout(() => {
      Speech.speak(`Which sense do you use for ${currentItem.name}?`);
    }, 500);
  }

  function displayItem(item) {
    elements.itemIcon.innerHTML = item.icon;
    elements.itemName.textContent = item.name;

    // Make the item name speakable (click to hear pronunciation)
    elements.itemName.classList.remove('speakable', 'speaking');
    makeSpeakable(elements.itemName, item.name);

    // Reset card animation
    elements.card3d.classList.remove('idle');
    elements.card3d.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // Restart idle animation after a moment
    setTimeout(() => {
      elements.card3d.classList.add('idle');
    }, 100);
  }

  function generateChoices(currentItem) {
    elements.choicesContainer.innerHTML = '';

    // Get correct answer and 2 wrong answers
    const correctSense = currentItem.sense;
    const wrongSenses = SENSES.filter(s => s !== correctSense);
    const selectedWrong = pickRandom(wrongSenses, 2);

    // Combine and shuffle
    const allChoices = shuffleArray([correctSense, ...selectedWrong]);

    // Create buttons with sense-specific styling
    allChoices.forEach(sense => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.sense = sense;

      const info = SENSE_INFO[sense];

      // Create text span with sense name
      const textSpan = document.createElement('span');
      const senseName = sense.charAt(0).toUpperCase() + sense.slice(1);
      textSpan.innerHTML = `${senseName} <span class="body-part">(${info.bodyPart})</span>`;

      // Add sense emoji
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'sense-emoji';
      emojiSpan.innerHTML = info.emoji;

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
        const utterance = new SpeechSynthesisUtterance(sense);
        utterance.voice = Speech.voice;
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        Speech.synth.speak(utterance);
      });

      btn.appendChild(textSpan);
      btn.appendChild(emojiSpan);
      btn.appendChild(speakIcon);
      btn.addEventListener('click', () => handleChoice(sense, currentItem, btn));
      elements.choicesContainer.appendChild(btn);
    });
  }

  function handleChoice(selectedSense, currentItem, buttonElement) {
    Audio.init();
    const isCorrect = selectedSense === currentItem.sense;

    // Disable all buttons temporarily
    const allButtons = elements.choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      handleCorrectAnswer(currentItem, buttonElement);
    } else {
      handleWrongAnswer(buttonElement, allButtons);
    }
  }

  function handleCorrectAnswer(currentItem, buttonElement) {
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
    const sense = currentItem.sense;
    const info = SENSE_INFO[sense];
    elements.feedback.innerHTML = `&#127881; Yes! You ${info.verb} ${currentItem.name} with your <strong>${info.bodyPart}</strong>!`;
    elements.feedback.className = 'feedback success';
    elements.feedback.classList.remove('hidden');

    // Celebrate animation
    elements.card3d.classList.add('celebrate');
    setTimeout(() => elements.card3d.classList.remove('celebrate'), 600);

    // Voice feedback
    Speech.speak(`Great job! You ${info.verb} ${currentItem.name} with your ${info.bodyPart}!`);

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
      const currentItem = gameState.roundItems[gameState.currentRound - 1];
      const info = SENSE_INFO[currentItem.sense];

      // Highlight correct answer
      allButtons.forEach(btn => {
        if (btn.dataset.sense === currentItem.sense) {
          btn.classList.add('correct');
        }
      });

      elements.feedback.innerHTML = `You ${info.verb} ${currentItem.name} with your <strong>${info.bodyPart}</strong>. Let's try another!`;
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak(`That's okay! You ${info.verb} ${currentItem.name} with your ${info.bodyPart}. Let's try another!`);

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
    Settings.setBestStars('senses', finalStarCount);

    // Show game complete screen
    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    // Set message based on performance
    const messages = [
      'Keep practicing! You\'ll get better!',
      'Good try! Keep learning!',
      'Great job! You know your senses!',
      'Amazing! You\'re a senses expert!'
    ];
    elements.finalMessage.textContent = messages[finalStarCount];

    // Play fanfare and speak
    Audio.playFanfare();
    setTimeout(() => {
      Speech.speak(`Wonderful! You got ${gameState.score} correct! ${messages[finalStarCount]}`);
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
