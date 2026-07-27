import type { Character, Subject } from "../types";

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

export function StatsPanel({ character, subjects }: { character: Character; subjects: Subject[] }) {
  return (
    <div className="panel">
      <div className="top-bar">
        <div>
          <h2 style={{ margin: 0 }}>{character.name}</h2>
          {character.house && <span className={`house-badge house-${character.house}`}>{character.house}</span>}
        </div>
        <div style={{ textAlign: "right" }}>
          <div>💰 {character.money} галлеонов</div>
          <div className="text-muted">
            Год {character.year} · Неделя {Math.min(character.week, character.totalWeeks)} из {character.totalWeeks}
          </div>
        </div>
      </div>

      <h3>Черты характера</h3>
      <div className="stat-grid">
        {Object.entries(character.stats).map(([key, value]) => (
          <div className="stat-item" key={key}>
            <span className="stat-label">{STAT_LABELS[key] ?? key}</span>
            <div className="stat-bar-track">
              <div className="stat-bar-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h3>Оценки</h3>
      <div className="grades-grid">
        {subjects.map((s) => {
          const grade = character.grades[s.id] ?? 50;
          return (
            <div className="subject-chip" key={s.id}>
              <span>
                {s.icon} {s.name}
              </span>
              <strong style={{ color: grade >= 70 ? "#8fd6a8" : grade >= 40 ? "#d6c98f" : "#d68f8f" }}>
                {grade}
              </strong>
            </div>
          );
        })}
      </div>

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
