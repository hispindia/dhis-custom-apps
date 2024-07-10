import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { mainReducer } from "./main/main.reducer";
export const rootReducer = combineReducers({
  outree: outreeReducer,
  main: mainReducer
});
