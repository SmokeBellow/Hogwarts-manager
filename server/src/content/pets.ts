import type { Pet } from "./types.js";

export const pets: Pet[] = [
  {
    id: "owl",
    name: "Сова",
    species: "owl",
    cost: 25,
    weeklyUpkeep: 1,
    description: "Незаменима для переписки с семьёй и друзьями. Поднимает настроение и помогает не терять связи.",
  },
  {
    id: "cat",
    name: "Кошка",
    species: "cat",
    cost: 18,
    weeklyUpkeep: 1,
    description: "Независимая и хитрая, иногда предупреждает о неприятностях раньше, чем ты сам их заметишь.",
  },
  {
    id: "toad",
    name: "Жаба",
    species: "toad",
    cost: 8,
    weeklyUpkeep: 0,
    description: "Недорогой и непритязательный питомец. Одногруппники иногда подшучивают над твоим выбором.",
  },
  {
    id: "rat",
    name: "Крыса",
    species: "rat",
    cost: 6,
    weeklyUpkeep: 0,
    description: "Скромный компаньон, который не займёт много места и не потребует много забот.",
  },
];
