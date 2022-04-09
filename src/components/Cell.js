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
const COMMAND_KEY = 91;

const keyIsLetter = (key) => "abcdefghijklmnopqrstuvwxyz".includes(key);

function Cell({
  row,
  column,
  mode,
  phase,
  goToNextCell,
  gotoPreviousCell,
  cellWithFocus,
  cell,
  onClick,
}) {
  const [isActive, setIsActive] = useState(true);
  const [value, setValue] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    // if this cell is the current cell,
    // AND this cell is active
    // THEN give it focus. Else, stay on the existing cell.
    if (cellWithFocus?.row === row && cellWithFocus?.column === column) {
      if (isActive) {
        inputRef.current.focus();
      }
    }
  }, [cellWithFocus, column, row, isActive, goToNextCell]);

  function handleChange(event) {
    if (isActive && phase === ANSWER_PHASE) {
      const value = event.target.value;
      setValue(value.slice(-1).toUpperCase());
      if (value) {
        goToNextCell({ row, column });
      } else {
        // delete key!
        gotoPreviousCell({ row, column });
      }
    }
  }

  function handleKeyUp(event) {
    const code = event?.keyCode;
    switch (code) {
      case DELETE_KEY:
        if (mode === GO_LEFT_TO_RIGHT && !value) {
          goToNextCell({ row, column, overrideMode: GO_RIGHT_TO_LEFT });
        }
        if (mode === GO_TOP_TO_BOTTOM && !value) {
          goToNextCell({ row, column, overrideMode: GO_BOTTOM_TO_TOP });
        }
        break;
      case COMMAND_KEY:
        if (phase === ANSWER_PHASE) {
          if (isActive) {
            setValue("");
          }
          setIsActive((currentState) => !currentState);
          onClick(cell);
        }
        break;
      case LEFT_ARROW_KEY:
        goToNextCell({ row, column, overrideMode: GO_RIGHT_TO_LEFT });
        break;
      case RIGHT_ARROW_KEY:
        goToNextCell({ row, column, overrideMode: GO_LEFT_TO_RIGHT });
        break;
      case UP_ARROW_KEY:
        goToNextCell({ row, column, overrideMode: GO_BOTTOM_TO_TOP });
        break;
      case DOWN_ARROW_KEY:
        goToNextCell({ row, column, overrideMode: GO_TOP_TO_BOTTOM });
        break;
      default:
        break;
    }
  }

  return (
    <input
      className={isActive ? "cell cell--active" : "cell cell--inactive"}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      value={value}
      ref={inputRef}
    />
  );
}

export default Cell;
