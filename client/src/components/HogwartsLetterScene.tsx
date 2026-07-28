import { useEffect, useState } from "react";

type Stage = "arriving" | "landed" | "opening" | "unfurling" | "open";

function isLikelyFeminineName(fullName: string): boolean {
  const firstName = fullName.trim().split(/\s+/)[0] ?? "";
  return /[ая]$/i.test(firstName);
}

export function HogwartsLetterScene({ name, onContinue }: { name: string; onContinue: () => void }) {
  const [stage, setStage] = useState<Stage>("arriving");

  useEffect(() => {
    if (stage !== "arriving") return;
    const t = window.setTimeout(() => setStage("landed"), 1300);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "opening") return;
    const t = window.setTimeout(() => setStage("unfurling"), 650);
    return () => clearTimeout(t);
  }, [stage]);

  useEffect(() => {
    if (stage !== "unfurling") return;
    const t = window.setTimeout(() => setStage("open"), 750);
    return () => clearTimeout(t);
  }, [stage]);

  const openLetter = () => {
    if (stage === "landed") setStage("opening");
  };

  const feminine = isLikelyFeminineName(name);

  return (
    <div className={`letter-scene stage-${stage}`}>
      {stage !== "open" && (
        <div className="letter-scene-inner">
          <h1 style={{ marginTop: 0 }}>{stage === "arriving" ? "Сова в пути..." : "Письмо из Хогвартса"}</h1>

          {(stage === "arriving" || stage === "landed") && <span className="courier-owl">🦉</span>}

          <button
            className={`hogwarts-envelope ${stage !== "landed" ? "not-clickable" : ""}`}
            onClick={openLetter}
            aria-disabled={stage !== "landed"}
            aria-label="Открыть письмо"
          >
            <span className="envelope-back" />
            <span className="folded-letter" />
            <span className="envelope-flap" />
            <span className="envelope-seal">H</span>
          </button>

          {stage === "landed" && (
            <p className="text-muted" style={{ marginTop: 14 }}>
              Нажми на письмо, чтобы его открыть
            </p>
          )}
        </div>
      )}

      {stage === "open" && (
        <div className="letter-reveal">
          <h1 style={{ marginTop: 0 }}>Школа чародейства и волшебства «Хогвартс»</h1>
          <div style={{ textAlign: "left" }}>
            <p className="text-muted" style={{ marginBottom: 4 }}>
              Директор: Альбус Дамблдор
              <br />
              <span style={{ fontSize: "0.82rem" }}>
                (Кавалер ордена Мерлина I степени, Верховный чародей Визенгамота, Президент Международной
                конфедерации магов)
              </span>
            </p>
            <p>
              Дорог{feminine ? "ая" : "ой"} {name.trim()}!
            </p>
            <p>
              Сообщаем, что тебе предоставлено место в Школе чародейства и волшебства «Хогвартс». Пожалуйста,
              ознакомься с приложенным списком необходимых учебников и снаряжения.
            </p>
            <p>Занятия начинаются первого сентября. Ждём твою сову не позднее тридцать первого июля.</p>
            <p>
              Искренне твоя,
              <br />
              Минерва МакГонагалл,
              <br />
              заместитель директора
            </p>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={onContinue}>
            Читать дальше
          </button>
        </div>
      )}
    </div>
  );
}
