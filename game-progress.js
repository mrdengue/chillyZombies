/**
 * Game Progress and Save System
 * Manages level progression, high scores, and player data
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'chilly_zombies_save';
  const HIGHSCORE_KEY = 'chilly_zombies_highscores';

  // Default save data
  const defaultSaveData = {
    version: 1,
    highestLevelUnlocked: 1,  // Only level 1 unlocked at start
    levelsCompleted: [],
    totalScore: 0,
    playTime: 0,
    settings: {
      soundEnabled: true,
      musicEnabled: true
    }
  };

  // High score table (top 10)
  const defaultHighScores = [];

  let currentSaveData = null;
  let currentHighScores = null;

  /**
   * Initialize the save system
   */
  function init() {
    console.log('[SAVE] Initializing save system...');
    loadSaveData();
    loadHighScores();
    updateLevelSelectUI();
    console.log('[SAVE] ✓ Save system ready');
    console.log('[SAVE] Highest level unlocked:', currentSaveData.highestLevelUnlocked);
  }

  /**
   * Load save data from localStorage
   */
  function loadSaveData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        currentSaveData = JSON.parse(saved);
        console.log('[SAVE] Loaded save data:', currentSaveData);
      } else {
        currentSaveData = { ...defaultSaveData };
        saveSaveData();
        console.log('[SAVE] Created new save data');
      }
    } catch (e) {
      console.error('[SAVE] Error loading save data:', e);
      currentSaveData = { ...defaultSaveData };
    }
  }

  /**
   * Save current data to localStorage
   */
  function saveSaveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSaveData));
      console.log('[SAVE] Save data saved');
    } catch (e) {
      console.error('[SAVE] Error saving data:', e);
    }
  }

  /**
   * Load high scores from localStorage
   */
  function loadHighScores() {
    try {
      const saved = localStorage.getItem(HIGHSCORE_KEY);
      if (saved) {
        currentHighScores = JSON.parse(saved);
      } else {
        currentHighScores = [...defaultHighScores];
      }
      console.log('[SAVE] Loaded', currentHighScores.length, 'high scores');
    } catch (e) {
      console.error('[SAVE] Error loading high scores:', e);
      currentHighScores = [...defaultHighScores];
    }
  }

  /**
   * Save high scores to localStorage
   */
  function saveHighScores() {
    try {
      localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(currentHighScores));
      console.log('[SAVE] High scores saved');
    } catch (e) {
      console.error('[SAVE] Error saving high scores:', e);
    }
  }

  /**
   * Check if a level is unlocked
   */
  function isLevelUnlocked(levelNumber) {
    return levelNumber <= currentSaveData.highestLevelUnlocked;
  }

  /**
   * Mark a level as completed and unlock next level
   */
  function completeLevel(levelNumber, score) {
    console.log('[SAVE] Level', levelNumber, 'completed with score:', score);

    // Mark level as completed
    if (!currentSaveData.levelsCompleted.includes(levelNumber)) {
      currentSaveData.levelsCompleted.push(levelNumber);
    }

    // Unlock next level
    const nextLevel = levelNumber + 1;
    if (nextLevel > currentSaveData.highestLevelUnlocked) {
      currentSaveData.highestLevelUnlocked = nextLevel;
      console.log('[SAVE] ✓ Level', nextLevel, 'unlocked!');
    }

    // Update total score
    currentSaveData.totalScore += score;

    // Save to localStorage
    saveSaveData();

    // Update UI
    updateLevelSelectUI();
  }

  /**
   * Update level selection UI to show locked/unlocked levels
   */
  function updateLevelSelectUI() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const maxLevel = window.Game_MaxLevels || 34;

      for (let i = 1; i <= maxLevel; i++) {
        const levelDiv = document.getElementById('id_div_level_unlocked_' + i);
        if (levelDiv) {
          if (isLevelUnlocked(i)) {
            // Unlocked - clickable
            levelDiv.className = 'levelactive';
            levelDiv.style.opacity = '1';
            levelDiv.style.cursor = 'pointer';
          } else {
            // Locked - not clickable
            levelDiv.className = 'levellocked';
            levelDiv.style.opacity = '0.3';
            levelDiv.style.cursor = 'not-allowed';
            levelDiv.style.color = '#666';

            // Remove click handler
            levelDiv.onclick = function(e) {
              e.preventDefault();
              e.stopPropagation();
              showLockedMessage(i);
              return false;
            };
            levelDiv.onmousedown = function(e) {
              e.preventDefault();
              e.stopPropagation();
              showLockedMessage(i);
              return false;
            };
          }
        }
      }
    }, 500); // Wait for game to initialize
  }

  /**
   * Show message when trying to access locked level
   */
  function showLockedMessage(levelNumber) {
    const prevLevel = levelNumber - 1;
    alert('🔒 Nivel ' + levelNumber + ' bloqueado!\n\nCompleta el nivel ' + prevLevel + ' para desbloquear.');
    console.log('[SAVE] Level', levelNumber, 'is locked');
  }

  /**
   * Add a high score (local + online)
   */
  function addHighScore(name, score, level) {
    console.log('[SAVE] Adding high score:', name, score, 'on level', level);

    const entry = {
      name: name.toUpperCase().substring(0, 3), // 3 characters max
      score: score,
      level: level,
      date: new Date().toISOString()
    };

    // Save locally
    currentHighScores.push(entry);
    currentHighScores.sort((a, b) => b.score - a.score);
    currentHighScores = currentHighScores.slice(0, 10);
    saveHighScores();

    const localRank = currentHighScores.indexOf(entry) + 1;

    // Submit to online leaderboard (async, non-blocking)
    if (window.OnlineAPI && OnlineAPI.isOnline()) {
      OnlineAPI.submitScore(name, score, level)
        .then(result => {
          if (result.success) {
            console.log('[SAVE] ✓ Score submitted to global leaderboard, rank:', result.rank);
          } else if (!result.offline) {
            console.warn('[SAVE] Failed to submit online:', result.error);
          }
        })
        .catch(err => {
          console.warn('[SAVE] Error submitting online:', err);
        });
    }

    return localRank;
  }

  /**
   * Check if score qualifies for high score table
   */
  function isHighScore(score) {
    if (currentHighScores.length < 10) return true;
    return score > currentHighScores[currentHighScores.length - 1].score;
  }

  /**
   * Get high scores table (local only)
   */
  function getHighScores() {
    return [...currentHighScores];
  }

  /**
   * Get global high scores (local + online merged)
   */
  async function getGlobalHighScores(limit = 10) {
    // Get local scores
    const localScores = getHighScores();

    // Try to get online scores
    if (window.OnlineAPI && OnlineAPI.isOnline()) {
      const onlineScores = await OnlineAPI.getHighScores(limit);
      if (onlineScores) {
        return OnlineAPI.mergeScores(localScores, onlineScores);
      }
    }

    // Fallback to local only
    return localScores;
  }

  /**
   * Reset all save data (for testing)
   */
  function resetSaveData() {
    if (confirm('¿Resetear todo el progreso? Esta acción no se puede deshacer.')) {
      currentSaveData = { ...defaultSaveData };
      saveSaveData();
      updateLevelSelectUI();
      console.log('[SAVE] Save data reset');
      alert('Progreso reseteado. Solo el nivel 1 está desbloqueado.');
    }
  }

  /**
   * Reset high scores (for testing)
   */
  function resetHighScores() {
    if (confirm('¿Borrar tabla de high scores?')) {
      currentHighScores = [];
      saveHighScores();
      console.log('[SAVE] High scores reset');
    }
  }

  /**
   * Get current save data
   */
  function getSaveData() {
    return { ...currentSaveData };
  }

  // Export to global scope
  window.GameProgress = {
    init: init,
    isLevelUnlocked: isLevelUnlocked,
    completeLevel: completeLevel,
    addHighScore: addHighScore,
    isHighScore: isHighScore,
    getHighScores: getHighScores,
    getGlobalHighScores: getGlobalHighScores,
    getSaveData: getSaveData,
    resetSaveData: resetSaveData,
    resetHighScores: resetHighScores,
    updateLevelSelectUI: updateLevelSelectUI
  };

  console.log('[SAVE] Game Progress System loaded');

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Wait a bit for game to initialize
    setTimeout(init, 1000);
  }
})();
