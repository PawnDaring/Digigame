export enum GameState {
  Start,
  Playing,
  End,
}

export interface CreatureStats {
  hunger: number;
  energy: number;
  happiness: number;
}

export type StatType = keyof CreatureStats;

export interface Note {
  id: number;
  type: StatType;
  position: number; // 0-100, percentage across the track
}

export interface Evolution {
  emoji: string;
  name: string;
  description: string;
}
