import { useEffect, useState } from "react";
import type { Character, GameEvent, Pet, SpellTemplate } from "../types";
import { api } from "../api";
import { useScrollTop } from "../useScrollTop";
import { EventPanel } from "../components/EventPanel";

type Step = "diagon" | "platform" | "express" | "arrival";

interface Props {
  character: Character;
  pets: Pet[];
  spellTemplates: SpellTemplate[];
  onDone: (character: Character) => void;
}

export function IntroPage({ character: initialCharacter, pets, spellTemplates, onDone }: Props) {
  const [step, setStep] = useState<Step>("diagon");
  const [character, setCharacter] = useState(initialCharacter);
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [petError, setPetError] = useState<string | null>(null);
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  useScrollTop(step);

  useEffect(() => {
    if (step === "express" && !event) {
      api.getCurrentEvent().then((res) => setEvent(res.event));
    }
  }, [step, event]);

  const buyPet = async (petId: string) => {
    setPetError(null);
    try {
      const res = await api.buyPet(petId);
      setCharacter(res.character);
    } catch (e) {
      setPetError((e as Error).message);
    }
  };

  if (step === "diagon") {
    return (
      <div className="app-shell">
        <div className="parchment-card question-card">
          <h1 style={{ marginTop: 0 }}>Косой переулок</h1>
          <p>
            Перед началом учебного года {character.name} заглядывает в Косой переулок за учебниками, мантией и
            волшебной палочкой. У витрины «Волшебный зверинец» можно завести питомца — единственный шанс сделать
            это перед отправлением в школу.
          </p>
          {character.pet ? (
            <p>
              Питомец уже выбран: <strong>{character.pet.name}</strong>.
            </p>
          ) : (
            <>
              {petError && <p className="error-text">{petError}</p>}
              <div className="card-grid" style={{ marginTop: 12 }}>
                {pets.map((pet) => {
                  const isExpanded = expandedPetId === pet.id;
                  return (
                    <div
                      key={pet.id}
                      className="item-card"
                      style={{ textAlign: "left", cursor: "pointer" }}
                      onClick={() => setExpandedPetId(isExpanded ? null : pet.id)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="avatar-placeholder">{pet.icon}</span>
                        <strong className="display" style={{ color: "var(--brass-lit)" }}>
                          {pet.name}
                        </strong>
                      </div>
                      {isExpanded && (
                        <>
                          <span style={{ fontSize: "0.9rem", marginTop: 4 }}>{pet.description}</span>
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              buyPet(pet.id);
                            }}
                          >
                            Выбрать
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setStep("platform")}>
            На вокзал Кингс-Кросс
          </button>
        </div>
      </div>
    );
  }

  if (step === "platform") {
    return (
      <div className="app-shell">
        <div className="parchment-card question-card">
          <h1 style={{ marginTop: 0 }}>Платформа 9¾</h1>
          <p>
            {character.name} проходит сквозь незаметный барьер между платформами девять и десять — и оказывается
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
        {!event && <div className="panel question-card">Поезд отправляется...</div>}
        {event && (
          <EventPanel
            event={event}
            spellTemplates={spellTemplates}
            onResolved={(updated) => {
              setCharacter(updated);
              setStep("arrival");
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="parchment-card question-card">
        <h1 style={{ marginTop: 0 }}>Прибытие в Хогвартс</h1>
        <p>
          Поезд останавливается на маленькой станции Хогсмид. Великан-лесничий машет фонарём и зовёт первокурсников
          к лодкам. Через озеро, в темноте, впереди медленно вырастает громада замка — тысячи освещённых окон,
          башни, шпили.
        </p>
        <p>У ворот Большого зала первокурсников уже ждёт Распределяющая шляпа.</p>
        <button className="btn btn-primary" onClick={() => onDone(character)}>
          Войти в Большой зал
        </button>
      </div>
    </div>
  );
}
