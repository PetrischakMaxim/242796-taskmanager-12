import {
  createFilterTemplate,
  createTaskCardTemplate,
  createTaskEditCardTemplate} from "./components/index.js";

import PageMenuView from "./components/page-menu/page-menu.js";
import LoadMoreButtonView from "./components/load-more-button/load-more-button.js";
import TaskBoardView from "./components/task-board/task-board.js";

import {generateTask} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_CARD_COUNT = 12;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const {length: taskLength} = tasks;
const editTaskTemplate = tasks[0];
const filters = generateFilters(tasks);

const pageMainElement = document.querySelector(`.main`);
const pageHeaderElement = pageMainElement.querySelector(`.main__control`);

renderElement(pageHeaderElement, new PageMenuView().getElement(), BEFOREEND);
renderTemplate(pageMainElement, createFilterTemplate(filters), `beforeend`);
renderElement(pageMainElement, new TaskBoardView().getElement(), BEFOREEND);

const taskBoardElement = pageMainElement.querySelector(`.board`);
const taskListElement = taskBoardElement.querySelector(`.board__tasks`);

renderTemplate(taskListElement, createTaskEditCardTemplate(editTaskTemplate), `beforeend`);

for (let i = 1; i < Math.min(taskLength, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(taskListElement, createTaskCardTemplate(tasks[i]), `beforeend`);
}

if (taskLength > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  renderElement(taskBoardElement, new LoadMoreButtonView().getElement(), BEFOREEND);

  const loadMoreButton = taskBoardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(taskListElement, createTaskCardTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= taskLength) {
      loadMoreButton.remove();
    }
  });
}

