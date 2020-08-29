import MenuView from "./view/menu/menu.js";
import FilterView from "./view/filter/filter.js";
import {generateTask} from "./mock/task.js";
import BoardPresenter from "./presenter/board.js";
import TasksModel from "./model/tasks.js";
import FilterModel from "./model/filter.js";
import {render} from "./utils/dom-utils.js";

const TASK_CARD_COUNT = 20;

const tasks = new Array(TASK_CARD_COUNT).fill().map(generateTask);
const filters = [
  {
    type: `all`,
    name: `ALL`,
    count: 0
  }
];

const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(siteMainElement, tasksModel);

render(siteHeaderElement, new MenuView());
render(siteMainElement, new FilterView(filters, `all`));

boardPresenter.init();
