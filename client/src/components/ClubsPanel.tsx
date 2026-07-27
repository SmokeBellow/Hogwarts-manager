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
      <p className="text-muted">Клубы отнимают немного денег каждую неделю, но развивают твои черты характера.</p>
      <div className="card-grid" style={{ marginTop: 12 }}>
        {clubs.map((club) => {
          const joined = character.clubs.includes(club.id);
          return (
            <div className="item-card" key={club.id}>
              <span className="avatar-placeholder">{club.icon}</span>
              <strong className="display" style={{ color: "var(--gold-bright)" }}>
                {club.name}
              </strong>
              <span>{club.description}</span>
              <span className="pill">{club.weeklyCost > 0 ? `${club.weeklyCost} гал./неделю` : "Бесплатно"}</span>
              <button className={joined ? "btn btn-danger" : "btn btn-primary"} onClick={() => toggle(club.id, joined)}>
                {joined ? "Покинуть клуб" : "Вступить"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
