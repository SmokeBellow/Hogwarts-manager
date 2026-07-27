export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Stats {
  courage: number;
  intellect: number;
  ambition: number;
  loyalty: number;
  charm: number;
}

export type StatKey = keyof Stats;

export interface Backstory {
  id: string;
  title: string;
  description: string;
  startingMoney: number;
  statBonus: Partial<Stats>;
}

export interface SortingOption {
  id: string;
  text: string;
  housePoints: Partial<Record<House, number>>;
}

export interface SortingQuestion {
  id: string;
  prompt: string;
  options: SortingOption[];
}

export interface EventOutcome {
  text: string;
  moneyDelta?: number;
  statDeltas?: Partial<Stats>;
  gradeDelta?: { subject: string; amount: number };
  friendDelta?: number;
  relationshipDelta?: number;
  housePointsDelta?: number;
}

export interface EventChoice {
  id: string;
  text: string;
  quality: number; // 0..1, how wise/correct the choice objectively is
  statKey?: StatKey; // if the character's stat should influence success chance
  goodOutcome: EventOutcome;
  badOutcome: EventOutcome;
  requiresSpell?: boolean;
  spellId?: string;
}

export interface GameEvent {
  id: string;
  weekMin: number;
  weekMax: number;
  title: string;
  description: string;
  category: "academic" | "social" | "random" | "club" | "money";
  choices: EventChoice[];
}

export interface Club {
  id: string;
  name: string;
  description: string;
  weeklyCost: number;
  statFocus: StatKey[];
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  cost: number;
  weeklyUpkeep: number;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface LectureTopic {
  id: string;
  subject: string;
  title: string;
  content: string;
}

export interface ExamQuestion {
  id: string;
  subject: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface SpellTemplate {
  id: string;
  name: string;
  description: string;
  // sequence of unit direction vectors describing the gesture shape
  directions: { x: number; y: number }[];
}
