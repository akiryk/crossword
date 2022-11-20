import React, { createContext, useContext, useState } from "react";

const GridContext = createContext();

const GridContextProvider = ({ grid, children }) => {
  return (
    <GridContext.Provider value={{ grid }}>{children}</GridContext.Provider>
  );
};

export const useGridContext = () => {
  return useContext(GridContext);
};

export default GridContextProvider;
