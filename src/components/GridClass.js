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
    this.highlightedPlayCells = [];
    this.answerKey = {};
    this.workingAnswersKey = {};
    this.listeners = new Set();

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

  populate(data) {
    // reset all the cells
    this.cellsArray = [];
    this.cellsObject = {};
    this.cellRows = [];

    this.answerKey = data.answerKey;
    let cells;
    for (let y = 0; y < this.crossSpan; y++) {
      cells = [];
      for (let x = 0; x < this.downSpan; x++) {
        const cell = new Cell({
          x,
          y,
        });
        cell.correctValue = data.cellsObject[`${cell.id}`].correctValue;
        cell.value = data.cellsObject[`${cell.id}`].value;
        cell.mode = data.cellsObject[`${cell.id}`].mode;
        cell.cellHasFocus = false;
        cell.displayNumber = data.cellsObject[`${cell.id}`].displayNumber;
        cell.acrossWord = data.cellsObject[`${cell.id}`].acrossWord;
        cell.downWord = data.cellsObject[`${cell.id}`].downWord;
        cell.firstCellInAcrossWordXCoord =
          data.cellsObject[`${cell.id}`].firstCellInAcrossWordXCoord;
        cell.lastCellInAcrossWordXCoord =
          data.cellsObject[`${cell.id}`].lastCellInAcrossWordXCoord;
        cell.firstCellInDownWordYCoord =
          data.cellsObject[`${cell.id}`].firstCellInDownWordYCoord;
        cell.lastCellInDownWordYCoord =
          data.cellsObject[`${cell.id}`].lastCellInDownWordYCoord;
        this.cellsArray.push(cell);
        cells.push(cell);
        this.cellsObject[`${cell.id}`] = cell;
      }
      this.cellRows.push(cells);
    }
    this.startCellsWordsAcross = data.startCellsWordsAcross;
    this.startCellsWordsDown = data.startCellsWordsDown;
  }

  setCellsForPlayerMode() {
    this.cellWithFocus.disableFocus();
    this.answerKey = {};
    this.workingAnswersKey = {};
    this.cellsArray.forEach((cell) => {
      if (cell.value) {
        this.answerKey[cell.id] = cell.value;
        this.workingAnswersKey[cell.id] = null;
      }
      cell.setForPlayerMode();
    });
  }

  updateWorkingAnswers(cell) {
    this.workingAnswersKey[cell.id] = cell.value;
    const nullValues = Object.values(this.workingAnswersKey).filter(
      (v) => v === null || v === ""
    );
    this.updateSubscribers(nullValues.length === 0);
  }

  updateSubscribers(isGridComplete) {
    this.listeners.forEach((listener) => {
      listener(isGridComplete);
    });
  }

  ensureRotationalSymmetry({ x: x1, y: y1, value }) {
    const x2 = SPAN - x1 - 1;
    const y2 = SPAN - y1 - 1;
    const value1 = this.cellsObject[`${x1}:${y1}`].value;
    const value2 = this.cellsObject[`${x2}:${y2}`].value;
    this.cellsObject[`${x1}:${y1}`].toggleIsSymmetrical(!!value1 || !!value2);
    this.cellsObject[`${x2}:${y2}`].toggleIsSymmetrical(!!value1 || !!value2);
  }

  subscribe(update) {
    this.listeners.add(update);
    return () => this.listeners.delete(update);
  }

  getIsSubmissionCorrect() {
    const keys = Object.keys(this.answerKey);
    let i = 0;
    let keepChecking = true;
    const wrongAnswers = [];
    while (keepChecking) {
      if (i > keys.length) {
        keepChecking = false;
      } else {
        if (this.workingAnswersKey[keys[i]] !== this.answerKey[keys[i]]) {
          wrongAnswers.push(keys[i]);
        }
        i = i + 1;
      }
    }
    return wrongAnswers;
  }

  clearEditorView() {
    this.cellsArray.forEach((cell) => {
      this.startCellsWordsAcross = [];
      this.startCellsWordsDown = [];
      cell.reset();
    });
  }

  clearHighlightedCells() {
    this.highlightedCells = [];
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

    this.highlightDirection(cell, true);
  }

  unhighlightCells() {
    while (this.highlightedCells.length) {
      this.highlightedCells.pop().setIsInSelectedRowOrColumn(false);
    }
  }

  highlightDirection(cell, directionIsChanged = false) {
    if (cell.mode === PLAY_MODE) {
      this.highlightWord(cell, directionIsChanged);
    } else if (cell.mode === EDIT_MODE) {
      this.highlightColumnOrRow(cell);
    }
  }

  highlightWord(cell, directionIsChanged = false) {
    // the cell is in the existing list of highlighted cells
    // AND the direction is unchanged, then just return.
    if (
      !directionIsChanged &&
      this.highlightedPlayCells.includes(`${cell.x}:${cell.y}`)
    ) {
      return;
    }
    // clear all the currently highlighted cells
    while (this.highlightedPlayCells.length) {
      const id = this.highlightedPlayCells.pop();
      this.cellsObject[id].setIsInSelectedRowOrColumn(false);
    }
    if (this.gridDirection === GO_LEFT_TO_RIGHT) {
      for (
        let i = cell.firstCellInAcrossWordXCoord;
        i < cell.lastCellInAcrossWordXCoord;
        i++
      ) {
        cell = this.cellsObject[`${i}:${cell.y}`];
        this.highlightedPlayCells.push(`${cell.x}:${cell.y}`);
        cell.setIsInSelectedRowOrColumn(true);
      }
    } else if (this.gridDirection === GO_TOP_TO_BOTTOM) {
      for (
        let i = cell.firstCellInDownWordYCoord;
        i < cell.lastCellInDownWordYCoord;
        i++
      ) {
        cell = this.cellsObject[`${cell.x}:${i}`];
        this.highlightedPlayCells.push(`${cell.x}:${cell.y}`);
        cell.setIsInSelectedRowOrColumn(true);
      }
    }
  }

  highlightColumnOrRow({ x, y }) {
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
      if (cell.mode === EDIT_MODE) {
        cell.setIsInSelectedRowOrColumn(true);
        this.highlightedCells.push(cell);
      } else {
        break;
      }
    }
  }
}
