import React from "react";
import CellUI from "./CellUI";

import { ANSWER_PHASE, SPAN } from "../utils/constants";

export default function Crossword({
  grid,
  phase,
  goToNextCell,
  goToPreviousCell,
  onClick,
}) {
  if (!grid) {
    return null;
  }
  const { cellsArray, directionMode } = grid;
  console.log(grid.gridDirection);
  return (
    <div className="Crossword">
      <div className="highliter" />
      {cellsArray.map((cell) => (
        <CellUI
          grid={grid}
          cell={cell}
          onClick={onClick}
          key={cell.id}
          row={cell.y}
          column={cell.x}
          directionMode={directionMode}
          phase={phase}
          goToNextCell={goToNextCell}
          goToPreviousCell={goToPreviousCell}
        />
      ))}
    </div>
  );
}
