import { useState } from "react";
import type { Character, Subject } from "../types";
import { AnimatedBar } from "./AnimatedBar";

const STAT_LABELS: Record<string, string> = {
  courage: "Смелость",
  intellect: "Ум",
  ambition: "Амбиции",
  loyalty: "Верность",
  charm: "Обаяние",
};

const GRADE_COLORS: Record<string, string> = {
  O: "#2f6b45",
  E: "#3f7a3f",
  A: "#7a7a2f",
  P: "#a06b2f",
  D: "#a04b2f",
  T: "#8f2f2f",
};

function gradeColor(value: number): string {
  const hue = Math.max(0, Math.min(100, value)) * 1.2; // 0 = red, 100 = green
  return `hsl(${hue}, 58%, 46%)`;
}

export function StatsPanel({ character, subjects }: { character: Character; subjects: Subject[] }) {
  const [gradesOpen, setGradesOpen] = useState(false);
  const average =
    subjects.length > 0
      ? Math.round(subjects.reduce((sum, s) => sum + (character.grades[s.id] ?? 0), 0) / subjects.length)
      : 0;

  return (
    <div className="panel">
      <div className="identity-row">
        <h2 style={{ margin: 0 }}>{character.name}</h2>
        {character.house && <span className={`house-badge house-${character.house}`}>{character.house}</span>}
      </div>
      <div className="info-strip">
        <div className="info-chip">
          📅 Год {character.year} · Неделя {Math.min(character.week, character.totalWeeks)} из {character.totalWeeks}
        </div>
      </div>

      <h3>Черты характера</h3>
      <div className="stat-grid">
        {Object.entries(character.stats).map(([key, value]) => (
          <div className="stat-item" key={key}>
            <span className="stat-label">{STAT_LABELS[key] ?? key}</span>
            <AnimatedBar value={value} />
          </div>
        ))}
      </div>

      <button className="collapsible-header" onClick={() => setGradesOpen((v) => !v)} aria-expanded={gradesOpen}>
        <h3 style={{ margin: 0 }}>Оценки</h3>
        <div className="collapsible-header-right">
          <AnimatedBar value={average} color={gradeColor(average)} width={80} />
          <span>{average}</span>
          <span className={`collapse-chevron ${gradesOpen ? "open" : ""}`}>▾</span>
        </div>
      </button>
      {gradesOpen && (
        <div className="grades-grid" style={{ marginTop: 10 }}>
          {subjects.map((s) => {
            const grade = character.grades[s.id] ?? 0;
            return (
              <div className="subject-chip" key={s.id}>
                <div className="subject-chip-head">
                  <span>
                    {s.icon} {s.name}
                  </span>
                  <strong>{grade}</strong>
                </div>
                <AnimatedBar value={grade} color={gradeColor(grade)} />
              </div>
            );
          })}
        </div>
      )}

      <h3>Социальная жизнь</h3>
      <p>
        Друзья: {character.friends.length}
        {character.relationship && (
          <>
            {" "}
            · Отношения с {character.relationship.name} (уровень {character.relationship.level})
          </>
        )}
      </p>
      <p>
        Баллы факультета от тебя: <strong>{character.housePoints}</strong>
      </p>
      <p>
        Клубы: {character.clubs.length > 0 ? character.clubs.join(", ") : "нет"} · Питомец:{" "}
        {character.pet ? character.pet.name : "нет"}
      </p>
    </div>
  );
}

export { GRADE_COLORS };
