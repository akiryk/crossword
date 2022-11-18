import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CrosswordMakerContainer from "./components/CrosswordMakerContainer";
import CrosswordPlayerContainer from "./components/CrosswordPlayerContainer";
import LandingPage from "./components/LandingPage";
import CrosswordContextProvider from "./context/CrosswordContextProvider";
import PlayHardcodedGame from "./components/PlayHardcodedGame";

function App() {
  return (
    <BrowserRouter>
      <CrosswordContextProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<LandingPage />} />
            <Route path="maker" element={<CrosswordMakerContainer />} />
            <Route path="player" element={<CrosswordPlayerContainer />} />
            <Route path="game" element={<PlayHardcodedGame />} />
          </Route>
        </Routes>
      </CrosswordContextProvider>
    </BrowserRouter>
  );
}

export default App;
