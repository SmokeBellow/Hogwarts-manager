import { db } from "../db.js";
import { backstories } from "../content/backstories.js";
import { sortingQuestions } from "../content/sorting.js";
import { events, totalWeeksPerYear } from "../content/events.js";
import { subjects } from "../content/subjects.js";
import { pets } from "../content/pets.js";
import { examQuestions } from "../content/examQuestions.js";
import { npcNames } from "../content/npcNames.js";
import type { NpcName } from "../content/npcNames.js";
import { decrees } from "../content/decrees.js";
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
// A second character (e.g. two named story characters in one scene) can be
// threaded through via "{name2}"/"{name2_acc}"/... and "{g2:masc|fem}".
function applyNameTokens(text: string, npc: NpcName, npc2?: NpcName): string {
  let result = text
    .replaceAll("{name_acc}", npc.accusative)
    .replaceAll("{name_gen}", npc.genitive)
    .replaceAll("{name_ins}", npc.instrumental)
    .replaceAll("{name}", npc.nominative);
  if (npc2) {
    result = result
      .replaceAll("{name2_acc}", npc2.accusative)
      .replaceAll("{name2_gen}", npc2.genitive)
      .replaceAll("{name2_ins}", npc2.instrumental)
      .replaceAll("{name2}", npc2.nominative);
  }
  result = result.replace(/\{g:([^|}]*)\|([^}]*)\}/g, (_match, masc, fem) => (npc.gender === "f" ? fem : masc));
  if (npc2) {
    result = result.replace(/\{g2:([^|}]*)\|([^}]*)\}/g, (_match, masc, fem) => (npc2.gender === "f" ? fem : masc));
  }
  return result;
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
  story_flags: string;
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
    decree: (() => {
      const flags = JSON.parse(row.story_flags || "{}") as Record<string, string | boolean>;
      const decreeId = flags.decree;
      return typeof decreeId === "string" ? decrees.find((d) => d.id === decreeId) ?? null : null;
    })(),
  };
}

export async function getCharacterForUser(userId: number): Promise<CharacterRow | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM characters WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
    args: [userId],
  });
  return result.rows[0] as unknown as CharacterRow | undefined;
}

export async function getCharacterById(id: number): Promise<CharacterRow | undefined> {
  const result = await db.execute({ sql: `SELECT * FROM characters WHERE id = ?`, args: [id] });
  return result.rows[0] as unknown as CharacterRow | undefined;
}

export async function createCharacter(userId: number, name: string, backstoryId: string): Promise<CharacterRow> {
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

  const info = await db.execute({
    sql: `INSERT INTO characters (user_id, name, backstory_id, stats, grades)
       VALUES (?, ?, ?, ?, ?)`,
    args: [userId, name, backstoryId, JSON.stringify(stats), JSON.stringify(grades)],
  });

  return (await getCharacterById(Number(info.lastInsertRowid)))!;
}

export function getSortingQuestionsList() {
  return sortingQuestions;
}

export async function submitSorting(characterId: number, answers: { questionId: string; optionId: string }[]) {
  const character = await getCharacterById(characterId);
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

  await db.execute({
    sql: `UPDATE characters SET house = ?, sorting_answers = ?, phase = 'year', week = 1, updated_at = datetime('now') WHERE id = ?`,
    args: [winningHouse, JSON.stringify(answers), characterId],
  });

  return { house: winningHouse, tally };
}

export async function getCurrentEvent(characterId: number) {
  const character = await getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  const seen: string[] = JSON.parse(character.seen_events);
  const memberClubs: string[] = JSON.parse(character.clubs);
  const storyFlags: Record<string, string | boolean> = JSON.parse(character.story_flags || "{}");

  const matching = events.filter(
    (e) =>
      e.weekMin <= character.week &&
      character.week <= e.weekMax &&
      !seen.includes(e.id) &&
      character.year >= (e.minYear ?? 1) &&
      character.year <= (e.maxYear ?? Infinity) &&
      (!e.requiresClub || memberClubs.includes(e.requiresClub)) &&
      (!e.excludesClub || !memberClubs.includes(e.excludesClub)) &&
      (!e.requiresFlag || !!storyFlags[e.requiresFlag]) &&
      (!e.excludesFlag || !storyFlags[e.excludesFlag])
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
  const npc2 = candidate.nameSeedKey2 ? pickNpcName(characterId, candidate.nameSeedKey2) : undefined;
  const sub = (text: string) => (npc ? applyNameTokens(text, npc, npc2) : text);

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

export async function advanceWeek(characterId: number): Promise<CharacterRow> {
  let character = await getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  const nextWeek = character.week + 1;
  await db.execute({
    sql: `UPDATE characters SET week = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [nextWeek, characterId],
  });
  character = (await getCharacterById(characterId))!;

  if (character.week > totalWeeksPerYear && character.phase === "year") {
    await db.execute({
      sql: `UPDATE characters SET phase = 'exam', updated_at = datetime('now') WHERE id = ?`,
      args: [characterId],
    });
    character = (await getCharacterById(characterId))!;
  }
  return character;
}

interface ResolveOptions {
  challengeSuccess?: boolean;
}

export async function resolveEventChoice(
  characterId: number,
  eventId: string,
  choiceId: string,
  options: ResolveOptions = {}
) {
  const character = await getCharacterById(characterId);
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
  const eventNpc2 = event.nameSeedKey2 ? pickNpcName(characterId, event.nameSeedKey2) : undefined;
  const outcomeText = eventNpc ? applyNameTokens(outcome.text, eventNpc, eventNpc2) : outcome.text;

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

  const storyFlags: Record<string, string | boolean> = JSON.parse(character.story_flags || "{}");
  if (outcome.setFlags) {
    Object.assign(storyFlags, outcome.setFlags);
  }

  const seen: string[] = JSON.parse(character.seen_events);
  seen.push(event.id);

  await db.execute({
    sql: `UPDATE characters SET stats = ?, grades = ?, friends = ?, relationship = ?, house_points = ?, clubs = ?, seen_events = ?, story_flags = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [
      JSON.stringify(stats),
      JSON.stringify(grades),
      JSON.stringify(friends),
      relationship ? JSON.stringify(relationship) : null,
      housePoints,
      JSON.stringify(memberClubs),
      JSON.stringify(seen),
      JSON.stringify(storyFlags),
      characterId,
    ],
  });

  await db.execute({
    sql: `INSERT INTO event_log (character_id, year, week, event_id, choice_id, outcome_id, outcome_text, deltas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      characterId,
      character.year,
      character.week,
      event.id,
      choice.id,
      isBad ? "bad" : "good",
      outcomeText,
      JSON.stringify(outcome),
    ],
  });

  const updated = await advanceWeek(characterId);

  return {
    isBad,
    outcomeText,
    character: serializeCharacter(updated),
  };
}

export async function leaveClub(characterId: number, clubId: string) {
  const character = (await getCharacterById(characterId))!;
  const list: string[] = JSON.parse(character.clubs).filter((id: string) => id !== clubId);
  if (clubId === "quidditch") {
    await db.execute({
      sql: `UPDATE characters SET clubs = ?, quidditch_position = NULL, updated_at = datetime('now') WHERE id = ?`,
      args: [JSON.stringify(list), characterId],
    });
  } else {
    await db.execute({
      sql: `UPDATE characters SET clubs = ?, updated_at = datetime('now') WHERE id = ?`,
      args: [JSON.stringify(list), characterId],
    });
  }
  return serializeCharacter((await getCharacterById(characterId))!);
}

export async function setQuidditchPosition(characterId: number, position: QuidditchPosition) {
  const character = (await getCharacterById(characterId))!;
  const memberClubs: string[] = JSON.parse(character.clubs);
  if (!memberClubs.includes("quidditch")) throw new Error("Сначала нужно вступить в квиддичную команду");
  if (character.quidditch_position) throw new Error("Позицию в команде уже нельзя изменить");
  if (!QUIDDITCH_POSITIONS.includes(position)) throw new Error("Неизвестная позиция");
  await db.execute({
    sql: `UPDATE characters SET quidditch_position = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [position, characterId],
  });
  return serializeCharacter((await getCharacterById(characterId))!);
}

export async function buyPet(characterId: number, petId: string) {
  const pet = pets.find((p) => p.id === petId);
  if (!pet) throw new Error("Питомец не найден");
  const character = (await getCharacterById(characterId))!;
  if (character.pet) throw new Error("У тебя уже есть питомец");
  await db.execute({
    sql: `UPDATE characters SET pet = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [JSON.stringify({ id: pet.id, name: pet.name }), characterId],
  });
  return serializeCharacter((await getCharacterById(characterId))!);
}

export function getExamQuestions() {
  return examQuestions;
}

export async function submitExamAnswers(characterId: number, answers: { questionId: string; optionIndex: number }[]) {
  const character = await getCharacterById(characterId);
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
    await db.execute({
      sql: `INSERT INTO exam_results (character_id, year, subject, score, grade_letter) VALUES (?, ?, ?, ?, ?)`,
      args: [characterId, character.year, subject.id, finalScore, gradeLetter],
    });
    grades[subject.id] = finalScore;
  }

  await db.execute({
    sql: `UPDATE characters SET grades = ?, phase = 'results', updated_at = datetime('now') WHERE id = ?`,
    args: [JSON.stringify(grades), characterId],
  });

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

export async function getExamResults(characterId: number) {
  const result = await db.execute({
    sql: `SELECT * FROM exam_results WHERE character_id = ? ORDER BY id DESC LIMIT 7`,
    args: [characterId],
  });
  return result.rows;
}

export const MAX_YEAR = 7;

export async function advanceYear(characterId: number) {
  const character = await getCharacterById(characterId);
  if (!character) throw new Error("Персонаж не найден");
  if (character.phase !== "results") throw new Error("Год ещё не завершён");

  if (character.year >= MAX_YEAR) {
    await db.execute({
      sql: `UPDATE characters SET phase = 'graduated', status = 'graduated', updated_at = datetime('now') WHERE id = ?`,
      args: [characterId],
    });
  } else {
    await db.execute({
      sql: `UPDATE characters SET year = year + 1, week = 1, phase = 'year', updated_at = datetime('now') WHERE id = ?`,
      args: [characterId],
    });
  }

  return serializeCharacter((await getCharacterById(characterId))!);
}

export async function studyTopic(characterId: number, topicId: string) {
  const character = (await getCharacterById(characterId))!;
  const studied: string[] = JSON.parse(character.studied_topics);
  if (!studied.includes(topicId)) studied.push(topicId);
  await db.execute({
    sql: `UPDATE characters SET studied_topics = ?, updated_at = datetime('now') WHERE id = ?`,
    args: [JSON.stringify(studied), characterId],
  });
  return studied;
}
