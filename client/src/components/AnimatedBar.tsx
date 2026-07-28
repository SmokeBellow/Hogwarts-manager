import { useEffect, useRef, useState } from "react";

export function AnimatedBar({ value, color, width }: { value: number; color?: string; width?: number }) {
  const prevRef = useRef(value);
  const [pulse, setPulse] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (prevRef.current !== value) {
      setPulse(value > prevRef.current ? "up" : "down");
      const previous = prevRef.current;
      prevRef.current = value;
      void previous;
      const t = setTimeout(() => setPulse(null), 700);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div
      className={`stat-bar-track ${pulse ? `pulse-${pulse}` : ""}`}
      style={width ? { width } : undefined}
    >
      <div className="stat-bar-fill" style={{ width: `${value}%`, ...(color ? { background: color } : {}) }} />
    </div>
  );
}
