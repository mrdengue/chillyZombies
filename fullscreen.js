/**
 * Responsive Display Manager for Chilly Zombies
 *
 * Desktop: 960x520 native viewport, CSS scale-down if window is narrow.
 * Mobile:  480xDynamic viewport via setGameViewportSize(), CSS scale to fill width.
 * Portrait: 480x(270-340) scene scaled to the full screen width; HUD and the
 *          touch control panel are laid out natively below it (body.mode-portrait).
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

  // Modo vertical (telefono parado): escena arriba a todo el ancho y panel
  // tactil de inventario/verbos abajo, como la pantalla de un juego SCUMM.
  var PORTRAIT_WORLD_W = 480;   // ancho de un nivel completo
  var PORTRAIT_MIN_H = 270;     // el nivel mide ~260 de alto
  var PORTRAIT_MAX_H = 420;
  var PORTRAIT_HUD_EST = 46;    // barra superior
  var PORTRAIT_CTRL_MIN = 300;  // panel de inventario + verbos + linea de frase

  var container = null;
  var isMobile = false;
  var isPortrait = false;
  var currentScale = 1;
  var didAutoFullscreen = false;

  function init() {
    container = document.getElementById('id_div_container');
    if (!container) return;

    detectDevice();
    applyMode();

    window.addEventListener('resize', debounce(onResize, 150));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debounce(onResize, 150));
    }
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
    // telefonos: el lado corto de la pantalla es chico (vale tambien en horizontal)
    var narrow = Math.min(window.innerWidth, window.innerHeight) < 600;
    // Vertical: cualquier pantalla mas alta que ancha y no gigante (telefonos,
    // tablets paradas, ventanas angostas).
    isPortrait = window.innerHeight > window.innerWidth * 1.05 && window.innerWidth < 1100;
    isMobile = (hasTouch && narrow) || isPortrait;

    document.body.classList.toggle('mode-portrait', isPortrait);
    document.body.classList.toggle('mode-mobile', isMobile);
    document.body.classList.toggle('mode-desktop', !isMobile);
  }

  function applyMode() {
    if (isPortrait) {
      applyPortraitMode();
    } else if (isMobile) {
      applyMobileMode();
    } else {
      applyDesktopMode();
    }
  }

  // Estimate the total container height (game area + topboard + controls + margins)
  var TOPBOARD_EST = 44;
  var CONTROLPANEL_EST = 84;
  var MARGINS_EST = 20;

  function frameEl() {
    return document.getElementById('div_moviescreenframe');
  }

  function clearFrameScale() {
    var f = frameEl();
    if (!f) return;
    f.style.removeProperty('transform');
    f.style.removeProperty('margin');
    document.body.style.removeProperty('--portrait-scale');
  }

  function viewportSize() {
    var vv = window.visualViewport;
    return {
      w: Math.round(vv ? vv.width : window.innerWidth),
      h: Math.round(vv ? vv.height : window.innerHeight)
    };
  }

  function applyPortraitMode() {
    var v = viewportSize();
    // Escala para que el nivel completo ocupe todo el ancho
    var s = v.w / PORTRAIT_WORLD_W;
    var room = v.h - PORTRAIT_HUD_EST - PORTRAIT_CTRL_MIN;
    var worldH = Math.floor(room / s);
    if (worldH < PORTRAIT_MIN_H) {
      // pantalla muy baja: achicamos la escena para que entren los controles
      worldH = PORTRAIT_MIN_H;
      s = Math.max(0.4, Math.min(s, room / PORTRAIT_MIN_H));
    }
    worldH = Math.min(worldH, PORTRAIT_MAX_H);

    if (typeof setGameViewportSize === 'function') {
      setGameViewportSize(PORTRAIT_WORLD_W, worldH);
    }
    if (container) {
      container.style.transform = '';
      container.style.transformOrigin = '';
    }
    var f = frameEl();
    if (f) {
      var w = PORTRAIT_WORLD_W * s;
      var h = worldH * s;
      var left = Math.max(0, Math.floor((v.w - w) / 2));
      f.style.setProperty('transform', 'scale(' + s + ')', 'important');
      // la caja de layout ocupa exactamente el ancho de pantalla y el alto escalado
      f.style.setProperty('margin', '0 ' + (v.w - left - PORTRAIT_WORLD_W) + 'px ' + (h - worldH) + 'px ' + left + 'px', 'important');
    }
    document.body.style.setProperty('--portrait-scale', String(s));
    currentScale = s;
    console.log('[DISPLAY] Portrait: ' + PORTRAIT_WORLD_W + 'x' + worldH + ', scale=' + s.toFixed(2));
  }

  function applyDesktopMode() {
    clearFrameScale();
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
    clearFrameScale();
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
    isPortrait: function() { return isPortrait; },
    getScale: function() { return currentScale; },
    reapply: function() { applyMode(); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
