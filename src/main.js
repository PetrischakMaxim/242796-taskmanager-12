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

import {render, replace, remove, RenderPosition} from "./utils/dom-utils.js";

const TASK_CARD_COUNT = 12;
const TASK_COUNT_PER_STEP = 8;


const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToForm = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new TaskBoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent);
  render(boardComponent, taskListComponent);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTaskView(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(boardComponent, new SortView(), RenderPosition.AFTERBEGIN);

  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreButtonComponent = new LoadMoreButtonView();

    render(boardComponent, loadMoreButtonComponent);

    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

renderBoard(siteMainElement, tasks);

render(siteHeaderElement, new MenuView());
render(siteMainElement, new FilterView(filters));
