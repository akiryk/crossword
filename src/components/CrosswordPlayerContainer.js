import React from "react";
import Crossword from "./Crossword";
import { useCrosswordContext } from "../context/CrosswordContextProvider";

const CrosswordPlayerContainer = () => {
  const { grid, acrossHints, downHints } = useCrosswordContext();

  return (
    <div>
      <h2>Play the game</h2>
      <p>it's cool</p>
      {grid && <Crossword grid={grid} />}
      <div className="max-w-5xl m-auto p-5 shadow-md">
        <h3 className="font-bold">Across</h3>
        {acrossHints && (
          <ul>
            {acrossHints.map((hint) => {
              return (
                <li key={hint.displayNumber}>
                  <span>{hint.displayNumber}</span>: <span>{hint.hint}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="max-w-5xl m-auto p-5 shadow-md">
        <h3 className="font-bold">Down</h3>
        {downHints && (
          <ul>
            {downHints.map((hint) => {
              return (
                <li key={hint.displayNumber}>
                  <span>{hint.displayNumber}</span>: <span>{hint.hint}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CrosswordPlayerContainer;
