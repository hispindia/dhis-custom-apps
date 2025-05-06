import React from 'react';
import { useSelector } from 'react-redux';
import classes from '../.././App.module.css';
function ThemeWrapper(_ref) {
  let {
    children
  } = _ref;
  const themeValue = useSelector(state => {
    var _state$theme;
    return (_state$theme = state.theme) === null || _state$theme === void 0 ? void 0 : _state$theme.value;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: themeValue ? classes["dark-mode"] : classes["light-mode"]
  }, children);
}
export default ThemeWrapper;