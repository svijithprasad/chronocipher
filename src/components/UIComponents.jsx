import React from "react";
import { Clock, Zap, ArrowRight, SkipForward, Lightbulb, RotateCcw } from "lucide-react";

export const TimerDisplay = ({ timeLeft, warning = 10 }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / 200)}`}
            className={`transition-all duration-500 ${
              timeLeft <= warning ? "text-red-500" : "text-cyan-400"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={timeLeft <= warning ? "text-red-500" : "text-cyan-400"} />
        </div>
      </div>

      <div
        className={`text-4xl font-mono font-bold ${
          timeLeft <= warning ? "text-red-500 animate-pulse" : "text-cyan-400"
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export const PuzzleHeader = ({ level, totalLevels, title, story }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="text-cyan-400 text-xs font-bold tracking-widest">
          SECTOR {level} / {totalLevels}
        </div>
        <div className="text-gray-500 text-xs">
          {Math.round((level / totalLevels) * 100)}% COMPLETE
        </div>
      </div>

      <h1 className="text-4xl font-bold text-cyan-400 mb-2 drop-shadow-lg">
        {title}
      </h1>

      <p className="text-purple-300 text-sm italic max-w-md mx-auto leading-relaxed">
        {story}
      </p>
    </div>
  );
};

export const ActionButtons = ({ onSubmit, onHint, onSkip, hintUsed, disableActions }) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <button
        onClick={onSubmit}
        disabled={disableActions}
        className={`py-3 px-6 rounded-lg font-bold transition-all flex items-center gap-2 ${
          disableActions
            ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            : "bg-linear-to-r from-cyan-600 to-purple-600 text-white hover:from-cyan-500 hover:to-purple-500 shadow-lg hover:shadow-cyan-500/50"
        }`}
      >
        <ArrowRight size={20} />
        SUBMIT
      </button>

      <button
        onClick={onHint}
        disabled={hintUsed || disableActions}
        className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
          hintUsed || disableActions
            ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/50"
        }`}
      >
        <Lightbulb size={20} />
        HINT
      </button>

      <button
        onClick={onSkip}
        disabled={disableActions}
        className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
          disableActions
            ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-lg hover:shadow-gray-500/50"
        }`}
      >
        <SkipForward size={20} />
        SKIP
      </button>
    </div>
  );
};

export const CluesDisplay = ({ clues, maxClues }) => {
  return (
    <div className="mt-8 pt-6 border-t border-purple-500/30">
      <div className="text-xs text-gray-400 mb-3 font-bold tracking-widest">
        ◆ CLUES RECOVERED: {clues.length}/{maxClues}
      </div>
      <div className="flex flex-wrap gap-2">
        {clues.map((clue, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-linear-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/50 rounded-full text-purple-300 text-xs font-mono font-bold hover:border-purple-400 transition-all"
          >
            {idx + 1}. {clue}
          </span>
        ))}
      </div>
    </div>
  );
};

export const MessageDisplay = ({ message }) => {
  if (!message) return null;

  const isCorrect = message.includes("Correct");
  const isHint = message.includes("Hint") || message.includes("💡");
  const isSkip = message.includes("Skipping");
  const isTimeout = message.includes("Time");

  return (
    <div
      className={`mb-4 p-4 rounded-lg text-center font-bold text-lg border-2 backdrop-blur-sm animate-in fade-in duration-300 ${
        isCorrect
          ? "bg-green-900/40 border-green-500 text-green-300 shadow-lg shadow-green-500/20"
          : isHint
          ? "bg-blue-900/40 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/20"
          : isSkip
          ? "bg-gray-900/40 border-gray-500 text-gray-300 shadow-lg shadow-gray-500/20"
          : isTimeout
          ? "bg-red-900/40 border-red-500 text-red-300 shadow-lg shadow-red-500/20"
          : "bg-yellow-900/40 border-yellow-500 text-yellow-300 shadow-lg shadow-yellow-500/20"
      }`}
    >
      {message}
    </div>
  );
};

export const ProgressBar = ({ level, totalLevels }) => {
  const progress = (level / totalLevels) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-black/50 backdrop-blur-sm z-50">
      <div
        className="h-full bg-linear-to-r from-cyan-500 via-purple-500 to-cyan-500 shadow-lg shadow-cyan-500/50 transition-all duration-700"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export const VictoryScreen = ({ clues, onPlayAgain, score = 0, elapsed = 0, teamInfo = null }) => {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-12 text-center relative z-10 animate-pulse shadow-2xl shadow-cyan-500/50">
        <div className="absolute top-4 right-6 z-20 bg-black/70 border border-cyan-600 rounded px-3 py-2 text-sm text-cyan-200 font-bold flex gap-4 items-center">
          <div>Score: <span className="text-cyan-300">{score}</span></div>
          <div>Time: <span className="text-cyan-300">{minutes}:{seconds.toString().padStart(2, '0')}</span></div>
        </div>
        {teamInfo && (
          <div className="absolute top-4 left-6 z-20 bg-black/70 border border-purple-600 rounded px-3 py-2 text-sm text-purple-200 font-bold">
            <div className="text-xs text-gray-400">Team</div>
            <div className="text-cyan-200">{teamInfo.teamName}</div>
            <div className="text-xs text-gray-400 mt-1">Members</div>
            <div className="text-purple-200 text-sm">{(teamInfo.members || []).join(" / ")}</div>
          </div>
        )}
        <div className="text-7xl mb-8 animate-bounce">🎉</div>

        <h1 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
          VAULT UNLOCKED
        </h1>

        <p className="text-xl text-purple-300 mb-8 leading-relaxed">
          You have decoded the ChronoCipher and escaped the temporal prison. The boundaries of time
          bend to your will.
        </p>

        <div className="mb-8 p-6 bg-purple-900/30 border border-purple-500 rounded-lg">
          <div className="text-purple-300 text-sm mb-3 font-bold">CLUES RECOVERED</div>
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {clues.map((clue, idx) => {
              const isIncomplete = clue.length <= 4;
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    isIncomplete
                      ? "bg-orange-900/50 border border-orange-500/50 text-orange-300"
                      : "bg-black/50 border border-purple-500/50 text-purple-300"
                  }`}
                >
                  {idx + 1}. {clue}
                  {isIncomplete && "…"}
                </span>
              );
            })}
          </div>
          <div className="text-purple-300 text-sm mb-3 font-bold">MASTER CODE RECONSTRUCTED</div>
          <div className="text-cyan-400 text-3xl font-mono font-bold break-all">
            {clues.join("")}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export const CipherLockScreen = ({ clues, masterCode, derivedPasscode, onUnlock }) => {
  const [dials, setDials] = React.useState([0, 0, 0, 0]);
  const [message, setMessage] = React.useState("Rotate dials to match the master code");
  const [typedCode, setTypedCode] = React.useState("");

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

  const rotateDial = (idx, delta) => {
    setDials((prev) => {
      const next = [...prev];
      next[idx] = (next[idx] + delta + characters.length) % characters.length;
      return next;
    });
  };

  // autoAttemptRef prevents repeated auto-unlock triggers
  const autoAttemptRef = React.useRef(false);

  // Reset auto-attempt if user types or clues/master change
  React.useEffect(() => {
    autoAttemptRef.current = false;
  }, [typedCode, clues, masterCode, derivedPasscode]);

  // When the dials form a valid code (substring, derived passcode, or convenience), auto-attempt unlock
  React.useEffect(() => {
    const code = dials.map((d) => characters[d]).join("");
    const combined = masterCode || clues.join("");
    if (autoAttemptRef.current) return;
    if (
      code === combined ||
      code.includes("CHRONO") ||
      combined.includes(code) ||
      (derivedPasscode && code === derivedPasscode)
    ) {
      autoAttemptRef.current = true;
      setMessage("Auto-unlocked — matching segment detected.");
      setTimeout(() => onUnlock(code), 450);
    }
  }, [dials.join("")]);

  const attemptUnlock = () => {
    const code = dials.map((d) => characters[d]).join("");
    const combined = masterCode || clues.join("");
    if (
      code === combined ||
      code.includes("CHRONO") ||
      combined.includes(code) ||
      (derivedPasscode && code === derivedPasscode)
    ) {
      setMessage("Unlocked — Master key accepted.");
      setTimeout(() => onUnlock(code), 600);
    } else {
      setMessage("Incorrect. Use the clues or include 'CHRONO'.");
    }
  };

  const submitTyped = () => {
    const combined = masterCode || clues.join("");
    const cleaned = (typedCode || "").toUpperCase().trim();
    if (!cleaned) {
      setMessage("Type the full combined clues or a valid code.");
      return;
    }
    if (cleaned === combined || cleaned === "CHRONOCIPHER" || (derivedPasscode && cleaned === derivedPasscode)) {
      setMessage("Unlocked via typed master code.");
      setTimeout(() => onUnlock(cleaned), 400);
      return;
    }
    setMessage("Typed code not correct. Make sure you combined full clues exactly.");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-purple-950 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-purple-300 mb-4">Cipher Lock</h2>
        <p className="text-cyan-300 mb-6">Use the dials to enter the Master Code assembled from your clues.</p>

        <div className="flex justify-center gap-4 mb-6">
          {dials.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button
                onClick={() => rotateDial(idx, -1)}
                className="px-3 py-1 bg-purple-700 rounded text-white mb-2 hover:bg-purple-600"
                aria-label={`Rotate dial ${idx + 1} up`}
              >
                ▲
              </button>
              <div className="w-16 h-16 flex items-center justify-center bg-black border-2 border-purple-500 rounded text-cyan-300 font-mono text-xl">
                {characters[d]}
              </div>
              <button
                onClick={() => rotateDial(idx, 1)}
                className="px-3 py-1 bg-purple-700 rounded text-white mt-2 hover:bg-purple-600"
                aria-label={`Rotate dial ${idx + 1} down`}
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        <div className="my-4">
          <div className="text-sm text-gray-400 mb-2">
            Hint: Press Enter after typing the full combined clues or a valid code. You can also set dials and press Enter to attempt a 4-character segment.
          </div>
          <div className="flex gap-2 justify-center">
            <input
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitTyped()}
              placeholder="Paste full master code here"
              className="px-3 py-2 w-2/3 bg-black border-2 border-purple-500 rounded text-cyan-300"
            />
          </div>
        </div>

        <div className="mt-6 text-purple-300">{message}</div>

        <div className="mt-8 pt-6 border-t border-purple-500/30">
          <div className="text-xs text-gray-400 mb-3 font-bold tracking-widest">
            ◆ RECOVERED CLUES: {clues.length}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {clues.map((clue, idx) => {
              const isIncomplete = clue.length <= 4; // snippets are typically short
              return (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                    isIncomplete
                      ? "bg-orange-900/50 border border-orange-500/50 text-orange-300 hover:border-orange-400"
                      : "bg-linear-to-r from-purple-900/50 to-cyan-900/50 border border-purple-500/50 text-purple-300 hover:border-purple-400"
                  }`}
                >
                  {idx + 1}. {clue}
                  {isIncomplete && "…"}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FinalCipherScreen = ({ clues, answer, message, onSubmit, setAnswer }) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 2 + "s",
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl w-full bg-black/80 border-2 border-purple-500 rounded-lg p-10 relative z-10 shadow-2xl shadow-purple-500/50">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-purple-400 mb-4 drop-shadow-lg">
            LEVEL 41: FINAL CONVERGENCE
          </h1>
          <p className="text-cyan-300 text-lg leading-relaxed">
            The Vault's core awaits. All fragments combine to reveal the Master Key. The truth
            lies in unity.
          </p>
        </div>

        <div className="mb-8 p-6 bg-purple-900/30 border-2 border-purple-500 rounded-lg">
          <h3 className="text-cyan-400 font-bold mb-4 text-lg">FINAL CLUE SEQUENCE</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {clues.map((clue, idx) => {
              const isIncomplete = clue.length <= 4;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded text-sm text-center transition-all font-mono ${
                    isIncomplete
                      ? "bg-orange-900/30 border border-orange-500/50 text-orange-300 hover:border-orange-400"
                      : "bg-black/50 border border-purple-500/50 text-purple-300 hover:border-purple-400"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1">#{idx + 1}</div>
                  <div className="font-bold">
                    {clue}
                    {isIncomplete && "…"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center text-cyan-400 font-bold mb-4 bg-black/30 p-3 rounded border border-cyan-500/30">
            Combined: {clues.join("")}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-cyan-400 mb-3 font-bold text-lg">
            Enter the Master Code:
          </label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === "Enter" && onSubmit()}
            className="w-full p-4 bg-black border-2 border-purple-500 rounded-lg text-cyan-300 font-mono text-xl focus:border-cyan-400 focus:outline-none transition-all placeholder-gray-600"
            placeholder="Combine all clues..."
            autoFocus
          />
        </div>

        <MessageDisplay message={message} />

        {/* Removed the button to prefer Enter-key submission via the input above */}

        <div className="mt-6 text-center text-gray-400 text-sm border-t border-purple-500/30 pt-6">
          Hint: The master code is either the full combined clue sequence or contains "CHRONO"
        </div>
      </div>
    </div>
  );
};
