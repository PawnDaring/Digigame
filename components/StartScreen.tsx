import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center text-green-400 p-4">
       <div className="text-8xl mb-8 animate-pulse">💩</div>
      <h1 className="text-2xl mb-2">Digi-Pet</h1>
      <h2 className="text-xl mb-8">Evolver</h2>
      <p className="text-xs mb-12">Keep your pet alive for 3 rounds to see its final evolution!</p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-green-500 text-purple-900 font-bold rounded-lg border-b-8 border-green-700
                   hover:bg-green-400 active:translate-y-1 active:border-b-2 transition-all"
      >
        START
      </button>
    </div>
  );
};

export default StartScreen;
