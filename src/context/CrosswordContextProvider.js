/**
 * Manage global state with Context
 *
 * Does not cause re-render of the entire puzzle because none of
 * this context changes when you add or modify a letter in a cell
 */

import React, { createContext, useContext, useState } from "react";

const CrosswordContext = createContext();

const CrosswordContextProvider = ({ children }) => {
  const [grid, setGrid] = useState(null);
  const [acrossHints, setAcrossHints] = useState([]);
  const [downHints, setDownHints] = useState([]);

  return (
    <CrosswordContext.Provider
      value={{
        grid,
        setGrid,
        downHints,
        acrossHints,
        setDownHints,
        setAcrossHints,
      }}
    >
      {children}
    </CrosswordContext.Provider>
  );
};

export const useCrosswordContext = () => {
  return useContext(CrosswordContext);
};

export default CrosswordContextProvider;
