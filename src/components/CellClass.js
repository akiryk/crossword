// Cell Modes
import {
  EDIT_MODE,
  PLAY_MODE,
  VIEW_ONLY_MODE,
  DEAD_CELL_MODE,
} from "../utils/constants";

export default class Cell {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.correctValue = "";
    this.initStartValues();
  }

  toggleActive() {}

  setValue(value = "") {
    console.log("set value!", value);
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
  setForPlayerMode() {
    this.isInSelectedRowOrColumn = false;
    this.mode = !!this.value ? PLAY_MODE : DEAD_CELL_MODE;
    this.value = "";
  }

  initStartValues() {
    this.value = "";
    this.correctValue = "";
    this.previousValue = "";
    this.mode = EDIT_MODE;
    this.displayNumber = 0;
    this.cellHasFocus = null;
    this.isInSelectedRowOrColumn = false;
    this.acrossWord = "";
    this.downWord = "";
    this.cellHasFocus = false;
    this.firstCellInAcrossWordXCoord = -1;
    this.lastCellInAcrossWordXCoord = -1;
    this.firstCellInDownWordYCoord = -1;
    this.lastCellInDownWordYCoord = -1;
  }

  reset() {
    this.initStartValues();
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
    this.correctValue = this.value;
    this.mode = this.value ? VIEW_ONLY_MODE : DEAD_CELL_MODE;
    this.update();
  }

  enableFocus() {
    if (!this.cellHasFocus) {
      this.cellHasFocus = true;
      this.update();
    }
  }

  disableFocus() {
    if (this.cellHasFocus) {
      this.cellHasFocus = false;
      this.update();
    }
  }

  /**
   *
   * @param {boolean} isSelected
   */
  setIsInSelectedRowOrColumn(isSelected) {
    // Don'e call update unless the value changes; otherwise, we get
    // into an infinite loop!
    if (isSelected !== this.isInSelectedRowOrColumn) {
      this.isInSelectedRowOrColumn = isSelected;
      this.update();
    }
  }

  setAcrossWordData({
    firstCellInAcrossWordXCoord,
    lastCellInAcrossWordXCoord,
    acrossWord,
  }) {
    this.lastCellInAcrossWordXCoord = lastCellInAcrossWordXCoord;
    this.firstCellInAcrossWordXCoord = firstCellInAcrossWordXCoord;
    this.acrossWord = acrossWord;
  }

  setDownWordData({
    firstCellInDownWordYCoord,
    lastCellInDownWordYCoord,
    downWord,
  }) {
    this.lastCellInDownWordYCoord = lastCellInDownWordYCoord;
    this.firstCellInDownWordYCoord = firstCellInDownWordYCoord;
    this.downWord = downWord;
  }
}
