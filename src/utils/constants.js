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
export const SPAN = 5;
export const HIGHEST_INDEX = SPAN - 1;
export const HIGHEST_X_INDEX = SPAN - 1;
export const HIGHEST_Y_INDEX = SPAN - 1;

// Cell Modes
export const EDIT_MODE = "EDIT_MODE";
export const PLAY_MODE = "PLAY_MODE";
export const VIEW_ONLY_MODE = "VIEW_ONLY_MODE";
export const DEAD_CELL_MODE = "DEAD_CELL_MODE";
