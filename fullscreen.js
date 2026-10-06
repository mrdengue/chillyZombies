/**
 * Responsive Display Manager for Chilly Zombies
 *
 * Desktop: 960x520 native viewport, CSS scale-down if window is narrow.
 * Mobile:  480xDynamic viewport via setGameViewportSize(), CSS scale to fill width.
 *          Auto-requests fullscreen on first touch.
 *
 * Sets body.mode-desktop or body.mode-mobile for CSS targeting.
 * Scales #id_div_container (not individual frame) so topboard + controls scale too.
 */
(function() {
  'use strict';

  var DESKTOP_WIDTH = 960;
  var DESKTOP_HEIGHT = 520;
  var MOBILE_WIDTH = 480;
  var MOBILE_MIN_HEIGHT = 260;
  var MOBILE_MAX_HEIGHT = 420;

  var container = null;
  var isMobile = false;
  var currentScale = 1;
  var didAutoFullscreen = false;

  function init() {
    container = document.getElementById('id_div_container');
    if (!container) return;

    detectDevice();
    applyMode();

    window.addEventListener('resize', debounce(onResize, 150));
    window.addEventListener('orientationchange', function() {
      setTimeout(function() { detectDevice(); applyMode(); }, 350);
    });

    // Mobile: auto-fullscreen on first touch
    if (isMobile) {
      document.addEventListener('touchstart', tryAutoFullscreen, { once: true });
    }

    console.log('[DISPLAY] Init. Mode: ' + (isMobile ? 'mobile' : 'desktop'));
  }

  function detectDevice() {
    var hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    var narrow = window.innerWidth < 768;
    isMobile = hasTouch && narrow;

    document.body.classList.toggle('mode-mobile', isMobile);
    document.body.classList.toggle('mode-desktop', !isMobile);
  }

  function applyMode() {
    if (isMobile) {
      applyMobileMode();
    } else {
      applyDesktopMode();
    }
  }

  // Estimate the total container height (game area + topboard + controls + margins)
  var TOPBOARD_EST = 44;
  var CONTROLPANEL_EST = 60;
  var MARGINS_EST = 20;

  function applyDesktopMode() {
    if (typeof setGameViewportSize === 'function') {
      setGameViewportSize(DESKTOP_WIDTH, DESKTOP_HEIGHT);
    }

    if (!container) return;

    var availW = window.innerWidth;
    var availH = window.innerHeight;
    var totalH = DESKTOP_HEIGHT + TOPBOARD_EST + CONTROLPANEL_EST + MARGINS_EST;

    // Scale to fit both width and height
    var scaleW = availW / (DESKTOP_WIDTH + 20);
    var scaleH = availH / totalH;
    var scale = Math.min(scaleW, scaleH, 1);

    if (scale < 1) {
      container.style.transform = 'scale(' + scale + ')';
      container.style.transformOrigin = 'top center';
      currentScale = scale;
    } else {
      container.style.transform = '';
      container.style.transformOrigin = '';
      currentScale = 1;
    }
  }

  function applyMobileMode() {
    // Calculate mobile game area height from screen aspect ratio
    var screenRatio = window.innerHeight / window.innerWidth;
    var mobileHeight = Math.round(MOBILE_WIDTH * screenRatio);
    mobileHeight = Math.max(mobileHeight, MOBILE_MIN_HEIGHT);
    mobileHeight = Math.min(mobileHeight, MOBILE_MAX_HEIGHT);

    if (typeof setGameViewportSize === 'function') {
      setGameViewportSize(MOBILE_WIDTH, mobileHeight);
    }

    if (!container) return;

    var availW = window.innerWidth;
    var availH = window.innerHeight;
    var totalH = mobileHeight + TOPBOARD_EST + CONTROLPANEL_EST + MARGINS_EST;

    // Scale to fit BOTH width and height (pick the smaller factor)
    var scaleW = availW / MOBILE_WIDTH;
    var scaleH = availH / totalH;
    var scale = Math.min(scaleW, scaleH, 2);
    currentScale = scale;

    // Always center the scaled container in the viewport
    var scaledW = MOBILE_WIDTH * scale;
    var scaledH = totalH * scale;
    var offsetX = Math.max(0, Math.floor((availW - scaledW) / 2));
    var offsetY = Math.max(0, Math.floor((availH - scaledH) / 2));

    container.style.transformOrigin = 'top left';
    container.style.transform = 'translate(' + offsetX + 'px, ' + offsetY + 'px) scale(' + scale + ')';

    console.log('[DISPLAY] Mobile: ' + MOBILE_WIDTH + 'x' + mobileHeight +
                ', scale=' + scale.toFixed(2) + ', offset=(' + offsetX + ',' + offsetY + ')');
  }

  function tryAutoFullscreen() {
    if (didAutoFullscreen || !isMobile) return;
    didAutoFullscreen = true;

    var el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(function() {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }

  function onResize() {
    detectDevice();
    applyMode();
  }

  function debounce(fn, delay) {
    var timer = null;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  // Export for other modules
  window.FullscreenManager = {
    isMobile: function() { return isMobile; },
    getScale: function() { return currentScale; },
    reapply: function() { applyMode(); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
