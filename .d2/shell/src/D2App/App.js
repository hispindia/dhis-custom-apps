import React from "react";
import { DataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
// import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Provider } from "react-redux";
import store from "./redux/store";
import Home from "./pages/Home";
import ThemeWrapper from "./components/wrapper/ThemeWrapper";
const query = {
  me: {
    resource: "me"
  }
};
const MyApp = () => {
  return /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100 overflow-x-hidden"
  }, /*#__PURE__*/React.createElement(DataQuery, {
    query: query
  }, _ref => {
    let {
      error,
      loading,
      data
    } = _ref;
    if (error) return /*#__PURE__*/React.createElement("span", null, "ERROR");
    if (loading) return /*#__PURE__*/React.createElement("span", null, "...");
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ThemeWrapper, null, /*#__PURE__*/React.createElement(Home, null)));
  })));
};
export default MyApp;