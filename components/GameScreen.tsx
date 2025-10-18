import React from 'react';
import { CreatureStats } from '../types';
import StatBar from './StatBar';

interface GameScreenProps {
  stats: CreatureStats;
  timeLeft: number;
  creatureEmoji: string;
  round: number;
}

const GameScreen: React.FC<GameScreenProps> = ({ stats, timeLeft, creatureEmoji, round }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="w-full aspect-square bg-green-900/50 rounded-lg p-4 border-4 border-black/30 shadow-inner flex flex-col justify-between relative overflow-hidden">
      {/* Analog screen effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDBhZDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImJsYWNrIiBmaWxsLW9wYWNpdHk9IjAuNSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="flex justify-between items-center text-green-400 text-shadow-lg">
        <h1 className="text-sm">DIGI-PET | RND {round}</h1>
        <div className="bg-black/50 px-2 py-1 rounded border-2 border-green-900">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="text-8xl animate-bounce">
          {creatureEmoji}
        </div>
      </div>

      <div className="space-y-2">
        <StatBar label="HUNGER" value={stats.hunger} maxValue={100} color="bg-red-500" icon="🍔" />
        <StatBar label="ENERGY" value={stats.energy} maxValue={100} color="bg-yellow-400" icon="⚡" />
        <StatBar label="HAPPINESS" value={stats.happiness} maxValue={100} color="bg-blue-500" icon="💖" />
      </div>
    </div>
  );
};

export default GameScreen;