import React, { createContext, useContext, useState } from "react";

const CrosswordContext = createContext();

const CrosswordContextProvider = ({ children }) => {
  const [grid, setGrid] = useState(null);

  return (
    <CrosswordContext.Provider value={{ grid, setGrid }}>
      {children}
    </CrosswordContext.Provider>
  );
};

export const useCrosswordContext = () => {
  return useContext(CrosswordContext);
};

export default CrosswordContextProvider;
