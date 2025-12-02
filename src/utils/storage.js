// LocalStorage utility for game progress persistence
const STORAGE_KEY = "chronocipher_progress";
const PROGRESS_SALT = "cHron0$eCret!"; // simple salt to detect casual tampering

// simple deterministic checksum (djb2) for client-side tamper detection
const computeChecksum = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // convert to unsigned 32-bit hex
  return (hash >>> 0).toString(16);
};

export const gameProgressManager = {
  // Save game progress
  saveProgress: (gameState) => {
    try {
      const progress = {
        level: gameState.level,
        clues: gameState.clues,
        gameState: gameState.gameState,
        timeLeft: gameState.timeLeft,
        hintUsed: gameState.hintUsed,
        totalScore: gameState.totalScore || 0,
        startTime: gameState.startTime || null,
        completedAt: gameState.gameState === "victory" ? new Date().toISOString() : null,
      };
      const payload = JSON.stringify(progress);
      const signature = computeChecksum(payload + PROGRESS_SALT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ payload, signature }));
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  },

  // Load game progress
  loadProgress: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // backwards compatibility: if payload field missing assume old format
        if (parsed && parsed.payload && parsed.signature) {
          const expected = computeChecksum(parsed.payload + PROGRESS_SALT);
          if (expected !== parsed.signature) {
            console.warn("Progress signature mismatch — possible tampering. Clearing saved progress.");
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }
          return JSON.parse(parsed.payload);
        }
        return parsed; // old format
      }
      return null;
    } catch (error) {
      console.error("Failed to load progress:", error);
      return null;
    }
  },

  // Clear game progress
  clearProgress: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear progress:", error);
    }
  },

  // Save mini-game state
  saveMiniGameState: (levelId, state) => {
    try {
      const miniGameKey = `minigame_${levelId}`;
      localStorage.setItem(miniGameKey, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save mini-game state:", error);
    }
  },

  // Load mini-game state
  loadMiniGameState: (levelId) => {
    try {
      const miniGameKey = `minigame_${levelId}`;
      const saved = localStorage.getItem(miniGameKey);
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error("Failed to load mini-game state:", error);
      return null;
    }
  },

  // Team info (two participants + team name)
  saveTeamInfo: (teamObj) => {
    try {
      // minimal validation
      const payload = JSON.stringify(teamObj || {});
      const signature = computeChecksum(payload + PROGRESS_SALT);
      localStorage.setItem("chronocipher_team", JSON.stringify({ payload, signature }));
    } catch (err) {
      console.error("Failed to save team info:", err);
    }
  },

  loadTeamInfo: () => {
    try {
      const raw = localStorage.getItem("chronocipher_team");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.payload && parsed.signature) {
        const expected = computeChecksum(parsed.payload + PROGRESS_SALT);
        if (expected !== parsed.signature) {
          console.warn("Team info signature mismatch — clearing.");
          localStorage.removeItem("chronocipher_team");
          return null;
        }
        return JSON.parse(parsed.payload);
      }
      return parsed;
    } catch (err) {
      console.error("Failed to load team info:", err);
      return null;
    }
  },
};
