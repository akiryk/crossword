import { SPAN } from "../utils/constants";
class Cell {
  constructor({ x, y, top, bottom, isActive = true, value = "" }) {
    this.x = x;
    this.y = y;
    this.id = `${y}:${x}`;
    this.isActive = isActive;
    this.top = top;
    this.bottom = bottom;
    this.value = value;
  }

  setLeftAndRight(left, right) {
    this.left = left;
    this.right = right;
  }

  setIsFirstCellInWord(b = false) {
    this.isFirstCellInWord = b;
  }

  setisLastCellInWord(b = false) {
    this.isLastCellInWord = b;
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
  }
}

export default class Grid {
  constructor({ crossSpan = SPAN, downSpan = SPAN } = {}) {
    this.crossSpan = crossSpan;
    this.downSpan = downSpan;
    this.cells = [];
    for (let y = 0; y < crossSpan; y++) {
      for (let x = 0; x < downSpan; x++) {
        const cell = new Cell({
          x,
          y,
          isActive: true,
        });

        this.cells.push(cell);
        this.gridData[`${x}:${y}`] = cell;
      }
    }

    // loop through all the cells and find first and last letter of each word
    this.cells.forEach((cell) => {
      const left = cell.x > 0 ? this.gridData[`${cell.x - 1}:${cell.y}`] : null;
      const right =
        cell.x < crossSpan - 1
          ? this.gridData[`${cell.x + 1}:${cell.y}`]
          : null;
      cell.setLeftAndRight(left, right);
      const isFirstCellInWord =
        cell.isActive && (cell.left === null || !cell.left.isActive);
      cell.setIsFirstCellInWord(isFirstCellInWord);
      const isLastCellInWord =
        cell.isActive && (cell.right === null || !cell.right.isActive);
      cell.setisLastCellInWord(isLastCellInWord);
    });

    return {
      grid: this,
      gridData: this.gridData,
      cells: this.cells,
    };
  }

  gridData = {};

  clear() {
    this.cells.forEach((cell) => {
      cell.clear();
    });
  }
}
