/**
 * Simple Web Audio System for Chilly Zombies
 * Minimal implementation - only what the game needs
 */

(function() {
  'use strict';

  // Audio context
  let audioContext = null;
  let audioEnabled = false;
  let soundsLoaded = false;

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
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
      audioEnabled = true;
      // Always try to resume immediately (some browsers start suspended)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      console.log('[AUDIO] Initialized, state:', audioContext.state);
    } catch (e) {
      console.error('[AUDIO] Not supported:', e);
    }
  }

  /**
   * Load a sound file
   */
  function loadSound(id, url) {
    if (!audioContext) initAudio();
    if (!audioContext) return;

    fetch(url)
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.arrayBuffer();
      })
      .then(function(data) {
        return audioContext.decodeAudioData(data);
      })
      .then(function(buffer) {
        sounds[id] = buffer;
        console.log('[AUDIO] Loaded:', id);

        // Set duration on Game_Sounds entry for background music looping
        if (window.Game_Sounds) {
          for (var i = 0; i < Game_Sounds.length; i++) {
            if (Game_Sounds[i].id === id) {
              Game_Sounds[i].duration = buffer.duration;
              break;
            }
          }
        }
      })
      .catch(function(err) {
        console.error('[AUDIO] Failed to load', id, ':', err);
      });
  }

  /**
   * Play a sound - handles suspended context properly
   */
  function playSound(id, loop) {
    if (!audioContext) return;
    if (!sounds[id]) return;

    // If context is suspended, resume first then play
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(function() {
        doPlay(id, loop);
      });
      return;
    }

    doPlay(id, loop);
  }

  function doPlay(id, loop) {
    if (!sounds[id]) return;
    try {
      var source = audioContext.createBufferSource();
      source.buffer = sounds[id];
      source.loop = !!loop;
      source.connect(audioContext.destination);
      source.start(0);

      if (loop) {
        musicSource = source;
      } else {
        playing[id] = source;
        source.onended = function() { delete playing[id]; };
      }
    } catch (e) {
      console.error('[AUDIO] Play error', id, ':', e);
    }
  }

  /**
   * Stop background music
   */
  function stopMusic() {
    if (musicSource) {
      try { musicSource.stop(); } catch (e) {}
      musicSource = null;
    }
  }

  /**
   * Stop a specific sound
   */
  function stopSound(id) {
    if (playing[id]) {
      try { playing[id].stop(); } catch (e) {}
      delete playing[id];
    }
  }

  // Create global soundManager mock
  window.soundManager = {
    url: '',
    debugMode: false,
    loaded: true,

    onload: function() {},

    createSound: function(options) {
      var id = options.id;
      var url = options.url;

      loadSound(id, url);

      return {
        id: id,
        load: function() {},
        play: function(opts) {
          var loop = opts && (opts.loops !== undefined);
          playSound(id, loop);
        },
        stop: function() {
          stopSound(id);
        }
      };
    },

    play: function(id, options) {
      var loop = options && options.loops !== undefined;
      playSound(id, loop);
    },

    stop: function(id) {
      stopSound(id);
    },

    stopAll: function() {
      for (var id in playing) {
        stopSound(id);
      }
      stopMusic();
    },

    supported: function() {
      return true;
    }
  };

  // Resume audio context on any user interaction (browsers may suspend it)
  var resumeHandler = function() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(function() {
        console.log('[AUDIO] Context resumed to:', audioContext.state);
      });
    }
    // Remove once running
    if (audioContext && audioContext.state === 'running') {
      document.removeEventListener('mousedown', resumeHandler);
      document.removeEventListener('click', resumeHandler);
      document.removeEventListener('touchstart', resumeHandler);
    }
  };

  // Initialize on user interaction - listen for ALL event types the game uses
  var enableAudio = function() {
    if (soundsLoaded) return;
    soundsLoaded = true;

    console.log('[AUDIO] User interaction detected, initializing...');
    initAudio();

    // Remove init listeners
    document.removeEventListener('click', enableAudio);
    document.removeEventListener('mousedown', enableAudio);
    document.removeEventListener('touchstart', enableAudio);
    document.removeEventListener('keydown', enableAudio);

    // Add persistent resume listeners (removed once context is running)
    document.addEventListener('mousedown', resumeHandler);
    document.addEventListener('click', resumeHandler);
    document.addEventListener('touchstart', resumeHandler);

    // Load all game sounds
    if (typeof SoundManager_Loaded === 'function') {
      SoundManager_Loaded();
    }
  };

  // The game uses onmousedown for ALL buttons, so mousedown is critical
  document.addEventListener('mousedown', enableAudio);
  document.addEventListener('click', enableAudio);
  document.addEventListener('touchstart', enableAudio);
  document.addEventListener('keydown', enableAudio);

  console.log('[AUDIO] Simple Audio System ready');
})();
