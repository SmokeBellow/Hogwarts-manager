import type { Character } from "../types";

export function CharacterHeader({ character }: { character: Character }) {
  return (
    <div className="panel character-header">
      <div className="identity-row">
        <h2 style={{ margin: 0 }}>{character.name}</h2>
        {character.house && <span className={`house-badge house-${character.house}`}>{character.house}</span>}
      </div>
      <div className="info-strip">
        <div className="info-chip">💰 {character.money} галлеонов</div>
        <div className="info-chip">
          📅 Год {character.year} · Неделя {Math.min(character.week, character.totalWeeks)} из {character.totalWeeks}
        </div>
      </div>
    </div>
  );
}
