import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
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
const COMMAND_KEY = 91;

function Cell({
  row,
  column,
  directionMode,
  phase,
  goToNextCell,
  goToPreviousCell,
  cellWithFocus,
  cell,
}) {
  const inputRef = useRef();
  const setValue = (value) => {
    cell.setValue(value);
  };
  const [, setForceUpdate] = useState(false);

  useEffect(() => {
    // if this cell is the current cell,
    // AND this cell is active
    // THEN give it focus. Else, stay on the existing cell.
    if (cellWithFocus?.row === row && cellWithFocus?.column === column) {
      if (cell.isActive) {
        inputRef.current.focus();
      }
    }
  }, [cellWithFocus, column, row, cell, goToNextCell]);

  function handleChange(event) {
    if (cell.isActive && phase === ANSWER_PHASE) {
      const value = event.target.value;
      setValue(value.slice(-1).toUpperCase());
      if (value) {
        goToNextCell({ row, column });
      } else {
        // delete key!
        goToPreviousCell({ row, column });
      }
    }
  }

  function handleKeyUp(event) {
    const code = event?.keyCode;
    switch (code) {
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
      case COMMAND_KEY:
        if (phase === ANSWER_PHASE) {
          // if (cell.isActive) {
          cell.setValue("");
          cell.toggleActive();
          setForceUpdate((c) => !c);
          // }
          // onClick(cell);
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

  let inputClasses = "cell";
  let wrapperClasses = "cellWrapper";
  if (cell.isActive || cell.value) {
    inputClasses += " cell--active";
  } else {
    inputClasses += " cell--inactive";
  }
  if (cell.displayNumber) {
    wrapperClasses += ` cellWrapper--numbered cellWrapper--number-${cell.displayNumber}`;
  }
  return (
    <div className={wrapperClasses}>
      <input
        className={inputClasses}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={cell.value}
        ref={inputRef}
      />
    </div>
  );
}

export default Cell;
