import React, { useState, useEffect, useCallback } from "react";
import Cell from "./Cell";
import Grid from "./Grid";
import {
  CREATE_PATTERN,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
} from "../utils/constants";

const SPAN = 15;

function getNextColumnOrRowUp(current) {
  console.log(`current is ${current}`);
  if (current > 0) {
    return current - 1;
  }
  return SPAN - 1;
}

function getNextColumnOrRowDown(current) {
  if (current < SPAN - 1) {
    return current + 1;
  }
  return 0;
}

function getCellBelow({ currentRow, currentColumn }) {
  let newRow = 0;
  let newColumn = currentColumn;
  if (currentRow < SPAN - 1) {
    newRow = currentRow + 1;
  } else {
    newColumn = getNextColumnOrRowDown(currentColumn);
  }
  return { row: newRow, column: newColumn };
}

function getCellAbove({ currentRow, currentColumn }) {
  let newRow = SPAN - 1;
  let newColumn = currentColumn;
  if (currentRow > 0) {
    newRow = currentRow - 1;
  } else {
    newColumn = getNextColumnOrRowUp(currentColumn);
  }
  return { row: newRow, column: newColumn };
}

function getCellToTheRight({ currentRow, currentColumn }) {
  let newRow = currentRow;
  let newColumn = 0;
  if (currentColumn < SPAN - 1) {
    newColumn = currentColumn + 1;
  } else {
    newRow = getNextColumnOrRowDown(currentRow);
  }
  return { row: newRow, column: newColumn };
}

function getCellToTheLeft({ currentRow, currentColumn }) {
  let newRow = currentRow;
  let newColumn = SPAN - 1;
  if (currentColumn > 0) {
    newColumn = currentColumn - 1;
  } else {
    newRow = getNextColumnOrRowUp(currentRow);
  }
  return { row: newRow, column: newColumn };
}

export default function Crossword({ mode }) {
  const [cells, setCells] = useState(null);
  const [cellWithFocus, setCellWithFocus] = useState(null);
  useEffect(() => {
    const { cells } = new Grid({ crossSpan: SPAN, downSpan: SPAN });
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

  return (
    <div
      className={
        mode === CREATE_PATTERN ? "Crossword Crossword--pattern" : "Crossword"
      }
    >
      {Array.from(Array(SPAN)).map((undefinedItem, i) => {
        return Array.from(Array(SPAN)).map((undefinedItem, j) => {
          return (
            <Cell
              key={`${i}:${j}`}
              row={i}
              column={j}
              mode={mode}
              goToNextCell={goToNextCell}
              cellWithFocus={cellWithFocus}
            />
          );
        });
      })}
    </div>
  );
}
