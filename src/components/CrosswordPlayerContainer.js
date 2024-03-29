import React, { useEffect, useState } from "react";
import Crossword from "./Crossword";
import { Button } from "./Common";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import { useGridContext } from "../context/GridProvider";

const CrosswordPlayerContainer = () => {
  const { acrossHints, downHints } = useCrosswordContext();
  const { grid } = useGridContext();
  console.log(JSON.stringify(acrossHints));
  console.log(JSON.stringify(downHints));
  console.log(JSON.stringify(grid));
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false);
  useEffect(() => {
    const unsubscribe = grid.subscribe((isGridComplete) => {
      setIsSubmitButtonEnabled(isGridComplete);
    });
    return () => unsubscribe();
  }, [grid]);

  function handleSubmit(e) {
    e.preventDefault();
    const wrongAnswers = grid.getIsSubmissionCorrect();
    if (wrongAnswers.length === 0) {
      alert("You did it!");
    } else {
      alert("Sorry, try again...");
    }
  }
  if (!grid) {
    return <></>;
  }
  return (
    <div>
      <h2>Play the game</h2>
      <p>it's cool</p>
      {grid && <Crossword grid={grid} mode="PLAYING_MODE" />}
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

export default CrosswordPlayerContainer;
