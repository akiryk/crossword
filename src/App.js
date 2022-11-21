import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CrosswordMakerContainer from "./components/CrosswordMakerContainer";
import CrosswordPlayerContainer from "./components/CrosswordPlayerContainer";
import CrosswordPlayer2Container from "./components/CrosswordPlayer2Container";
import LandingPage from "./components/LandingPage";
import CrosswordContextProvider from "./context/CrosswordContextProvider";
import GridContextProvider from "./context/GridProvider";

function App() {
  return (
    <BrowserRouter>
      <CrosswordContextProvider>
        <GridContextProvider>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route index element={<LandingPage />} />
              <Route path="maker" element={<CrosswordMakerContainer />} />
              <Route path="player" element={<CrosswordPlayerContainer />} />
              <Route path="player2" element={<CrosswordPlayer2Container />} />
            </Route>
          </Routes>
        </GridContextProvider>
      </CrosswordContextProvider>
    </BrowserRouter>
  );
}

export default App;
