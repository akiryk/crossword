import React from "react";

const Cell = ({
  inputClasses,
  inputRef,
  value,
  onChange,
  onKeyDown,
  onClick,
  onFocus,
  displayNumber,
}) => {
  return (
    <div className="cellWrapper">
      <input
        className={inputClasses}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={value}
        ref={inputRef}
        onClick={onClick}
        onFocus={onFocus}
      />
      {!!displayNumber && (
        <span className="displayNumber">{displayNumber}</span>
      )}
    </div>
  );
};
export default Cell;
