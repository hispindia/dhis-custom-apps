
import React, { useEffect, useRef } from "react";
import styles from "./Model.module.css";

import CancelIcon from "@material-ui/icons/Cancel";
const Modal = ({ modalStyle, children, show, onClose, backdropStyle }) => {
  const modalRef = useRef(null);
  useEffect(() => {
    if (show) {
      modalRef.current.classList.add(styles.visible);
    } else {
      modalRef.current.classList.remove(styles.visible);
    }
  }, [show]);
  return (
    <React.Fragment>
      <div
        ref={modalRef}
        className={`${styles.modal__wrap}`}
      >
        <div style={modalStyle} className={`${styles.modal} flex flex-col`}>
          <button
            onClick={onClose}
            className="ml-auto py-0 px-2"
            style={{ border: "none", background: "#e5e5e5" }}
          >

            <CancelIcon style={{ marginLeft: "460px", cursor: "pointer" }} />
          </button>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
