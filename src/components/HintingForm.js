import React, { useState, useEffect } from "react";

const HINT_SIZE = "50";

// const HintingForm = ({ onSubmit }) => {
//   return (

//   );
// };

const HintingFormContainer = ({ grid }) => {
  const { startCellsWordsAcross, startCellsWordsDown } = grid;
  const handleSubmit = (event) => {
    event.preventDefault();
    console.table(acrossWordHintFields);
    console.table(downWordHintFields);
  };
  const [acrossWordHintFields, setAcrossWordHintFields] = useState([]);
  const [downWordHintFields, setDownWordHintFields] = useState([]);

  useEffect(() => {
    startCellsWordsAcross.forEach(({ acrossWord }) => {
      setAcrossWordHintFields((c) => {
        return [
          ...c,
          {
            hint: "",
            answer: acrossWord,
          },
        ];
      });
    });
  }, [startCellsWordsAcross]);

  useEffect(() => {
    startCellsWordsDown.forEach(({ downWord }) => {
      setDownWordHintFields((c) => {
        return [
          ...c,
          {
            hint: "",
            answer: downWord,
          },
        ];
      });
    });
  }, [startCellsWordsDown]);

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
