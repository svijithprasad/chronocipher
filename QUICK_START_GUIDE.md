# ChronoCipher - Quick Start Guide

## 🎮 How to Play

### Starting the Game
1. Open the application in your browser
2. Your saved progress will automatically load (if exists)
3. Or start fresh - press "Play Again" on victory screen

### Game Screens

#### 1. Main Puzzle Screen
```
┌─────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░ │ ← Progress Bar
│                                     │
│         SECTOR 5 / 41               │
│    LEVEL TITLE                      │
│    Story text here...               │
│                                     │
│      5:32  ⏱️                       │ ← Timer
│                                     │
│  ┌─────────────────────────┐       │
│  │ Question text goes here │       │
│  │ [Answer input field...] │       │
│  └─────────────────────────┘       │
│                                     │
│  [SUBMIT] [HINT] [SKIP]            │
│                                     │
│  CLUES RECOVERED: 4/40             │
│  [CHRONO] [CIPHER] [VAULT] [...]   │
└─────────────────────────────────────┘
```

#### 2. Mini-Game Screen (Sudoku Example)
```
┌─────────────────────────────────────┐
│         LEVEL 10: QUANTUM SUDOKU    │
│    Numbers align in quantum realm   │
│                                     │
│      2:00  ⏱️                       │
│                                     │
│  ┌─────────┬─────────┐             │
│  │ [ ] [ ] │ [ ] [4] │             │
│  │ [ ] [ ] │ [2] [ ] │             │
│  ├─────────┼─────────┤             │
│  │ [3] [ ] │ [ ] [ ] │             │
│  │ [ ] [4] │ [ ] [ ] │             │
│  └─────────┴─────────┘             │
│                                     │
│    Complete the 4x4 grid           │
│  [HINT] [SKIP]                    │
└─────────────────────────────────────┘
```

#### 3. Victory Screen
```
┌─────────────────────────────────────┐
│                                     │
│               🎉                    │
│                                     │
│        VAULT UNLOCKED              │
│                                     │
│  You have decoded the ChronoCipher │
│     and escaped the temporal       │
│            prison.                 │
│                                     │
│  ┌─────────────────────────────┐  │
│  │ FINAL CODE:                 │  │
│  │ CHRONOCIPHER...NEXUS...VOID │  │
│  └─────────────────────────────┘  │
│                                     │
│     [RESTART JOURNEY]              │
│                                     │
└─────────────────────────────────────┘
```

---

## 💻 Component Usage Examples

### Using the Timer Display
```jsx
import { TimerDisplay } from '../components/UIComponents';

function MyComponent() {
  const [timeLeft, setTimeLeft] = useState(60);
  
  return <TimerDisplay timeLeft={timeLeft} warning={10} />;
}
```

### Using Mini-Games
```jsx
import { SudokuMiniGame } from '../components/MiniGames';

function GameScreen() {
  const puzzle = {
    id: 10,
    puzzleGrid: [[0,0,0,4], ...],
    solution: [[1,2,3,4], ...],
  };
  
  return (
    <SudokuMiniGame 
      puzzle={puzzle}
      onComplete={handleComplete}
      timeLeft={120}
    />
  );
}
```

### Using Storage
```jsx
import { gameProgressManager } from '../utils/storage';

// Save progress
gameProgressManager.saveProgress({
  level: 15,
  clues: ['CHRONO', 'CIPHER'],
  gameState: 'playing',
  timeLeft: 45,
  hintUsed: false
});

// Load progress
const saved = gameProgressManager.loadProgress();

// Clear progress
gameProgressManager.clearProgress();
```

---

## 🎮 Mini-Games Guide

### Sudoku Mini-Game (Level 10)

**Objective:** Complete a 4x4 Sudoku grid

**Rules:**
- Each row must contain 1, 2, 3, 4
- Each column must contain 1, 2, 3, 4
- Each 2x2 box must contain 1, 2, 3, 4

**Time:** 120 seconds

**Controls:**
- Click a cell
- Type 1-4
- Cell auto-validates
- Automatically completes when solved

### Pattern Match Mini-Game (Level 20)

**Objective:** Match all pairs of cards

**Rules:**
- 8 cards total (4 pairs)
- Flip two cards at a time
- Match all pairs within time
- Matched cards stay flipped

**Time:** 120 seconds

**Controls:**
- Click cards to flip them
- Matching pairs stay visible
- Non-matching pairs flip back

### Fragment Assembly Mini-Game (Level 30)

**Objective:** Assemble all fragments to complete the image

**Rules:**
- 9 fragments, 9 slots
- Drag fragments to slots
- Correct placement = visual feedback
- All fragments must be placed correctly

**Time:** 120 seconds

**Controls:**
- Click a fragment to select
- Click a slot to place
- Click placed fragment to remove

### Snake Mini-Game (Level 40)

**Objective:** Eat 10 tokens without hitting walls or yourself

**Rules:**
- Snake starts at center
- Each token eaten = 1 point
- 10 points = level complete
- Collision = restart

**Time:** 150 seconds

**Controls:**
- Arrow keys to move
- ⬆️ Up / ⬇️ Down / ⬅️ Left / ➡️ Right

---

## 📊 Game Mechanics

### Clue System
- Each puzzle awards 1 clue
- Hints award partial clues on skip/timeout
- All 40 clues combine for master code
- Example: CHRONO + CIPHER + VAULT + ... = 40 words

### Scoring
```
Correct Answer: Full Clue
Skip: Partial Clue (first 4 letters)
Timeout: Partial Clue (first 3 letters)
Hint Used: -15 seconds, keeps full clue
```

### Timer
- Each puzzle has unique time limit (40-150s)
- Warning at 10 seconds (red pulsing)
- Auto-progression on timeout
- Time doesn't carry over between levels

### Transitions
- 2 seconds on correct answer
- 1.5 seconds on skip
- Auto-fade to next level

---

## 🎨 Styling & Customization

### Theme Colors
```css
/* Update in Tailwind config or override in CSS */
:root {
  --primary: #06B6D4;     /* Cyan */
  --secondary: #A855F7;   /* Purple */
  --success: #22C55E;     /* Green */
  --error: #EF4444;       /* Red */
  --background: #000000;  /* Black */
}
```

### Modifying Puzzle Time
```javascript
// In src/utils/puzzles.js
{
  id: 5,
  time: 40,  // Change this value
  // ... rest of puzzle
}
```

### Changing Mini-Game Difficulty
```javascript
// In minigame components
// For Sudoku: Modify puzzleGrid and solution
// For Pattern Match: Add/remove cards
// For Snake: Change gridSize or tokensNeeded
```

---

## 🔧 Development Tips

### Adding a New Puzzle
```javascript
// In src/utils/puzzles.js
{
  id: 41,  // Next available ID
  type: "riddle",  // puzzle type
  title: "Your Puzzle Title",
  story: "Level 41: Your story...",
  question: "Your question?",
  answer: "ANSWER",
  hint: "Helpful hint here",
  clue: "CLUE_WORD",
  time: 60,  // seconds
  difficulty: "hard"
}
```

### Adding a New Mini-Game
```javascript
// In src/utils/puzzles.js
{
  id: 50,
  type: "minigame_yourname",
  // ... puzzle data
}

// In src/components/MiniGames.jsx
export const YourMiniGame = ({ puzzle, onComplete, timeLeft }) => {
  // Your game logic here
  return <div>Your Game UI</div>;
}

// In src/pages/ChronoCiper.jsx
{currentPuzzle.type === "minigame_yourname" && (
  <YourMiniGame 
    puzzle={currentPuzzle}
    onComplete={handleMiniGameComplete}
    timeLeft={timeLeft}
  />
)}
```

### Debugging
```javascript
// Add to browser console for debugging
gameProgressManager.loadProgress();  // Check saved progress
localStorage.getItem('chronocipher_progress');  // Raw data
puzzles[level - 1];  // Current puzzle
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */
```

All components use Tailwind's responsive modifiers:
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## 🚀 Performance Tips

1. **Particle Effects:** Max 20 concurrent (in main component)
2. **Mini-Games:** Render only when active
3. **State Updates:** Batch with useReducer if needed
4. **localStorage:** Auto-debounced save
5. **CSS Animations:** GPU-accelerated (transform, opacity)

---

## 🐛 Troubleshooting

### Progress Not Saving
```javascript
// Check browser support
console.log(typeof localStorage);  // Should be 'object'

// Check quota
try {
  gameProgressManager.saveProgress({...});
} catch (e) {
  console.error('Storage full:', e);
}
```

### Mini-Game Not Showing
```javascript
// Verify puzzle type
console.log(currentPuzzle.type);  // Should start with 'minigame_'

// Check puzzle data
console.log(isMiniGame(currentPuzzle));  // Should be true
```

### Timer Issues
```javascript
// Check effects are running
useEffect(() => {
  console.log('Timer effect running');
  // ...
}, [timeLeft, gameState]);
```

---

## 📞 Support & Tips

### Level 10 (Sudoku) Tips
- Start with rows/columns that have 3 numbers
- Look for numbers that can only go in one place

### Level 20 (Pattern Match) Tips
- Remember card positions
- Focus on one symbol type at a time

### Level 30 (Fragment Assembly) Tips
- Look for edge patterns
- Corner fragments are often distinctive

### Level 40 (Snake Game) Tips
- Plan your path
- Don't corner yourself
- Use walls strategically

### Final Level (Master Code) Tips
- Combine clues in order (1-40)
- Alternative: CHRONOCIPHER
- Check spelling carefully

---

## 🎓 Learning Resources

### React Concepts Used
- Hooks (useState, useEffect, useRef)
- Component composition
- State lifting
- Event handling
- Conditional rendering

### CSS Concepts Used
- CSS Grid
- Flexbox
- Gradients (bg-linear-to-r/b)
- Animations (@keyframes)
- SVG circles

### JavaScript Concepts Used
- localStorage API
- Array methods (map, filter, find)
- Object destructuring
- Spread operator
- Ternary operators

---

## 📈 Analytics Opportunities

```javascript
// Example: Track user actions
const trackEvent = (action, level, data) => {
  console.log({
    timestamp: new Date(),
    action,
    level,
    data
  });
  // Send to analytics service
};

trackEvent('puzzle_start', level);
trackEvent('puzzle_complete', level, { timeUsed });
trackEvent('minigame_complete', level);
trackEvent('game_victory', 41, { totalTime });
```

---

## 🌟 Features Showcase

### Smart Features
✨ Auto-save every state change
✨ Resume interrupted games
✨ Dynamic time limits per puzzle
✨ Contextual hints
✨ Graceful timeout handling
✨ Smooth level transitions
✨ Color-coded feedback

### Interactive Features
🎮 4 unique mini-games
🎮 Real-time validation
🎮 Fluid animations
🎮 Responsive controls
🎮 Progress visualization
🎮 Victory celebrations

---

**Last Updated:** December 2024
**Version:** 2.0.0
**Status:** Production Ready ✅
