
import React from 'react';

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  icon: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, maxValue, color, icon }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="w-full text-green-400">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="flex items-center">{icon} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-4 w-full bg-black/50 border-2 border-green-900 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;
