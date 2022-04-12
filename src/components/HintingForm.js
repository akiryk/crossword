import React from "react";

const HINT_SIZE = "50";

const HintingForm = ({ grid }) => {
  const { startCellsWordsAcross, startCellsWordsDown } = grid;
  return (
    <form>
      {startCellsWordsAcross.map((cell) => {
        console.log(cell);
        if (cell.acrossWord) {
          return (
            <div>
              <span>{cell.displayNumber}: </span>
              <input
                type="text"
                placeholder={`add hint: ${cell.acrossWord}`}
                size={HINT_SIZE}
              />
            </div>
          );
        }
      })}
      <p>----------------</p>
      {startCellsWordsDown.map((cell) => {
        console.log(cell);
        if (cell.downWord) {
          return (
            <div>
              <span>{cell.displayNumber}: </span>
              <input
                type="text"
                size={HINT_SIZE}
                placeholder={`add hint: ${cell.downWord}`}
              />
            </div>
          );
        }
      })}
    </form>
  );
};

export default HintingForm;
