import React from "react";
import CellContainer from "./CellContainer";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
} from "../utils/constants";

const DeadCell = () => (
  <div className="w-10 h-10 bg-black outline outline-1 outline-slate-400" />
);

const Crossword = ({ grid }) => {
  if (!grid) {
    return null;
  }

  function getCellBelow({ currentRow, currentColumn }) {
    let newRow = currentRow;
    if (currentRow < SPAN - 1) {
      newRow = currentRow + 1;
    }
    return { row: newRow, column: currentColumn };
  }

  function getCellAbove({ currentRow, currentColumn }) {
    let newRow = SPAN;
    if (currentRow > 0) {
      newRow = currentRow - 1;
    }
    return { row: newRow, column: currentColumn };
  }

  function getCellToTheRight({ currentRow, currentColumn }) {
    let newColumn = currentColumn;
    if (currentColumn < SPAN - 1) {
      newColumn = currentColumn + 1;
    }
    return { row: currentRow, column: newColumn };
  }

  function getCellToTheLeft({ currentRow, currentColumn }) {
    let newColumn = SPAN;
    if (currentColumn > 0) {
      newColumn = currentColumn - 1;
    }
    return { row: currentRow, column: newColumn };
  }

  function setCellWithFocus({ grid, id }) {
    grid?.setCellWithFocus(id);
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

  return (
    <div className="relative">
      {grid.cellRows.map((row, i) => {
        return (
          <div key={i} className="flex justify-center flex-wrap">
            {row.map((cell) => {
              if (cell.isInPlay) {
                return (
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
                return <DeadCell key={cell.id} />;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Crossword;
