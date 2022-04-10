import React from "react";
import Cell from "./Cell";

import { ANSWER_PHASE, SPAN } from "../utils/constants";

export default function Crossword({
  directionMode,
  phase,
  gridCells,
  goToNextCell,
  goToPreviousCell,
  cellWithFocus,
  onClick,
}) {
  return (
    <>
      {gridCells ? (
        <div>
          <div
            className={
              directionMode === ANSWER_PHASE
                ? "Crossword Crossword--pattern"
                : "Crossword"
            }
          >
            {Array.from(Array(SPAN)).map((undefinedItem, y) => {
              return Array.from(Array(SPAN)).map((undefinedItem, x) => {
                return (
                  <Cell
                    cell={gridCells[`${x}:${y}`]}
                    onClick={onClick}
                    key={`${x}:${y}`}
                    row={y}
                    column={x}
                    directionMode={directionMode}
                    phase={phase}
                    goToNextCell={goToNextCell}
                    goToPreviousCell={goToPreviousCell}
                    cellWithFocus={cellWithFocus}
                  />
                );
              });
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
