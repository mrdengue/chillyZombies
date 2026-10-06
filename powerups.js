/**
 * Power-up System for Chilly Zombies
 * Collectible power-ups that grant temporary abilities
 */

(function() {
  'use strict';

  // Power-up definitions
  const POWERUP_TYPES = {
    SPEED_BOOST: {
      id: 'speed_boost',
      name: 'Speed Boost',
      letter: 'S',
      color: '#ffff00',
      icon: 'sprites/powerup_speed.svg',
      duration: 15000, // 15 seconds
      rarity: 'common',
      description: 'Move 3x faster!'
    },
    RAPID_FIRE: {
      id: 'rapid_fire',
      name: 'Rapid Fire',
      letter: 'R',
      color: '#ff6600',
      icon: 'sprites/powerup_rapidfire.svg',
      duration: 15000,
      rarity: 'common',
      description: 'Double ammo capacity!'
    },
    SHIELD: {
      id: 'shield',
      name: 'Shield',
      letter: 'H',
      color: '#00ccff',
      icon: 'sprites/powerup_shield.svg',
      duration: 12000,
      rarity: 'rare',
      description: 'Invulnerable!'
    },
    MEGA_AMMO: {
      id: 'mega_ammo',
      name: 'Mega Ammo',
      letter: 'A',
      color: '#00ff00',
      icon: 'sprites/powerup_ammo.svg',
      duration: 0, // Instant
      rarity: 'common',
      description: '+100 Snow Stock!'
    },
    FREEZE: {
      id: 'freeze',
      name: 'Freeze',
      letter: 'F',
      color: '#66ccff',
      icon: 'sprites/powerup_freeze.svg',
      duration: 8000,
      rarity: 'rare',
      description: 'Freeze all zombies!'
    },
    DOUBLE_DAMAGE: {
      id: 'double_damage',
      name: 'Double Damage',
      letter: 'D',
      color: '#ff0000',
      icon: 'sprites/powerup_damage.svg',
      duration: 15000,
      rarity: 'uncommon',
      description: '3x Weapon damage!'
    },
    BOMB: {
      id: 'bomb',
      name: 'Lightning',
      letter: '\u26A1',
      color: '#88ccff',
      icon: 'sprites/powerup_bomb.svg',
      duration: 0, // Instant
      rarity: 'epic',
      description: 'Lightning strike!'
    },
    MAGNET: {
      id: 'magnet',
      name: 'Magnet',
      letter: 'M',
      color: '#cc00cc',
      icon: 'sprites/powerup_magnet.svg',
      duration: 20000,
      rarity: 'uncommon',
      description: 'Auto-collect materials!'
    },
    FREE_FIRESOCK: {
      id: 'free_firesock',
      name: 'Free FireSocks',
      letter: '1',
      color: '#ff4400',
      icon: 'sprites/powerup_ammo.svg',
      duration: 0,
      rarity: 'common',
      description: '+5 FireSocks!'
    },
    FREE_SNOWBALL: {
      id: 'free_snowball',
      name: 'Free Snowballs',
      letter: '2',
      color: '#44aaff',
      icon: 'sprites/powerup_ammo.svg',
      duration: 0,
      rarity: 'uncommon',
      description: '+5 Snowballs!'
    },
    FREE_FIREGIFT: {
      id: 'free_firegift',
      name: 'Free FireGifts',
      letter: '3',
      color: '#ff00aa',
      icon: 'sprites/powerup_ammo.svg',
      duration: 0,
      rarity: 'rare',
      description: '+3 FireGifts!'
    }
  };

  // Active power-ups (currently in effect)
  let activePowerups = {};

  // Spawned power-ups in world
  let spawnedPowerups = [];

  // Power-up spawn settings
  const SPAWN_SETTINGS = {
    minInterval: 30000,  // 30 seconds minimum between spawns
    maxInterval: 60000,  // 60 seconds maximum
    maxActive: 2,        // Max 2 power-ups on screen at once
    maxPerLevel: 2,      // Max 2 total power-ups spawned per level
    collectRadius: 50    // Collection distance
  };

  let spawnedThisLevel = 0;

  let lastSpawnTime = 0;
  let nextSpawnTime = 0;

  /**
   * Initialize power-up system
   */
  function init() {
    console.log('[POWERUP] Initializing power-up system...');

    // Calculate first spawn time
    nextSpawnTime = Date.now() + randomInterval();

    console.log('[POWERUP] ✓ Power-up system ready');
    console.log('[POWERUP] Available power-ups:', Object.keys(POWERUP_TYPES).length);
  }

  /**
   * Random interval between spawns
   */
  function randomInterval() {
    return SPAWN_SETTINGS.minInterval +
           Math.random() * (SPAWN_SETTINGS.maxInterval - SPAWN_SETTINGS.minInterval);
  }

  /**
   * Update power-up system (call every frame)
   */
  function update() {
    // Don't spawn or update if game is over or level not started
    if (!window.Game_LevelStarted || window.Game_GameIsOver) {
      return;
    }

    const now = Date.now();

    // Check if should spawn new power-up (respecting per-level and max-active limits)
    if (now >= nextSpawnTime && spawnedPowerups.length < SPAWN_SETTINGS.maxActive && spawnedThisLevel < SPAWN_SETTINGS.maxPerLevel) {
      spawnRandomPowerup();
      spawnedThisLevel++;
      nextSpawnTime = now + randomInterval();
    }

    // Update active power-ups (timers)
    updateActivePowerups();

    // Update power-up positions to follow camera
    updatePowerupPositions();
  }

  /**
   * Spawn a random power-up in the level
   */
  function spawnRandomPowerup() {
    // Get random power-up type based on rarity
    const powerupType = selectRandomPowerupByRarity();

    if (!powerupType) return;

    // Get random spawn position (visible area)
    const pos = getRandomSpawnPosition();

    const powerup = {
      id: 'powerup_' + Date.now(),
      type: powerupType,
      x: pos.x,
      y: pos.y,
      spawnTime: Date.now(),
      sprite: null
    };

    // Create visual sprite
    createPowerupSprite(powerup);

    spawnedPowerups.push(powerup);

    console.log('[POWERUP] Spawned:', powerupType.name, 'at', pos.x, pos.y);
  }

  /**
   * Select random power-up based on rarity
   */
  function selectRandomPowerupByRarity() {
    const rarityWeights = {
      'common': 50,
      'uncommon': 30,
      'rare': 15,
      'epic': 5
    };

    // Build weighted list
    const weightedList = [];
    for (let key in POWERUP_TYPES) {
      const powerup = POWERUP_TYPES[key];
      const weight = rarityWeights[powerup.rarity] || 10;
      for (let i = 0; i < weight; i++) {
        weightedList.push(powerup);
      }
    }

    // Select random
    return weightedList[Math.floor(Math.random() * weightedList.length)];
  }

  /**
   * Get random spawn position in visible area
   */
  function getRandomSpawnPosition() {
    // Get level boundaries from labyrinth constraints
    var levelData = window.Game_LevelData ? Game_LevelData[window.Game_CurrentLevel - 1] : null;

    if (!levelData || !levelData.LabyrinthConstraints) {
      console.warn('[POWERUP] No LabyrinthConstraints for level', window.Game_CurrentLevel);
      return { x: 200, y: 100 };
    }

    // Spawn within level boundaries, with margin from edges
    var constraints = levelData.LabyrinthConstraints;
    var margin = 50;

    var minX = constraints.X1 + margin;
    var maxX = constraints.X2 - margin;
    var minY = constraints.Y1 + margin;
    var maxY = constraints.Y2 - margin;

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY)
    };
  }

  /**
   * Create visual sprite for power-up with falling animation
   */
  function createPowerupSprite(powerup) {
    var sprite = document.createElement('div');
    sprite.id = powerup.id;
    sprite.className = 'powerup-sprite powerup-falling';
    sprite.style.position = 'absolute';
    sprite.style.width = '32px';
    sprite.style.height = '32px';
    sprite.style.backgroundImage = 'url(' + powerup.type.icon + '?v=2)';
    sprite.style.backgroundSize = '100% 100%';
    sprite.style.backgroundRepeat = 'no-repeat';
    sprite.style.backgroundColor = 'transparent';
    sprite.style.imageRendering = 'pixelated';
    sprite.style.zIndex = '50';
    sprite.style.cursor = 'pointer';
    sprite.style.pointerEvents = 'auto';

    // Store target Y for falling animation
    powerup.targetY = powerup.y;
    powerup.fallStartY = powerup.y - 120; // Start 120px above target
    powerup.fallProgress = 0;
    powerup.isFalling = true;
    powerup.y = powerup.fallStartY;

    // Set initial position
    if (window.g_ViewPort_X !== undefined && window.g_ViewPort_Y !== undefined) {
      sprite.style.left = (powerup.x + g_ViewPort_X) + 'px';
      sprite.style.top = (powerup.y + g_ViewPort_Y) + 'px';
    } else {
      sprite.style.left = '-100px';
      sprite.style.top = '-100px';
    }

    // Click to collect
    sprite.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();

      var index = spawnedPowerups.findIndex(function(p) { return p.id === powerup.id; });
      if (index !== -1) {
        collectPowerup(powerup, null);
        removePowerup(index);
      }

      return false;
    };

    var container = document.getElementById('div_moviescreenframe');
    if (container) {
      container.appendChild(sprite);
    }

    powerup.sprite = sprite;
  }

  /**
   * Update power-up positions (falling + follow camera)
   */
  function updatePowerupPositions() {
    if (window.g_ViewPort_X === undefined || window.g_ViewPort_Y === undefined) return;

    spawnedPowerups.forEach(powerup => {
      if (!powerup.sprite) return;

      // Falling animation
      if (powerup.isFalling) {
        powerup.fallProgress += 0.03; // ~1 second fall at 30fps
        if (powerup.fallProgress >= 1) {
          powerup.fallProgress = 1;
          powerup.isFalling = false;
          powerup.y = powerup.targetY;
          powerup.sprite.classList.remove('powerup-falling');
          powerup.sprite.classList.add('powerup-landed');
        } else {
          // Ease-in (accelerating fall like gravity)
          var t = powerup.fallProgress;
          var ease = t * t;
          powerup.y = powerup.fallStartY + (powerup.targetY - powerup.fallStartY) * ease;
        }
      }

      powerup.sprite.style.left = (powerup.x + g_ViewPort_X) + 'px';
      powerup.sprite.style.top = (powerup.y + g_ViewPort_Y) + 'px';
    });
  }

  /**
   * Get first available player for power-up effects
   */
  function getFirstPlayer() {
    if (!window.Game_PlayersArray) return null;

    for (let playerKey in Game_PlayersArray) {
      const player = Game_PlayersArray[playerKey];
      if (player && player.LivingState === 0) {
        return player;
      }
    }
    return null;
  }

  /**
   * Remove power-up from world
   */
  function removePowerup(index) {
    const powerup = spawnedPowerups[index];

    if (powerup.sprite && powerup.sprite.parentNode) {
      powerup.sprite.parentNode.removeChild(powerup.sprite);
    }

    spawnedPowerups.splice(index, 1);
  }

  /**
   * Player collected a power-up (via click)
   */
  function collectPowerup(powerup, player) {
    console.log('[POWERUP] Collected:', powerup.type.name, 'by click');

    // Get player if not provided
    if (!player) {
      player = getFirstPlayer();
    }

    // Play collection sound
    if (window.SoundPlay) {
      SoundPlay('weaponlaunched'); // Reuse existing sound
    }

    // Apply power-up effect
    applyPowerupEffect(powerup.type, player);

    // Show notification
    showPowerupNotification(powerup.type);
  }

  /**
   * Apply power-up effect
   */
  function applyPowerupEffect(powerupType, player) {
    console.log('[POWERUP] Applying:', powerupType.name);

    switch (powerupType.id) {
      case 'speed_boost':
        activatePowerup(powerupType, () => {
          // Double all players' speed
          if (window.Game_PlayersArray) {
            for (let i in Game_PlayersArray) {
              const p = Game_PlayersArray[i];
              if (p && p.VelLimit) {
                p._originalSpeed = p.VelLimit;
                p.VelLimit = p.VelLimit * 3;
              }
            }

            return () => {
              // Restore original speed
              for (let i in Game_PlayersArray) {
                const p = Game_PlayersArray[i];
                if (p && p._originalSpeed) {
                  p.VelLimit = p._originalSpeed;
                  delete p._originalSpeed;
                }
              }
            };
          }
        });
        break;

      case 'mega_ammo':
        // Instant: Add snow stock
        if (window.Game_SnowStock !== undefined) {
          Game_SnowStock += 100;
          if (window.ReplaceHTML) ReplaceHTML('id_snowstock', Game_SnowStock);
        }
        break;

      case 'shield':
        activatePowerup(powerupType, () => {
          // Make all players invulnerable
          if (window.Game_PlayersArray) {
            for (let i in Game_PlayersArray) {
              const p = Game_PlayersArray[i];
              if (p) {
                p._originalStrength = p.Strength;
                p.Strength = 9999;
              }
            }

            return () => {
              for (let i in Game_PlayersArray) {
                const p = Game_PlayersArray[i];
                if (p && p._originalStrength !== undefined) {
                  p.Strength = p._originalStrength;
                  delete p._originalStrength;
                }
              }
            };
          }
        });
        break;

      case 'freeze':
        activatePowerup(powerupType, () => {
          // Freeze all zombies
          if (window.Game_Zombies) {
            for (let key in Game_Zombies) {
              const zombie = Game_Zombies[key];
              if (zombie && zombie.VelLimit) {
                zombie._originalSpeed = zombie.VelLimit;
                zombie.VelLimit = 0.1;
              }
            }

            return () => {
              // Unfreeze
              for (let key in Game_Zombies) {
                const zombie = Game_Zombies[key];
                if (zombie && zombie._originalSpeed !== undefined) {
                  zombie.VelLimit = zombie._originalSpeed;
                  delete zombie._originalSpeed;
                }
              }
            };
          }
        });
        break;

      case 'bomb':
        // Lightning strike: Kill all zombies with full-screen flash + thunder
        Game_LightningStrike();
        break;

      case 'double_damage':
        activatePowerup(powerupType, () => {
          // Triple weapon strength by boosting all weapon types
          window._doubleDamageActive = true;
          if (window.Game_WeaponTypes) {
            for (var wt in Game_WeaponTypes) {
              Game_WeaponTypes[wt]._originalStrength = Game_WeaponTypes[wt].Strength;
              Game_WeaponTypes[wt].Strength = Game_WeaponTypes[wt].Strength * 3;
            }
          }

          return () => {
            window._doubleDamageActive = false;
            if (window.Game_WeaponTypes) {
              for (var wt in Game_WeaponTypes) {
                if (Game_WeaponTypes[wt]._originalStrength !== undefined) {
                  Game_WeaponTypes[wt].Strength = Game_WeaponTypes[wt]._originalStrength;
                  delete Game_WeaponTypes[wt]._originalStrength;
                }
              }
            }
          };
        });
        break;

      case 'rapid_fire':
        activatePowerup(powerupType, () => {
          // Double max shots in air at once
          window._rapidFireActive = true;
          if (window.Game_MaxShotWeapons !== undefined) {
            window._originalMaxShots = Game_MaxShotWeapons;
            Game_MaxShotWeapons = Game_MaxShotWeapons * 2;
          }

          return () => {
            window._rapidFireActive = false;
            if (window._originalMaxShots !== undefined) {
              Game_MaxShotWeapons = window._originalMaxShots;
              delete window._originalMaxShots;
            }
          };
        });
        break;

      case 'magnet':
        activatePowerup(powerupType, () => {
          // Auto-send idle players to gather snow
          window._magnetActive = true;
          window._magnetInterval = setInterval(function() {
            if (!window.Game_PlayersArray || !window._magnetActive) return;
            for (var i in Game_PlayersArray) {
              var p = Game_PlayersArray[i];
              if (p && p.LivingState === 0 && (!p.GameObjective || p.GameObjective === '')) {
                if (window.Game_SnowStock !== undefined) {
                  Game_SnowStock += 2;
                  if (window.ReplaceHTML) ReplaceHTML('id_snowstock', Game_SnowStock);
                }
              }
            }
          }, 500);

          return () => {
            window._magnetActive = false;
            if (window._magnetInterval) {
              clearInterval(window._magnetInterval);
              delete window._magnetInterval;
            }
          };
        });
        break;

      case 'free_firesock':
        // Instant: Add 5 free FireSock weapons
        if (window.Game_Ammo && Game_Ammo['Weapon01']) {
          Game_Ammo['Weapon01'].Count += 5;
          if (window.Game_UpdateAmmoScreenIfo) Game_UpdateAmmoScreenIfo('Weapon01');
        }
        break;

      case 'free_snowball':
        // Instant: Add 5 free Snowball weapons
        if (window.Game_Ammo && Game_Ammo['Weapon02']) {
          Game_Ammo['Weapon02'].Count += 5;
          if (window.Game_UpdateAmmoScreenIfo) Game_UpdateAmmoScreenIfo('Weapon02');
        }
        break;

      case 'free_firegift':
        // Instant: Add 3 free FireGift weapons
        if (window.Game_Ammo && Game_Ammo['Weapon03']) {
          Game_Ammo['Weapon03'].Count += 3;
          if (window.Game_UpdateAmmoScreenIfo) Game_UpdateAmmoScreenIfo('Weapon03');
        }
        break;
    }
  }

  /**
   * Activate a timed power-up
   */
  function activatePowerup(powerupType, setupFn) {
    // Call setup function and get cleanup function
    const cleanupFn = setupFn();

    // Store active power-up
    activePowerups[powerupType.id] = {
      type: powerupType,
      startTime: Date.now(),
      endTime: Date.now() + powerupType.duration,
      cleanup: cleanupFn
    };

    updateActivePowerupsUI();
  }

  /**
   * Update active power-ups (timers)
   */
  function updateActivePowerups() {
    const now = Date.now();

    for (let id in activePowerups) {
      const powerup = activePowerups[id];

      if (now >= powerup.endTime) {
        // Power-up expired
        if (powerup.cleanup) {
          powerup.cleanup();
        }
        delete activePowerups[id];
        console.log('[POWERUP] Expired:', powerup.type.name);
      }
    }

    updateActivePowerupsUI();
  }

  /**
   * Show retro-styled power-up collection notification
   */
  function showPowerupNotification(powerupType) {
    var notif = document.createElement('div');
    notif.className = 'powerup-notification';
    notif.style.cssText = 'position:absolute;top:60px;left:50%;transform:translateX(-50%);' +
      'background:#0f0c29;border:3px solid ' + powerupType.color + ';border-radius:0;' +
      'padding:8px 16px;z-index:10000;font-family:"Courier New",monospace;font-weight:bold;' +
      'text-align:center;box-shadow:0 0 10px ' + powerupType.color + '44;' +
      'letter-spacing:1px;opacity:1;transition:opacity 0.5s;white-space:nowrap';

    var durationText = powerupType.duration > 0
      ? ' ' + (powerupType.duration / 1000) + 'S'
      : '';

    // Build notification with safe DOM methods
    var titleLine = document.createElement('div');
    titleLine.style.cssText = 'color:' + powerupType.color + ';font-size:16px;text-shadow:2px 2px 0 #000';
    titleLine.textContent = powerupType.letter + ' ' + powerupType.name.toUpperCase();

    var descLine = document.createElement('div');
    descLine.style.cssText = 'font-size:11px;color:#88CCFF;margin-top:2px';
    descLine.textContent = powerupType.description + durationText;

    notif.appendChild(titleLine);
    notif.appendChild(descLine);

    var container = document.getElementById('div_moviescreenframe');
    if (container) {
      container.appendChild(notif);
    }

    setTimeout(function() {
      notif.style.opacity = '0';
      setTimeout(function() {
        if (notif.parentNode) notif.parentNode.removeChild(notif);
      }, 500);
    }, 2000);
  }

  /**
   * Update active power-ups UI (retro 8-bit style)
   */
  function updateActivePowerupsUI() {
    var uiContainer = document.getElementById('active-powerups-ui');

    if (!uiContainer) {
      uiContainer = document.createElement('div');
      uiContainer.id = 'active-powerups-ui';
      uiContainer.style.cssText = 'position:absolute;top:5px;right:10px;z-index:100;display:flex;flex-direction:column;gap:3px';
      var gameContainer = document.getElementById('div_moviescreenframe') || document.body;
      gameContainer.appendChild(uiContainer);
    }

    // Clear and rebuild with safe DOM methods
    while (uiContainer.firstChild) uiContainer.removeChild(uiContainer.firstChild);

    for (var id in activePowerups) {
      var powerup = activePowerups[id];
      var remaining = Math.max(0, powerup.endTime - Date.now());
      var seconds = Math.ceil(remaining / 1000);

      var item = document.createElement('div');
      item.style.cssText = 'background:#0f0c29;border:2px solid ' + powerup.type.color +
        ';border-radius:0;padding:3px 8px;display:flex;align-items:center;gap:6px;' +
        'font-family:"Courier New",monospace;font-size:12px;color:' + powerup.type.color +
        ';font-weight:bold;letter-spacing:1px';

      var letter = document.createElement('span');
      letter.style.cssText = 'background:' + powerup.type.color + ';color:#000;width:16px;height:16px;' +
        'display:flex;align-items:center;justify-content:center;font-size:10px';
      letter.textContent = powerup.type.letter;

      var name = document.createElement('span');
      name.textContent = powerup.type.name.toUpperCase();

      var timer = document.createElement('span');
      timer.style.cssText = 'min-width:24px;text-align:right;color:#FFCC00';
      timer.textContent = seconds + 'S';

      item.appendChild(letter);
      item.appendChild(name);
      item.appendChild(timer);
      uiContainer.appendChild(item);
    }
  }

  /**
   * Update snow stock display
   */
  function updateSnowStockDisplay() {
    if (window.ReplaceHTML && document.getElementById('id_snowstock')) {
      ReplaceHTML('id_snowstock', Game_SnowStock);
    }
  }

  /**
   * Clear all power-ups (for level restart)
   */
  function clearAll() {
    // Remove all spawned power-ups
    spawnedPowerups.forEach(powerup => {
      if (powerup.sprite && powerup.sprite.parentNode) {
        powerup.sprite.parentNode.removeChild(powerup.sprite);
      }
    });
    spawnedPowerups = [];
    spawnedThisLevel = 0;
    nextSpawnTime = Date.now() + randomInterval();

    // Clear active power-ups
    for (let id in activePowerups) {
      if (activePowerups[id].cleanup) {
        activePowerups[id].cleanup();
      }
    }
    activePowerups = {};

    // Safety: reset all global flags
    window._doubleDamageActive = false;
    window._rapidFireActive = false;
    window._magnetActive = false;
    if (window._magnetInterval) {
      clearInterval(window._magnetInterval);
      delete window._magnetInterval;
    }

    updateActivePowerupsUI();
  }

  // Export to global scope
  window.PowerupSystem = {
    init: init,
    update: update,
    clearAll: clearAll,
    POWERUP_TYPES: POWERUP_TYPES
  };

  console.log('[POWERUP] Power-up System loaded');

  // Auto-initialize
  setTimeout(init, 1000);
})();
