import React from "react";
import CellForPlay from "./CellForPlay";
import { SPAN, WHITE_CELL } from "../utils/constants";

const DeadCell = () => <div className="cell cell--dead" />;

const CrosswordPlayer = ({ grid, goToNextCell }) => {
  if (!grid) {
    return null;
  }

  // get array of Cells from the Grid class
  const { cellsArray } = grid;
  const rows = [];

  // Create an array of rows, then use a loop to add groups of Cells
  // equal to the puzzle's span to a row group. E.g. if the SPAN is 10,
  // we will create 10 rows of 10 Cells each.
  for (let i = 0; i < cellsArray.length; i += SPAN) {
    const row = [];
    for (let j = i; j < i + SPAN; j++) {
      const cell = cellsArray[j];
      if (cell.displayState === WHITE_CELL) {
        row.push(
          <CellForPlay
            row={cell.y}
            column={cell.x}
            goToNextCell={goToNextCell}
            cell={cell}
            grid={grid}
            key={cell.id}
            displayNumber={cell.displayNumber}
          />
        );
      } else {
        row.push(<DeadCell />);
      }
    }
    rows.push(row);
  }
  return (
    <div className="Crossword">
      {rows.map((row) => {
        return <div className="Row">{row}</div>;
      })}
    </div>
  );
};

export default CrosswordPlayer;
