import React from "react";
import CellContainer from "./CellContainer";
import { useGridContext } from "../context/GridProvider";
import { DeadCell, ViewOnlyCell } from "./Cell";
import { EDIT_MODE, PLAY_MODE, VIEW_ONLY_MODE } from "../utils/constants";
import { useOutsideAlerter } from "../hooks/useOutside";

const Crossword = ({ togglePreview }) => {
  const { grid } = useGridContext();
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <>
      {!grid ? (
        <p>loading...</p>
      ) : (
        <>
          <div className="relative w-fit m-auto" ref={wrapperRef}>
            {grid.cellRows.map((row, i) => {
              return (
                <div key={row[i].id} className="flex justify-center flex-wrap">
                  {row.map((cell) => {
                    if (cell.mode === PLAY_MODE || cell.mode === EDIT_MODE) {
                      return (
                        <CellContainer
                          key={cell.id}
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
        </>
      )}
    </>
  );
};

export default Crossword;
