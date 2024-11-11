import React, { useState, useEffect } from "react";
import "./main.style.scss";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Sidebar";
import IndividualTracking from "../IndividualTracking";
import GroupTracking from "../GroupTracking";
const Main = _ref => {
  let {
    data,
    head
  } = _ref;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Sidebar, null), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '85%',
      boxSizing: 'border-box',
      float: 'left'
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "box p-3 w-85"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginLeft: '13px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-center fw-bold my-2"
  }, head ? "Individual Tracking" : "Group Tracking"), head ? /*#__PURE__*/React.createElement(IndividualTracking, {
    head: head
  }) : /*#__PURE__*/React.createElement(GroupTracking, {
    head: head
  }))))));
};
export default Main;