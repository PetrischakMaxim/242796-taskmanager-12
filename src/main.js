import {createPageMenuTemplate} from "./view/page-menu";
import {createFilterTemplate} from "./view/filter";
import {createTaskBoardTemplate} from "./view/task-board";
import {createTaskCardTemplate} from "./view/card";
import {createTaskEditCardTemplate} from "./view/card-edit";
import {createLoadMoreButtonTemplate} from "./view/load-more-button";

const TASK_CARD_COUNT = 3;

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageMainElement = document.querySelector(`.main`);
const pageHeaderElement = pageMainElement.querySelector(`.main__control`);

renderTemplate(pageHeaderElement, createPageMenuTemplate(), `beforeend`);
renderTemplate(pageMainElement, createFilterTemplate(), `beforeend`);
renderTemplate(pageMainElement, createTaskBoardTemplate(), `beforeend`);

const taskBoardElement = pageMainElement.querySelector(`.board`);
const taskListElement = taskBoardElement.querySelector(`.board__tasks`);

renderTemplate(taskListElement, createTaskEditCardTemplate(), `beforeend`);

for (let i = 0; i < TASK_CARD_COUNT; i++) {
  renderTemplate(taskListElement, createTaskCardTemplate(), `beforeend`);
}

renderTemplate(taskBoardElement, createLoadMoreButtonTemplate(), `beforeend`);
