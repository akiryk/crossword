import React from "react";
import Crossword from "./Crossword";
import { SPAN } from "../utils/constants";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import "./Crossword.scss";

const CrosswordPlayerContainer = () => {
  const { grid, acrossHints, downHints } = useCrosswordContext();

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

  function setCellWithFocus({ grid, id }) {
    grid?.setCellWithFocus(id);
  }

  return (
    <div className="CrosswordWrapper">
      <h2>Play the game</h2>
      <p>it's cool</p>
      <div className="Wrapper">
        {grid && (
          <Crossword
            getCellAbove={getCellAbove}
            getCellBelow={getCellBelow}
            getCellToTheLeft={getCellToTheLeft}
            getCellToTheRight={getCellToTheRight}
            setCellWithFocus={setCellWithFocus}
            grid={grid}
          />
        )}
        <div className="acrossHints">
          {acrossHints && (
            <ul>
              {acrossHints.map((hint) => {
                return (
                  <li>
                    <span>{hint.displayNumber}</span>: <span>{hint.hint}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="downHints">
          {downHints && (
            <ul>
              {downHints.map((hint) => {
                return (
                  <li>
                    <span>{hint.displayNumber}</span>: <span>{hint.hint}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrosswordPlayerContainer;
