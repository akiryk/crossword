import React from "react";
import CellContainer from "./CellContainer";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
} from "../utils/constants";

const DeadCell = () => <div className="cell cell--dead" />;

const Crossword = ({
  grid,
  getCellToTheLeft,
  getCellToTheRight,
  getCellAbove,
  getCellBelow,
  setCellWithFocus,
}) => {
  if (!grid) {
    return null;
  }

  function goToNextCell({ row, column, overrideDirectionMode }) {
    const nextCellMode = overrideDirectionMode
      ? overrideDirectionMode
      : grid.gridDirection;
    let nextCellFunction = () => {};
    switch (nextCellMode) {
      case GO_RIGHT_TO_LEFT:
        nextCellFunction = getCellToTheLeft;
        break;
      case GO_LEFT_TO_RIGHT:
        nextCellFunction = getCellToTheRight;
        break;
      case GO_BOTTOM_TO_TOP:
        nextCellFunction = getCellAbove;
        break;
      case GO_TOP_TO_BOTTOM:
        nextCellFunction = getCellBelow;
        break;
      default:
        break;
    }
    const nextCell = nextCellFunction({
      currentRow: row,
      currentColumn: column,
    });

    setCellWithFocus({ grid, id: `${nextCell.column}:${nextCell.row}` });
  }

  // get array of Cells from the Grid class
  const { cellsArray } = grid;
  const rows = [];

  // Create an array of rows, then use a loop to add groups of Cells
  // equal to the puzzle's span to a row group. E.g. if the SPAN is 10,
  // we will create 10 rows of 10 Cells each.
  for (let i = 0; i < cellsArray.length; i += SPAN) {
    const row = [];
    for (let j = i; j < i + SPAN; j++) {
      const cell = cellsArray[j];
      if (cell.isActive) {
        row.push(
          <CellContainer
            row={cell.y}
            column={cell.x}
            goToNextCell={goToNextCell}
            cell={cell}
            grid={grid}
            key={cell.id}
            displayNumber={cell.displayNumber}
          />
        );
      } else {
        row.push(<DeadCell key={cell.id} />);
      }
    }
    rows.push(row);
  }
  return (
    <div className="Crossword">
      {rows.map((row, i) => {
        return (
          <div key={i} className="Row">
            {row}
          </div>
        );
      })}
    </div>
  );
};

export default Crossword;
