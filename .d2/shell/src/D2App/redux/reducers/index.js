import { combineReducers } from "redux";
import paginationReducer from "./paginationReducers";
import themeReducer from "./ThemeReducers";
import comminReducer from "./CommaonReducers";
import homeReducer from "./HomeReducers";
const rootReducer = combineReducers({
  pagination: paginationReducer,
  theme: themeReducer,
  common: comminReducer,
  home: homeReducer
});
export default rootReducer;