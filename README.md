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
- Sweet, Salty, Sour, Bitter, Spicy
- 5 rounds per session
- Foods: candy, chips, lemon, dark chocolate, chili, and more

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
    └── tastes/
        ├── index.html      # Tastes game page
        └── game.js         # Tastes game logic
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
