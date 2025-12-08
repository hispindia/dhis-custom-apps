import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
        width: '8 cm',
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
        padding: "0.1rem 0.25rem",
        verticalAlign: "top",
    },
    tdWide: {
        width: "33.333%",
        padding: "0.25rem 0.25rem",
        verticalAlign: "top",
    },
    pt4: { paddingTop: "0.25rem" },
    mt2: { marginTop: "0.5rem" },
    footer: {
        marginTop: "0rem",
        fontSize: "9.5px",
    },
    flex: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: "0.4rem",
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
    const [downloadCount, setDownloadCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [issueCount, setIssueCount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [hideBackArrow, setHideBackArrow] = useState(false);
    const pdfRef = useRef();
    const navigate = useNavigate();
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

  const ageElements = {
    days: "atkmpYCcz3x",
    hours: "zvmLxhbRqjY",
    months: "bQQ995GlXtQ",
    years: "MhXN2y88M4h"
  }

  const getAgeDisplay = (certificate) => {
    const check = (value, singular, plural) => {
      const num = Number(value);
      return num === 1 ? `${num} ${singular}` : `${num} ${plural}`;
    }
        if (certificate?.[ageElements.days]) {
          const v = certificate[ageElements.days];
          return check(v, "day", "days");
        }
        if (certificate?.[ageElements.hours]) {
          const v = certificate[ageElements.hours];
          return check(v, "hour", "hours");
        }  
        if (certificate?.[ageElements.months]) {
          const v = certificate[ageElements.months];
          return check(v, "month", "months");
        }
        if (certificate?.[ageElements.years]) {
          const v = certificate[ageElements.years];
          return check(v, "year", "years");
        }
         return ""; 
 };



    useEffect(() => {
        if (state?.record) {
            setCertificate(state.record);
        } else {
            setCertificate(null);
        }
    }, [state]);

    const handleIssueClick = () => {
      if(downloadCount >= 1){
        setShowModal(true);
        return;
      }
      handleDownloadPDF();
      setDownloadCount(prev => prev + 1);
    }
    const handleDownloadPDF = () => {
        setHideBackArrow(true);
        if (pdfRef.current) {
            const options = {
                margin: [0.3, 0.5, 0.3, 0.5], // [top, right, bottom, left] in inches
                filename: 'Death Certificate.pdf',
                html2canvas: { scale: 2 },
                jsPDF: { orientation: 'landscape', unit: 'in', format: 'a4' }
            };
            html2pdf().from(pdfRef.current).set(options).save();
            setIssueCount(prev => prev + 1);

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    const handleSubmitReason = () => {
      console.log('reason', reason);
      setShowModal(false);
      setReason(""); // Clear reason after submission
      handleDownloadPDF();
    }

    if (!certificate) return <div>No certificate data found.</div>;

    return (
  <>
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
      onClick={handleIssueClick}
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
       Issue Certificate {issueCount > 0 && `(${issueCount})`}
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
          {!hideBackArrow && (
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon style={{ color: 'black' }}/>
              <h4 style={{ fontWeight: 600, textAlign: "left", marginLeft: '8px', marginBottom: '0', marginTop: '0' }}>
                {t("DEATH_CERTIFICATE_COUNTERFOIL")}
              </h4>
          </div>
          )}

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
                  {orgUnitObj[certificate.orgUnit]}
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
                  {certificate?.["YdNUYjH3rct"] || ""}
                </span>
              </div>
            </div>

             <div style={{ marginBottom: 10 }}>
              <div>
                {t("PLACE_OF_DEATH")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "160px",
                    paddingLeft: "5px",
                  }}
                >
                  {certificate?.["MOV6uMBMkph"] || ""}
                </span>
              </div>
            </div>

             <div style={{ marginBottom: 10 }}>
              <div>
                {t("CAUSE_OF_DEATH")}
                <span
                  style={{
                    display: "inline-block",
                    borderBottom: "2px dotted black",
                    verticalAlign: "middle",
                    minWidth: "160px",
                    paddingLeft: "5px",
                  }}
                >
                {dataElements?.["nQy5xQrOMXj"][certificate?.["nQy5xQrOMXj"]]}
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

               <div style={{display: "flex"}}>
                  <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("DISTRICT")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted black', width: '30%', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
                </p>
                <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("TOWNSHIP")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted black', width: '30%', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[4] ? orgUnit.path[4]: ''}
                  </span>
                </p>
              </div>

              <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted black', width: '53px', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[5] ? orgUnit.path[5]: ''}
                  </span>
                </p>
              
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
                  {t("NAME")}:<span style={{marginLeft: "8px"}}>{certificate?.["aTbE3kYe98D"] || ""}</span>
                </td>
                <td style={styles.td}>
                  {t("7")}
                  {t("RACE")}:<span style={{marginLeft: "8px"}}>{certificate?.["b9BVo7x8248"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("2")}
                  {t("GENDER")}:<span style={{marginLeft: "8px"}}>{certificate?.["wxrDsUO1ELy"] || ""}</span>
                </td>
                <td style={styles.td}>
                  {t("8")}
                  {t("CITIZENSHIP_AND_NRC")} :
                  <span style={{marginLeft: "8px"}}>{getCitizenshipDisplay(dataElements["JB1wN0sieDP"][certificate["JB1wN0sieDP"]], certificate["YE1wx1a4Ky4"])}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("3")}
                  {t("DATE_AND_TIME_OF_DEATH")}:
                  <span style={{marginLeft: "8px"}}>{certificate?.["jGGNvNYhu47"] || " "}{" "}{certificate?.["VldUFL2RpDz"] || " "}</span>
                </td>
                <td style={styles.td}>
                  {t("9")}
                  {t("RELIGION")}:<span style={{marginLeft: "8px"}}>{certificate?.["TseVgVwxzx9"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("4")}
                  {t("PLACE_OF_DEATH")}:<span style={{marginLeft: "8px"}}>{certificate?.["MOV6uMBMkph"] || ""}</span>
                </td>
                <td style={styles.td}>
                  {t("10")}
                  {t("PERMANENT_ADDRESS")}:<span style={{marginLeft: "8px"}}>{certificate?.["iXXvJAxbOtd"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("5")}
                  {t("AGE")}:<span style={{marginLeft: "8px"}}>{getAgeDisplay(certificate)}</span>
                </td>
                <td style={styles.td}>
                  {t("11")}
                  {t("NAME_OF_FATHER_DECEASED")}: <span style={{marginLeft: "8px"}}>{certificate?.["OpzRl6KIFVU"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("6")}
                  {t("OCCUPATION")}:<span style={{marginLeft: "8px"}}>{certificate?.["s3wKlMmBs8p"] || ""}</span>
                </td>
                <td style={styles.td}>
                  {t("12")}
                  {t("NAME_OF_MOTHER_DECEASED")}:
                  <span style={{marginLeft: "8px"}}>{certificate?.["xHcmoS3icZD"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("13")}{t("CAUSE_OF_DEATH")}:
                   <span style={{marginLeft: "8px"}}>{dataElements?.["nQy5xQrOMXj"][certificate?.["nQy5xQrOMXj"]]}</span>
                </td>
                <td>
                  {t("14")}{t("Informants_Signature")}:
                  <span style={{marginLeft: "8px"}}>
                    {dataElements[""] &&
                  dataElements[""][certificate[""]]
                    ? dataElements[""][certificate[""]]
                    : ""}
                  </span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("(a)_Name")}:<span style={{marginLeft: "8px"}}>{certificate?.["YdNUYjH3rct"] || ""} </span>
                </td>
                <td style={styles.td}>
                  {t("(b)_Qualification")}: <span style={{marginLeft: "8px"}}>{certificate?.[""] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("(c)_RELATION_TO_DECEASE")}: <span style={{marginLeft: "8px"}}>{certificate?.["qa5eIb216nF"] || ""}</span>
                </td>
                <td style={{ ...styles.td, ...styles.pt4 }}>
                  {t("(d)_Address")}: <span style={{marginLeft: "8px"}}>{certificate?.["rRpqp6TPWlh"] || ""}</span>
                </td>
              </tr>

              <tr>
                <td style={styles.td}>
                  {t("15")}
                  {t("CAUSE_OF_DEATH_CERTIFIERS")}:
                  <span style={{marginLeft: "8px"}}>{certificate?.["aTbE3kYe98D"] || ""}</span>
                </td>
                <td style={styles.td}>
                  {t("SIGNATURE")} <span style={styles.w17}></span>
                </td>
              </tr>

              <tr>
                <td></td>
                <td style={styles.pt4}>
                  {t("NAME")}
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
                <div style={{ minWidth: "22%"}}>
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

    {showModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "24px 28px",
            borderRadius: 10,
            width: 360,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h3>Please provide the reason</h3>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason..."
            style={{
              width: "100%",
              height: 90,
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 12,
            }}
          />

          <button
            onClick={handleSubmitReason}
            style={{
              padding: "8px 16px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 4,
              width: "100%",
              fontWeight: "bold",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    )}

    {/* TOAST */}
    {showToast && (
      <div
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          background: "#333",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
          zIndex: 9999,
        }}
      >
        Certificate issued successfully
      </div>
    )}
  </>
  );

};
export default DeathCertificate;
