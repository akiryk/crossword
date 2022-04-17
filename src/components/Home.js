import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useCrosswordContext } from "../context/CrosswordContextProvider";

const Home = () => {
  const { grid } = useCrosswordContext();
  return (
    <div>
      <h1>Game Maker and Player!</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/">Welcome!</Link> | <Link to="/maker">Make a Crossword</Link>{" "}
        {grid && (
          <>
            | <Link to="/player">Play the Crossword</Link>
          </>
        )}
      </nav>
      <Outlet />
    </div>
  );
};
export default Home;