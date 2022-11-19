import React, { useState, useEffect } from "react";
import { Button } from "./Common";
import Grid from "./GridClass";
import Crossword from "./Crossword";
import { SPAN } from "../utils/constants";
import HintingForm from "./HintingForm";

function CrosswordMakerContainer() {
  const [shouldShowHintingForm, setShouldShowHintingForm] = useState(false);
  const [isHintButtonDisabled, setIsHintButtonDisabled] = useState(false);
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
    grid.clearEditorView();
    setShouldShowHintingForm(false);
  }

  function makeHints() {
    setIsHintButtonDisabled(true);
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
          // First, get the complete horizontal word
          while (value) {
            word = `${word}${value}`;
            currentX++;
            value = cellsObject[`${currentX}:${y}`]?.value;
          }

          // Now we know the first and last cells in the word
          const startX = cell.x;
          const endX = currentX; // last cell is actually currentX
          // reset currentX and the value, and loop through the word again,
          // this time so we can give each cell context about where it is in the word
          for (let x = startX; x < endX; x++) {
            cellsObject[`${x}:${y}`].setAcrossWordData({
              firstCellInAcrossWordXCoord: startX,
              lastCellInAcrossWordXCoord: endX,
              acrossWord: word,
            });
          }
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

          // Now we know the first and last cells in the down word
          const startY = cell.y;
          const endY = currentY; // last cell is actually currentY
          // reset currentY and the value, and loop through the word again,
          // this time so we can give each cell context about where it is in the word
          for (let y = startY; y < endY; y++) {
            cellsObject[`${x}:${y}`].setDownWordData({
              firstCellInDownWordYCoord: startY,
              lastCellInDownWordYCoord: endY,
              downWord: word,
            });
          }

          grid.addDownWordStartCell(cell);
          shouldIncrementCount = true;
        }
      }
      if (shouldIncrementCount) {
        cell.setDisplayNumber(cellDisplayNumber);
        cellDisplayNumber++;
      }
      cell.setFinalValue();
    });
    grid.clearHighlightedCells();
    setShouldShowHintingForm(true);
  }

  return (
    <div className="text-center">
      <div className="m-5">
        <Crossword grid={grid} />
      </div>
      <div className="flex">
        <div className="">
          <Button onClick={makeHints} disabled={isHintButtonDisabled}>
            Make Hints
          </Button>
        </div>
        <div className="">
          <Button onClick={handleClearPuzzle}>Clear</Button>
        </div>

        {shouldShowHintingForm && (
          <div className="">
            <HintingForm grid={grid} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CrosswordMakerContainer;
