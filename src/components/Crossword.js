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
          <table
            className="relative w-fit m-auto table-fixed border-collapse"
            ref={wrapperRef}
            cellpadding="0"
            cellspacing="0"
            border="0"
            role="grid"
          >
            {grid.cellRows.map((row, i) => {
              return (
                <tr
                  key={row[i].id}
                  className="flex justify-center flex-wrap"
                  role="row"
                >
                  {row.map((cell) => {
                    if (cell.mode === PLAY_MODE || cell.mode === EDIT_MODE) {
                      return (
                        <CellContainer
                          key={cell.id}
                          cell={cell}
                          showPreview={togglePreview}
                          initialTabIndex={cell.id === "0:0" ? "0" : "-1"}
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
                </tr>
              );
            })}
          </table>
        </>
      )}
    </>
  );
};

export default Crossword;
