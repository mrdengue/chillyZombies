/**
 * dott-fx.js - Capa visual "LucasArts 1993" para Chilly Zombies.
 *
 * Solo cambia la presentacion; la logica del juego queda intacta:
 *  - pinta el suelo nevado (tile pixel art) bajo los sprites en vez del fondo blanco;
 *  - textos flotantes y frases de los personajes en su color, con contorno negro,
 *    como los dialogos de SCUMM;
 *  - cursor de cruz que cicla colores;
 *  - verbos de texto en el panel de habilidades.
 */
(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Cursor de cruz que cambia de color (como en DOTT)
  // ------------------------------------------------------------------
  var cursorFrame = 0;
  function cycleCursor() {
    if (document.body) document.body.setAttribute('data-cursor', String(cursorFrame));
    cursorFrame = (cursorFrame + 1) % 4;
  }
  setInterval(cycleCursor, 180);

  // ------------------------------------------------------------------
  // Suelo pintado bajo los sprites
  // ------------------------------------------------------------------
  var groundImg = new Image();
  var groundPattern = null;
  groundImg.src = 'ground_tile.png';

  function mod(a, n) { return ((a % n) + n) % n; }

  function paintGround(ctx, canvas, viewportX, viewportY) {
    if (!groundPattern && groundImg.complete && groundImg.naturalWidth) {
      groundPattern = ctx.createPattern(groundImg, 'repeat');
    }
    if (groundPattern) {
      var ox = mod(Math.round(viewportX || 0), groundImg.naturalWidth);
      var oy = mod(Math.round(viewportY || 0), groundImg.naturalHeight);
      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = groundPattern;
      ctx.fillRect(-ox, -oy, canvas.width, canvas.height);
      ctx.restore();
    } else {
      ctx.fillStyle = '#d6d4fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  // El motor crea el canvas dos veces (CanvasRenderer.init) y su renderer dibuja
  // en uno que no esta en la pagina, por eso el fondo siempre se veia blanco.
  // Pintamos el suelo en el canvas visible, siguiendo a la camara en cada cuadro.
  function groundLoop() {
    requestAnimationFrame(groundLoop);
    var canvas = document.getElementById('game-canvas');
    if (!canvas || !canvas.offsetParent || window.g_ViewPort_X === undefined) return;
    // CanvasRenderer.resize() redimensiona la copia invisible: mantenemos el
    // canvas visible del mismo tamano que la escena (cambia al rotar el telefono)
    if (window.g_FixedScreen_Width && (canvas.width !== g_FixedScreen_Width || canvas.height !== g_FixedScreen_Height)) {
      canvas.width = g_FixedScreen_Width;
      canvas.height = g_FixedScreen_Height;
    }
    var ctx = canvas.getContext('2d');
    if (ctx) paintGround(ctx, canvas, g_ViewPort_X, g_ViewPort_Y);
  }
  requestAnimationFrame(groundLoop);

  // Marco de arma seleccionada: lo alineamos y dimensionamos sobre el icono del
  // inventario (los iconos cambian de tamano segun el modo de pantalla).
  function selectorLoop() {
    requestAnimationFrame(selectorLoop);
    var ind = window.Game_g_ControlBar_SelectIndicator;
    var btn = window.Game_g_ControlBar_SelectedButton;
    if (!ind || !btn || !btn.getBoundingClientRect || !ind.offsetParent) return;
    var par = ind.offsetParent;
    var pr = par.getBoundingClientRect();
    var br = btn.getBoundingClientRect();
    if (!br.width || !par.offsetWidth) return;
    // el contenedor puede estar escalado con transform (escritorio angosto)
    var k = pr.width / par.offsetWidth || 1;
    var set = function (prop, val) {
      val = Math.round(val) + 'px';
      if (ind.style.getPropertyValue(prop) !== val) ind.style.setProperty(prop, val, 'important');
    };
    set('left', (br.left - pr.left) / k - par.clientLeft);
    set('top', (br.top - pr.top) / k - par.clientTop);
    set('width', br.width / k);
    set('height', br.height / k);
  }
  requestAnimationFrame(selectorLoop);

  // ------------------------------------------------------------------
  // Textos con estilo SCUMM
  // ------------------------------------------------------------------
  var PLAYER_COLORS = {
    Player: '#8ab8ff', Player2: '#ff8a6e', Player3: '#e0ff70',
    Player4: '#ffb050', Player5: '#7aeee0', Player6: '#d27ef2',
    Player7: '#ffe070', Player8: '#9cf060', Player9: '#ffa0d2'
  };

  // Colores chillones de la epoca para los textos que el juego pasa en hex moderno
  function vgaColor(c) {
    if (!c) return '#ffffff';
    var map = { '#FFD700': '#ffe040', '#00FF88': '#7af0a0', '#FF4400': '#ff6a5a', '#88CCFF': '#8ad8f8' };
    return map[String(c).toUpperCase()] || c;
  }

  function frame() { return document.getElementById('div_moviescreenframe'); }

  // Reemplaza el texto flotante del juego (misma firma y misma duracion)
  function installFloatingText() {
    if (typeof window.Game_ShowFloatingText !== 'function' || window.Game_ShowFloatingText._dott) return false;
    var fn = function (text, color, Sprite) {
      var el = document.createElement('div');
      el.className = 'dott-float';
      el.textContent = text;
      el.style.color = vgaColor(color);
      if (Sprite && window.g_ViewPort_X !== undefined) {
        el.style.left = (Sprite.X + g_ViewPort_X) + 'px';
        el.style.top = (Sprite.Y + g_ViewPort_Y - 20) + 'px';
      } else {
        el.style.left = '50%';
        el.style.top = '40%';
        el.style.transform = 'translateX(-50%)';
      }
      var c = frame();
      if (c) c.appendChild(el);
      setTimeout(function () { el.style.top = (parseInt(el.style.top, 10) - 30) + 'px'; el.style.opacity = '0'; }, 50);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 900);
    };
    fn._dott = true;
    window.Game_ShowFloatingText = fn;
    return true;
  }

  // ------------------------------------------------------------------
  // Frases de los personajes (solo decorativas)
  // ------------------------------------------------------------------
  var QUIPS = {
    kill: ["Take that, ice-cube brain!", "Back to the freezer!", "That's gotta sting.",
           "I'm rubber, you're slush.", "Nobody ruins MY holidays.", "Yuck. Zombie slush.",
           "Another one bites the snow.", "Sorry! ...Not sorry."],
    spawned_dinosaur: ["Uh-oh. That's no reindeer.", "A DINOSAUR?! In WINTER?!", "We're gonna need a bigger snowball."],
    spawned_snowman: ["Who built THAT?", "Frosty looks grumpy today."],
    spawned_sheep: ["Zombie sheep. Of course.", "Baaa-d news."],
    spawned_zombiess: ["Nice hat, creepy.", "That one's tall and rude."],
    spawned_zombie: ["Here they come again...", "Don't they ever sleep?"],
    levelachieved: ["Piece of fruitcake!", "Too easy. Next!", "I love the smell of snowballs."],
    iceblockdown: ["There goes the wall!", "My beautiful ice wall!"],
    playerkilled: ["Aaargh!", "I'll be back... after cocoa."]
  };
  var CHANCE = {
    kill: 0.12, spawned_dinosaur: 0.9, spawned_snowman: 0.3, spawned_sheep: 0.35,
    spawned_zombiess: 0.3, spawned_zombie: 0.08, levelachieved: 1, iceblockdown: 0.5, playerkilled: 1
  };
  var lastSay = 0;
  var current = null;

  function pickSpeaker() {
    var p = window.Game_PlayerShooter;
    if (p && p.Visible !== false) return p;
    var pool = window.g_SpritePool;
    if (!pool) return null;
    for (var k in pool) {
      var s = pool[k];
      if (s && s.Type && /^Player\d?$/.test(s.Type) && s.Visible !== false && s.LivingState === 0) return s;
    }
    return null;
  }

  function say(sprite, text) {
    var c = frame();
    if (!c || !sprite || window.g_ViewPort_X === undefined) return;
    if (current && current.parentNode) current.parentNode.removeChild(current);
    var el = document.createElement('div');
    el.className = 'dott-say';
    el.textContent = text;
    el.style.color = PLAYER_COLORS[sprite.Type] || '#ffffff';
    var x = sprite.X + g_ViewPort_X + (sprite.RealImageWidth || 24) / 2;
    var y = sprite.Y + g_ViewPort_Y - 26;
    var w = c.clientWidth || 960;
    el.style.maxWidth = Math.round(w * 0.9) + 'px';
    el.style.whiteSpace = 'normal';
    el.style.width = 'max-content';
    el.style.left = '0px';
    el.style.top = Math.max(4, y) + 'px';
    c.appendChild(el);
    // que la frase entera quede dentro de la escena
    var half = el.offsetWidth / 2 + 4;
    x = Math.max(half, Math.min(w - half, x));
    el.style.left = x + 'px';
    current = el;
    var ms = 1400 + text.length * 55;
    setTimeout(function () { el.style.opacity = '0'; }, ms);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); if (current === el) current = null; }, ms + 400);
  }

  function maybeQuip(kind) {
    var list = QUIPS[kind];
    if (!list) return;
    var now = Date.now();
    var important = kind === 'levelachieved' || kind === 'playerkilled' || kind === 'spawned_dinosaur';
    if (!important && now - lastSay < 6000) return;
    if (Math.random() > (CHANCE[kind] || 0)) return;
    var who = pickSpeaker();
    if (!who) return;
    lastSay = now;
    say(who, list[Math.floor(Math.random() * list.length)]);
  }

  function installQuips() {
    if (typeof window.SoundPlay !== 'function' || window.SoundPlay._dott) return false;
    var orig = window.SoundPlay;
    var wrapped = function (name) {
      var r = orig.apply(this, arguments);
      try {
        if (name === 'zombiedead') maybeQuip('kill');
        else if (QUIPS[name]) maybeQuip(name);
      } catch (e) {}
      return r;
    };
    wrapped._dott = true;
    window.SoundPlay = wrapped;
    return true;
  }

  // ------------------------------------------------------------------
  // Verbos de texto en lugar de emojis en el panel de habilidades
  // ------------------------------------------------------------------
  var VERBS = {
    'id_turret_btn': 'Turret',
    'ability-freezeAll': 'Freeze',
    'ability-snowStorm': 'Storm',
    'ability-healPlayer': 'Heal',
    'autoshoot-btn': 'Auto-aim'
  };
  function installVerbs() {
    for (var id in VERBS) {
      var el = document.getElementById(id);
      if (!el) continue;
      for (var i = el.childNodes.length - 1; i >= 0; i--) {
        if (el.childNodes[i].nodeType === 3) el.removeChild(el.childNodes[i]);
      }
      el.appendChild(document.createTextNode(VERBS[id]));
    }
  }

  function init() {
    cycleCursor();
    installVerbs();
    (function waitGame() {
      var a = installFloatingText();
      var b = installQuips();
      if (!(window.Game_ShowFloatingText && window.Game_ShowFloatingText._dott &&
            window.SoundPlay && window.SoundPlay._dott)) setTimeout(waitGame, 200);
      return a || b;
    })();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.DottFX = { say: function (text) { say(pickSpeaker(), text); } };
})();
