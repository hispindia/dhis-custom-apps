// Shared <style> payload for the three certificate pages.
// Kept as a per-route <style> tag (not a global stylesheet) so the aggressive
// html/body print overrides never leak into other app routes.
//
// Layout-invariance contract: the geometry of the page must be identical
// whether the .cert-value spans are empty (blank label sheet) or filled
// (data-only print), because data is printed onto pre-printed blank sheets.
// Every row has a fixed height, labels have deterministic (static-text) width,
// and values live in fixed boxes that shrink or clamp their ink — never grow.
export const buildCertificateCss = () => `
  @page {
    size: A4 landscape;
    margin: 0;
  }

  /* ── page box: single source of truth for screen AND print ── */
  .cert-page {
    box-sizing: border-box;
    padding: 4mm 5mm 3mm 5mm;
  }
  /* Same font rendering on screen and in print, so the on-screen preview and
     FitText measurements match the printed output exactly. */
  .cert-page,
  .cert-page * {
    font-weight: 300 !important;
    font-synthesis: none !important;
    font-synthesis-weight: none !important;
    -webkit-font-smoothing: antialiased !important;
    -webkit-text-stroke: 0 transparent !important;
    text-rendering: optimizeLegibility !important;
  }

  /* ── label + value line inside a fixed-height box ── */
  .cert-field {
    display: flex;
    align-items: baseline;
    min-width: 0;
    overflow: hidden;
    box-sizing: border-box;
  }
  .cert-label {
    flex: 0 0 auto;
    white-space: nowrap;
    margin-right: 1.5mm;
  }
  .cert-field > .cert-value {
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
  }
  .cert-field.cert-lines-2 {
    align-items: flex-start;
  }
  .cert-field.cert-lines-2 > .cert-value {
    white-space: normal;
    line-height: 1.35; /* headroom for Myanmar stacked diacritics */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  @media print {
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 297mm !important;
      height: 210mm !important;
      max-height: 210mm !important;
      overflow: hidden !important;
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cert-wrapper {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      min-height: 0 !important;
      height: auto !important;
      overflow: hidden !important;
    }
    .no-print { display: none !important; }
    header,
    [class*="headerbar"],
    [class*="HeaderBar"],
    [data-test*="headerbar"],
    .dhis2-ui-headerbar,
    .jsx-headerbar {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
    }
    .cert-page {
      margin: 0 !important;
      box-shadow: none !important;
      page-break-inside: avoid !important;
      page-break-after: avoid !important;
      overflow: hidden !important;
      width: 297mm !important;
      height: 210mm !important;
      max-height: 210mm !important;
    }
    /* data-only print: hide everything except the data ink */
    .print-data-only .cert-page,
    .print-data-only .cert-page * {
      visibility: hidden !important;
    }
    .print-data-only .cert-page .cert-value,
    .print-data-only .cert-page .cert-value * {
      visibility: visible !important;
    }
    /* per-printer trim for mechanical feed offset */
    .print-data-only .cert-page {
      transform: translate(var(--dataonly-offset-x, 0mm), var(--dataonly-offset-y, 0mm)) !important;
    }
  }

  @media screen {
    .cert-page {
      box-shadow: 0 1px 8px rgba(0,0,0,0.12);
      margin: 12px auto;
    }
    /* "Preview Data Fit" QA mode: show the fixed field boxes and value ink */
    .preview-data-only .cert-field {
      outline: 1px dashed #7e57c2;
      outline-offset: -1px;
    }
    .preview-data-only .cert-value {
      outline: 1px solid #d500f9;
      background: rgba(255, 235, 59, 0.35);
    }
  }
`;

export default buildCertificateCss;
