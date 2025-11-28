import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const borderDotted = {
  display: "inline-block",
  borderBottom: "2px dotted blue",
  verticalAlign: "middle",
};
const borderSolid = {
  borderBottom: "2px solid blue",
  width: "100%",
};
const borderGray = {
  borderBottom: "2px solid blue",
  width: "100%",
};

const borderBlack = {
  borderBottom: "2px dotted blue",
  width: "100%",
};

const styles = {
  container: {
    display: "flex",
    gap: "6px",
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
  },
  leftPane: {
    width: "8.3cm",
    padding: "8px",
    boxSizing: "border-box",
    color: "blue",
    fontSize: 11,
    borderRight: "none",
    flexShrink: 0,
  },
  // new shared style for the left column inside each table row
  leftColumn: {
    width: "25%",
    textAlign: "right", // align text to the right so it's close to separator
    color: "blue",
    fontWeight: 600,
    display: "flex",
    alignItems: "center", // vertically center labels
    justifyContent: "flex-end", // push text adjacent to separator
    paddingRight: 4, // minimal gap to dotted separator
    paddingTop: 6,
    paddingBottom: 6,
    borderRight: "2px dotted blue", // dotted vertical separator per-section
    boxSizing: "border-box",
  },
  separator: {
    // full-height separator between panes
    width: 0,
    alignSelf: "stretch",
    borderRight: "2px dotted blue",
    boxSizing: "border-box",
    margin: "0 4px", // small horizontal gap
  },
  rightPane: {
    flex: 1,
    padding: "6px",
    boxSizing: "border-box",
    color: "blue",
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    justifyContent: "space-between",
    lineHeight: 1.05,
  },
  // move dotted inline closer to label
  dottedLineInline: {
    display: "inline-block",
    borderBottom: "2px dotted blue",
    verticalAlign: "middle",
    minWidth: 24, // shorter field underline
    marginLeft: 4, // tighten distance from label
  },

  footerSmall: { fontSize: 9, color: "blue" }, // reduced footer font
};

const LateFoetalDeathCert = ({ orgUnit, orgUnits, dataElements }) => {
  // const {eventId} = useParams();
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const pdfRef = useRef();
  const { t } = useTranslation();
  const orgUnitObj = {};
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  orgUnits.forEach((ou) => {
    orgUnitObj[ou.id] = ou.name;
  });
  orgUnit = {
    ...orgUnit,
    path:
      typeof orgUnit.path === "string"
        ? orgUnit.path
            .split("/")
            .map((ou) => (orgUnitObj[ou] ? orgUnitObj[ou] : ou))
        : [],
  };

   const getCitizenshipDisplay = (citizenShip,nrc, passport) => {

    if(!citizenShip) {
      return passport ? `${passport}` : "";
    };
    const c = String(citizenShip).trim();
    const isMyanmar =
    c.toLowerCase().includes("myanmar") || c.toLowerCase().includes("burmese");
    if (isMyanmar) {
      return nrc ? `${c}, ${nrc}` : c;
    }

    return passport ? ` ${passport}` : c;
  };

  useEffect(() => {
    if (state?.record) {
      setCertificate(state.record);
    } else {
      setCertificate(null);
    }
  }, [state]);

  //if there is no certificate data
  if (!certificate) return <div>No certificate data found.</div>;

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    const el = pdfRef.current;
    el.style.overflow = "visible";
    //a4 content height
    const CM_TO_PX = 37.7952755906;
    const targetHeightPx = 19.1 * CM_TO_PX;

    //measuing actual rendered height
    const currHeight =
      el.getBoundingClientRect().height || el.offsetHeight || el.clientHeight;
    const scale = Math.min(1, targetHeightPx / currHeight);

    const prevTransform = el.style.transform;
    const prevTransformOrigin = el.style.transformOrigin;

    if (scale < 1) {
      el.style.transformOrigin = "top left";
      el.style.transform = `scale(${scale})`;
    }

    await new Promise((r) => requestAnimationFrame(r));

    try {
      const options = {
        margin: [0, 0, 0, 0],
        filename: "Late Foetal Death Certificate.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          orientation: "landscape",
          unit: "cm",
          format: "a4",
          compress: true,
        },
        pagebreak: { mode: ["avoid-all", "css"] },
      };
      await html2pdf().set(options).from(pdfRef.current).save();
    } finally {
      el.style.transform = prevTransform || "";
      el.style.transformOrigin = prevTransformOrigin || "";
      el.style.overflow = "";
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: 16,
        fontFamily: "sans-serif",
        width: "100%",
        display: "flex",
        position: "relative",
      }}
    >
      <button
        onClick={handleDownloadPDF}
        style={{
          position: "absolute",
          top: 16,
          right: 8,
          zIndex: 10,
          padding: "4px 8px",
          background: "#1976d2",
          color: "#000",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
         Issue Certificate
      </button>

      <main
        ref={pdfRef}
        style={{
          width: "27.7cm",
          height: "19.1cm",
          padding: "0.0cm 1.0cm 0.0cm 1.0cm",
          paddingTop: "0.8cm",
          paddingBottom: "1.1cm",
          margin: "0 auto",
          boxSizing: "border-box",
          background: "#fff",
          WebkitPrintColorAdjust: "exact",
          overflow: "visible",
        }}
      >
        <div style={styles.container}>
          <aside style={styles.leftPane}>
            <h4 style={{ fontWeight: 600, textAlign: "left" }}>
              {t("LATE_FOETAL_DEATH_CERTIFICATE_COUNTERFOIL")}
            </h4>

            <div style={{ marginTop: "15px", fontSize: "13px" }}>
              <div style={{ fontWeight: 600 }}>
                {t("VR_153") || "V.R Form 153"}
              </div>
              <div style={{ marginTop: "12px" }}>
                <div>
                  {t("PAGE_NUMBER")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "192px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["PS99q9IRjKy"] || ""}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}>
                  {t("BOOK_NUMBER")}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "165px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["l0Pm3ydZ2om"] || ""}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}>
                  {t("ENTRY_NUMBER")}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "152px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["MrtKbjcsHnk"] || ""}
                  </span>
                </div>
                 <div style={{ marginTop: 8 }}>
                  {t("PLACE_OF_REGISTRATION")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "136px",
                      paddingLeft: "5px",
                    }}
                  >
                    {orgUnitObj[certificate.orgUnit]}
                  </span>
                </div>
                <div style={{ marginTop: 8 }}>
                  {t("DATE_OF_REGISTRATION")}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "136px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["occurredAt"] || ""}
                  </span>
                </div>
               
              </div>
            </div>

            <div style={{ fontSize: 13, marginTop: "40px" }}>
              {" "}
              {/* reduced top gap and font */}
              <div style={{ marginBottom: 10 }}>
                <div>
                  {t("SEX")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "230px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["wxrDsUO1ELy"] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("DEATH_OF_BIRTH")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "140px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["zAetLzp3cT1"] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("PLACE_OF_BIRTH")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "180px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["JAU9NM7UqQP"] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("NAME_OF_FATHER")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "164px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["RKs8td9BnNj"] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("NAME_OF_MOTHER")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "140px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["UYmZMZt32hZ"] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("SIGNATURE_OF_ISSUING_PERSON")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "80px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.[""] || ""}
                  </span>
                </div>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div>
                  {t("NAME_OF_ISSUING_PERSON")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      verticalAlign: "middle",
                      minWidth: "100px",
                      paddingLeft: "5px",
                    }}
                  >
                    {certificate?.["l0Pm3ydZ2om"] || ""}
                  </span>
                </div>
              </div>
              <div>
                <p style={{ marginTop: 0 }}>
                  {t("DATE_OF_ISSUE")}{" "}
                  <span
                    style={{
                      display: "inline-block",
                      width: 24,
                      verticalAlign: "middle",
                      paddingLeft: "5px",
                    }}
                  > {currentDate}</span>
                </p>
              </div>
            </div>
          </aside>
          <div style={styles.separator} />
          <section style={styles.rightPane}>
            <h2
              style={{
                fontSize: 16,
                color: "blue",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 4,
                breakInside: "avoid",
                pageBreakInside: "avoid",
                WebkitColumnBreakInside: "avoid",
              }}
            >
              {t("LATE_FOETAL_DEATH_CERTIFICATE")}
            </h2>
          
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
                color: "blue",
                backgroundColor: "#fff",
              }}
            >
              {/* Left Section */}
              <section style={{ color: "#000", fontSize: 13, width: "30%" }}>
                <p
                  style={{
                    marginBottom: 2,
                    marginTop: 8,
                    fontWeight: "normal",
                    color: "blue",
                  }}
                >
                  {t("VR_153")}
                </p>
                <div>
                  <p
                    style={{
                      marginBottom: 2,
                      marginTop: 8,
                      fontWeight: "normal",
                      color: "blue",
                    }}
                  >
                    {t("STATE_REGION")}
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "2px dotted blue",
                        width: "31%",
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {orgUnit.path[2] ? orgUnit.path[2] : ""}
                    </span>
                  </p>
                </div>
                <div>
                  <p style={{ fontWeight: "normal", color: "blue" }}>
                    {t("DISTRICT")}
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "2px dotted blue",
                        width: "31%",
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {orgUnit.path[3] ? orgUnit.path[3] : ""}
                    </span>
                  </p>
                </div>

                <div>
                  <p style={{ fontWeight: "normal", color: "blue" }}>
                    {t("TOWNSHIP")}
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "2px dotted blue",
                        width: "31%",
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {orgUnit.path[4] ? orgUnit.path[4] : ""}
                    </span>
                  </p>
                </div>
              </section>

              {/* Right Section */}
              <section
                style={{
                  marginTop: 16,
                  color: "blue",
                  fontSize: 13,
                  width: "30%",
                }}
              >
                <p style={{ fontWeight: "normal" }}>
                  {t("PAGE_NUMBER")}
                  {
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "2px dotted blue",
                        width: "31%",
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {certificate?.["PS99q9IRjKy"] || ""}
                    </span>
                  }
                </p>
                <p style={{ fontWeight: "normal", color: "blue" }}>
                  {t("BOOK_NUMBER")}

                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted blue",
                      width: 60,
                      verticalAlign: "middle",
                      marginLeft: 8,
                    }}
                  >
                    {certificate?.["l0Pm3ydZ2om"] || ""}
                  </span>
                </p>
                <p
                  style={{
                    marginBottom: 4,
                    fontWeight: "normal",
                    color: "blue",
                  }}
                >
                  {t("ENTRY_NUMBER")}
                  {
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: "2px dotted blue",
                        width: 60,
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {certificate?.["MrtKbjcsHnk"] || ""}
                    </span>
                  }
                </p>
                <p
                  style={{
                    marginBottom: 4,
                    fontWeight: "normal",
                    color: "blue",
                  }}
                >
                  {t("DATE_OF_REGISTRATION")}

                  {
                    <span
                      style={{
                        borderBottom: "2px dotted blue",
                        width: 60,
                        verticalAlign: "middle",
                        marginLeft: 8,
                      }}
                    >
                      {certificate?.["occurredAt"] || ""}
                    </span>
                  }
                </p>
              </section>
            </header>

            <div style={{ marginTop: 6, width: "100%" }}>
              {/* Particular of Child */}
              <div>
                <div style={borderSolid}></div>
                <div style={{ display: "flex" }}>
                  <div style={styles.leftColumn}>
                    {t("PARTICULARS_OF_CHILD")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("1")}{t("SEX")}: {certificate?.["wxrDsUO1ELy"] || ""}
                      </div>{" "}
                      {/* Name - 1 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("3")}{t("PLACE_OF_BIRTH")}:{" "}
                        {certificate?.["JAU9NM7UqQP"] || ""}
                      </div>{" "}
                      {/* dob 0th index */}
                    </div>

                    <div
                      style={{ ...borderBlack, marginBottom: "4px 6px" }}
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                    >
                        {t("2")}{t("DATE_AND_TIME_OF_BIRTH")}:
                        {certificate?.["zAetLzp3cT1"]} {" "} {certificate?.["uOK1Wcm91NB"] || ""}
                      </div>{" "}
                      {/* gender - 2 index */}
                      {/* <div style={{ width: "50%", color: 'blue' }}>4. Place of Birth: {certificate?.["JAU9NM7UqQP"] || ""}</div> 4 index */}
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Father */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={styles.leftColumn}>
                    {t("PATICULAR_OF_FATHER")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("4")}{t("NAME")}: {certificate?.["RKs8td9BnNj"] || ""}
                      </div>{" "}
                      {/*  5 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("7")}{t("RELIGION")}: {certificate?.["m4b4SSlipKJ"] || ""}
                      </div>{" "}
                      {/*  8 index */}
                    </div>
                    <div style={{ ...borderBlack, marginBottom: "4px" }}></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("5")}{t("RACE")}: {certificate?.["mIRVmCzC7Tt"] || ""}
                      </div>{" "}
                      {/*  6 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("8")}{t("OCCUPATION")}:{" "}
                        {certificate?.["CjjgDMbqfXX"] || ""}
                      </div>{" "}
                      {/*  9 index */}
                    </div>
                    <div style={{ ...borderBlack, marginBottom: "4px" }}></div>
                    <div>
                      <div
                        style={{
                          width: "50%",
                          padding: "2px 6px",
                          color: "blue",
                        }}
                      >
                        {t("6")}{t("CITIZENSHIP_AND_NRC")}:{" "}
                        {getCitizenshipDisplay(certificate["ed2RBrhMhnN"],certificate["Fwa7gEzjZAH"], certificate["YE1wx1a4Ky4"])}
                      </div>{" "}
                      {/*  7 index */}
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Mother */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={styles.leftColumn}>
                    {t("PARTICULAR_OF_MOTHER")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("9")}{t("NAME")}: {certificate?.["UYmZMZt32hZ"] || ""}
                      </div>{" "}
                      {/*  10 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                         {t("12")}{t("RELIGION")}:{" "}
                        {certificate?.["QsUp6BSb8Du"] || ""}
                      </div>{" "}
                      {/*  13 index */}
                    </div>
                    <div style={{ ...borderBlack, marginBottom: "4px" }}></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "2px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 2,
                          color: "blue",
                        }}
                      >
                        {t("10")}{t("RACE")}: {certificate?.["XFmGvaRAJqP"] || ""}
                      </div>{" "}
                      {/*  11 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("13")}{t("OCCUPATION")}:{" "}
                        {certificate?.["vg5hhREmzXe"] || ""}
                      </div>{" "}
                      {/*  14 index */}
                    </div>
                    <div style={{ ...borderBlack, marginBottom: "4px" }}></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div style={{ width: "50%", color: "blue" }}>
                         {t("11")}{t("CITIZENSHIP_AND_NRC")}:{" "}
                        {getCitizenshipDisplay(certificate["r8oFvT4PZwL"],certificate["M8pvzjPdija"], certificate["CowkFxAoqnl"])}
                      </div>{" "}
                      {/*  12 index */}
                      <div style={{ width: "50%", color: "blue" }}>
                        {t("14")}{t("PERMANENT_ADDRESS")}:{" "}
                        {certificate?.["bVyrfnpCd6i"] || ""}
                      </div>{" "}
                      {/*  15 index */}
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of person who certify that the child was still born */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={styles.leftColumn}>
                    {t("PARTICULAR_OF_PERSON")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("SIGNATURE")}: {certificate?.[""] || ""}
                      </div>{" "}
                      {/*  10 index */}
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {" "}
                        {t("QUALIFICATION")}: {certificate?.[""] || ""}
                      </div>{" "}
                      {/*  13 index */}
                    </div>
                    <div style={{ ...borderBlack, marginBottom: "4px" }}></div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                          paddingBottom: 4,
                          color: "blue",
                        }}
                      >
                        {t("NAME")}: {certificate?.[""] || ""}
                      </div>{" "}
                      {/*  14 index */}
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Informant */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={styles.leftColumn}>
                    {t("PARTICULAR_OF_INFORMANT")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                      }}
                    >
                      <div style={{ width: "50%", color: "blue" }}>
                        {" "}
                        {t("SIGNATURE")}:{" "}
                        {certificate?.[""] || ""}
                      </div>
                      <div style={{ width: "50%", color: "blue" }}>
                        {" "}
                        {t("RELATION_TO_CHILD")}:
                        {certificate?.["eYh3U6sXrTQ"] || ""}{" "}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        paddingTop: "4px",
                      }}
                    >
                      <div
                        style={{ width: "50%", padding: "4px", color: "blue" }}
                      >
                        {t("NAME")}:{" "}
                        {certificate?.["YdNUYjH3rct"] || ""}
                      </div>
                      <div
                        style={{ width: "50%", padding: "4px", color: "blue" }}
                      >
                        {" "}
                        {t("ADDRESS")} :
                        {certificate?.["rRpqp6TPWlh"] || ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={borderSolid}></div>
              </div>
            </div>

            {/* Footer */}
            <footer
              style={{
                breakInside: "avoid",
                pageBreakInside: "avoid",
                WebkitColumnBreakInside: "avoid",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  lineHeight: 1.2,
                }}
              >
                <p
                  style={{
                    width: "100%",
                    color: "blue",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {t("STILL_BORN_PARA1_VALIDATION")}
                </p>

                <p
                  style={{
                    width: "100%",
                    color: "blue",
                    display: "block",
                    marginBottom: 10,
                  }}
                >
                  {t("STILL_BORN_PARA2_VALIDATION")}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginTop: 8,
                  color: "blue",
                }}
              >
                {/* Date of Issue */}
                <div style={{ minWidth: "22%" }}>
                  <p
                    style={{
                      marginTop: 0,
                      fontWeight: 600,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("DATE")}
                    <span
                      style={{
                        display: "inline-block",
                        width: 18,
                        marginLeft: 6,
                      }}
                    >{currentDate}</span>
                  </p>
                </div>

                {/* Registration Officer Label */}
                <div
                  style={{
                    minWidth: "22%",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("REGISTRATION_OFFICER")}
                </div>

                {/* Registrar’s Signature / Name / Designation */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minWidth: "22%",
                    maxWidth: "22%",
                  }}
                >
                  {/* Signature */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ marginRight: 6 }}>
                      {t("SIGNATURE")}
                    </span>
                    <span
                      style={{
                        ...borderDotted,
                        width: "70px",
                        display: "inline-block",
                      }}
                    ></span>
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ marginRight: 6 }}>
                      {t("NAME")}
                    </span>
                    <span
                      style={{
                        ...borderDotted,
                        width: "70px",
                        display: "inline-block",
                      }}
                    >{certificate?.["B1QxOlRIEVk"]}</span>
                  </div>

                  {/* Designation */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 10,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ marginRight: 6 }}>
                      {t("DESIGNATION")}
                    </span>
                    <span
                      style={{
                        ...borderDotted,
                        width: "70px",
                        display: "inline-block",
                      }}
                    >{certificate?.["qsIjbrXLBL5"]}</span>
                  </div>
                </div>
              </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LateFoetalDeathCert;
