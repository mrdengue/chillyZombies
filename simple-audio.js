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
    if (audioContext) {
      console.log('[AUDIO] Already initialized');
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContext();
      audioEnabled = true;
      console.log('[AUDIO] ✓ Initialized successfully');
      console.log('[AUDIO] State:', audioContext.state);
    } catch (e) {
      console.error('[AUDIO] ❌ Not supported:', e);
    }
  }

  /**
   * Load a sound file
   */
  function loadSound(id, url) {
    console.log('[AUDIO] Loading:', id, 'from', url);

    if (!audioContext) {
      console.log('[AUDIO] No context, initializing...');
      initAudio();
    }
    if (!audioContext) {
      console.error('[AUDIO] ❌ Cannot load - no audio context');
      return;
    }

    fetch(url)
      .then(response => {
        console.log('[AUDIO] Fetched:', url, 'status:', response.status);
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.arrayBuffer();
      })
      .then(data => {
        console.log('[AUDIO] Decoding:', id, 'size:', data.byteLength);
        return audioContext.decodeAudioData(data);
      })
      .then(buffer => {
        sounds[id] = buffer;
        console.log('[AUDIO] ✓ Loaded:', id, 'duration:', buffer.duration.toFixed(2) + 's');

        // Set duration on Game_Sounds entry for background music looping
        if (window.Game_Sounds) {
          for (let i = 0; i < Game_Sounds.length; i++) {
            if (Game_Sounds[i].id === id) {
              Game_Sounds[i].duration = buffer.duration;
              console.log('[AUDIO] Set duration for Game_Sounds[' + i + ']:', buffer.duration);
              break;
            }
          }
        }
      })
      .catch(err => console.error('[AUDIO] ❌ Failed to load', id, ':', err));
  }

  /**
   * Play a sound
   */
  function playSound(id, loop = false) {
    console.log('[AUDIO] Play request:', id, 'loop:', loop);

    if (!audioContext) {
      console.error('[AUDIO] ❌ Cannot play - no audio context');
      initAudio(); // Try to init
      return;
    }

    if (!sounds[id]) {
      console.warn('[AUDIO] ⏳ Sound still loading:', id);
      return;
    }

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      console.log('[AUDIO] Resuming suspended context...');
      audioContext.resume().then(() => {
        console.log('[AUDIO] Context resumed, state:', audioContext.state);
      });
    }

    try {
      const source = audioContext.createBufferSource();
      source.buffer = sounds[id];
      source.loop = loop;
      source.connect(audioContext.destination);
      source.start(0);

      console.log('[AUDIO] ✓ Playing:', id, 'state:', audioContext.state);

      if (loop) {
        musicSource = source; // Save music source for stopping
      } else {
        playing[id] = source;
        source.onended = () => delete playing[id];
      }

      return source;
    } catch (e) {
      console.error('[AUDIO] ❌ Failed to play', id, ':', e);
    }
  }

  /**
   * Stop background music
   */
  function stopMusic() {
    if (musicSource) {
      try {
        musicSource.stop();
        console.log('[AUDIO] Stopped music');
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
      console.log('[AUDIO] soundManager.onload called');
    },

    createSound: function(options) {
      const id = options.id;
      const url = options.url;

      console.log('[AUDIO] createSound:', id, url);

      // Load sound immediately
      loadSound(id, url);

      // Return sound object with methods
      const soundObject = {
        id: id,
        load: function() {
          console.log('[AUDIO] sound.load() called for', id);
          // Already loading via loadSound above
        },
        play: function(options) {
          console.log('[AUDIO] sound.play() called for', id, options);
          const loop = options && (options.loops !== undefined);
          playSound(id, loop);
        },
        stop: function() {
          console.log('[AUDIO] sound.stop() called for', id);
          stopSound(id);
        }
      };

      return soundObject;
    },

    play: function(id, options) {
      const loop = options && options.loops !== undefined;
      console.log('[AUDIO] soundManager.play:', id, options);
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
    console.log('[AUDIO] User interaction detected, initializing...');
    initAudio();

    // Call SoundManager_Loaded if it exists (loads all game sounds)
    if (typeof SoundManager_Loaded === 'function') {
      console.log('[AUDIO] Calling SoundManager_Loaded to load game sounds...');
      SoundManager_Loaded();
    }

    document.removeEventListener('click', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
    document.removeEventListener('keydown', enableAudio);
  };

  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
  document.addEventListener('keydown', enableAudio);

  console.log('[AUDIO] Simple Audio System loaded and waiting for user interaction');
})();
