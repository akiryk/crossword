import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./Common";
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

export default function CrosswordContainer({ mode }) {
  const [cells, setCells] = useState(null);
  const [grid, setGrid] = useState(null);

  const [cellWithFocus, setCellWithFocus] = useState(null);
  useEffect(() => {
    const { grid, cells } = new Grid({ crossSpan: SPAN, downSpan: SPAN });
    setGrid(grid);
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

  const handleNumberingCells = () => {
    console.log(`grid`, grid);
  };

  // when a cell is clicked in PATTERN mode, toggle it on or off
  // by using the Cell class method.
  const handleClick = (cell) => {
    cell.toggleActive();
  };

  return (
    <Crossword
      grid={grid}
      goToNextCell={goToNextCell}
      cellWithFocus={cellWithFocus}
      mode={mode}
      onClick={handleClick}
    />
  );
}

function Crossword({
  mode,
  grid,
  goToNextCell,
  cellWithFocus,
  handleNumberingCells,
  onClick,
}) {
  return (
    <>
      {grid ? (
        <div>
          <div
            className={
              mode === CREATE_PATTERN
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
                    goToNextCell={goToNextCell}
                    cellWithFocus={cellWithFocus}
                  />
                );
              });
            })}
          </div>
          <Button onClick={handleNumberingCells}>Number Words</Button>
        </div>
      ) : null}
    </>
  );
}
