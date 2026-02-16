/**
 * Fullscreen & Responsive Scale Manager for Chilly Zombies
 *
 * Handles two viewing modes:
 *
 * LANDSCAPE (desktop/tablet): 960x520 viewport
 *   - Shows the full wide view of the game
 *   - Scaled down to fit the screen if needed
 *
 * PORTRAIT (mobile phones): 520xDynamic viewport
 *   - 520px wide = level play area + margin for edge players
 *   - Height calculated from screen aspect ratio
 *   - Characters appear 2x BIGGER than landscape mode
 *   - Uses CSS transform: scale() to fit the phone screen
 *
 * The game's sprite engine uses the g_FixedScreen_Width/Height constants
 * for ALL viewport calculations. Changing them at runtime via
 * setGameViewportSize() automatically adjusts everything.
 */

(function() {
  'use strict';

  // Desktop/landscape dimensions
  var LANDSCAPE_WIDTH = 960;
  var LANDSCAPE_HEIGHT = 520;

  // Portrait base width (480 play area + 60px margin for scaled-up sprites at edges)
  var PORTRAIT_WIDTH = 540;
  var PORTRAIT_MIN_HEIGHT = 640;
  var PORTRAIT_MAX_HEIGHT = 1000;

  var wrapper = null;
  var gameFrame = null;
  var scaleWrapper = null;
  var fsButton = null;
  var currentMode = 'landscape'; // 'landscape' or 'portrait'
  var currentWidth = LANDSCAPE_WIDTH;
  var currentHeight = LANDSCAPE_HEIGHT;

  function init() {
    wrapper = document.getElementById('game-wrapper');
    gameFrame = document.getElementById('div_moviescreenframe');
    if (!wrapper || !gameFrame) return;

    // Create a scale wrapper around the game frame
    createScaleWrapper();

    createFullscreenButton();

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    window.addEventListener('resize', debounce(onResize, 100));

    document.addEventListener('keydown', function(e) {
      if (e.key === 'f' || e.key === 'F') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    });

    // Detect orientation and apply appropriate mode
    updateViewportMode();

    console.log('[DISPLAY] Initialized. Mode: ' + currentMode);
  }

  function createScaleWrapper() {
    scaleWrapper = document.createElement('div');
    scaleWrapper.id = 'game-scale-wrapper';
    scaleWrapper.style.margin = '10px auto';
    scaleWrapper.style.overflow = 'hidden';
    scaleWrapper.style.width = LANDSCAPE_WIDTH + 'px';
    scaleWrapper.style.height = LANDSCAPE_HEIGHT + 'px';
    scaleWrapper.style.maxWidth = '100%';

    gameFrame.parentNode.insertBefore(scaleWrapper, gameFrame);
    scaleWrapper.appendChild(gameFrame);
    gameFrame.style.margin = '0';
  }

  /**
   * Detect if we should use portrait or landscape mode,
   * switch the game viewport if needed, then scale to fit.
   */
  function updateViewportMode() {
    if (isInFullscreen()) {
      applyFullscreenScale();
      return;
    }

    var isPortrait = window.innerHeight > window.innerWidth;
    var isMobile = window.innerWidth < 900;
    var needsPortrait = isPortrait && isMobile;
    var newMode = needsPortrait ? 'portrait' : 'landscape';

    if (newMode !== currentMode) {
      currentMode = newMode;
      switchViewportMode(newMode);
    }

    applyResponsiveScale();
  }

  /**
   * Switch between landscape (960x520) and portrait (480xDynamic) viewport.
   */
  function switchViewportMode(mode) {
    if (mode === 'portrait') {
      // Calculate portrait height based on screen aspect ratio
      var screenRatio = window.innerHeight / window.innerWidth;
      var portraitHeight = Math.round(PORTRAIT_WIDTH * screenRatio);
      portraitHeight = Math.max(portraitHeight, PORTRAIT_MIN_HEIGHT);
      portraitHeight = Math.min(portraitHeight, PORTRAIT_MAX_HEIGHT);

      currentWidth = PORTRAIT_WIDTH;
      currentHeight = portraitHeight;

      console.log('[DISPLAY] → PORTRAIT mode: ' + currentWidth + 'x' + currentHeight +
                  ' (characters 2x bigger)');
    } else {
      currentWidth = LANDSCAPE_WIDTH;
      currentHeight = LANDSCAPE_HEIGHT;

      console.log('[DISPLAY] → LANDSCAPE mode: ' + currentWidth + 'x' + currentHeight);
    }

    // Update the game engine viewport
    if (typeof setGameViewportSize === 'function') {
      setGameViewportSize(currentWidth, currentHeight);
    }
  }

  function isInFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function toggleFullscreen() {
    if (!isInFullscreen()) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  function enterFullscreen() {
    var el = document.documentElement;
    var promise;
    if (el.requestFullscreen) {
      promise = el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      promise = el.webkitRequestFullscreen();
    }

    if (promise && screen.orientation && screen.orientation.lock) {
      promise.then(function() {
        screen.orientation.lock('landscape').catch(function() {});
      }).catch(function() {});
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  function onFullscreenChange() {
    if (isInFullscreen()) {
      // Fullscreen always uses landscape
      if (currentMode === 'portrait') {
        currentMode = 'landscape';
        switchViewportMode('landscape');
      }
      applyFullscreenScale();
    } else {
      removeFullscreenScale();
      updateViewportMode();
    }
    updateButtonIcon();
  }

  function onResize() {
    updateViewportMode();
  }

  /**
   * Scale the game frame to fit the available space.
   * Works for both portrait and landscape modes.
   */
  function applyResponsiveScale() {
    if (!gameFrame || !scaleWrapper) return;

    var availableWidth = window.innerWidth * 0.98;
    var availableHeight = window.innerHeight * (currentMode === 'portrait' ? 0.88 : 0.80);

    var scaleX = availableWidth / currentWidth;
    var scaleY = availableHeight / currentHeight;
    var scale = Math.min(scaleX, scaleY, 1);

    if (scale >= 0.99) {
      gameFrame.style.transform = '';
      gameFrame.style.transformOrigin = '';
      scaleWrapper.style.width = currentWidth + 'px';
      scaleWrapper.style.height = currentHeight + 'px';
      return;
    }

    gameFrame.style.transformOrigin = 'top left';
    gameFrame.style.transform = 'scale(' + scale + ')';

    scaleWrapper.style.width = Math.round(currentWidth * scale) + 'px';
    scaleWrapper.style.height = Math.round(currentHeight * scale) + 'px';
  }

  function applyFullscreenScale() {
    if (!wrapper) return;

    wrapper.classList.add('fullscreen-mode');
    wrapper.style.transform = 'translate(-50%, -50%)';

    if (gameFrame) {
      gameFrame.style.transform = '';
      gameFrame.style.transformOrigin = '';
    }
    if (scaleWrapper) {
      scaleWrapper.style.width = currentWidth + 'px';
      scaleWrapper.style.height = currentHeight + 'px';
    }

    var contentW = wrapper.offsetWidth;
    var contentH = wrapper.offsetHeight;
    contentW = Math.max(contentW, currentWidth);
    contentH = Math.max(contentH, currentHeight);

    var screenW = window.innerWidth;
    var screenH = window.innerHeight;

    var scaleX = screenW / contentW;
    var scaleY = screenH / contentH;
    var scale = Math.min(scaleX, scaleY);

    wrapper.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
  }

  function removeFullscreenScale() {
    if (!wrapper) return;
    wrapper.classList.remove('fullscreen-mode');
    wrapper.style.transform = '';
  }

  function createFullscreenButton() {
    fsButton = document.createElement('button');
    fsButton.id = 'fullscreen-btn';
    fsButton.className = 'fullscreen-btn';
    updateButtonIcon();

    fsButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleFullscreen();
    });

    document.body.appendChild(fsButton);
  }

  function updateButtonIcon() {
    if (!fsButton) return;
    if (isInFullscreen()) {
      fsButton.textContent = '\u2715';
      fsButton.title = 'Salir de pantalla completa (F)';
    } else {
      fsButton.textContent = '\u26F6';
      fsButton.title = 'Pantalla completa (F)';
    }
  }

  function debounce(fn, delay) {
    var timer = null;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  // Export
  window.FullscreenManager = {
    toggle: toggleFullscreen,
    isFullscreen: isInFullscreen,
    applyScale: applyResponsiveScale,
    getMode: function() { return currentMode; },
    getWidth: function() { return currentWidth; },
    getHeight: function() { return currentHeight; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
