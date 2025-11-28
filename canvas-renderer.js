/**
 * Canvas Renderer for Chilly Zombies
 * Hardware-accelerated rendering using Canvas2D
 */

(function() {
  'use strict';

  // Canvas setup
  let canvas = null;
  let ctx = null;
  let useCanvas = false; // Start disabled, can be toggled

  /**
   * Initialize canvas rendering
   */
  function initCanvas() {
    console.log('[CANVAS] Initializing Canvas renderer...');

    // Create canvas element
    canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    canvas.width = 480;  // g_FixedScreen_Width
    canvas.height = 260; // g_FixedScreen_Height
    canvas.style.position = 'absolute';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.style.imageRendering = 'pixelated'; // Crisp pixel art
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = 'crisp-edges';

    // Get 2D context
    ctx = canvas.getContext('2d', {
      alpha: false, // Opaque canvas for better performance
      desynchronized: true // Hint for lower latency
    });

    // Disable image smoothing for pixel art
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    console.log('[CANVAS] ✓ Canvas created: 480x260');

    return canvas;
  }

  /**
   * Clear the canvas
   */
  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Render a single sprite to canvas
   */
  function renderSpriteToCanvas(sprite, viewportX, viewportY) {
    if (!ctx || !sprite.Image || !sprite.Visible) return;

    // Calculate screen position
    const screenX = Math.round(sprite.X) + viewportX;
    const screenY = Math.round(sprite.Y) + viewportY;

    // Check if sprite is on screen
    const spriteWidth = sprite.RealImageWidth || 0;
    const spriteHeight = sprite.RealImageHeight || 0;

    if (screenX + spriteWidth < 0 || screenX > canvas.width ||
        screenY + spriteHeight < 0 || screenY > canvas.height) {
      return; // Off screen, don't draw
    }

    // Get the image element
    const img = sprite.Image;
    if (!img.complete || !img.naturalWidth) {
      return; // Image not loaded yet
    }

    // Handle partial clipping
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = spriteWidth;
    let sourceHeight = spriteHeight;
    let destX = screenX;
    let destY = screenY;
    let destWidth = spriteWidth;
    let destHeight = spriteHeight;

    // Clip left
    if (screenX < 0) {
      sourceX = -screenX;
      sourceWidth += screenX;
      destX = 0;
      destWidth = sourceWidth;
    }

    // Clip right
    if (screenX + spriteWidth > canvas.width) {
      const overflow = (screenX + spriteWidth) - canvas.width;
      sourceWidth -= overflow;
      destWidth = sourceWidth;
    }

    // Clip top
    if (screenY < 0) {
      sourceY = -screenY;
      sourceHeight += screenY;
      destY = 0;
      destHeight = sourceHeight;
    }

    // Clip bottom
    if (screenY + spriteHeight > canvas.height) {
      const overflow = (screenY + spriteHeight) - canvas.height;
      sourceHeight -= overflow;
      destHeight = sourceHeight;
    }

    // Draw the sprite
    try {
      if (sourceWidth > 0 && sourceHeight > 0) {
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          destX, destY, destWidth, destHeight
        );
      }
    } catch (e) {
      // Silently ignore draw errors (image might not be ready)
    }
  }

  /**
   * Render all sprites from sprite pool
   */
  function renderAllSprites(spritePool, viewportX, viewportY) {
    if (!ctx || !useCanvas) return;

    // Clear canvas
    clearCanvas();

    // Render each sprite
    for (let i in spritePool) {
      const sprite = spritePool[i];
      if (sprite && sprite.Image) {
        renderSpriteToCanvas(sprite, viewportX, viewportY);
      }
    }
  }

  /**
   * Enable canvas rendering
   */
  function enableCanvas() {
    if (!canvas) {
      const canvasElement = initCanvas();
      // Insert canvas into the game container
      const container = document.getElementById('div_moviescreenframe');
      if (container) {
        container.appendChild(canvasElement);
        console.log('[CANVAS] Canvas added to div_moviescreenframe');
      } else {
        document.body.appendChild(canvasElement);
        console.log('[CANVAS] Canvas added to body');
      }
    }

    useCanvas = true;
    console.log('[CANVAS] Canvas rendering enabled');
  }

  /**
   * Disable canvas rendering (fallback to DOM)
   */
  function disableCanvas() {
    useCanvas = false;
    console.log('[CANVAS] Canvas rendering disabled');
  }

  /**
   * Check if canvas is enabled
   */
  function isCanvasEnabled() {
    return useCanvas;
  }

  // Export to global scope
  window.CanvasRenderer = {
    init: initCanvas,
    enable: enableCanvas,
    disable: disableCanvas,
    isEnabled: isCanvasEnabled,
    renderAll: renderAllSprites,
    renderSprite: renderSpriteToCanvas,
    getCanvas: () => canvas,
    getContext: () => ctx
  };

  console.log('[CANVAS] Canvas Renderer loaded');
})();
