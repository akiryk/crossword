import React, { useState, useEffect } from "react";
import { Button } from "./Common";
import Grid from "./GridClass";
import Crossword from "./Crossword";
import { SPAN } from "../utils/constants";
import HintingForm from "./HintingForm";

function CrosswordMakerContainer() {
  const [shouldShowHintingForm, setShouldShowHintingForm] = useState(false);

  // const [toggleRerender, setToggleRender] = useState(false);
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    const grid = new Grid({
      crossSpan: SPAN,
      downSpan: SPAN,
    });
    setGrid(grid);
  }, []);

  function handleClearPuzzle() {
    grid.clear();
    setShouldShowHintingForm(false);
  }

  function makeHints() {
    const { cellsArray, cellsObject } = grid;
    let word;
    let cellDisplayNumber = 1;
    let x;
    let y;
    let shouldIncrementCount;
    cellsArray.forEach((cell) => {
      shouldIncrementCount = false;
      if (cell.value) {
        x = cell.x;
        y = cell.y;

        // Check if it starts a horizontal word
        // The cell starts a word if the previous cell does not have value
        // and the next cell does have value
        if (
          !cellsObject[`${x - 1}:${y}`]?.value &&
          cellsObject[`${x + 1}:${y}`]?.value
        ) {
          let value = cell.value;
          word = "";
          let currentX = x;
          // get the complete horizontal word
          while (value) {
            word = `${word}${value}`;
            currentX++;
            value = cellsObject[`${currentX}:${y}`]?.value;
          }
          cellsObject[`${x}:${y}`].acrossWord = word;
          grid.addAcrossWordStartCell(cell);
          shouldIncrementCount = true;
        }

        // Check if it starts a vertical word
        if (
          !cellsObject[`${x}:${y - 1}`]?.value &&
          cellsObject[`${x}:${y + 1}`]?.value
        ) {
          let value = cell.value;
          word = "";
          let currentY = y;
          // get the complete vertical word
          while (value) {
            word = `${word}${value}`;
            currentY++;
            value = cellsObject[`${x}:${currentY}`]?.value;
          }
          cellsObject[`${x}:${y}`].downWord = word;
          grid.addDownWordStartCell(cell);
          shouldIncrementCount = true;
        }
      }
      if (shouldIncrementCount) {
        cell.setDisplayNumber(cellDisplayNumber);
        cellDisplayNumber++;
      }
    });
    grid.finalizeAnswers();
    setShouldShowHintingForm(true);
  }

  return (
    <div className="text-center">
      <h2>Make yer xword</h2>
      <p>it's be cool</p>
      <div className="m-auto">
        <Crossword grid={grid} />
        <Button onClick={makeHints}>Make Hints</Button>
        <Button onClick={handleClearPuzzle}>Clear</Button>
        {shouldShowHintingForm && <HintingForm grid={grid} />}
      </div>
    </div>
  );
}

export default CrosswordMakerContainer;
