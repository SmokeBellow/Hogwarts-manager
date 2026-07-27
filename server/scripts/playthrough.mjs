// Автоматически проходит весь первый курс через API, без браузера и без
// реальной регистрации (email — просто случайная строка, никуда не отправляется).
// Использование: сервер должен быть запущен (npm run dev), затем:
//   node scripts/playthrough.mjs

const base = process.env.API_BASE || "http://localhost:4000/api";

async function req(path, opts = {}) {
  const res = await fetch(base + path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path}: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  const email = `playtest_${Date.now()}@example.com`;
  const { token } = await req("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password: "password123" }),
  });
  const auth = { Authorization: `Bearer ${token}` };
  console.log(`Тестовый аккаунт создан: ${email} (пароль: password123)`);

  await req("/game/character", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ name: "Тестовый Волшебник", backstoryId: "halfblood" }),
  });

  const { questions } = await req("/game/sorting/questions", { headers: auth });
  const answers = questions.map((q) => ({ questionId: q.id, optionId: q.options[0].id }));
  const sortRes = await req("/game/sorting/submit", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ answers }),
  });
  console.log("Распределён(а) в:", sortRes.house);

  let safety = 0;
  while (safety < 200) {
    safety++;
    const { character } = await req("/game/character", { headers: auth });
    if (character.phase === "exam") {
      console.log(`Достигнута фаза экзаменов на неделе ${character.week}, год ${character.year}`);
      break;
    }
    const { event } = await req("/game/event/current", { headers: auth });
    if (!event) {
      await req("/game/week/advance", { method: "POST", headers: auth });
      continue;
    }
    const choice = event.choices[0];
    const resolveRes = await req("/game/event/resolve", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        eventId: event.id,
        choiceId: choice.id,
        spellSuccess: choice.requiresSpell ? true : undefined,
      }),
    });
    console.log(
      `${event.title} -> "${choice.text}" | исход: ${resolveRes.isBad ? "неудача" : "успех"} | деньги: ${resolveRes.character.money}`
    );
  }

  const { questions: examQs } = await req("/game/exam/questions", { headers: auth });
  const examAnswers = examQs.map((q) => ({ questionId: q.id, optionIndex: 0 }));
  const examRes = await req("/game/exam/submit", {
    method: "POST",
    headers: auth,
    body: JSON.stringify({ answers: examAnswers }),
  });
  console.log("\nРезультаты экзаменов:");
  for (const r of examRes.results) {
    console.log(`  ${r.subject}: ${r.score} баллов (${r.gradeLetter})`);
  }
  console.log("\nГотово! Можно войти в браузере под этим же email/паролем, чтобы увидеть итог визуально.");
}

main().catch((e) => {
  console.error("Ошибка прохождения:", e.message);
  process.exit(1);
});
