import React from 'react';
export default function ModelComponent(_ref) {
  let {
    setOpen,
    open,
    title = '',
    actionType,
    children,
    actionFunctionCallBack = null
  } = _ref;
  return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show d-block",
    tabIndex: "-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, title || ''), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: () => setOpen(false)
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, children || ''), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setOpen(false)
  }, "Close"), actionType && /*#__PURE__*/React.createElement("button", {
    onClick: () => actionFunctionCallBack(),
    type: "button",
    className: "btn btn-success"
  }, actionType || '', " "))))));
}