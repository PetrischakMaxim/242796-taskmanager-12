import TaskBoardView from "../view/task/task-board.js";
import TaskListView from "../view/task/task-list.js";
import NoTaskView from "../view/task/no-task.js";
import TaskPresenter from "./task.js";
import SortView from "../view/sort/sort.js";
import LoadMoreButtonView from "../view/load-more-button/load-more-button.js";

import {sortTaskUp, sortTaskDown, updateItem} from "../utils/utils.js";
import {render, RenderPosition, remove} from "../utils/dom-utils.js";
import {TASK_COUNT_PER_STEP, SortType} from '../const.js';

export default class Board {

  constructor(boardContainer, tasksModel) {
    this._tasksModel = tasksModel;
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currenSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardView = new TaskBoardView();
    this._sortView = new SortView();
    this._taskListView = new TaskListView();
    this._noTaskView = new NoTaskView();
    this._loadMoreButtonView = new LoadMoreButtonView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._boardContainer, this._boardView);
    render(this._boardView, this._taskListView);

    this._renderBoard();
  }

  _getTasks() {
    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return [...this._tasksModel.getTasks()].sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return [...this._tasksModel.getTasks()].sort(sortTaskDown);
    }
    return this._tasksModel.getTasks();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }


  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSort() {
    render(this._boardView, this._sortView, RenderPosition.AFTERBEGIN);
    this._sortView.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _clearTaskList() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListView, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardView, this._noTaskView, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedTaskCount = Math.min(taskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedTaskCount, newRenderedTaskCount);

    this._renderTasks(tasks);
    this._renderedTaskCount = newRenderedTaskCount;

    if (this._renderedTaskCount >= taskCount) {
      remove(this._loadMoreButtonView);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardView, this._loadMoreButtonView);
    this._loadMoreButtonView.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderTaskList() {
    const taskCount = this._getTasks().length;
    const tasks = this._getTasks().slice(0, Math.min(taskCount, TASK_COUNT_PER_STEP));

    this._renderTasks(tasks);

    if (taskCount > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._getTasks().every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
