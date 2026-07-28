import { useState } from "react";
import type { Character, ExamResult, Subject } from "../types";
import { api } from "../api";

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
  maxYear,
  onContinue,
}: {
  results: ExamResult[];
  character: Character;
  subjects: Subject[];
  maxYear: number;
  onContinue: (character: Character) => void;
}) {
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;
  const passed = results.filter((r) => r.gradeLetter !== "T").length;
  const isFinalYear = character.year >= maxYear;
  const [loading, setLoading] = useState(false);

  const continueYear = async () => {
    setLoading(true);
    try {
      const res = await api.advanceYear();
      onContinue(res.character);
    } finally {
      setLoading(false);
    }
  };

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
            {character.relationship ? `, а сердце занято: ${character.relationship.name}.` : "."}
          </p>
          {isFinalYear ? (
            <p className="text-muted">Седьмой курс позади — впереди выпускной вечер в Большом зале.</p>
          ) : (
            <p className="text-muted">
              Летние каникулы позади — пора возвращаться в Хогвартс-экспресс и начинать {character.year + 1}-й курс.
            </p>
          )}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 20, width: "100%" }} disabled={loading} onClick={continueYear}>
          {isFinalYear ? "Закончить Хогвартс" : `Перейти на ${character.year + 1}-й курс`}
        </button>
      </div>
    </div>
  );
}
