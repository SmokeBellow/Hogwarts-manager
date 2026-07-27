import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db.js";
import { signToken } from "../auth.js";

export const authRouter = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
});

authRouter.post("/register", (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Некорректные данные" });
  }
  const { email, password } = parsed.data;
  const existing = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email);
  if (existing) return res.status(409).json({ error: "Этот email уже зарегистрирован" });

  const hash = bcrypt.hashSync(password, 10);
  const info = db.prepare(`INSERT INTO users (email, password_hash) VALUES (?, ?)`).run(email, hash);
  const token = signToken(info.lastInsertRowid as number);
  res.json({ token });
});

authRouter.post("/login", (req, res) => {
  const parsed = credsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Некорректные данные" });
  }
  const { email, password } = parsed.data;
  const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email) as
    | { id: number; password_hash: string }
    | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Неверный email или пароль" });
  }
  const token = signToken(user.id);
  res.json({ token });
});
