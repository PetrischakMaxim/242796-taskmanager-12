
import TaskView from "./components/task/task.js";
import TaskEditView from "./components/task/task-edit.js";
import PageMenuView from "./components/page-menu/page-menu.js";
import LoadMoreButtonView from "./components/load-more-button/load-more-button.js";
import TaskBoardView from "./components/task/task-board.js";
import TaskListView from "./components/task/task-list.js";
import SortView from "./components/sort/sort.js";
import FilterView from "./components/filter/filter.js";

import {generateTask} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

import {render, RenderPosition} from "./utils.js";

const {AFTERBEGIN, BEFOREEND} = RenderPosition;
const TASK_CARD_COUNT = 12;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const {length: taskLength} = tasks;
const filters = generateFilters(tasks);

const pageMainElement = document.querySelector(`.main`);
const pageHeaderElement = pageMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceTaskState = (oldElement, newElement) => {
    taskListElement.replaceChild(oldElement.getElement(), newElement.getElement());
  };

  taskComponent.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      replaceTaskState(taskEditComponent, taskComponent);
    });

  taskEditComponent.getElement()
    .querySelector(`form`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceTaskState(taskComponent, taskEditComponent);
    });

  render(taskListElement, taskComponent.getElement(), BEFOREEND);
};

render(pageHeaderElement, new PageMenuView().getElement(), BEFOREEND);
render(pageMainElement, new FilterView(filters).getElement(), BEFOREEND);

const boardComponent = new TaskBoardView();
render(pageMainElement, boardComponent.getElement(), BEFOREEND);
render(boardComponent.getElement(), new SortView().getElement(), AFTERBEGIN);

const taskListComponent = new TaskListView();
render(boardComponent.getElement(), taskListComponent.getElement(), BEFOREEND);

for (let i = 0; i < Math.min(taskLength, TASK_COUNT_PER_STEP); i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

if (taskLength > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  const loadMoreButtonComponent = new LoadMoreButtonView();

  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) =>renderTask(taskListComponent.getElement(), task));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= taskLength) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
}

