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
  let canvasOnlyMode = false; // When true, skip DOM sprite creation entirely

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
   * Clear the canvas and draw background
   */
  function clearCanvas() {
    if (!ctx) return;

    // Fill with white background (game default)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background image if available
    if (window.g_BackgroundImage && g_BackgroundImage.complete) {
      ctx.drawImage(g_BackgroundImage, 0, 0);
    }
  }

  /**
   * Render a single sprite to canvas
   */
  function renderSpriteToCanvas(sprite, viewportX, viewportY) {
    if (!ctx) return;

    // Check visibility (match original RenderSpriteObject logic)
    const invisible = (!sprite.Visible || sprite.TextLabel || (sprite.Camera != -1));
    if (invisible) return;

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

    // Get the actual image from g_AnimTypes
    if (!window.g_AnimTypes || !g_AnimTypes[sprite.Type]) return;

    const animState = sprite.AnimationState || 'idle';
    const animData = g_AnimTypes[sprite.Type][animState];

    if (!animData || !animData.Image) return;

    const img = animData.Image;
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

  /**
   * Enable Canvas-only mode (skip DOM sprite creation)
   */
  function enableCanvasOnly() {
    canvasOnlyMode = true;
    enableCanvas();
    console.log('[CANVAS] Canvas-only mode enabled - DOM sprites will not be created');
  }

  /**
   * Disable Canvas-only mode (re-enable DOM sprites)
   */
  function disableCanvasOnly() {
    canvasOnlyMode = false;
    console.log('[CANVAS] Canvas-only mode disabled');
  }

  /**
   * Check if in Canvas-only mode
   */
  function isCanvasOnlyMode() {
    return canvasOnlyMode;
  }

  // Export to global scope
  window.CanvasRenderer = {
    init: initCanvas,
    enable: enableCanvas,
    disable: disableCanvas,
    isEnabled: isCanvasEnabled,
    enableCanvasOnly: enableCanvasOnly,
    disableCanvasOnly: disableCanvasOnly,
    isCanvasOnlyMode: isCanvasOnlyMode,
    renderAll: renderAllSprites,
    renderSprite: renderSpriteToCanvas,
    getCanvas: () => canvas,
    getContext: () => ctx
  };

  console.log('[CANVAS] Canvas Renderer loaded');
})();
