import { useCallback, useEffect, useState } from "react";
import type { Character, Club, GameEvent, LectureTopic, Pet, SpellTemplate, Subject } from "../types";
import { api } from "../api";
import { useScrollTop } from "../useScrollTop";
import { StatsPanel } from "../components/StatsPanel";
import { ClubsPanel } from "../components/ClubsPanel";
import { PetsPanel } from "../components/PetsPanel";
import { LecturesPanel } from "../components/LecturesPanel";
import { EventPanel } from "../components/EventPanel";

type Tab = "clubs" | "pets" | "lectures";

interface Props {
  character: Character;
  subjects: Subject[];
  clubs: Club[];
  pets: Pet[];
  lectureTopics: LectureTopic[];
  spellTemplates: SpellTemplate[];
  onCharacterUpdate: (c: Character) => void;
  onExamPhase: (c: Character) => void;
}

export function GamePage({
  character,
  subjects,
  clubs,
  pets,
  lectureTopics,
  spellTemplates,
  onCharacterUpdate,
  onExamPhase,
}: Props) {
  const [tab, setTab] = useState<Tab>("clubs");
  const [event, setEvent] = useState<GameEvent | null>(null);
  const [checkingWeek, setCheckingWeek] = useState(true);
  useScrollTop(tab);

  const refreshEvent = useCallback(async () => {
    setCheckingWeek(true);
    let iterations = 0;
    let localCharacter = character;
    while (iterations < 60) {
      iterations += 1;
      const res = await api.getCurrentEvent();
      if (res.event) {
        setEvent(res.event);
        setCheckingWeek(false);
        return;
      }
      const advanced = await api.advanceWeek();
      localCharacter = advanced.character;
      onCharacterUpdate(advanced.character);
      if (advanced.character.phase === "exam") {
        onExamPhase(advanced.character);
        setCheckingWeek(false);
        return;
      }
    }
    setCheckingWeek(false);
    void localCharacter;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refreshEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResolved = (updatedCharacter: Character) => {
    onCharacterUpdate(updatedCharacter);
    if (updatedCharacter.phase === "exam") {
      onExamPhase(updatedCharacter);
      return;
    }
    // Deliberately don't clear `event` here: the EventPanel keeps showing
    // the outcome (via its own state) while refreshEvent fetches the next
    // one in the background, then swaps in place — no blank flash.
    refreshEvent();
  };

  return (
    <div className="app-shell">
      <StatsPanel character={character} subjects={subjects} />

      {event && (
        <div style={{ marginTop: 16 }}>
          <EventPanel key={event.id} event={event} spellTemplates={spellTemplates} onResolved={handleResolved} />
        </div>
      )}
      {!event && checkingWeek && (
        <div className="panel" style={{ marginTop: 16 }}>
          <p className="text-muted" style={{ margin: 0 }}>Проверяем расписание на эту неделю...</p>
        </div>
      )}

      <div className="nav-tabs" style={{ marginTop: 20 }}>
        {(["clubs", "pets", "lectures"] as Tab[]).map((t) => (
          <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "clubs" && "Клубы"}
            {t === "pets" && "Питомцы"}
            {t === "lectures" && "Библиотека"}
          </button>
        ))}
      </div>

      {tab === "clubs" && <ClubsPanel character={character} clubs={clubs} onUpdated={onCharacterUpdate} />}
      {tab === "pets" && <PetsPanel character={character} pets={pets} />}
      {tab === "lectures" && <LecturesPanel topics={lectureTopics} subjects={subjects} />}
    </div>
  );
}
