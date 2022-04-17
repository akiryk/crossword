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
