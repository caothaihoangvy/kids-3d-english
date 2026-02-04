# Kids 3D English

A fun, interactive web app for children (age 6+) to learn English vocabulary through engaging games with 3D visuals, sound effects, and voice feedback.

## How to Run

Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

```
1. Navigate to the kids-3d-english folder
2. Double-click index.html
   OR
   Right-click index.html → Open with → Your browser
```

No server, no installation, no dependencies required!

## Features

- **Child-friendly UI**: Large buttons, bright colors, simple text
- **Sound effects**: WebAudio beeps for feedback (toggle on/off)
- **Voice feedback**: SpeechSynthesis reads instructions and responses (toggle on/off)
- **3D interactive cards**: CSS 3D transforms with drag-to-rotate
- **Progress tracking**: Stars saved to localStorage
- **Retry system**: One retry per question for encouragement

## Games Included

### 1. Materials Game
Learn about what things are made of:
- Wood, Paper, Plastic, Fabric, Glass, Metal
- 6 rounds per session
- Objects: table, book, bottle, shirt, window, spoon, and more

### 2. Food Tastes Game
Learn how different foods taste:
- Sweet, Sour, Spicy, Salty, Bitter, Yummy, Yucky
- 7 rounds per session
- Foods: lemon, chili, chocolate cake, coffee, rotten eggs, apple, burger, and more

### 3. Five Senses Game
Learn about the five senses:
- Sight (eyes), Hearing (ears), Smell (nose), Taste (tongue), Touch (hands)
- 5 rounds per session
- Items: rainbow, music, flower, candy, ice cube, and more

### 4. Positions Game
Learn ordinal numbers and left/right directions:
- 8 rounds with 3 different mini-game types:
  - **Reading + Multiple Choice** (3 rounds): Read a short story with ordinal words, answer questions
  - **Unscramble Sentence** (3 rounds): Arrange word chips to form correct sentences
  - **Left/Right Selection** (2 rounds): Tap the nth item from left or right in a row
- Teaches: first, second, third... up to tenth
- Scoring: 1 point for correct on first try, 0.5 for retry, 0 otherwise

### 5. Our Bodies Game
Learn body parts through interactive activities:
- 10 rounds with 3 different mini-game types:
  - **Label the Body** (4 rounds): Identify highlighted body parts on an SVG figure
  - **Hurt Body Part** (4 rounds): Read a scenario with 5 kids and identify which body part is hurt
  - **Feet Comparison with Bricks** (2 rounds): Math/comparison with brick measurements
- Body parts covered: eye, nose, mouth, ear, shoulder, elbow, hand, finger, knee, foot, toe, tummy, chest, hip, hair
- Scoring: 1 point for correct on first try, 0.5 for retry, 0 otherwise
- Stars: 3 stars >= 8 points, 2 stars >= 6, 1 star >= 4

## Project Structure

```
kids-3d-english/
├── index.html              # Main menu with game selection
├── README.md               # This file
├── assets/                 # (Optional) Local images/SVGs
├── shared/
│   ├── ui.css              # Global styles (child-friendly design)
│   └── ui.js               # Shared utilities (audio, speech, 3D card)
└── games/
    ├── materials/
    │   ├── index.html      # Materials game page
    │   └── game.js         # Materials game logic
    ├── tastes/
    │   ├── index.html      # Tastes game page
    │   └── game.js         # Tastes game logic
    ├── senses/
    │   ├── index.html      # Five Senses game page
    │   └── game.js         # Five Senses game logic
    ├── positions/
    │   ├── index.html      # Positions game page
    │   └── game.js         # Positions game logic (3 round types)
    └── our-bodies/
        ├── index.html      # Our Bodies game page
        └── game.js         # Our Bodies game logic (3 round types)
```

## How to Add a New Game

1. **Create game folder**: `games/your-game-name/`

2. **Create index.html** in that folder:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Game - Kids 3D English</title>
  <link rel="stylesheet" href="../../shared/ui.css">
</head>
<body>
  <div class="app-container">
    <!-- Header with home button and toggles -->
    <header class="header-game">
      <div class="header-left">
        <a href="../../index.html" class="home-btn">&#127968;</a>
        <span class="header-title">Your Game Title</span>
      </div>
      <div class="header-right">
        <button id="sound-toggle" class="toggle-btn active">&#128266;</button>
        <button id="voice-toggle" class="toggle-btn active">&#128483;</button>
      </div>
    </header>

    <!-- Your game content here -->
    <div class="game-area">
      <!-- Use existing CSS classes for consistency -->
    </div>
  </div>

  <script src="../../shared/ui.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

3. **Create game.js** with your game logic:
```javascript
(function() {
  'use strict';

  // Access shared utilities
  const { Settings, Audio, Speech, setup3DCard, renderStars, shuffleArray, pickRandom } = window.GameUtils;

  // Your game data
  const YOUR_DATA = [...];

  // Game state
  let gameState = {
    currentRound: 0,
    score: 0,
    // etc.
  };

  // Implement: startGame(), nextRound(), handleChoice(), endGame()

  // Save best stars
  Settings.setBestStars('your-game-name', finalStars);

  // Start on load
  document.addEventListener('DOMContentLoaded', startGame);
})();
```

4. **Add game card to main index.html**:
```html
<a href="games/your-game-name/index.html" class="game-card">
  <div class="game-card-icon">&#128512;</div>
  <h2>Your Game</h2>
  <p>Description for kids</p>
  <div class="best-stars">
    Best: <span id="stars-your-game">&#9733;&#9733;&#9733;</span>
  </div>
</a>
```

5. **Update progress display** in main index.html JavaScript:
```javascript
const yourGameStars = Settings.getBestStars('your-game-name');
document.getElementById('stars-your-game').innerHTML = renderStars(yourGameStars);
```

## Editing the Positions Game

### Adding/Editing Reading Stories

In `games/positions/game.js`, find the `READING_ROUNDS` array:

```javascript
const READING_ROUNDS = [
  {
    story: `Your story with <span class="ordinal">first</span> and other ordinal words...`,
    question: 'Your question here?',
    options: ['Option A', 'Option B', 'Option C'],
    answer: 'Option A'  // Must match one of the options exactly
  },
  // Add more stories...
];
```

### Adding/Editing Unscramble Sentences

Find the `UNSCRAMBLE_ROUNDS` array:

```javascript
const UNSCRAMBLE_ROUNDS = [
  {
    scrambled: ['word1', 'word2', 'word3'],  // Words will be shuffled
    correct: 'word1 word2 word3.'             // The correct sentence
  },
  // Add more sentences...
];
```

### Adding/Editing Left/Right Rounds

Find the `LEFTRIGHT_ROUNDS` array:

```javascript
const LEFTRIGHT_ROUNDS = [
  {
    items: ['teddy', 'fan', 'tree', 'fan', 'star'],  // Item types from ROW_ICONS
    direction: 'left',      // 'left' = count left-to-right, 'right' = count right-to-left
    targetType: 'fan',      // Which item type to find
    targetPosition: 2,      // Find the 2nd one (1-indexed)
    markStyle: 'square',    // 'square', 'circle', or 'x'
    instruction: 'From left to right, tap the 2nd fan.'
  },
  // Add more rounds...
];
```

### Adding New Icon Types

Add to the `ROW_ICONS` object:

```javascript
const ROW_ICONS = {
  teddy: '&#129528;',   // Teddy bear emoji
  fan: '&#127744;',     // Use HTML entity codes
  // Add your icon:
  car: '&#128663;',     // Car emoji
};
```

## Editing the Our Bodies Game

### Adding/Editing Body Parts

In `games/our-bodies/game.js`, find the `BODY_PARTS` array:

```javascript
const BODY_PARTS = [
  { name: 'eye', plural: 'eyes', icon: '👁️' },
  { name: 'nose', plural: 'noses', icon: '👃' },
  // Add more body parts:
  { name: 'neck', plural: 'necks', icon: '🦒' },
];
```

To add a new body part to the "Label the Body" rounds, also update `LABEL_BODY_PARTS`:

```javascript
const LABEL_BODY_PARTS = ['eye', 'nose', 'mouth', 'ear', 'shoulder', 'elbow', 'hand', 'knee', 'foot', 'tummy'];
// Add your new part to this list
```

Note: You'll also need to add SVG path data for new parts in the `generateBodySVG()` function's `partPaths` object.

### Adding/Editing Hurt Body Part Scenarios

Find the `HURT_SCENARIOS` array:

```javascript
const HURT_SCENARIOS = [
  {
    caption: 'The boy next to girl A has hurt his ____.',
    answer: 'knee',
    options: ['foot', 'elbow', 'knee'],
    kidsSetup: [
      { label: 'A', gender: 'girl' },
      { label: 'B', gender: 'boy', hurt: 'knee' },  // Add 'hurt' to mark the hurt child
      { label: 'C', gender: 'girl' },
      { label: 'D', gender: 'boy' },
      { label: 'E', gender: 'girl' }
    ]
  },
  // Add more scenarios...
];
```

### Adding/Editing Feet Comparison (Bricks) Data

Find the `FEET_DATA` object:

```javascript
const FEET_DATA = {
  children: [
    { name: 'Anna', bricks: 8, isExample: true },  // isExample shows the count
    { name: 'Bill', bricks: 6 },
    { name: 'Arun', bricks: 10 },
    { name: 'Fen', bricks: 7 }
  ],
  brickOptions: {
    Bill: [5, 6, 7],    // Multiple choice options for Bill (correct = 6)
    Arun: [9, 10, 11],  // Multiple choice options for Arun (correct = 10)
    Fen: [6, 7, 8]      // Multiple choice options for Fen (correct = 7)
  }
};
```

To add a new child:
1. Add to the `children` array with their correct brick count
2. Add their name to `brickOptions` with 3 multiple-choice numbers (include the correct answer)

## Shared Utilities (window.GameUtils)

- `Settings.soundEnabled` - Get/set sound toggle state
- `Settings.voiceEnabled` - Get/set voice toggle state
- `Settings.getBestStars(gameName)` - Get best stars for a game
- `Settings.setBestStars(gameName, stars)` - Save best stars (only if better)
- `Audio.playSuccess()` - Happy ascending tones
- `Audio.playError()` - Descending tones
- `Audio.playClick()` - Click sound
- `Audio.playStar()` - Star earned sound
- `Audio.playFanfare()` - Game complete celebration
- `Speech.speak(text)` - Text-to-speech (US English)
- `setup3DCard(element)` - Enable drag-to-rotate on 3D card
- `renderStars(count, total)` - Generate star HTML
- `shuffleArray(array)` - Fisher-Yates shuffle
- `pickRandom(array, count)` - Pick random items

## Browser Support

- Chrome (desktop & mobile)
- Firefox
- Safari
- Edge

Requires:
- CSS 3D Transforms
- Web Audio API
- SpeechSynthesis API
- localStorage

## License

Free for educational use.
