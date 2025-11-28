/**
 * Retro Graphics Enhancement System
 * 16-bit SNES-style visual improvements
 */

(function() {
  'use strict';

  // Settings
  let settings = {
    scale: 2,                    // 2x or 3x upscaling
    snesColorGrading: true,      // SNES-style color enhancement
    scanlines: true,             // CRT scanline effect
    crtGlow: false,              // CRT glow effect (subtle)
    pixelPerfect: true,          // Crisp pixel rendering
    fullscreen: false            // Fullscreen mode
  };

  let canvas = null;
  let container = null;
  let scanlinesCanvas = null;
  let originalWidth = 480;
  let originalHeight = 260;

  /**
   * Initialize retro graphics system
   */
  function init() {
    console.log('[RETRO] Initializing 16-bit graphics enhancement...');

    // Wait for canvas to be ready
    waitForCanvas();
  }

  /**
   * Wait for main game canvas
   */
  function waitForCanvas() {
    if (window.CanvasRenderer && CanvasRenderer.getCanvas()) {
      canvas = CanvasRenderer.getCanvas();
      setupGraphicsEnhancements();
    } else {
      setTimeout(waitForCanvas, 100);
    }
  }

  /**
   * Setup all graphics enhancements
   */
  function setupGraphicsEnhancements() {
    console.log('[RETRO] Setting up graphics enhancements...');

    // Apply pixel-perfect rendering
    if (settings.pixelPerfect) {
      applyPixelPerfectRendering();
    }

    // Create container for scaling
    createScaledContainer();

    // Apply SNES color grading
    if (settings.snesColorGrading) {
      applySNESColorGrading();
    }

    // Create scanlines overlay
    if (settings.scanlines) {
      createScanlinesOverlay();
    }

    // Setup fullscreen support
    setupFullscreen();

    // Apply initial scale
    applyScale(settings.scale);

    console.log('[RETRO] ✓ Graphics enhancements applied');
    console.log('[RETRO] Scale:', settings.scale + 'x');
    console.log('[RETRO] SNES Colors:', settings.snesColorGrading);
    console.log('[RETRO] Scanlines:', settings.scanlines);
  }

  /**
   * Apply pixel-perfect rendering (no blur)
   */
  function applyPixelPerfectRendering() {
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.imageRendering = '-webkit-optimize-contrast';
    console.log('[RETRO] Pixel-perfect rendering enabled');
  }

  /**
   * Create scaled container
   */
  function createScaledContainer() {
    // Find the game container
    container = document.getElementById('div_moviescreenframe');
    if (!container) {
      container = canvas.parentElement;
    }

    // Set container to allow scaling
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.imageRendering = 'pixelated';
  }

  /**
   * Apply SNES-style color grading
   */
  function applySNESColorGrading() {
    // CSS filter for SNES-like colors: more saturated, slightly warmer
    canvas.style.filter = 'saturate(1.2) contrast(1.1) brightness(1.05) hue-rotate(-2deg)';
    console.log('[RETRO] SNES color grading applied');
  }

  /**
   * Create scanlines overlay
   */
  function createScanlinesOverlay() {
    scanlinesCanvas = document.createElement('canvas');
    scanlinesCanvas.id = 'scanlines-overlay';
    scanlinesCanvas.width = originalWidth;
    scanlinesCanvas.height = originalHeight;
    scanlinesCanvas.style.position = 'absolute';
    scanlinesCanvas.style.left = '0px';
    scanlinesCanvas.style.top = '0px';
    scanlinesCanvas.style.pointerEvents = 'none';
    scanlinesCanvas.style.imageRendering = 'pixelated';
    scanlinesCanvas.style.zIndex = '1000';

    // Draw scanlines
    const ctx = scanlinesCanvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < originalHeight; y += 2) {
      ctx.fillRect(0, y, originalWidth, 1);
    }

    // Add to container
    if (canvas.parentElement) {
      canvas.parentElement.appendChild(scanlinesCanvas);
    }

    console.log('[RETRO] Scanlines overlay created');
  }

  /**
   * Apply scaling to canvas
   */
  function applyScale(scale) {
    settings.scale = scale;

    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    canvas.style.width = scaledWidth + 'px';
    canvas.style.height = scaledHeight + 'px';

    if (scanlinesCanvas) {
      scanlinesCanvas.style.width = scaledWidth + 'px';
      scanlinesCanvas.style.height = scaledHeight + 'px';
    }

    if (container) {
      container.style.width = scaledWidth + 'px';
      container.style.height = scaledHeight + 'px';
    }

    console.log('[RETRO] Scale applied:', scale + 'x (' + scaledWidth + 'x' + scaledHeight + ')');
  }

  /**
   * Setup fullscreen support
   */
  function setupFullscreen() {
    // Add fullscreen button
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.id = 'fullscreen-btn';
    fullscreenBtn.textContent = '⛶ Fullscreen';
    fullscreenBtn.style.position = 'fixed';
    fullscreenBtn.style.top = '10px';
    fullscreenBtn.style.right = '10px';
    fullscreenBtn.style.zIndex = '10000';
    fullscreenBtn.style.padding = '10px 15px';
    fullscreenBtn.style.backgroundColor = '#333';
    fullscreenBtn.style.color = '#fff';
    fullscreenBtn.style.border = '2px solid #666';
    fullscreenBtn.style.borderRadius = '5px';
    fullscreenBtn.style.cursor = 'pointer';
    fullscreenBtn.style.fontFamily = 'monospace';
    fullscreenBtn.style.fontSize = '14px';

    fullscreenBtn.onclick = toggleFullscreen;

    document.body.appendChild(fullscreenBtn);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);

    console.log('[RETRO] Fullscreen support enabled');
  }

  /**
   * Toggle fullscreen mode
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }

  /**
   * Enter fullscreen mode
   */
  function enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    }

    settings.fullscreen = true;
  }

  /**
   * Exit fullscreen mode
   */
  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }

    settings.fullscreen = false;
  }

  /**
   * Handle fullscreen change
   */
  function onFullscreenChange() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);

    if (isFullscreen) {
      // Calculate scale to fit screen while maintaining aspect ratio
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const scaleX = screenWidth / originalWidth;
      const scaleY = screenHeight / originalHeight;
      const scale = Math.floor(Math.min(scaleX, scaleY));

      applyScale(Math.max(1, scale));

      // Center the canvas
      if (container) {
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.top = '50%';
        container.style.transform = 'translate(-50%, -50%)';
      }

      console.log('[RETRO] Fullscreen enabled - scale:', scale + 'x');
    } else {
      // Return to normal scale
      applyScale(2);

      if (container) {
        container.style.position = 'relative';
        container.style.left = '0';
        container.style.top = '0';
        container.style.transform = 'none';
      }

      console.log('[RETRO] Fullscreen disabled');
    }
  }

  /**
   * Set scale (1x, 2x, 3x, etc.)
   */
  function setScale(scale) {
    applyScale(scale);
  }

  /**
   * Toggle scanlines
   */
  function toggleScanlines() {
    settings.scanlines = !settings.scanlines;
    if (scanlinesCanvas) {
      scanlinesCanvas.style.display = settings.scanlines ? 'block' : 'none';
    }
    console.log('[RETRO] Scanlines:', settings.scanlines);
  }

  /**
   * Toggle SNES color grading
   */
  function toggleSNESColors() {
    settings.snesColorGrading = !settings.snesColorGrading;
    if (settings.snesColorGrading) {
      applySNESColorGrading();
    } else {
      canvas.style.filter = 'none';
    }
    console.log('[RETRO] SNES Colors:', settings.snesColorGrading);
  }

  // Export to global scope
  window.RetroGraphics = {
    init: init,
    setScale: setScale,
    toggleFullscreen: toggleFullscreen,
    toggleScanlines: toggleScanlines,
    toggleSNESColors: toggleSNESColors,
    getSettings: () => settings
  };

  // Auto-initialize
  console.log('[RETRO] Retro Graphics System loaded');
  setTimeout(init, 500); // Wait for canvas to be ready
})();
