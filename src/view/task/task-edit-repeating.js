export const createTaskEditRepeatingTemplate = (repeating, isRepeating) => {
  return `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? `yes` : `no`}</span>
  </button>
  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join(``)}
    </div>
  </fieldset>` : ``}`;
};
