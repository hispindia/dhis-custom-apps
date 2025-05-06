import { SET_THEME } from "../../constants";
const initialState = {
  value: false
};
function themeReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let {
    payload,
    type
  } = arguments.length > 1 ? arguments[1] : undefined;
  switch (type) {
    case SET_THEME:
      return {
        ...state,
        value: payload
      };
    default:
      return state;
  }
}
export default themeReducer;