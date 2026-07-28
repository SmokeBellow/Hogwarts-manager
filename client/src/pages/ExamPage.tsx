import { useEffect, useState } from "react";
import type { ExamQuestion, Subject } from "../types";
import { api } from "../api";

interface Props {
  subjects: Subject[];
  onFinished: (results: any[], character: any) => void;
}

export function ExamPage({ subjects, onFinished }: Props) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getExamQuestions().then((res) => setQuestions(res.questions));
  }, []);

  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  const submit = async () => {
    setLoading(true);
    try {
      const list = Object.entries(answers).map(([questionId, optionIndex]) => ({ questionId, optionIndex }));
      const res = await api.submitExam(list);
      onFinished(res.results, res.character);
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="app-shell">
      <div className="parchment-card">
        <h1>Экзамены за первый курс</h1>
        <p>Вспомни всё, что успел изучить в библиотеке и на уроках в течение года.</p>
        {questions.map((q) => (
          <div key={q.id} style={{ marginTop: 20 }}>
            <span className="pill">{subjectName(q.subject)}</span>
            <h3 style={{ margin: "8px 0" }}>{q.question}</h3>
            <div className="choice-list">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  className="choice-btn"
                  style={{
                    border: answers[q.id] === idx ? "2px solid var(--brass-lit)" : undefined,
                  }}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 24 }} disabled={!allAnswered || loading} onClick={submit}>
          Сдать экзамены
        </button>
      </div>
    </div>
  );
}
