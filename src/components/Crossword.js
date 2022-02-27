import React, { useState, useEffect, useCallback } from "react";
import Cell from "./Cell";
import Grid from "./Grid";
import {
  CREATE_PATTERN,
  ENTER_ACROSS_WORDS,
  ENTER_DOWN_WORDS,
} from "../utils/constants";

const SPAN = 15;

function getNextColumnOrRow(current) {
  if (current < SPAN - 1) {
    return current + 1;
  }
  return 0;
}

function getNextCellDown({ currentRow, currentColumn }) {
  let newRow = 0;
  let newColumn = currentColumn;
  if (currentRow < SPAN - 1) {
    newRow = currentRow + 1;
  } else {
    newColumn = getNextColumnOrRow(currentColumn);
  }
  return { row: newRow, column: newColumn };
}

function getNextCellAcross({ currentRow, currentColumn }) {
  let newRow = currentRow;
  let newColumn = 0;
  if (currentColumn < SPAN - 1) {
    newColumn = currentColumn + 1;
  } else {
    newRow = getNextColumnOrRow(currentRow);
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

  function goToNextCell({ row, column }) {
    let nextCell = { row: 0, column: 0 };
    if (mode === ENTER_DOWN_WORDS) {
      nextCell = getNextCellDown({ currentRow: row, currentColumn: column });
    }
    if (mode === ENTER_ACROSS_WORDS) {
      nextCell = getNextCellAcross({ currentRow: row, currentColumn: column });
    }
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
