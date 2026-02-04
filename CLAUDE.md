# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kids 3D English is a static HTML/CSS/JS vocabulary learning app for children (age 6+). No build tools, npm, or server required—open `index.html` directly in a browser.

## Architecture

```
index.html              # Main menu with game cards + progress tracking
shared/
  ui.js                 # Centralized utilities (window.GameUtils)
  ui.css                # Global styles, CSS variables, animations
games/
  [game-name]/
    index.html          # Game page structure
    game.js             # Game logic (IIFE pattern)
```

### Shared Utilities (window.GameUtils)

```javascript
const { Settings, Audio, Speech, setup3DCard, makeSpeakable, renderStars, shuffleArray, pickRandom } = window.GameUtils;
```

- `Settings` - localStorage for sound/voice toggles and `bestStars_${gameName}`
- `Audio` - WebAudio beeps: `playSuccess()`, `playError()`, `playClick()`, `playFanfare()`
- `Speech` - SpeechSynthesis wrapper with `speak(text)` (US English, rate 0.85, pitch 1.1)
- `setup3DCard(element)` - Enables drag-to-rotate with idle animation
- `renderStars(count, total)` - Returns star HTML

### Game Structure Pattern

Every game.js follows:
```javascript
(function() {
  'use strict';
  const { Settings, Audio, Speech, ... } = window.GameUtils;

  // Data arrays
  const ITEMS = [{ name: 'item', category: 'type', icon: '🔖' }, ...];

  // Game state
  let gameState = { currentRound: 0, score: 0, hasRetried: false, isPlaying: false };

  // DOM cache
  const elements = { ... };

  // Core functions: startGame(), nextRound(), handleChoice(), endGame()

  document.addEventListener('DOMContentLoaded', startGame);
})();
```

### Scoring System

- 1 point = correct first try
- 0.5 points = correct after retry (one retry allowed per question)
- Stars: 3 stars >= 80% score, 2 stars >= 60%, 1 star >= 40%
- Save with: `Settings.setBestStars('game_name', starCount)`

### Game Types

**Simple games** (materials, tastes, senses): Single round type with 3D card display, multiple choice buttons.

**Complex games** (positions, our-bodies, staying-alive): Multiple round types in `roundSequence` array, shuffled order.

## Key Conventions

- **No external assets**: Use inline SVG and HTML entities (`&#127953;`) for icons
- **Touch-friendly**: Large buttons (80px), rounded corners (20px)
- **Audio/Speech guards**: Always check `Settings.soundEnabled` / `Settings.voiceEnabled`
- **Retry logic**: Track with `gameState.hasRetried` flag
- **IIFE pattern**: All game.js files wrapped in immediately-invoked function

## Adding a New Game

1. Create `games/new-game/index.html` using existing game as template
2. Create `games/new-game/game.js` following the pattern above
3. Add game card and progress item to main `index.html`
4. Add star loading in main index.html script section
5. Update README.md with game description and editing instructions
