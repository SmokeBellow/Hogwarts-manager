import type { SortingQuestion } from "./types.js";

export const sortingQuestions: SortingQuestion[] = [
  {
    id: "q1",
    prompt: "В коридоре ты видишь запертую дверь с табличкой «Коридор третьего этажа закрыт для всех, кто не хочет умереть мучительной смертью». Что ты сделаешь?",
    options: [
      { id: "a", text: "Всё равно загляну внутрь — любопытство сильнее страха", housePoints: { Gryffindor: 2, Ravenclaw: 1 } },
      { id: "b", text: "Пройду мимо, но запомню это место — вдруг пригодится", housePoints: { Slytherin: 2 } },
      { id: "c", text: "Сразу сообщу старосте или преподавателю", housePoints: { Hufflepuff: 2 } },
      { id: "d", text: "Попробую понять, что за заклинание держит дверь", housePoints: { Ravenclaw: 2 } },
    ],
  },
  {
    id: "q2",
    prompt: "Однокурсник попросил списать домашнюю работу перед уроком. Как ты поступишь?",
    options: [
      { id: "a", text: "Дам списать — друзья важнее правил", housePoints: { Hufflepuff: 2 } },
      { id: "b", text: "Откажу, но предложу вместе быстро разобрать тему", housePoints: { Ravenclaw: 1, Gryffindor: 1 } },
      { id: "c", text: "Дам списать в обмен на услугу", housePoints: { Slytherin: 2 } },
      { id: "d", text: "Откажу — каждый должен справляться сам", housePoints: { Slytherin: 1, Ravenclaw: 1 } },
    ],
  },
  {
    id: "q3",
    prompt: "До экзамена остался ровно час, а ты понимаешь, что не успеваешь повторить и половины материала. Что делаешь?",
    options: [
      { id: "a", text: "Сажусь и учу дальше по порядку — как получится, так получится", housePoints: { Hufflepuff: 2, Gryffindor: 1 } },
      { id: "b", text: "Быстро прикидываю, какие темы дадут больше всего баллов, и учу только их", housePoints: { Slytherin: 2, Ravenclaw: 1 } },
      { id: "c", text: "Пытаюсь вспомнить логику предмета целиком, а не зубрить детали", housePoints: { Ravenclaw: 2 } },
      { id: "d", text: "Иду искать того, кто может объяснить всё за пять минут", housePoints: { Gryffindor: 2 } },
    ],
  },
  {
    id: "q4",
    prompt: "Тебе достался волшебный артефакт неизвестного назначения. Твои действия?",
    options: [
      { id: "a", text: "Сразу опробую его на себе", housePoints: { Gryffindor: 2 } },
      { id: "b", text: "Изучу все известные книги о похожих артефактах", housePoints: { Ravenclaw: 2 } },
      { id: "c", text: "Подумаю, как извлечь из находки наибольшую пользу", housePoints: { Slytherin: 2 } },
      { id: "d", text: "Отдам эксперту, чтобы никто не пострадал", housePoints: { Hufflepuff: 2 } },
    ],
  },
  {
    id: "q5",
    prompt: "На день рождения тебе разрешили выбрать один подарок. На чём остановишься?",
    options: [
      { id: "a", text: "На вещи, сделанной специально для тебя чьими-то руками", housePoints: { Hufflepuff: 2 } },
      { id: "b", text: "На чём-то редком и дорогом, что заметят все вокруг", housePoints: { Slytherin: 2 } },
      { id: "c", text: "На книге о том, чего пока никто толком не изучил", housePoints: { Ravenclaw: 2 } },
      { id: "d", text: "На чём-то, что можно опробовать в деле прямо сейчас", housePoints: { Gryffindor: 2 } },
    ],
  },
  {
    id: "q6",
    prompt: "Ты нашёл кошелёк с деньгами без имени владельца. Что сделаешь?",
    options: [
      { id: "a", text: "Отнесу декану факультета — пусть найдут хозяина", housePoints: { Hufflepuff: 2 } },
      { id: "b", text: "Оставлю себе — находка есть находка", housePoints: { Slytherin: 2 } },
      { id: "c", text: "Попробую вычислить владельца по содержимому кошелька", housePoints: { Ravenclaw: 2 } },
      { id: "d", text: "Расспрошу всех вокруг в открытую, не боясь показаться навязчивым", housePoints: { Gryffindor: 2 } },
    ],
  },
  {
    id: "q7",
    prompt: "Свободный вечер без домашних заданий — редкость. Как ты его проведёшь?",
    options: [
      { id: "a", text: "Тайком потренируюсь в том, что пока не очень получается", housePoints: { Gryffindor: 2 } },
      { id: "b", text: "Засяду за головоломку или книгу, пока никто не отвлекает", housePoints: { Ravenclaw: 2 } },
      { id: "c", text: "Соберусь с друзьями у камина просто поболтать", housePoints: { Hufflepuff: 2 } },
      { id: "d", text: "Придумаю, как обойти правило, которое давно мешает", housePoints: { Slytherin: 2 } },
    ],
  },
];
