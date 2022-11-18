import React, { useEffect } from "react";
import CellContainer from "./CellContainer";
import { DeadCell, ViewOnlyCell } from "./Cell";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
  EDIT_MODE,
  PLAY_MODE,
  VIEW_ONLY_MODE,
  DEAD_CELL_MODE,
  HIGHEST_INDEX,
} from "../utils/constants";

function useOutsideAlerter(ref) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      // if (ref.current && !ref.current.contains(event.target)) {
      // }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

const Crossword = ({ grid }) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  if (!grid) {
    return null;
  }

  function getCellBelow({ currentRow, currentColumn }) {
    let newRow = currentRow;
    let newColumn = currentColumn;
    if (currentRow < SPAN - 1) {
      newRow = currentRow + 1;
    } else {
      newRow = 0;
      newColumn = currentColumn + 1 === SPAN ? 0 : currentColumn + 1;
    }

    const possibleNextCell = grid.cellsObject[`${newColumn}:${newRow}`];
    while (shouldSkipNextCell(possibleNextCell)) {
      newRow = currentRow + 1;
      return getCellBelow({
        currentRow: newRow,
        currentColumn: newColumn,
      });
    }
    return { row: newRow, column: newColumn };
  }

  function getCellAbove({ currentRow, currentColumn }) {
    let newRow = SPAN;
    if (currentRow > 0) {
      newRow = currentRow - 1;
    }
    return { row: newRow, column: currentColumn };
  }

  function shouldSkipNextCell(cell) {
    if (cell.mode === PLAY_MODE) {
      const emptyCellsRemain = Object.values(grid.workingAnswersKey).includes(
        null
      );
      return cell.mode === DEAD_CELL_MODE || (!!cell.value && emptyCellsRemain);
    }
    return cell.mode === DEAD_CELL_MODE;
  }

  function getCellToTheRight({ currentRow, currentColumn }) {
    let newColumn = currentColumn + 1;
    let newRow = currentRow;
    if (newColumn >= SPAN) {
      newColumn = 0;
      newRow = currentRow + 1 === SPAN ? 0 : currentRow + 1;
    }
    const possibleNextCell = grid.cellsObject[`${newColumn}:${newRow}`];
    while (shouldSkipNextCell(possibleNextCell)) {
      return getCellToTheRight({
        currentRow: newRow,
        currentColumn: newColumn,
      });
    }
    return { row: newRow, column: newColumn };
  }

  function getCellToTheLeft({ currentRow, currentColumn }) {
    let nextColumn = currentColumn;
    let nextRow = currentRow;
    if (currentColumn > 0) {
      nextColumn = currentColumn - 1;
    } else {
      nextColumn = HIGHEST_INDEX; // HIGHEST_INDEX = SPAN - 1;
      nextRow = currentRow - 1 < 0 ? HIGHEST_INDEX : currentRow - 1;
    }
    const possibleNextCell = grid.cellsObject[`${nextColumn}:${nextRow}`];
    while (shouldSkipNextCell(possibleNextCell)) {
      return getCellToTheLeft({
        currentRow: nextRow,
        currentColumn: nextColumn,
      });
    }
    return { row: nextRow, column: nextColumn };
  }

  function setCellWithFocus(id) {
    grid.setCellWithFocus(id);
  }

  function highlightDirection(cell) {
    grid.highlightDirection(cell);
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

    setCellWithFocus(`${nextCell.column}:${nextCell.row}`);
  }
  return (
    <div className="relative w-fit m-auto" ref={wrapperRef}>
      {grid.cellRows.map((row, i) => {
        return (
          <div key={i} className="flex justify-center flex-wrap">
            {row.map((cell) => {
              if (cell.mode === PLAY_MODE || cell.mode === EDIT_MODE) {
                return (
                  <CellContainer
                    row={cell.y}
                    column={cell.x}
                    goToNextCell={goToNextCell}
                    cell={cell}
                    grid={grid}
                    key={cell.id}
                    displayNumber={cell.displayNumber}
                    setCellWithFocus={setCellWithFocus}
                    highlightDirection={highlightDirection}
                    cellIsInteractive
                    setCellValue
                  />
                );
              } else if (cell.mode === VIEW_ONLY_MODE) {
                return (
                  <ViewOnlyCell
                    key={cell.id}
                    displayNumber={cell.displayNumber}
                  >
                    {cell.value}
                  </ViewOnlyCell>
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
