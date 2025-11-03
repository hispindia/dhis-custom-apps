import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const styles = {
    body: {
        background: "#fff",
        padding: "2rem",
        fontFamily: "sans-serif",
    },
    container: {
        display: "flex",
        alignItems: "flex-start",
    },
    main: {
        width: "68%",
    },
    h2: {
        fontSize: "2rem",
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
        marginTop: "1.25rem",
        borderTop: "2px solid black",
        width: "100%",
    },
    hrGray: {
        marginTop: "1.25rem",
        borderTop: "2px solid #e5e7eb",
        width: "100%",
    },
    h3: {
        fontSize: "1.125rem",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "1rem",
        marginBottom: "0.5rem",
    },
    table: {
        width: "100%",
        borderCollapse: "separate",
        borderSpacing: 0,
        borderColor: "black",
        marginTop: "0.5rem",
    },
    td: {
        width: "16.666%",
        padding: "0.5rem 0.25rem",
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
        marginTop: "1rem",
        fontSize: "0.95rem",
    },
    flex: {
        display: "flex",
        alignItems: "flex-start",
        marginTop: "1rem",
        justifyContent: "space-between",
    },
    fontSemibold: { fontWeight: "600" },
    w6: { width: "1.5rem", display: "inline-block", verticalAlign: "middle" },
    w20: { width: "5rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    w17: { width: "4.25rem", display: "inline-block", borderBottom: "2px dotted black", verticalAlign: "middle" },
    mt2Text: { marginTop: "0.5rem" },
};

const DeathCertificate = ({orgUnit, orgUnits, dataElements}) => {

    const { state } = useLocation();
    const [certificate, setCertificate] = useState(state?.record || null);
    const pdfRef = useRef();
    const {t, i18n} = useTranslation();
    const orgUnitObj = {};
    orgUnits.forEach(ou => {
        orgUnitObj[ou.id] = ou.name;
    })

    orgUnit = {
        ...orgUnit, 
        path: typeof orgUnit.path === "string" 
         ? orgUnit.path.split('/').map(ou => orgUnitObj[ou] ? orgUnitObj[ou] : ou)
         : []
    }


    useEffect(() => {
        if (state?.record) {
            setCertificate(state.record);
        } else {
            setCertificate(null);
        }
    }, [state]);

    const handleDownloadPDF = () => {
        if (pdfRef.current) {
            html2pdf()
                .set({ margin: 0.5, filename: 'Death Certificate.pdf', html2canvas: { scale: 2 } })
                .from(pdfRef.current)
                .save();
        }
    };


    return (
       
        <div style={{ background: "#fff", padding: 32, fontFamily: "sans-serif", width: "100%", display: "flex", position: "relative" }}>
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
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

        <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
            <h2 style={styles.h2}>{t("DC")} </h2>

        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: '#000', // Force black text
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "50%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal' }}>V.R. Form 203 ဖွားသေပုံစံ ၂၀၃</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal' }}>
               {t("S/d")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal' }}>
               {t("D")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal' }}>
               {t("T")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal' }}>
               {t("W/v")}
                  <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {certificate["hQnTVzOd0m9"] ||  ""}
                  </span>
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: '#000', fontSize: 16,  width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
             {t("PN")} 
              <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>{certificate?.["PS99q9IRjKy"] || ""}</span>
            </p>
            <p style={{ fontWeight: 'normal' }}>
              {t("BN")}
              
              <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                    {certificate?.["l0Pm3ydZ2om"] || ""}
                </span>
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
             {t("EN")}
              <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                    {certificate?.["MrtKbjcsHnk"] || ""}
                </span>
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
               {t("DR")} 

                  { <span style={{
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                  {certificate?.["occurredAt"] || ''}
                </span> }
              {/* <span style={{
                  display: 'inline-block',
                  width: 5,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> /
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> /
                <span style={{
                  display: 'inline-block',
                  width: 12,
                  borderBottom: '2px dotted black',
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
          </section>

        </header>

                    <hr style={styles.hr} />
                    <h3 style={styles.h3}> {t("PODec")}
                   
                    </h3>
                    <hr style={styles.hr} />

                    <table style={styles.table}>
                        <tbody>
                            <tr>
                                <td style={styles.td}>1. {t("N")}: {certificate?.["aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>7. {t("RC")}: {certificate?.["b9BVo7x8248"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>2. {t("S")}: {certificate?.["wxrDsUO1ELy"] || ""}</td>
                                <td style={styles.td}>8. {t("C")}: {certificate?.["JB1wN0sieDP"] || ""}</td>
                            </tr>
                           

                            <tr>
                                <td style={styles.td}>3. {t("DOD")}: {
                                typeof certificate?.["jGGNvNYhu47"] === "string" 
                                ? certificate["jGGNvNYhu47"].split(" ")[0]
                                : ""}
                                </td>
                                <td style={styles.td}>9. {t("R")}: {certificate?.["TseVgVwxzx9"] || ""}</td>
                            </tr>
                            
                            <tr>
                                <td style={styles.td}>4. {t("POD")}: {certificate?.["MOV6uMBMkph"] || ""}</td>
                                <td style={styles.td}>10. {t("PD")}: {certificate?.["iXXvJAxbOtd"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>5. {t("A")}: {certificate?.["KFGxB6wpRxi"] || ""}</td>
                                <td style={styles.td}>11.  {t("NFD")}: {certificate?.["OpzRl6KIFVU"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>6. {t("OC")}: {certificate?.["s3wKlMmBs8p"] || ""}</td>
                                <td style={styles.td}>12. {t("NMD")} : {certificate?.["xHcmoS3icZD"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>13. {t("COD")}: {(dataElements['nQy5xQrOMXj'] && dataElements['nQy5xQrOMXj'][certificate["nQy5xQrOMXj"]]) ? dataElements['nQy5xQrOMXj'][certificate["nQy5xQrOMXj"]] :  ""}</td>
                                <td></td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>14. {t("IS")}</td>
                                <td style={styles.td}>{t("RTD")}: {certificate?.["qa5eIb216nF"] || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ ...styles.td, ...styles.pt4 }}> {t("N")}: {certificate?.["YdNUYjH3rct"] || ""}</td>
                                <td style={{ ...styles.td, ...styles.pt4 }}> {t("AD")}: {certificate?.["rRpqp6TPWlh"] || ""}</td>
                            </tr>
                         
                            <tr>
                                <td style={styles.td}>15. {t("CODC")} :  {certificate?.["aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>
                                   {t("SIG")} <span style={styles.w17}></span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                    {t("N")} <span style={styles.w17}> {certificate?.["RkPGXTudjFI"] || ""}</span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                   {t("DG")} <span style={styles.w17}>{certificate?.["NxtfpJnOOHx"] || ""}</span>
                                </td>
                            </tr>
                           
                        </tbody>
                    </table>

                    <footer style={styles.footer}>
                        <div>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                              {t("DEAD_PARA1_VALIDATION")}
                            </p>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                                {t("DEAD_PARA2_VALIDATION")}
                            </p>
                        </div>
                        <div style={styles.flex}>
                            <div>
                                <p style={{ marginTop: 16, fontWeight: "600" }}>
                                    {t("DOI")} <span style={styles.w6}></span> / <span style={styles.w6}></span> /{" "}
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <span style={styles.fontSemibold}> {t("RO")} </span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={styles.fontSemibold}>
                                    {t("SIG")} <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                  {t("N")} <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                   {t("DG")}<span style={styles.w20}></span>
                                </span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
      
    )

};

export default DeathCertificate