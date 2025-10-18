import React from 'react';
import { Note } from '../types';

interface RhythmTrackProps {
  notes: Note[];
  hitZonePosition: number;
  hitZoneWidth: number;
}

const NOTE_ICONS: { [key: string]: string } = {
  hunger: '🍔',
  energy: '⚡',
  happiness: '💖',
};

const RhythmTrack: React.FC<RhythmTrackProps> = ({ notes, hitZonePosition, hitZoneWidth }) => {

  return (
    <div className="w-full h-16 bg-black/50 my-4 rounded-lg border-2 border-green-900 relative overflow-hidden flex items-center">
      {/* Hit Zone */}
      <div
        className="absolute h-full bg-green-500/20 border-x-2 border-green-40ou-400 animate-pulse"
        style={{
          left: `${hitZonePosition}%`,
          width: `${hitZoneWidth}%`,
          transition: 'left 16ms linear', // Smooth out the movement
        }}
      ></div>

      {/* Notes */}
      {notes.map(note => (
        <div
          key={note.id}
          className="absolute text-3xl"
          style={{
            left: `${note.position}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {NOTE_ICONS[note.type]}
        </div>
      ))}
    </div>
  );
};

export default RhythmTrack;