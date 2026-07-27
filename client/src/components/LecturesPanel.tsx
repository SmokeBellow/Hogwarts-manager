import { useState } from "react";
import type { LectureTopic, Subject } from "../types";
import { api } from "../api";

export function LecturesPanel({ topics, subjects }: { topics: LectureTopic[]; subjects: Subject[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [studied, setStudied] = useState<string[]>([]);

  const open = async (topicId: string) => {
    setOpenId(openId === topicId ? null : topicId);
    if (!studied.includes(topicId)) {
      setStudied((s) => [...s, topicId]);
      api.study(topicId).catch(() => {});
    }
  };

  const subjectName = (id: string) => subjects.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="panel">
      <h2>Библиотека и конспекты</h2>
      <p className="text-muted">
        Читай и запоминай конспекты лекций — на экзаменах в конце года будут вопросы именно по этому материалу, а
        правильный ответ зависит от того, что запомнишь ты сам.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {topics.map((topic) => (
          <div key={topic.id} className="item-card" style={{ gap: 6 }}>
            <button
              onClick={() => open(topic.id)}
              style={{ background: "none", border: "none", color: "inherit", textAlign: "left", padding: 0 }}
            >
              <strong>{topic.title}</strong>{" "}
              <span className="pill">{subjectName(topic.subject)}</span>{" "}
              {studied.includes(topic.id) && <span className="pill">изучено</span>}
            </button>
            {openId === topic.id && <p style={{ marginTop: 6 }}>{topic.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
