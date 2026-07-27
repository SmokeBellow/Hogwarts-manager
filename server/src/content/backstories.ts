import type { Backstory } from "./types.js";

export const backstories: Backstory[] = [
  {
    id: "muggleborn",
    title: "Маглорождённый",
    description:
      "Ты вырос среди маглов и узнал о волшебном мире только из письма с зелёной печатью. Всё здесь для тебя ново и удивительно.",
    startingMoney: 15,
    statBonus: { intellect: 8, charm: 3 },
  },
  {
    id: "pureblood",
    title: "Чистокровный аристократ",
    description:
      "Твоя семья веками училась в Хогвартсе. Фамильное имя открывает многие двери, но и накладывает свои обязательства.",
    startingMoney: 45,
    statBonus: { ambition: 10, charm: 2 },
  },
  {
    id: "halfblood",
    title: "Полукровка из скромной семьи",
    description:
      "Один из родителей — волшебник, другой — магл. Ты вырос на историях о Хогвартсе, но без особого достатка.",
    startingMoney: 25,
    statBonus: { loyalty: 6, intellect: 3 },
  },
  {
    id: "orphan",
    title: "Сирота на попечении родственников-маглов",
    description:
      "Ты почти ничего не знал о своих родителях и вырос в доме, где магию не любили. Хогвартс — первый шанс стать собой.",
    startingMoney: 10,
    statBonus: { courage: 10 },
  },
  {
    id: "mystery-heritage",
    title: "Наследник забытого рода",
    description:
      "Фамилия твоей семьи когда-то гремела в волшебном мире, но давно исчезла из хроник. Никто не знает, что с ней случилось.",
    startingMoney: 20,
    statBonus: { ambition: 6, intellect: 5 },
  },
  {
    id: "shopkeepers",
    title: "Ребёнок лавочников Косого переулка",
    description:
      "Ты вырос между витрин и прилавков волшебных лавок, знаешь цену каждой вещи и умеешь находить общий язык с кем угодно.",
    startingMoney: 30,
    statBonus: { charm: 8, loyalty: 2 },
  },
];
