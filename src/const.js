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

export const TASK_COUNT_PER_STEP = 8;

export const SortType = {
  DEFAULT: `default`,
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`
};

export const UserAction = {
  UPDATE_TASK: `UPDATE_TASK`,
  ADD_TASK: `ADD_TASK`,
  DELETE_TASK: `DELETE_TASK`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
};
