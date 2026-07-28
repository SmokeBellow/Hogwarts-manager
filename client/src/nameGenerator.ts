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

const SURNAMES = [
  "Морвен",
  "Штормвейл",
  "Гримстоун",
  "Эшдаун",
  "Вересковый",
  "Латунный",
  "Тенистоун",
  "Полынный",
  "Озёрный",
  "Кремневски",
  "Ясенев",
  "Дубровин",
  "Соколинский",
  "Вьюжин",
  "Пепельный",
  "Ночецвет",
  "Огнистый",
  "Туманов",
  "Звёздочёт",
  "Ветрогон",
];

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function generateRandomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(SURNAMES)}`;
}
