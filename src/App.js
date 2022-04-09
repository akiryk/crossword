import React, { useState } from "react";
import Crossword from "./components/Crossword";
import "./App.css";
import {
  MODES,
  CREATE_PATTERN,
  GO_LEFT_TO_RIGHT,
  GO_TOP_TO_BOTTOM,
} from "./utils/constants";

function App() {
  const [mode, setMode] = useState(CREATE_PATTERN);
  function handleChange(e) {
    const newMode = e.target.value;
    if (MODES.includes(newMode)) {
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
        value={`${GO_TOP_TO_BOTTOM}`}
        onChange={handleChange}
      />
      <label htmlFor="horizontal">Horizontal</label>
      <input
        type="radio"
        name="mode"
        id="horizontal"
        value={`${GO_LEFT_TO_RIGHT}`}
        onChange={handleChange}
      />
      <div className="wrapper">
        <Crossword mode={mode} />
      </div>
    </div>
  );
}

export default App;
