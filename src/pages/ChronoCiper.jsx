import React, { useState, useEffect, useRef } from "react";
import { Clock, Zap, ArrowRight, SkipForward, Lightbulb } from "lucide-react";

const ChronoCipher = () => {
  const [level, setLevel] = useState(1);
  const [clues, setClues] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState("playing");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [particles, setParticles] = useState([]);
  const [transitioning, setTransitioning] = useState(false);

  const audioRef = useRef(null);

  //   const puzzles = [
  //   {
  //     id: 1,
  //     type: "pattern",
  //     title: "Neural Pattern Recognition",
  //     story: "Level 01: The Vault awakens. Something here is wrong.",
  //     question: "Which symbol is different?",
  //     options: ["◆", "◆", "◇", "◆", "◆"],
  //     answer: "◇",
  //     hint: "One isn't like the others… look closely.",
  //     clue: "CHRONO",
  //     time: 45,
  //   },
  //   {
  //     id: 2,
  //     type: "word",
  //     title: "Temporal Scramble",
  //     story: "Level 02: Time fragments letters.",
  //     question: "Unscramble: MTEI",
  //     answer: "TIME",
  //     hint: "The first letter is **T**.",
  //     clue: "CIPHER",
  //     time: 40,
  //   },
  //   {
  //     id: 3,
  //     type: "sequence",
  //     title: "Fibonacci Gateway",
  //     story: "Level 03: Only nature remembers the rhythm.",
  //     question: "Next number: 1, 1, 2, 3, 5, 8, ?",
  //     answer: "13",
  //     hint: "Look at the last two numbers.",
  //     clue: "VAULT",
  //     time: 50,
  //   },
  //   {
  //     id: 4,
  //     type: "morse",
  //     title: "Transmission Decode",
  //     story: "Level 04: The signal repeats through centuries.",
  //     question: "Morse: ... --- ...",
  //     answer: "SOS",
  //     hint: "Short. Long. Short.",
  //     clue: "SEALED",
  //     time: 55,
  //   },
  //   {
  //     id: 5,
  //     type: "reverse",
  //     title: "Paradox Chamber",
  //     story: "Level 05: Logic bends.",
  //     question: 'Type "WRONG" to proceed',
  //     answer: "WRONG",
  //     hint: "Sometimes instructions are already inverted.",
  //     clue: "BEYOND",
  //     time: 35,
  //   },
  //   {
  //     id: 6,
  //     type: "cipher",
  //     title: "Caesar Rotation",
  //     story: "Level 06: History repeats, letters return.",
  //     question: "Decode (shift -3): NHBA",
  //     answer: "KEYS",
  //     hint: "Answer begins with **K**.",
  //     clue: "REALITY",
  //     time: 60,
  //   },
  //   {
  //     id: 7,
  //     type: "visual",
  //     title: "Constellation Memory",
  //     story: "Level 07: Stars form patterns, not chaos.",
  //     question: "Which constellation contains the belt of three aligned stars?",
  //     answer: "ORION",
  //     hint: "Name begins with **O**.",
  //     clue: "FRACTURE",
  //     time: 50,
  //   },
  //   {
  //     id: 8,
  //     type: "binary",
  //     title: "Digital Consciousness",
  //     story: "Level 08: Machines speak softly.",
  //     question: "Binary: 01001000 01001001",
  //     answer: "HI",
  //     hint: "Two characters. Friendly greeting.",
  //     clue: "BETWEEN",
  //     time: 60,
  //   },
  //   {
  //     id: 9,
  //     type: "riddle",
  //     title: "Temporal Riddle",
  //     story: "Level 09: Time has no mercy.",
  //     question: "I have a face but no eyes… Solve me.",
  //     answer: "CLOCK",
  //     hint: "Not alive, but it watches time.",
  //     clue: "WORLDS",
  //     time: 55,
  //   },
  //   {
  //     id: 10,
  //     type: "shadow_math",
  //     title: "Obscured Equation",
  //     story: "Level 10: Numbers lie in the shadows.",
  //     question: "Solve: (14 × 4) ÷ 2 - 6",
  //     answer: "22",
  //     hint: "Start with multiplication.",
  //     clue: "HIDDEN",
  //     time: 55,
  //   },
  //   {
  //     id: 11,
  //     type: "anagram",
  //     title: "Stellar Anagram",
  //     story: "Level 11: Letters orbit meaning.",
  //     question: "NOOM → ?",
  //     answer: "MOON",
  //     hint: "Night sky. Silver glow.",
  //     clue: "PORTAL",
  //     time: 45,
  //   },
  //   {
  //     id: 12,
  //     type: "logic",
  //     title: "Alien Logic",
  //     story: "Level 12: Think like something non-human.",
  //     question: "If A=B, and B=C, is A=C?",
  //     answer: "YES",
  //     hint: "Follow consistency, not language.",
  //     clue: "AWAITS",
  //     time: 50,
  //   },
  //   {
  //     id: 13,
  //     type: "symbol",
  //     title: "Ancient Glyphs",
  //     story: "Level 13: Symbols speak silently.",
  //     question: "☼=Sun, ☾=Moon, ★=?",
  //     answer: "STAR",
  //     hint: "Night guards.",
  //     clue: "THOSE",
  //     time: 50,
  //   },
  //   {
  //     id: 14,
  //     type: "memory",
  //     title: "Memory Flash",
  //     story: "Level 14: Recall or collapse.",
  //     question: "What was the answer to Level 2?",
  //     answer: "TIME",
  //     hint: "Your second clue word begins with **C**.",
  //     clue: "BRAVE",
  //     time: 45,
  //   },
  //   {
  //     id: 15,
  //     type: "direction",
  //     title: "Compass Lock",
  //     story: "Level 15: Orient yourself.",
  //     question: "Opposite of South?",
  //     answer: "NORTH",
  //     hint: "Up.",
  //     clue: "ENOUGH",
  //     time: 40,
  //   },
  //   {
  //     id: 16,
  //     type: "sequence",
  //     title: "Prime Gate",
  //     story: "Level 16: Only prime numbers pass.",
  //     question: "Next prime: 2, 3, 5, 7, 11, 13, ?",
  //     answer: "17",
  //     hint: "It’s not divisible by 2, 3, or 5.",
  //     clue: "ESCAPE",
  //     time: 50,
  //   },
  //   {
  //     id: 17,
  //     type: "riddle",
  //     title: "Orbital Truth",
  //     story: "Level 17: Only one supports life.",
  //     question: "Third planet from the Sun?",
  //     answer: "EARTH",
  //     hint: "Blue and alive.",
  //     clue: "VOID",
  //     time: 50,
  //   },
  //   {
  //     id: 18,
  //     type: "cipher",
  //     title: "Symbolic Chemistry",
  //     story: "Level 18: Formula hides meaning.",
  //     question: "Decode the alchemical symbol: 🜄",
  //     answer: "WATER",
  //     hint: "Life requires it.",
  //     clue: "FIND",
  //     time: 50,
  //   },
  //   {
  //     id: 19,
  //     type: "counting",
  //     title: "Temporal Count",
  //     story: 'Level 19: Count precisely.',
  //     question: 'How many letters in "CHRONOCIPHER"?',
  //     answer: "12",
  //     hint: "Not 10. Not 11.",
  //     clue: "EXIT",
  //     time: 50,
  //   },
  //   {
  //     id: 20,
  //     type: "final_prep",
  //     title: "Convergence Point",
  //     story: "Level 20: Patterns align.",
  //     question: "After 20?",
  //     answer: "21",
  //     hint: "Next.",
  //     clue: "NOW",
  //     time: 40,
  //   },
  // ];

  const puzzles = [
    {
      id: 1,
      type: "pattern",
      title: "Neural Pattern Recognition",
      story: "Level 01: The Vault awakens. Identify the anomaly.",
      question: "Which symbol does NOT follow the same rotational symmetry?",
      options: ["▲", "◆", "◇", "▲", "▲"],
      answer: "◇",
      hint: "Some shapes flip and look the same… one does not.",
      clue: "CHRONO",
      time: 45,
    },
    {
      id: 2,
      type: "cipher",
      title: "Broken Language",
      story: "Level 02: The letters are scrambled by time.",
      question:
        "Decode the scrambled word: E T I M (Order based on clockwise alphabet positions)",
      answer: "TIME",
      hint: "Clockwise from E.",
      clue: "CIPHER",
      time: 40,
    },
    {
      id: 3,
      type: "sequence",
      title: "Fibonacci Gate",
      story: "Level 03: Nature remembers what you forget.",
      question: "Next: 1, 1, 2, 3, 5, 8, 13, ___",
      answer: "21",
      hint: "Sum the previous two.",
      clue: "VAULT",
      time: 50,
    },
    {
      id: 4,
      type: "audio/morse",
      title: "Silent Signal",
      story: "Level 04: A forgotten distress call echoes.",
      question: "Solve: ... --- ...",
      answer: "SOS",
      hint: "Three short. Three long. Three short.",
      clue: "SEALED",
      time: 55,
    },
    {
      id: 5,
      type: "reverse",
      title: "Paradox Chamber",
      story: "Level 05: Logic bends. Instructions lie.",
      question: "To continue, type the OPPOSITE of 'RIGHT'.",
      answer: "LEFT",
      hint: "Not everything is literal.",
      clue: "BEYOND",
      time: 40,
    },
    {
      id: 6,
      type: "cipher",
      title: "Caesar Lock",
      story: "Level 06: Letters rewind through time.",
      question: "ROT‒5 Cipher: FXYM → ?",
      answer: "BTSH",
      hint: "Shift backward through the alphabet.",
      clue: "REALITY",
      time: 60,
    },
    {
      id: 7,
      type: "visual",
      title: "Constellation Memory",
      story: "Level 07: Stars form patterns — not randomness.",
      question:
        "Which constellation contains the three aligned stars known as 'The Belt'?",
      answer: "ORION",
      hint: "Hunter of the night sky.",
      clue: "FRACTURE",
      time: 55,
    },
    {
      id: 8,
      type: "binary",
      title: "Digital Consciousness",
      story: "Level 08: Machines whisper truth.",
      question: "01010100 01001001 01001101 01000101",
      answer: "TIME",
      hint: "ASCII. Group letters.",
      clue: "BETWEEN",
      time: 65,
    },
    {
      id: 9,
      type: "riddle",
      title: "Temporal Riddle",
      story: "Level 09: Time mocks memory.",
      question: "It runs, but never walks. It murmurs, but never talks.",
      answer: "RIVER",
      hint: "Always moving.",
      clue: "WORLDS",
      time: 55,
    },
    {
      id: 10,
      type: "logic",
      title: "Truth Table Lock",
      story: "Level 10: Nothing is true. Everything is logic.",
      question: "IF (A=true, B=false) and (A && B = ?)",
      answer: "FALSE",
      hint: "Both must be true.",
      clue: "HIDDEN",
      time: 60,
    },
    {
      id: 11,
      type: "anagram",
      title: "Forgotten Name",
      story: "Level 11: Rearrange time.",
      question: "Anagram: 'NOMAEG'",
      answer: "OMEGAN",
      hint: "Last letter of the Greek alphabet… but twisted.",
      clue: "PORTAL",
      time: 55,
    },
    {
      id: 12,
      type: "symbolic_math",
      title: "Alien Equation",
      story: "Level 12: Symbols replace numbers.",
      question: "★ = 4, ☽ = 2, ✚ = multiply → Solve: ★ ✚ ☽",
      answer: "8",
      hint: "Replace symbols with values.",
      clue: "AWAITS",
      time: 60,
    },
    {
      id: 13,
      type: "visual",
      title: "Ancient Glyphs",
      story: "Level 13: Symbols speak silently.",
      question: "☼=Sun, ☾=Moon, 🜂=Fire, 🜄=?",
      answer: "WATER",
      hint: "Opposite of fire.",
      clue: "THOSE",
      time: 60,
    },
    {
      id: 14,
      type: "memory",
      title: "Recall the Past",
      story: "Level 14: Time tests memory.",
      question: "What was the answer to Level 4?",
      answer: "SOS",
      hint: "A repeated plea.",
      clue: "BRAVE",
      time: 45,
    },
    {
      id: 15,
      type: "direction",
      title: "Compass Lock",
      story: "Level 15: Orient or be lost.",
      question: "Opposite of WEST?",
      answer: "EAST",
      hint: "Sunrise.",
      clue: "ENOUGH",
      time: 40,
    },
    {
      id: 16,
      type: "pattern",
      title: "Prime Sequence",
      story: "Level 16: Logic rejects repetition.",
      question: "Next: 2, 3, 5, 7, 11, 13, 17, ___",
      answer: "19",
      hint: "No divisors.",
      clue: "ESCAPE",
      time: 55,
    },
    {
      id: 17,
      type: "deduction",
      title: "Orbital Truth",
      story: "Level 17: Only one sustains life.",
      question: "Third planet from the Sun?",
      answer: "EARTH",
      hint: "Blue planet.",
      clue: "VOID",
      time: 45,
    },
    {
      id: 18,
      type: "cipher",
      title: "Runic Encryption",
      story: "Level 18: The ancients wrote differently.",
      question: "ᚺᛁ → ? (Elder Futhark)",
      answer: "HI",
      hint: "Runes equal letters.",
      clue: "FIND",
      time: 60,
    },
    {
      id: 19,
      type: "counting",
      title: "Temporal Measure",
      story: "Level 19: Count precisely.",
      question: 'Count characters: "CHRONOCIPHER"',
      answer: "12",
      hint: "Double-check.",
      clue: "EXIT",
      time: 50,
    },
    {
      id: 20,
      type: "final_prep",
      title: "Convergence Point",
      story: "Level 20: The end approaches.",
      question: "Prepare: 'What number follows 20?'",
      answer: "21",
      hint: "You already know.",
      clue: "NOW",
      time: 40,
    },
  ];

  const currentPuzzle = level <= 20 ? puzzles[level - 1] : null;

  useEffect(() => {
    if (level <= 20 && gameState === "playing") {
      setTimeLeft(currentPuzzle?.time || 60);
      setAnswer("");
      setMessage("");
      setHintUsed(false);
    }
  }, [level]);

  useEffect(() => {
    if (gameState === "playing" && level <= 20 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && level <= 20) {
      handleTimeout();
    }
  }, [timeLeft, gameState, level]);

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

  const playSound = (type) => {
    // Placeholder for sound effects
    console.log(`Playing ${type} sound`);
  };

  const handleTimeout = () => {
    if (transitioning) return;

    playSound("timeout");
    setMessage("⏰ Time collapsed! Moving forward...");
    setClues([...clues, `${currentPuzzle.clue.slice(0, 3)}...`]);

    setTransitioning(true);
    setTimeout(() => goToNextLevel(), 2000);
  };

  const handleSubmit = () => {
    if (transitioning) return;

    const correct =
      answer.toUpperCase().trim() === currentPuzzle.answer.toUpperCase();
    if (correct) {
      playSound("correct");
      setMessage("✨ Correct! Reality stabilizes...");
      setClues([...clues, currentPuzzle.clue]);

      setTransitioning(true);
      setTimeout(() => goToNextLevel(), 2000);
    } else {
      playSound("wrong");
      setMessage("❌ Incorrect. Time fractures...");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleSkip = () => {
    if (transitioning) return;

    playSound("skip");
    setMessage("⏭️ Skipping... Partial data recovered.");
    setClues([...clues, `${currentPuzzle.clue.slice(0, 4)}...`]);

    setTransitioning(true);
    setTimeout(() => goToNextLevel(), 1500);
  };

  const handleHint = () => {
    if (!hintUsed) {
      setHintUsed(true);
      setTimeLeft(Math.max(10, timeLeft - 15));
      setMessage(`💡 Hint: ${currentPuzzle.hint}`);
    }
  };

  const handleFinalSubmit = () => {
    const finalAnswer = answer.toUpperCase().trim();
    const correctAnswer = clues.join("");

    if (finalAnswer === correctAnswer || finalAnswer.includes("CHRONO")) {
      playSound("victory");
      setGameState("victory");
    } else {
      setMessage("❌ The cipher remains locked. Review your clues.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const goToNextLevel = () => {
    if (transitioning) return; // prevent double-trigger
    setTransitioning(true);
    setLevel((prev) => prev + 1);
    setGameState("playing");
  };

  useEffect(() => {
    setTransitioning(false);
  }, [level]);

  const renderPuzzleContent = () => {
  switch (currentPuzzle.type) {

    case "pattern":
      return (
        currentPuzzle.options?.length > 0 && (
          <div className="flex gap-4 justify-center text-4xl">
            {currentPuzzle.options.map((opt, idx) => (
              <div key={idx} className="text-cyan-400">{opt}</div>
            ))}
          </div>
        )
      );

    case "binary":
    case "cipher":
    case "riddle":
    case "word":
    case "sequence":
    case "logic":
    case "visual":
    default:
      return (
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full mt-4 p-3 bg-black border-2 border-cyan-500 rounded text-cyan-300 font-mono"
          placeholder="Enter your answer..."
          autoFocus
        />
      );
  }
};


  if (gameState === "victory") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
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

        <div className="max-w-2xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-8 text-center relative z-10 animate-pulse">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">
            VAULT UNLOCKED
          </h1>
          <p className="text-xl text-purple-300 mb-6">
            You have decoded the ChronoCipher and escaped the temporal prison.
          </p>
          <div className="text-lg text-gray-300 mb-4">
            The portal home is now open. The vault's secrets are yours.
          </div>
          <div className="text-cyan-400 text-2xl font-mono mt-6">
            FINAL CODE: {clues.join("")}
          </div>
          <button
            onClick={() => {
              setLevel(1);
              setClues([]);
              setGameState("playing");
            }}
            className="mt-8 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  if (level === 21) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
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

        <div className="max-w-2xl w-full bg-black/80 border-2 border-purple-500 rounded-lg p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-400 mb-4">
              LEVEL 21: FINAL CIPHER
            </h1>
            <p className="text-cyan-300 text-lg mb-6">
              The Vault's core awaits. Combine all your clue fragments to form
              the Master Key.
            </p>
          </div>

          <div className="mb-6 p-4 bg-purple-900/30 border border-purple-500 rounded">
            <h3 className="text-cyan-400 font-bold mb-2">Collected Clues:</h3>
            <div className="grid grid-cols-2 gap-2">
              {clues.map((clue, idx) => (
                <div key={idx} className="text-purple-300 font-mono text-sm">
                  {idx + 1}. {clue}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-cyan-400 mb-2 font-bold">
              Enter the Master Code:
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleFinalSubmit()}
              className="w-full p-4 bg-black border-2 border-purple-500 rounded text-cyan-300 font-mono text-xl focus:border-cyan-400 focus:outline-none"
              placeholder="Combine all clues..."
              autoFocus
            />
          </div>

          {message && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-center">
              {message}
            </div>
          )}

          <button
            onClick={handleFinalSubmit}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-bold text-xl hover:from-purple-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2"
          >
            <Zap size={24} />
            UNLOCK THE VAULT
          </button>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Hint: Join the clue words together in order (no spaces)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
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

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-black">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(level / 21) * 100}%` }}
        />
      </div>

      <div className="max-w-2xl w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-8 relative z-10 shadow-2xl shadow-cyan-500/50">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-cyan-400 text-sm mb-2">SECTOR {level} / 21</div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">
            {currentPuzzle.title}
          </h1>
          <p className="text-purple-300 text-sm italic">
            {currentPuzzle.story}
          </p>
        </div>

        {/* Timer */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <Clock className="text-cyan-400" />
          <div
            className={`text-3xl font-mono font-bold ${
              timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-cyan-400"
            }`}
          >
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        {/* Puzzle content */}
        <div className="mb-6 p-6 bg-purple-900/30 border border-purple-500 rounded-lg">
          <h2 className="text-xl text-cyan-300 font-bold mb-4">
            {currentPuzzle.question}
          </h2>

          {currentPuzzle.options && currentPuzzle.options.length > 0 && (
            <div className="flex gap-4 justify-center text-4xl">
              {currentPuzzle.options.map((opt, idx) => (
                <div key={idx} className="text-cyan-400">
                  {opt}
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full mt-4 p-3 bg-black border-2 border-cyan-500 rounded text-cyan-300 font-mono focus:border-purple-500 focus:outline-none"
            placeholder="Enter your answer..."
            autoFocus
          />
        </div>

        {/* Message display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-center font-bold ${
              message.includes("Correct")
                ? "bg-green-900/30 border border-green-500 text-green-300"
                : message.includes("Hint")
                ? "bg-blue-900/30 border border-blue-500 text-blue-300"
                : "bg-red-900/30 border border-red-500 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-bold hover:from-cyan-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
          >
            <ArrowRight size={20} />
            SUBMIT
          </button>

          <button
            onClick={handleHint}
            disabled={hintUsed}
            className={`px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              hintUsed
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <Lightbulb size={20} />
            HINT
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-3 bg-gray-700 text-gray-300 rounded-lg font-bold hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <SkipForward size={20} />
            SKIP
          </button>
        </div>

        {/* Clue collection */}
        <div className="mt-6 pt-6 border-t border-purple-500">
          <div className="text-xs text-gray-400 mb-2">
            CLUES RECOVERED: {clues.length}/20
          </div>
          <div className="flex flex-wrap gap-2">
            {clues.map((clue, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-900/50 border border-purple-500 rounded text-purple-300 text-xs font-mono"
              >
                {clue}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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
