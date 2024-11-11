import { MAIN_ACTION_TYPES } from "./main.reducer";
export const setStatus = bool => ({
  type: MAIN_ACTION_TYPES.SET_STATUS,
  payload: bool
});