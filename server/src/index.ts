import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { initDb } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { gameRouter } from "./routes/game.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/game", gameRouter);

// In production the built client (client/dist) is served from the same
// origin as the API, so the frontend can call relative /api/* paths with
// no CORS setup needed. This directory only exists after `client` has
// been built alongside the server (see the root build script).
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Hogwarts Manager server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
