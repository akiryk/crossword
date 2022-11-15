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
} from "../utils/constants";

const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const DELETE_KEY = 8;
const SHIFT_KEY = 16;
const SPACEBAR_KEY = 32;

function CellContainer({
  row,
  column,
  goToNextCell,
  cell,
  grid,
  displayNumber,
  setCellWithFocus,
  highlightDirection,
  cellIsInteractive,
}) {
  const inputRef = useRef();
  const [value, setValue] = useState(cell?.value);
  const [isInSelectedRowOrColumn, setIsInSelectedRowOrColumn] = useState(false);

  useEffect(() => {
    if (cellIsInteractive) {
      cell.subscribe((newCellData) => {
        setValue(newCellData.value);
        setIsInSelectedRowOrColumn(newCellData.isInSelectedRowOrColumn);
        if (newCellData.cellHasFocus) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [cell, cellIsInteractive]);

  function handleChange(event) {
    if (cellIsInteractive) {
      const value = event.target.value?.trim();
      if (value) {
        cell.setValue(value);
        goToNextCell({ row, column });
        if (cell.mode === PLAY_MODE) {
          grid.updateWorkingAnswers(cell);
        }
      }
    }
  }

  function handleKeyDown(event) {
    if (!cellIsInteractive) {
      return;
    }
    const code = event?.keyCode;
    const directionMode = grid.gridDirection;
    switch (code) {
      case SPACEBAR_KEY:
        grid.toggleGridDirection(cell);
        break;
      case DELETE_KEY:
        cell.setValue("");
        if (directionMode === GO_LEFT_TO_RIGHT) {
          goToNextCell({
            row,
            column,
            overrideDirectionMode: GO_RIGHT_TO_LEFT,
          });
        }
        if (directionMode === GO_TOP_TO_BOTTOM) {
          goToNextCell({
            row,
            column,
            overrideDirectionMode: GO_BOTTOM_TO_TOP,
          });
        }
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
      default:
        break;
    }
  }

  function handleClick(event) {
    if (cellIsInteractive) {
      // If it's a double click, highlight the row or the column
      if (event.detail === 2) {
        grid.toggleGridDirection(cell);
      }
    }
  }

  function handleFocus() {
    if (!cellIsInteractive) {
      return;
    }
    setCellWithFocus(cell.id);
    highlightDirection(cell);
  }
  let cellInputClasses =
    "caret-transparent cursor-pointer selection:bg-transparent ";
  if (cellIsInteractive) {
    cellInputClasses += " focus:bg-cyan-300";
  }

  const cellAppearanceClasses = SHARED_CELL_STYLES;
  const cellTextClasses = SHARED_CELL_FONT_STYLES;
  let inputClasses = `${cellInputClasses} ${cellTextClasses} ${cellAppearanceClasses}`;

  let bgColor;

  switch (cell.mode) {
    case EDIT_MODE:
      if (isInSelectedRowOrColumn) {
        bgColor = "bg-cyan-100";
      } else if (cell.value) {
        bgColor = "bg-white";
      } else {
        bgColor = "bg-neutral-200";
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

  inputClasses = `${inputClasses} ${bgColor}`;

  return (
    <Cell
      inputClasses={inputClasses}
      inputRef={inputRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onFocus={handleFocus}
      displayNumber={displayNumber}
      id={cell.id}
      mode={cell.mode}
      isInSelectedRowOrColumn={isInSelectedRowOrColumn}
    />
  );
}

export default CellContainer;
