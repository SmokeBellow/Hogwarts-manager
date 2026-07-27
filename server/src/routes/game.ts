import { Router } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../auth.js";
import { requireAuth } from "../auth.js";
import { backstories } from "../content/backstories.js";
import { subjects } from "../content/subjects.js";
import { clubs } from "../content/clubs.js";
import { pets } from "../content/pets.js";
import { spellTemplates } from "../content/spells.js";
import { lectureTopics } from "../content/lectures.js";
import {
  createCharacter,
  getCharacterForUser,
  getCharacterById,
  serializeCharacter,
  getSortingQuestionsList,
  submitSorting,
  getCurrentEvent,
  resolveEventChoice,
  advanceWeek,
  joinClub,
  leaveClub,
  buyPet,
  getExamQuestions,
  submitExamAnswers,
  getExamResults,
  studyTopic,
} from "../game/engine.js";

export const gameRouter = Router();
gameRouter.use(requireAuth);

function ownedCharacterOr404(req: AuthedRequest, res: import("express").Response) {
  const character = getCharacterForUser(req.userId!);
  if (!character) {
    res.status(404).json({ error: "Персонаж не найден" });
    return null;
  }
  return character;
}

gameRouter.get("/static", (_req, res) => {
  res.json({ backstories, subjects, clubs, pets, spellTemplates, lectureTopics });
});

gameRouter.get("/character", (req: AuthedRequest, res) => {
  const character = getCharacterForUser(req.userId!);
  if (!character) return res.json({ character: null });
  res.json({ character: serializeCharacter(character) });
});

const createSchema = z.object({
  name: z.string().min(1).max(40),
  backstoryId: z.string(),
});

gameRouter.post("/character", (req: AuthedRequest, res) => {
  const existing = getCharacterForUser(req.userId!);
  if (existing && existing.status === "active") {
    return res.status(409).json({ error: "У тебя уже есть активный персонаж" });
  }
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    const character = createCharacter(req.userId!, parsed.data.name, parsed.data.backstoryId);
    res.json({ character: serializeCharacter(character) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.get("/sorting/questions", (_req, res) => {
  res.json({ questions: getSortingQuestionsList() });
});

const sortingSchema = z.object({
  answers: z.array(z.object({ questionId: z.string(), optionId: z.string() })),
});

gameRouter.post("/sorting/submit", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = sortingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    const result = submitSorting(character.id, parsed.data.answers);
    res.json({ ...result, character: serializeCharacter(getCharacterById(character.id)!) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.get("/event/current", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const event = getCurrentEvent(character.id);
  res.json({ event });
});

const resolveSchema = z.object({
  eventId: z.string(),
  choiceId: z.string(),
  challengeSuccess: z.boolean().optional(),
});

gameRouter.post("/event/resolve", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = resolveSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    const result = resolveEventChoice(character.id, parsed.data.eventId, parsed.data.choiceId, {
      challengeSuccess: parsed.data.challengeSuccess,
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.post("/week/advance", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const updated = advanceWeek(character.id);
  res.json({ character: serializeCharacter(updated) });
});

const clubSchema = z.object({ clubId: z.string() });

gameRouter.post("/clubs/join", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = clubSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    res.json({ character: joinClub(character.id, parsed.data.clubId) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.post("/clubs/leave", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = clubSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  res.json({ character: leaveClub(character.id, parsed.data.clubId) });
});

const petSchema = z.object({ petId: z.string() });

gameRouter.post("/pets/buy", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = petSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    res.json({ character: buyPet(character.id, parsed.data.petId) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.get("/exam/questions", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const questions = getExamQuestions().map(({ correctIndex: _correctIndex, ...rest }) => rest);
  res.json({ questions });
});

const examSchema = z.object({
  answers: z.array(z.object({ questionId: z.string(), optionIndex: z.number() })),
});

gameRouter.post("/exam/submit", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = examSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  try {
    const results = submitExamAnswers(character.id, parsed.data.answers);
    res.json({ results, character: serializeCharacter(getCharacterById(character.id)!) });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

gameRouter.get("/exam/results", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  res.json({ results: getExamResults(character.id) });
});

const studySchema = z.object({ topicId: z.string() });

gameRouter.post("/study", (req: AuthedRequest, res) => {
  const character = ownedCharacterOr404(req, res);
  if (!character) return;
  const parsed = studySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Некорректные данные" });
  res.json({ studiedTopics: studyTopic(character.id, parsed.data.topicId) });
});
