/* ============================================
   Positions Game - Kids 3D English
   Learn: Ordinal numbers (1st-10th) + Left/Right

   Round Types:
   A) Reading + Multiple Choice (3 rounds)
   B) Unscramble sentence (3 rounds)
   C) Left/Right ordinal selection (2 rounds)
   ============================================ */

(function() {
  'use strict';

  // Get utilities from shared module
  const { Settings, Audio, Speech, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // ============================================
  // Game Data
  // ============================================

  // Ordinal words reference
  const ORDINALS = {
    1: { word: 'first', short: '1st' },
    2: { word: 'second', short: '2nd' },
    3: { word: 'third', short: '3rd' },
    4: { word: 'fourth', short: '4th' },
    5: { word: 'fifth', short: '5th' },
    6: { word: 'sixth', short: '6th' },
    7: { word: 'seventh', short: '7th' },
    8: { word: 'eighth', short: '8th' },
    9: { word: 'ninth', short: '9th' },
    10: { word: 'tenth', short: '10th' }
  };

  // ========================
  // SECTION A: Reading Stories
  // ========================
  const READING_ROUNDS = [
    {
      story: `Tommy has a birthday party. The <span class="ordinal">first</span> friend to arrive is Anna. The <span class="ordinal">second</span> friend is Ben. Clara comes in <span class="ordinal">third</span>.`,
      question: 'Who is the first friend to arrive?',
      options: ['Anna', 'Ben', 'Clara'],
      answer: 'Anna'
    },
    {
      story: `There is a race at school. Emma finishes <span class="ordinal">first</span>. Jake comes <span class="ordinal">second</span>. Lily is <span class="ordinal">third</span>, and Max is <span class="ordinal">fourth</span>.`,
      question: 'Who finishes second in the race?',
      options: ['Emma', 'Jake', 'Max'],
      answer: 'Jake'
    },
    {
      story: `Mom bakes cookies. She puts the <span class="ordinal">first</span> batch on a blue plate. The <span class="ordinal">second</span> batch goes on a red plate. The <span class="ordinal">third</span> batch is for Dad.`,
      question: 'Which batch goes on a red plate?',
      options: ['First', 'Second', 'Third'],
      answer: 'Second'
    },
    {
      story: `Five ducks swim in the pond. The <span class="ordinal">first</span> duck is white. The <span class="ordinal">second</span> and <span class="ordinal">third</span> ducks are brown. The <span class="ordinal">fourth</span> duck is yellow.`,
      question: 'What color is the fourth duck?',
      options: ['White', 'Brown', 'Yellow'],
      answer: 'Yellow'
    },
    {
      story: `The bus makes many stops. At the <span class="ordinal">first</span> stop, Mia gets on. At the <span class="ordinal">third</span> stop, Sam gets on. At the <span class="ordinal">fifth</span> stop, they both get off.`,
      question: 'At which stop does Sam get on?',
      options: ['First', 'Third', 'Fifth'],
      answer: 'Third'
    }
  ];

  // ========================
  // SECTION B: Unscramble Sentences
  // ========================
  const UNSCRAMBLE_ROUNDS = [
    {
      scrambled: ['is', 'Ben', 'the', 'playing', 'saxophone'],
      correct: 'Ben is playing the saxophone.'
    },
    {
      scrambled: ['the', 'like', 'I', 'of', 'smell', 'mangoes'],
      correct: 'I like the smell of mangoes.'
    },
    {
      scrambled: ['like', 'you', 'Do', 'the', 'of', 'smell', 'fish', '?'],
      correct: 'Do you like the smell of fish?'
    },
    {
      scrambled: ['tastes', 'The', 'very', 'cake', 'sweet'],
      correct: 'The cake tastes very sweet.'
    },
    {
      scrambled: ['flowers', 'smell', 'The', 'so', 'nice'],
      correct: 'The flowers smell so nice.'
    },
    {
      scrambled: ['is', 'This', 'my', 'food', 'favorite'],
      correct: 'This is my favorite food.'
    }
  ];

  // ========================
  // SECTION C: Left/Right Selection
  // Icons using emoji/symbols
  // ========================
  const ROW_ICONS = {
    teddy: '&#129528;',   // Teddy bear
    fan: '&#127744;',     // Cyclone/fan
    tree: '&#127794;',    // Tree
    star: '&#11088;',     // Star
    heart: '&#10084;',    // Heart
    flower: '&#127804;',  // Flower
    apple: '&#127822;',   // Apple
    ball: '&#9917;'       // Soccer ball
  };

  const LEFTRIGHT_ROUNDS = [
    {
      items: ['teddy', 'fan', 'tree', 'fan', 'star', 'teddy', 'fan', 'tree'],
      direction: 'left',    // Count from left to right
      targetType: 'fan',
      targetPosition: 1,    // 1st fan from left
      markStyle: 'square',
      instruction: 'From left to right, tap the 1st fan.'
    },
    {
      items: ['star', 'flower', 'apple', 'flower', 'ball', 'flower', 'star'],
      direction: 'right',   // Count from right to left
      targetType: 'flower',
      targetPosition: 2,    // 2nd flower from right
      markStyle: 'circle',
      instruction: 'From right to left, tap the 2nd flower.'
    },
    {
      items: ['tree', 'heart', 'tree', 'apple', 'tree', 'ball', 'tree', 'star'],
      direction: 'right',
      targetType: 'tree',
      targetPosition: 3,    // 3rd tree from right
      markStyle: 'x',
      instruction: 'From right to left, tap the 3rd tree.'
    },
    {
      items: ['ball', 'teddy', 'ball', 'teddy', 'ball', 'teddy'],
      direction: 'left',
      targetType: 'teddy',
      targetPosition: 2,
      markStyle: 'circle',
      instruction: 'From left to right, tap the 2nd teddy bear.'
    }
  ];

  // ============================================
  // Game State
  // ============================================

  const TOTAL_ROUNDS = 8;

  let gameState = {
    currentRound: 0,
    points: 0,
    hasRetried: false,
    roundSequence: [],  // Array of {type, data}
    isPlaying: false,
    // For unscramble
    selectedWords: [],
    // For left/right
    rowRotateX: 0,
    rowRotateY: 0
  };

  // ============================================
  // DOM Elements
  // ============================================

  const elements = {
    roundContent: document.getElementById('round-content'),
    roundType: document.getElementById('round-type'),
    feedback: document.getElementById('feedback'),
    currentRound: document.getElementById('current-round'),
    totalRounds: document.getElementById('total-rounds'),
    currentStars: document.getElementById('current-stars'),
    gameArea: document.getElementById('game-area'),
    gameComplete: document.getElementById('game-complete'),
    finalStars: document.getElementById('final-stars'),
    finalPoints: document.getElementById('final-points'),
    finalMessage: document.getElementById('final-message'),
    playAgainBtn: document.getElementById('play-again-btn')
  };

  // ============================================
  // Game Logic
  // ============================================

  function startGame() {
    // Reset state
    gameState = {
      currentRound: 0,
      points: 0,
      hasRetried: false,
      roundSequence: buildRoundSequence(),
      isPlaying: true,
      selectedWords: [],
      rowRotateX: 0,
      rowRotateY: 0
    };

    // Update UI
    elements.totalRounds.textContent = TOTAL_ROUNDS;
    elements.gameArea.classList.remove('hidden');
    elements.gameComplete.classList.add('hidden');
    updateStarsDisplay();

    // Start first round
    nextRound();

    // Welcome voice
    Speech.speak('Let\'s learn about positions!');
  }

  function buildRoundSequence() {
    // 3 Reading, 3 Unscramble, 2 Left/Right
    const sequence = [];

    // Pick 3 random reading rounds
    const readingPicks = pickRandom(READING_ROUNDS, 3);
    readingPicks.forEach(data => {
      sequence.push({ type: 'reading', data });
    });

    // Pick 3 random unscramble rounds
    const unscramblePicks = pickRandom(UNSCRAMBLE_ROUNDS, 3);
    unscramblePicks.forEach(data => {
      sequence.push({ type: 'unscramble', data });
    });

    // Pick 2 random left/right rounds
    const leftrightPicks = pickRandom(LEFTRIGHT_ROUNDS, 2);
    leftrightPicks.forEach(data => {
      sequence.push({ type: 'leftright', data });
    });

    // Shuffle all rounds
    return shuffleArray(sequence);
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

    // Clear feedback
    elements.feedback.classList.add('hidden');
    elements.feedback.className = 'feedback hidden';

    // Get current round data
    const round = gameState.roundSequence[gameState.currentRound - 1];

    // Render based on type
    switch (round.type) {
      case 'reading':
        renderReadingRound(round.data);
        break;
      case 'unscramble':
        renderUnscrambleRound(round.data);
        break;
      case 'leftright':
        renderLeftRightRound(round.data);
        break;
    }
  }

  // ========================
  // SECTION A: Reading Round
  // ========================

  function renderReadingRound(data) {
    elements.roundType.textContent = '📖 Reading Story';

    let html = `
      <div class="story-box">${data.story}</div>
      <div class="question-text">${data.question}</div>
      <div class="mc-choices">
    `;

    const letters = ['A', 'B', 'C'];
    const shuffledOptions = shuffleArray([...data.options]);

    shuffledOptions.forEach((option, i) => {
      html += `
        <button class="mc-btn" data-answer="${option}">
          <span class="option-letter">${letters[i]}</span>
          <span>${option}</span>
        </button>
      `;
    });

    html += '</div>';
    elements.roundContent.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.mc-btn').forEach(btn => {
      btn.addEventListener('click', () => handleReadingAnswer(btn, data.answer));
    });

    // Speak the story
    setTimeout(() => {
      const plainStory = data.story.replace(/<[^>]*>/g, '');
      Speech.speak(plainStory);
    }, 500);
  }

  function handleReadingAnswer(btn, correctAnswer) {
    Audio.init();
    const selected = btn.dataset.answer;
    const isCorrect = selected === correctAnswer;

    // Disable all buttons
    document.querySelectorAll('.mc-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
      btn.classList.add('correct');
      handleCorrect('reading');
      Speech.speak(`Yes! The answer is ${correctAnswer}!`);
    } else {
      btn.classList.add('incorrect');
      handleIncorrect('reading', correctAnswer, () => {
        // Show correct answer
        document.querySelectorAll('.mc-btn').forEach(b => {
          if (b.dataset.answer === correctAnswer) {
            b.classList.add('correct');
          }
          b.disabled = true;
        });
      });
    }
  }

  // ========================
  // SECTION B: Unscramble Round
  // ========================

  function renderUnscrambleRound(data) {
    elements.roundType.textContent = '🔀 Unscramble Sentence';
    gameState.selectedWords = [];

    const shuffledWords = shuffleArray([...data.scrambled]);

    let html = `
      <div class="unscramble-area">
        <div class="sentence-line empty" id="sentence-line"></div>
        <div class="word-chips" id="word-chips">
    `;

    shuffledWords.forEach((word, i) => {
      html += `<button class="word-chip" data-word="${word}" data-index="${i}">${word}</button>`;
    });

    html += `
        </div>
        <div class="unscramble-controls">
          <button class="ctrl-btn undo" id="undo-btn">↩ Undo</button>
          <button class="ctrl-btn clear" id="clear-btn">🗑 Clear</button>
          <button class="ctrl-btn check" id="check-btn">✓ Check</button>
        </div>
      </div>
    `;

    elements.roundContent.innerHTML = html;

    // Store data for checking
    elements.roundContent.dataset.correct = data.correct;

    // Add click handlers for word chips
    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('click', () => handleWordChipClick(chip));
    });

    // Control buttons
    document.getElementById('undo-btn').addEventListener('click', handleUndo);
    document.getElementById('clear-btn').addEventListener('click', handleClear);
    document.getElementById('check-btn').addEventListener('click', () => handleUnscrambleCheck(data.correct));

    // Speak instruction
    setTimeout(() => {
      Speech.speak('Put the words in the right order to make a sentence.');
    }, 500);
  }

  function handleWordChipClick(chip) {
    if (chip.classList.contains('used')) return;

    Audio.playClick();
    chip.classList.add('used');

    const word = chip.dataset.word;
    gameState.selectedWords.push({ word, chipIndex: chip.dataset.index });

    updateSentenceLine();
  }

  function updateSentenceLine() {
    const line = document.getElementById('sentence-line');
    if (gameState.selectedWords.length === 0) {
      line.innerHTML = '';
      line.classList.add('empty');
    } else {
      line.classList.remove('empty');
      line.innerHTML = gameState.selectedWords.map(item =>
        `<span class="word-chip in-sentence">${item.word}</span>`
      ).join('');
    }
  }

  function handleUndo() {
    if (gameState.selectedWords.length === 0) return;

    Audio.playClick();
    const last = gameState.selectedWords.pop();

    // Re-enable the chip
    const chip = document.querySelector(`.word-chip[data-index="${last.chipIndex}"]`);
    if (chip) chip.classList.remove('used');

    updateSentenceLine();
  }

  function handleClear() {
    if (gameState.selectedWords.length === 0) return;

    Audio.playClick();
    gameState.selectedWords = [];

    // Re-enable all chips
    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.classList.remove('used');
    });

    updateSentenceLine();
  }

  function handleUnscrambleCheck(correctSentence) {
    Audio.init();
    const userSentence = gameState.selectedWords.map(item => item.word).join(' ');

    // Normalize for comparison (handle punctuation)
    const normalize = str => str.replace(/\s+/g, ' ').trim();
    const isCorrect = normalize(userSentence) === normalize(correctSentence.replace(/[.?!]$/, ''));

    if (isCorrect) {
      handleCorrect('unscramble');
      Speech.speak(`Perfect! ${correctSentence}`);
    } else {
      handleIncorrect('unscramble', correctSentence, () => {
        // Show correct sentence
        document.getElementById('sentence-line').innerHTML =
          `<span style="color: #4CAF50; font-weight: bold;">${correctSentence}</span>`;
      });
    }
  }

  // ========================
  // SECTION C: Left/Right Round
  // ========================

  function renderLeftRightRound(data) {
    elements.roundType.textContent = '👈👉 Left or Right';

    const dirArrow = data.direction === 'left' ? '➡️' : '⬅️';
    const dirText = data.direction === 'left' ? 'left to right' : 'right to left';

    let html = `
      <div class="question-text">${data.instruction}</div>
      <div class="direction-hint">
        <span class="arrow">${dirArrow}</span> Count from ${dirText}
      </div>
      <div class="row-container">
        <div class="items-row idle" id="items-row">
    `;

    data.items.forEach((itemType, i) => {
      html += `
        <div class="row-item" data-type="${itemType}" data-index="${i}">
          ${ROW_ICONS[itemType]}
          <div class="mark-overlay" id="mark-${i}"></div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <button class="hint-btn" id="hint-btn">💡 Hint: Count for me</button>
    `;

    elements.roundContent.innerHTML = html;

    // Store round data
    elements.roundContent.dataset.targetType = data.targetType;
    elements.roundContent.dataset.targetPosition = data.targetPosition;
    elements.roundContent.dataset.direction = data.direction;
    elements.roundContent.dataset.markStyle = data.markStyle;

    // Setup row drag
    setupRowDrag();

    // Add click handlers for items
    document.querySelectorAll('.row-item').forEach(item => {
      item.addEventListener('click', () => handleRowItemClick(item, data));
    });

    // Hint button
    document.getElementById('hint-btn').addEventListener('click', () => showCountingHint(data));

    // Speak instruction
    setTimeout(() => {
      Speech.speak(data.instruction);
    }, 500);
  }

  function setupRowDrag() {
    const row = document.getElementById('items-row');
    if (!row) return;

    let isDragging = false;
    let startX, startY;

    function onPointerDown(e) {
      isDragging = true;
      row.classList.remove('idle');
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      gameState.rowRotateY = Math.max(-20, Math.min(20, deltaX * 0.2));
      gameState.rowRotateX = Math.max(-15, Math.min(15, -deltaY * 0.2));

      row.style.transform = `rotateX(${gameState.rowRotateX}deg) rotateY(${gameState.rowRotateY}deg)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      row.style.transition = 'transform 0.5s ease-out';
      row.style.transform = 'rotateX(0deg) rotateY(0deg)';
      setTimeout(() => {
        row.style.transition = '';
        row.classList.add('idle');
      }, 500);
    }

    row.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    row.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });
    document.addEventListener('touchend', onPointerUp);
  }

  function showCountingHint(data) {
    Audio.playClick();
    const items = document.querySelectorAll('.row-item');
    const targetItems = [];

    // Find all items of target type
    items.forEach((item, idx) => {
      if (item.dataset.type === data.targetType) {
        targetItems.push({ element: item, index: idx });
      }
    });

    // Order based on direction
    if (data.direction === 'right') {
      targetItems.reverse();
    }

    // Animate counting
    targetItems.forEach((item, count) => {
      setTimeout(() => {
        item.element.classList.add('counting');
        Speech.speak(ORDINALS[count + 1].short);
        setTimeout(() => item.element.classList.remove('counting'), 250);
      }, count * 600);
    });
  }

  function handleRowItemClick(item, data) {
    Audio.init();

    // Find the correct item index
    const items = document.querySelectorAll('.row-item');
    const targetItems = [];

    items.forEach((el, idx) => {
      if (el.dataset.type === data.targetType) {
        targetItems.push({ element: el, index: idx });
      }
    });

    // Order based on direction
    if (data.direction === 'right') {
      targetItems.reverse();
    }

    // Find the correct target (targetPosition is 1-indexed)
    const correctItem = targetItems[data.targetPosition - 1];
    const clickedIndex = parseInt(item.dataset.index);
    const isCorrect = correctItem && correctItem.index === clickedIndex;

    // Apply mark
    const markEl = document.getElementById(`mark-${clickedIndex}`);
    let markHtml = '';

    switch (data.markStyle) {
      case 'square':
        markHtml = `<div class="mark-square ${isCorrect ? 'mark-correct' : 'mark-incorrect'}"></div>`;
        break;
      case 'circle':
        markHtml = `<div class="mark-circle ${isCorrect ? 'mark-correct' : 'mark-incorrect'}"></div>`;
        break;
      case 'x':
        markHtml = `<span class="mark-x ${isCorrect ? 'mark-correct' : 'mark-incorrect'}">✕</span>`;
        break;
    }

    markEl.innerHTML = markHtml;

    if (isCorrect) {
      handleCorrect('leftright');
      Speech.speak(`Great! That's the ${ORDINALS[data.targetPosition].word} ${data.targetType}!`);
    } else {
      handleIncorrect('leftright', null, () => {
        // Show correct item
        if (correctItem) {
          const correctMarkEl = document.getElementById(`mark-${correctItem.index}`);
          let correctMark = '';
          switch (data.markStyle) {
            case 'square':
              correctMark = '<div class="mark-square mark-correct"></div>';
              break;
            case 'circle':
              correctMark = '<div class="mark-circle mark-correct"></div>';
              break;
            case 'x':
              correctMark = '<span class="mark-x mark-correct">✕</span>';
              break;
          }
          correctMarkEl.innerHTML = correctMark;
          correctItem.element.style.border = '4px solid #4CAF50';
        }
      });
    }

    // Disable further clicks
    document.querySelectorAll('.row-item').forEach(el => {
      el.style.pointerEvents = 'none';
    });
  }

  // ========================
  // Common Handlers
  // ========================

  function handleCorrect(roundType) {
    const pointsEarned = gameState.hasRetried ? 0.5 : 1;
    gameState.points += pointsEarned;

    Audio.playSuccess();
    updateStarsDisplay();

    elements.feedback.innerHTML = '&#127881; Correct!';
    elements.feedback.className = 'feedback success';
    elements.feedback.classList.remove('hidden');

    setTimeout(nextRound, 2000);
  }

  function handleIncorrect(roundType, correctAnswer, showCorrectCallback) {
    Audio.playError();

    if (!gameState.hasRetried) {
      // First wrong attempt - allow retry
      gameState.hasRetried = true;

      elements.feedback.innerHTML = '&#128528; Try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak('Oops! Try again!');

      // Re-enable for retry based on round type
      setTimeout(() => {
        if (roundType === 'reading') {
          document.querySelectorAll('.mc-btn:not(.incorrect)').forEach(b => b.disabled = false);
        } else if (roundType === 'leftright') {
          document.querySelectorAll('.row-item').forEach(el => {
            el.style.pointerEvents = 'auto';
          });
          // Clear wrong marks
          document.querySelectorAll('.mark-overlay').forEach(m => m.innerHTML = '');
        }
        // Unscramble doesn't need re-enabling, user can keep trying
      }, 800);
    } else {
      // Second wrong - show correct and move on
      elements.feedback.innerHTML = correctAnswer
        ? `The answer is: <strong>${correctAnswer}</strong>`
        : 'Let me show you the answer!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      if (correctAnswer) {
        Speech.speak(`The answer is ${correctAnswer}.`);
      } else {
        Speech.speak('Here is the correct answer.');
      }

      if (showCorrectCallback) showCorrectCallback();

      setTimeout(nextRound, 3000);
    }
  }

  function updateStarsDisplay() {
    const stars = calculateStars(gameState.points);
    elements.currentStars.innerHTML = renderStars(stars);
  }

  function calculateStars(points) {
    if (points >= 7) return 3;
    if (points >= 5) return 2;
    if (points >= 3) return 1;
    return 0;
  }

  function endGame() {
    gameState.isPlaying = false;

    const finalStars = calculateStars(gameState.points);

    // Save best score
    Settings.setBestStars('positions', finalStars);

    // Show game complete screen
    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStars);
    elements.finalPoints.textContent = gameState.points.toFixed(1);

    // Set message based on performance
    const messages = [
      'Keep practicing! You can do it!',
      'Good effort! Keep learning!',
      'Great job! You\'re getting better!',
      'Amazing! You\'re a positions expert!'
    ];
    elements.finalMessage.textContent = messages[finalStars];

    // Play fanfare and speak
    Audio.playFanfare();
    setTimeout(() => {
      Speech.speak(`Well done! You got ${gameState.points.toFixed(1)} points! ${messages[finalStars]}`);
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
    startGame();
  });

})();
