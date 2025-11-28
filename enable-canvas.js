/**
 * Enable Canvas Rendering Test Script
 *
 * This script enables canvas rendering and hides DOM sprites
 * for testing the Canvas2D renderer
 */

(function() {
  console.log('[TEST] Enabling Canvas renderer...');

  // Wait for game to load
  function enableCanvasWhenReady() {
    if (typeof CanvasRenderer === 'undefined') {
      console.log('[TEST] Waiting for CanvasRenderer...');
      setTimeout(enableCanvasWhenReady, 100);
      return;
    }

    // Enable canvas rendering
    CanvasRenderer.enable();
    console.log('[TEST] ✓ Canvas rendering enabled');

    // Hide DOM sprites container to only see canvas
    const movieFrame = document.getElementById('div_moviescreenframe');
    if (movieFrame) {
      // Keep canvas but hide DOM sprites
      const sprites = movieFrame.querySelectorAll('img');
      sprites.forEach(sprite => {
        if (sprite.id !== 'game-canvas') {
          sprite.style.opacity = '0.2'; // Dim DOM sprites to see canvas
        }
      });
      console.log('[TEST] DOM sprites dimmed to see canvas');
    }

    // Add toggle function to console
    window.toggleCanvas = function() {
      if (CanvasRenderer.isEnabled()) {
        CanvasRenderer.disable();
        console.log('[TEST] Canvas DISABLED - using DOM');
      } else {
        CanvasRenderer.enable();
        console.log('[TEST] Canvas ENABLED');
      }
    };

    console.log('[TEST] Use toggleCanvas() to switch between Canvas and DOM rendering');
  }

  enableCanvasWhenReady();
})();
