/* ============================================
   Positions Game - Kids 3D English
   Learn: Ordinal numbers (1st-10th) + Left/Right

   Round Types (10 rounds total):
   A) Reading + Multiple Choice (4 rounds) - with 2-step reasoning
   B) Unscramble sentence (3 rounds) - longer sentences with hint timer
   C) Left/Right ordinal selection (3 rounds) - 8-10 icons
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
  // SECTION A: Reading Stories (Harder - 2 sequences)
  // ========================
  const READING_ROUNDS = [
    {
      story: `Tommy has a birthday party. The <span class="ordinal">first</span> friend to arrive is Anna. Ben arrives <span class="ordinal">second</span>. Clara arrives <span class="ordinal">third</span>. Mom asks them to sit down. Clara sits <span class="ordinal">first</span>. Anna sits <span class="ordinal">second</span>. Ben sits <span class="ordinal">third</span>.`,
      question: 'Who sits in the second seat?',
      options: ['Anna', 'Ben', 'Clara'],
      answer: 'Anna'
    },
    {
      story: `Tommy has a birthday party. The <span class="ordinal">first</span> friend to arrive is Anna. Ben arrives <span class="ordinal">second</span>. Clara arrives <span class="ordinal">third</span>. Mom asks them to sit down. Clara sits <span class="ordinal">first</span>. Anna sits <span class="ordinal">second</span>. Ben sits <span class="ordinal">third</span>.`,
      question: 'Who is the third to arrive?',
      options: ['Anna', 'Ben', 'Clara'],
      answer: 'Clara'
    },
    {
      story: `There is a race at school. Emma finishes <span class="ordinal">first</span>. Jake comes <span class="ordinal">second</span>. Lily is <span class="ordinal">third</span>. Max is <span class="ordinal">fourth</span>. Then they get prizes. Max gets his prize <span class="ordinal">first</span>. Emma gets hers <span class="ordinal">second</span>.`,
      question: 'Who finishes the race before Lily?',
      options: ['Emma and Jake', 'Max', 'Only Emma'],
      answer: 'Emma and Jake'
    },
    {
      story: `There is a race at school. Emma finishes <span class="ordinal">first</span>. Jake comes <span class="ordinal">second</span>. Lily is <span class="ordinal">third</span>. Max is <span class="ordinal">fourth</span>. Then they get prizes. Max gets his prize <span class="ordinal">first</span>. Emma gets hers <span class="ordinal">second</span>.`,
      question: 'Who gets their prize first?',
      options: ['Emma', 'Jake', 'Max'],
      answer: 'Max'
    },
    {
      story: `Five kids join the spelling bee. Mia goes <span class="ordinal">first</span>. Sam goes <span class="ordinal">second</span>. Olivia goes <span class="ordinal">third</span>. Liam goes <span class="ordinal">fourth</span>. Noah goes <span class="ordinal">fifth</span>. After the bee, Olivia wins <span class="ordinal">first</span> place!`,
      question: 'How many kids went before Liam?',
      options: ['Two', 'Three', 'Four'],
      answer: 'Three'
    },
    {
      story: `Five kids join the spelling bee. Mia goes <span class="ordinal">first</span>. Sam goes <span class="ordinal">second</span>. Olivia goes <span class="ordinal">third</span>. Liam goes <span class="ordinal">fourth</span>. Noah goes <span class="ordinal">fifth</span>. After the bee, Olivia wins <span class="ordinal">first</span> place!`,
      question: 'Who goes right before Noah?',
      options: ['Sam', 'Olivia', 'Liam'],
      answer: 'Liam'
    },
    {
      story: `Mom bakes four batches of cookies. The <span class="ordinal">first</span> batch is chocolate. The <span class="ordinal">second</span> batch is vanilla. The <span class="ordinal">third</span> batch is strawberry. The <span class="ordinal">fourth</span> batch is lemon. Dad eats the strawberry cookies <span class="ordinal">first</span>.`,
      question: 'Which batch does Dad eat first?',
      options: ['First batch', 'Second batch', 'Third batch'],
      answer: 'Third batch'
    },
    {
      story: `Six ducks swim in the pond. The <span class="ordinal">first</span> duck is white. The <span class="ordinal">second</span> duck is brown. The <span class="ordinal">third</span> duck is yellow. The <span class="ordinal">fourth</span> duck is gray. The <span class="ordinal">fifth</span> duck is black. The <span class="ordinal">sixth</span> duck is orange.`,
      question: 'What color is the duck between the brown and gray ducks?',
      options: ['White', 'Yellow', 'Black'],
      answer: 'Yellow'
    }
  ];

  // ========================
  // SECTION B: Unscramble Sentences (Harder - longer)
  // ========================
  const UNSCRAMBLE_ROUNDS = [
    {
      scrambled: ['is', 'Ben', 'the', 'playing', 'saxophone', 'in', 'the', 'park'],
      correct: 'Ben is playing the saxophone in the park.',
      firstWord: 'Ben'
    },
    {
      scrambled: ['really', 'like', 'I', 'the', 'of', 'smell', 'mangoes', 'and', 'strawberries'],
      correct: 'I really like the smell of mangoes and strawberries.',
      firstWord: 'I'
    },
    {
      scrambled: ['like', 'you', 'Do', 'the', 'taste', 'of', 'salty', 'chips', '?'],
      correct: 'Do you like the taste of salty chips?',
      firstWord: 'Do'
    },
    {
      scrambled: ['cake', 'The', 'chocolate', 'tastes', 'very', 'sweet', 'and', 'yummy'],
      correct: 'The chocolate cake tastes very sweet and yummy.',
      firstWord: 'The'
    },
    {
      scrambled: ['beautiful', 'flowers', 'The', 'smell', 'so', 'nice', 'today'],
      correct: 'The beautiful flowers smell so nice today.',
      firstWord: 'The'
    },
    {
      scrambled: ['is', 'pizza', 'This', 'my', 'favorite', 'food', 'in', 'the', 'world'],
      correct: 'This is my favorite pizza food in the world.',
      firstWord: 'This'
    },
    {
      scrambled: ['Can', 'smell', 'you', 'the', 'fresh', 'bread', 'from', 'here', '?'],
      correct: 'Can you smell the fresh bread from here?',
      firstWord: 'Can'
    }
  ];

  // ========================
  // SECTION C: Left/Right Selection (Harder - 8-10 icons)
  // ========================
  const ROW_ICONS = {
    teddy: '&#129528;',   // Teddy bear
    fan: '&#127744;',     // Cyclone/fan
    tree: '&#127794;',    // Tree
    star: '&#11088;',     // Star
    heart: '&#10084;',    // Heart
    flower: '&#127804;',  // Flower
    apple: '&#127822;',   // Apple
    ball: '&#9917;',      // Soccer ball
    car: '&#128663;',     // Car
    fish: '&#128031;'     // Fish
  };

  const LEFTRIGHT_ROUNDS = [
    {
      items: ['teddy', 'fan', 'tree', 'fan', 'star', 'teddy', 'fan', 'tree', 'star', 'fan'],
      direction: 'left',
      targetType: 'fan',
      targetPosition: 2,
      markStyle: 'square',
      instruction: 'From left to right, tap the 2nd fan.'
    },
    {
      items: ['star', 'flower', 'apple', 'flower', 'ball', 'flower', 'star', 'flower', 'apple'],
      direction: 'right',
      targetType: 'flower',
      targetPosition: 3,
      markStyle: 'circle',
      instruction: 'From right to left, tap the 3rd flower.'
    },
    {
      items: ['tree', 'heart', 'tree', 'apple', 'tree', 'ball', 'tree', 'star', 'tree', 'fish'],
      direction: 'right',
      targetType: 'tree',
      targetPosition: 4,
      markStyle: 'x',
      instruction: 'Tap the 4th tree from the right.'
    },
    {
      items: ['ball', 'teddy', 'car', 'teddy', 'ball', 'teddy', 'car', 'teddy'],
      direction: 'left',
      targetType: 'teddy',
      targetPosition: 3,
      markStyle: 'circle',
      instruction: 'Tap the 3rd teddy bear from the left.'
    },
    {
      items: ['car', 'fish', 'car', 'star', 'fish', 'car', 'fish', 'star', 'car'],
      direction: 'left',
      targetType: 'car',
      targetPosition: 4,
      markStyle: 'square',
      instruction: 'From left to right, tap the 4th car.'
    },
    {
      items: ['heart', 'apple', 'heart', 'flower', 'apple', 'heart', 'apple', 'flower', 'heart'],
      direction: 'right',
      targetType: 'heart',
      targetPosition: 2,
      markStyle: 'x',
      instruction: 'Tap the 2nd heart from the right.'
    },
    {
      items: ['fish', 'star', 'ball', 'fish', 'star', 'fish', 'ball', 'star', 'fish', 'ball'],
      direction: 'left',
      targetType: 'fish',
      targetPosition: 3,
      markStyle: 'circle',
      instruction: 'From left to right, tap the 3rd fish.'
    },
    {
      items: ['apple', 'tree', 'flower', 'apple', 'tree', 'apple', 'flower', 'tree', 'apple'],
      direction: 'right',
      targetType: 'apple',
      targetPosition: 3,
      markStyle: 'square',
      instruction: 'Tap the 3rd apple from the right.'
    }
  ];

  // ============================================
  // Game Constants
  // ============================================

  const TOTAL_ROUNDS = 10;
  const READING_COUNT = 4;
  const UNSCRAMBLE_COUNT = 3;
  const LEFTRIGHT_COUNT = 3;
  const HINT_TIMER_SECONDS = 12;

  // ============================================
  // Game State
  // ============================================

  let gameState = {
    currentRound: 0,
    points: 0,
    hasRetried: false,
    roundSequence: [],
    isPlaying: false,
    selectedWords: [],
    rowRotateX: 0,
    rowRotateY: 0,
    hintTimer: null,
    hintShown: false
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
    // Clear any existing timers
    if (gameState.hintTimer) {
      clearTimeout(gameState.hintTimer);
    }

    // Reset state
    gameState = {
      currentRound: 0,
      points: 0,
      hasRetried: false,
      roundSequence: buildRoundSequence(),
      isPlaying: true,
      selectedWords: [],
      rowRotateX: 0,
      rowRotateY: 0,
      hintTimer: null,
      hintShown: false
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
    const sequence = [];

    // Pick random reading rounds
    const readingPicks = pickRandom(READING_ROUNDS, READING_COUNT);
    readingPicks.forEach(data => {
      sequence.push({ type: 'reading', data });
    });

    // Pick random unscramble rounds
    const unscramblePicks = pickRandom(UNSCRAMBLE_ROUNDS, UNSCRAMBLE_COUNT);
    unscramblePicks.forEach(data => {
      sequence.push({ type: 'unscramble', data });
    });

    // Pick random left/right rounds
    const leftrightPicks = pickRandom(LEFTRIGHT_ROUNDS, LEFTRIGHT_COUNT);
    leftrightPicks.forEach(data => {
      sequence.push({ type: 'leftright', data });
    });

    // Shuffle all rounds
    return shuffleArray(sequence);
  }

  function nextRound() {
    // Clear hint timer
    if (gameState.hintTimer) {
      clearTimeout(gameState.hintTimer);
      gameState.hintTimer = null;
    }
    gameState.hintShown = false;

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
    gameState.hintShown = false;

    const shuffledWords = shuffleArray([...data.scrambled]);

    let html = `
      <div class="unscramble-area">
        <div class="sentence-line empty" id="sentence-line"></div>
        <div class="word-chips" id="word-chips">
    `;

    shuffledWords.forEach((word, i) => {
      html += `<button class="word-chip" data-word="${word}" data-index="${i}" data-original="${word}">${word}</button>`;
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
    elements.roundContent.dataset.firstWord = data.firstWord;

    // Add click handlers for word chips
    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('click', () => handleWordChipClick(chip));
    });

    // Control buttons
    document.getElementById('undo-btn').addEventListener('click', handleUndo);
    document.getElementById('clear-btn').addEventListener('click', handleClear);
    document.getElementById('check-btn').addEventListener('click', () => handleUnscrambleCheck(data.correct));

    // Start hint timer (12 seconds)
    gameState.hintTimer = setTimeout(() => {
      showUnscrambleHint(data.firstWord);
    }, HINT_TIMER_SECONDS * 1000);

    // Speak instruction
    setTimeout(() => {
      Speech.speak('Put the words in the right order to make a sentence.');
    }, 500);
  }

  function showUnscrambleHint(firstWord) {
    if (gameState.hintShown) return;
    gameState.hintShown = true;

    // Find and highlight the first word chip
    document.querySelectorAll('.word-chip').forEach(chip => {
      if (chip.dataset.original === firstWord && !chip.classList.contains('used')) {
        chip.classList.add('hint-glow');
      }
    });
  }

  function handleWordChipClick(chip) {
    if (chip.classList.contains('used')) return;

    Audio.playClick();
    chip.classList.add('used');
    chip.classList.remove('hint-glow');

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

    const chip = document.querySelector(`.word-chip[data-index="${last.chipIndex}"]`);
    if (chip) chip.classList.remove('used');

    updateSentenceLine();
  }

  function handleClear() {
    if (gameState.selectedWords.length === 0) return;

    Audio.playClick();
    gameState.selectedWords = [];

    document.querySelectorAll('.word-chip').forEach(chip => {
      chip.classList.remove('used');
    });

    updateSentenceLine();
  }

  function handleUnscrambleCheck(correctSentence) {
    // Clear hint timer
    if (gameState.hintTimer) {
      clearTimeout(gameState.hintTimer);
      gameState.hintTimer = null;
    }

    Audio.init();
    let userSentence = gameState.selectedWords.map(item => item.word).join(' ');

    // Auto-add punctuation if missing
    const lastChar = correctSentence.slice(-1);
    if ((lastChar === '.' || lastChar === '?') && !userSentence.endsWith(lastChar)) {
      userSentence = userSentence + lastChar;
    }

    // Normalize for comparison
    const normalize = str => str.replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = normalize(userSentence) === normalize(correctSentence);

    if (isCorrect) {
      handleCorrect('unscramble');
      Speech.speak(`Perfect! ${correctSentence}`);
    } else {
      handleIncorrect('unscramble', correctSentence, () => {
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
          <div class="count-label" id="count-${i}"></div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
      <button class="hint-btn" id="hint-btn">💡 Hint: Count for me</button>
    `;

    elements.roundContent.innerHTML = html;

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

    // Animate counting with numbers appearing above items
    targetItems.forEach((item, count) => {
      setTimeout(() => {
        item.element.classList.add('counting');
        // Show count label
        const countLabel = document.getElementById(`count-${item.index}`);
        if (countLabel) {
          countLabel.textContent = ORDINALS[count + 1].short;
          countLabel.classList.add('show');
        }
        Speech.speak(ORDINALS[count + 1].short);

        setTimeout(() => {
          item.element.classList.remove('counting');
          // Hide count label after a delay
          setTimeout(() => {
            if (countLabel) countLabel.classList.remove('show');
          }, 1500);
        }, 400);
      }, count * 700);
    });
  }

  function handleRowItemClick(item, data) {
    Audio.init();

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
      gameState.hasRetried = true;

      elements.feedback.innerHTML = '&#128528; Try again!';
      elements.feedback.className = 'feedback error';
      elements.feedback.classList.remove('hidden');

      Speech.speak('Oops! Try again!');

      setTimeout(() => {
        if (roundType === 'reading') {
          document.querySelectorAll('.mc-btn:not(.incorrect)').forEach(b => b.disabled = false);
        } else if (roundType === 'leftright') {
          document.querySelectorAll('.row-item').forEach(el => {
            el.style.pointerEvents = 'auto';
          });
          document.querySelectorAll('.mark-overlay').forEach(m => m.innerHTML = '');
        }
      }, 800);
    } else {
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

  // Updated scoring for 10 rounds
  function calculateStars(points) {
    if (points >= 8) return 3;
    if (points >= 6) return 2;
    if (points >= 4) return 1;
    return 0;
  }

  function endGame() {
    // Clear any timers
    if (gameState.hintTimer) {
      clearTimeout(gameState.hintTimer);
    }

    gameState.isPlaying = false;

    const finalStars = calculateStars(gameState.points);

    // Save best score
    Settings.setBestStars('positions', finalStars);

    // Show game complete screen
    elements.gameArea.classList.add('hidden');
    elements.gameComplete.classList.remove('hidden');

    elements.finalStars.innerHTML = renderStars(finalStars);
    elements.finalPoints.textContent = gameState.points.toFixed(1);

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
