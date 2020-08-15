import {createElement} from "../../utils.js";

const createTaskBoardTemplate = () => `<section class="board container"></section>`;

export default class Board {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskBoardTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
