import { useEffect, useRef, useState } from "react";

const LIGHT_WINDOW_MS = 850;

export function KeeperRingsMinigame({ onResult }: { onResult: (success: boolean) => void }) {
  const [activeRing, setActiveRing] = useState<number | null>(null);
  const [done, setDone] = useState<boolean | null>(null);
  const resolvedRef = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const delay = 500 + Math.random() * 1300;
    const startTimer = window.setTimeout(() => {
      const ring = Math.floor(Math.random() * 3);
      setActiveRing(ring);
      const expireTimer = window.setTimeout(() => {
        setActiveRing(null);
        finish(false);
      }, LIGHT_WINDOW_MS);
      timers.current.push(expireTimer);
    }, delay);
    timers.current.push(startTimer);
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

  const handleRingClick = (index: number) => {
    if (resolvedRef.current) return;
    finish(activeRing === index);
  };

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>Защита колец</strong> — следи за тремя кольцами и жми на то, что подсветится.
      </p>
      <div className="keeper-rings">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={`keeper-ring ${activeRing === i ? "active" : ""}`}
            onClick={() => handleRingClick(i)}
            disabled={done !== null}
            aria-label={`Кольцо ${i + 1}`}
          />
        ))}
      </div>
      {done !== null && (
        <p style={{ marginTop: 10, fontWeight: 600 }}>{done ? "Блестящий сейв!" : "Мяч пролетел мимо колец..."}</p>
      )}
    </div>
  );
}
