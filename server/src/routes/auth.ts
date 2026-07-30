import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db.js";
import { signToken } from "../auth.js";

export const authRouter = Router();

const credsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Никнейм должен быть не короче 3 символов")
    .max(20, "Никнейм должен быть не длиннее 20 символов")
    .regex(/^[\p{L}\p{N}_-]+$/u, "Никнейм может содержать только буквы, цифры, «_» и «-»"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
});

authRouter.post("/register", (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" });
  }
  const { username, password } = parsed.data;
  const existing = db.prepare(`SELECT id FROM users WHERE username = ?`).get(username);
  if (existing) return res.status(409).json({ error: "Этот никнейм уже занят" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(`INSERT INTO users (username, password_hash) VALUES (?, ?)`).run(username, hash);
  const token = signToken(info.lastInsertRowid as number);
  res.json({ token });
});

authRouter.post("/login", (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Некорректные данные" });
  }
  const { username, password } = parsed.data;
  const user = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username) as
    | { id: number; password_hash: string }
    | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Неверный никнейм или пароль" });
  }
  const token = signToken(user.id);
  res.json({ token });
});
