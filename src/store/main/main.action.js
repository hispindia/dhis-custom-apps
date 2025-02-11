import { MAIN_ACTION_TYPES } from "./main.reducer";

export const setState = (dataElements) => ({
  type: MAIN_ACTION_TYPES.SET_DATAELEMENTS,
  payload: dataElements,
})
export const setTab = (tab) => ({
  type: MAIN_ACTION_TYPES.SET_TAB,
  payload: tab,
})