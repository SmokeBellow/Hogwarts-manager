import type { Character, ExamResult, Subject } from "../types";

const GRADE_NAMES: Record<string, string> = {
  O: "Выше ожидаемого (O)",
  E: "Превосходно (E)",
  A: "Удовлетворительно (A)",
  P: "Слабо (P)",
  D: "Отвратительно (D)",
  T: "Тролль (T)",
};

export function ResultsPage({
  results,
  character,
  subjects,
}: {
  results: ExamResult[];
  character: Character;
  subjects: Subject[];
}) {
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;
  const passed = results.filter((r) => r.gradeLetter !== "T").length;

  return (
    <div className="app-shell">
      <div className="parchment-card">
        <h1 style={{ textAlign: "center" }}>Итоги {character.year}-го курса</h1>
        <p style={{ textAlign: "center" }}>
          {character.name} завершил(а) курс, набрав {passed} из {results.length} предметов на проходной балл.
        </p>
        <div className="grades-grid" style={{ marginTop: 16 }}>
          {results.map((r) => (
            <div className="subject-chip" key={r.subject} style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <strong>{subjectName(r.subject)}</strong>
              <span>Баллы: {r.score}</span>
              <span>{GRADE_NAMES[r.gradeLetter] ?? r.gradeLetter}</span>
            </div>
          ))}
        </div>
        <div className="panel" style={{ marginTop: 24, color: "var(--parchment)" }}>
          <h3 style={{ marginTop: 0 }}>Что дальше?</h3>
          <p>
            Дом «{character.house}» получил от тебя {character.housePoints} очков за этот год. Друзей рядом:{" "}
            {character.friends.length}
            {character.relationship ? `, а сердце занято — отношения с ${character.relationship.name}.` : "."}
          </p>
          <p className="text-muted">
            Переход на следующий курс, продолжение сюжета и выбор профессии после выпуска — в разработке. Первый курс
            пройден полностью!
          </p>
        </div>
      </div>
    </div>
  );
}
