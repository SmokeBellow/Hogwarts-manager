// A pool of classmate names used to fill "{name}" tokens in event text.
// Deliberately generic wizarding-school first names, not drawn from the
// Harry Potter universe. Each entry carries the grammatical case forms
// actually used across event copy, since Russian requires the name to
// decline correctly ("Разговорить Розалинду", not "Разговорить Розалинда").
export interface NpcName {
  gender: "m" | "f";
  nominative: string;
  genitive: string;
  accusative: string;
  instrumental: string;
}

export const npcNames: NpcName[] = [
  { gender: "f", nominative: "Розалинда", genitive: "Розалинды", accusative: "Розалинду", instrumental: "Розалиндой" },
  { gender: "f", nominative: "Беатриса", genitive: "Беатрисы", accusative: "Беатрису", instrumental: "Беатрисой" },
  { gender: "f", nominative: "Хелена", genitive: "Хелены", accusative: "Хелену", instrumental: "Хеленой" },
  { gender: "f", nominative: "Миранда", genitive: "Миранды", accusative: "Миранду", instrumental: "Мирандой" },
  { gender: "f", nominative: "Флора", genitive: "Флоры", accusative: "Флору", instrumental: "Флорой" },
  { gender: "f", nominative: "Айла", genitive: "Айлы", accusative: "Айлу", instrumental: "Айлой" },
  { gender: "f", nominative: "Октавия", genitive: "Октавии", accusative: "Октавию", instrumental: "Октавией" },
  { gender: "f", nominative: "Розамунда", genitive: "Розамунды", accusative: "Розамунду", instrumental: "Розамундой" },
  { gender: "m", nominative: "Финеас", genitive: "Финеаса", accusative: "Финеаса", instrumental: "Финеасом" },
  { gender: "m", nominative: "Джаспер", genitive: "Джаспера", accusative: "Джаспера", instrumental: "Джаспером" },
  { gender: "m", nominative: "Кассиан", genitive: "Кассиана", accusative: "Кассиана", instrumental: "Кассианом" },
  { gender: "m", nominative: "Эмброуз", genitive: "Эмброуза", accusative: "Эмброуза", instrumental: "Эмброузом" },
  { gender: "m", nominative: "Теодор", genitive: "Теодора", accusative: "Теодора", instrumental: "Теодором" },
  { gender: "m", nominative: "Персиваль", genitive: "Персиваля", accusative: "Персиваля", instrumental: "Персивалем" },
  { gender: "m", nominative: "Оуэн", genitive: "Оуэна", accusative: "Оуэна", instrumental: "Оуэном" },
  { gender: "m", nominative: "Себастьян", genitive: "Себастьяна", accusative: "Себастьяна", instrumental: "Себастьяном" },
];
