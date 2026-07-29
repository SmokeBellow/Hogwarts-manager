import type { Character, Subject } from "../types";

const POSITION_LABELS: Record<string, string> = {
  keeper: "Вратарь",
  chaser: "Охотник",
  beater: "Загонщик",
  seeker: "Ловец",
};

export function GraduationPage({ character, subjects }: { character: Character; subjects: Subject[] }) {
  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="app-shell">
      <div className="parchment-card" style={{ textAlign: "center" }}>
        <h1>Выпускной вечер</h1>
        <p>
          {character.name} заканчивает семь лет обучения в Школе чародейства и волшебства «Хогвартс» и покидает
          факультет «{character.house}» дипломированным волшебником.
        </p>
        <div className="grades-grid" style={{ marginTop: 20, textAlign: "left" }}>
          {subjects.map((s) => (
            <div className="subject-chip" key={s.id} style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <strong>{subjectName(s.id)}</strong>
              <span>{character.grades[s.id] ?? 0}</span>
            </div>
          ))}
        </div>
        <div className="panel" style={{ marginTop: 24, textAlign: "left", color: "var(--parchment)" }}>
          <h3 style={{ marginTop: 0 }}>Итоги учёбы в Хогвартсе</h3>
          <p>
            За семь лет дом «{character.house}» получил от тебя {character.housePoints} очков. Рядом с тобой{" "}
            {character.friends.length} {character.friends.length === 1 ? "друг" : "друзей"}
            {character.relationship ? `, а сердце занято: ${character.relationship.name}.` : "."}
          </p>
          {character.clubs.length > 0 && <p>Внеклассные занятия: {character.clubs.join(", ")}.</p>}
          {character.quidditchPosition && (
            <p>Позиция в квиддичной команде: {POSITION_LABELS[character.quidditchPosition]}.</p>
          )}
          {character.pet && <p>Верный питомец всё это время: {character.pet.name}.</p>}
        </div>
        {character.decree ? (
          <div
            className="panel"
            style={{
              marginTop: 16,
              textAlign: "left",
              color: "var(--parchment)",
              border: "1px solid var(--brass)",
              boxShadow: "0 0 20px rgba(230, 184, 105, 0.25)",
            }}
          >
            <h3 style={{ marginTop: 0, color: "var(--brass-lit)" }}>Право основателей {character.decree.title}</h3>
            <p style={{ margin: 0 }}>{character.decree.description}</p>
          </div>
        ) : (
          <div className="panel" style={{ marginTop: 16, textAlign: "left", color: "var(--parchment-dim)" }}>
            <p style={{ margin: 0 }}>
              Где-то в замке до сих пор дремлет старое право основателей — то, что могло достаться тебе. В этот раз
              оно так и осталось нетронутым.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
