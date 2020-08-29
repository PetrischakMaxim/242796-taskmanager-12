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

  init(boardTasks) {
    this._boardTasks = [...boardTasks];
    this._sourcedBoardTasks = [...boardTasks];

    render(this._boardContainer, this._boardView);
    render(this._boardView, this._taskListView);

    this._renderBoard();
  }

  _getTasks() {
    return this._tasksModel.getTasks();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = [...this._sourcedBoardTasks];
    }

    this._currenSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currenSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
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

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderNoTasks() {
    render(this._boardView, this._noTaskView, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {

    this._loadMoreButtonView.setClickHandler(() => {
      this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);

      this._renderedTaskCount += TASK_COUNT_PER_STEP;

      if (this._renderedTaskCount >= this._boardTasks.length) {
        remove(this._loadMoreButtonView);
      }
    });
  }

  _renderLoadMoreButton() {
    render(this._boardView, this._loadMoreButtonView);
    this._loadMoreButtonView.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
