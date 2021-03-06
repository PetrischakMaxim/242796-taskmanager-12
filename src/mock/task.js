import {COLORS, BLANK_TASK} from "../const.js";
import {TASK_DESCRIPTIONS} from "../const.js";
import {getRandomInteger, generateId, getRandomIndex} from "../utils/utils.js";

const generateDate = () => {

  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();

  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateRepeating = () => {
  return {
    mo: false,
    tu: false,
    we: Boolean(getRandomInteger(0, 1)),
    th: false,
    fr: Boolean(getRandomInteger(0, 1)),
    sa: false,
    su: false
  };
};

export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null
    ? generateRepeating()
    : BLANK_TASK.repeating;

  return {
    id: generateId(),
    description: getRandomIndex(TASK_DESCRIPTIONS),
    dueDate,
    repeating,
    color: getRandomIndex(COLORS),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
