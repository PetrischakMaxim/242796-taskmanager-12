import {
  createFilterTemplate,
  createTaskCardTemplate,
  createTaskEditCardTemplate} from "./components/index.js";

import PageMenuView from "./components/page-menu/page-menu.js";
import LoadMoreButtonView from "./components/load-more-button/load-more-button.js";
import TaskBoardView from "./components/task/task-board.js";
import TaskListView from "./components/task/task-list.js";
import SortView from "./components/sort/sort.js";

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
renderTemplate(pageMainElement, createFilterTemplate(filters), BEFOREEND);

const boardComponent = new TaskBoardView();
renderElement(pageMainElement, boardComponent.getElement(), BEFOREEND);
renderElement(boardComponent.getElement(), new SortView().getElement(), AFTERBEGIN);

const taskListComponent = new TaskListView();
renderElement(boardComponent.getElement(), taskListComponent.getElement(), BEFOREEND);
renderTemplate(taskListComponent.getElement(), createTaskEditCardTemplate(editTaskTemplate), BEFOREEND);

for (let i = 1; i < Math.min(taskLength, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(taskListComponent.getElement(), createTaskCardTemplate(tasks[i]), BEFOREEND);
}

if (taskLength > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  const loadMoreButtonComponent = new LoadMoreButtonView();

  renderElement(boardComponent.getElement(), loadMoreButtonComponent.getElement(), BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(taskListComponent.getElement(), createTaskCardTemplate(task), BEFOREEND));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= taskLength) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}

