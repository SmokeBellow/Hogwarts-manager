import { useState } from "react";
import type { Character, Pet } from "../types";
import { api } from "../api";

export function PetsPanel({
  character,
  pets,
  onUpdated,
}: {
  character: Character;
  pets: Pet[];
  onUpdated: (c: Character) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const buy = async (petId: string) => {
    setError(null);
    try {
      const res = await api.buyPet(petId);
      onUpdated(res.character);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (character.pet) {
    const owned = pets.find((p) => p.id === character.pet!.id);
    return (
      <div className="panel">
        <h2>Твой питомец</h2>
        <div className="item-card" style={{ maxWidth: 260 }}>
          {owned && <span className="avatar-placeholder">{owned.icon}</span>}
          <p style={{ margin: 0 }}>
            У тебя уже есть питомец: <strong>{character.pet.name}</strong>. Он всегда рядом и скрашивает школьные
            будни.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Волшебный зверинец</h2>
      <p className="text-muted">Питомец поднимает настроение, но требует небольших еженедельных расходов.</p>
      {error && <p className="error-text">{error}</p>}
      <div className="card-grid" style={{ marginTop: 12 }}>
        {pets.map((pet) => (
          <div className="item-card" key={pet.id}>
            <span className="avatar-placeholder">{pet.icon}</span>
            <strong className="display" style={{ color: "var(--gold-bright)" }}>
              {pet.name}
            </strong>
            <span>{pet.description}</span>
            <span className="pill">
              {pet.cost} гал. · {pet.weeklyUpkeep > 0 ? `${pet.weeklyUpkeep} гал./нед.` : "без доплат"}
            </span>
            <button className="btn btn-primary" disabled={character.money < pet.cost} onClick={() => buy(pet.id)}>
              Купить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
