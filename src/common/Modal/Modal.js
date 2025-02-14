import React, { useEffect, useRef } from "react";
import styles from "./Model.module.css";

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
        // style={{zIndex: onClose ? "-9" : "9999"}}
        className={`${styles.modal__wrap}`}
        onClick={onClose}
      >
        <div style={modalStyle} className={`${styles.modal} flex flex-col`}>
          <button
            onClick={onClose}
            className="ml-auto py-0 px-2"
            style={{ border: "none", background: "#e5e5e5" }}
          >
            <i
              class="fa-solid fa-xmark bold"
              style={{ color: "#444", fontSize: "14px" }}
            ></i>
          </button>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Modal;
