import React, { useEffect } from "react";
import CrosswordPlayer from "./CrosswordPlayer";
import { useCrosswordContext } from "../context/CrosswordContextProvider";

function CrosswordPlayerContainer() {
  const { grid } = useCrosswordContext();
  useEffect(() => {
    grid.unsetValues();
  }, [grid]);

  const goToNextCell = () => {};
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
