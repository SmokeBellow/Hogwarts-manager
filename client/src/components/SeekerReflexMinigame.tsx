import { useEffect, useRef, useState } from "react";

const VISIBLE_MS = 700;

export function SeekerReflexMinigame({ onResult }: { onResult: (success: boolean) => void }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState<boolean | null>(null);
  const resolvedRef = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const delay = 600 + Math.random() * 1400;
    const appearTimer = window.setTimeout(() => {
      const x = 10 + Math.random() * 80;
      const y = 15 + Math.random() * 70;
      setPos({ x, y });
      const hideTimer = window.setTimeout(() => {
        setPos(null);
        finish(false);
      }, VISIBLE_MS);
      timers.current.push(hideTimer);
    }, delay);
    timers.current.push(appearTimer);
    return () => {
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = (success: boolean) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    timers.current.forEach(clearTimeout);
    setDone(success);
    onResult(success);
  };

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>Погоня за снитчем</strong> — снитч мелькнёт на поле лишь на мгновение, лови его вовремя.
      </p>
      <div className="reflex-field">
        {pos && (
          <button
            className="reflex-target"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => finish(true)}
            aria-label="Снитч"
          />
        )}
      </div>
      {done !== null && (
        <p style={{ marginTop: 10, fontWeight: 600 }}>{done ? "Снитч в руке — матч окончен!" : "Снитч ускользнул..."}</p>
      )}
    </div>
  );
}
