import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "./Grid";
import { SPAN } from "../utils/constants";
import { useCrosswordContext } from "../context/CrosswordContextProvider";

const HINT_SIZE = "50";

const HintingFormContainer = ({ grid }) => {
  const { startCellsWordsAcross, startCellsWordsDown } = grid;

  const { setGrid, setAcrossHints, setDownHints } = useCrosswordContext();
  const navigate = useNavigate();
  const [acrossWordHintFields, setAcrossWordHintFields] = useState([]);
  const [downWordHintFields, setDownWordHintFields] = useState([]);

  useEffect(() => {
    startCellsWordsAcross.forEach(({ acrossWord, displayNumber }) => {
      setAcrossWordHintFields((currentValue) => {
        return [
          ...currentValue,
          {
            displayNumber: displayNumber.toString(),
            hint: "",
            answer: acrossWord,
          },
        ];
      });
    });
  }, [startCellsWordsAcross]);

  useEffect(() => {
    startCellsWordsDown.forEach(({ downWord, displayNumber }) => {
      setDownWordHintFields((currentValue) => {
        return [
          ...currentValue,
          {
            displayNumber: displayNumber.toString(),
            hint: "",
            answer: downWord,
          },
        ];
      });
    });
  }, [startCellsWordsDown]);

  const handleSubmit = (event) => {
    event.preventDefault();
    Promise.resolve()
      .then(() => {
        const gameGrid = new Grid({
          crossSpan: SPAN,
          downSpan: SPAN,
          liveCellKeys: [],
        });
        grid.unsetValues();
        setGrid(grid);
        setAcrossHints(acrossWordHintFields);
        setDownHints(downWordHintFields);
      })
      .then(() => navigate("/player"));
  };

  const handleChangeAcrossWordHint = (event, index) => {
    const data = [...acrossWordHintFields];
    const value = event.target.value;
    data[index].hint = value;
    setAcrossWordHintFields(data);
  };

  const handleChangeDownWordHint = (event, index) => {
    const data = [...downWordHintFields];
    const value = event.target.value;
    data[index].hint = value;
    setDownWordHintFields(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {startCellsWordsAcross.map((cell, index) => {
        return (
          <div key={cell.acrossWord}>
            <span>{cell.displayNumber}: </span>
            <input
              type="text"
              placeholder={`add hint: ${cell.acrossWord}`}
              size={HINT_SIZE}
              name="hint"
              onChange={(event) => {
                handleChangeAcrossWordHint(event, index);
              }}
            />
          </div>
        );
      })}
      <p>----------------</p>
      {startCellsWordsDown.map((cell, index) => {
        return (
          <div key={cell.downWord}>
            <span>{cell.displayNumber}: </span>
            <input
              type="text"
              placeholder={`add hint: ${cell.downWord}`}
              size={HINT_SIZE}
              name="hint"
              onChange={(event) => {
                handleChangeDownWordHint(event, index);
              }}
            />
          </div>
        );
      })}
      <button>Submit</button>
    </form>
  );
};

export default HintingFormContainer;
