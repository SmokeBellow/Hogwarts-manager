import { useEffect, useState } from "react";
import type { GameEvent, SpellTemplate } from "../types";
import { api } from "../api";
import { EventPanel } from "../components/EventPanel";

type Step = "platform" | "express" | "arrival";

interface Props {
  characterName: string;
  spellTemplates: SpellTemplate[];
  onDone: (character: any) => void;
}

export function IntroPage({ characterName, spellTemplates, onDone }: Props) {
  const [step, setStep] = useState<Step>("platform");
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [latestCharacter, setLatestCharacter] = useState<any>(null);

  useEffect(() => {
    if (step === "express" && !event) {
      api.getCurrentEvent().then((res) => setEvent(res.event));
    }
  }, [step, event]);

  if (step === "platform") {
    return (
      <div className="app-shell">
        <div className="parchment-card">
          <h1 style={{ marginTop: 0 }}>Платформа 9¾</h1>
          <p>
            {characterName} проходит сквозь незаметный барьер между платформами девять и десять — и оказывается
            перед алым паровозом, окутанным паром. На перроне толпятся семьи волшебников, совы ухают в клетках,
            тележки со скрипом катятся к вагонам.
          </p>
          <p>Через несколько минут отправляется Хогвартс-экспресс.</p>
          <button className="btn btn-primary" onClick={() => setStep("express")}>
            Сесть в поезд
          </button>
        </div>
      </div>
    );
  }

  if (step === "express") {
    return (
      <div className="app-shell">
        {!event && <div className="panel">Поезд отправляется...</div>}
        {event && (
          <EventPanel
            event={event}
            spellTemplates={spellTemplates}
            onResolved={(character) => {
              setLatestCharacter(character);
              setStep("arrival");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="parchment-card">
        <h1 style={{ marginTop: 0 }}>Прибытие в Хогвартс</h1>
        <p>
          Поезд останавливается на маленькой станции Хогсмид. Великан-лесничий машет фонарём и зовёт первокурсников
          к лодкам. Через озеро, в темноте, впереди медленно вырастает громада замка — тысячи освещённых окон,
          башни, шпили.
        </p>
        <p>У ворот Большого зала первокурсников уже ждёт Распределяющая шляпа.</p>
        <button className="btn btn-primary" onClick={() => onDone(latestCharacter)}>
          Войти в Большой зал
        </button>
      </div>
    </div>
  );
}
