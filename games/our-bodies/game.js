(function() {
  'use strict';

  const { Settings, Audio, Speech, setup3DCard, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA - Body Parts Vocabulary
  // ============================================

  const BODY_PARTS = [
    { name: 'eye', icon: '👁️' },
    { name: 'nose', icon: '👃' },
    { name: 'mouth', icon: '👄' },
    { name: 'ear', icon: '👂' },
    { name: 'shoulder', icon: '💪' },
    { name: 'elbow', icon: '🦾' },
    { name: 'hand', icon: '✋' },
    { name: 'finger', icon: '☝️' },
    { name: 'knee', icon: '🦵' },
    { name: 'foot', icon: '🦶' },
    { name: 'toe', icon: '🦶' },
    { name: 'tummy', icon: '🫄' },
    { name: 'chest', icon: '🫁' },
    { name: 'hair', icon: '💇' },
    { name: 'head', icon: '🗣️' }
  ];

  // ============================================
  // GAME STATE
  // ============================================

  const TOTAL_ROUNDS = 10;
  let gameState = {
    currentRound: 0,
    score: 0,
    hasRetried: false,
    roundParts: [],
    isPlaying: false
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
    roundContent: document.getElementById('round-content'),
    question: document.getElementById('question'),
    choicesContainer: document.getElementById('choices-container'),
    feedback: document.getElementById('feedback'),
    finalStars: document.getElementById('final-stars'),
    finalScore: document.getElementById('final-score'),
    finalTotal: document.getElementById('final-total'),
    finalMessage: document.getElementById('final-message'),
    playAgainBtn: document.getElementById('play-again-btn'),
    wordBankBtn: document.getElementById('word-bank-btn'),
    wordBankModal: document.getElementById('word-bank-modal'),
    wordBankList: document.getElementById('word-bank-list'),
    wordBankClose: document.getElementById('word-bank-close')
  };

  // ============================================
  // SVG BODY GENERATOR
  // ============================================

  function generateBodySVG(highlightPart) {
    const partPaths = {
      hair: 'M 75,25 Q 55,15 55,35 Q 55,20 90,20 Q 125,20 125,35 Q 125,15 105,25',
      head: 'M 90,20 Q 60,20 60,50 Q 60,75 90,75 Q 120,75 120,50 Q 120,20 90,20',
      eye: 'M 75,42 Q 70,40 75,45 Q 80,40 75,42 M 105,42 Q 100,40 105,45 Q 110,40 105,42',
      nose: 'M 90,50 L 87,58 Q 90,62 93,58 Z',
      mouth: 'M 80,65 Q 90,72 100,65',
      ear: 'M 58,45 Q 52,45 52,55 Q 52,65 58,65 M 122,45 Q 128,45 128,55 Q 128,65 122,65',
      chest: 'M 65,80 L 115,80 L 120,130 L 60,130 Z',
      tummy: 'M 62,130 L 118,130 L 115,175 L 65,175 Z',
      shoulder: 'M 55,85 Q 40,85 35,95 Q 35,105 45,105 M 125,85 Q 140,85 145,95 Q 145,105 135,105',
      elbow: 'M 30,130 Q 25,130 25,140 Q 25,150 30,150 M 150,130 Q 155,130 155,140 Q 155,150 150,150',
      hand: 'M 20,175 Q 10,175 10,185 Q 10,195 25,195 Q 35,195 35,185 Q 35,175 25,175 M 160,175 Q 150,175 150,185 Q 150,195 165,195 Q 175,195 175,185 Q 175,175 165,175',
      finger: 'M 12,188 L 5,195 M 18,192 L 12,202 M 24,193 L 22,205 M 168,188 L 175,195 M 162,192 L 168,202 M 156,193 L 158,205',
      knee: 'M 68,225 Q 63,230 68,240 Q 73,230 68,225 M 112,225 Q 107,230 112,240 Q 117,230 112,225',
      foot: 'M 58,275 Q 50,275 50,280 Q 50,288 70,288 Q 80,288 80,280 Q 80,275 72,275 Z M 108,275 Q 100,275 100,280 Q 100,288 120,288 Q 130,288 130,280 Q 130,275 122,275 Z',
      toe: 'M 52,285 L 50,290 M 58,286 L 57,292 M 64,287 L 64,293 M 118,285 L 120,290 M 112,286 L 113,292 M 106,287 L 106,293',
      leftArm: 'M 55,105 Q 35,120 30,160 Q 25,175 25,185',
      rightArm: 'M 125,105 Q 145,120 150,160 Q 155,175 155,185',
      leftLeg: 'M 70,195 L 65,225 L 65,275',
      rightLeg: 'M 110,195 L 115,225 L 115,275'
    };

    let svg = `<svg class="body-svg" viewBox="0 0 180 295" xmlns="http://www.w3.org/2000/svg">`;

    // Draw body outline parts
    const outlineParts = ['head', 'chest', 'tummy', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
    outlineParts.forEach(part => {
      const isHighlight = part === highlightPart;
      svg += `<path class="body-part ${isHighlight ? 'highlight' : ''}" d="${partPaths[part]}" fill="#fce4ec" stroke="#555"/>`;
    });

    // Draw detail parts (may be highlighted)
    const detailParts = ['hair', 'eye', 'nose', 'mouth', 'ear', 'shoulder', 'elbow', 'hand', 'finger', 'knee', 'foot', 'toe'];
    detailParts.forEach(part => {
      if (partPaths[part]) {
        const isHighlight = part === highlightPart;
        svg += `<path class="body-part ${isHighlight ? 'highlight' : ''}" d="${partPaths[part]}" data-part="${part}"/>`;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  // ============================================
  // GAME LOGIC
  // ============================================

  function startGame() {
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.hasRetried = false;
    gameState.isPlaying = true;

    // Select 10 random body parts for this session
    gameState.roundParts = shuffleArray([...BODY_PARTS]).slice(0, TOTAL_ROUNDS);

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn body parts!");
  }

  function nextRound() {
    gameState.currentRound++;
    gameState.hasRetried = false;

    if (gameState.currentRound > TOTAL_ROUNDS) {
      endGame();
      return;
    }

    elements.currentRound.textContent = gameState.currentRound;
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';

    const currentPart = gameState.roundParts[gameState.currentRound - 1];
    displayBodyPart(currentPart);
  }

  function displayBodyPart(part) {
    // Generate body with highlighted part
    const bodyHTML = `
      <div class="body-card-container">
        <div class="body-card" id="body-card">
          <div class="body-card-face">
            ${generateBodySVG(part.name)}
          </div>
        </div>
      </div>
    `;
    elements.roundContent.innerHTML = bodyHTML;

    // Setup 3D card interaction
    const bodyCard = document.getElementById('body-card');
    setup3DCard(bodyCard);

    // Generate question
    const questions = [
      'What body part is this?',
      'What is the yellow part called?',
      'Can you name this body part?'
    ];
    const questionText = questions[Math.floor(Math.random() * questions.length)];
    elements.question.textContent = questionText;

    // Generate choices (correct + 2 wrong)
    const otherParts = BODY_PARTS.filter(p => p.name !== part.name);
    const wrongParts = pickRandom(otherParts, 2);
    const choices = shuffleArray([part, ...wrongParts]);

    elements.choicesContainer.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span style="font-size:1.5rem">${choice.icon}</span> ${choice.name}`;
      btn.dataset.answer = choice.name;
      btn.addEventListener('click', () => handleChoice(btn, part.name));
      elements.choicesContainer.appendChild(btn);
    });

    // Speak the question
    setTimeout(() => Speech.speak(questionText), 300);
  }

  function handleChoice(button, correctAnswer) {
    const selectedAnswer = button.dataset.answer;
    const allButtons = elements.choicesContainer.querySelectorAll('.choice-btn');
    const bodyCard = document.getElementById('body-card');

    if (selectedAnswer === correctAnswer) {
      // Correct!
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();
      if (bodyCard) bodyCard.classList.add('celebrate');

      elements.feedback.textContent = `Yes! That's the ${correctAnswer}!`;
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');

      Speech.speak(`Yes! That's the ${correctAnswer}!`);

      setTimeout(() => {
        if (bodyCard) bodyCard.classList.remove('celebrate');
        updateStarsDisplay();
        nextRound();
      }, 2000);
    } else {
      // Wrong
      button.classList.add('incorrect');
      Audio.playError();

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
        }, 1000);
      } else {
        // Show correct answer
        allButtons.forEach(btn => {
          btn.disabled = true;
          if (btn.dataset.answer === correctAnswer) {
            btn.classList.add('correct');
          }
        });

        elements.feedback.textContent = `The answer is ${correctAnswer}.`;
        elements.feedback.className = 'feedback error';
        elements.feedback.classList.remove('hidden');
        Speech.speak(`The answer is ${correctAnswer}.`);

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

    Settings.setBestStars('our_bodies', finalStarCount);

    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    const messages = {
      3: "Amazing! You know all the body parts!",
      2: "Great job learning body parts!",
      1: "Good try! Keep practicing!",
      0: "Nice effort! Try again!"
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
    elements.wordBankList.innerHTML = '';
    BODY_PARTS.forEach(part => {
      const item = document.createElement('div');
      item.className = 'word-bank-item';
      item.innerHTML = `<span style="font-size:1.5rem">${part.icon}</span> <span>${part.name}</span>`;
      item.addEventListener('click', () => {
        Speech.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(part.name);
        utterance.voice = Speech.voice;
        utterance.rate = 0.75;
        utterance.pitch = 1.1;
        Speech.synth.speak(utterance);
        Audio.playClick();
      });
      elements.wordBankList.appendChild(item);
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
