import React, { createContext, useContext, useState } from "react";

const CrosswordContext = createContext();

const CrosswordContextProvider = ({ children }) => {
  const [acrossHints, setAcrossHints] = useState([]);
  const [downHints, setDownHints] = useState([]);

  return (
    <CrosswordContext.Provider
      value={{ acrossHints, setAcrossHints, downHints, setDownHints }}
    >
      {children}
    </CrosswordContext.Provider>
  );
};

export const useCrosswordContext = () => {
  return useContext(CrosswordContext);
};

export default CrosswordContextProvider;
