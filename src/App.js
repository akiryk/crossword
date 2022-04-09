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

  function makeAcrossWords({
    currentCell,
    x,
    y,
    currentWord,
    acrossWordCount,
  }) {
    const previousCell = gridData[`${x - 1}:${y}`];
    const nextCell = gridData[`${x + 1}:${y}`];
    if (!previousCell?.value && !!currentCell.value && !!nextCell?.value) {
      // first letter in an across word!
      acrossWordCount += 1;
      currentWord = `${currentWord}${currentCell.value}`;
      grid.wordsAcross[acrossWordCount] = {
        word: "",
        startingCell: currentCell,
        endingCell: null,
      };
    }
    if (!!previousCell?.value && !!currentCell.value && !!nextCell?.value) {
      // middling letter!
      currentWord = `${currentWord}${currentCell.value}`;
    }
    if (!!previousCell?.value && !!currentCell.value && !nextCell?.value) {
      currentWord = `${currentWord}${currentCell.value}`;
      grid.wordsAcross[acrossWordCount] = {
        ...grid.wordsAcross[acrossWordCount],
        word: currentWord,
        endingCell: currentCell,
      };
      currentWord = "";
    }
    return { acrossWord: currentWord, acrossCount: acrossWordCount };
  }

  function makeDownWords({ currentCell, x, y, currentWord, downWordCount }) {
    const previousCell = gridData[`${x}:${y - 1}`];
    const nextCell = gridData[`${x}:${y + 1}`];
    if (!previousCell?.value && !!currentCell.value && !!nextCell?.value) {
      currentWord = `${currentWord}${currentCell.value}`;
      // first letter in an across word!
      downWordCount += 1;
      grid.wordsDown[downWordCount] = {
        word: "",
        startingCell: currentCell,
        endingCell: null,
      };
    }
    if (!!previousCell?.value && !!currentCell.value && !!nextCell?.value) {
      currentWord = `${currentWord}${currentCell.value}`;
    }
    if (!!previousCell?.value && !!currentCell.value && !nextCell?.value) {
      currentWord = `${currentWord}${currentCell.value}`;
      grid.wordsDown[downWordCount] = {
        ...grid.wordsDown[downWordCount],
        word: currentWord,
        endingCell: currentCell,
      };
      currentWord = "";
    }
    return { downWord: currentWord, downCount: downWordCount };
  }

  function handleMakeHints() {
    let acrossWordCount = 0;
    let downWordCount = 0;
    let currentAcrossWord = "";
    let currentDownWord = "";
    for (let y = 0; y < SPAN; y++) {
      for (let x = 0; x < SPAN; x++) {
        let currentCell = gridData[`${x}:${y}`];
        const { acrossWord, acrossCount } = makeAcrossWords({
          currentCell,
          x,
          y,
          currentWord: currentAcrossWord,
          acrossWordCount,
        });
        acrossWordCount = acrossCount;
        currentAcrossWord = acrossWord;
      }
    }

    for (let x = 0; x < SPAN; x++) {
      for (let y = 0; y < SPAN; y++) {
        let currentCell = gridData[`${x}:${y}`];
        const { downWord, downCount } = makeDownWords({
          currentCell,
          x,
          y,
          currentWord: currentDownWord,
          downWordCount,
        });
        downWordCount = downCount;
        currentDownWord = downWord;
      }
    }

    console.table(grid.wordsAcross);
    console.table(grid.wordsDown);
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
