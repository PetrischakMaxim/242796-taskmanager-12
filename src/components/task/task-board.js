import AbstractView from "../abstract.js";

const createTaskBoardTemplate = () => `<section class="board container"></section>`;

export default class Board extends AbstractView {

  getTemplate() {
    return createTaskBoardTemplate();
  }

}
