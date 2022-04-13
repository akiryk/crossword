import React, { useState, useRef, useEffect } from "react";
import {
  ANSWER_PHASE,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_RIGHT_TO_LEFT,
  GO_BOTTOM_TO_TOP,
} from "../utils/constants";

const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const DELETE_KEY = 8;
const SHIFT_KEY = 16;
const SPACEBAR_KEY = 32;

const NATIVE_DELETE_EVENT = "deleteContentBackward";

function CellUI({ row, column, goToNextCell, goToPreviousCell, cell, grid }) {
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
        inputRef.current.select();
        inputRef.current.focus();
        grid.highlightDirection(cell);
      }
    });
  }, [cell, grid]);

  function handleChange(event) {
    const value = event.target.value?.trim();
    if (value) {
      cell.setValue(value.slice(-1).toUpperCase());
      goToNextCell({ row, column });
    } else {
      if (event.nativeEvent?.inputType === NATIVE_DELETE_EVENT) {
        cell.setValue(value.slice(-1).toUpperCase());
        goToPreviousCell({ row, column });
      }
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
        if (directionMode === GO_LEFT_TO_RIGHT && !cell.value) {
          goToNextCell({
            row,
            column,
            overrideDirectionMode: GO_RIGHT_TO_LEFT,
          });
        }
        if (directionMode === GO_TOP_TO_BOTTOM && !cell.value) {
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

  function handleCellHasFocus() {
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
  if (cellDisplayState === "DEAD") {
    inputClasses += " cell--dead";
  } else if (cellDisplayState === "LIVE") {
    inputClasses += " cell--live";
  }
  // use wrapperClasses for the cell number only
  let wrapperClasses = "cellWrapper";
  if (displayNumber) {
    wrapperClasses += ` cellWrapper--numbered cellWrapper--number-${displayNumber}`;
  }
  return (
    <div className={wrapperClasses}>
      <input
        className={inputClasses}
        onChange={handleChange}
        onKeyUp={handleKeyDown}
        value={value}
        ref={inputRef}
        onClick={handleClick}
        onFocus={handleCellHasFocus}
      />
    </div>
  );
}

export default CellUI;
