import React from "react";
import CellUI from "./CellUI";

import { ANSWER_PHASE, SPAN } from "../utils/constants";

export default function Crossword({
  grid,
  goToNextCell,
  goToPreviousCell,
  isCellEditingDisabled,
}) {
  if (!grid) {
    return null;
  }
  const { cellsArray } = grid;
  return (
    <div className="Crossword">
      <div className="highliter" />
      {cellsArray.map((cell) => (
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
      ))}
    </div>
  );
}
