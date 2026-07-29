export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface Stats {
  courage: number;
  intellect: number;
  ambition: number;
  loyalty: number;
  charm: number;
}

export type QuidditchPosition = "keeper" | "chaser" | "beater" | "seeker";

export interface Character {
  id: number;
  name: string;
  backstoryId: string;
  house: House | null;
  year: number;
  week: number;
  totalWeeks: number;
  phase: "sorting" | "year" | "exam" | "results" | "graduated";
  stats: Stats;
  grades: Record<string, number>;
  friends: { name: string; level: number }[];
  relationship: { name: string; level: number } | null;
  clubs: string[];
  pet: { id: string; name: string } | null;
  housePoints: number;
  status: string;
  quidditchPosition: QuidditchPosition | null;
  decree: Decree | null;
}

export interface Decree {
  id: "loyalty" | "courage" | "justice" | "ambition";
  title: string;
  description: string;
}

export interface Backstory {
  id: string;
  title: string;
  description: string;
  icon: string;
  statBonus: Partial<Stats>;
  gradeBonus?: Record<string, number>;
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

export interface EventOutcomePreviewChoice {
  id: string;
  text: string;
  requiresSpell?: boolean;
  spellId?: string;
  requiresMinigame?: boolean;
  minigameId?: "quidditch" | "gobstones";
}

export interface GameEvent {
  id: string;
  weekMin: number;
  weekMax: number;
  title: string;
  description: string;
  category: string;
  choices: EventOutcomePreviewChoice[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  icon: string;
  statFocus: string[];
  minYear?: number;
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  icon: string;
  description: string;
}

export interface SpellTemplate {
  id: string;
  name: string;
  description: string;
  directions: { x: number; y: number }[];
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

export interface ExamResult {
  subject: string;
  score: number;
  gradeLetter: string;
}
