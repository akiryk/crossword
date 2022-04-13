import { SPAN, GO_TOP_TO_BOTTOM, GO_LEFT_TO_RIGHT } from "../utils/constants";
class Cell {
  constructor({ x, y, isActive = true, value = "", gridParent }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.isActive = isActive;
    this.value = value;
    this.displayState = null;
    this.displayNumber = 0;
    this.cellHasFocus = false;
    this.gridParent = gridParent;
    this.isInSelectedRowOrColumn = false;
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
    this.displayState = null;
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
    this.displayState = this.value ? "LIVE" : "DEAD";
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
    this.startCellsWordsAcross = [];
    this.startCellsWordsDown = [];
    this.cellWithFocus = null;
    this.gridDirection = GO_LEFT_TO_RIGHT;
    this.highlightedCells = [];
    this.currentRow = -1;
    this.currentColumn = -1;

    for (let y = 0; y < crossSpan; y++) {
      for (let x = 0; x < downSpan; x++) {
        const cell = new Cell({
          x,
          y,
          isActive: true,
          gridParent: this,
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

  highlightDirection({ x, y }) {
    if (
      (this.gridDirection === GO_LEFT_TO_RIGHT && y === this.currentRow) ||
      (this.gridDirection === GO_TOP_TO_BOTTOM && x === this.currentColumn)
    ) {
      return;
    }
    // we need to change our highlighted cells, so reset the existing ones
    while (this.highlightedCells.length) {
      this.highlightedCells.pop().toggleIsInSelectedRowOrColumn(false);
    }

    this.currentRow = y;
    this.currentColumn = x;
    let cell;
    for (let i = 0; i < 15; i++) {
      if (this.gridDirection === GO_LEFT_TO_RIGHT) {
        cell = this.cellsObject[`${i}:${y}`];
      } else if (this.gridDirection === GO_TOP_TO_BOTTOM) {
        cell = this.cellsObject[`${x}:${i}`];
      }
      cell.toggleIsInSelectedRowOrColumn(true);
      this.highlightedCells.push(cell);
    }

    // this.highlightedCells =
    //   this.gridDirection === GO_LEFT_TO_RIGHT
    //     ? this.cellsArray.filter(filterByRow)
    //     : this.cellsArray.filter(filterByColumn);

    // oldHighlightedCells.forEach((cell) =>
    //   cell.toggleIsInSelectedRowOrColumn(false)
    // );

    // this.highlightedCells.forEach((cell) =>
    //   cell.toggleIsInSelectedRowOrColumn(true)
    // );
  }
}
