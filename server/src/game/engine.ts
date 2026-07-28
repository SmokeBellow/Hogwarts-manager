import { db } from "../db.js";
import { backstories } from "../content/backstories.js";
import { sortingQuestions } from "../content/sorting.js";
import { events, totalWeeksPerYear } from "../content/events.js";
import { subjects } from "../content/subjects.js";
import { pets } from "../content/pets.js";
import { examQuestions } from "../content/examQuestions.js";
import { npcNames } from "../content/npcNames.js";
import type { NpcName } from "../content/npcNames.js";
import type { GameEvent, House, Stats, StatKey, EventOutcome } from "../content/types.js";

function hashSeed(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(hash);
}

function pickNpcName(characterId: number, seedKey: string): NpcName {
  return npcNames[hashSeed(`${characterId}:${seedKey}`) % npcNames.length];
}

function eventNeedsName(event: GameEvent): boolean {
  return (
    event.title.includes("{name") ||
    event.description.includes("{name") ||
    event.choices.some((c) => c.text.includes("{name"))
  );
}

// Applies "{name}"/"{name_acc}"/"{name_gen}"/"{name_ins}" case tokens and
// "{g:masculine|feminine}" gender-agreement tokens (e.g. verb endings),
// resolved against the picked NPC so text reads grammatically either way:
// "Разговорить Розалинду" / "Разговорить Финеаса", "{name} реши{g:л|ла}".
function applyNameTokens(text: string, npc: NpcName): string {
  const withCase = text
    .replaceAll("{name_acc}", npc.accusative)
    .replaceAll("{name_gen}", npc.genitive)
    .replaceAll("{name_ins}", npc.instrumental)
    .replaceAll("{name}", npc.nominative);
  return withCase.replace(/\{g:([^|}]*)\|([^}]*)\}/g, (_match, masc, fem) => (npc.gender === "f" ? fem : masc));
}

export interface CharacterRow {
  id: number;
  user_id: number;
  name: string;
  backstory_id: string;
  house: House | null;
  sorting_answers: string;
  year: number;
  week: number;
  phase: string;
  stats: string;
  grades: string;
  friends: string;
  relationship: string | null;
  clubs: string;
  pet: string | null;
  studied_topics: string;
  house_points: number;
  seen_events: string;
  status: string;
  quidditch_position: string | null;
}

export const QUIDDITCH_POSITIONS = ["keeper", "chaser", "beater", "seeker"] as const;
export type QuidditchPosition = (typeof QUIDDITCH_POSITIONS)[number];

const BASE_STAT = 30;

function defaultStats(): Stats {
  return { courage: BASE_STAT, intellect: BASE_STAT, ambition: BASE_STAT, loyalty: BASE_STAT, charm: BASE_STAT };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function serializeCharacter(row: CharacterRow) {
  return {
    id: row.id,
    name: row.name,
    backstoryId: row.backstory_id,
    house: row.house,
    year: row.year,
    week: row.week,
    totalWeeks: totalWeeksPerYear,
    phase: row.phase,
    stats: JSON.parse(row.stats) as Stats,
    grades: JSON.parse(row.grades) as Record<string, number>,
    friends: JSON.parse(row.friends) as { name: string; level: number }[],
    relationship: row.relationship ? (JSON.parse(row.relationship) as { name: string; level: number }) : null,
    clubs: JSON.parse(row.clubs) as string[],
    pet: row.pet ? (JSON.parse(row.pet) as { id: string; name: string }) : null,
    housePoints: row.house_points,
    status: row.status,
    quidditchPosition: row.quidditch_position as QuidditchPosition | null,
  };
}

export function getCharacterForUser(userId: number): CharacterRow | undefined {
  return db
    .prepare(`SELECT * FROM characters WHERE user_id = ? ORDER BY id DESC LIMIT 1`)
    .get(userId) as CharacterRow | undefined;
}

export function getCharacterById(id: number): CharacterRow | undefined {
  return db.prepare(`SELECT * FROM characters WHERE id = ?`).get(id) as CharacterRow | undefined;
}

export function createCharacter(userId: number, name: string, backstoryId: string): CharacterRow {
  const backstory = backstories.find((b) => b.id === backstoryId);
  if (!backstory) throw new Error("Неизвестная предыстория");

  const stats = defaultStats();
  for (const [key, value] of Object.entries(backstory.statBonus)) {
    stats[key as StatKey] = clamp(stats[key as StatKey] + (value ?? 0), 0, 100);
  }

  const grades: Record<string, number> = {};
  for (const s of subjects) grades[s.id] = 0;
  if (backstory.gradeBonus) {
    for (const [subjectId, value] of Object.entries(backstory.gradeBonus)) {
      grades[subjectId] = clamp((grades[subjectId] ?? 0) + value, 0, 100);
    }
  }

  const info = db
    .prepare(
      `INSERT INTO characters (user_id, name, backstory_id, stats, grades)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(userId, name, backstoryId, JSON.stringify(stats), JSON.stringify(grades));

  return getCharacterById(info.lastInsertRowid as number)!;
}

export function getSortingQuestionsList() {
  return sortingQuestions;
}

export function submitSorting(characterId: number, answers: { questionId: string; optionId: string }[]) {
  const character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  if (character.phase !== "sorting") throw new Error("Распределение уже завершено");

  const tally: Record<House, number> = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  for (const answer of answers) {
    const question = sortingQuestions.find((q) => q.id === answer.questionId);
    const option = question?.options.find((o) => o.id === answer.optionId);
    if (!option) continue;
    for (const [house, pts] of Object.entries(option.housePoints)) {
      tally[house as House] += pts ?? 0;
    }
  }

  let winningHouse: House = "Gryffindor";
  let best = -Infinity;
  for (const [house, pts] of Object.entries(tally)) {
    if (pts > best) {
      best = pts;
      winningHouse = house as House;
    }
  }

  db.prepare(
    `UPDATE characters SET house = ?, sorting_answers = ?, phase = 'year', week = 1, updated_at = datetime('now') WHERE id = ?`
  ).run(winningHouse, JSON.stringify(answers), characterId);

  return { house: winningHouse, tally };
}

export function getCurrentEvent(characterId: number) {
  const character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  const seen: string[] = JSON.parse(character.seen_events);
  const memberClubs: string[] = JSON.parse(character.clubs);

  const matching = events.filter(
    (e) =>
      e.weekMin <= character.week &&
      character.week <= e.weekMax &&
      !seen.includes(e.id) &&
      character.year >= (e.minYear ?? 1) &&
      (!e.requiresClub || memberClubs.includes(e.requiresClub)) &&
      (!e.excludesClub || !memberClubs.includes(e.excludesClub))
  );
  if (matching.length === 0) return null;

  // Guaranteed events (e.g. the clubs fair, a match the player signed up for)
  // must win over overlapping optional events for the same week, otherwise
  // their narrow week window can close before they're ever picked. Within
  // the winning tier, pick randomly so different players — or the same
  // player on a replay — don't always see the same event on the same week.
  const guaranteedMatches = matching.filter((e) => e.guaranteed);
  const pool = guaranteedMatches.length > 0 ? guaranteedMatches : matching;
  const candidate = pool[Math.floor(Math.random() * pool.length)];

  const npc = eventNeedsName(candidate) ? pickNpcName(characterId, candidate.nameSeedKey ?? candidate.id) : null;
  const sub = (text: string) => (npc ? applyNameTokens(text, npc) : text);

  return {
    id: candidate.id,
    title: sub(candidate.title),
    description: sub(candidate.description),
    category: candidate.category,
    choices: candidate.choices.map((c) => ({
      id: c.id,
      text: sub(c.text),
      requiresSpell: c.requiresSpell,
      spellId: c.spellId,
      requiresMinigame: c.requiresMinigame,
      minigameId: c.minigameId,
    })),
  };
}

export function advanceWeek(characterId: number) {
  let character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  const nextWeek = character.week + 1;
  db.prepare(`UPDATE characters SET week = ?, updated_at = datetime('now') WHERE id = ?`).run(nextWeek, characterId);
  character = getCharacterById(characterId)!;

  if (character.week > totalWeeksPerYear && character.phase === "year") {
    db.prepare(`UPDATE characters SET phase = 'exam', updated_at = datetime('now') WHERE id = ?`).run(characterId);
    character = getCharacterById(characterId)!;
  }
  return character;
}

interface ResolveOptions {
  challengeSuccess?: boolean;
}

export function resolveEventChoice(
  characterId: number,
  eventId: string,
  choiceId: string,
  options: ResolveOptions = {}
) {
  const character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error("Событие не найдено");
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error("Вариант не найден");

  const stats: Stats = JSON.parse(character.stats);

  let effQuality = choice.quality;
  if (choice.statKey) {
    effQuality += (stats[choice.statKey] / 100 - 0.5) * 0.3;
  }
  if (choice.requiresSpell || choice.requiresMinigame) {
    effQuality += options.challengeSuccess ? 0.25 : -0.2;
  }
  effQuality = clamp(effQuality, 0, 1);

  const badProbability = clamp(0.55 - effQuality * 0.45, 0.1, 0.55);
  const isBad = Math.random() < badProbability;
  const softenFactor = isBad ? 1 - effQuality * 0.5 : 1;
  const outcome: EventOutcome = isBad ? choice.badOutcome : choice.goodOutcome;
  const eventNpc = eventNeedsName(event) ? pickNpcName(characterId, event.nameSeedKey ?? event.id) : null;
  const outcomeText = eventNpc ? applyNameTokens(outcome.text, eventNpc) : outcome.text;

  const grades: Record<string, number> = JSON.parse(character.grades);
  const friends: { name: string; level: number }[] = JSON.parse(character.friends);
  let relationship = character.relationship
    ? (JSON.parse(character.relationship) as { name: string; level: number })
    : null;
  let housePoints = character.house_points;
  const memberClubs: string[] = JSON.parse(character.clubs);

  const scale = (v: number) => (isBad ? Math.round(v * softenFactor) : v);

  if (outcome.statDeltas) {
    for (const [key, value] of Object.entries(outcome.statDeltas)) {
      stats[key as StatKey] = clamp(stats[key as StatKey] + scale(value ?? 0), 0, 100);
    }
  }
  if (outcome.gradeDelta) {
    const { subject, amount } = outcome.gradeDelta;
    grades[subject] = clamp((grades[subject] ?? 0) + scale(amount), 0, 100);
  }
  if (outcome.friendDelta) {
    const delta = scale(outcome.friendDelta);
    if (delta > 0) {
      const friendName = eventNpc ? eventNpc.nominative : `Однокурсник №${friends.length + 1}`;
      friends.push({ name: friendName, level: delta });
    } else if (friends.length > 0) {
      friends.pop();
    }
  }
  if (outcome.relationshipDelta) {
    const delta = scale(outcome.relationshipDelta);
    if (!relationship) {
      const romanceNpc = eventNpc ?? pickNpcName(characterId, "romance-interest");
      relationship = { name: romanceNpc.nominative, level: 0 };
    }
    relationship.level = clamp(relationship.level + delta, -5, 20);
    if (relationship.level <= -3) relationship = null;
  }
  if (outcome.housePointsDelta) housePoints += scale(outcome.housePointsDelta);
  if (outcome.joinClub && !memberClubs.includes(outcome.joinClub)) {
    memberClubs.push(outcome.joinClub);
  }

  const seen: string[] = JSON.parse(character.seen_events);
  seen.push(event.id);

  db.prepare(
    `UPDATE characters SET stats = ?, grades = ?, friends = ?, relationship = ?, house_points = ?, clubs = ?, seen_events = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(
    JSON.stringify(stats),
    JSON.stringify(grades),
    JSON.stringify(friends),
    relationship ? JSON.stringify(relationship) : null,
    housePoints,
    JSON.stringify(memberClubs),
    JSON.stringify(seen),
    characterId
  );

  db.prepare(
    `INSERT INTO event_log (character_id, year, week, event_id, choice_id, outcome_id, outcome_text, deltas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    characterId,
    character.year,
    character.week,
    event.id,
    choice.id,
    isBad ? "bad" : "good",
    outcomeText,
    JSON.stringify(outcome)
  );

  const updated = advanceWeek(characterId);

  return {
    isBad,
    outcomeText,
    character: serializeCharacter(updated),
  };
}

export function leaveClub(characterId: number, clubId: string) {
  const character = getCharacterById(characterId)!;
  const list: string[] = JSON.parse(character.clubs).filter((id: string) => id !== clubId);
  if (clubId === "quidditch") {
    db.prepare(`UPDATE characters SET clubs = ?, quidditch_position = NULL, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(list),
      characterId
    );
  } else {
    db.prepare(`UPDATE characters SET clubs = ?, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(list),
      characterId
    );
  }
  return serializeCharacter(getCharacterById(characterId)!);
}

export function setQuidditchPosition(characterId: number, position: QuidditchPosition) {
  const character = getCharacterById(characterId)!;
  const memberClubs: string[] = JSON.parse(character.clubs);
  if (!memberClubs.includes("quidditch")) throw new Error("Сначала нужно вступить в квиддичную команду");
  if (!QUIDDITCH_POSITIONS.includes(position)) throw new Error("Неизвестная позиция");
  db.prepare(`UPDATE characters SET quidditch_position = ?, updated_at = datetime('now') WHERE id = ?`).run(
    position,
    characterId
  );
  return serializeCharacter(getCharacterById(characterId)!);
}

export function buyPet(characterId: number, petId: string) {
  const pet = pets.find((p) => p.id === petId);
  if (!pet) throw new Error("Питомец не найден");
  const character = getCharacterById(characterId)!;
  if (character.pet) throw new Error("У тебя уже есть питомец");
  db.prepare(`UPDATE characters SET pet = ?, updated_at = datetime('now') WHERE id = ?`).run(
    JSON.stringify({ id: pet.id, name: pet.name }),
    characterId
  );
  return serializeCharacter(getCharacterById(characterId)!);
}

export function getExamQuestions() {
  return examQuestions;
}

export function submitExamAnswers(characterId: number, answers: { questionId: string; optionIndex: number }[]) {
  const character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  if (character.phase !== "exam") throw new Error("Экзамены ещё не начались");

  const grades: Record<string, number> = JSON.parse(character.grades);
  const bySubject: Record<string, { correct: number; total: number }> = {};

  for (const answer of answers) {
    const q = examQuestions.find((eq) => eq.id === answer.questionId);
    if (!q) continue;
    bySubject[q.subject] ??= { correct: 0, total: 0 };
    bySubject[q.subject].total += 1;
    if (answer.optionIndex === q.correctIndex) bySubject[q.subject].correct += 1;
  }

  const results: { subject: string; score: number; gradeLetter: string }[] = [];
  for (const subject of subjects) {
    const stat = bySubject[subject.id];
    const examScore = stat && stat.total > 0 ? (stat.correct / stat.total) * 100 : 50;
    const yearGrade = grades[subject.id] ?? 50;
    const finalScore = clamp(Math.round(yearGrade * 0.6 + examScore * 0.4), 0, 100);
    const gradeLetter = toGradeLetter(finalScore);
    results.push({ subject: subject.id, score: finalScore, gradeLetter });
    db.prepare(
      `INSERT INTO exam_results (character_id, year, subject, score, grade_letter) VALUES (?, ?, ?, ?, ?)`
    ).run(characterId, character.year, subject.id, finalScore, gradeLetter);
    grades[subject.id] = finalScore;
  }

  db.prepare(
    `UPDATE characters SET grades = ?, phase = 'results', updated_at = datetime('now') WHERE id = ?`
  ).run(JSON.stringify(grades), characterId);

  return results;
}

function toGradeLetter(score: number): string {
  if (score >= 85) return "O";
  if (score >= 70) return "E";
  if (score >= 55) return "A";
  if (score >= 40) return "P";
  if (score >= 25) return "D";
  return "T";
}

export function getExamResults(characterId: number) {
  return db
    .prepare(`SELECT * FROM exam_results WHERE character_id = ? ORDER BY id DESC LIMIT 7`)
    .all(characterId);
}

export const MAX_YEAR = 7;

export function advanceYear(characterId: number) {
  const character = getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  if (character.phase !== "results") throw new Error("Год ещё не завершён");

  if (character.year >= MAX_YEAR) {
    db.prepare(`UPDATE characters SET phase = 'graduated', status = 'graduated', updated_at = datetime('now') WHERE id = ?`).run(
      characterId
    );
  } else {
    db.prepare(
      `UPDATE characters SET year = year + 1, week = 1, phase = 'year', seen_events = '[]', updated_at = datetime('now') WHERE id = ?`
    ).run(characterId);
  }

  return serializeCharacter(getCharacterById(characterId)!);
}

export function studyTopic(characterId: number, topicId: string) {
  const character = getCharacterById(characterId)!;
  const studied: string[] = JSON.parse(character.studied_topics);
  if (!studied.includes(topicId)) studied.push(topicId);
  db.prepare(`UPDATE characters SET studied_topics = ?, updated_at = datetime('now') WHERE id = ?`).run(
    JSON.stringify(studied),
    characterId
  );
  return studied;
}
