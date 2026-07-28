import type { Backstory } from "./types.js";

export const backstories: Backstory[] = [
  {
    id: "muggleborn",
    title: "Маглорождённый",
    description:
      "Ты вырос среди маглов и узнал о волшебном мире только из письма с зелёной печатью. Всё здесь для тебя ново и удивительно.",
    icon: "✉️",
    statBonus: { intellect: 8, charm: 3 },
  },
  {
    id: "pureblood",
    title: "Чистокровный аристократ",
    description:
      "Твоя семья веками училась в Хогвартсе. Фамильное имя открывает многие двери, но и накладывает свои обязательства.",
    icon: "🏛️",
    statBonus: { ambition: 10, charm: 2 },
    gradeBonus: { history: 10 },
  },
  {
    id: "halfblood",
    title: "Полукровка из скромной семьи",
    description:
      "Один из родителей — волшебник, другой — магл. Ты вырос на историях о Хогвартсе, но без особого достатка.",
    icon: "🏠",
    statBonus: { loyalty: 6, intellect: 3 },
    gradeBonus: { potions: 5 },
  },
  {
    id: "orphan",
    title: "Сирота на попечении родственников-маглов",
    description:
      "Ты почти ничего не знал о своих родителях и вырос в доме, где магию не любили. Хогвартс — первый шанс стать собой.",
    icon: "🌧️",
    statBonus: { courage: 10 },
  },
  {
    id: "mystery-heritage",
    title: "Наследник забытого рода",
    description:
      "Фамилия твоей семьи когда-то гремела в волшебном мире, но давно исчезла из хроник. Никто не знает, что с ней случилось.",
    icon: "🗝️",
    statBonus: { ambition: 6, intellect: 5 },
    gradeBonus: { transfiguration: 6, history: 4 },
  },
  {
    id: "shopkeepers",
    title: "Ребёнок лавочников Косого переулка",
    description:
      "Ты вырос между витрин и прилавков волшебных лавок, знаешь цену каждой вещи и умеешь находить общий язык с кем угодно.",
    icon: "🛒",
    statBonus: { charm: 8, loyalty: 2 },
    gradeBonus: { herbology: 5, potions: 4 },
  },
  {
    id: "traveling-family",
    title: "Ребёнок странствующих волшебников",
    description:
      "Твоя семья почти не задерживалась на одном месте — ярмарки, фестивали, случайные заработки. Ты привык быстро осваиваться где угодно.",
    icon: "🎪",
    statBonus: { charm: 5, courage: 4 },
    gradeBonus: { charms: 6 },
  },
  {
    id: "healer-family",
    title: "Из семьи потомственных целителей",
    description:
      "Родители работали в больнице Св. Мунго, и ты с детства знаешь, как выглядят последствия неудачных заклинаний. Осторожность у тебя в крови.",
    icon: "🩹",
    statBonus: { intellect: 5, loyalty: 4 },
    gradeBonus: { potions: 8 },
  },
  {
    id: "quidditch-family",
    title: "Из семьи профессиональных игроков в квиддич",
    description:
      "Дома только и разговоров, что о прошлых матчах и составах команд. Метлу ты держал в руках раньше, чем волшебную палочку.",
    icon: "🧹",
    statBonus: { courage: 6, charm: 3 },
    gradeBonus: { astronomy: 4 },
  },
  {
    id: "runaway",
    title: "Беглец из строгой волшебной семьи",
    description:
      "Дома от тебя ждали одного — а ты давно решил идти своим путём. Хогвартс для тебя не только учёба, но и первая настоящая свобода.",
    icon: "🌙",
    statBonus: { ambition: 5, courage: 4 },
    gradeBonus: { dada: 6 },
  },
];
