import { useState } from "react";
import type { GameEvent, SpellTemplate } from "../types";
import { api } from "../api";
import { SpellDrawCanvas } from "./SpellDrawCanvas";

interface Props {
  event: GameEvent;
  spellTemplates: SpellTemplate[];
  onResolved: (character: any) => void;
}

type Stage = "choosing" | "spell" | "outcome";

export function EventPanel({ event, spellTemplates, onResolved }: Props) {
  const [stage, setStage] = useState<Stage>("choosing");
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const [spellSuccess, setSpellSuccess] = useState<boolean | null>(null);
  const [outcome, setOutcome] = useState<{ isBad: boolean; outcomeText: string; character: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const chooseOption = async (choiceId: string, requiresSpell?: boolean) => {
    if (requiresSpell) {
      setPendingChoiceId(choiceId);
      setStage("spell");
      return;
    }
    await resolve(choiceId);
  };

  const resolve = async (choiceId: string, success?: boolean) => {
    setLoading(true);
    try {
      const res = await api.resolveEvent(event.id, choiceId, success);
      setOutcome(res);
      setStage("outcome");
    } finally {
      setLoading(false);
    }
  };

  const currentSpell = pendingChoiceId
    ? spellTemplates.find((s) => s.id === event.choices.find((c) => c.id === pendingChoiceId)?.spellId)
    : null;

  return (
    <div className="parchment-card event-panel">
      {stage === "choosing" && (
        <>
          <h2 style={{ marginTop: 0 }}>{event.title}</h2>
          <p>{event.description}</p>
          <div className="choice-list">
            {event.choices.map((choice) => (
              <button
                key={choice.id}
                className="choice-btn"
                disabled={loading}
                onClick={() => chooseOption(choice.id, choice.requiresSpell)}
              >
                {choice.text}
                {choice.requiresSpell && (
                  <span className="pill" style={{ marginLeft: 8 }}>
                    заклинание
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {stage === "spell" && currentSpell && pendingChoiceId && (
        <>
          <h2 style={{ marginTop: 0 }}>Нарисуй движение палочки</h2>
          <SpellDrawCanvas spell={currentSpell} onResult={(success) => setSpellSuccess(success)} />
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            disabled={spellSuccess === null || loading}
            onClick={() => resolve(pendingChoiceId, spellSuccess ?? false)}
          >
            Применить заклинание к ситуации
          </button>
        </>
      )}

      {stage === "outcome" && outcome && (
        <>
          <h2 style={{ marginTop: 0 }}>{outcome.isBad ? "Не всё пошло гладко..." : "Успех!"}</h2>
          <p className={outcome.isBad ? "outcome-bad" : "outcome-good"}>{outcome.outcomeText}</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onResolved(outcome.character)}>
            Продолжить
          </button>
        </>
      )}
    </div>
  );
}
