import React, { useEffect, useRef } from "react";
import styles from "./Model.module.css";
import CancelIcon from "@material-ui/icons/Cancel";
const Modal = _ref => {
  let {
    modalStyle,
    children,
    show,
    onClose,
    backdropStyle
  } = _ref;
  const modalRef = useRef(null);
  useEffect(() => {
    if (show) {
      modalRef.current.classList.add(styles.visible);
    } else {
      modalRef.current.classList.remove(styles.visible);
    }
  }, [show]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: modalRef,
    className: `${styles.modal__wrap}`
  }, /*#__PURE__*/React.createElement("div", {
    style: modalStyle,
    className: `${styles.modal} flex flex-col`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "ml-auto py-0 px-2",
    style: {
      border: "none",
      background: "#e5e5e5"
    }
  }, /*#__PURE__*/React.createElement(CancelIcon, {
    style: {
      marginLeft: "460px",
      cursor: "pointer"
    }
  })), children)));
};
export default Modal;