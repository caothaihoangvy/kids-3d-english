/* ============================================
   Materials Game - Kids 3D English
   Learn about: wood, paper, plastic, fabric, glass, metal
   ============================================ */

(function() {
  'use strict';

  // Get utilities from shared module
  const { Settings, Audio, Speech, setup3DCard, makeSpeakable, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // Game Data
  // ============================================

  const MATERIALS = ['wood', 'paper', 'plastic', 'fabric', 'glass', 'metal'];

  // Objects and their materials with icons
  const OBJECTS = [
    // Wood items
    { name: 'table', material: 'wood', icon: '&#128458;', hint: 'furniture' },
    { name: 'chair', material: 'wood', icon: '&#129681;', hint: 'sit on it' },
    { name: 'pencil', material: 'wood', icon: '&#9999;', hint: 'for writing' },
    { name: 'door', material: 'wood', icon: '&#128682;', hint: 'open it' },
    { name: 'tree', material: 'wood', icon: '&#127794;', hint: 'in nature' },

    // Paper items
    { name: 'book', material: 'paper', icon: '&#128214;', hint: 'read it' },
    { name: 'newspaper', material: 'paper', icon: '&#128240;', hint: 'news' },
    { name: 'notebook', material: 'paper', icon: '&#128211;', hint: 'write in it' },
    { name: 'card', material: 'paper', icon: '&#127912;', hint: 'greeting' },
    { name: 'box', material: 'paper', icon: '&#128230;', hint: 'cardboard' },

    // Plastic items
    { name: 'bottle', material: 'plastic', icon: '&#127866;', hint: 'drink from it' },
    { name: 'toy', material: 'plastic', icon: '&#129513;', hint: 'play with it' },
    { name: 'bucket', material: 'plastic', icon: '&#129717;', hint: 'carry water' },
    { name: 'ruler', material: 'plastic', icon: '&#128207;', hint: 'measure' },
    { name: 'straw', material: 'plastic', icon: '&#129380;', hint: 'drinking' },

    // Fabric items
    { name: 'shirt', material: 'fabric', icon: '&#128085;', hint: 'wear it' },
    { name: 'sock', material: 'fabric', icon: '&#129510;', hint: 'on your feet' },
    { name: 'blanket', material: 'fabric', icon: '&#128716;', hint: 'stay warm' },
    { name: 'hat', material: 'fabric', icon: '&#129506;', hint: 'on your head' },
    { name: 'towel', material: 'fabric', icon: '&#129531;', hint: 'dry off' },

    // Glass items
    { name: 'window', material: 'glass', icon: '&#129695;', hint: 'see through' },
    { name: 'mirror', material: 'glass', icon: '&#129689;', hint: 'see yourself' },
    { name: 'glasses', material: 'glass', icon: '&#128083;', hint: 'see better' },
    { name: 'vase', material: 'glass', icon: '&#127802;', hint: 'for flowers' },
    { name: 'jar', material: 'glass', icon: '&#129366;', hint: 'store food' },

    // Metal items
    { name: 'spoon', material: 'metal', icon: '&#129348;', hint: 'eat with it' },
    { name: 'key', material: 'metal', icon: '&#128273;', hint: 'unlock' },
    { name: 'coin', material: 'metal', icon: '&#129689;', hint: 'money' },
    { name: 'scissors', material: 'metal', icon: '&#9986;', hint: 'cut paper' },
    { name: 'fork', material: 'metal', icon: '&#127860;', hint: 'eat with it' }
  ];

  // ============================================
  // Game State
  // ============================================

  const TOTAL_ROUNDS = 6;

  let gameState = {
    currentRound: 0,
    score: 0,
    stars: 0,
    hasRetried: false,
    roundObjects: [],
    isPlaying: false
  };

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    objectIcon: document.getElementById('object-icon'),
    objectName: document.getElementById('object-name'),
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
    card3d: document.getElementById('object-card')
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
      roundObjects: selectRoundObjects(),
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
    Speech.speak('Let\'s learn about materials!');
  }

  function selectRoundObjects() {
    // Pick one object from each material, shuffled
    const selected = [];
    const shuffledMaterials = shuffleArray(MATERIALS);

    shuffledMaterials.forEach(material => {
      const materialObjects = OBJECTS.filter(obj => obj.material === material);
      const randomObj = materialObjects[Math.floor(Math.random() * materialObjects.length)];
      selected.push(randomObj);
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

    // Get current object
    const currentObject = gameState.roundObjects[gameState.currentRound - 1];

    // Display object
    displayObject(currentObject);

    // Generate choices
    generateChoices(currentObject);

    // Clear feedback
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';

    // Speak the question
    setTimeout(() => {
      Speech.speak(`What is this ${currentObject.name} made of?`);
    }, 500);
  }

  function displayObject(obj) {
    elements.objectIcon.innerHTML = obj.icon;
    elements.objectName.textContent = obj.name;

    // Make the object name speakable (click to hear pronunciation)
    // Remove old speakable class and re-add with new word
    elements.objectName.classList.remove('speakable', 'speaking');
    makeSpeakable(elements.objectName, obj.name);

    // Reset card animation
    elements.card3d.classList.remove('idle');
    elements.card3d.style.transform = 'rotateX(0deg) rotateY(0deg)';

    // Restart idle animation after a moment
    setTimeout(() => {
      elements.card3d.classList.add('idle');
    }, 100);
  }

  function generateChoices(currentObject) {
    elements.choicesContainer.innerHTML = '';

    // Get correct answer and 2 wrong answers
    const correctMaterial = currentObject.material;
    const wrongMaterials = MATERIALS.filter(m => m !== correctMaterial);
    const selectedWrong = pickRandom(wrongMaterials, 2);

    // Combine and shuffle
    const allChoices = shuffleArray([correctMaterial, ...selectedWrong]);

    // Create buttons
    allChoices.forEach(material => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.material = material;

      // Create text span
      const textSpan = document.createElement('span');
      textSpan.textContent = material.charAt(0).toUpperCase() + material.slice(1);

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
        const utterance = new SpeechSynthesisUtterance(material);
        utterance.voice = Speech.voice;
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        Speech.synth.speak(utterance);
      });

      btn.appendChild(textSpan);
      btn.appendChild(speakIcon);
      btn.addEventListener('click', () => handleChoice(material, currentObject, btn));
      elements.choicesContainer.appendChild(btn);
    });
  }

  function handleChoice(selectedMaterial, currentObject, buttonElement) {
    Audio.init();
    const isCorrect = selectedMaterial === currentObject.material;

    // Disable all buttons temporarily
    const allButtons = elements.choicesContainer.querySelectorAll('.choice-btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      handleCorrectAnswer(currentObject, buttonElement);
    } else {
      handleWrongAnswer(buttonElement, allButtons);
    }
  }

  function handleCorrectAnswer(currentObject, buttonElement) {
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
    const material = currentObject.material;
    elements.feedback.innerHTML = `&#127881; Great! This ${currentObject.name} is made of <strong>${material}</strong>!`;
    elements.feedback.className = 'feedback success';
    elements.feedback.classList.remove('hidden');

    // Celebrate animation
    elements.card3d.classList.add('celebrate');
    setTimeout(() => elements.card3d.classList.remove('celebrate'), 600);

    // Voice feedback
    Speech.speak(`Great job! This ${currentObject.name} is made of ${material}!`);

    // Next round after delay
    setTimeout(nextRound, 2500);
  }

  function handleWrongAnswer(buttonElement, allButtons) {
    buttonElement.classList.add('incorrect');
    Audio.playError();

    if (!gameState.hasRetried) {
      // First wrong attempt - allow retry
      gameState.hasRetried = true;

      elements.feedback.innerHTML = '&#128528; Oops! Try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak('Oops! Try again!');

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
      const currentObject = gameState.roundObjects[gameState.currentRound - 1];

      // Highlight correct answer
      allButtons.forEach(btn => {
        if (btn.dataset.material === currentObject.material) {
          btn.classList.add('correct');
        }
      });

      elements.feedback.innerHTML = `The ${currentObject.name} is made of <strong>${currentObject.material}</strong>. Let's try another!`;
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak(`That's okay! The ${currentObject.name} is made of ${currentObject.material}. Let's try another!`);

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
    Settings.setBestStars('materials', finalStarCount);

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
      'Great job! You\'re learning fast!',
      'Amazing! You\'re a materials expert!'
    ];
    elements.finalMessage.textContent = messages[finalStarCount];

    // Play fanfare and speak
    Audio.playFanfare();
    setTimeout(() => {
      Speech.speak(`Great job! You got ${gameState.score} correct! ${messages[finalStarCount]}`);
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
