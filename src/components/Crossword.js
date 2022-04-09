import React, { useState, useEffect } from "react";
import { Button } from "./Common";
import Cell from "./Cell";
import Grid from "./Grid";
import {
  ANSWER_PHASE,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
} from "../utils/constants";

// function getNextColumnOrRowUp(current) {
//   if (current > 0) {
//     return current - 1;
//   }
//   return SPAN - 1;
// }

// function getNextColumnOrRowDown(current) {
//   if (current < SPAN - 1) {
//     return current + 1;
//   }
//   return 0;
// }

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

export default function CrosswordContainer({ mode, phase }) {
  const [cells, setCells] = useState(null);
  const [grid, setGrid] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [hasCleared, setHasCleared] = useState(false);

  const [cellWithFocus, setCellWithFocus] = useState(null);
  useEffect(() => {
    const { grid, gridData, cells } = new Grid({
      crossSpan: SPAN,
      downSpan: SPAN,
    });
    setGrid(grid);
    setGridData(gridData);
    setCells(cells);
  }, []);

  function goToNextCell({ row, column, overrideMode }) {
    const nextCellMode = overrideMode ? overrideMode : mode;
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

    setCellWithFocus(nextCell);
  }

  function gotoPreviousCell({ row, column, overrideMode }) {
    const nextCellMode = overrideMode ? overrideMode : mode;
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
    setCellWithFocus(nextCell);
  }

  function handleClearPuzzle() {
    grid.clear();
    setHasCleared((c) => !c);
    setCellWithFocus(null);
  }

  return (
    <Crossword
      grid={gridData}
      goToNextCell={goToNextCell}
      gotoPreviousCell={gotoPreviousCell}
      cellWithFocus={cellWithFocus}
      mode={mode}
      phase={phase}
      onClearPuzzle={handleClearPuzzle}
      hasCleared={hasCleared}
    />
  );
}

function Crossword({
  mode,
  phase,
  grid,
  goToNextCell,
  gotoPreviousCell,
  cellWithFocus,
  onClearPuzzle,
  onClick,
}) {
  console.log(grid);
  return (
    <>
      {grid ? (
        <div>
          <div
            className={
              mode === ANSWER_PHASE
                ? "Crossword Crossword--pattern"
                : "Crossword"
            }
          >
            {Array.from(Array(SPAN)).map((undefinedItem, i) => {
              return Array.from(Array(SPAN)).map((undefinedItem, j) => {
                return (
                  <Cell
                    cell={grid[`${i}:${j}`]}
                    onClick={onClick}
                    key={`${i}:${j}`}
                    row={i}
                    column={j}
                    mode={mode}
                    phase={phase}
                    goToNextCell={goToNextCell}
                    gotoPreviousCell={gotoPreviousCell}
                    cellWithFocus={cellWithFocus}
                  />
                );
              });
            })}
          </div>
          <Button onClick={onClearPuzzle}>Clear</Button>
        </div>
      ) : null}
    </>
  );
}
