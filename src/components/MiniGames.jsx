import React, { useState, useEffect, useRef } from "react";

export const SudokuMiniGame = ({ puzzle, onComplete, onTimeout, timeLeft }) => {
  const [grid, setGrid] = useState(puzzle.puzzleGrid.map((row) => [...row]));

  const handleCellChange = (row, col, value) => {
    const numValue = value === "" ? 0 : Math.min(4, Math.max(1, parseInt(value) || 0));
    const newGrid = grid.map((r, i) =>
      i === row ? r.map((cell, j) => (j === col ? numValue : cell)) : r
    );
    setGrid(newGrid);

    // Check if solved
    if (isSolved(newGrid)) {
      onComplete("PERFECT");
    }
  };

  const isSolved = (gridToCheck) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (gridToCheck[row][col] !== puzzle.solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-2 bg-black/40 p-6 rounded-lg border border-purple-500 w-fit mx-auto">
        {grid.map((row, rowIdx) => (
          row.map((cell, colIdx) => {
            const isGiven = puzzle.puzzleGrid[rowIdx][colIdx] !== 0;
            return (
              <input
                key={`${rowIdx}-${colIdx}`}
                type="number"
                min="1"
                max="4"
                value={cell === 0 ? "" : cell}
                onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                disabled={isGiven}
                className={`w-12 h-12 text-center text-xl font-bold rounded border-2 ${
                  isGiven
                    ? "bg-purple-900/50 border-purple-600 text-cyan-300 cursor-not-allowed"
                    : "bg-black border-cyan-500 text-cyan-300 focus:border-purple-500 focus:outline-none"
                }`}
              />
            );
          })
        ))}
      </div>
      <div className="text-center text-purple-300">
        Complete the 4x4 grid. Each row, column, and 2x2 box must contain 1-4.
      </div>
    </div>
  );
};

export const PatternMatchMiniGame = ({ puzzle, onComplete, timeLeft }) => {
  const [cards, setCards] = useState(() => {
    const shuffled = [...puzzle.patterns].sort(() => Math.random() - 0.5);
    return shuffled.map((item, idx) => ({
      ...item,
      flipped: false,
      matched: false,
      uniqueIdx: idx,
    }));
  });
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardClick = (idx) => {
    if (cards[idx].matched || cards[idx].flipped || selectedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[idx].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, idx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (cards[first].id === cards[second].id) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setSelectedCards([]);

          if (matchedCards.every((card) => card.matched)) {
            onComplete("PERFECT");
          }
        }, 500);
      } else {
        setTimeout(() => {
          const flippedBack = [...cards];
          flippedBack[first].flipped = false;
          flippedBack[second].flipped = false;
          setCards(flippedBack);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-3 w-fit mx-auto">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(idx)}
            className={`w-16 h-16 rounded-lg border-2 cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl font-bold ${
              card.matched
                ? "bg-green-900/30 border-green-500 opacity-50"
                : card.flipped
                ? `bg-purple-900/50 border-purple-500 text-cyan-300`
                : "bg-gray-800 border-gray-600 hover:border-cyan-500"
            }`}
          >
            {card.matched || card.flipped ? card.symbol : "?"}
          </div>
        ))}
      </div>
      <div className="text-center text-purple-300">
        Match all pairs! {cards.filter((c) => c.matched).length / 2} / {puzzle.patterns.length / 2} pairs matched
      </div>
    </div>
  );
};

export const PuzzleFragmentMiniGame = ({ puzzle, onComplete }) => {
  const [arrangedFragments, setArrangedFragments] = useState(
    puzzle.fragmentPositions.map(() => null)
  );
  const [selectedFragment, setSelectedFragment] = useState(null);

  const handleFragmentClick = (fragmentIdx) => {
    setSelectedFragment(fragmentIdx);
  };

  const handleSlotClick = (slotIdx) => {
    if (selectedFragment !== null) {
      const newArranged = [...arrangedFragments];
      newArranged[slotIdx] = selectedFragment;
      setArrangedFragments(newArranged);

      if (newArranged.every((val, idx) => val === puzzle.correctOrder[idx])) {
        onComplete("COMPLETE");
      }

      setSelectedFragment(null);
    }
  };

  const handleUndo = (slotIdx) => {
    if (arrangedFragments[slotIdx] !== null) {
      const newArranged = [...arrangedFragments];
      newArranged[slotIdx] = null;
      setArrangedFragments(newArranged);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 bg-black/40 p-6 rounded-lg border border-purple-500 w-fit mx-auto">
        {arrangedFragments.map((fragmentIdx, slotIdx) => (
          <div
            key={`slot-${slotIdx}`}
            onClick={() => handleSlotClick(slotIdx)}
            className="w-16 h-16 border-2 border-dashed border-purple-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-900/30 transition-all text-2xl font-bold text-cyan-300"
          >
            {fragmentIdx !== null ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleUndo(slotIdx);
                }}
                className="w-full h-full flex items-center justify-center hover:bg-red-900/50 rounded"
              >
                {puzzle.fragments[fragmentIdx]}
              </div>
            ) : (
              "+"
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-cyan-300 mb-3 text-center">Available Fragments:</h3>
        <div className="flex gap-3 justify-center flex-wrap">
          {puzzle.fragments.map((fragment, idx) => (
            <div
              key={`frag-${idx}`}
              onClick={() => handleFragmentClick(idx)}
              className={`w-14 h-14 rounded border-2 flex items-center justify-center text-xl cursor-pointer transition-all ${
                selectedFragment === idx
                  ? "bg-cyan-500/30 border-cyan-400 scale-110"
                  : "bg-gray-800 border-gray-600 hover:border-cyan-500"
              }`}
            >
              {fragment}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MazeMiniGame = ({ puzzle, onComplete, timeLeft, onTimeout }) => {
  const [playerPos, setPlayerPos] = useState([1, 1]);
  const [solved, setSolved] = useState(false);
  const goalPos = [puzzle.gridSize - 2, puzzle.gridSize - 2];
  const walls = puzzle.walls || [];

  const isWall = (x, y) => walls.some((w) => w[0] === x && w[1] === y) || x < 0 || x >= puzzle.gridSize || y < 0 || y >= puzzle.gridSize;

  useEffect(() => {
    const handleKeyPress = (e) => {
      setPlayerPos((prev) => {
        let newPos = [...prev];
        switch (e.key) {
          case "ArrowUp":
            newPos = [prev[0], Math.max(0, prev[1] - 1)];
            break;
          case "ArrowDown":
            newPos = [prev[0], Math.min(puzzle.gridSize - 1, prev[1] + 1)];
            break;
          case "ArrowLeft":
            newPos = [Math.max(0, prev[0] - 1), prev[1]];
            break;
          case "ArrowRight":
            newPos = [Math.min(puzzle.gridSize - 1, prev[0] + 1), prev[1]];
            break;
          default:
            return prev;
        }

        if (isWall(newPos[0], newPos[1])) return prev;

        if (newPos[0] === goalPos[0] && newPos[1] === goalPos[1]) {
          setSolved(true);
          onComplete("VICTORY");
        }

        return newPos;
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onComplete, puzzle.gridSize]);

  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl font-bold text-cyan-300 mb-4">Navigate the Void</div>

      <div
        className="inline-block border-2 border-purple-500 bg-black/50 rounded-lg p-2"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
          gap: "2px",
        }}
      >
        {Array.from({ length: puzzle.gridSize ** 2 }).map((_, idx) => {
          const row = Math.floor(idx / puzzle.gridSize);
          const col = idx % puzzle.gridSize;
          const isPlayer = playerPos[0] === col && playerPos[1] === row;
          const isGoal = goalPos[0] === col && goalPos[1] === row;
          const isWallCell = isWall(col, row);

          return (
            <div
              key={idx}
              className={`w-6 h-6 rounded-sm transition-all ${
                isPlayer
                  ? "bg-cyan-400 shadow-lg shadow-cyan-400"
                  : isGoal
                  ? "bg-yellow-400 animate-pulse"
                  : isWallCell
                  ? "bg-purple-900"
                  : "bg-gray-800"
              }`}
            />
          );
        })}
      </div>

      <div className="text-purple-300 text-sm">
        Use arrow keys to navigate from start to the glowing goal. Avoid the walls!
      </div>
    </div>
  );
};

export const SnakeMiniGame = ({ puzzle, onComplete, timeLeft, onTimeout }) => {
  const [snake, setSnake] = useState([[3, 3]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState([1, 0]);
  const [nextDirection, setNextDirection] = useState([1, 0]);
  const [tokensEaten, setTokensEaten] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef([1, 0]);

  // Generate random food position
  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * puzzle.gridSize),
        Math.floor(Math.random() * puzzle.gridSize),
      ];
    } while (currentSnake.some((segment) => segment[0] === newFood[0] && segment[1] === newFood[1]));
    return newFood;
  };

  // Game loop
  useEffect(() => {
    if (gameOver || tokensEaten >= puzzle.tokensNeeded) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        if (!prevSnake || prevSnake.length === 0) return prevSnake;
        // Use the ref value as the current direction (keeps it in sync)
        const dir = directionRef.current;
        const head = [prevSnake[0][0] + dir[0], prevSnake[0][1] + dir[1]];

        // Check boundaries
        if (head[0] < 0 || head[0] >= puzzle.gridSize || head[1] < 0 || head[1] >= puzzle.gridSize) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          return prevSnake;
        }

        let newSnake = [head, ...prevSnake];

        // Check food collision
        if (head[0] === food[0] && head[1] === food[1]) {
          const newTokensEaten = tokensEaten + 1;
          setTokensEaten(newTokensEaten);

          if (newTokensEaten >= puzzle.tokensNeeded) {
            onComplete("VICTORY");
          }

          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameOver, tokensEaten, puzzle.tokensNeeded, puzzle.gridSize, food, onComplete]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const currentDir = directionRef.current;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (currentDir[1] === 0) {
            const nd = [0, -1];
            setNextDirection(nd);
            directionRef.current = nd;
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (currentDir[1] === 0) {
            const nd = [0, 1];
            setNextDirection(nd);
            directionRef.current = nd;
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (currentDir[0] === 0) {
            const nd = [-1, 0];
            setNextDirection(nd);
            directionRef.current = nd;
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          if (currentDir[0] === 0) {
            const nd = [1, 0];
            setNextDirection(nd);
            directionRef.current = nd;
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-2xl font-bold text-cyan-300 mb-4">
          Tokens: {tokensEaten} / {puzzle.tokensNeeded}
        </div>

        <div
          className="inline-block border-2 border-purple-500 bg-black/50 rounded-lg p-2"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`,
            gap: "2px",
          }}
        >
          {Array.from({ length: puzzle.gridSize ** 2 }).map((_, idx) => {
            const row = Math.floor(idx / puzzle.gridSize);
            const col = idx % puzzle.gridSize;
            const isSnake = snake.some((segment) => segment[0] === col && segment[1] === row);
            const isFood = food[0] === col && food[1] === row;
            const isHead = snake[0][0] === col && snake[0][1] === row;

            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded-sm transition-all ${
                  isHead
                    ? "bg-cyan-400 shadow-lg shadow-cyan-400"
                    : isSnake
                    ? "bg-cyan-300 opacity-70"
                    : isFood
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-gray-800"
                }`}
              />
            );
          })}
        </div>
      </div>

      {gameOver && (
        <div className="text-center text-red-400 font-bold text-lg">
          Game Over! Eat {puzzle.tokensNeeded - tokensEaten} more tokens!
        </div>
      )}

      <div className="text-center text-purple-300 text-sm">
        Use arrow keys to move. Avoid walls and yourself!
      </div>
    </div>
  );
};

export const SimonMiniGame = ({ puzzle, onComplete, timeLeft, onTimeout }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("Watch the sequence...");
  const audioRef = useRef(null);
  const [activeColor, setActiveColor] = useState(null);

  const colors = [
    { id: 0, class: "bg-red-500", hoverClass: "hover:bg-red-400" },
    { id: 1, class: "bg-blue-500", hoverClass: "hover:bg-blue-400" },
    { id: 2, class: "bg-yellow-500", hoverClass: "hover:bg-yellow-400" },
    { id: 3, class: "bg-green-500", hoverClass: "hover:bg-green-400" },
  ];

  // Play a color in the sequence
  const playColor = async (colorId, delay = 0) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    setActiveColor(colorId);
    setIsPlaying(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsPlaying(false);
    setActiveColor(null);
  };

  // Play the entire sequence
  const playSequence = async (seq) => {
    setGameActive(false);
    for (let i = 0; i < seq.length; i++) {
      await playColor(seq[i], 600);
    }
    setGameActive(true);
    setMessage("Your turn!");
  };

  // Initialize game only when player presses start
  const startGame = () => {
    if (started) return;
    setStarted(true);
    const initialSequence = [Math.floor(Math.random() * 4)];
    setSequence(initialSequence);
    playSequence(initialSequence);
  };

  // Handle user color selection
  const handleColorClick = (colorId) => {
    if (!gameActive) return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);
    // provide brief feedback flash for the clicked color (stronger visual cue)
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 300);

    // Check if user's input is correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setMessage("Wrong! Game Over.");
      setGameActive(false);
      return;
    }

    // If user completed the sequence
    if (newUserSequence.length === sequence.length) {
      if (level >= 5) {
        onComplete("VICTORY");
        return;
      }

      setLevel((lv) => lv + 1);
      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setUserSequence([]);
      setMessage("Great! Next level...");
      setTimeout(() => playSequence(newSequence), 1500);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl font-bold text-cyan-300">
        Level: {level} / 5
      </div>
      <div className="text-lg text-purple-300">{message}</div>

      {!started ? (
        <div className="flex justify-center">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-lg font-bold shadow-lg"
          >
            START
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-48 mx-auto">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id)}
              disabled={!gameActive}
              className={`w-20 h-20 rounded-lg ${color.class} ${
                gameActive ? color.hoverClass + " cursor-pointer" : "opacity-50 cursor-not-allowed"
              } transform transition-transform ${
                activeColor === color.id ? "scale-95 ring-8 ring-white/30 animate-pulse" : "scale-100"
              } shadow-lg`}
            />
          ))}
        </div>
      )}

      <div className="text-sm text-purple-300">
        Repeat the color sequence. Levels increase in difficulty.
      </div>
    </div>
  );
};

export const BreakoutMiniGame = ({ puzzle, onComplete, timeLeft, onTimeout }) => {
  const canvasRef = useRef(null);
  const [bricksDestroyed, setBricksDestroyed] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const gameStateRef = useRef({
    paddleX: 150,
    ballX: 190,
    ballY: 150,
        ballDX: 5,
        ballDY: -5,
    bricks: [],
    score: 0,
  });

  // Initialize bricks
  useEffect(() => {
    const bricks = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        bricks.push({
          x: col * 65 + 10,
          y: row * 20 + 10,
          width: 60,
          height: 15,
          active: true,
        });
      }
    }
    gameStateRef.current.bricks = bricks;
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    const gameLoop = setInterval(() => {
      // Update ball position
      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      // Ball collision with walls
      if (state.ballX < 0 || state.ballX > 400) state.ballDX *= -1;
      if (state.ballY < 0) state.ballDY *= -1;

      // Ball collision with paddle
      if (
        state.ballY > 180 &&
        state.ballX > state.paddleX &&
        state.ballX < state.paddleX + 80
      ) {
          // invert Y direction and increase speed slightly (cap max)
          const increased = Math.min(Math.abs(state.ballDY) * 1.12, 12);
          state.ballDY = -increased;
          // add slight horizontal change based on where the ball hit the paddle
          const hitPos = (state.ballX - state.paddleX) - 40; // -40..+40
          state.ballDX += hitPos * 0.02;
          // cap horizontal speed
          state.ballDX = Math.max(-10, Math.min(10, state.ballDX));
      }

      // Ball out of bounds
      if (state.ballY > 200) {
        setGameRunning(false);
      }

      // Ball collision with bricks
      state.bricks.forEach((brick) => {
        if (brick.active) {
          if (
            state.ballX > brick.x &&
            state.ballX < brick.x + brick.width &&
            state.ballY > brick.y &&
            state.ballY < brick.y + brick.height
          ) {
            brick.active = false;
            state.ballDY *= -1;
            state.score++;
            setBricksDestroyed(state.score);

            if (state.score >= 18) {
              setGameRunning(false);
              onComplete("VICTORY");
            }
          }
        }
      });

      // Render
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 400, 200);

      // Draw paddle
      ctx.fillStyle = "#00d4ff";
      ctx.fillRect(state.paddleX, 185, 80, 10);

      // Draw ball
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw bricks
      state.bricks.forEach((brick) => {
        if (brick.active) {
          ctx.fillStyle = "#ff00ff";
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      ctx.fillStyle = "#00ff00";
      ctx.font = "12px Arial";
      ctx.fillText(`Bricks: ${state.score} / 18`, 10, 20);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameRunning, onComplete]);

  // Handle paddle movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      gameStateRef.current.paddleX = Math.max(0, Math.min(x - 40, 320));
    };
    const canvas = canvasRef.current;
    if (canvas) canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      if (canvas) canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="space-y-4 text-center">
      <div className="text-xl font-bold text-cyan-300">
        Bricks Destroyed: {bricksDestroyed} / 18
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="border-2 border-purple-500 bg-black mx-auto"
      />
      <div className="text-sm text-purple-300">
        Move your mouse to control the paddle. Destroy all bricks!
      </div>
      {!gameRunning && bricksDestroyed < 18 && (
        <div className="text-red-400 font-bold">Game Over! Try again!</div>
      )}
    </div>
  );
};

export const TypingChallengeMiniGame = ({ puzzle, onComplete, timeLeft, onTimeout }) => {
  const [displayText] = useState("chronocipher");
  const [userInput, setUserInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }

    // Check if completed
    if (input === displayText) {
      const timeElapsed = (Date.now() - startTime) / 60000; // minutes
      const calculatedWpm = Math.round((input.length / 5) / timeElapsed);
      setWpm(calculatedWpm);
      onComplete("VICTORY");
      return;
    }

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === displayText[i]) correctChars++;
    }
    const calcAccuracy = Math.round((correctChars / Math.max(input.length, 1)) * 100);
    setAccuracy(calcAccuracy);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl font-bold text-cyan-300 font-mono">
        {displayText}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Start typing..."
        className="w-full max-w-xs px-4 py-2 bg-gray-800 text-white border-2 border-purple-500 rounded focus:outline-none text-center font-mono"
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-purple-300 text-sm">Progress</div>
          <div className="text-cyan-300 text-xl font-bold">
            {userInput.length} / {displayText.length}
          </div>
        </div>
        <div>
          <div className="text-purple-300 text-sm">Accuracy</div>
          <div className="text-cyan-300 text-xl font-bold">{accuracy}%</div>
        </div>
        <div>
          <div className="text-purple-300 text-sm">WPM</div>
          <div className="text-cyan-300 text-xl font-bold">{wpm}</div>
        </div>
      </div>

      <div className="text-sm text-purple-300">
        Type the text as quickly and accurately as possible!
      </div>
    </div>
  );
};