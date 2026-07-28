const TOKEN_KEY = "hogwarts_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Что-то пошло не так");
  }
  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string }>("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  login: (email: string, password: string) =>
    request<{ token: string }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getStatic: () => request<any>("/game/static"),
  getCharacter: () => request<{ character: any }>("/game/character"),
  createCharacter: (name: string, backstoryId: string) =>
    request<{ character: any }>("/game/character", { method: "POST", body: JSON.stringify({ name, backstoryId }) }),
  getSortingQuestions: () => request<{ questions: any[] }>("/game/sorting/questions"),
  submitSorting: (answers: { questionId: string; optionId: string }[]) =>
    request<{ house: string; character: any }>("/game/sorting/submit", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  getCurrentEvent: () => request<{ event: any | null }>("/game/event/current"),
  resolveEvent: (eventId: string, choiceId: string, challengeSuccess?: boolean) =>
    request<{ isBad: boolean; outcomeText: string; character: any }>("/game/event/resolve", {
      method: "POST",
      body: JSON.stringify({ eventId, choiceId, challengeSuccess }),
    }),
  advanceWeek: () => request<{ character: any }>("/game/week/advance", { method: "POST" }),
  leaveClub: (clubId: string) =>
    request<{ character: any }>("/game/clubs/leave", { method: "POST", body: JSON.stringify({ clubId }) }),
  setQuidditchPosition: (position: string) =>
    request<{ character: any }>("/game/clubs/quidditch-position", {
      method: "POST",
      body: JSON.stringify({ position }),
    }),
  buyPet: (petId: string) =>
    request<{ character: any }>("/game/pets/buy", { method: "POST", body: JSON.stringify({ petId }) }),
  getExamQuestions: () => request<{ questions: any[] }>("/game/exam/questions"),
  submitExam: (answers: { questionId: string; optionIndex: number }[]) =>
    request<{ results: any[]; character: any }>("/game/exam/submit", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  getExamResults: () => request<{ results: any[] }>("/game/exam/results"),
  advanceYear: () => request<{ character: any }>("/game/year/advance", { method: "POST" }),
  study: (topicId: string) =>
    request<{ studiedTopics: string[] }>("/game/study", { method: "POST", body: JSON.stringify({ topicId }) }),
};
