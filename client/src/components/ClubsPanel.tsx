import type { Character, Club, QuidditchPosition } from "../types";
import { api } from "../api";

const QUIDDITCH_POSITIONS: { id: QuidditchPosition; label: string; icon: string; description: string }[] = [
  { id: "keeper", label: "Вратарь", icon: "🧤", description: "Защищает три кольца от бросков соперника." },
  { id: "chaser", label: "Охотник", icon: "🔴", description: "Забивает голы квоффлом через кольца соперника." },
  { id: "beater", label: "Загонщик", icon: "🏏", description: "Отбивает бладжеры от своей команды." },
  { id: "seeker", label: "Ловец", icon: "✨", description: "Ловит золотой снитч и приносит команде решающие очки." },
];

export function ClubsPanel({
  character,
  clubs,
  onUpdated,
}: {
  character: Character;
  clubs: Club[];
  onUpdated: (c: Character) => void;
}) {
  const toggle = async (clubId: string, joined: boolean) => {
    const res = joined ? await api.leaveClub(clubId) : await api.joinClub(clubId);
    onUpdated(res.character);
  };

  const choosePosition = async (position: QuidditchPosition) => {
    const res = await api.setQuidditchPosition(position);
    onUpdated(res.character);
  };

  return (
    <div className="panel">
      <h2>Внеклассные занятия</h2>
      <p className="text-muted">
        Записаться можно на ярмарке кружков в начале года — здесь же можно вступить или выйти из клуба в любой
        момент.
      </p>
      <div className="card-grid" style={{ marginTop: 12 }}>
        {clubs.map((club) => {
          const joined = character.clubs.includes(club.id);
          const locked = (club.minYear ?? 1) > character.year;
          return (
            <div className="item-card" key={club.id} style={locked ? { opacity: 0.55 } : undefined}>
              <span className="avatar-placeholder">{club.icon}</span>
              <strong className="display" style={{ color: "var(--brass-lit)" }}>
                {club.name}
              </strong>
              <span>{club.description}</span>
              {locked ? (
                <span className="pill">🔒 Доступно с {club.minYear} курса</span>
              ) : (
                <button
                  className={joined ? "btn btn-danger" : "btn btn-primary"}
                  onClick={() => toggle(club.id, joined)}
                >
                  {joined ? "Покинуть клуб" : "Вступить"}
                </button>
              )}
              {joined && club.id === "quidditch" && (
                <div style={{ marginTop: 10, width: "100%" }}>
                  {character.quidditchPosition ? (
                    <p className="text-muted" style={{ margin: 0, fontSize: "0.88rem" }}>
                      Твоя позиция:{" "}
                      <strong style={{ color: "var(--brass-lit)" }}>
                        {QUIDDITCH_POSITIONS.find((p) => p.id === character.quidditchPosition)?.icon}{" "}
                        {QUIDDITCH_POSITIONS.find((p) => p.id === character.quidditchPosition)?.label}
                      </strong>
                    </p>
                  ) : (
                    <p className="text-muted" style={{ margin: "0 0 6px", fontSize: "0.88rem" }}>
                      Выбери свою позицию в команде:
                    </p>
                  )}
                  <div className="position-grid">
                    {QUIDDITCH_POSITIONS.map((p) => (
                      <button
                        key={p.id}
                        className={`position-btn ${character.quidditchPosition === p.id ? "active" : ""}`}
                        title={p.description}
                        onClick={() => choosePosition(p.id)}
                      >
                        {p.icon} {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
