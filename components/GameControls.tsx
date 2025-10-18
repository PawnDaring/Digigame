import React from 'react';
import ActionButton from './ActionButton';

interface GameControlsProps {
  onFeed: () => void;
  onPlay: () => void;
  onSleep: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onFeed, onPlay, onSleep }) => {
  return (
    <div className="flex justify-around items-center pt-2">
      <ActionButton onClick={onFeed} color="bg-red-600" borderColor="border-red-800">
        🍔
      </ActionButton>
      <ActionButton onClick={onPlay} color="bg-blue-600" borderColor="border-blue-800">
        💖
      </ActionButton>
      <ActionButton onClick={onSleep} color="bg-yellow-500" borderColor="border-yellow-700">
        ⚡
      </ActionButton>
    </div>
  );
};

export default GameControls;
