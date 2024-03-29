import React from "react";

export const SHARED_CELL_FONT_STYLES = "text-center text-xl uppercase";
export const SHARED_CELL_STYLES =
  "w-10 h-10 outline outline-1 outline-gray-400 border-none";

export const CellWrapper = ({ children, displayNumber }) => (
  <td className="relative" role="gridcell">
    {children}
    {!!displayNumber && (
      <span className="absolute left-0.5 top-px text-xs text-slate-600 pointer-events-none">
        {displayNumber}
      </span>
    )}
  </td>
);

export const DeadCell = () => (
  <td className={`${SHARED_CELL_STYLES}  bg-black`}></td>
);

export const ViewOnlyCell = ({ children, displayNumber }) => (
  <CellWrapper displayNumber={displayNumber}>
    <td
      className={`${SHARED_CELL_STYLES} ${SHARED_CELL_FONT_STYLES} bg-white flex justify-center items-center`}
      role="gridcell"
    >
      <span>{children}</span>
    </td>
  </CellWrapper>
);

const Cell = ({
  inputClasses,
  inputRef,
  value,
  onChange,
  onKeyDown,
  onClick,
  onFocus,
  displayNumber,
  onCompositionStart,
  onCompositionEnd,
  tabIndex,
}) => {
  return (
    <CellWrapper displayNumber={displayNumber}>
      <input
        className={inputClasses}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        ref={inputRef}
        onClick={onClick}
        onFocus={onFocus}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        tabIndex={tabIndex}
      />
    </CellWrapper>
  );
};

export default Cell;
