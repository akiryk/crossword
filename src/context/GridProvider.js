import React, { createContext, useContext, useState, useEffect } from "react";
import Grid from "../data/GridClass";
import { SPAN } from "../utils/constants";

const GridContext = createContext();

const GridContextProvider = ({ children }) => {
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    const grid = new Grid({
      crossSpan: SPAN,
      downSpan: SPAN,
    });
    setGrid(grid);
  }, []);

  // find heler methods to the class
  const setCellWithFocus = grid?.setCellWithFocus?.bind(grid);
  const highlightDirection = grid?.highlightDirection?.bind(grid);
  const setCellsForPlayerMode = grid?.setCellsForPlayerMode?.bind(grid);
  const subscribe = grid?.subscribe?.bind(grid);
  const populate = grid?.populate?.bind(grid);
  const getIsSubmissionCorrect = grid?.getIsSubmissionCorrect?.bind(grid);
  const cellsObject = grid?.cellsObject;
  const startCellsWordsAcross = grid?.startCellsWordsAcross;
  const startCellsWordsDown = grid?.startCellsWordsDown;

  const values = {
    grid,
    setCellWithFocus,
    setCellsForPlayerMode,
    highlightDirection,
    cellsObject,
    startCellsWordsAcross,
    startCellsWordsDown,
    acrossHints: grid?.acrossHints,
    downHints: grid?.downHints,
    populate,
    subscribe,
    getIsSubmissionCorrect,
  };

  return <GridContext.Provider value={values}>{children}</GridContext.Provider>;
};

export const useGridContext = () => {
  return useContext(GridContext);
};

export default GridContextProvider;
