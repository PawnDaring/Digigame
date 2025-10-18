import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, CreatureStats, Evolution, Note, StatType } from './types';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import GameScreen from './components/GameScreen';
import GameControls from './components/GameControls';
import RhythmTrack from './components/RhythmTrack';

const MAX_STAT = 100;
const GAME_DURATION_SECONDS = 30;
const GAME_TICK_MS = 1000 / 60; // ~60fps
const STAT_PENALTY = 30; // Penalty for over-caring

// Difficulty Constants per round
const NOTE_SPEED = { 1: 0.7, 2: 1.1, 3: 1.5 };
const STAT_DECAY = { 1: 4, 2: 6, 3: 9 };
const NOTE_SPAWN_CHANCE = { 1: 0.025, 2: 0.035, 3: 0.045 };
const HIT_ZONE_WIDTH = 10;
const HIT_ZONE_SPEED = { 1: 0.4, 2: 0.7, 3: 1.0 };

const FINAL_EVOLUTIONS: { [key: string]: Evolution } = {
  DRAGON: { emoji: '🐲', name: 'Dragon', description: 'Perfection! You raised a legendary Dragon!' },
  POSEIDON: { emoji: '🔱', name: 'Poseidon', description: 'You have raised the ruler of the seas!' },
  MAMMOTH: { emoji: '🦣', name: 'Mammoth', description: 'An ancient and powerful beast!' },
  TOILET: { emoji: '🚽', name: 'Toilet', description: 'The ultimate in cleanliness... a Toilet.' },
  GHOST: { emoji: '👻', name: 'Ghost', description: 'Oh no! Your pet faded away...' },
};

// Function to determine the next emoji based on current emoji and stats
const getNextStageEmoji = (currentEmoji: string, stats: CreatureStats): string => {
  // Round 1 -> Round 2
  if (currentEmoji === '💩') {
    if (stats.hunger > 90 && stats.energy > 90 && stats.happiness > 90) return '🐍'; // Path to Dragon
    if (stats.happiness > 85 && stats.energy < 70) return '⭐'; // Path to Poseidon
    if (stats.hunger > 85 && stats.happiness < 70) return '🐛'; // Path to Mammoth
    return '🧖'; // Path to Toilet
  }

  // Round 2 -> Round 3
  if (currentEmoji === '🐍') return stats.hunger > 85 && stats.energy > 85 ? '🦖' : '🦎';
  if (currentEmoji === '⭐') return stats.happiness > 85 && stats.energy > 50 ? '🐙' : '🐟';
  if (currentEmoji === '🐛') return stats.hunger > 85 && stats.energy > 50 ? '🐘' : '🐌';
  if (currentEmoji === '🧖') return stats.hunger > 50 && stats.happiness > 50 ? '🧻' : '🧽';

  return '❓'; // Fallback
};

// Function to get the final evolution object for the end screen
const getFinalEvolution = (currentEmoji: string, stats: CreatureStats): Evolution => {
  if (currentEmoji === '🦖' && stats.hunger > 90 && stats.energy > 90) return FINAL_EVOLUTIONS.DRAGON;
  if (currentEmoji === '🐙' && stats.happiness > 90) return FINAL_EVOLUTIONS.POSEIDON;
  if (currentEmoji === '🐘' && stats.hunger > 90) return FINAL_EVOLUTIONS.MAMMOTH;
  if (currentEmoji === '🧻') return FINAL_EVOLUTIONS.TOILET;

  const defaultEvolutions: { [key: string]: Evolution } = {
    '🦎': { emoji: '🦎', name: 'Lizard', description: 'A respectable Lizard.' },
    '🐟': { emoji: '🐟', name: 'Fish', description: 'It just keeps swimming.' },
    '🐌': { emoji: '🐌', name: 'Snail', description: 'Slow and steady.' },
    '🧽': { emoji: '🧽', name: 'Sponge', description: 'Absorbent and porous.' },
  };
  return defaultEvolutions[currentEmoji] || FINAL_EVOLUTIONS.TOILET;
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [stats, setStats] = useState<CreatureStats>({ hunger: MAX_STAT, energy: MAX_STAT, happiness: MAX_STAT });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [finalEvolution, setFinalEvolution] = useState<Evolution | null>(null);
  const [round, setRound] = useState(1);
  const [creatureEmoji, setCreatureEmoji] = useState('💩');
  const [notes, setNotes] = useState<Note[]>([]);
  const [hitZonePosition, setHitZonePosition] = useState(45); // Start position of the hit zone
  
  const musicRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);
  const gameTimerRef = useRef<number>(0);
  const noteIdCounter = useRef<number>(0);
  const hitZoneTimeRef = useRef(0);

  const playSfx = () => {
    if (sfxRef.current) {
      sfxRef.current.currentTime = 0;
      sfxRef.current.play();
    }
  };
  
  const handleRoundEnd = useCallback(() => {
    if (round === 1 || round === 2) {
      const nextEmoji = getNextStageEmoji(creatureEmoji, stats);
      setRound(r => r + 1);
      setCreatureEmoji(nextEmoji);
      setTimeLeft(GAME_DURATION_SECONDS);
      setStats({ hunger: MAX_STAT, energy: MAX_STAT, happiness: MAX_STAT });
      setNotes([]);
      hitZoneTimeRef.current = 0;
    } else { // End of round 3
      const evolution = getFinalEvolution(creatureEmoji, stats);
      setFinalEvolution(evolution);
      setGameState(GameState.End);
    }
  }, [round, stats, creatureEmoji]);

  const resetGame = useCallback(() => {
    setStats({ hunger: MAX_STAT, energy: MAX_STAT, happiness: MAX_STAT });
    setTimeLeft(GAME_DURATION_SECONDS);
    setFinalEvolution(null);
    setRound(1);
    setCreatureEmoji('💩');
    setNotes([]);
    noteIdCounter.current = 0;
    hitZoneTimeRef.current = 0;
  }, []);

  const handleStartGame = () => {
    playSfx();
    resetGame();
    setGameState(GameState.Playing);
    if (musicRef.current) {
      musicRef.current.volume = 0.3;
      musicRef.current.play();
    }
  };

  const handlePlayAgain = () => {
    playSfx();
    resetGame();
    setGameState(GameState.Start);
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (gameState !== GameState.Playing) {
      return;
    }

    const currentStatDecay = STAT_DECAY[round as keyof typeof STAT_DECAY];
    const happinessDecay = currentStatDecay * 1.2;
    const currentNoteSpeed = NOTE_SPEED[round as keyof typeof NOTE_SPEED];
    const currentSpawnChance = NOTE_SPAWN_CHANCE[round as keyof typeof NOTE_SPAWN_CHANCE];
    const currentHitZoneSpeed = HIT_ZONE_SPEED[round as keyof typeof HIT_ZONE_SPEED];

    const gameInterval = setInterval(() => {
      // Update Timers and Stats
      gameTimerRef.current += GAME_TICK_MS;
      if (gameTimerRef.current >= 1000) {
        gameTimerRef.current = 0;
        
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleRoundEnd();
            return 0;
          }
          return prev - 1;
        });

        setStats(prevStats => {
          const newStats = {
            hunger: Math.max(0, prevStats.hunger - currentStatDecay),
            energy: Math.max(0, prevStats.energy - currentStatDecay),
            happiness: Math.max(0, prevStats.happiness - happinessDecay),
          };
          if (newStats.hunger === 0 || newStats.energy === 0 || newStats.happiness === 0) {
            setFinalEvolution(FINAL_EVOLUTIONS.GHOST);
            setGameState(GameState.End);
          }
          return newStats;
        });
      }

      // Update Note Positions
      setNotes(prevNotes => prevNotes
        .map(note => ({ ...note, position: note.position - currentNoteSpeed }))
        .filter(note => note.position > -10)
      );
      
      // Update Hit Zone Position
      hitZoneTimeRef.current += currentHitZoneSpeed;
      const maxMovement = 100 - HIT_ZONE_WIDTH;
      const movementRange = maxMovement / 2;
      const newPos = movementRange + Math.sin(hitZoneTimeRef.current * 0.1) * movementRange;
      setHitZonePosition(newPos);


      // Spawn New Notes
      if (Math.random() < currentSpawnChance) {
        const lastNote = notes[notes.length - 1];
        if (!lastNote || lastNote.position < 85) {
          const statTypes: StatType[] = ['hunger', 'energy', 'happiness'];
          const randomType = statTypes[Math.floor(Math.random() * statTypes.length)];
          const newNote: Note = {
            id: noteIdCounter.current++,
            type: randomType,
            position: 100,
          };
          setNotes(prev => [...prev, newNote]);
        }
      }

    }, GAME_TICK_MS);

    return () => clearInterval(gameInterval);
  }, [gameState, round, handleRoundEnd, notes]);

  const handleHit = (stat: StatType) => {
    const currentHitZoneStart = hitZonePosition;
    const currentHitZoneEnd = hitZonePosition + HIT_ZONE_WIDTH;

    const hittableNote = notes.find(n => 
      n.type === stat && 
      n.position >= currentHitZoneStart && 
      n.position <= currentHitZoneEnd
    );
    
    if (hittableNote) {
      playSfx();
      
      // Check for over-caring penalties
      if (stats[stat] === MAX_STAT) {
        setStats(prev => {
          let newStats = {...prev};
          if (stat === 'hunger') { // Overfed -> loses happiness
            newStats.happiness = Math.max(0, prev.happiness - STAT_PENALTY);
          } else if (stat === 'happiness') { // Overplayed -> loses energy
            newStats.energy = Math.max(0, prev.energy - STAT_PENALTY);
          } else if (stat === 'energy') { // Overslept -> gets hungry
            newStats.hunger = Math.max(0, prev.hunger - STAT_PENALTY);
          }
          return newStats;
        });
      } else {
        // Apply normal stat boost
        const amounts = { hunger: 25, energy: 35, happiness: 20 };
        setStats(prev => ({
          ...prev,
          [stat]: Math.min(MAX_STAT, prev[stat] + amounts[stat]),
        }));
      }

      setNotes(prev => prev.filter(n => n.id !== hittableNote.id));
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return (
          <>
            <GameScreen stats={stats} timeLeft={timeLeft} creatureEmoji={creatureEmoji} round={round} />
            <div className="flex flex-col justify-end flex-grow">
              <RhythmTrack notes={notes} hitZonePosition={hitZonePosition} hitZoneWidth={HIT_ZONE_WIDTH} />
              <GameControls 
                onFeed={() => handleHit('hunger')} 
                onPlay={() => handleHit('happiness')} 
                onSleep={() => handleHit('energy')} 
              />
            </div>
          </>
        );
      case GameState.End:
        return finalEvolution && <EndScreen evolution={finalEvolution} onPlayAgain={handlePlayAgain} />;
      case GameState.Start:
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <audio ref={musicRef} src="https://www.myinstants.com/media/sounds/8-bit-music.mp3" loop />
      <audio ref={sfxRef} src="https://vgmsite.com/soundtracks/nintendo-switch-startup-and-ui-sounds/gpbcsbmu/101%20-%20System%20SE_Sys_Decide_L.mp3" />
      <div className="w-full max-w-sm aspect-[9/16] bg-purple-900 rounded-3xl p-6 shadow-2xl border-4 border-purple-700 shadow-purple-500/30 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;