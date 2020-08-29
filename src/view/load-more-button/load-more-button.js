import AbstractView from "../abstract.js";

const createLoadMoreButtonTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreButton extends AbstractView {
  constructor() {
    super();

    this._onClick = null;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  setClickHandler(callback) {
    this._onClick = callback;
    this.getElement()
      .addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._onClick();
  }

}
