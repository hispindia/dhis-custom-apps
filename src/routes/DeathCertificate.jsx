import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const styles = {
    body: {
        background: "#fff",
        padding: "2rem",
        fontFamily: "sans-serif",
    },
    container: {
        display: "flex",
        alignItems: "stretch",
        gap: '16px',
        width: "100%",
        maxWidth: "11.69in",
        boxSizing: "border-box"
    },
    leftPane: {
        width: '8.6cm',
        padding: '10px',
        boxSizing: 'border-box',
        color: 'black',
        fontSize: 11,
        borderRight: '2px dashed black',
    },
    rightPane: {
    flex: 1, // Allow the right pane to fill remaining space
    padding: '6px 10px',
    boxSizing: 'border-box',
    color: 'black',
    fontSize: 11
   },
   main: {
        width: "68%",
    },
    h2: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "0.5rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        gap: "350px",
    },
    section: {},
    p: {
        marginBottom: "0.25rem",
        marginTop: 0,
    },
    mt3: {
        marginTop: "0.75rem",
    },
    mt4: {
        marginTop: "1rem",
    },
    borderDotted: {
        display: "inline-block",
        borderBottom: "2px dotted black",
        verticalAlign: "middle",
    },
    borderSolid: {
        borderBottom: "2px solid black",
        width: "100%",
    },
    borderBlack: {
        borderBottom: "2px solid black",
        width: "100%"
    },
    borderGray: {
        borderBottom: "2px solid #e5e7eb",
        width: "100%",
    },
    w31: { width: "31%" },
    w24: { width: "6rem" },
    w32: { width: "8rem" },
    w3: { width: "0.75rem" },
    mt10: { marginTop: "2.5rem" },
    hr: {
        marginTop: "0.6rem",
        borderTop: "2px solid black",
        width: "100%",
    },
    hrGray: {
        marginTop: "1.25rem",
        borderTop: "2px solid #e5e7eb",
        width: "100%",
    },
    h3: {
        fontSize: "1rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "0.25rem",
    },
    table: {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        borderColor: "black",
        marginTop: "1rem",
        fontSize: "11px"
    },
    td: {
        width: "16.666%",
        padding: "0.2rem 0.25rem",
        verticalAlign: "top",
    },
    tdWide: {
        width: "33.333%",
        padding: "0.5rem 0.25rem",
        verticalAlign: "top",
    },
    pt4: { paddingTop: "1rem" },
    mt2: { marginTop: "0.5rem" },
    footer: {
        marginTop: "0rem",
        fontSize: "9.5px",
    },
    flex: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: "0.2rem",
    },
    w6: { width: "1.5rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    w20: { width: "5rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    w17: { width: "4.25rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    mt2Text: { marginTop: "0.15rem" },
    fontSemibold: { fontWeight: "600" },
};



const DeathCertificate = ({orgUnit, orgUnits, dataElements}) => {

    const { state } = useLocation();
    const [certificate, setCertificate] = useState(state?.record || null);
    const pdfRef = useRef();
    const {t, i18n} = useTranslation();
    
    const orgUnitObj = {};
    const currentDate = new Date().toLocaleDateString('en-GB');
    orgUnits.forEach(ou => {
        orgUnitObj[ou.id] = ou.name;
    })

    orgUnit = {
        ...orgUnit, 
        path: typeof orgUnit.path === "string" 
         ? orgUnit.path.split('/').map(ou => orgUnitObj[ou] ? orgUnitObj[ou] : ou)
         : []
    }
    const getCitizenshipDisplay = () => {
    const citizenship = certificate?.["JB1wN0sieDP"] || "";
    const nrc = certificate?.["wCN9fWzFtKE"] || ""; 
    const passport = certificate?.["abc3N24sieM"] || ""; 
    if (citizenship && (citizenship.toLowerCase().includes("Burmese"))) {
     return `${t("CITIZENSHIP_AND_NRC")} : ${citizenship} ${nrc}`;
     } else {
       return `${t("PASSPORT_NUMBER_FOR_NON_MYANMAR")} : ${passport}`;
     }
   };


    useEffect(() => {
        if (state?.record) {
            setCertificate(state.record);
        } else {
            setCertificate(null);
        }
    }, [state]);

    const handleDownloadPDF = () => {
        if (pdfRef.current) {
            const options = {
                margin: [0.3, 0.5, 0.3, 0.5], // [top, right, bottom, left] in inches
                filename: 'Death Certificate.pdf',
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'landscape', unit: 'in', format: 'a4' }
            };
            html2pdf().from(pdfRef.current).set(options).save();
        }
    };

    return (
  <div
    style={{
      background: "#fff",
      padding: 32,
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
        right: 16,
        zIndex: 10,
        padding: "8px 16px",
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Download PDF
    </button>

    <main
      ref={pdfRef}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={styles.container}>

        {/* LEFT PANE */}
        <aside style={styles.leftPane}>
          <h4 style={{ fontWeight: 600, textAlign: "left" }}>
            {t("DEATH_CERTIFICATE_COUNTERFOIL")}
          </h4>

          <div style={{ marginTop: "15px", fontSize: "15px" }}>
            <div style={{ fontWeight: 600 }}>{t("VR_103") || "V.R Form 203"}</div>

            <div style={{ marginTop: "38px" }}>
              <div>
                {t("PAGE_NUMBER")} 
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "192px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["PS99q9IRjKy"] || ""}
                </span>
              </div>

              <div style={{ marginTop: 8 }}>
                {t("BOOK_NUMBER")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "165px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["l0Pm3ydZ2om"] || ""}
                </span>
              </div>

              <div style={{ marginTop: 8 }}>
                {t("ENTRY_NUMBER")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
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
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "90px",
                    paddingLeft: "5px",
                  }}
                >
                  {orgUnitObj[certificate?.["orgUnit"]]}
                </span>
              </div>
              <div style={{ marginTop: 8 }}>
                {t("DATE_OF_REGISTRATION")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "90px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["occurredAt"] || ""}
                </span>
              </div>

            </div>
          </div>

          <div style={{ fontSize: 15, marginTop: "80px" }}>
            <div style={{ marginBottom: 10 }}>
              <div>
                {t("NAME_OF_DECEASED")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "160px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["RkPGXTudjFI"] || ""}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div>
                {t("SIGNATURE_OF_ISSUING_PERSON")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "100px",
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
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "117px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["JAU9NM7UqQP"] || ""}
                </span>
              </div>
            </div>

            <div>
              <p style={{ marginTop: 0 }}>
                {t("DATE_OF_ISSUE")}
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    verticalAlign: "middle",
                    paddingLeft: "5px",
                  }}
                >{currentDate}</span>
                /{" "}
                <span
                  style={{
                    display: "inline-block",
                    width: 24,
                    verticalAlign: "middle",
                  }}
                ></span>{" "}
                /
              </p>
            </div>
          </div>
        </aside>

        {/* RIGHT PANE */}
        <section style={styles.rightPane}>
          <h2 style={styles.h2}>{t("DEATH_CERTIFICATE")}</h2>

          {/* --- HEADER --- */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "0.5rem",
              color: "#000",
              backgroundColor: "#fff",
            }}
          >
            {/* Left section of header */}
            <section style={{ color: "#000", fontSize: 12, width: "50%" }}>
              <p style={{ marginBottom: 4, marginTop: 12 }}>
                {t("VR_Form_203")}
              </p>

              <div style={{ marginTop: "0.5rem" }}>
                <p style={{ marginBottom: 4, marginTop: 10 }}>
                  {t("STATE_REGION")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted black",
                      width: "31%",
                      verticalAlign: "middle",
                      marginLeft: 8,
                    }}
                  >
                    {orgUnit.path[2] || ""}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  {t("DISTRICT")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted black",
                      width: 90,
                      verticalAlign: "middle",
                      marginLeft: 8,
                    }}
                  >
                    {orgUnit.path[3] || ""}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  {t("TOWNSHIP")}
                  <span
                    style={{
                      display: "inline-block",
                      borderBottom: "2px dotted black",
                      width: 90,
                      verticalAlign: "middle",
                      marginLeft: 8,
                    }}
                  >
                    {orgUnit.path[4] || ""}
                  </span>
                </p>
              </div>
            </section>

            {/* Right section of header */}
            <section style={{ marginTop: 40, color: "#000", fontSize: 12, width: "35%" }}>
              <p>
                {t("PAGE_NUMBER")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    width: 60,
                    verticalAlign: "middle",
                    marginLeft: 8,
                  }}
                >
                  {certificate?.["PS99q9IRjKy"] || ""}
                </span>
              </p>

              <p>
                {t("BOOK_NUMBER")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    width: 60,
                    verticalAlign: "middle",
                    marginLeft: 8,
                  }}
                >
                  {certificate?.["l0Pm3ydZ2om"] || ""}
                </span>
              </p>

              <p>
                {t("ENTRY_NUMBER")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    width: 60,
                    verticalAlign: "middle",
                    marginLeft: 8,
                  }}
                >
                  {certificate?.["MrtKbjcsHnk"] || ""}
                </span>
              </p>

              <p style={{ marginBottom: 4, fontWeight: 'normal', whiteSpace: 'nowrap' }}>
                {t("DATE_OF_REGISTRATION")}
                <span
                  style={{
                    borderBottom: "2px dotted black",
                    width: 60,
                    verticalAlign: "middle",
                    marginLeft: 8,
                  }}
                >
                  {certificate?.["occurredAt"] || ""}
                </span>
              </p>
            </section>
          </header>

          <hr style={styles.hr} />

          <h3 style={styles.h3}>{t("PARTICULARS_OF_DECEASED")}</h3>

          <hr style={styles.hr} />

          {/* --- TABLE --- */}
          <table style={styles.table}>
            <tbody>
              <tr>
                <td style={styles.td}>
                  {t("1")}
                  {t("NAME")}: {certificate?.["aTbE3kYe98D"] || ""}
                </td>
                <td style={styles.td}>
                  {t("7")}
                  {t("RACE")}: {certificate?.["b9BVo7x8248"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("2")}
                  {t("GENDER")}: {certificate?.["wxrDsUO1ELy"] || ""}
                </td>
                <td style={styles.td}>
                  {t("8")}
                  {getCitizenshipDisplay()}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("3")}
                  {t("DATE_AND_TIME_OF_DEATH")}:{" "}
                  {certificate?.["jGGNvNYhu47"] || " "}{" "}{certificate?.["VldUFL2RpDz"] || " "}
                </td>
                <td style={styles.td}>
                  {t("9")}
                  {t("RELIGION")}: {certificate?.["TseVgVwxzx9"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("4")}
                  {t("PLACE_OF_DEATH")}: {certificate?.["MOV6uMBMkph"] || ""}
                </td>
                <td style={styles.td}>
                  {t("10")}
                  {t("PERMANENT_ADDRESS")}: {certificate?.["iXXvJAxbOtd"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("5")}
                  {t("AGE")}: {certificate?.["KFGxB6wpRxi"] || ""}
                </td>
                <td style={styles.td}>
                  {t("11")}
                  {t("NAME_OF_FATHER_DECEASED")}: {certificate?.["OpzRl6KIFVU"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("6")}
                  {t("OCCUPATION")}: {certificate?.["s3wKlMmBs8p"] || ""}
                </td>
                <td style={styles.td}>
                  {t("12")}
                  {t("NAME_OF_MOTHER_DECEASED")}:{" "}
                  {certificate?.["xHcmoS3icZD"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("13")}{t("CAUSE_OF_DEATH")}:
                  {dataElements["nQy5xQrOMXj"] &&
                  dataElements["nQy5xQrOMXj"][certificate["nQy5xQrOMXj"]]
                    ? dataElements["nQy5xQrOMXj"][certificate["nQy5xQrOMXj"]]
                    : ""}
                </td>
                <td>
                  {t("14")}{t("Informants_Signature")}:
                  {dataElements[""] &&
                  dataElements[""][certificate[""]]
                    ? dataElements[""][certificate[""]]
                    : ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("(a)_Name")}: {certificate?.["YdNUYjH3rct"] || ""}
                </td>
                <td style={styles.td}>
                  {t("(b)_Qualification")}: {certificate?.["YdNUYjH3rct"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("(c)_RELATION_TO_DECEASE")}: {certificate?.["qa5eIb216nF"] || ""}
                </td>
                <td style={{ ...styles.td, ...styles.pt4 }}>
                  {t("(d)_Address")}: {certificate?.["rRpqp6TPWlh"] || ""}
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("15")}
                  {t("CAUSE_OF_DEATH_CERTIFIERS")}:{" "}
                  {certificate?.["aTbE3kYe98D"] || ""}
                </td>
                <td style={styles.td}>
                  {t("SIGNATURE")} <span style={styles.w17}></span>
                </td>
              </tr>

              <tr>
                <td></td>
                <td style={styles.pt4}>
                  {t("NAME")}{" "}
                  <span style={styles.w17}>
                    {certificate?.["RkPGXTudjFI"] || ""}
                  </span>
                </td>
              </tr>

              <tr>
                <td></td>
                <td style={styles.pt4}>
                  {t("DESIGNATION")}{" "}
                  <span style={styles.w17}>
                    {certificate?.["NxtfpJnOOHx"] || ""}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* --- FOOTER --- */}
          <footer style={styles.footer}>
            <div>
              <p style={{ width: "100%", marginBottom: 2 }}>
                {t("DEAD_PARA1_VALIDATION")}
              </p>
              <p style={{ width: "100%", marginBottom: 0 }}>
                {t("DEAD_PARA2_VALIDATION")}
              </p>
            </div>

            <div style={styles.flex}>
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
                    /{" "}
                    <span style={{ display: "inline-block", width: 18 }}></span>{" "}
                    /
                  </p>
                </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <span style={styles.fontSemibold}>
                  {t("REGISTRATION_OFFICER")}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ ...styles.fontSemibold }}>
                  {t("SIGNATURE")} <span style={styles.w20}></span>
                </span>

                <span
                  style={{ ...styles.fontSemibold, ...styles.mt2Text }}
                >
                  {t("NAME")} <span style={styles.w20}>{certificate?.["bVyrfnpCd6i"]}</span>
                </span>

                <span
                  style={{ ...styles.fontSemibold, ...styles.mt2Text }}
                >
                  {t("DESIGNATION")}{" "}
                  <span style={styles.w20}>{certificate?.["qsIjbrXLBL5"]}</span>
                </span>
              </div>
            </div>
          </footer>
        </section>

      </div>
    </main>
  </div>
);

};
export default DeathCertificate;





