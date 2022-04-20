import React from "react";
import CellContainer from "./CellContainer";
import { DeadCell, ViewOnlyCell } from "./Cell";
import {
  GO_TOP_TO_BOTTOM,
  GO_LEFT_TO_RIGHT,
  GO_BOTTOM_TO_TOP,
  GO_RIGHT_TO_LEFT,
  SPAN,
  EDIT_MODE,
  PLAY_MODE,
  VIEW_ONLY_MODE,
} from "../utils/constants";

function useOutsideAlerter(ref) {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        console.log("outside");
      }
    }
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

const Crossword = ({ grid }) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  if (!grid) {
    return null;
  }

  function getCellBelow({ currentRow, currentColumn }) {
    let newRow = currentRow;
    if (currentRow < SPAN - 1) {
      newRow = currentRow + 1;
    }
    return { row: newRow, column: currentColumn };
  }

  function getCellAbove({ currentRow, currentColumn }) {
    let newRow = SPAN;
    if (currentRow > 0) {
      newRow = currentRow - 1;
    }
    return { row: newRow, column: currentColumn };
  }

  function getCellToTheRight({ currentRow, currentColumn }) {
    let newColumn = currentColumn;
    if (currentColumn < SPAN - 1) {
      newColumn = currentColumn + 1;
    }
    return { row: currentRow, column: newColumn };
  }

  function getCellToTheLeft({ currentRow, currentColumn }) {
    let newColumn = SPAN;
    if (currentColumn > 0) {
      newColumn = currentColumn - 1;
    }
    return { row: currentRow, column: newColumn };
  }

  function setCellWithFocus(id) {
    grid.setCellWithFocus(id);
  }

  function highlightDirection(cell) {
    grid.highlightDirection(cell);
  }

  function goToNextCell({ row, column, overrideDirectionMode }) {
    const nextCellMode = overrideDirectionMode
      ? overrideDirectionMode
      : grid.gridDirection;
    let nextCellFunction = () => {};
    switch (nextCellMode) {
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
    });

    setCellWithFocus(`${nextCell.column}:${nextCell.row}`);
  }

  return (
    <div className="relative" ref={wrapperRef}>
      {grid.cellRows.map((row, i) => {
        return (
          <div key={i} className="flex justify-center flex-wrap">
            {row.map((cell) => {
              if (cell.mode === PLAY_MODE || cell.mode === EDIT_MODE) {
                return (
                  <CellContainer
                    row={cell.y}
                    column={cell.x}
                    goToNextCell={goToNextCell}
                    cell={cell}
                    grid={grid}
                    key={cell.id}
                    displayNumber={cell.displayNumber}
                    setCellWithFocus={setCellWithFocus}
                    highlightDirection={highlightDirection}
                    cellIsInteractive
                  />
                );
              } else if (cell.mode === VIEW_ONLY_MODE) {
                return (
                  <ViewOnlyCell
                    key={cell.id}
                    displayNumber={cell.displayNumber}
                  >
                    {cell.value}
                  </ViewOnlyCell>
                );
              } else {
                return <DeadCell key={cell.id} />;
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Crossword;
