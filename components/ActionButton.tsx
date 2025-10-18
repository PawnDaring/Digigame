
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  color: string;
  borderColor: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, color, borderColor }) => {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-full font-bold text-white text-3xl 
                 flex items-center justify-center 
                 shadow-lg transform transition-all duration-150 ease-in-out
                 ${color} ${borderColor} border-b-8
                 active:border-b-2 active:translate-y-1`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
