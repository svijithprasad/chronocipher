# ChronoCipher - Component Architecture

## 🏗️ System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                    CHRONOCIPHER GAME ENGINE                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          Main Component (ChronoCiper.jsx)               │ │
│  │  - Game State Management                                │ │
│  │  - Level Progression                                    │ │
│  │  - Timer & Scoring                                      │ │
│  │  - Screen Routing                                       │ │
│  └────────────────┬─────────────────────────────────────────┘ │
│                   │                                            │
│     ┌─────────────┼─────────────┬──────────────┐              │
│     │             │             │              │              │
│     ▼             ▼             ▼              ▼              │
│  ┌──────┐   ┌──────────┐   ┌──────────┐   ┌────────┐        │
│  │Utils │   │Components│   │Mini-Games│   │Screens │        │
│  └──────┘   └──────────┘   └──────────┘   └────────┘        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    DATA LAYER                            │ │
│  │  ┌──────────────────┐  ┌──────────────────────────────┐ │ │
│  │  │  Storage (localStorage)                            │ │ │
│  │  │  - Progress                                        │ │ │
│  │  │  - Game State                                      │ │ │
│  │  │  - Mini-Game State                                 │ │ │
│  │  └──────────────────┘  └──────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 📦 Component Hierarchy

```
ChronoCiper (Main)
│
├── ProgressBar
│   └── SVG circular progress
│
├── PuzzleHeader
│   ├── Level display
│   ├── Title
│   └── Story text
│
├── TimerDisplay
│   ├── SVG circle
│   ├── Clock icon
│   └── Time text
│
├── PuzzleContent
│   ├── Options display
│   └── Question rendering
│
├── PuzzleInput
│   └── Answer input field
│
├── ActionButtons
│   ├── Submit button
│   ├── Hint button
│   └── Skip button
│
├── MessageDisplay
│   └── Context-aware feedback
│
├── CluesDisplay
│   └── Collected clues grid
│
├── Mini-Games (conditional)
│   ├── SudokuMiniGame
│   ├── PatternMatchMiniGame
│   ├── PuzzleFragmentMiniGame
│   └── SnakeMiniGame
│
├── VictoryScreen (conditional)
│   └── Victory celebration
│
└── FinalCipherScreen (conditional)
    └── Master code input
```

## 🔄 Data Flow Diagram

```
User Action
    ↓
┌─────────────────────────────────┐
│  Event Handler (onClick, etc)   │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  State Update (setState)        │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Save to localStorage           │
│  (gameProgressManager.save)     │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Re-render Component            │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│  Display Update                 │
└─────────────────────────────────┘
```

## 🎮 Mini-Game Architecture

```
┌────────────────────────────────────────────────────┐
│          Mini-Games Module                         │
├────────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │      SudokuMiniGame Component            │   │
│  │  ├─ Grid State Management                │   │
│  │  ├─ Cell Validation                      │   │
│  │  ├─ Solution Checking                    │   │
│  │  └─ Real-time Feedback                   │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │   PatternMatchMiniGame Component         │   │
│  │  ├─ Card Shuffle                         │   │
│  │  ├─ Flip Animation                       │   │
│  │  ├─ Pair Matching Logic                  │   │
│  │  └─ Completion Detection                 │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │  PuzzleFragmentMiniGame Component        │   │
│  │  ├─ Fragment Selection                   │   │
│  │  ├─ Slot Placement                       │   │
│  │  ├─ Order Validation                     │   │
│  │  └─ Visual Feedback                      │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────────────────────────────────┐   │
│  │    SnakeMiniGame Component               │   │
│  │  ├─ Grid Rendering                       │   │
│  │  ├─ Snake Movement                       │   │
│  │  ├─ Collision Detection                  │   │
│  │  ├─ Token Eating                         │   │
│  │  └─ Game Loop (150ms intervals)          │   │
│  └──────────────────────────────────────────┘   │
│                                                   │
└────────────────────────────────────────────────────┘
```

## 🎨 UI Component Library

```
UIComponents Module
│
├── TimerDisplay
│   ├── Input: timeLeft (number), warning (number)
│   ├── State: circular progress calculation
│   └── Output: SVG timer with time text
│
├── PuzzleHeader
│   ├── Input: level, totalLevels, title, story
│   └── Output: formatted header with metadata
│
├── ActionButtons
│   ├── Input: handlers, disabled state, hint status
│   ├── State: button disable logic
│   └── Output: responsive button group
│
├── CluesDisplay
│   ├── Input: clues array, max clues
│   └── Output: scrollable clue list
│
├── MessageDisplay
│   ├── Input: message string
│   ├── Logic: color coding based on message type
│   └── Output: animated message box
│
├── ProgressBar
│   ├── Input: level, totalLevels
│   ├── Calculation: width percentage
│   └── Output: top progress bar
│
├── VictoryScreen
│   ├── Input: clues, playAgain callback
│   ├── Features: celebration effects, code display
│   └── Output: full-screen victory view
│
└── FinalCipherScreen
    ├── Input: clues, answer, message
    ├── Features: clue display, input field
    └── Output: final code entry screen
```

## 📊 State Management Flow

```
ChronoCiper Component State
│
├─ level (number)
│  └─ Tracks current puzzle level (1-41)
│
├─ clues (array)
│  └─ Collects all puzzle clues
│
├─ timeLeft (number)
│  └─ Countdown timer per puzzle
│
├─ gameState (string)
│  ├─ "playing" - Active puzzle
│  ├─ "final" - Master code entry
│  └─ "victory" - Game complete
│
├─ answer (string)
│  └─ Current user answer input
│
├─ message (string)
│  └─ Feedback message
│
├─ hintUsed (boolean)
│  └─ Hint availability flag
│
├─ particles (array)
│  └─ Background particle effects
│
├─ transitioning (boolean)
│  └─ Level transition guard
│
└─ miniGameComplete (boolean)
   └─ Mini-game completion flag
```

## 🔌 API Interfaces

### Puzzle Data Structure
```javascript
{
  id: number,              // 1-40
  type: string,            // puzzle type
  title: string,           // display title
  story: string,           // narrative
  question: string,        // puzzle question
  answer: string,          // correct answer
  hint: string,            // helpful hint
  clue: string,            // reward clue
  time: number,            // seconds allowed
  difficulty: string,      // easy/medium/hard
  
  // Mini-game specific
  ...(minigame props)
}
```

### Storage API
```javascript
gameProgressManager = {
  saveProgress(gameState) → void,
  loadProgress() → object | null,
  clearProgress() → void,
  saveMiniGameState(levelId, state) → void,
  loadMiniGameState(levelId) → object | null
}
```

### Component Props

#### Mini-Game Components
```jsx
<MiniGame
  puzzle={puzzleObject}
  onComplete={callbackFunction}
  timeLeft={number}
  onTimeout={callbackFunction}
/>
```

#### UI Components
```jsx
<TimerDisplay timeLeft={45} warning={10} />
<PuzzleHeader level={5} totalLevels={41} title="..." story="..." />
<ActionButtons onSubmit={fn} onHint={fn} onSkip={fn} hintUsed={bool} />
<CluesDisplay clues={[]} maxClues={40} />
<MessageDisplay message="..." />
<ProgressBar level={5} totalLevels={41} />
```

## 🎯 Routing & Screen Selection

```
Level <= 40 && !miniGameComplete
    ↓
    ├─ isMiniGame(currentPuzzle) = true
    │  └─ Render appropriate mini-game
    │
    └─ isMiniGame(currentPuzzle) = false
       └─ Render standard puzzle screen

Level === 41 && gameState === "final"
    └─ Render FinalCipherScreen

gameState === "victory"
    └─ Render VictoryScreen
```

## 📈 Performance Considerations

```
Optimization Area      Implementation
─────────────────────────────────────────
Particle Effects       Max 20 concurrent
Mini-Games             Conditional render
Animations             CSS-based (GPU)
State Updates          Batched where possible
localStorage           Auto-save on changes
Event Handlers         Memoized callbacks
Component Re-renders   Minimized through structure
```

## 🔐 State Persistence Flow

```
Component Mounts
    ↓
Load Progress from localStorage
    └─ If exists, restore: level, clues, gameState
    └─ If not, start fresh at level 1
    ↓
User Plays
    ↓
State Updates (level, clues, etc)
    ↓
useEffect Listener
    ↓
gameProgressManager.saveProgress()
    ↓
Update localStorage
    ↓
(User can refresh/close and resume)
```

## 🎮 Game Loop Timeline

```
Level Start (useEffect triggered)
    ↓
Initialize: answer="", message="", hintUsed=false
    ↓
Start Timer: timeLeft=puzzle.time
    ↓
┌─ Timer Loop (1 second interval) ─┐
│  Decrement timeLeft               │
│  Check if timeLeft === 0 → timeout│
│  Update display                   │
└───────────────────────────────────┘
    ↓
User Action (Submit/Skip/Hint)
    ↓
Processing & Validation
    ↓
Update Clues
    ↓
setTransitioning(true)
    ↓
2 second delay
    ↓
goToNextLevel()
    ↓
setLevel(level + 1)
    ↓
useEffect triggers (level changed)
    ↓
Setup New Level
    ↓
(repeat or Victory)
```

## 🚀 Build & Deployment

```
Source Code
    ↓
Vite Build
    ├─ Compile JSX → JS
    ├─ Minify/Optimize
    ├─ Bundle CSS/Assets
    └─ Generate dist/
    ↓
Output Files
    ├─ index.html
    ├─ js/chunk-*.js
    ├─ css/style-*.css
    └─ assets/*
    ↓
Deploy to Server
    ├─ Static hosting (Vercel, Netlify, etc)
    └─ Self-hosted (Apache, Nginx)
```

## 📱 Responsive Design Breakpoints

```
Mobile (< 640px)
    ├─ Single column layout
    ├─ Stacked buttons
    └─ Larger touch targets

Tablet (640px - 1024px)
    ├─ Two column sections
    ├─ Side-by-side buttons
    └─ Balanced spacing

Desktop (> 1024px)
    ├─ Full width optimization
    ├─ Multi-column layouts
    └─ Complete feature set
```

---

**Architecture Version:** 2.0.0
**Last Updated:** December 2024
**Maintainability Score:** 9/10
**Scalability Score:** 8/10
