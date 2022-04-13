import React, { useState, useEffect } from "react";
import Crossword from "./Crossword";

import {
  ANSWER_PHASE,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
} from "../utils/constants";

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

export default function CrosswordContainer({
  hasCleared,
  setDirectionMode,
  grid,
}) {
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

  function goToPreviousCell({ row, column, overrideDirectionMode }) {
    const nextCellMode = overrideDirectionMode
      ? overrideDirectionMode
      : grid.gridDirection;
    let nextCellFunction = () => {};
    switch (nextCellMode) {
      case GO_RIGHT_TO_LEFT:
        nextCellFunction = getCellToTheRight;
        break;
      case GO_LEFT_TO_RIGHT:
        nextCellFunction = getCellToTheLeft;
        break;
      case GO_BOTTOM_TO_TOP:
        nextCellFunction = getCellBelow;
        break;
      case GO_TOP_TO_BOTTOM:
        nextCellFunction = getCellAbove;
        break;
      default:
        break;
    }
    const nextCell = nextCellFunction({
      currentRow: row,
      currentColumn: column,
    });
    setCellWithFocus(grid, nextCell);
  }

  return (
    <Crossword
      goToNextCell={goToNextCell}
      goToPreviousCell={goToPreviousCell}
      setCellWithFocus={setCellWithFocus}
      hasCleared={hasCleared}
      setDirectionMode={setDirectionMode}
      grid={grid}
    />
  );
}
