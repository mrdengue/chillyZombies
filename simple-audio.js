/**
 * Simple Web Audio System for Chilly Zombies
 * Minimal implementation - only what the game needs
 */

(function() {
  'use strict';

  // Audio context
  let audioContext = null;
  let audioEnabled = false;

  // Sound storage
  const sounds = {};        // Audio buffers
  const playing = {};       // Currently playing sounds
  let musicSource = null;   // Background music source

  /**
   * Initialize audio context (call on user interaction)
   */
  function initAudio() {
    if (audioContext) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      audioEnabled = true;
      console.log('✓ Audio initialized');
    } catch (e) {
      console.warn('Audio not supported:', e);
    }
  }

  /**
   * Load a sound file
   */
  function loadSound(id, url) {
    if (!audioContext) initAudio();
    if (!audioContext) return;

    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => audioContext.decodeAudioData(data))
      .then(buffer => {
        sounds[id] = buffer;
        console.log('Loaded:', id);
      })
      .catch(err => console.warn('Failed to load', id, err));
  }

  /**
   * Play a sound
   */
  function playSound(id, loop = false) {
    if (!audioContext || !sounds[id]) return;

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    try {
      const source = audioContext.createBufferSource();
      source.buffer = sounds[id];
      source.loop = loop;
      source.connect(audioContext.destination);
      source.start(0);

      if (loop) {
        musicSource = source; // Save music source for stopping
      } else {
        playing[id] = source;
        source.onended = () => delete playing[id];
      }

      return source;
    } catch (e) {
      console.warn('Failed to play', id, e);
    }
  }

  /**
   * Stop background music
   */
  function stopMusic() {
    if (musicSource) {
      try {
        musicSource.stop();
      } catch (e) {}
      musicSource = null;
    }
  }

  /**
   * Stop a specific sound
   */
  function stopSound(id) {
    if (playing[id]) {
      try {
        playing[id].stop();
      } catch (e) {}
      delete playing[id];
    }
  }

  // Create global soundManager mock
  window.soundManager = {
    url: '',
    debugMode: false,
    loaded: true,

    onload: function() {
      console.log('soundManager ready (Web Audio)');
    },

    createSound: function(options) {
      const id = options.id;
      const url = options.url;

      // Load sound
      if (audioEnabled || audioContext) {
        loadSound(id, url);
      } else {
        // Queue for later
        setTimeout(() => loadSound(id, url), 100);
      }

      return {
        load: function() {},
        play: function() { playSound(id); },
        stop: function() { stopSound(id); }
      };
    },

    play: function(id, options) {
      const loop = options && options.loops !== undefined;
      playSound(id, loop);
    },

    stop: function(id) {
      stopSound(id);
    },

    stopAll: function() {
      for (let id in playing) {
        stopSound(id);
      }
      stopMusic();
    },

    supported: function() {
      return true;
    }
  };

  // Initialize on user interaction
  const enableAudio = function() {
    initAudio();
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
    document.removeEventListener('keydown', enableAudio);
  };

  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
  document.addEventListener('keydown', enableAudio);

  console.log('Simple Audio System loaded');
})();
