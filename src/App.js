import React, { useState } from "react";
import styled from "styled-components";
import Crossword from "./components/Crossword";
import "./App.css";
import {
  MODES,
  PHASE_TITLES,
  ANSWER_PHASE,
  HINT_PHASE,
  PHASE_DESCRIPTIONS,
  GO_LEFT_TO_RIGHT,
  GO_TOP_TO_BOTTOM,
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
  const [mode, setMode] = useState(GO_LEFT_TO_RIGHT);
  function handleChange(e) {
    const newMode = e.target.value;
    if (MODES.includes(newMode)) {
      setMode(newMode);
    }
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
              name="mode"
              id="horizontal"
              value={`${GO_LEFT_TO_RIGHT}`}
              onChange={handleChange}
              checked
            />
            <label htmlFor="horizontal">Handle across words</label>
          </StyledInputWrapper>{" "}
          <StyledInputWrapper>
            <input
              type="radio"
              name="mode"
              id="vertical"
              value={`${GO_TOP_TO_BOTTOM}`}
              onChange={handleChange}
            />
            <label htmlFor="vertical">Handle down words</label>
          </StyledInputWrapper>
        </StyledInputs>
        <Crossword mode={mode} phase={phase} />
      </div>
    </div>
  );
}

export default App;
