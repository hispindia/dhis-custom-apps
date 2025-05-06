import { SET_SELETED_PROGRAM } from "../../constants";
const initialState = {
  selectedProgram: {}
};
function comminReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let {
    payload,
    type
  } = arguments.length > 1 ? arguments[1] : undefined;
  switch (type) {
    case SET_SELETED_PROGRAM:
      return {
        ...state,
        selectedProgram: payload
      };
    default:
      return state;
  }
}
export default comminReducer;