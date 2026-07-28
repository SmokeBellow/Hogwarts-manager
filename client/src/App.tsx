import { useEffect, useState } from "react";
import "./App.css";
import { useAuth } from "./AuthContext";
import { useScrollTop } from "./useScrollTop";
import { api } from "./api";
import { AuthPage } from "./pages/AuthPage";
import { CreateCharacterPage } from "./pages/CreateCharacterPage";
import { IntroPage } from "./pages/IntroPage";
import { SortingPage } from "./pages/SortingPage";
import { GamePage } from "./pages/GamePage";
import { ExamPage } from "./pages/ExamPage";
import { ResultsPage } from "./pages/ResultsPage";
import type { Character, ExamResult } from "./types";

interface StaticData {
  backstories: any[];
  subjects: any[];
  clubs: any[];
  pets: any[];
  spellTemplates: any[];
  lectureTopics: any[];
}

function App() {
  const { token } = useAuth();
  const [staticData, setStaticData] = useState<StaticData | null>(null);
  const [character, setCharacter] = useState<Character | null | undefined>(undefined);
  const [justSortedHouse, setJustSortedHouse] = useState<string | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[] | null>(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.getStatic(), api.getCharacter()]).then(([staticRes, charRes]) => {
      setStaticData(staticRes);
      setCharacter(charRes.character);
    });
  }, [token]);

  useEffect(() => {
    if (character?.id && character.phase === "sorting") {
      setIntroDone(sessionStorage.getItem(`hogwarts_intro_done_${character.id}`) === "1");
    }
  }, [character?.id, character?.phase]);

  useEffect(() => {
    if (character?.phase === "results" && !examResults) {
      api.getExamResults().then((res) =>
        setExamResults(
          res.results.map((r: any) => ({ subject: r.subject, score: r.score, gradeLetter: r.grade_letter }))
        )
      );
    }
  }, [character?.phase, examResults]);

  useScrollTop(token, character === undefined, !character, !!justSortedHouse, character?.phase, introDone);

  if (!token) return <AuthPage />;

  if (!staticData || character === undefined) {
    return <div className="center-screen">Загружаем магический мир...</div>;
  }

  if (!character) {
    return <CreateCharacterPage backstories={staticData.backstories} onCreated={setCharacter} />;
  }

  if (justSortedHouse && character.house) {
    return (
      <div className="center-screen">
        <div className="parchment-card" style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <h1>Добро пожаловать в {justSortedHouse}!</h1>
          <p>Распределяющая шляпа приняла решение. Отныне это твой дом на все годы в Хогвартсе.</p>
          <button className="btn btn-primary" onClick={() => setJustSortedHouse(null)}>
            Начать обучение
          </button>
        </div>
      </div>
    );
  }

  if (character.phase === "sorting") {
    if (!introDone) {
      return (
        <IntroPage
          character={character}
          pets={staticData.pets}
          spellTemplates={staticData.spellTemplates}
          onDone={(char) => {
            setCharacter(char);
            sessionStorage.setItem(`hogwarts_intro_done_${character.id}`, "1");
            setIntroDone(true);
          }}
        />
      );
    }
    return (
      <SortingPage
        onSorted={(house, char) => {
          setCharacter(char);
          setJustSortedHouse(house);
        }}
      />
    );
  }

  if (character.phase === "year") {
    return (
      <GamePage
        character={character}
        subjects={staticData.subjects}
        clubs={staticData.clubs}
        pets={staticData.pets}
        lectureTopics={staticData.lectureTopics}
        spellTemplates={staticData.spellTemplates}
        onCharacterUpdate={setCharacter}
        onExamPhase={setCharacter}
      />
    );
  }

  if (character.phase === "exam") {
    return (
      <ExamPage
        subjects={staticData.subjects}
        onFinished={(results, char) => {
          setExamResults(results);
          setCharacter(char);
        }}
      />
    );
  }

  if (character.phase === "results") {
    if (!examResults) {
      return <div className="center-screen">Подводим итоги года...</div>;
    }
    return <ResultsPage results={examResults} character={character} subjects={staticData.subjects} />;
  }

  return <div className="center-screen">Хогвартс готовится к новому дню...</div>;
}

export default App;
