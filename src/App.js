import logo from "./logo.svg";
import React, { useState } from "react";
import Crossword from "./components/Crossword";
import "./App.css";
import {
  MODES,
  CREATE_PATTERN,
  ENTER_ACROSS_WORDS,
  ENTER_DOWN_WORDS,
} from "./utils/constants";

function App() {
  const [mode, setMode] = useState(CREATE_PATTERN);
  function handleChange(e) {
    const newMode = e.target.value;
    console.log("newMode", newMode);
    if (MODES.includes(newMode)) {
      console.log("set");
      setMode(newMode);
    }
  }
  return (
    <div className="App">
      <p>Select a mode</p>
      <label htmlFor="pattern">Pattern</label>
      <input
        type="radio"
        name="mode"
        id="pattern"
        value={`${CREATE_PATTERN}`}
        onChange={handleChange}
      />
      <label htmlFor="vertical">Vertical</label>
      <input
        type="radio"
        name="mode"
        id="vertical"
        value={`${ENTER_DOWN_WORDS}`}
        onChange={handleChange}
      />
      <label htmlFor="horizontal">Horizontal</label>
      <input
        type="radio"
        name="mode"
        id="horizontal"
        value={`${ENTER_ACROSS_WORDS}`}
        onChange={handleChange}
      />
      <div className="wrapper">
        <Crossword mode={mode} />
      </div>
    </div>
  );
}

export default App;
