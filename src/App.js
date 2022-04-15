import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CrosswordMaker from "./components/CrosswordMaker";
import CrosswordPlayer from "./components/CrosswordPlayer";
import LandingPage from "./components/LandingPage";

function App() {
  console.log("App");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<LandingPage />} />
          <Route path="maker" element={<CrosswordMaker />} />
          <Route path="player" element={<CrosswordPlayer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Maker() {
  return <h2>Maker</h2>;
}

function Player() {
  return <h2>Player</h2>;
}

export default App;
