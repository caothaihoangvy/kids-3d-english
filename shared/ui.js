/* ============================================
   Kids 3D English - Shared UI JavaScript
   Common utilities for all games
   ============================================ */

// ============================================
// Settings Management (localStorage)
// ============================================

const Settings = {
  get soundEnabled() {
    const val = localStorage.getItem('soundEnabled');
    return val === null ? true : val === 'true';
  },
  set soundEnabled(val) {
    localStorage.setItem('soundEnabled', val);
  },

  get voiceEnabled() {
    const val = localStorage.getItem('voiceEnabled');
    return val === null ? true : val === 'true';
  },
  set voiceEnabled(val) {
    localStorage.setItem('voiceEnabled', val);
  },

  // Get best stars for a game
  getBestStars(gameName) {
    const val = localStorage.getItem(`bestStars_${gameName}`);
    return val ? parseInt(val, 10) : 0;
  },

  // Set best stars (only if better than current)
  setBestStars(gameName, stars) {
    const current = this.getBestStars(gameName);
    if (stars > current) {
      localStorage.setItem(`bestStars_${gameName}`, stars);
    }
  }
};

// ============================================
// Audio System (WebAudio beeps)
// ============================================

const Audio = {
  context: null,

  // Initialize audio context (call on user interaction)
  init() {
    if (!this.context) {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  },

  // Play a beep sound
  playTone(frequency, duration, type = 'sine') {
    if (!Settings.soundEnabled) return;

    this.init();

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Envelope for nicer sound
    gainNode.gain.setValueAtTime(0, this.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  },

  // Happy/success sound (ascending notes)
  playSuccess() {
    if (!Settings.soundEnabled) return;
    this.playTone(523, 0.15); // C5
    setTimeout(() => this.playTone(659, 0.15), 100); // E5
    setTimeout(() => this.playTone(784, 0.2), 200); // G5
  },

  // Error/try again sound (descending)
  playError() {
    if (!Settings.soundEnabled) return;
    this.playTone(400, 0.15);
    setTimeout(() => this.playTone(300, 0.2), 100);
  },

  // Click sound
  playClick() {
    if (!Settings.soundEnabled) return;
    this.playTone(800, 0.05);
  },

  // Star earned sound
  playStar() {
    if (!Settings.soundEnabled) return;
    this.playTone(880, 0.1); // A5
    setTimeout(() => this.playTone(1047, 0.15), 80); // C6
  },

  // Game complete fanfare
  playFanfare() {
    if (!Settings.soundEnabled) return;
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2), i * 150);
    });
  }
};

// ============================================
// Speech Synthesis
// ============================================

const Speech = {
  synth: window.speechSynthesis,
  voice: null,

  // Find US English voice
  init() {
    const voices = this.synth.getVoices();
    // Prefer US English voice
    this.voice = voices.find(v => v.lang === 'en-US') ||
                 voices.find(v => v.lang.startsWith('en')) ||
                 voices[0];
  },

  // Speak text
  speak(text) {
    if (!Settings.voiceEnabled) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = 0.85; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 1;

    this.synth.speak(utterance);
  }
};

// Initialize voices when available
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => Speech.init();
}
// Also try immediately
Speech.init();

// ============================================
// Toggle UI Setup
// ============================================

function setupToggles() {
  const soundToggle = document.getElementById('sound-toggle');
  const voiceToggle = document.getElementById('voice-toggle');

  if (soundToggle) {
    // Set initial state
    updateToggleUI(soundToggle, Settings.soundEnabled);

    soundToggle.addEventListener('click', () => {
      Audio.init(); // Ensure audio context is ready
      Settings.soundEnabled = !Settings.soundEnabled;
      updateToggleUI(soundToggle, Settings.soundEnabled);
      if (Settings.soundEnabled) {
        Audio.playClick();
      }
    });
  }

  if (voiceToggle) {
    // Set initial state
    updateToggleUI(voiceToggle, Settings.voiceEnabled);

    voiceToggle.addEventListener('click', () => {
      Settings.voiceEnabled = !Settings.voiceEnabled;
      updateToggleUI(voiceToggle, Settings.voiceEnabled);
      if (Settings.voiceEnabled) {
        Speech.speak('Voice is on!');
      }
    });
  }
}

function updateToggleUI(button, isEnabled) {
  if (isEnabled) {
    button.classList.add('active');
    button.classList.remove('off');
  } else {
    button.classList.remove('active');
    button.classList.add('off');
  }
}

// ============================================
// 3D Card Interaction
// ============================================

function setup3DCard(cardElement) {
  if (!cardElement) return;

  let isDragging = false;
  let startX, startY;
  let currentRotateX = 0;
  let currentRotateY = 0;

  // Start idle animation
  cardElement.classList.add('idle');

  function onPointerDown(e) {
    isDragging = true;
    cardElement.classList.remove('idle');
    startX = e.clientX || (e.touches && e.touches[0].clientX);
    startY = e.clientY || (e.touches && e.touches[0].clientY);
    cardElement.style.cursor = 'grabbing';
  }

  function onPointerMove(e) {
    if (!isDragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    // Limit rotation to reasonable angles
    currentRotateY = Math.max(-30, Math.min(30, deltaX * 0.3));
    currentRotateX = Math.max(-30, Math.min(30, -deltaY * 0.3));

    cardElement.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    cardElement.style.cursor = 'grab';

    // Smoothly return to center and restart idle animation
    cardElement.style.transition = 'transform 0.5s ease-out';
    cardElement.style.transform = 'rotateX(0deg) rotateY(0deg)';

    setTimeout(() => {
      cardElement.style.transition = 'transform 0.1s ease-out';
      cardElement.classList.add('idle');
    }, 500);
  }

  // Mouse events
  cardElement.addEventListener('mousedown', onPointerDown);
  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);

  // Touch events
  cardElement.addEventListener('touchstart', onPointerDown, { passive: true });
  document.addEventListener('touchmove', onPointerMove, { passive: true });
  document.addEventListener('touchend', onPointerUp);
}

// ============================================
// Speakable Words - Click to hear pronunciation
// ============================================

function makeSpeakable(element, text) {
  if (!element) return;

  // Store the text to speak as a data attribute
  element.dataset.speakText = text || element.textContent;

  // Add speakable class for styling
  element.classList.add('speakable');

  // Only add event listener once (check for flag)
  if (element.dataset.speakableInit) return;
  element.dataset.speakableInit = 'true';

  // Click handler to speak the word
  element.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't trigger parent click events

    // Visual feedback
    element.classList.add('speaking');

    // Get the current text to speak (may have been updated)
    const speakText = element.dataset.speakText || element.textContent;

    // Speak the word (always speak when clicked, ignoring global toggle)
    Speech.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(speakText);
    utterance.voice = Speech.voice;
    utterance.rate = 0.75; // Slower for pronunciation
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onend = () => {
      element.classList.remove('speaking');
    };

    Speech.synth.speak(utterance);

    // Play a small click sound
    Audio.init();
    Audio.playClick();
  });
}

// Make multiple elements speakable
function setupSpeakableElements() {
  // Find all elements with data-speak attribute
  document.querySelectorAll('[data-speak]').forEach(el => {
    const text = el.dataset.speak || el.textContent;
    makeSpeakable(el, text);
  });
}

// ============================================
// Stars Display Helper
// ============================================

function renderStars(count, total = 3) {
  let html = '';
  for (let i = 0; i < total; i++) {
    if (i < count) {
      html += '<span class="star earned">&#9733;</span>';
    } else {
      html += '<span class="star">&#9733;</span>';
    }
  }
  return html;
}

// ============================================
// Utility: Shuffle Array
// ============================================

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// Utility: Pick random items from array
// ============================================

function pickRandom(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

// ============================================
// Initialize on page load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  setupToggles();

  // Setup 3D card if present
  const card3d = document.querySelector('.card-3d');
  if (card3d) {
    setup3DCard(card3d);
  }
});

// Export for use in game modules
window.GameUtils = {
  Settings,
  Audio,
  Speech,
  setup3DCard,
  makeSpeakable,
  setupSpeakableElements,
  renderStars,
  shuffleArray,
  pickRandom
};
