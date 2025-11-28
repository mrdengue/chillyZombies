/**
 * Enable Canvas Rendering - Simple and Safe
 * Just enables canvas rendering, no fancy effects
 */

(function() {
  console.log('[CANVAS] Enabling simple Canvas renderer...');

  // Wait for game to load
  function enableCanvasWhenReady() {
    if (typeof CanvasRenderer === 'undefined') {
      console.log('[CANVAS] Waiting for CanvasRenderer...');
      setTimeout(enableCanvasWhenReady, 100);
      return;
    }

    // Just enable canvas rendering (parallel with DOM)
    CanvasRenderer.enable();
    console.log('[CANVAS] ✓ Canvas rendering enabled (hybrid mode)');
    console.log('[CANVAS] Both Canvas and DOM rendering active');
  }

  enableCanvasWhenReady();
})();
