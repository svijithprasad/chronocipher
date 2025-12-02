import React, { useState, useEffect, useRef } from "react";
import { puzzles, isMiniGame } from "../utils/puzzles";
import { gameProgressManager } from "../utils/storage";
import {
  SudokuMiniGame,
  PatternMatchMiniGame,
  PuzzleFragmentMiniGame,
  MazeMiniGame,
  SimonMiniGame,
  BreakoutMiniGame,
  TypingChallengeMiniGame,
} from "../components/MiniGames";
import {
  TimerDisplay,
  PuzzleHeader,
  ActionButtons,
  CluesDisplay,
  MessageDisplay,
  ProgressBar,
  VictoryScreen,
  FinalCipherScreen,
  CipherLockScreen,
} from "../components/UIComponents";
import { PuzzleInput, PuzzleContent } from "../components/PuzzleContent";

// Team setup form (kept as top-level component to preserve identity and state)
const TeamForm = ({ onSave }) => {
  const [teamName, setTeamName] = useState("");
  const [memberA, setMemberA] = useState("");
  const [memberB, setMemberB] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!teamName.trim() || !memberA.trim() || !memberB.trim()) {
      setError("Please fill team name and both member names.");
      return;
    }
    const payload = { teamName: teamName.trim(), members: [memberA.trim(), memberB.trim()] };
    gameProgressManager.saveTeamInfo(payload);
    onSave(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="bg-black/80 border-2 border-purple-500 rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-cyan-300 mb-4">Team Setup</h2>
        <input className="w-full mb-2 p-2 bg-gray-800 text-white rounded" placeholder="Team name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        <input className="w-full mb-2 p-2 bg-gray-800 text-white rounded" placeholder="Member 1" value={memberA} onChange={(e) => setMemberA(e.target.value)} />
        <input className="w-full mb-4 p-2 bg-gray-800 text-white rounded" placeholder="Member 2" value={memberB} onChange={(e) => setMemberB(e.target.value)} />
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <div className="flex gap-3 justify-center">
          <button className="px-4 py-2 bg-cyan-400 rounded font-bold" onClick={submit}>Start</button>
        </div>
      </div>
    </div>
  );
};

const ChronoCipher = () => {
  const [level, setLevel] = useState(1);
  const [clues, setClues] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState("playing");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [particles, setParticles] = useState([]);
  const [transitioning, setTransitioning] = useState(false);
  const [miniGameComplete, setMiniGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  const audioRef = useRef(null);
  const timeoutHandledRef = useRef(false);
  const currentPuzzle = level <= 43 ? puzzles[level - 1] : null;
  const didRestoreRef = useRef(false);
  const [teamInfo, setTeamInfo] = useState(null);
  const masterCode = puzzles.slice(0, 43).map((p) => p.clue).join("");

  // Load progress on mount
  useEffect(() => {
    const savedProgress = gameProgressManager.loadProgress();
    if (savedProgress) {
      // Restore saved values with safe defaults
      const savedLevel = savedProgress.level || 1;
      const savedClues = Array.isArray(savedProgress.clues) ? savedProgress.clues : [];
      const savedState = savedProgress.gameState || "playing";
      setLevel(savedLevel);
      setClues(savedClues);
      // restore gameState carefully (final/victory states)
      if (savedState === "victory") {
        setGameState("victory");
      } else if (savedState === "final") {
        setGameState("final");
      } else {
        setGameState("playing");
      }
      setHintUsed(!!savedProgress.hintUsed);
      // If timeLeft was saved, restore it; otherwise use puzzle default
      const restoredTime = typeof savedProgress.timeLeft === "number" ? savedProgress.timeLeft : (puzzles[savedLevel - 1]?.time || 60);
      setTimeLeft(restoredTime);
      setScore(savedProgress.totalScore || 0);
      // If the saved run already reached victory, restore the final elapsed time
      if (savedState === "victory") {
        if (typeof savedProgress.totalTimeMs === "number") {
          setElapsed(Math.floor(savedProgress.totalTimeMs / 1000));
        } else if (savedProgress.startTime) {
          setElapsed(Math.floor((Date.now() - savedProgress.startTime) / 1000));
        }
        // Do not set startTime so the elapsed timer won't resume ticking on mount
        setStartTime(null);
      } else {
        setStartTime(savedProgress.startTime || Date.now());
      }
      didRestoreRef.current = true;
    }

    // load team info too
    const savedTeam = gameProgressManager.loadTeamInfo?.();
    if (savedTeam) setTeamInfo(savedTeam);
    // finished restoring
    // if there was no saved startTime, initialize it so elapsed starts counting
    if (!savedProgress || !savedProgress.startTime) {
      setStartTime(Date.now());
    }
    setLoading(false);
  }, []);

  

  // Save progress whenever game state changes
  useEffect(() => {
    // Avoid saving while we are restoring from storage or before restoration completes
    if (loading) return;
    // If a restore just happened, skip this first automatic save to avoid clobbering restored data
    if (didRestoreRef.current) {
      didRestoreRef.current = false;
      return;
    }

    // Ensure that when the run is finished we persist the final elapsed time (totalTimeMs)
    const savePayload = {
      level,
      clues,
      gameState,
      timeLeft,
      hintUsed,
      totalScore: score,
      startTime,
    };

    if (gameState === "victory") {
      // prefer an explicit elapsed if available; otherwise compute from startTime
      const finalMs = typeof elapsed === "number" && elapsed > 0 ? elapsed * 1000 : (startTime ? Date.now() - startTime : 0);
      savePayload.totalTimeMs = finalMs;
    }

    gameProgressManager.saveProgress(savePayload);
  }, [level, clues, gameState, timeLeft, hintUsed, score, startTime, elapsed, loading]);

  // Initialize level
  useEffect(() => {
    // If we just restored from storage, skip the default reset once
    if (didRestoreRef.current) {
      didRestoreRef.current = false;
      return;
    }

    // Reset level state whenever we enter the playing state for any level.
    // Previously this only ran for levels <= 40 which caused later mini-games
    // (levels 41-43) to remain in a completed state and therefore not render.
    if (gameState === "playing") {
      setTimeLeft(currentPuzzle?.time || 60);
      setAnswer("");
      setMessage("");
      setHintUsed(false);
      setMiniGameComplete(false);
    }
  }, [level, gameState]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && level <= 40 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && level <= 40 && gameState === "playing") {
      handleTimeout();
    }
  }, [timeLeft, gameState, level]);

  // Particle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: -10,
          speed: Math.random() * 2 + 1,
        },
      ]);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // elapsed timer (for score/time display)
  // Keep counting while playing and during the final lock screen; stop when victory achieved.
  useEffect(() => {
    if (!startTime) return;

    const update = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));

    if (gameState === "playing" || gameState === "final") {
      update();
      const iv = setInterval(update, 1000);
      return () => clearInterval(iv);
    }

    // If we've reached victory, capture the final elapsed once and stop the timer.
    if (gameState === "victory") {
      update();
    }
    return undefined;
  }, [startTime, gameState]);

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
    // Integrate actual sound effects here
  };

  const handleTimeout = () => {
    if (transitioning || timeoutHandledRef.current) return;

    // prevent multiple timeout handlers queuing multiple next-level steps
    timeoutHandledRef.current = true;

    playSound("timeout");
    setMessage("⏰ Time collapsed! Moving forward...");
    const clueSnippet = currentPuzzle.clue.slice(0, Math.max(3, Math.floor(currentPuzzle.clue.length / 2)));
    setClues([...clues, clueSnippet]);

    setTransitioning(true);
    setTimeout(() => goToNextLevel(), 2000);
  };

  const handleSubmit = () => {
    if (transitioning || !currentPuzzle) return;

    const correct =
      answer.toUpperCase().trim() === currentPuzzle.answer.toUpperCase();

    if (correct) {
      playSound("correct");
      setScore((s) => s + 5);
      setMessage("✨ Correct! Reality stabilizes...");
      setClues([...clues, currentPuzzle.clue]);

      setTransitioning(true);
      setTimeout(() => goToNextLevel(), 2000);
    } else {
      playSound("wrong");
      setMessage("❌ Incorrect. Try again...");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleMiniGameComplete = (code) => {
    playSound("correct");
    setScore((s) => s + 5);
    setMessage("✨ Mini-game complete! Well done...");
    setClues([...clues, currentPuzzle.clue]);
    setMiniGameComplete(true);

    setTransitioning(true);
    setTimeout(() => goToNextLevel(), 2000);
  };

  const handleSkip = () => {
    if (transitioning) return;

    playSound("skip");
    setMessage("⏭️ Skipping... Partial data recovered.");
    const clueSnippet = currentPuzzle.clue.slice(0, 4);
    setClues([...clues, clueSnippet]);

    setTransitioning(true);
    setTimeout(() => goToNextLevel(), 1500);
  };

  const handleHint = () => {
    if (!hintUsed && currentPuzzle) {
      setHintUsed(true);
      setTimeLeft(Math.max(10, timeLeft - 15));
      setMessage(`💡 Hint: ${currentPuzzle.hint}`);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  const handleFinalSubmit = () => {
    const finalAnswer = answer.toUpperCase().trim();
    // Build the master code from the canonical puzzle clues (full clues, not snippets)
    const masterCode = puzzles.slice(0, 43).map((p) => p.clue).join("");

    if (finalAnswer === masterCode || finalAnswer === "CHRONOCIPHER") {
      playSound("victory");
      setScore((s) => s + 10);
      setGameState("victory");
      const totalTimeMs = startTime ? Date.now() - startTime : 0;
      gameProgressManager.saveProgress({
        level: 44,
        clues,
        gameState: "victory",
        timeLeft: 0,
        hintUsed,
        totalScore: score + 10,
        startTime,
        totalTimeMs,
      });
    } else {
      setMessage("❌ The cipher remains locked. Review your clues carefully.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const goToNextLevel = () => {
    if (transitioning) return;
    setTransitioning(true);
    setLevel((prev) => {
      const nextLevel = prev + 1;
      if (nextLevel === 44) {
        setGameState("final");
      } else if (nextLevel > 44) {
        setGameState("victory");
      }
      return nextLevel;
    });
  };

  useEffect(() => {
    setTransitioning(false);
    // reset timeout guard when we move to a new level so timeouts can trigger again
    timeoutHandledRef.current = false;
  }, [level]);

  // Victory screen
  if (gameState === "victory") {
    return (
      <VictoryScreen
        clues={clues}
        onPlayAgain={() => {
          setLevel(1);
          setClues([]);
          setGameState("playing");
          setAnswer("");
          gameProgressManager.clearProgress();
        }}
        teamInfo={teamInfo}
        score={score}
        elapsed={elapsed}
      />
    );
  }

  // Loader while restoring saved progress
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-cyan-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl font-semibold">Restoring progress...</div>
          <div className="text-sm text-gray-400">Loading your level and hints from storage</div>
        </div>
      </div>
    );
  }

  // Final cipher screen (interactive lock)
  // If team info not provided yet, show team setup (unless game finished)
  if (!teamInfo && gameState !== "victory") {
    return <TeamForm onSave={(t) => setTeamInfo(t)} />;
  }
  if (level === 44 && gameState === "final") {
    return (
      <CipherLockScreen
        clues={clues}
        masterCode={masterCode}
        onUnlock={(code) => {
          // Accept unlock and show victory
          playSound("victory");
          setMessage("Master key accepted. Vault opening...");
          setTimeout(() => {
            setGameState("victory");
            setScore((s) => s + 10);
            const totalTimeMs = startTime ? Date.now() - startTime : 0;
            gameProgressManager.saveProgress({ level: 44, clues, gameState: "victory", timeLeft: 0, hintUsed, totalScore: score + 10, startTime, totalTimeMs });
          }, 900);
        }}
      />
    );
  }

  // Render mini-game
  if (isMiniGame(currentPuzzle) && !miniGameComplete) {
    return (
      <div className="min-h-screen bg-linear-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
        <ProgressBar level={level} totalLevels={44} />
        <div className="fixed top-2 right-2 z-50 bg-black/70 border border-cyan-500 rounded px-3 py-2 text-sm text-cyan-200 font-bold">
          <div>Score: {score}</div>
          <div className="text-xs text-gray-400">Time: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}</div>
        </div>

        <div className="absolute inset-0 opacity-20">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: p.x + "%",
                top: p.y + "%",
                animation: `fall ${p.speed}s linear`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-10 relative z-10 shadow-2xl shadow-cyan-500/50 mt-8">
          <PuzzleHeader
            level={level}
            totalLevels={44}
            title={currentPuzzle.title}
            story={currentPuzzle.story}
          />

          <TimerDisplay timeLeft={timeLeft} warning={15} />

          <div className="mb-8">
            <div className="bg-purple-900/30 border-2 border-purple-500 rounded-lg p-8">
              <h2 className="text-2xl text-cyan-300 font-bold mb-6 text-center">
                {currentPuzzle.question}
              </h2>

              {currentPuzzle.type === "minigame_sudoku" && (
                <SudokuMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  onTimeout={handleTimeout}
                  timeLeft={timeLeft}
                />
              )}

              {currentPuzzle.type === "minigame_pattern" && (
                <PatternMatchMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  timeLeft={timeLeft}
                />
              )}

              {currentPuzzle.type === "minigame_puzzle" && (
                <PuzzleFragmentMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                />
              )}

              {currentPuzzle.type === "minigame_maze" && (
                <MazeMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  timeLeft={timeLeft}
                  onTimeout={handleTimeout}
                />
              )}

              {currentPuzzle.type === "minigame_simon" && (
                <SimonMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  timeLeft={timeLeft}
                  onTimeout={handleTimeout}
                />
              )}

              {currentPuzzle.type === "minigame_breakout" && (
                <BreakoutMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  timeLeft={timeLeft}
                  onTimeout={handleTimeout}
                />
              )}

              {currentPuzzle.type === "minigame_typing" && (
                <TypingChallengeMiniGame
                  puzzle={currentPuzzle}
                  onComplete={handleMiniGameComplete}
                  timeLeft={timeLeft}
                  onTimeout={handleTimeout}
                />
              )}
            </div>
          </div>

          <MessageDisplay message={message} />

          <div className="flex gap-3 justify-center flex-wrap">
            {currentPuzzle.type !== "minigame_maze" && (
              <button
                onClick={handleHint}
                disabled={hintUsed}
                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                  hintUsed
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg"
                }`}
              >
                💡 HINT
              </button>
            )}

            <button
              onClick={handleSkip}
              className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg font-bold hover:bg-gray-600 transition-all shadow-lg"
            >
              ⏭️ SKIP
            </button>
          </div>

          <CluesDisplay clues={clues} maxClues={40} />
        </div>

        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh);
            }
          }
        `}</style>
      </div>
    );
  }

  // Regular puzzle screen
  return (
    <div className="min-h-screen bg-linear-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <ProgressBar level={level} totalLevels={44} />
      <div className="fixed top-2 right-2 z-50 bg-black/70 border border-cyan-500 rounded px-3 py-2 text-sm text-cyan-200 font-bold">
        <div>Score: {score}</div>
        <div className="text-xs text-gray-400">Time: {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}</div>
      </div>

      <div className="absolute inset-0 opacity-20">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: p.x + "%",
              top: p.y + "%",
              animation: `fall ${p.speed}s linear`,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-10 relative z-10 shadow-2xl shadow-cyan-500/50 mt-8">
        <PuzzleHeader
          level={level}
          totalLevels={44}
          title={currentPuzzle?.title}
          story={currentPuzzle?.story}
        />

        <TimerDisplay timeLeft={timeLeft} warning={10} />

        <div className="mb-8 p-8 bg-purple-900/30 border-2 border-purple-500 rounded-lg">
          <h2 className="text-2xl text-cyan-300 font-bold mb-6">
            {currentPuzzle?.question}
          </h2>

          <PuzzleContent
            puzzle={currentPuzzle}
            onSelect={(opt) => setAnswer(opt)}
            selectedOption={answer}
          />

          {/* Only show text input for puzzles that require typed answers.
              Hide input for mini-games and puzzles that present clickable options. */}
          {currentPuzzle && !isMiniGame(currentPuzzle) && !(currentPuzzle.options && currentPuzzle.options.length > 0) && (
            <PuzzleInput
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            />
          )}
        </div>

        <MessageDisplay message={message} />

        <ActionButtons
          onSubmit={handleSubmit}
          onHint={handleHint}
          onSkip={handleSkip}
          hintUsed={hintUsed}
          disableActions={transitioning}
        />

        <CluesDisplay clues={clues} maxClues={40} />
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </div>
  );
};

export default ChronoCipher;
