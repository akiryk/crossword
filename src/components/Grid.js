class Cell {
  constructor({ x, y, top, bottom, isActive = true }) {
    this.x = x;
    this.y = y;
    this.id = `${y}:${x}`;
    this.isActive = isActive;
    this.top = top;
    this.bottom = bottom;
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
}

export default class Grid {
  constructor({ crossSpan = 15, downSpan = 15 } = {}) {
    this.crossSpan = crossSpan;
    this.downSpan = downSpan;
    this.cells = [];
    for (let i = 0; i < crossSpan; i++) {
      for (let j = 0; j < downSpan; j++) {
        const cell = new Cell({
          x: i,
          y: j,
          isActive: true,
        });

        this.cells.push(cell);
        this.grid[`${i}:${j}`] = cell;
      }
    }

    // loop through all the cells and find first and last letter of each word
    this.cells.forEach((cell) => {
      const left = cell.x > 0 ? this.grid[`${cell.x - 1}:${cell.y}`] : null;
      const right =
        cell.x < crossSpan - 1 ? this.grid[`${cell.x + 1}:${cell.y}`] : null;
      cell.setLeftAndRight(left, right);
      const isFirstCellInWord =
        cell.isActive && (cell.left === null || !cell.left.isActive);
      cell.setIsFirstCellInWord(isFirstCellInWord);
      const isLastCellInWord =
        cell.isActive && (cell.right === null || !cell.right.isActive);
      cell.setisLastCellInWord(isLastCellInWord);
    });

    return {
      grid: this.grid,
      cells: this.cells,
    };
  }

  grid = {};
}
