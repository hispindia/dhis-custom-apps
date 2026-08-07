import React, { useLayoutEffect, useRef } from "react";

// Shrinks font-size until the content fits its fixed box. The box itself never
// changes size, so blank (empty) and data prints keep identical geometry.
const FitText = ({ children, min = 7.5, max = 10, step = 0.25, style }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fit = () => {
      let size = max;
      el.style.fontSize = `${size}pt`;
      // 0.97 safety factor absorbs minor screen/print font metric drift
      while (size > min && el.scrollWidth > el.clientWidth * 0.97) {
        console.log(size)
        size -= step;
        el.style.fontSize = `${size}pt`;
      }
    };
    fit();
    // re-fit once webfonts (Pyidaungsu) finish loading, and again just before print
    document.fonts?.ready?.then(fit).catch(() => {});
    window.addEventListener("beforeprint", fit);
    return () => window.removeEventListener("beforeprint", fit);
  }, [children, min, max, step]);

  return (
    <span ref={ref} className="cert-value" style={style}>
      {children}
    </span>
  );
};

export default FitText;
