import React, { useEffect } from "react";
import CrosswordPlayer from "./CrosswordPlayer";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import { BLACK_CELL } from "../utils/constants";

function CrosswordPlayerContainer() {
  const { grid } = useCrosswordContext();
  useEffect(() => {
    grid.unsetValues();
  }, [grid]);

  const goToNextCell = ({ row, column }) => {
    const current = grid.cellsObject[`${column}:${row}`];
    let i = 1;
    let next = grid.cellsObject[`${column + i}:${row}`];
    // while (next.displayState === BLACK_CELL) {
    //   i++;
    //   next = grid.cellsObject[`${column + i}:${row}`];
    // }
    if (!next) {
      // go to the next column or row
    } else if (next?.displayState === BLACK_CELL) {
      console.log("next", next);
    } else {
      console.log(next);
    }
  };
  return (
    <div className="CrosswordWrapper">
      <h2>Play the game</h2>
      <p>it's cool</p>
      <div className="Wrapper">
        {grid && <CrosswordPlayer goToNextCell={goToNextCell} grid={grid} />}
      </div>
    </div>
  );
}

export default CrosswordPlayerContainer;
