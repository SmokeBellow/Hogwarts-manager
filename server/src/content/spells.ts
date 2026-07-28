import type { SpellTemplate } from "./types.js";

// Direction vectors describe the shape of the wand movement, in canvas
// coordinates where +x is right and +y is DOWN (so "up" is y: -1).
// The recognizer resamples the drawn stroke to the same number of
// segments and compares direction similarity via averaged dot product.
// lumos, wingardium, alohomora and expelliarmus are hand-drawn reference
// gestures recorded with the spell-recorder tool.
export const spellTemplates: SpellTemplate[] = [
  {
    id: "lumos",
    name: "Люмос",
    description: "Прямой, ровный взмах строго вверх — почти без отклонений в стороны.",
    directions: [
      { x: 0.047, y: -0.999 },
      { x: -0.011, y: -1 },
      { x: -0.09, y: -0.996 },
      { x: -0.098, y: -0.995 },
      { x: -0.013, y: -1 },
      { x: 0.118, y: -0.993 },
    ],
  },
  {
    id: "wingardium",
    name: "Вингардиум Левиоса",
    description:
      "Волнистый росчерк вправо, а затем резкий рывок влево и вниз — свободное, петляющее движение вместо простого свиша с щелчком.",
    directions: [
      { x: 0.66, y: -0.751 },
      { x: 0.944, y: 0.331 },
      { x: 0.657, y: 0.754 },
      { x: 0.93, y: -0.366 },
      { x: 0.61, y: -0.792 },
      { x: -0.966, y: 0.259 },
      { x: -0.011, y: 1 },
      { x: 0.102, y: 0.995 },
    ],
  },
  {
    id: "alohomora",
    name: "Алохомора",
    description: "Полный круг палочкой по часовой стрелке, а в конце — короткий росчерк вниз, будто дёргаешь провёрнутый ключ.",
    directions: [
      { x: 0.993, y: 0.115 },
      { x: 0.346, y: 0.938 },
      { x: -0.064, y: 0.998 },
      { x: -0.834, y: 0.552 },
      { x: -0.999, y: 0.047 },
      { x: -0.829, y: -0.559 },
      { x: -0.2, y: -0.98 },
      { x: 0.471, y: -0.882 },
      { x: 0.989, y: -0.15 },
      { x: -0.051, y: 0.999 },
      { x: 0.031, y: 1 },
      { x: 0.112, y: 0.994 },
    ],
  },
  {
    // TODO: placeholder gesture reused from the old Ridiculus shape —
    // replace with a hand-drawn Reparo reference from the recorder tool.
    id: "reparo",
    name: "Репаро",
    description: "Зигзагообразное, почти шутливое движение палочкой — будто скрепляешь разлетевшиеся осколки воедино.",
    directions: [
      { x: 1, y: -0.4 },
      { x: -1, y: -0.4 },
      { x: 1, y: -0.4 },
    ],
  },
  {
    id: "expelliarmus",
    name: "Экспеллиармус",
    description: "Резкий росчерк вправо, переходящий в крутой рывок вниз — короткое хлёсткое движение, а не ровная диагональ.",
    directions: [
      { x: 1, y: -0.016 },
      { x: 1, y: -0.016 },
      { x: 0.993, y: -0.119 },
      { x: 0.603, y: 0.798 },
      { x: -0.046, y: 0.999 },
      { x: -0.001, y: 1 },
    ],
  },
];
