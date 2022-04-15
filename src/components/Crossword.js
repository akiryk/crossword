import React from "react";
import CellUI from "./CellUI";
import { SPAN } from "../utils/constants";

export default function Crossword({
  grid,
  goToNextCell,
  goToPreviousCell,
  isCellEditingDisabled,
}) {
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
      row.push(
        <CellUI
          row={cell.y}
          column={cell.x}
          goToNextCell={goToNextCell}
          goToPreviousCell={goToPreviousCell}
          cell={cell}
          grid={grid}
          key={cell.id}
          isCellEditingDisabled={isCellEditingDisabled}
        />
      );
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
}
