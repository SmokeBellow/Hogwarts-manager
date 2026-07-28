import { useState } from "react";
import type { Character, GameEvent, SpellTemplate } from "../types";
import { api } from "../api";
import { SpellDrawCanvas } from "./SpellDrawCanvas";
import { TimingMinigame } from "./TimingMinigame";
import { KeeperRingsMinigame } from "./KeeperRingsMinigame";
import { SeekerReflexMinigame } from "./SeekerReflexMinigame";
import { ChaserComboMinigame } from "./ChaserComboMinigame";

interface Props {
  event: GameEvent;
  spellTemplates: SpellTemplate[];
  character: Character;
  onResolved: (character: any) => void;
}

type Stage = "choosing" | "spell" | "minigame" | "outcome";

const MINIGAME_THEMES: Record<string, { title: string; description: string; actionLabel: string }> = {
  gobstones: {
    title: "Точный бросок",
    description: "Дождись, когда бросок будет наиболее точным, и жми в нужный момент.",
    actionLabel: "Бросить!",
  },
};

export function EventPanel({ event, spellTemplates, character, onResolved }: Props) {
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

  const renderMinigame = () => {
    if (!pendingChoice?.minigameId) return null;
    const onResult = (success: boolean) => setChallengeSuccess(success);
    if (pendingChoice.minigameId === "quidditch") {
      switch (character.quidditchPosition) {
        case "keeper":
          return <KeeperRingsMinigame onResult={onResult} />;
        case "seeker":
          return <SeekerReflexMinigame onResult={onResult} />;
        case "chaser":
          return <ChaserComboMinigame onResult={onResult} />;
        case "beater":
          return (
            <TimingMinigame
              title="Отбить бладжер"
              description="Дождись, когда бладжер окажется в зоне удара, и бей точно в этот миг."
              actionLabel="Отбить!"
              onResult={onResult}
            />
          );
        default:
          return (
            <TimingMinigame
              title="Погоня за снитчем"
              description="Лови момент и жми в тот миг, когда рука окажется у самой цели."
              actionLabel="Поймать снитч!"
              onResult={onResult}
            />
          );
      }
    }
    const theme = MINIGAME_THEMES[pendingChoice.minigameId];
    if (!theme) return null;
    return (
      <TimingMinigame title={theme.title} description={theme.description} actionLabel={theme.actionLabel} onResult={onResult} />
    );
  };

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

      {stage === "minigame" && pendingChoiceId && (
        <>
          {renderMinigame()}
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
