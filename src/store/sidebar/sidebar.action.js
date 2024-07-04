import { SIDEBAR_ACTION_TYPES } from "./sidebar.reducer";

export const setTitle = (dataSets) => ({
  type: SIDEBAR_ACTION_TYPES.SET_TITLE,
  payload: dataSets,
});
