import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from "react-redux";
import { InitialQuery } from "./constants";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { store } from "./store/store";
import Main from './components/Main';
const MyApp = () => {
  // Simulating data query
  const {
    loading,
    error,
    data
  } = useDataQuery(InitialQuery);
  if (error) {
    return /*#__PURE__*/React.createElement("span", null, "ERROR: ", error.message);
  }
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "h-100 d-flex align-items-center justify-content-center"
    }, /*#__PURE__*/React.createElement(CircularLoader, null));
  }
  return /*#__PURE__*/React.createElement(Provider, {
    store: store
  }, /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(Main, {
      data: data,
      head: true
    })
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/group",
    element: /*#__PURE__*/React.createElement(Main, {
      data: data,
      head: false
    })
  }))));
};
export default MyApp;