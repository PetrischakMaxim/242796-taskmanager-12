import {createPageMenuTemplate} from "./view/page-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskBoardTemplate} from "./view/task-board.js";
import {createTaskCardTemplate} from "./view/card.js";
import {createTaskEditCardTemplate} from "./view/card-edit.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const TASK_CARD_COUNT = 12;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const {length: tasksLenght} = tasks;
const editTaskTemplate = tasks[0];
const filters = generateFilter(tasks);

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageMainElement = document.querySelector(`.main`);
const pageHeaderElement = pageMainElement.querySelector(`.main__control`);

renderTemplate(pageHeaderElement, createPageMenuTemplate(), `beforeend`);
renderTemplate(pageMainElement, createFilterTemplate(filters), `beforeend`);
renderTemplate(pageMainElement, createTaskBoardTemplate(), `beforeend`);

const taskBoardElement = pageMainElement.querySelector(`.board`);
const taskListElement = taskBoardElement.querySelector(`.board__tasks`);

renderTemplate(taskListElement, createTaskEditCardTemplate(editTaskTemplate), `beforeend`);

for (let i = 1; i < Math.min(tasksLenght, TASK_COUNT_PER_STEP); i++) {
  renderTemplate(taskListElement, createTaskCardTemplate(tasks[i]), `beforeend`);
}

if (tasksLenght > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  renderTemplate(taskBoardElement, createLoadMoreButtonTemplate(), `beforeend`);

  const loadMoreButton = taskBoardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks
      .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => renderTemplate(taskListElement, createTaskCardTemplate(task), `beforeend`));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasksLenght) {
      loadMoreButton.remove();
    }
  });
}

