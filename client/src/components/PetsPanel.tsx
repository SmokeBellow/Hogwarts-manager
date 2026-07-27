import type { Character, Pet } from "../types";

export function PetsPanel({ character, pets }: { character: Character; pets: Pet[] }) {
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
      <p className="text-muted">
        Питомцев продают только в лавке «Волшебный зверинец» в Косом переулке — эту возможность дают перед началом
        каждого учебного года. В этот раз ты решил(а) обойтись без питомца.
      </p>
    </div>
  );
}
