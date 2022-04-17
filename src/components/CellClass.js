export default class Cell {
  constructor({ x, y, isInPlay = true, value = "" }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.isInPlay = isInPlay;
    this.value = value;
    this.correctValue = "";
    this.displayNumber = 0;
    this.cellHasFocus = false;
    this.isInSelectedRowOrColumn = false;
  }

  toggleActive() {
    this.isInPlay = !this.isInPlay;
  }

  setValue(value = "") {
    const lastLetter = value.slice(-1).toUpperCase();
    if (lastLetter === this.previousValue) {
      // use the second to last letter if there is one
      this.value = value.slice(-2, -1).toUpperCase() || this.previousValue;
    } else {
      this.value = value.slice(-1).toUpperCase();
    }
    this.previousValue = this.value;
    this.update();
  }

  // unset value without updating. This should be performed once,
  // at the start of creating the player's puzzle
  unsetValue() {
    this.value = "";
  }

  clear() {
    this.value = "";
    this.isInPlay = true;
    this.displayNumber = null;
    this.cellHasFocus = null;
    this.update();
  }

  subscribe(updater) {
    this.updater = updater;
  }

  update() {
    this.updater(this);
  }

  setDisplayNumber(number) {
    this.displayNumber = number;
    this.update();
  }

  setFinalValue() {
    this.isInPlay = !!this.value;
    this.correctValue = this.value;
    this.update();
  }

  enableFocus() {
    this.cellHasFocus = true;
    this.update();
  }

  disableFocus() {
    this.cellHasFocus = false;
    this.update();
  }

  toggleIsInSelectedRowOrColumn(isSelected) {
    this.isInSelectedRowOrColumn = isSelected;
    this.update();
  }
}
