import { SPAN } from "../utils/constants";
class Cell {
  constructor({ x, y, isActive = true, value = "" }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.isActive = isActive;
    this.value = value;
    this.finalValue = null;
    this.displayNumber = 0;
    this.cellHasFocus = false;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  setValue(value = "") {
    this.value = value;
    this.update();
  }

  clear() {
    this.value = "";
    this.isActive = true;
    this.displayNumber = null;
    this.finalValue = null;
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
    this.finalValue = this.value ? "LIVE" : "DEAD";
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
}

export default class Grid {
  constructor({ crossSpan = SPAN, downSpan = SPAN } = {}) {
    this.crossSpan = crossSpan;
    this.downSpan = downSpan;
    this.cellsArray = [];
    this.wordsAcross = {};
    this.wordsDown = {};
    this.cellWithFocus = null;

    for (let y = 0; y < crossSpan; y++) {
      for (let x = 0; x < downSpan; x++) {
        const cell = new Cell({
          x,
          y,
          isActive: true,
        });

        this.cellsArray.push(cell);
        this.cellsObject[`${cell.id}`] = cell;
      }
    }

    return this;
  }

  cellsObject = {};

  finalizeAnswers() {
    this.cellsArray.forEach((cell) => {
      cell.setFinalValue();
    });
  }

  clear() {
    this.cellsArray.forEach((cell) => {
      cell.clear();
    });
  }

  setCellWithFocus(id) {
    if (this.cellWithFocus) {
      this.cellWithFocus.disableFocus();
    }
    this.cellWithFocus = this.cellsObject[id];
    this.cellWithFocus.enableFocus();
  }
}
