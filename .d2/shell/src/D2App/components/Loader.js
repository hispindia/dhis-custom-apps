import React from "react";
import { CircularLoader } from "@dhis2/ui-core";
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // background fade
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    // Make sure it's on top
    backdropFilter: 'blur(4px)' // optional: adds a blur effect
  }
};
export const CunstomLoader = loading => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, loading ? /*#__PURE__*/React.createElement("div", {
    style: styles.overlay
  }, /*#__PURE__*/React.createElement(CircularLoader, null)) : "");
};