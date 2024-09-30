import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { metaDataReducer } from "./metaData/metaData.reducer";
import { mainReducer } from "./main/main.reducer";

export const rootReducer = combineReducers({
  outree: outreeReducer,
  metadata: metaDataReducer,
  main: mainReducer
});
