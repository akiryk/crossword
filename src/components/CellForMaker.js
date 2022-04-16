import React, { useState, useRef, useEffect } from "react";
import Cell from "./Cell";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_RIGHT_TO_LEFT,
  GO_BOTTOM_TO_TOP,
  WHITE_CELL,
  BLACK_CELL,
} from "../utils/constants";

const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const DELETE_KEY = 8;
const SHIFT_KEY = 16;
const SPACEBAR_KEY = 32;

function CellForMaker({ row, column, goToNextCell, cell, grid }) {
  const inputRef = useRef();
  const [displayNumber, setDisplayNumber] = useState(null);
  const [value, setValue] = useState(cell?.value);
  const [cellDisplayState, setCellDisplayState] = useState("");
  const [isInSelectedRowOrColumn, setIsInSelectedRowOrColumn] = useState(false);

  useEffect(() => {
    cell.subscribe((newCellData) => {
      setDisplayNumber(newCellData.displayNumber);
      setCellDisplayState(newCellData.displayState);
      setValue(newCellData.value);
      setIsInSelectedRowOrColumn(newCellData.isInSelectedRowOrColumn);
      if (newCellData.cellHasFocus) {
        inputRef.current.focus();
        inputRef.current.select();
        grid.highlightDirection(cell);
      }
    });
  }, [cell, grid]);

  function handleChange(event) {
    const value = event.target.value?.trim();
    if (value) {
      cell.setValue(value);
      goToNextCell({ row, column });
    }
  }

  function handleKeyDown(event) {
    const code = event?.keyCode;
    const directionMode = grid.gridDirection;
    switch (code) {
      case SHIFT_KEY:
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
    // highlight the row or the column, depending on direction
    // grid.setCellWithFocus(cell.id);
    // grid.highlightDirection(cell);
    switch (event.detail) {
      case 2: {
        grid.toggleGridDirection(cell);
        break;
      }
      default:
        break;
    }
  }

  function handleFocus() {
    grid.setCellWithFocus(cell.id);
    grid.highlightDirection(cell);
  }

  let inputClasses = "cell";

  if (cell.isActive && cell.value) {
    inputClasses += " cell--active";
  }
  if (isInSelectedRowOrColumn) {
    inputClasses += " cell--inSelectedRowOrColumn";
  }
  if (cellDisplayState === BLACK_CELL) {
    inputClasses += " cell--dead";
  } else if (cellDisplayState === WHITE_CELL) {
    inputClasses += " cell--live";
  }

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
    />
  );
}

export default CellForMaker;
