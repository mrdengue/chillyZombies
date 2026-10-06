/**
 * Online High Scores API Client
 * Handles communication with Flask backend
 */

(function() {
  'use strict';

  // API configuration
  const API_URL = 'http://localhost:5000/api';  // Change for production
  const TIMEOUT = 5000;  // 5 seconds timeout
  const USE_ONLINE = true;  // Set to false to use only localStorage

  /**
   * Fetch with timeout
   */
  function fetchWithTimeout(url, options = {}, timeout = TIMEOUT) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  }

  /**
   * Get online high scores
   */
  async function getOnlineHighScores(limit = 10) {
    if (!USE_ONLINE) {
      console.log('[ONLINE] Online mode disabled, using local only');
      return null;
    }

    try {
      const response = await fetchWithTimeout(`${API_URL}/highscores?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const scores = await response.json();
      console.log('[ONLINE] ✓ Fetched', scores.length, 'online high scores');
      return scores;

    } catch (error) {
      console.warn('[ONLINE] Failed to fetch online scores:', error.message);
      return null;  // Fallback to local scores
    }
  }

  /**
   * Submit score to online leaderboard
   */
  async function submitOnlineScore(name, score, level) {
    if (!USE_ONLINE) {
      console.log('[ONLINE] Online mode disabled, skipping submit');
      return { success: false, offline: true };
    }

    try {
      const response = await fetchWithTimeout(`${API_URL}/highscores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, score, level })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit score');
      }

      const result = await response.json();
      console.log('[ONLINE] ✓ Score submitted, rank:', result.rank);
      return { success: true, ...result };

    } catch (error) {
      console.warn('[ONLINE] Failed to submit score:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check server status
   */
  async function checkServerStatus() {
    try {
      const response = await fetchWithTimeout(`${API_URL}/status`, {}, 2000);

      if (!response.ok) {
        return { online: false };
      }

      const status = await response.json();
      console.log('[ONLINE] ✓ Server online:', status.total_scores, 'scores');
      return { online: true, ...status };

    } catch (error) {
      console.warn('[ONLINE] Server offline:', error.message);
      return { online: false };
    }
  }

  /**
   * Merge local and online scores
   */
  function mergeScores(localScores, onlineScores) {
    if (!onlineScores || onlineScores.length === 0) {
      return localScores;
    }

    // Combine and deduplicate
    const allScores = [...localScores, ...onlineScores];
    const uniqueScores = [];
    const seen = new Set();

    for (const score of allScores) {
      const key = `${score.name}-${score.score}-${score.level}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueScores.push(score);
      }
    }

    // Sort by score descending
    uniqueScores.sort((a, b) => b.score - a.score);

    return uniqueScores.slice(0, 100);  // Top 100
  }

  // Export to global scope
  window.OnlineAPI = {
    getHighScores: getOnlineHighScores,
    submitScore: submitOnlineScore,
    checkStatus: checkServerStatus,
    mergeScores: mergeScores,
    isOnline: () => USE_ONLINE
  };

  console.log('[ONLINE] API client loaded, mode:', USE_ONLINE ? 'ONLINE' : 'OFFLINE');

})();
