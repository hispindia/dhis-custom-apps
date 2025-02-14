
export const downloadPDF = (id) => {
  const element = document.getElementById(id);
  if (!element) {
    console.error("Element not found!");
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write("<html><head><title>Print</title>");

  document.querySelectorAll("link[rel='stylesheet'], style").forEach((style) => {
    doc.head.appendChild(style.cloneNode(true));
  });

  doc.write("</head><body>");
  doc.write(element.innerHTML);
  doc.write("</body></html>");
  doc.close();

  
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 500);
  };
};
