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

function Cell({
  row,
  column,
  directionMode,
  phase,
  goToNextCell,
  goToPreviousCell,
  cell,
}) {
  const inputRef = useRef();
  const [displayNumber, setDisplayNumber] = useState(null);
  const [value, setValue] = useState(cell?.value);
  const [cellDisplayState, setCellDisplayState] = useState("");

  // cell.subscribe((data) => {
  //   setDisplayNumber(data.displayNumber);
  // });

  // const subscribe = cell.subscribe;
  useEffect(() => {
    cell.subscribe((newCellData) => {
      setDisplayNumber(newCellData.displayNumber);
      setCellDisplayState(newCellData.displayState);
      setValue(newCellData.value);
      if (newCellData.cellHasFocus) {
        inputRef.current.select();
        inputRef.current.focus();
      }
    });
  }, [cell]);

  function handleChange(event) {
    if (cell.isActive && phase === ANSWER_PHASE) {
      const value = event.target.value;
      cell.setValue(value.slice(-1).toUpperCase());
      if (value) {
        // goToNextCell({ row, column });
      } else {
        // delete key!
        goToPreviousCell({ row, column });
      }
    }
  }

  function handleKeyUp(event) {
    const code = event?.keyCode;
    switch (code) {
      // case DELETE_KEY:
      //   if (directionMode === GO_LEFT_TO_RIGHT && !cell.value) {
      //     goToNextCell({
      //       row,
      //       column,
      //       overrideDirectionMode: GO_RIGHT_TO_LEFT,
      //     });
      //   }
      //   if (directionMode === GO_TOP_TO_BOTTOM && !cell.value) {
      //     goToNextCell({
      //       row,
      //       column,
      //       overrideDirectionMode: GO_BOTTOM_TO_TOP,
      //     });
      //   }
      //   break;
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
  if (cell.isActive) {
    inputClasses += " cell--active";
  } else {
    inputClasses += " cell--inactive";
  }
  if (cellDisplayState === "DEAD") {
    inputClasses += " cell--dead";
  } else if (cellDisplayState === "LIVE") {
    inputClasses += " cell--live";
  }
  if (displayNumber) {
    wrapperClasses += ` cellWrapper--numbered cellWrapper--number-${displayNumber}`;
  }
  return (
    <div className={wrapperClasses}>
      <input
        className={inputClasses}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={value}
        ref={inputRef}
      />
    </div>
  );
}

export default Cell;
