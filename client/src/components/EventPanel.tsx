import { useState } from "react";
import type { GameEvent, SpellTemplate } from "../types";
import { api } from "../api";
import { SpellDrawCanvas } from "./SpellDrawCanvas";
import { TimingMinigame } from "./TimingMinigame";

interface Props {
  event: GameEvent;
  spellTemplates: SpellTemplate[];
  onResolved: (character: any) => void;
}

type Stage = "choosing" | "spell" | "minigame" | "outcome";

const MINIGAME_THEMES: Record<string, { title: string; description: string; actionLabel: string }> = {
  quidditch: {
    title: "Погоня за снитчем",
    description: "Лови момент и жми в тот миг, когда рука окажется у самой цели.",
    actionLabel: "Поймать снитч!",
  },
  gobstones: {
    title: "Точный бросок",
    description: "Дождись, когда бросок будет наиболее точным, и жми в нужный момент.",
    actionLabel: "Бросить!",
  },
};

export function EventPanel({ event, spellTemplates, onResolved }: Props) {
  const [stage, setStage] = useState<Stage>("choosing");
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const [challengeSuccess, setChallengeSuccess] = useState<boolean | null>(null);
  const [outcome, setOutcome] = useState<{ isBad: boolean; outcomeText: string; character: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const chooseOption = async (choiceId: string, requiresSpell?: boolean, requiresMinigame?: boolean) => {
    if (requiresSpell) {
      setPendingChoiceId(choiceId);
      setStage("spell");
      return;
    }
    if (requiresMinigame) {
      setPendingChoiceId(choiceId);
      setStage("minigame");
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

  const pendingChoice = pendingChoiceId ? event.choices.find((c) => c.id === pendingChoiceId) : null;
  const currentSpell = pendingChoice ? spellTemplates.find((s) => s.id === pendingChoice.spellId) : null;
  const minigameTheme = pendingChoice?.minigameId ? MINIGAME_THEMES[pendingChoice.minigameId] : null;

  return (
    <div className="parchment-card event-panel question-card">
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
                onClick={() => chooseOption(choice.id, choice.requiresSpell, choice.requiresMinigame)}
              >
                {choice.text}
                {choice.requiresSpell && (
                  <span className="pill" style={{ marginLeft: 8 }}>
                    заклинание
                  </span>
                )}
                {choice.requiresMinigame && (
                  <span className="pill" style={{ marginLeft: 8 }}>
                    мини-игра
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
          <SpellDrawCanvas spell={currentSpell} onResult={(success) => setChallengeSuccess(success)} />
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            disabled={challengeSuccess === null || loading}
            onClick={() => resolve(pendingChoiceId, challengeSuccess ?? false)}
          >
            Применить заклинание к ситуации
          </button>
        </>
      )}

      {stage === "minigame" && minigameTheme && pendingChoiceId && (
        <>
          <TimingMinigame
            title={minigameTheme.title}
            description={minigameTheme.description}
            actionLabel={minigameTheme.actionLabel}
            onResult={(success) => setChallengeSuccess(success)}
          />
          <button
            className="btn btn-primary"
            style={{ marginTop: 16 }}
            disabled={challengeSuccess === null || loading}
            onClick={() => resolve(pendingChoiceId, challengeSuccess ?? false)}
          >
            Продолжить
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
