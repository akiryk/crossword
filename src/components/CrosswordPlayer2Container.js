import React, { useEffect, useState } from "react";
import gameData from "../data.json";
import Crossword from "./Crossword";
import { Button } from "./Common";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import { useGridContext } from "../context/GridProvider";

const CrosswordPlayer = ({ getIsSubmissionCorrect, grid }) => {
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);
  const [isGridPopulated, setIsGridPopulated] = useState(false);
  const { acrossHints, downHints } = useCrosswordContext();

  useEffect(() => {
    if (!gameData) {
      return;
    }
    grid.populate(gameData.grid);
    setIsGridPopulated(true);
  }, [grid]);
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

  if (!isGridPopulated) {
    return <>not populated</>;
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

const CrosswordPlayer2Container = () => {
  const { setAcrossHints, setDownHints } = useCrosswordContext();
  const { grid, getIsSubmissionCorrect } = useGridContext();

  setAcrossHints(gameData.acrossHints);
  setDownHints(gameData.downHints);

  if (!grid) {
    return <></>;
  }
  return (
    <CrosswordPlayer
      grid={grid}
      getIsSubmissionCorrect={getIsSubmissionCorrect}
    />
  );
};

export default CrosswordPlayer2Container;
