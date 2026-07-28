import { useState } from "react";
import type { Backstory } from "../types";
import { api } from "../api";
import { useScrollTop } from "../useScrollTop";
import { generateRandomName } from "../nameGenerator";
import { HogwartsLetterScene } from "../components/HogwartsLetterScene";

interface Props {
  backstories: Backstory[];
  onCreated: (character: any) => void;
}

type Step = "name" | "letter" | "backstory";

export function CreateCharacterPage({ backstories, onCreated }: Props) {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useScrollTop(step);

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

  if (step === "name") {
    return (
      <div className="app-shell">
        <div className="center-screen" style={{ minHeight: "70vh" }}>
          <div className="parchment-card question-card" style={{ textAlign: "center", maxWidth: 480, width: "100%" }}>
            <h1 style={{ marginTop: 0 }}>Как тебя зовут?</h1>
            <p>Прежде чем сова принесёт письмо из Хогвартса, назови своё имя.</p>
            <input
              placeholder="Имя твоего персонажа"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) setStep("letter");
              }}
              style={{ width: "100%", marginTop: 16 }}
              maxLength={40}
              autoFocus
            />
            <button
              className="btn"
              style={{ marginTop: 10, width: "100%" }}
              onClick={() => setName(generateRandomName())}
              type="button"
            >
              🎲 Придумать имя случайно
            </button>
            <button
              className="btn btn-primary"
              style={{ marginTop: 12 }}
              disabled={!name.trim()}
              onClick={() => setStep("letter")}
            >
              Отправить сову
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "letter") {
    return (
      <div className="app-shell">
        <div className="center-screen" style={{ minHeight: "70vh" }}>
          <div className="parchment-card question-card" style={{ textAlign: "center", maxWidth: 520, width: "100%" }}>
            <HogwartsLetterScene name={name} onContinue={() => setStep("backstory")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" style={{ paddingBottom: selected ? 100 : undefined }}>
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>Выбери предысторию</h1>
        <p className="text-muted">Нажми на карточку, чтобы прочитать её и выбрать.</p>
        <div className="card-grid" style={{ marginTop: 12 }}>
          {backstories.map((b) => {
            const isSelected = selected === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(isSelected ? null : b.id)}
                className="item-card"
                style={{
                  border: isSelected ? "2px solid var(--brass-lit)" : undefined,
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="avatar-placeholder">{b.icon}</span>
                  <strong className="display" style={{ color: "var(--brass-lit)" }}>
                    {b.title}
                  </strong>
                </div>
                {isSelected && <span style={{ fontSize: "0.92rem", marginTop: 4 }}>{b.description}</span>}
              </button>
            );
          })}
        </div>
        {error && <p className="error-text" style={{ marginTop: 16 }}>{error}</p>}
      </div>

      {selected && (
        <div className="sticky-cta">
          <button className="btn btn-primary sticky-cta-btn" disabled={loading} onClick={submit}>
            Отправиться в Хогвартс
          </button>
        </div>
      )}
    </div>
  );
}
