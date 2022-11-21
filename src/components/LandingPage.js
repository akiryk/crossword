import React from "react";
import { useNavigate } from "react-router-dom";
import gameData from "../data.json";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import Grid from "../data/GridClass";
import { SPAN } from "../utils/constants";

const LandingPage = () => {
  const navigate = useNavigate();

  const handlePlayHardCodedGame = (e) => {
    e.preventDefault();
    navigate("/player2");

    // const grid = new Grid({
    //   crossSpan: SPAN,
    //   downSpan: SPAN,
    // });
    // grid.populate(gameData.grid);
    // setAcrossHints(gameData.acrossHints);
    // setDownHints(gameData.downHints);
    // setGrid(grid);
    // Promise.resolve().then(() => navigate("/player"));
  };

  return (
    <main>
      <h3 className="text-3xl font-bold">Make and Play Crossword Puzzles!</h3>
      <p>It's hard, not that fun, and no guarantees it will even work!</p>
      <p>But still.</p>
      <button onClick={handlePlayHardCodedGame}>Give a try</button>
    </main>
  );
};

export default LandingPage;
