import { useEffect, useRef, useState } from "react";
import type { QuidditchPosition } from "../types";
import { KeeperRingsMinigame } from "./KeeperRingsMinigame";
import { SeekerReflexMinigame } from "./SeekerReflexMinigame";
import { ChaserComboMinigame } from "./ChaserComboMinigame";
import { TimingMinigame } from "./TimingMinigame";

interface TickEvent {
  text: string;
  scorer: "mine" | "rival" | null;
}

const TICK_POOL: TickEvent[] = [
  { text: "Охотник факультета проносится сквозь защиту и забивает — квоффл в кольце!", scorer: "mine" },
  { text: "Соперники перехватывают квоффл и сокращают отставание метким броском.", scorer: "rival" },
  { text: "Загонщик отбивает бладжер прямо у виска соперника — трибуны ахают.", scorer: null },
  { text: "Ловец соперников на миг замечает золотой отблеск — но тот тут же исчезает из виду.", scorer: null },
  { text: "Комментатор выкрикивает счёт в мегафон — напряжение на трибунах растёт.", scorer: null },
  { text: "Твоя команда выстраивает красивую комбинацию и забивает ещё раз!", scorer: "mine" },
  { text: "Вратарь соперников с трудом успевает отбить летящий квоффл в последний миг.", scorer: null },
  { text: "Бладжер сбивает с метлы охотника соперника — тому нужна секунда, чтобы прийти в себя.", scorer: null },
  { text: "Соперники выравнивают счёт метким броском в верхнее кольцо.", scorer: "rival" },
  { text: "Трибуны факультета дружно скандируют кричалку в поддержку команды.", scorer: null },
  { text: "Резкий вираж — твоя команда уходит от столкновения на волосок.", scorer: null },
  { text: "Соперники разыгрывают красивую комбинацию и забивают.", scorer: "rival" },
];

function pickTicks(count: number): TickEvent[] {
  const pool = [...TICK_POOL];
  const picked: TickEvent[] = [];
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

function randInt(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

type Step =
  | { kind: "tick"; event: TickEvent }
  | { kind: "role" }
  | { kind: "resolution-seeker" }
  | { kind: "resolution-other" };

function buildSteps(position: QuidditchPosition | null): Step[] {
  if (position === "seeker") {
    return [
      ...pickTicks(randInt(4, 6)).map((event) => ({ kind: "tick" as const, event })),
      { kind: "resolution-seeker" as const },
    ];
  }
  return [
    ...pickTicks(randInt(2, 3)).map((event) => ({ kind: "tick" as const, event })),
    { kind: "role" as const },
    ...pickTicks(randInt(1, 3)).map((event) => ({ kind: "tick" as const, event })),
    { kind: "resolution-other" as const },
  ];
}

export function QuidditchMatchScene({
  position,
  onResult,
}: {
  position: QuidditchPosition | null;
  onResult: (success: boolean) => void;
}) {
  const [steps] = useState<Step[]>(() => buildSteps(position));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ mine: 0, rival: 0 });
  const [roleSuccess, setRoleSuccess] = useState<boolean | null>(null);
  const [resolutionPhase, setResolutionPhase] = useState<"waiting" | "revealed">("waiting");
  const [caught, setCaught] = useState<boolean | null>(null);
  const resolvedRef = useRef(false);

  const step = steps[index];

  const advanceTick = (event: TickEvent) => {
    if (event.scorer) {
      const key = event.scorer;
      setScore((s) => ({ ...s, [key]: s[key] + 10 }));
    }
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (!step || step.kind !== "resolution-other" || resolutionPhase !== "waiting") return;
    const catchChance = Math.max(0.15, Math.min(0.85, 0.5 + (roleSuccess ? 0.12 : -0.12)));
    const timer = window.setTimeout(() => {
      const won = Math.random() < catchChance;
      setCaught(won);
      setResolutionPhase("revealed");
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        onResult(won);
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [step, resolutionPhase, roleSuccess, onResult]);

  if (!step) return null;

  const scoreBoard = (
    <p className="match-score">
      {score.mine} : {score.rival}
    </p>
  );

  if (step.kind === "tick") {
    return (
      <div>
        {scoreBoard}
        <p style={{ marginBottom: 14 }}>{step.event.text}</p>
        <button className="btn btn-primary" onClick={() => advanceTick(step.event)}>
          Далее
        </button>
      </div>
    );
  }

  if (step.kind === "role") {
    const handleRoleResult = (success: boolean) => setRoleSuccess(success);
    return (
      <div>
        {scoreBoard}
        {position === "keeper" && <KeeperRingsMinigame onResult={handleRoleResult} />}
        {position === "chaser" && <ChaserComboMinigame onResult={handleRoleResult} />}
        {position === "beater" && (
          <TimingMinigame
            title="Отбить бладжер"
            description="Дождись, когда бладжер окажется в зоне удара, и бей точно в этот миг."
            actionLabel="Отбить!"
            onResult={handleRoleResult}
          />
        )}
        {roleSuccess !== null && (
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => setIndex((i) => i + 1)}>
            Далее
          </button>
        )}
      </div>
    );
  }

  if (step.kind === "resolution-seeker") {
    const handleCatch = (success: boolean) => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        onResult(success);
      }
    };
    return (
      <div>
        {scoreBoard}
        <p className="text-muted" style={{ marginBottom: 10 }}>
          Пора действовать — где-то рядом мелькнул снитч.
        </p>
        <SeekerReflexMinigame onResult={handleCatch} />
      </div>
    );
  }

  return (
    <div>
      {scoreBoard}
      {resolutionPhase === "waiting" && (
        <p className="text-muted">Оба ловца кружат высоко над полем в поисках золотого снитча...</p>
      )}
      {resolutionPhase === "revealed" && (
        <p style={{ fontWeight: 600 }}>
          {caught
            ? "Твой ловец резким рывком ныряет вниз и выхватывает снитч из воздуха — матч окончен!"
            : "Ловец соперников замечает золотой отблеск первым и выхватывает снитч — матч завершён не в вашу пользу."}
        </p>
      )}
    </div>
  );
}
