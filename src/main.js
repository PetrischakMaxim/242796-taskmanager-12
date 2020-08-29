import MenuView from "./view/menu/menu.js";
import FilterView from "./view/filter/filter.js";

import {generateTask} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import BoardPresenter from "./presenter/board.js";
import {render} from "./utils/dom-utils.js";

const TASK_CARD_COUNT = 20;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const filters = generateFilters(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement);

render(siteHeaderElement, new MenuView());
render(siteMainElement, new FilterView(filters));

boardPresenter.init(tasks);
