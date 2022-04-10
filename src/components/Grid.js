import { SPAN } from "../utils/constants";
class Cell {
  constructor({ x, y, isActive = true, value = "" }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.isActive = isActive;
    this.value = value;
    this.displayNumber = 0;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  setValue(value = "") {
    this.value = value;
  }

  clear() {
    this.value = "";
    this.isActive = true;
    this.displayNumber = null;
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
}

export default class Grid {
  constructor({ crossSpan = SPAN, downSpan = SPAN } = {}) {
    this.crossSpan = crossSpan;
    this.downSpan = downSpan;
    this.cellsArray = [];
    this.wordsAcross = {};
    this.wordsDown = {};
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

  clear() {
    this.cellsArray.forEach((cell) => {
      cell.clear();
    });
  }
}
