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
  const [gridData, setGridData] = useState(null);
  const [cells, setCells] = useState([]);
  const [cellWithFocus, setCellWithFocus] = useState(null);

  useEffect(() => {
    const { grid, gridData, cells } = new Grid({
      crossSpan: SPAN,
      downSpan: SPAN,
    });
    setGrid(grid);
    setGridData(gridData);
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
    const wordsAcross = {};
    let acrossWordCount = 0;
    let acrossWord = [];
    let currentWord;
    for (let y = 0; y < SPAN; y++) {
      currentWord = "";
      for (let x = 0; x < SPAN; x++) {
        const currentCell = gridData[`${x}:${y}`];
        const previousCell = gridData[`${x - 1}:${y}`];
        const nextCell = gridData[`${x + 1}:${y}`];
        currentWord = `${currentWord}${currentCell.value}`;
        if (!previousCell?.value && !!currentCell.value && !!nextCell?.value) {
          // first letter in an across word!
          acrossWordCount += 1;
          wordsAcross[acrossWordCount] = {
            word: "",
            startingCell: currentCell,
            endingCell: null,
          };
        }
        if (!!previousCell?.value && !!currentCell.value && !nextCell?.value) {
          wordsAcross[acrossWordCount] = {
            ...wordsAcross[acrossWordCount],
            word: currentWord,
            endingCell: currentCell,
          };
          currentWord = "";
        }
      }
    }
    console.log(wordsAcross);
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
          gridData={gridData}
        />
        <Button onClick={handleMakeHints}>Make Hints</Button>
        <Button onClick={handleClearPuzzle}>Clear</Button>
      </div>
    </div>
  );
}

export default App;
