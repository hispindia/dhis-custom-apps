import { combineReducers } from "redux";
import { outreeReducer } from "./outree/outree.reducer";
import { sidebarReducer } from "./sidebar/sidebar.reducer";
import { mainReducer } from "./main/main.reducer";


export const rootReducer = combineReducers({
  outree: outreeReducer,
  sidebar: sidebarReducer,
  main: mainReducer
});
