import TaskView from "./components/task/task.js";
import TaskEditView from "./components/task/task-edit.js";
import MenuView from "./components/menu/menu.js";
import LoadMoreButtonView from "./components/load-more-button/load-more-button.js";
import TaskBoardView from "./components/task/task-board.js";
import TaskListView from "./components/task/task-list.js";
import NoTaskView from "./components/task/no-task.js";
import SortView from "./components/sort/sort.js";
import FilterView from "./components/filter/filter.js";

import {generateTask} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

import {render} from "./utils/dom-utils.js";

const TASK_CARD_COUNT = 12;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const tasksAmount = tasks.length;
const filters = generateFilters(tasks);

const pageMainElement = document.querySelector(`.main`);
const pageHeaderElement = pageMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceTaskState = (newElement, oldElement) => {
    taskListElement.replaceChild(newElement.getElement(), oldElement.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceTaskState(taskComponent, taskEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      replaceTaskState(taskEditComponent, taskComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEditComponent.getElement()
    .querySelector(`form`)
    .addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceTaskState(taskComponent, taskEditComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  render(taskListElement, taskComponent.getElement());
};

render(pageHeaderElement, new MenuView().getElement());
render(pageMainElement, new FilterView(filters).getElement());

const boardComponent = new TaskBoardView();
render(pageMainElement, boardComponent.getElement());

if (tasks.every((task) => task.isArchive)) {
  render(boardComponent.getElement(), new NoTaskView().getElement());
} else {
  render(boardComponent.getElement(), new SortView().getElement());

  const taskListComponent = new TaskListView();
  render(boardComponent.getElement(), taskListComponent.getElement());

  for (let i = 0; i < Math.min(tasksAmount, TASK_COUNT_PER_STEP); i++) {
    renderTask(taskListComponent.getElement(), tasks[i]);
  }

  if (tasksAmount > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.getElement()
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();
        tasks
          .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
          .forEach((task) => renderTask(taskListComponent.getElement(), task));

        renderedTaskCount += TASK_COUNT_PER_STEP;
        if (renderedTaskCount >= tasksAmount) {
          loadMoreButtonComponent.getElement().remove();
          loadMoreButtonComponent.removeElement();
        }
      });
  }
}
