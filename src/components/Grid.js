import { SPAN, GO_TOP_TO_BOTTOM, GO_LEFT_TO_RIGHT } from "../utils/constants";
class Cell {
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

export default class Grid {
  constructor({ crossSpan = SPAN, downSpan = SPAN } = {}) {
    this.crossSpan = crossSpan;
    this.downSpan = downSpan;
    this.cellsArray = [];
    this.cellsObject = {};
    this.startCellsWordsAcross = [];
    this.startCellsWordsDown = [];
    this.cellWithFocus = null;
    this.gridDirection = GO_LEFT_TO_RIGHT;
    this.highlightedCells = [];
    this.currentRow = -1;
    this.currentColumn = -1;
    this.liveCellKeys = [];

    for (let y = 0; y < crossSpan; y++) {
      for (let x = 0; x < downSpan; x++) {
        const cell = new Cell({
          x,
          y,
        });

        this.cellsArray.push(cell);
        this.cellsObject[`${cell.id}`] = cell;
      }
    }

    return this;
  }

  unsetValues() {
    this.cellsArray.forEach((cell) => {
      cell.unsetValue();
    });
  }

  finalizeAnswers() {
    this.cellsArray.forEach((cell) => {
      // Set the cell to white or black, depending on if it has a value
      cell.setFinalValue();
    });
    // reset the currently highlighted row or column
    this.unhighlightCells();
  }

  clear() {
    this.cellsArray.forEach((cell) => {
      this.startCellsWordsAcross = [];
      this.startCellsWordsDown = [];
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

  addAcrossWordStartCell(cell) {
    this.startCellsWordsAcross.push(cell);
  }

  addDownWordStartCell(cell) {
    this.startCellsWordsDown.push(cell);
  }

  toggleGridDirection(cell) {
    this.gridDirection =
      this.gridDirection === GO_LEFT_TO_RIGHT
        ? GO_TOP_TO_BOTTOM
        : GO_LEFT_TO_RIGHT;
    this.currentColumn = -1;
    this.currentRow = -1;
    this.highlightDirection(cell);
  }

  unhighlightCells() {
    while (this.highlightedCells.length) {
      this.highlightedCells.pop().toggleIsInSelectedRowOrColumn(false);
    }
  }

  highlightDirection({ x, y }) {
    if (
      (this.gridDirection === GO_LEFT_TO_RIGHT && y === this.currentRow) ||
      (this.gridDirection === GO_TOP_TO_BOTTOM && x === this.currentColumn)
    ) {
      // user is in the currently highlighted row or column so no need to re-style cells
      return;
    }
    // user is in a different row or column, so de-highlight the existing cells
    this.unhighlightCells();
    this.currentRow = y;
    this.currentColumn = x;
    let cell;
    for (let i = 0; i < SPAN; i++) {
      if (this.gridDirection === GO_LEFT_TO_RIGHT) {
        cell = this.cellsObject[`${i}:${y}`];
      } else if (this.gridDirection === GO_TOP_TO_BOTTOM) {
        cell = this.cellsObject[`${x}:${i}`];
      }
      if (cell.isInPlay) {
        cell.toggleIsInSelectedRowOrColumn(true);
        this.highlightedCells.push(cell);
      } else {
        break;
      }
    }
  }
}
