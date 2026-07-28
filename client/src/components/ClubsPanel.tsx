import type { Character, Club } from "../types";
import { api } from "../api";

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
              <strong className="display" style={{ color: "var(--gold-bright)" }}>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
