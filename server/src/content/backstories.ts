import type { Backstory } from "./types.js";

export const backstories: Backstory[] = [
  {
    id: "muggleborn",
    title: "Маглорождённый",
    description:
      "Ты вырос среди маглов и узнал о волшебном мире только из письма с зелёной печатью. Всё здесь для тебя ново и удивительно.",
    icon: "✉️",
    startingMoney: 15,
    statBonus: { intellect: 8, charm: 3 },
  },
  {
    id: "pureblood",
    title: "Чистокровный аристократ",
    description:
      "Твоя семья веками училась в Хогвартсе. Фамильное имя открывает многие двери, но и накладывает свои обязательства.",
    icon: "🏛️",
    startingMoney: 45,
    statBonus: { ambition: 10, charm: 2 },
  },
  {
    id: "halfblood",
    title: "Полукровка из скромной семьи",
    description:
      "Один из родителей — волшебник, другой — магл. Ты вырос на историях о Хогвартсе, но без особого достатка.",
    icon: "🏠",
    startingMoney: 25,
    statBonus: { loyalty: 6, intellect: 3 },
  },
  {
    id: "orphan",
    title: "Сирота на попечении родственников-маглов",
    description:
      "Ты почти ничего не знал о своих родителях и вырос в доме, где магию не любили. Хогвартс — первый шанс стать собой.",
    icon: "🌧️",
    startingMoney: 10,
    statBonus: { courage: 10 },
  },
  {
    id: "mystery-heritage",
    title: "Наследник забытого рода",
    description:
      "Фамилия твоей семьи когда-то гремела в волшебном мире, но давно исчезла из хроник. Никто не знает, что с ней случилось.",
    icon: "🗝️",
    startingMoney: 20,
    statBonus: { ambition: 6, intellect: 5 },
  },
  {
    id: "shopkeepers",
    title: "Ребёнок лавочников Косого переулка",
    description:
      "Ты вырос между витрин и прилавков волшебных лавок, знаешь цену каждой вещи и умеешь находить общий язык с кем угодно.",
    icon: "🛒",
    startingMoney: 30,
    statBonus: { charm: 8, loyalty: 2 },
  },
  {
    id: "traveling-family",
    title: "Ребёнок странствующих волшебников",
    description:
      "Твоя семья почти не задерживалась на одном месте — ярмарки, фестивали, случайные заработки. Ты привык быстро осваиваться где угодно.",
    icon: "🎪",
    startingMoney: 18,
    statBonus: { charm: 5, courage: 4 },
  },
  {
    id: "healer-family",
    title: "Из семьи потомственных целителей",
    description:
      "Родители работали в больнице Св. Мунго, и ты с детства знаешь, как выглядят последствия неудачных заклинаний. Осторожность у тебя в крови.",
    icon: "🩹",
    startingMoney: 22,
    statBonus: { intellect: 5, loyalty: 4 },
  },
  {
    id: "quidditch-family",
    title: "Из семьи профессиональных игроков в квиддич",
    description:
      "Дома только и разговоров, что о прошлых матчах и составах команд. Метлу ты держал в руках раньше, чем волшебную палочку.",
    icon: "🧹",
    startingMoney: 20,
    statBonus: { courage: 6, charm: 3 },
  },
  {
    id: "runaway",
    title: "Беглец из строгой волшебной семьи",
    description:
      "Дома от тебя ждали одного — а ты давно решил идти своим путём. Хогвартс для тебя не только учёба, но и первая настоящая свобода.",
    icon: "🌙",
    startingMoney: 14,
    statBonus: { ambition: 5, courage: 4 },
  },
];
