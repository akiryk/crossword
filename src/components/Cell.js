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
    <div className="relative">
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
        <span className="absolute left-0.5 top-px text-xs text-slate-600">
          {displayNumber}
        </span>
      )}
    </div>
  );
};
export default Cell;
