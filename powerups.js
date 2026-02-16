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
      icon: 'powerup_icon_speed.png',
      duration: 10000, // 10 seconds
      rarity: 'common',
      description: 'Move 2x faster!'
    },
    RAPID_FIRE: {
      id: 'rapid_fire',
      name: 'Rapid Fire',
      letter: 'R',
      color: '#ff6600',
      icon: 'powerup_icon_rapidfire.png',
      duration: 12000,
      rarity: 'common',
      description: 'Shoot faster!'
    },
    SHIELD: {
      id: 'shield',
      name: 'Shield',
      letter: 'H',
      color: '#00ccff',
      icon: 'powerup_icon_shield.png',
      duration: 8000,
      rarity: 'rare',
      description: 'Invulnerable!'
    },
    MEGA_AMMO: {
      id: 'mega_ammo',
      name: 'Mega Ammo',
      letter: 'A',
      color: '#00ff00',
      icon: 'powerup_icon_ammo.png',
      duration: 0, // Instant
      rarity: 'common',
      description: '+50 Snow Stock!'
    },
    FREEZE: {
      id: 'freeze',
      name: 'Freeze',
      letter: 'F',
      color: '#66ccff',
      icon: 'powerup_icon_freeze.png',
      duration: 5000,
      rarity: 'rare',
      description: 'Freeze all zombies!'
    },
    DOUBLE_DAMAGE: {
      id: 'double_damage',
      name: 'Double Damage',
      letter: 'D',
      color: '#ff0000',
      icon: 'powerup_icon_damage.png',
      duration: 12000,
      rarity: 'uncommon',
      description: '2x Weapon damage!'
    },
    BOMB: {
      id: 'bomb',
      name: 'Bomb',
      letter: 'B',
      color: '#ff00ff',
      icon: 'powerup_icon_bomb.png',
      duration: 0, // Instant
      rarity: 'epic',
      description: 'Clear all zombies!'
    },
    MAGNET: {
      id: 'magnet',
      name: 'Magnet',
      letter: 'M',
      color: '#cc00cc',
      icon: 'powerup_icon_magnet.png',
      duration: 15000,
      rarity: 'uncommon',
      description: 'Auto-collect materials!'
    }
  };

  // Active power-ups (currently in effect)
  let activePowerups = {};

  // Spawned power-ups in world
  let spawnedPowerups = [];

  // Power-up spawn settings
  const SPAWN_SETTINGS = {
    minInterval: 15000,  // 15 seconds minimum between spawns
    maxInterval: 30000,  // 30 seconds maximum
    maxActive: 3,        // Max 3 power-ups on screen at once
    collectRadius: 50    // Collection distance
  };

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

    // Check if should spawn new power-up
    if (now >= nextSpawnTime && spawnedPowerups.length < SPAWN_SETTINGS.maxActive) {
      spawnRandomPowerup();
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
   * Create visual sprite for power-up (looks like an in-game object)
   */
  function createPowerupSprite(powerup) {
    var sprite = document.createElement('div');
    sprite.id = powerup.id;
    sprite.className = 'powerup-sprite';
    sprite.style.position = 'absolute';
    sprite.style.width = '32px';
    sprite.style.height = '32px';
    sprite.style.backgroundImage = 'url(' + powerup.type.icon + ')';
    sprite.style.backgroundSize = '100% 100%';
    sprite.style.backgroundRepeat = 'no-repeat';
    sprite.style.imageRendering = 'pixelated';
    sprite.style.zIndex = '50';
    sprite.style.cursor = 'pointer';
    sprite.style.pointerEvents = 'auto';

    // Set initial position immediately using viewport offset
    if (window.g_ViewPort_X !== undefined && window.g_ViewPort_Y !== undefined) {
      sprite.style.left = (powerup.x + g_ViewPort_X) + 'px';
      sprite.style.top = (powerup.y + g_ViewPort_Y) + 'px';
    } else {
      // Hide offscreen until viewport is available
      sprite.style.left = '-100px';
      sprite.style.top = '-100px';
    }

    // Add click handler to collect power-up
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

    // Add to game container
    var container = document.getElementById('div_moviescreenframe');
    if (container) {
      container.appendChild(sprite);
    }

    powerup.sprite = sprite;
  }

  /**
   * Update power-up sprite position (follow camera)
   */
  function updatePowerupPositions() {
    if (window.g_ViewPort_X === undefined || window.g_ViewPort_Y === undefined) return;

    spawnedPowerups.forEach(powerup => {
      if (powerup.sprite) {
        powerup.sprite.style.left = (powerup.x + g_ViewPort_X) + 'px';
        powerup.sprite.style.top = (powerup.y + g_ViewPort_Y) + 'px';
      }
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
                p.VelLimit = p.VelLimit * 2;
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
        // Instant: Add ammo
        if (window.Game_SnowStock !== undefined) {
          Game_SnowStock += 50;
          // Update UI
          const snowDisplay = document.getElementById('id_control_snowstock');
          if (snowDisplay) {
            snowDisplay.innerHTML = Game_SnowStock;
          }
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
        // Instant: Kill all zombies
        if (window.Game_Zombies) {
          for (let key in Game_Zombies) {
            const zombie = Game_Zombies[key];
            if (zombie && zombie.doDie) {
              zombie.doDie();
            }
          }
        }
        break;

      case 'double_damage':
        activatePowerup(powerupType, () => {
          // Double weapon damage (would need weapon system modification)
          window._doubleDamageActive = true;

          return () => {
            window._doubleDamageActive = false;
          };
        });
        break;

      case 'rapid_fire':
        activatePowerup(powerupType, () => {
          // Increase fire rate
          window._rapidFireActive = true;

          return () => {
            window._rapidFireActive = false;
          };
        });
        break;

      case 'magnet':
        activatePowerup(powerupType, () => {
          // Auto-collect materials
          window._magnetActive = true;

          return () => {
            window._magnetActive = false;
          };
        });
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
   * Show power-up collection notification
   */
  function showPowerupNotification(powerupType) {
    // Create notification element
    const notif = document.createElement('div');
    notif.style.position = 'absolute';
    notif.style.top = '100px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#fff';
    notif.style.border = '3px solid ' + powerupType.color;
    notif.style.borderRadius = '10px';
    notif.style.padding = '10px 20px';
    notif.style.zIndex = '10000';
    notif.style.fontFamily = 'Arial, sans-serif';
    notif.style.fontSize = '16px';
    notif.style.fontWeight = 'bold';
    notif.style.color = '#000';
    notif.style.textAlign = 'center';
    notif.style.boxShadow = '0 0 20px ' + powerupType.color;
    notif.style.opacity = '1';
    notif.style.transition = 'opacity 0.5s';

    const durationText = powerupType.duration > 0
      ? ' (' + (powerupType.duration / 1000) + 's)'
      : '';

    notif.innerHTML = `
      <div style="font-size: 12px; color: #666; margin-bottom: 3px;">POWER-UP!</div>
      <div style="color: ${powerupType.color}; font-size: 18px;">${powerupType.name}</div>
      <div style="font-size: 12px; margin-top: 3px;">${powerupType.description}${durationText}</div>
    `;

    // Add to game canvas container
    const container = document.getElementById('div_moviescreenframe');
    if (container) {
      container.appendChild(notif);
    } else {
      document.body.appendChild(notif);
    }

    // Fade out and remove
    setTimeout(() => {
      notif.style.opacity = '0';
      setTimeout(() => {
        if (notif.parentNode) {
          notif.parentNode.removeChild(notif);
        }
      }, 500);
    }, 2000);
  }

  /**
   * Update active power-ups UI
   */
  function updateActivePowerupsUI() {
    let uiContainer = document.getElementById('active-powerups-ui');

    if (!uiContainer) {
      uiContainer = document.createElement('div');
      uiContainer.id = 'active-powerups-ui';
      uiContainer.style.position = 'absolute';
      uiContainer.style.top = '5px';
      uiContainer.style.left = '10px';
      uiContainer.style.zIndex = '100';
      uiContainer.style.display = 'flex';
      uiContainer.style.flexDirection = 'column';
      uiContainer.style.gap = '5px';
      var gameContainer = document.getElementById('div_moviescreenframe') || document.body;
      gameContainer.appendChild(uiContainer);
    }

    // Clear and rebuild
    uiContainer.innerHTML = '';

    for (let id in activePowerups) {
      const powerup = activePowerups[id];
      const remaining = Math.max(0, powerup.endTime - Date.now());
      const seconds = Math.ceil(remaining / 1000);

      const item = document.createElement('div');
      item.style.background = 'rgba(0, 0, 0, 0.8)';
      item.style.border = '2px solid ' + powerup.type.color;
      item.style.borderRadius = '5px';
      item.style.padding = '5px 10px';
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.gap = '8px';
      item.style.fontFamily = 'Arial, sans-serif';
      item.style.fontSize = '14px';
      item.style.color = powerup.type.color;
      item.style.fontWeight = 'bold';

      item.innerHTML = `
        <span style="background: ${powerup.type.color}; color: #000; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">${powerup.type.letter}</span>
        <span style="flex: 1;">${powerup.type.name}</span>
        <span style="min-width: 30px; text-align: right;">${seconds}s</span>
      `;

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

    // Clear active power-ups
    for (let id in activePowerups) {
      if (activePowerups[id].cleanup) {
        activePowerups[id].cleanup();
      }
    }
    activePowerups = {};

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
