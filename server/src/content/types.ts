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

export interface EventOutcome {
  text: string;
  statDeltas?: Partial<Stats>;
  gradeDelta?: { subject: string; amount: number };
  friendDelta?: number;
  relationshipDelta?: number;
  housePointsDelta?: number;
  joinClub?: string;
  // Sets a persistent story flag on the character (see CharacterRow.story_flags).
  // Used to thread the multi-year main-quest arc through gated event pairs.
  setFlags?: Record<string, string | boolean>;
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
  requiresMinigame?: boolean;
  minigameId?: "quidditch" | "gobstones";
}

export interface GameEvent {
  id: string;
  weekMin: number;
  weekMax: number;
  title: string;
  description: string;
  category: "academic" | "social" | "random" | "club";
  choices: EventChoice[];
  minYear?: number; // event only appears from this school year onward, default 1
  maxYear?: number; // event only appears up to and including this school year, default unlimited
  requiresClub?: string; // event only appears if the character has joined this club
  excludesClub?: string; // event only appears if the character has NOT joined this club
  requiresFlag?: string; // event only appears if this story flag is set (truthy)
  excludesFlag?: string; // event only appears if this story flag is NOT set
  guaranteed?: boolean; // wins over overlapping non-guaranteed events for the same week
  // Groups events that should reuse the same random NPC name for a given
  // character (e.g. the same crush appearing across two separate events).
  // Defaults to the event's own id when omitted.
  nameSeedKey?: string;
  // A second named character in the same scene (e.g. two story characters),
  // filled in via "{name2}" tokens. See EventOutcome.setFlags docs for context.
  nameSeedKey2?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  icon: string;
  statFocus: StatKey[];
  minYear?: number; // club can only be joined from this school year onward, default 1
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  icon: string;
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
