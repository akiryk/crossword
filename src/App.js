import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./components/Common";
import Grid from "./components/Grid";
import CrosswordContainer from "./components/CrosswordContainer";
import "./App.css";
import {
  DIRECTION_MODES,
  PHASE_TITLES,
  ANSWER_PHASE,
  HINT_PHASE,
  PHASE_DESCRIPTIONS,
  GO_LEFT_TO_RIGHT,
  GO_TOP_TO_BOTTOM,
  SPAN,
} from "./utils/constants";

const StyledInputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 30px auto 20px;
`;

const StyledInputWrapper = styled.div`
  display: block;
  margin-bottom: 6px;
`;

function App() {
  const [phase, setPhase] = useState(ANSWER_PHASE);
  const [directionMode, setDirectionMode] = useState(GO_LEFT_TO_RIGHT);
  const [toggleRerender, setToggleRender] = useState(false);
  const [grid, setGrid] = useState(null);
  const [gridCells, setGridData] = useState(null);
  const [cells, setCells] = useState([]);
  const [cellWithFocus, setCellWithFocus] = useState(null);

  useEffect(() => {
    const { grid, gridCells, cells } = new Grid({
      crossSpan: SPAN,
      downSpan: SPAN,
    });
    setGrid(grid);
    setGridData(gridCells);
    setCells(cells);
  }, []);

  function handleClearPuzzle() {
    grid.clear();
    setToggleRender((c) => !c);
    setCellWithFocus(null);
  }

  function handleChange(e) {
    const newMode = e.target.value;
    if (DIRECTION_MODES.includes(newMode)) {
      setDirectionMode(newMode);
    }
  }

  function handleMakeHints() {
    const allWords = {};
    let word;
    let count = 1;
    let x;
    let y;
    let incrementCount;
    cells.forEach((cell) => {
      incrementCount = false;
      if (cell.value) {
        x = cell.x;
        y = cell.y;
        // The cell starts a word if the previous cell does not have value
        // and the next cell does have value
        // Check if it starts a horizontal word
        if (
          !gridCells[`${x - 1}:${y}`]?.value &&
          gridCells[`${x + 1}:${y}`]?.value
        ) {
          let value = cell.value;
          word = "";
          let currentX = x;
          while (value) {
            word = `${word}${value}`;
            currentX++;
            value = gridCells[`${currentX}:${y}`]?.value;
          }
          gridCells[`${x}:${y}`].number = count;
          allWords[count] = {
            acrossWord: word,
            startCell: cell,
          };
          incrementCount = true;
        }

        // Check if it starts a vertical word
        if (
          !gridCells[`${x}:${y - 1}`]?.value &&
          gridCells[`${x}:${y + 1}`]?.value
        ) {
          let value = cell.value;
          word = "";
          let currentY = y;
          while (value) {
            word = `${word}${value}`;
            currentY++;
            value = gridCells[`${x}:${currentY}`]?.value;
          }
          gridCells[`${x}:${y}`].number = count;
          allWords[count] = {
            ...allWords[count],
            startCell: cell,
            downWord: word,
          };
          incrementCount = true;
        }
      }
      if (incrementCount) {
        cell.displayNumber = count;
        count++;
      }
    });
    setToggleRender((c) => !c);
  }

  return (
    <div className="App">
      <h2>{PHASE_TITLES[phase]}</h2>
      <p>{PHASE_DESCRIPTIONS[phase]}</p>
      <div className="Wrapper">
        <StyledInputs>
          <StyledInputWrapper>
            <input
              type="radio"
              name="directionMode"
              id="horizontal"
              value={`${GO_LEFT_TO_RIGHT}`}
              onChange={handleChange}
              checked={directionMode === GO_LEFT_TO_RIGHT}
            />
            <label htmlFor="horizontal">Handle across words</label>
          </StyledInputWrapper>{" "}
          <StyledInputWrapper>
            <input
              type="radio"
              name="directionMode"
              id="vertical"
              value={`${GO_TOP_TO_BOTTOM}`}
              checked={directionMode === GO_TOP_TO_BOTTOM}
              onChange={handleChange}
            />
            <label htmlFor="vertical">Handle down words</label>
          </StyledInputWrapper>
        </StyledInputs>
        <CrosswordContainer
          directionMode={directionMode}
          phase={phase}
          cellWithFocus={cellWithFocus}
          setCellWithFocus={setCellWithFocus}
          gridCells={gridCells}
        />
        <Button onClick={handleMakeHints}>Make Hints</Button>
        <Button onClick={handleClearPuzzle}>Clear</Button>
      </div>
    </div>
  );
}

export default App;
