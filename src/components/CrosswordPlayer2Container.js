import React, { useEffect, useState } from "react";
import gameData from "../data.json";
import Crossword from "./Crossword";
import { Button } from "./Common";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import { useGridContext } from "../context/GridProvider";

const CrosswordPlayer = ({
  downHints,
  acrossHints,
  subscribe,
  getIsSubmissionCorrect,
  grid,
  populate,
  gameData,
}) => {
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);
  useEffect(() => {
    console.log("yo", gameData);
    grid.populate(gameData.grid);
    // setAcrossHints(gameData.acrossHints);
    // setDownHints(gameData.downHints);
    // setGrid(grid);
    // console.log("yo!");
    // populate(gameData);
  }, [grid, gameData]);
  useEffect(() => {
    const unsubscribe = grid.subscribe((isGridComplete) => {
      setIsSubmitButtonEnabled(isGridComplete);
    });
    return () => unsubscribe();
  }, [grid]);

  function handleSubmit(e) {
    e.preventDefault();
    const wrongAnswers = getIsSubmissionCorrect();
    if (wrongAnswers.length === 0) {
      alert("You did it!");
    } else {
      alert("Sorry, try again...");
    }
  }
  return (
    <div>
      <h2>Play the game</h2>
      <p>it's cool</p>
      {grid && <Crossword mode="PLAYING_MODE" />}
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
      <Button onClick={handleSubmit} disabled={!isSubmitButtonEnabled}>
        Submit
      </Button>
    </div>
  );
};

const CrosswordPlayer2Container = ({ gameData }) => {
  const { acrossHints, downHints } = useCrosswordContext();
  const { grid, populate } = useGridContext();

  if (!grid) {
    return <></>;
  }
  return (
    <CrosswordPlayer
      grid={grid}
      acrossHints={acrossHints}
      downHints={downHints}
      gameData={gameData}
      populate={populate}
    />
  );
};

export default CrosswordPlayer2Container;
