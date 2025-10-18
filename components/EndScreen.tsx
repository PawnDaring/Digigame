
import React from 'react';
import { Evolution } from '../types';

interface EndScreenProps {
  evolution: Evolution;
  onPlayAgain: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ evolution, onPlayAgain }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center text-green-400 p-4">
      <h1 className="text-lg mb-4">It Evolved!</h1>
      <div className="text-8xl mb-4 animate-ping-slow">{evolution.emoji}</div>
      <h2 className="text-2xl mb-4 text-white">{evolution.name}</h2>
      <p className="text-xs mb-10">{evolution.description}</p>
      <button
        onClick={onPlayAgain}
        className="px-8 py-4 bg-green-500 text-purple-900 font-bold rounded-lg border-b-8 border-green-700
                   hover:bg-green-400 active:translate-y-1 active:border-b-2 transition-all"
      >
        PLAY AGAIN
      </button>
    </div>
  );
};

// Add a custom animation for the end screen
const style = document.createElement('style');
style.innerHTML = `
  @keyframes ping-slow {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.9;
    }
  }
  .animate-ping-slow {
    animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;
document.head.appendChild(style);

export default EndScreen;
