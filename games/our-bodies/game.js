(function() {
  'use strict';

  const { Settings, Audio, Speech, setup3DCard, makeSpeakable, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // GAME DATA
  // ============================================

  // Body parts vocabulary with positions for highlighting
  const BODY_PARTS = [
    { name: 'eye', plural: 'eyes', icon: '👁️' },
    { name: 'nose', plural: 'noses', icon: '👃' },
    { name: 'mouth', plural: 'mouths', icon: '👄' },
    { name: 'ear', plural: 'ears', icon: '👂' },
    { name: 'shoulder', plural: 'shoulders', icon: '💪' },
    { name: 'elbow', plural: 'elbows', icon: '🦾' },
    { name: 'hand', plural: 'hands', icon: '✋' },
    { name: 'finger', plural: 'fingers', icon: '☝️' },
    { name: 'knee', plural: 'knees', icon: '🦵' },
    { name: 'foot', plural: 'feet', icon: '🦶' },
    { name: 'toe', plural: 'toes', icon: '🦶' },
    { name: 'tummy', plural: 'tummies', icon: '🫄' },
    { name: 'chest', plural: 'chests', icon: '🫁' },
    { name: 'hip', plural: 'hips', icon: '🧍' },
    { name: 'hair', plural: 'hair', icon: '💇' }
  ];

  // Required body parts for label rounds (rotate through these)
  const LABEL_BODY_PARTS = ['eye', 'nose', 'mouth', 'ear', 'shoulder', 'elbow', 'hand', 'knee', 'foot', 'tummy'];

  // Hurt body part scenarios (4 rounds)
  const HURT_SCENARIOS = [
    {
      caption: 'The boy next to girl A has hurt his ____.',
      answer: 'knee',
      options: ['foot', 'elbow', 'knee'],
      kidsSetup: [
        { label: 'A', gender: 'girl' },
        { label: 'B', gender: 'boy', hurt: 'knee' },
        { label: 'C', gender: 'girl' },
        { label: 'D', gender: 'boy' },
        { label: 'E', gender: 'girl' }
      ]
    },
    {
      caption: 'The girl between two boys has hurt her ____.',
      answer: 'hand',
      options: ['knee', 'foot', 'hand'],
      kidsSetup: [
        { label: 'A', gender: 'boy' },
        { label: 'B', gender: 'girl', hurt: 'hand' },
        { label: 'C', gender: 'boy' },
        { label: 'D', gender: 'girl' },
        { label: 'E', gender: 'boy' }
      ]
    },
    {
      caption: 'The last boy in the row has hurt his ____.',
      answer: 'elbow',
      options: ['finger', 'hand', 'elbow'],
      kidsSetup: [
        { label: 'A', gender: 'girl' },
        { label: 'B', gender: 'girl' },
        { label: 'C', gender: 'boy' },
        { label: 'D', gender: 'girl' },
        { label: 'E', gender: 'boy', hurt: 'elbow' }
      ]
    },
    {
      caption: 'Girl C has hurt her ____.',
      answer: 'foot',
      options: ['knee', 'foot', 'finger'],
      kidsSetup: [
        { label: 'A', gender: 'boy' },
        { label: 'B', gender: 'girl' },
        { label: 'C', gender: 'girl', hurt: 'foot' },
        { label: 'D', gender: 'boy' },
        { label: 'E', gender: 'girl' }
      ]
    }
  ];

  // Feet comparison data (bricks table)
  const FEET_DATA = {
    children: [
      { name: 'Anna', bricks: 8, isExample: true },
      { name: 'Bill', bricks: 6 },
      { name: 'Arun', bricks: 10 },
      { name: 'Fen', bricks: 7 }
    ],
    brickOptions: {
      Bill: [5, 6, 7],
      Arun: [9, 10, 11],
      Fen: [6, 7, 8]
    }
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
    labelPartsUsed: [],
    hurtScenariosUsed: [],
    bricksAnswers: {},
    compareAnswers: {}
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
  // SVG GENERATORS
  // ============================================

  function generateBodySVG(highlightPart) {
    // Simple front-view body outline with labeled parts
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
      hip: 'M 65,175 Q 55,185 60,195 M 115,175 Q 125,185 120,195',
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
      svg += `<path class="body-part" d="${partPaths[part]}" fill="#fce4ec" stroke="#555"/>`;
    });

    // Draw detail parts (may be highlighted)
    const detailParts = ['hair', 'eye', 'nose', 'mouth', 'ear', 'shoulder', 'elbow', 'hand', 'finger', 'knee', 'foot', 'toe', 'tummy', 'chest', 'hip'];
    detailParts.forEach(part => {
      if (partPaths[part]) {
        const isHighlight = part === highlightPart;
        svg += `<path class="body-part ${isHighlight ? 'highlight' : ''}" d="${partPaths[part]}" data-part="${part}"/>`;
      }
    });

    svg += `</svg>`;
    return svg;
  }

  function generateKidSVG(gender, isHurt) {
    const hairColor = gender === 'girl' ? '#8B4513' : '#2c2c2c';
    const shirtColor = gender === 'girl' ? '#E91E63' : '#2196F3';

    let svg = `<svg class="kid-svg" viewBox="0 0 50 65" xmlns="http://www.w3.org/2000/svg">`;

    // Hair
    if (gender === 'girl') {
      svg += `<ellipse cx="25" cy="15" rx="14" ry="12" fill="${hairColor}"/>`;
      svg += `<path d="M 12,18 Q 8,35 12,40" stroke="${hairColor}" stroke-width="4" fill="none"/>`;
      svg += `<path d="M 38,18 Q 42,35 38,40" stroke="${hairColor}" stroke-width="4" fill="none"/>`;
    } else {
      svg += `<ellipse cx="25" cy="12" rx="12" ry="8" fill="${hairColor}"/>`;
    }

    // Face
    svg += `<ellipse cx="25" cy="20" rx="10" ry="11" fill="#fce4ec"/>`;

    // Eyes
    svg += `<circle cx="21" cy="18" r="2" fill="#333"/>`;
    svg += `<circle cx="29" cy="18" r="2" fill="#333"/>`;

    // Smile (or frown if hurt)
    if (isHurt) {
      svg += `<path d="M 20,26 Q 25,23 30,26" stroke="#333" stroke-width="1.5" fill="none"/>`;
      // Tear
      svg += `<ellipse cx="32" cy="22" rx="1" ry="2" fill="#64b5f6"/>`;
    } else {
      svg += `<path d="M 20,25 Q 25,28 30,25" stroke="#333" stroke-width="1.5" fill="none"/>`;
    }

    // Body/shirt
    svg += `<rect x="15" y="32" width="20" height="20" rx="3" fill="${shirtColor}"/>`;

    // Arms
    svg += `<rect x="8" y="34" width="7" height="4" rx="2" fill="#fce4ec"/>`;
    svg += `<rect x="35" y="34" width="7" height="4" rx="2" fill="#fce4ec"/>`;

    // Legs
    svg += `<rect x="17" y="52" width="6" height="10" rx="2" fill="#555"/>`;
    svg += `<rect x="27" y="52" width="6" height="10" rx="2" fill="#555"/>`;

    svg += `</svg>`;
    return svg;
  }

  function generateFootprintSVG() {
    return `<svg viewBox="0 0 40 25" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="15" rx="12" ry="8" fill="#8d6e63"/>
      <circle cx="10" cy="6" r="3" fill="#8d6e63"/>
      <circle cx="16" cy="4" r="3" fill="#8d6e63"/>
      <circle cx="23" cy="4" r="3" fill="#8d6e63"/>
      <circle cx="29" cy="6" r="3" fill="#8d6e63"/>
      <circle cx="33" cy="10" r="2.5" fill="#8d6e63"/>
    </svg>`;
  }

  function generateBricksStack(count, showCount = true) {
    let html = '<div class="brick-stack">';
    for (let i = 0; i < count; i++) {
      html += '<div class="brick"></div>';
    }
    html += '</div>';
    if (showCount) {
      html += `<div class="brick-count">${count}</div>`;
    }
    return html;
  }

  // ============================================
  // GAME LOGIC
  // ============================================

  function startGame() {
    gameState.currentRound = 0;
    gameState.score = 0;
    gameState.hasRetried = false;
    gameState.isPlaying = true;
    gameState.labelPartsUsed = [];
    gameState.hurtScenariosUsed = [];
    gameState.bricksAnswers = {};
    gameState.compareAnswers = {};

    // Create round sequence: 4 label + 4 hurt + 2 bricks
    // Shuffle label parts and hurt scenarios
    const shuffledLabelParts = shuffleArray([...LABEL_BODY_PARTS]).slice(0, 4);
    const shuffledHurtScenarios = shuffleArray([...HURT_SCENARIOS]).slice(0, 4);

    gameState.roundSequence = [
      ...shuffledLabelParts.map(part => ({ type: 'label', data: part })),
      ...shuffledHurtScenarios.map((scenario, i) => ({ type: 'hurt', data: scenario, index: i })),
      { type: 'bricks_fill' },
      { type: 'bricks_compare' }
    ];

    // Shuffle the first 8 rounds (label + hurt mixed)
    const first8 = shuffleArray(gameState.roundSequence.slice(0, 8));
    gameState.roundSequence = [...first8, ...gameState.roundSequence.slice(8)];

    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');

    updateStarsDisplay();
    nextRound();

    Speech.speak("Let's learn about our bodies!");
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

    const roundInfo = gameState.roundSequence[gameState.currentRound - 1];

    switch (roundInfo.type) {
      case 'label':
        displayLabelRound(roundInfo.data);
        break;
      case 'hurt':
        displayHurtRound(roundInfo.data);
        break;
      case 'bricks_fill':
        displayBricksFillRound();
        break;
      case 'bricks_compare':
        displayBricksCompareRound();
        break;
    }
  }

  // ============================================
  // ROUND TYPE A: Label the Body
  // ============================================

  function displayLabelRound(bodyPart) {
    const partInfo = BODY_PARTS.find(p => p.name === bodyPart);

    // Generate body with highlighted part
    const bodyHTML = `
      <div class="body-card-container">
        <div class="body-card" id="body-card">
          <div class="body-card-face">
            ${generateBodySVG(bodyPart)}
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
      `Tap the ${bodyPart}.`,
      `Where is the ${bodyPart}?`,
      `Find the ${bodyPart}!`
    ];
    const questionText = questions[Math.floor(Math.random() * questions.length)];
    elements.question.textContent = questionText;

    // Generate choices (correct + 2 wrong)
    const otherParts = BODY_PARTS.filter(p => p.name !== bodyPart);
    const wrongParts = pickRandom(otherParts, 2);
    const choices = shuffleArray([partInfo, ...wrongParts]);

    elements.choicesContainer.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.name;
      btn.dataset.answer = choice.name;
      btn.addEventListener('click', () => handleLabelChoice(btn, bodyPart));
      elements.choicesContainer.appendChild(btn);
    });

    // Speak the question
    setTimeout(() => Speech.speak(questionText), 300);
  }

  function handleLabelChoice(button, correctAnswer) {
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
  // ROUND TYPE B: Hurt Body Part
  // ============================================

  function displayHurtRound(scenario) {
    // Generate kids row
    let kidsHTML = '<div class="scene-container"><div class="kids-row">';
    scenario.kidsSetup.forEach(kid => {
      kidsHTML += `
        <div class="kid-figure">
          <div class="kid-label">${kid.label}</div>
          ${generateKidSVG(kid.gender, kid.hurt)}
        </div>
      `;
    });
    kidsHTML += '</div>';
    kidsHTML += `<div class="scene-caption">${scenario.caption}</div>`;
    kidsHTML += '</div>';

    elements.roundContent.innerHTML = kidsHTML;
    elements.question.textContent = 'Which body part is hurt?';

    // Generate choices
    const choices = shuffleArray([...scenario.options]);
    elements.choicesContainer.innerHTML = '';
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.dataset.answer = choice;
      btn.addEventListener('click', () => handleHurtChoice(btn, scenario.answer));
      elements.choicesContainer.appendChild(btn);
    });

    // Speak the caption
    setTimeout(() => Speech.speak(scenario.caption), 300);
  }

  function handleHurtChoice(button, correctAnswer) {
    const selectedAnswer = button.dataset.answer;
    const allButtons = elements.choicesContainer.querySelectorAll('.choice-btn');

    if (selectedAnswer === correctAnswer) {
      button.classList.add('correct');
      allButtons.forEach(btn => btn.disabled = true);

      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;

      Audio.playSuccess();

      const hurtKid = 'he';
      elements.feedback.textContent = `Yes! ${hurtKid} hurt ${hurtKid === 'he' ? 'his' : 'her'} ${correctAnswer}!`;
      elements.feedback.className = 'feedback success';
      elements.feedback.classList.remove('hidden');

      Speech.speak(`Yes! He hurt his ${correctAnswer}!`);

      setTimeout(() => {
        updateStarsDisplay();
        nextRound();
      }, 2000);
    } else {
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
  // ROUND TYPE C: Feet Comparison (Bricks)
  // ============================================

  function displayBricksFillRound() {
    let html = '<div class="bricks-container">';
    html += '<h3 style="text-align:center; color:#2e7d32; margin-bottom:15px;">How many bricks tall are their feet?</h3>';
    html += '<div class="bricks-table">';

    FEET_DATA.children.forEach(child => {
      html += `<div class="brick-column">`;
      html += `<div class="child-name">${child.name}</div>`;
      html += `<div class="foot-icon">${generateFootprintSVG()}</div>`;
      html += generateBricksStack(child.bricks, child.isExample);

      if (!child.isExample) {
        html += `<div class="brick-input" data-child="${child.name}">`;
        FEET_DATA.brickOptions[child.name].forEach(opt => {
          html += `<button class="brick-choice" data-value="${opt}">${opt}</button>`;
        });
        html += '</div>';
      }
      html += '</div>';
    });

    html += '</div>';
    html += '<button class="submit-compare-btn" id="submit-bricks" disabled>Check Answers</button>';
    html += '</div>';

    elements.roundContent.innerHTML = html;
    elements.question.textContent = 'Fill in the gaps: How many bricks for each child?';
    elements.choicesContainer.innerHTML = '';

    // Setup brick choice buttons
    document.querySelectorAll('.brick-input').forEach(inputDiv => {
      const childName = inputDiv.dataset.child;
      const buttons = inputDiv.querySelectorAll('.brick-choice');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          gameState.bricksAnswers[childName] = parseInt(btn.dataset.value);
          checkBricksFilled();
        });
      });
    });

    document.getElementById('submit-bricks').addEventListener('click', handleBricksSubmit);

    Speech.speak('Fill in the gaps. How many bricks for each child?');
  }

  function checkBricksFilled() {
    const nonExampleChildren = FEET_DATA.children.filter(c => !c.isExample);
    const allFilled = nonExampleChildren.every(c => gameState.bricksAnswers[c.name] !== undefined);
    document.getElementById('submit-bricks').disabled = !allFilled;
  }

  function handleBricksSubmit() {
    const nonExampleChildren = FEET_DATA.children.filter(c => !c.isExample);
    let allCorrect = true;

    nonExampleChildren.forEach(child => {
      const inputDiv = document.querySelector(`.brick-input[data-child="${child.name}"]`);
      const selectedBtn = inputDiv.querySelector('.brick-choice.selected');
      const isCorrect = gameState.bricksAnswers[child.name] === child.bricks;

      if (isCorrect) {
        selectedBtn.classList.add('correct');
      } else {
        selectedBtn.classList.add('incorrect');
        allCorrect = false;
        // Show correct answer
        inputDiv.querySelectorAll('.brick-choice').forEach(btn => {
          if (parseInt(btn.dataset.value) === child.bricks) {
            btn.classList.add('correct');
          }
        });
      }
      inputDiv.querySelectorAll('.brick-choice').forEach(btn => btn.disabled = true);
    });

    document.getElementById('submit-bricks').disabled = true;

    if (allCorrect) {
      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;
      Audio.playSuccess();
      elements.feedback.textContent = 'Great job! All correct!';
      elements.feedback.className = 'feedback success';
      Speech.speak('Great job! All correct!');
    } else if (!gameState.hasRetried) {
      gameState.hasRetried = true;
      Audio.playError();
      elements.feedback.textContent = 'Some answers are wrong. Look at the correct ones!';
      elements.feedback.className = 'feedback error';
      Speech.speak('Some answers are wrong. Look at the correct ones!');
    } else {
      Audio.playError();
      elements.feedback.textContent = 'Check the correct answers above.';
      elements.feedback.className = 'feedback error';
      Speech.speak('Check the correct answers above.');
    }

    elements.feedback.classList.remove('hidden');

    setTimeout(() => {
      updateStarsDisplay();
      nextRound();
    }, 2500);
  }

  function displayBricksCompareRound() {
    // Show the table again with all answers
    let html = '<div class="bricks-container">';
    html += '<h3 style="text-align:center; color:#2e7d32; margin-bottom:15px;">Compare the feet!</h3>';
    html += '<div class="bricks-table">';

    FEET_DATA.children.forEach(child => {
      html += `<div class="brick-column">`;
      html += `<div class="child-name">${child.name}</div>`;
      html += `<div class="foot-icon">${generateFootprintSVG()}</div>`;
      html += generateBricksStack(child.bricks, true);
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';

    html += '<div class="compare-questions">';
    html += `
      <div class="compare-question" id="q-longest">
        <p>Who has the LONGEST feet?</p>
        <div class="compare-choices">
          ${FEET_DATA.children.map(c => `<button class="compare-btn" data-answer="${c.name}">${c.name}</button>`).join('')}
        </div>
      </div>
      <div class="compare-question" id="q-shortest">
        <p>Who has the SHORTEST feet?</p>
        <div class="compare-choices">
          ${FEET_DATA.children.map(c => `<button class="compare-btn" data-answer="${c.name}">${c.name}</button>`).join('')}
        </div>
      </div>
    `;
    html += '</div>';
    html += '<button class="submit-compare-btn" id="submit-compare" disabled>Check Answers</button>';

    elements.roundContent.innerHTML = html;
    elements.question.textContent = 'Answer the comparison questions!';
    elements.choicesContainer.innerHTML = '';

    // Setup compare buttons
    ['longest', 'shortest'].forEach(qType => {
      const qDiv = document.getElementById(`q-${qType}`);
      const buttons = qDiv.querySelectorAll('.compare-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          gameState.compareAnswers[qType] = btn.dataset.answer;
          checkCompareFilled();
        });
      });
    });

    document.getElementById('submit-compare').addEventListener('click', handleCompareSubmit);

    Speech.speak('Who has the longest feet? Who has the shortest feet?');
  }

  function checkCompareFilled() {
    const allFilled = gameState.compareAnswers.longest && gameState.compareAnswers.shortest;
    document.getElementById('submit-compare').disabled = !allFilled;
  }

  function handleCompareSubmit() {
    // Find correct answers
    const sortedByBricks = [...FEET_DATA.children].sort((a, b) => b.bricks - a.bricks);
    const correctLongest = sortedByBricks[0].name;
    const correctShortest = sortedByBricks[sortedByBricks.length - 1].name;

    let allCorrect = true;

    // Check longest
    const longestDiv = document.getElementById('q-longest');
    const longestSelected = longestDiv.querySelector('.compare-btn.selected');
    if (gameState.compareAnswers.longest === correctLongest) {
      longestSelected.classList.add('correct');
    } else {
      longestSelected.classList.add('incorrect');
      allCorrect = false;
      longestDiv.querySelectorAll('.compare-btn').forEach(btn => {
        if (btn.dataset.answer === correctLongest) btn.classList.add('correct');
      });
    }

    // Check shortest
    const shortestDiv = document.getElementById('q-shortest');
    const shortestSelected = shortestDiv.querySelector('.compare-btn.selected');
    if (gameState.compareAnswers.shortest === correctShortest) {
      shortestSelected.classList.add('correct');
    } else {
      shortestSelected.classList.add('incorrect');
      allCorrect = false;
      shortestDiv.querySelectorAll('.compare-btn').forEach(btn => {
        if (btn.dataset.answer === correctShortest) btn.classList.add('correct');
      });
    }

    document.querySelectorAll('.compare-btn').forEach(btn => btn.disabled = true);
    document.getElementById('submit-compare').disabled = true;

    if (allCorrect) {
      const points = gameState.hasRetried ? 0.5 : 1;
      gameState.score += points;
      Audio.playSuccess();
      elements.feedback.textContent = `Correct! ${correctLongest} has the longest and ${correctShortest} has the shortest!`;
      elements.feedback.className = 'feedback success';
      Speech.speak(`Correct! ${correctLongest} has the longest feet and ${correctShortest} has the shortest!`);
    } else if (!gameState.hasRetried) {
      gameState.hasRetried = true;
      Audio.playError();
      elements.feedback.textContent = 'Not quite right. Check the answers!';
      elements.feedback.className = 'feedback error';
      Speech.speak('Not quite right. Check the answers!');
    } else {
      Audio.playError();
      elements.feedback.textContent = `${correctLongest} has the longest, ${correctShortest} has the shortest.`;
      elements.feedback.className = 'feedback error';
      Speech.speak(`${correctLongest} has the longest feet, ${correctShortest} has the shortest.`);
    }

    elements.feedback.classList.remove('hidden');

    setTimeout(() => {
      updateStarsDisplay();
      nextRound();
    }, 3000);
  }

  // ============================================
  // SCORING & END GAME
  // ============================================

  function updateStarsDisplay() {
    // Calculate stars based on score: max 10 points
    // 3 stars >= 8, 2 stars >= 6, 1 star >= 4, 0 otherwise
    let displayStars;
    if (gameState.score >= 8) displayStars = 3;
    else if (gameState.score >= 6) displayStars = 2;
    else if (gameState.score >= 4) displayStars = 1;
    else displayStars = 0;

    elements.currentStars.innerHTML = renderStars(displayStars);
  }

  function endGame() {
    gameState.isPlaying = false;

    // Calculate final stars
    let finalStarCount;
    if (gameState.score >= 8) finalStarCount = 3;
    else if (gameState.score >= 6) finalStarCount = 2;
    else if (gameState.score >= 4) finalStarCount = 1;
    else finalStarCount = 0;

    // Save best stars
    Settings.setBestStars('our_bodies', finalStarCount);

    // Update UI
    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStarCount);
    elements.finalScore.textContent = gameState.score;
    elements.finalTotal.textContent = TOTAL_ROUNDS;

    // Message based on performance
    const messages = {
      3: "Amazing! You're a body parts expert!",
      2: "Great job learning body parts!",
      1: "Good try! Keep practicing!",
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
