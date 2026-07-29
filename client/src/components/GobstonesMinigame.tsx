import { useEffect, useRef, useState } from "react";

type Stage = "aiming" | "rolling" | "opponent" | "done";
type Tier = "perfect" | "partial" | "miss";

const OUTER_START = 45;
const OUTER_END = 92;
const INNER_START = 62;
const INNER_END = 74;
const SPEED_PERCENT_PER_SECOND = 70;
const ROLL_DURATION_MS = 850;

function tierAt(pos: number): Tier {
  if (pos >= INNER_START && pos <= INNER_END) return "perfect";
  if (pos >= OUTER_START && pos <= OUTER_END) return "partial";
  return "miss";
}

const TIER_TEXT: Record<Tier, string> = {
  perfect: "Идеальный бросок — камень лёг точно в центр зоны!",
  partial: "Неплохой бросок — камень зацепил зону, но не в яблочко.",
  miss: "Камень прокатился мимо зоны.",
};

export function GobstonesMinigame({ onResult }: { onResult: (success: boolean) => void }) {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const [stage, setStage] = useState<Stage>("aiming");
  const [tier, setTier] = useState<Tier | null>(null);
  const [stonePos, setStonePos] = useState(-8);
  const [opponentPos, setOpponentPos] = useState(108);

  useEffect(() => {
    if (stage !== "aiming") return;
    let last = performance.now();
    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      posRef.current += dirRef.current * SPEED_PERCENT_PER_SECOND * dt;
      if (posRef.current >= 100) {
        posRef.current = 100;
        dirRef.current = -1;
      } else if (posRef.current <= 0) {
        posRef.current = 0;
        dirRef.current = 1;
      }
      if (markerRef.current) markerRef.current.style.left = `${posRef.current}%`;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  const throwStone = () => {
    if (stage !== "aiming") return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const pos = posRef.current;
    setTier(tierAt(pos));
    setStage("rolling");
    requestAnimationFrame(() => requestAnimationFrame(() => setStonePos(pos)));
  };

  useEffect(() => {
    if (stage !== "rolling") return;
    const timer = window.setTimeout(() => {
      setStage("opponent");
      const rivalLanding = 15 + Math.random() * 70;
      requestAnimationFrame(() => requestAnimationFrame(() => setOpponentPos(rivalLanding)));
    }, ROLL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "opponent") return;
    const timer = window.setTimeout(() => {
      setStage("done");
      onResult(tier !== "miss");
    }, ROLL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stage, tier, onResult]);

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>Точный бросок</strong> — маленькая зона в центре даёт идеальное попадание, зона пошире вокруг неё —
        частичное.
      </p>
      <div className="gobstones-track">
        <div
          className="gobstones-zone-partial"
          style={{ left: `${OUTER_START}%`, width: `${OUTER_END - OUTER_START}%` }}
        />
        <div
          className="gobstones-zone-perfect"
          style={{ left: `${INNER_START}%`, width: `${INNER_END - INNER_START}%` }}
        />
        {stage === "aiming" && <div className="timing-marker" ref={markerRef} />}
        {stage !== "aiming" && (
          <div className={`gobstone gobstone-mine tier-${tier}`} style={{ left: `${stonePos}%` }} />
        )}
        {(stage === "opponent" || stage === "done") && (
          <div className="gobstone gobstone-rival" style={{ left: `${opponentPos}%` }} />
        )}
      </div>
      {stage === "aiming" && (
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={throwStone}>
          Бросить!
        </button>
      )}
      {stage === "rolling" && (
        <p className="text-muted" style={{ marginTop: 14 }}>
          Камень катится...
        </p>
      )}
      {stage === "opponent" && (
        <p className="text-muted" style={{ marginTop: 14 }}>
          Ход соперника...
        </p>
      )}
      {stage === "done" && tier && <p style={{ marginTop: 14, fontWeight: 600 }}>{TIER_TEXT[tier]}</p>}
    </div>
  );
}
