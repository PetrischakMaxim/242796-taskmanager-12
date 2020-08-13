export const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

export const TASK_DESCRIPTIONS = [
  `Изучить теорию`,
  `Посмотреть лекцию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

export const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};
