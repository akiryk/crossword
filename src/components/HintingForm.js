import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCrosswordContext } from "../context/CrosswordContextProvider";
import { useGridContext } from "../context/GridProvider";
import { StyledButton } from "../components/Common";

const HINT_SIZE = "50";

const HintingFormContainer = () => {
  const {
    grid,
    setCellsForPlayerMode,
    startCellsWordsAcross,
    startCellsWordsDown,
  } = useGridContext();
  const { setAcrossHints, setDownHints } = useCrosswordContext();
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
        setCellsForPlayerMode();
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

  if (!grid) {
    return <>loading...</>;
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl  mx-auto">
      <div className="flex justify-between">
        <div className="">
          <h2>Across Hints</h2>
          <div>
            {startCellsWordsAcross.map((cell, index) => {
              return (
                <div key={cell.acrossWord} className="flex items-center my-2">
                  <label
                    for={`acrossHintFor${cell.id}`}
                    className="block text-sm font-medium text-gray-900 dark:text-black mr-5 w-2"
                  >
                    {cell.displayNumber}
                  </label>
                  <input
                    type="text"
                    placeholder={`add hint: ${cell.acrossWord}`}
                    size={HINT_SIZE}
                    name="hint"
                    onChange={(event) => {
                      handleChangeAcrossWordHint(event, index);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2>Down Hints</h2>
          <div>
            {startCellsWordsDown.map((cell, index) => {
              return (
                <div key={cell.downWord} className="flex items-center my-2">
                  <label
                    for={`downHintFor${cell.id}`}
                    className="block text-sm font-medium text-gray-900 dark:text-black mr-5 w-2"
                  >
                    {cell.displayNumber}
                  </label>
                  <input
                    type="text"
                    placeholder={`add hint: ${cell.acrossWord}`}
                    size={HINT_SIZE}
                    name="hint"
                    onChange={(event) => {
                      handleChangeAcrossWordHint(event, index);
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <StyledButton>Play The Game!</StyledButton>
    </form>
  );
};

export default HintingFormContainer;
