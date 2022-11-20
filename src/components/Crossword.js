import React, { useState } from "react";
import CellContainer from "./CellContainer";
import { useGridContext } from "../context/GridProvider";
import { DeadCell, ViewOnlyCell } from "./Cell";
import { EDIT_MODE, PLAY_MODE, VIEW_ONLY_MODE } from "../utils/constants";
import { Button } from "./Common";
import { useOutsideAlerter } from "../hooks/useOutside";

const Crossword = () => {
  const [togglePreview, setTogglePreview] = useState(false);
  const { grid } = useGridContext();
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  function handleTogglePreview() {
    setTogglePreview((showPreview) => !showPreview);
  }
  return (
    <>
      {!grid ? (
        <p>loading...</p>
      ) : (
        <>
          <div className="relative w-fit m-auto" ref={wrapperRef}>
            {grid.cellRows.map((row, i) => {
              return (
                <div key={i} className="flex justify-center flex-wrap">
                  {row.map((cell) => {
                    if (cell.mode === PLAY_MODE || cell.mode === EDIT_MODE) {
                      return (
                        <CellContainer
                          cell={cell}
                          showPreview={togglePreview}
                        />
                      );
                    } else if (cell.mode === VIEW_ONLY_MODE) {
                      return (
                        <ViewOnlyCell
                          key={cell.id}
                          displayNumber={cell.displayNumber}
                        >
                          {cell.value}
                        </ViewOnlyCell>
                      );
                    } else {
                      return <DeadCell key={cell.id} />;
                    }
                  })}
                </div>
              );
            })}
          </div>
          <Button onClick={handleTogglePreview}>Preview</Button>
        </>
      )}
    </>
  );
};

export default Crossword;
