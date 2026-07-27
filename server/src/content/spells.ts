import type { SpellTemplate } from "./types.js";

// Direction vectors describe the shape of the wand movement, in canvas
// coordinates where +x is right and +y is DOWN (so "up" is y: -1).
// The recognizer resamples the drawn stroke to the same number of
// segments and compares direction similarity via averaged dot product.
export const spellTemplates: SpellTemplate[] = [
  {
    id: "lumos",
    name: "Люмос",
    description: "Короткий уверенный взмах вверх — кончик палочки загорается светом.",
    directions: [
      { x: 0, y: -1 },
      { x: 0, y: -1 },
    ],
  },
  {
    id: "wingardium",
    name: "Вингардиум Левиоса",
    description: "Плавный взмах вправо, а затем чёткий рывок вверх — «свиш и щелчок».",
    directions: [
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ],
  },
  {
    id: "alohomora",
    name: "Алохомора",
    description: "Круговое движение палочкой, будто ты поворачиваешь невидимый ключ.",
    directions: [
      { x: 1, y: 0 },
      { x: 0.7, y: 0.7 },
      { x: 0, y: 1 },
      { x: -0.7, y: 0.7 },
      { x: -1, y: 0 },
      { x: -0.7, y: -0.7 },
      { x: 0, y: -1 },
    ],
  },
  {
    id: "ridiculus",
    name: "Ридикулус",
    description: "Зигзагообразное, почти шутливое движение палочкой — превращает страх в посмешище.",
    directions: [
      { x: 1, y: -0.4 },
      { x: -1, y: -0.4 },
      { x: 1, y: -0.4 },
    ],
  },
  {
    id: "expelliarmus",
    name: "Экспеллиармус",
    description: "Резкий диагональный удар — от нижнего левого угла к верхнему правому.",
    directions: [
      { x: 1, y: -1 },
      { x: 1, y: -1 },
    ],
  },
];
