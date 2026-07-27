import { useEffect, useState } from "react";
import type { SortingQuestion } from "../types";
import { api } from "../api";

interface Props {
  onSorted: (house: string, character: any) => void;
}

export function SortingPage({ onSorted }: Props) {
  const [questions, setQuestions] = useState<SortingQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSortingQuestions().then((res) => setQuestions(res.questions));
  }, []);

  if (questions.length === 0) {
    return <div className="center-screen">Распределяющая шляпа готовится...</div>;
  }

  const question = questions[step];
  const isLast = step === questions.length - 1;

  const selectOption = async (optionId: string) => {
    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    try {
      const list = Object.entries(newAnswers).map(([questionId, oid]) => ({ questionId, optionId: oid }));
      const res = await api.submitSorting(list);
      onSorted(res.house, res.character);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="parchment-card question-card">
        <h1 style={{ textAlign: "center" }}>Распределяющая шляпа</h1>
        <p className="text-muted" style={{ textAlign: "center", color: "#4a2f10" }}>
          Вопрос {step + 1} из {questions.length}
        </p>
        <h2 style={{ marginTop: 20 }}>{question.prompt}</h2>
        <div className="choice-list">
          {question.options.map((opt) => (
            <button key={opt.id} className="choice-btn" disabled={loading} onClick={() => selectOption(opt.id)}>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
