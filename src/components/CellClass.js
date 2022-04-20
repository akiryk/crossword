export default class Cell {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.id = `${x}:${y}`;
    this.correctValue = "";
    this.initStartValues();
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
    this.isEditable = false;
    this.isInPlay = !!this.value;
  }

  initStartValues() {
    this.value = "";
    this.isInPlay = true;
    this.isEditable = true;
    this.displayNumber = 0;
    this.cellHasFocus = null;
    this.isInSelectedRowOrColumn = false;
    this.acrossWord = "";
    this.downWord = "";
    this.cellHasFocus = false;
    this.firstCellInAcrossWordXCoord = -1;
    this.lastCellInAcrossWordXCoord = -1;
    this.firstCellInDownWordXCoord = -1;
    this.lastCellInDownWordXCoord = -1;
  }

  clearEditorView() {
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
    this.isEditable = false;
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

  toggleIsInSelectedRowOrColumn(isSelected) {
    if (this.isInSelectedRowOrColumn !== isSelected) {
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
    firstCellInDownWordXCoord,
    lastCellInDownWordXCoord,
    downWord,
  }) {
    this.lastCellInDownWordXCoord = lastCellInDownWordXCoord;
    this.firstCellInDownWordXCoord = firstCellInDownWordXCoord;
    this.downWord = downWord;
  }
}
