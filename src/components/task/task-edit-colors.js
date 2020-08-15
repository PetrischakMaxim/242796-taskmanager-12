import {COLORS} from "../../const.js";

export const createTaskEditColorsTemplate = (currentColor) => {
  return COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? `checked` : ``}
  />
  <label for="color-${color}" class="card__color card__color--${color}">${color}</label>`).join(``);
};
