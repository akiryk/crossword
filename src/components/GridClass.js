import {
  SPAN,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  EDIT_MODE,
  PLAY_MODE,
} from "../utils/constants";
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
  }

  setCellsForPlayerMode() {
    this.cellsArray.forEach((cell) => {
      cell.setForPlayerMode();
    });
  }

  clearEditorView() {
    this.cellsArray.forEach((cell) => {
      this.startCellsWordsAcross = [];
      this.startCellsWordsDown = [];
      cell.reset();
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
      this.highlightedCells.pop().setIsInSelectedRowOrColumn(false);
    }
  }

  highlightDirection({ x, y }) {
    if (
      (this.gridDirection === GO_LEFT_TO_RIGHT && y === this.currentRow) ||
      (this.gridDirection === GO_TOP_TO_BOTTOM && x === this.currentColumn)
    ) {
      console.log(x, y);
      // user is in the currently highlighted row or column so no need to re-style cells
      return;
    }
    // user is in a different row or column, so de-highlight the existing cells
    this.unhighlightCells();
    this.currentRow = y;
    this.currentColumn = x;

    let start;
    // get the first active cell
    if (this.gridDirection === GO_LEFT_TO_RIGHT) {
      start = x;
      let leftValue = x - 1;
      if (leftValue >= 0) {
        while (
          this.cellsObject?.[`${leftValue}:${y}`]?.mode === PLAY_MODE ||
          this.cellsObject?.[`${leftValue}:${y}`]?.mode === EDIT_MODE
        ) {
          start = leftValue;
          leftValue -= 1;
        }
      }
    }
    if (this.gridDirection === GO_TOP_TO_BOTTOM) {
      start = y;
      let aboveValue = y - 1;
      if (aboveValue >= 0) {
        while (
          this.cellsObject?.[`${x}:${aboveValue}`]?.mode === PLAY_MODE ||
          this.cellsObject?.[`${x}:${aboveValue}`]?.mode === EDIT_MODE
        ) {
          start = aboveValue;
          aboveValue -= 1;
        }
      }
    }

    let cell;
    for (let i = start; i < SPAN; i++) {
      if (this.gridDirection === GO_LEFT_TO_RIGHT) {
        cell = this.cellsObject[`${i}:${y}`];
      } else if (this.gridDirection === GO_TOP_TO_BOTTOM) {
        cell = this.cellsObject[`${x}:${i}`];
      }
      if (cell.mode === EDIT_MODE || cell.mode === PLAY_MODE) {
        cell.setIsInSelectedRowOrColumn(true);
        this.highlightedCells.push(cell);
      } else {
        break;
      }
    }
  }
}
