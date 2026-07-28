import { useEffect, useRef, useState } from "react";

const ROUNDS = 3;
const ACTIVE_WINDOW_MS = 650;

export function ChaserComboMinigame({ onResult }: { onResult: (success: boolean) => void }) {
  const [round, setRound] = useState(0);
  const [active, setActive] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState<boolean | null>(null);
  const resolvedRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (round >= ROUNDS) return;
    const delay = 400 + Math.random() * 900;
    const showTimer = window.setTimeout(() => {
      setActive(true);
      hideTimerRef.current = window.setTimeout(() => {
        setActive(false);
        setResults((r) => [...r, false]);
        setRound((r) => r + 1);
      }, ACTIVE_WINDOW_MS);
    }, delay);
    return () => {
      clearTimeout(showTimer);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [round]);

  useEffect(() => {
    if (round >= ROUNDS && !resolvedRef.current) {
      resolvedRef.current = true;
      const success = results.filter(Boolean).length >= 2;
      setDone(success);
      onResult(success);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, results]);

  const handleTap = () => {
    if (!active) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setActive(false);
    setResults((r) => [...r, true]);
    setRound((r) => r + 1);
  };

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>Быстрые пасы</strong> — жми «Пасовать!», как только партнёр откроется, три раза подряд.
      </p>
      <div className="combo-row">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <span key={i} className={`combo-dot ${results[i] === true ? "hit" : results[i] === false ? "miss" : ""}`} />
        ))}
      </div>
      <button
        className={`btn btn-primary combo-btn ${active ? "active" : ""}`}
        onClick={handleTap}
        disabled={done !== null || !active}
      >
        Пасовать!
      </button>
      {done !== null && (
        <p style={{ marginTop: 10, fontWeight: 600 }}>{done ? "Слаженная атака — гол!" : "Пас не дошёл вовремя..."}</p>
      )}
    </div>
  );
}
