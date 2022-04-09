import React, { useState, useRef, useEffect } from "react";
import {
  CREATE_PATTERN,
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_RIGHT_TO_LEFT,
  GO_BOTTOM_TO_TOP,
} from "../utils/constants";

const SPACEBAR_KEY = 32;
// const DELETE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;

function Cell({
  row,
  column,
  mode,
  goToNextCell,
  cellWithFocus,
  cell,
  onClick,
}) {
  const [isActive, setIsActive] = useState(true);
  const [value, setValue] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (cellWithFocus?.row === row && cellWithFocus?.column === column) {
      if (isActive) {
        inputRef.current.focus();
      } else {
        goToNextCell({ row, column });
      }
    }
  }, [cellWithFocus, column, row, isActive, goToNextCell]);

  function handleChange(event) {
    if (isActive && mode !== CREATE_PATTERN) {
      setValue(event.target.value.slice(-1).toUpperCase());
      goToNextCell({ row, column });
    }
  }

  function handleClick(event) {
    if (mode === CREATE_PATTERN) {
      if (isActive) {
        setValue("");
      }
      setIsActive((currentState) => !currentState);
      onClick(cell);
    }
  }
  function handleKeyUp(event) {
    const code = event?.keyCode;
    switch (code) {
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
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      value={value}
      ref={inputRef}
    />
  );
}

export default Cell;
