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
    prompt: "Распределяющая шляпа спрашивает: что для тебя важнее всего в трудную минуту?",
    options: [
      { id: "a", text: "Не отступать, что бы ни случилось", housePoints: { Gryffindor: 3 } },
      { id: "b", text: "Найти самый разумный выход из ситуации", housePoints: { Ravenclaw: 3 } },
      { id: "c", text: "Не бросать тех, кто рядом", housePoints: { Hufflepuff: 3 } },
      { id: "d", text: "Использовать любую возможность, чтобы победить", housePoints: { Slytherin: 3 } },
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
    prompt: "Выбери подсвечник, который ты бы хотел получить в подарок.",
    options: [
      { id: "a", text: "Тяжёлый, кованый, в виде вставшего на дыбы льва", housePoints: { Gryffindor: 2 } },
      { id: "b", text: "Тонкий, посеребрённый, в виде змеи", housePoints: { Slytherin: 2 } },
      { id: "c", text: "Старинный, с гравировкой ворона и лунными фазами", housePoints: { Ravenclaw: 2 } },
      { id: "d", text: "Простой, тёплый на ощупь, сделанный вручную", housePoints: { Hufflepuff: 2 } },
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
    prompt: "Какой урок в Хогвартсе звучит для тебя привлекательнее всего?",
    options: [
      { id: "a", text: "Защита от Тёмных искусств", housePoints: { Gryffindor: 2 } },
      { id: "b", text: "Древние руны и нумерология", housePoints: { Ravenclaw: 2 } },
      { id: "c", text: "Уход за магическими существами", housePoints: { Hufflepuff: 2 } },
      { id: "d", text: "Зельеварение", housePoints: { Slytherin: 2 } },
    ],
  },
];
