import React from "react";

export const PuzzleInput = ({ value, onChange, onKeyPress, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="w-full mt-4 p-4 bg-black border-2 border-cyan-500 rounded-lg text-cyan-300 font-mono text-lg focus:border-purple-500 focus:outline-none transition-all placeholder-gray-600 shadow-lg"
      placeholder={placeholder || "Enter your answer..."}
      autoFocus
    />
  );
};

export const PuzzleContent = ({ puzzle, onSelect, selectedOption }) => {
  // Render puzzle options if available — clickable when handler is provided
  if (puzzle.options && puzzle.options.length > 0) {
    // If a more advanced options component is needed, use OptionsList
    if (onSelect) {
      return <OptionsList options={puzzle.options} onSelect={onSelect} selectedOption={selectedOption} />;
    }

    return (
      <div className="flex gap-6 justify-center flex-wrap mt-6">
        {puzzle.options.map((opt, idx) => (
          <div
            key={idx}
            className="text-5xl font-bold text-cyan-400 hover:text-purple-400 transition-all p-4 rounded border-2 border-cyan-500/50 hover:border-purple-500 cursor-default"
          >
            {opt}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const OptionsList = ({ options, onSelect, selectedOption }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(option)}
          className={`p-4 rounded-lg border-2 font-bold transition-all ${
            selectedOption === option
              ? "bg-cyan-600 border-cyan-400 text-black shadow-lg shadow-cyan-500/50"
              : "bg-black border-cyan-500/50 text-cyan-300 hover:border-cyan-400"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
