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

const LEFT_ARROW_KEY = "ARROWLEFT";
const RIGHT_ARROW_KEY = "ARROWRIGHT";
const UP_ARROW_KEY = "ARROWUP";
const DOWN_ARROW_KEY = "ARROWDOWN";
const DELETE_KEY = "BACKSPACE";
// const SHIFT_KEY = 16;
const SPACEBAR_KEY = "SPACE";

function CellContainer({
  row,
  column,
  goToNextCell,
  cell,
  grid,
  displayNumber,
  setCellWithFocus,
  highlightDirection,
  showPreview,
  cellValue,
  cellSubscribe,
  cellSetValue,
  cellMode,
  cellId,
  updateWorkingAnswers,
}) {
  const inputRef = useRef();
  const [value, setValue] = useState(cellValue);
  const [isInSelectedRowOrColumn, setIsInSelectedRowOrColumn] = useState(false);
  const [isSymmetrical, setIsSymmetrical] = useState(false);

  useEffect(() => {
    cellSubscribe((newCellData) => {
      setValue(newCellData.value);
      setIsInSelectedRowOrColumn(newCellData.isInSelectedRowOrColumn);
      setIsSymmetrical(newCellData.isSymmetrical);
      if (newCellData.cellHasFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    });
    // }
  }, [cellSubscribe]);

  function handleChange(event) {
    // if (cellIsInteractive) {
    const value = event.target.value?.trim();
    if (value) {
      cellSetValue(value);
      if (cellMode === PLAY_MODE) {
        updateWorkingAnswers(cell);
      }
      if (cellMode === EDIT_MODE) {
        grid.ensureRotationalSymmetry(cell);
      }
      // don't go to next cell until after updating working answers!
      goToNextCell({ row, column });
    }
  }
  // }

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
        cellSetValue("");
        if (cellMode === PLAY_MODE) {
          updateWorkingAnswers(cell);
        } else if (cellMode === EDIT_MODE) {
          grid.ensureRotationalSymmetry(cell);
        }
        if (grid.gridDirection === GO_LEFT_TO_RIGHT) {
          goToNextCell({
            row,
            column,
            overrideDirectionMode: GO_RIGHT_TO_LEFT,
            isDelete: true,
          });
        }
        if (grid.gridDirection === GO_TOP_TO_BOTTOM) {
          goToNextCell({
            row,
            column,
            overrideDirectionMode: GO_BOTTOM_TO_TOP,
            isDelete: true,
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
    // if (cellIsInteractive) {
    // If it's a double click, highlight the row or the column
    if (event.detail === 2) {
      grid.toggleGridDirection(cell);
    }
    // }
  }

  function handleFocus() {
    // if (!cellIsInteractive) {
    //   return;
    // }
    setCellWithFocus(cellId);
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

  switch (cellMode) {
    case EDIT_MODE:
      if (isInSelectedRowOrColumn && !showPreview) {
        bgColor = isSymmetrical ? "bg-cyan-100" : "bg-gray-200";
      } else if (cellValue) {
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
      onFocus={handleFocus}
      displayNumber={displayNumber}
      id={cellId}
      mode={cellMode}
      isInSelectedRowOrColumn={isInSelectedRowOrColumn}
    />
  );
}

export default CellContainer;
