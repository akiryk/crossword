import { SPAN, GO_TOP_TO_BOTTOM, GO_LEFT_TO_RIGHT } from "../utils/constants";
import Cell from "./CellClass";

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
    this.cellRows = [];

    let cells;
    for (let y = 0; y < crossSpan; y++) {
      cells = [];
      for (let x = 0; x < downSpan; x++) {
        const cell = new Cell({
          x,
          y,
        });

        this.cellsArray.push(cell);
        cells.push(cell);
        this.cellsObject[`${cell.id}`] = cell;
      }
      this.cellRows.push(cells);
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
