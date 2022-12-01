import React, { useState, useRef, useEffect } from "react";
import Cell, { SHARED_CELL_STYLES, SHARED_CELL_FONT_STYLES } from "./Cell";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_RIGHT_TO_LEFT,
  GO_BOTTOM_TO_TOP,
  EDIT_MODE,
  PLAY_MODE,
  VIEW_ONLY_MODE,
  DEAD_CELL_MODE,
  SPAN,
  HIGHEST_INDEX,
} from "../utils/constants";
import { useGridContext } from "../context/GridProvider";

const LEFT_ARROW_KEY = "ARROWLEFT";
const RIGHT_ARROW_KEY = "ARROWRIGHT";
const UP_ARROW_KEY = "ARROWUP";
const DOWN_ARROW_KEY = "ARROWDOWN";
const DELETE_KEY = "BACKSPACE";
// const SHIFT_KEY = 16;
const SPACEBAR_KEY = "SPACE";
// dot for indicating a black square
const PERIOD = "PERIOD";

function CellContainer({ cell, showPreview, initialTabIndex }) {
  const { y: row, x: column, displayNumber, mode, id } = cell;
  const inputRef = useRef();
  const [value, setValue] = useState(cell.value);
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [isComposing, setIsComposing] = useState(false);
  const [isInSelectedRowOrColumn, setIsInSelectedRowOrColumn] = useState(false);
  const [isSymmetrical, setIsSymmetrical] = useState(false);
  const {
    grid,
    setCellWithFocus: setCellFocus,
    highlightDirection: highlightGridDirection,
    cellsMap,
  } = useGridContext();

  const subscribe = cell.subscribe.bind(cell);

  useEffect(() => {
    subscribe((newCellData) => {
      setValue(newCellData.value);
      setIsInSelectedRowOrColumn(newCellData.isInSelectedRowOrColumn);
      setIsSymmetrical(newCellData.isSymmetrical);
      if (newCellData.cellHasFocus) {
        inputRef.current.focus();
        inputRef.current.select();
        setTabIndex("0");
      } else {
        setTabIndex("-1");
      }
    });
    // }
  }, [subscribe]);

  function setCellWithFocus(id) {
    setCellFocus(id);
  }

  function highlightDirection(cell) {
    highlightGridDirection(cell);
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

    const possibleNextCell = cellsMap[`${newColumn}:${newRow}`];
    while (shouldSkipNextCell(possibleNextCell)) {
      newRow = currentRow + 1;
      return getCellBelow({
        currentRow: newRow,
        currentColumn: newColumn,
      });
    }
    return { row: newRow, column: newColumn };
  }

  function getCellAbove({ currentRow, currentColumn, overrideDirectionMode }) {
    let newRow = currentRow;
    let newColumn = currentColumn;
    if (currentRow > 0) {
      newRow = currentRow - 1;
    } else {
      newRow = SPAN - 1;
      currentColumn = currentColumn - 1 < 0 ? HIGHEST_INDEX : currentColumn - 1;
    }

    const possibleNextCell = cellsMap[`${newColumn}:${newRow}`];
    while (shouldSkipNextCell(possibleNextCell, overrideDirectionMode)) {
      return getCellToTheLeft({
        currentRow: newRow,
        currentColumn: newColumn,
      });
    }

    return { row: newRow, column: currentColumn };
  }

  function shouldSkipNextCell(cell, overrideDirectionMode) {
    if (mode === PLAY_MODE && !overrideDirectionMode) {
      const emptyCellsRemain = Object.values(grid.workingAnswersKey).includes(
        null
      );
      return mode === DEAD_CELL_MODE || (!!value && emptyCellsRemain);
    }
    // return false for all cases so that creator can navigate "through" a black cell
    return false;
    // return mode === DEAD_CELL_MODE;
  }

  function getCellToTheRight({
    currentRow,
    currentColumn,
    overrideDirectionMode,
  }) {
    let newColumn = currentColumn + 1;
    let newRow = currentRow;
    if (newColumn >= SPAN) {
      newColumn = 0;
      newRow = currentRow + 1 === SPAN ? 0 : currentRow + 1;
    }
    const possibleNextCell = cellsMap[`${newColumn}:${newRow}`];
    while (shouldSkipNextCell(possibleNextCell, overrideDirectionMode)) {
      return getCellToTheRight({
        currentRow: newRow,
        currentColumn: newColumn,
      });
    }
    return { row: newRow, column: newColumn };
  }

  function getCellToTheLeft({
    currentRow,
    currentColumn,
    overrideDirectionMode,
  }) {
    let nextColumn = currentColumn;
    let nextRow = currentRow;
    if (currentColumn > 0) {
      nextColumn = currentColumn - 1;
    } else {
      nextColumn = HIGHEST_INDEX; // HIGHEST_INDEX = SPAN - 1;
      nextRow = currentRow - 1 < 0 ? HIGHEST_INDEX : currentRow - 1;
    }
    const possibleNextCell = cellsMap[`${nextColumn}:${nextRow}`];
    while (shouldSkipNextCell(possibleNextCell, overrideDirectionMode)) {
      return getCellToTheLeft({
        currentRow: nextRow,
        currentColumn: nextColumn,
      });
    }
    return { row: nextRow, column: nextColumn };
  }

  function goToNextCell({ isDelete = false, overrideDirectionMode = "" }) {
    let nextCellFunction = () => {};
    let direction = overrideDirectionMode
      ? overrideDirectionMode
      : grid.gridDirection;
    if (grid.gridDirection === GO_LEFT_TO_RIGHT && isDelete) {
      direction = GO_RIGHT_TO_LEFT;
    }
    if (grid.gridDirection === GO_TOP_TO_BOTTOM && isDelete) {
      direction = GO_BOTTOM_TO_TOP;
    }
    switch (direction) {
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
      isDelete,
    });
    setCellWithFocus(`${nextCell.column}:${nextCell.row}`);
  }

  function handleChange(event) {
    const value = event.target.value?.trim();
    if (value) {
      cell.setValue(value);
      if (mode === PLAY_MODE) {
        grid.updateWorkingAnswers(cell);
      }
      if (mode === EDIT_MODE) {
        grid.ensureRotationalSymmetry(cell);
      }
      // composing is true if user is composing a character, e.g. with option key for é
      if (isComposing) {
        return;
      }
      // don't go to next cell until after updating working answers!
      goToNextCell(cell);
    }
  }

  function handleCompositionStart(event) {
    setIsComposing(true);
  }

  function handleCompositionEnd(event) {
    setIsComposing(false);
    goToNextCell(cell);
  }

  function handleKeyDown(event) {
    // if (!cellIsInteractive) {
    //   return;
    // }
    const code = event?.code.toUpperCase();
    // const grid.directionMode = grid.gridDirection;
    switch (code) {
      case SPACEBAR_KEY:
        grid.toggleGridDirection(cell);
        break;
      case DELETE_KEY:
        cell.setValue("");
        if (mode === PLAY_MODE) {
          grid.updateWorkingAnswers(cell);
        } else if (mode === EDIT_MODE) {
          grid.ensureRotationalSymmetry(cell);
        }
        goToNextCell({
          row,
          column,
          isDelete: true,
        });
        break;
      case LEFT_ARROW_KEY:
        goToNextCell({ row, column, overrideDirectionMode: GO_RIGHT_TO_LEFT });
        break;
      case RIGHT_ARROW_KEY:
        goToNextCell({ row, column, overrideDirectionMode: GO_LEFT_TO_RIGHT });
        break;
      case UP_ARROW_KEY:
        goToNextCell({ row, column, overrideDirectionMode: GO_BOTTOM_TO_TOP });
        break;
      case DOWN_ARROW_KEY:
        goToNextCell({ row, column, overrideDirectionMode: GO_TOP_TO_BOTTOM });
        break;
      case PERIOD:
        cell.setMode(DEAD_CELL_MODE);
        break;
      default:
        break;
    }
  }

  function handleClick(event) {
    // if (cellIsInteractive) {
    // If it's a double click, highlight the row or the column
    if (event.detail === 2) {
      grid.toggleGridDirection(cell);
    }
    // }
  }

  function handleFocus() {
    setCellWithFocus(cell.id);
    highlightDirection(cell);
  }
  let cellInputClasses =
    "caret-transparent cursor-pointer selection:bg-transparent ";
  // if (cellIsInteractive) {
  cellInputClasses += " focus:bg-cyan-300";
  // }

  const cellAppearanceClasses = SHARED_CELL_STYLES;
  const cellTextClasses = SHARED_CELL_FONT_STYLES;
  let inputClasses = `${cellInputClasses} ${cellTextClasses} ${cellAppearanceClasses}`;

  let bgColor;

  const offColor = showPreview ? "bg-black" : "bg-gray-300";
  const outlineColor = showPreview ? "outline-gray-600" : "outline-gray-400";

  switch (mode) {
    case EDIT_MODE:
      if (isInSelectedRowOrColumn && !showPreview) {
        bgColor = isSymmetrical ? "bg-cyan-100" : "bg-gray-200";
      } else if (value) {
        bgColor = "bg-white";
      } else {
        bgColor = isSymmetrical ? "bg-white" : offColor;
      }
      break;
    // eslint ignore no-fallthrough
    case PLAY_MODE:
    case VIEW_ONLY_MODE:
      bgColor = isInSelectedRowOrColumn ? "bg-cyan-100" : "bg-white";
      break;
    case DEAD_CELL_MODE:
      inputClasses += " cursor-default";
      bgColor = "bg-black";
      break;
    default:
      bgColor = "bg-neutral-200";
  }

  inputClasses = `${inputClasses} ${bgColor} ${outlineColor}`;

  return (
    <Cell
      inputClasses={inputClasses}
      inputRef={inputRef}
      value={showPreview ? "" : value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onFocus={handleFocus}
      displayNumber={displayNumber}
      id={id}
      mode={mode}
      isInSelectedRowOrColumn={isInSelectedRowOrColumn}
      tabIndex={tabIndex}
    />
  );
}

export default CellContainer;
