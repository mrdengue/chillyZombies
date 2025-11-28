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

    // Enable Canvas-only mode (no DOM sprites)
    CanvasRenderer.enableCanvasOnly();
    console.log('[TEST] ✓ Canvas-only mode enabled');
    console.log('[TEST] DOM sprites will NOT be created - performance optimized!');

    // Add toggle function to console
    window.toggleCanvasOnly = function() {
      if (CanvasRenderer.isCanvasOnlyMode()) {
        CanvasRenderer.disableCanvasOnly();
        console.log('[TEST] Canvas-only mode DISABLED - will create DOM sprites for new sprites');
      } else {
        CanvasRenderer.enableCanvasOnly();
        console.log('[TEST] Canvas-only mode ENABLED - DOM sprites skipped');
      }
    };

    console.log('[TEST] Use toggleCanvasOnly() to toggle Canvas-only mode');
  }

  enableCanvasWhenReady();
})();
