import type { Club } from "./types.js";

export const clubs: Club[] = [
  {
    id: "quidditch",
    name: "Квиддичная команда факультета",
    description: "Тренировки трижды в неделю, риск травм, но и шанс стать звездой факультета.",
    icon: "🧹",
    weeklyCost: 0,
    statFocus: ["courage", "charm"],
  },
  {
    id: "gobstones",
    name: "Клуб плюй-камней",
    description: "Спокойный клуб для тех, кто ценит компанию и не любит рисковать.",
    icon: "⚫",
    weeklyCost: 1,
    statFocus: ["loyalty", "charm"],
  },
  {
    id: "dueling",
    name: "Дуэльный клуб",
    description: "Оттачивай реакцию и заклинания в дружеских поединках под присмотром старших студентов.",
    icon: "⚔️",
    weeklyCost: 2,
    statFocus: ["courage", "intellect"],
  },
];
