import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main>
      <h3>Make and Play Crossword Puzzles!</h3>
      <p>It's hard, not that fun, and no guarantees it will even work!</p>
      <p>But still.</p>
      <Link to="/maker">Give a try</Link>
    </main>
  );
};

export default LandingPage;
