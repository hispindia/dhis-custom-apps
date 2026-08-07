import React from "react";
import FitText from "./FitText";

// One label + value line inside a fixed-height box.
// - height: fixed row height (e.g. "6mm"); the row never grows with content.
// - lines=1: value stays on one line and auto-shrinks (FitText) instead of clipping.
// - lines=2: value wraps to at most two lines inside the fixed box.
// Label width depends only on its static text, so the value box position is
// identical whether the value is empty (blank sheet) or filled (data print).
const CertField = ({
  label,
  value,
  height,
  lines = 1,
  fit = true,
  min,
  max,
  labelStyle,
  valueStyle,
  style,
  className = "",
}) => (
  <div
    className={`cert-field${lines === 2 ? " cert-lines-2" : ""} ${className}`.trim()}
    style={{ height, ...style }}
  >
    <span className="cert-label" style={labelStyle}>
      {label}
    </span>
    {lines === 1 && fit ? (
      <FitText min={min} max={max} style={valueStyle}>
        {value}
      </FitText>
    ) : (
      <span className="cert-value" style={valueStyle}>
        {value}
      </span>
    )}
  </div>
);

export default CertField;
