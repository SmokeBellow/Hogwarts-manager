import { useState } from "react";
import type { Backstory } from "../types";
import { api } from "../api";

interface Props {
  backstories: Backstory[];
  onCreated: (character: any) => void;
}

export function CreateCharacterPage({ backstories, onCreated }: Props) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.createCharacter(name.trim(), selected);
      onCreated(res.character);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="panel">
        <h1>Письмо из Хогвартса</h1>
        <p>Прежде чем ты взойдёшь на борт Хогвартс-экспресса, расскажи немного о себе.</p>
        <input
          placeholder="Имя твоего персонажа"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginTop: 12 }}
          maxLength={40}
        />
        <h2 style={{ marginTop: 24 }}>Выбери предысторию</h2>
        <div className="card-grid" style={{ marginTop: 12 }}>
          {backstories.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className="item-card"
              style={{
                border: selected === b.id ? "2px solid var(--gold-bright)" : undefined,
                textAlign: "left",
              }}
            >
              <strong className="display" style={{ color: "var(--gold-bright)" }}>
                {b.title}
              </strong>
              <span style={{ fontSize: "0.92rem" }}>{b.description}</span>
              <span className="pill">Стартовые деньги: {b.startingMoney} галлеонов</span>
            </button>
          ))}
        </div>
        {error && <p className="error-text">{error}</p>}
        <button
          className="btn btn-primary"
          style={{ marginTop: 24 }}
          disabled={!name.trim() || !selected || loading}
          onClick={submit}
        >
          Отправиться в Хогвартс
        </button>
      </div>
    </div>
  );
}
