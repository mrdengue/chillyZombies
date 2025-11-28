/**
 * High Score UI Handler
 * Atari-style 3-character name entry and display
 */

(function() {
  'use strict';

  let currentScore = 0;
  let currentLevel = 0;
  let entryDialog = null;
  let tableDialog = null;
  let char1, char2, char3, submitBtn, closeBtn;

  /**
   * Initialize high score UI
   */
  function init() {
    console.log('[HIGHSCORE] Initializing high score UI...');

    // Get DOM elements
    entryDialog = document.getElementById('id_div_highscore_entry');
    tableDialog = document.getElementById('id_div_highscore_table');
    char1 = document.getElementById('highscore_char1');
    char2 = document.getElementById('highscore_char2');
    char3 = document.getElementById('highscore_char3');
    submitBtn = document.getElementById('highscore_submit_btn');
    closeBtn = document.getElementById('highscore_close_btn');

    if (!entryDialog || !tableDialog) {
      console.error('[HIGHSCORE] UI elements not found');
      return;
    }

    // Setup event handlers
    setupNameInput();
    submitBtn.onclick = submitHighScore;
    closeBtn.onclick = closeHighScoreTable;

    console.log('[HIGHSCORE] ✓ UI ready');
  }

  /**
   * Setup Atari-style name input
   */
  function setupNameInput() {
    // Auto-advance to next character
    char1.oninput = () => {
      char1.value = char1.value.toUpperCase();
      if (char1.value.length === 1) char2.focus();
    };

    char2.oninput = () => {
      char2.value = char2.value.toUpperCase();
      if (char2.value.length === 1) char3.focus();
    };

    char3.oninput = () => {
      char3.value = char3.value.toUpperCase();
      if (char3.value.length === 1) {
        // Auto-submit when all 3 letters entered
        setTimeout(submitHighScore, 300);
      }
    };

    // Backspace handling
    char2.onkeydown = (e) => {
      if (e.key === 'Backspace' && char2.value === '') {
        char1.focus();
      }
    };

    char3.onkeydown = (e) => {
      if (e.key === 'Backspace' && char3.value === '') {
        char2.focus();
      } else if (e.key === 'Enter') {
        submitHighScore();
      }
    };

    // Only allow letters
    [char1, char2, char3].forEach(input => {
      input.onkeypress = (e) => {
        const char = String.fromCharCode(e.which);
        if (!/[A-Za-z]/.test(char)) {
          e.preventDefault();
        }
      };
    });
  }

  /**
   * Show high score entry dialog
   */
  function showHighScoreEntry(score, level) {
    console.log('[HIGHSCORE] Showing entry dialog for score:', score);

    currentScore = score;
    currentLevel = level;

    // Update score display
    document.getElementById('highscore_entry_score').textContent = score;

    // Clear previous input
    char1.value = '';
    char2.value = '';
    char3.value = '';

    // Show dialog
    entryDialog.className = 'highscore-entry div_shown';

    // Focus first input
    setTimeout(() => char1.focus(), 100);
  }

  /**
   * Show in-game notification
   */
  function showNotification(message) {
    // Create notification element
    const notif = document.createElement('div');
    notif.style.position = 'absolute';
    notif.style.top = '180px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#fff';
    notif.style.border = '2px solid #000';
    notif.style.padding = '10px 20px';
    notif.style.fontFamily = 'Arial, sans-serif';
    notif.style.fontSize = '14px';
    notif.style.fontWeight = 'bold';
    notif.style.color = '#000';
    notif.style.zIndex = '10000';
    notif.style.opacity = '1';
    notif.style.transition = 'opacity 0.5s';
    notif.textContent = message;

    entryDialog.appendChild(notif);

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
   * Submit high score (auto-submit when 3 letters entered)
   */
  function submitHighScore() {
    const name = (char1.value + char2.value + char3.value).toUpperCase();

    if (name.length !== 3) {
      return;
    }

    console.log('[HIGHSCORE] Submitting:', name, currentScore);

    // Add to high score table
    if (window.GameProgress) {
      const rank = GameProgress.addHighScore(name, currentScore, currentLevel);
      console.log('[HIGHSCORE] Rank:', rank);
    }

    // Hide entry dialog
    entryDialog.className = 'highscore-entry div_hidden';

    // Show high score table
    showHighScoreTable(name);
  }

  /**
   * Show high score table
   */
  function showHighScoreTable(newEntryName) {
    console.log('[HIGHSCORE] Showing high score table');

    if (!window.GameProgress) {
      console.error('[HIGHSCORE] GameProgress not available');
      return;
    }

    const highScores = GameProgress.getHighScores();
    const listDiv = document.getElementById('highscore_table_list');

    if (!listDiv) return;

    // Clear previous list
    listDiv.innerHTML = '';

    if (highScores.length === 0) {
      listDiv.innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">No high scores yet!</div>';
    } else {
      highScores.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'highscore-entry-item';

        // Highlight new entry
        if (newEntryName && entry.name === newEntryName && index < 3) {
          item.className += ' new-score';
        }

        item.innerHTML = `
          <span class="highscore-rank">#${index + 1}</span>
          <span class="highscore-name">${entry.name}</span>
          <span class="highscore-score-value">${entry.score.toLocaleString()}</span>
          <span class="highscore-level">Lv.${entry.level}</span>
        `;

        listDiv.appendChild(item);
      });
    }

    // Show dialog
    tableDialog.className = 'highscore-table div_shown';
  }

  /**
   * Close high score table
   */
  function closeHighScoreTable() {
    tableDialog.className = 'highscore-table div_hidden';
  }

  /**
   * Check and show high score entry if applicable
   */
  function checkHighScore(score, level) {
    if (!window.GameProgress) return;

    if (GameProgress.isHighScore(score)) {
      console.log('[HIGHSCORE] New high score!', score);
      showHighScoreEntry(score, level);
      return true;
    }
    return false;
  }

  // Export to global scope
  window.HighScoreUI = {
    init: init,
    showHighScoreEntry: showHighScoreEntry,
    showHighScoreTable: showHighScoreTable,
    checkHighScore: checkHighScore
  };

  console.log('[HIGHSCORE] High Score UI loaded');

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }
})();
