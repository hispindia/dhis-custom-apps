import { SET_THEME } from "../../constants";
import { createAction } from "./CreateActions";
export const themeManage = value => dispatch => {
  localStorage.setItem(SET_THEME, value);
  dispatch(createAction(SET_THEME, value));
};