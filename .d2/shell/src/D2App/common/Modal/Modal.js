import React, { useEffect, useRef } from "react";
import styles from "./Model.module.css";
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
    ref: modalRef
    // style={{zIndex: onClose ? "-9" : "9999"}}
    ,
    className: `${styles.modal__wrap}`,
    onClick: onClose
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
  }, /*#__PURE__*/React.createElement("i", {
    class: "fa-solid fa-xmark bold",
    style: {
      color: "#444",
      fontSize: "14px"
    }
  })), children)));
};
export default Modal;