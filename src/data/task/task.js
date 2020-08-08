import {isTaskExpired, isTaskRepeating} from "../../utils.js";

const getIsNotArchiveTasks = (tasks) => tasks.filter((task) => !task.isArchive);

export const taskToFilterMap = {
  all: (tasks) => getIsNotArchiveTasks(tasks).length,
  overdue: (tasks) => getIsNotArchiveTasks(tasks).filter((task) => isTaskExpired(task.dueDate)).length,
  favorites: (tasks) => getIsNotArchiveTasks(tasks).filter((task) => task.isFavorite).length,
  repeating: (tasks) => getIsNotArchiveTasks(tasks).filter((task) => isTaskRepeating(task.repeating)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length,
};

