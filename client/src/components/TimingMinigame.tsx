import { useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  description: string;
  actionLabel: string;
  onResult: (success: boolean) => void;
}

const TARGET_START = 58;
const TARGET_END = 80;
const SPEED_PERCENT_PER_SECOND = 70;

export function TimingMinigame({ title, description, actionLabel, onResult }: Props) {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef(0);
  const dirRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const [done, setDone] = useState<boolean | null>(null);

  useEffect(() => {
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
  }, []);

  const handleStop = () => {
    if (done !== null) return;
    const pos = posRef.current;
    const success = pos >= TARGET_START && pos <= TARGET_END;
    setDone(success);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    onResult(success);
  };

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>{title}</strong> — {description}
      </p>
      <div className="timing-track">
        <div className="timing-target" style={{ left: `${TARGET_START}%`, width: `${TARGET_END - TARGET_START}%` }} />
        <div className="timing-marker" ref={markerRef} />
      </div>
      <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={handleStop} disabled={done !== null}>
        {actionLabel}
      </button>
      {done !== null && (
        <p style={{ marginTop: 10, fontWeight: 600 }}>
          {done ? "Точное попадание!" : "Момент был выбран не лучшим образом..."}
        </p>
      )}
    </div>
  );
}
