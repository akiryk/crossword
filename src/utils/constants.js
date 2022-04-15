export const ANSWER_PHASE = "ANSWER_PHASE";
export const HINT_PHASE = "HINT_PHASE";
export const GO_TOP_TO_BOTTOM = "GO_TOP_TO_BOTTOM";
export const GO_BOTTOM_TO_TOP = "GO_BOTTOM_TO_TOP";
export const GO_LEFT_TO_RIGHT = "GO_LEFT_TO_RIGHT";
export const GO_RIGHT_TO_LEFT = "GO_RIGHT_TO_LEFT";
export const DIRECTION_MODES = [
  GO_TOP_TO_BOTTOM,
  GO_BOTTOM_TO_TOP,
  GO_LEFT_TO_RIGHT,
  GO_RIGHT_TO_LEFT,
];
export const PHASE_TITLES = {
  [ANSWER_PHASE]: "Create your puzzle!",
  [HINT_PHASE]: "Create Hints",
};
export const PHASE_DESCRIPTIONS = {
  [ANSWER_PHASE]: "Enter words and set dead areas",
  [HINT_PHASE]: "Enter for each of your answers",
};
export const SPAN = 7;
export const WHITE_CELL = "LIVE"; // a cell that you can make a guess about
export const BLACK_CELL = "DEAD"; // a "black" cell -- you can't guess it
