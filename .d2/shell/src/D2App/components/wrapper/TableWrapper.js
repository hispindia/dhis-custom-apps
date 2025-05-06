function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { useSelector } from 'react-redux';
import classes from '../.././App.module.css';
export function TableWrapperTH(_ref) {
  let {
    children
  } = _ref;
  const {
    value: themeValue
  } = useSelector(state => state.theme);
  return /*#__PURE__*/React.createElement("th", {
    className: `${themeValue ? classes["dark-mode"] : classes["light-mode"]} text-nowrap`
  }, children);
}
export function TableWrapperTR(_ref2) {
  let {
    children
  } = _ref2;
  return /*#__PURE__*/React.createElement("tr", {
    className: "text-center"
  }, children);
}
export function TableWrapperTD(_ref3) {
  let {
    children,
    style = {},
    ...rest
  } = _ref3;
  const {
    value: themeValue
  } = useSelector(state => state.theme);
  return /*#__PURE__*/React.createElement("td", _extends({}, rest, {
    style: {
      ...style
    },
    className: `${themeValue ? classes["dark-mode"] : classes["light-mode"]} text-nowrap`
  }), children);
}