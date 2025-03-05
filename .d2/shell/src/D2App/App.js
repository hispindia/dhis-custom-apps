import React from "react";
import { DataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import classes from "./App.module.css";
import Home from "./Home";
const query = {
  me: {
    resource: "me"
  }
};
const MyApp = () => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DataQuery, {
  query: query
}, _ref => {
  let {
    error,
    loading,
    data
  } = _ref;
  if (error) return /*#__PURE__*/React.createElement("span", null, "ERROR");
  if (loading) return /*#__PURE__*/React.createElement("span", null, "...");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Home, null));
}));
export default MyApp;