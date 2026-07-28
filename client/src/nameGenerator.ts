// Original fantasy-style names — deliberately not drawn from the Harry
// Potter universe, just names that sound at home in a wizarding school.
const FIRST_NAMES = [
  "Оливия",
  "Тесса",
  "Айрис",
  "Лира",
  "Астра",
  "Мирабель",
  "Идалия",
  "Вильгельмина",
  "Роксана",
  "Селеста",
  "Верена",
  "Эвелина",
  "Имоджен",
  "Магнус",
  "Корвин",
  "Освальд",
  "Финн",
  "Тобиас",
  "Гидеон",
  "Демьян",
  "Северин",
  "Айден",
  "Лоренс",
  "Барнаби",
  "Джаспер",
  "Эдвин",
  "Роуэн",
  "Кассий",
];

// Generic British surnames — not drawn from the Harry Potter universe.
const SURNAMES = [
  "Смит",
  "Тёрнер",
  "Беннетт",
  "Уитмор",
  "Эшфорд",
  "Пембертон",
  "Кэмпбелл",
  "Хардинг",
  "Уинтерс",
  "Морган",
  "Флетчер",
  "Стэнфорд",
  "Бэрроу",
  "Донован",
  "Кольер",
  "Эддингтон",
  "Прайс",
  "Синклер",
  "Хейз",
  "Бромли",
  "Каннингем",
  "Лэнгфорд",
  "Эллиот",
  "Гарднер",
  "Мэннинг",
  "Пирсон",
  "Стоукс",
  "Уолш",
  "Йейтс",
  "Хоторн",
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateRandomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(SURNAMES)}`;
}
