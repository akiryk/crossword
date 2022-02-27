import React, { useState, useRef, useEffect } from "react";
import {
  CREATE_PATTERN,
  ENTER_ACROSS_WORDS,
  ENTER_DOWN_WORDS,
} from "../utils/constants";

const SPACEBAR_KEY = 32;
// const DELETE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const RIGHT_ARROW_KEY = 39;

function Cell({ row, column, mode, goToNextCell, cellWithFocus }) {
  const [isActive, setIsActive] = useState(true);
  const [value, setValue] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    if (cellWithFocus?.row === row && cellWithFocus?.column === column) {
      if (isActive) {
        console.log("hello");
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
    }
  }
  // function handleKeyUp(event) {
  //   const code = event?.keyCode;
  //   switch (code) {
  //     case SPACEBAR_KEY:
  //       if (isActive) {
  //         setValue("");
  //       }
  //       setIsActive((currentState) => !currentState);
  //       break;
  //     case LEFT_ARROW_KEY:
  //     case RIGHT_ARROW_KEY:
  //       break;
  //     default:
  //       break;
  //   }
  // }

  return (
    <input
      className={isActive ? "cell cell--active" : "cell cell--inactive"}
      onChange={handleChange}
      onClick={handleClick}
      value={value}
      ref={inputRef}
    />
  );
}

export default Cell;
