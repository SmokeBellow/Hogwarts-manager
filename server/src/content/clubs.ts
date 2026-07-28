import type { Club } from "./types.js";

export const clubs: Club[] = [
  {
    id: "quidditch",
    name: "Квиддичная команда факультета",
    description: "Тренировки трижды в неделю, риск травм, но и шанс стать звездой факультета.",
    icon: "🧹",
    statFocus: ["courage", "charm"],
    minYear: 2,
  },
  {
    id: "gobstones",
    name: "Клуб плюй-камней",
    description: "Спокойный клуб для тех, кто ценит компанию и не любит рисковать.",
    icon: "⚫",
    statFocus: ["loyalty", "charm"],
  },
  {
    id: "dueling",
    name: "Дуэльный клуб",
    description: "Оттачивай реакцию и заклинания в дружеских поединках под присмотром старших студентов.",
    icon: "⚔️",
    statFocus: ["courage", "intellect"],
  },
];
