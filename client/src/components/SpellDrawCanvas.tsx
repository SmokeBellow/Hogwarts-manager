import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SpellTemplate } from "../types";

interface Point {
  x: number;
  y: number;
}

function resampleToDirections(points: Point[], segments: number): Point[] {
  if (points.length < 2) return [];
  // total path length
  let total = 0;
  const dists: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    total += d;
    dists.push(total);
  }
  if (total === 0) return [];

  const step = total / segments;
  const sampled: Point[] = [];
  let seg = 0;
  for (let s = 0; s <= segments; s++) {
    const target = s * step;
    while (seg < dists.length - 2 && dists[seg + 1] < target) seg++;
    const segStart = dists[seg];
    const segEnd = dists[seg + 1] || segStart + 1e-6;
    const t = (target - segStart) / (segEnd - segStart || 1);
    const p0 = points[seg];
    const p1 = points[seg + 1] || p0;
    sampled.push({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t });
  }

  const directions: Point[] = [];
  for (let i = 1; i < sampled.length; i++) {
    const dx = sampled[i].x - sampled[i - 1].x;
    const dy = sampled[i].y - sampled[i - 1].y;
    const len = Math.hypot(dx, dy) || 1;
    directions.push({ x: dx / len, y: dy / len });
  }
  return directions;
}

function matchScore(drawn: Point[], template: Point[]): number {
  if (drawn.length === 0) return 0;
  const resampled = resampleToDirections(drawn, template.length);
  if (resampled.length !== template.length) return 0;
  let dot = 0;
  for (let i = 0; i < template.length; i++) {
    const t = template[i];
    const tLen = Math.hypot(t.x, t.y) || 1;
    const tx = t.x / tLen;
    const ty = t.y / tLen;
    dot += resampled[i].x * tx + resampled[i].y * ty;
  }
  return dot / template.length; // -1..1
}

interface Props {
  spell: SpellTemplate;
  onResult: (success: boolean) => void;
}

export function SpellDrawCanvas({ spell, onResult }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const drawingRef = useRef(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const getCanvasPoint = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    // The canvas's CSS size can be smaller than its internal pixel
    // resolution on narrow screens, so pointer coordinates must be
    // rescaled into canvas space rather than used as-is.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (attempted) return;
    drawingRef.current = true;
    pointsRef.current = [getCanvasPoint(e)];
    clearCanvas();
    setResultText(null);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || attempted) return;
    const point = getCanvasPoint(e);
    pointsRef.current.push(point);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#caa24a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "#f4d06f";
    ctx.shadowBlur = 8;
    const pts = pointsRef.current;
    if (pts.length < 2) return;
    const prev = pts[pts.length - 2];
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    if (!drawingRef.current || attempted) return;
    drawingRef.current = false;
    const score = matchScore(pointsRef.current, spell.directions);
    const success = score > 0.45;
    setAttempted(true);
    setResultText(
      success
        ? "Заклинание сработало! Палочка откликнулась точно на движение."
        : "Движение получилось смазанным — заклинание не сработало как надо."
    );
    onResult(success);
  };

  const reset = () => {
    pointsRef.current = [];
    setAttempted(false);
    setResultText(null);
    clearCanvas();
  };

  return (
    <div>
      <p style={{ marginBottom: 10 }}>
        <strong>{spell.name}</strong> — {spell.description}
      </p>
      <canvas
        ref={canvasRef}
        width={420}
        height={280}
        className="spell-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <p className="text-muted" style={{ marginTop: 8, fontSize: "0.9rem" }}>
        Проведи пальцем или мышью по холсту, повторяя движение палочки для этого заклинания.
      </p>
      {resultText && (
        <p style={{ marginTop: 8, fontWeight: 600 }} className={attempted ? "" : ""}>
          {resultText}
        </p>
      )}
      {attempted && (
        <button className="btn" onClick={reset} style={{ marginTop: 8 }}>
          Повторить попытку
        </button>
      )}
    </div>
  );
}
