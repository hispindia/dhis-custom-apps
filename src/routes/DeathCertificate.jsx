import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { useLocation, useParams } from "react-router-dom";

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

const DeathCertificate = ({orgUnit, orgUnits}) => {

    const { state } = useLocation();
    const [certificate, setCertificate] = useState(state?.record || null);
    const pdfRef = useRef();
    const orgUnitObj = {};
    orgUnits.forEach(ou => {
        orgUnitObj[ou.id] = ou.name;
    })

    orgUnit = {
        ...orgUnit, 
        path: orgUnit.path.split('/').map(ou => orgUnitObj[ou] ? orgUnitObj[ou] : ou)
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
            <h2 style={styles.h2}>DEATH CERTIFICATE</h2>

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
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal' }}>V.R. Form 203</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal' }}>
                State / Division
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
                District 
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
                Township 
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
                Ward / Village-tract ............
                  {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: 90,
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : ''}
                  </span> */}
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: '#000', fontSize: 16,  width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
              Page No............
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ fontWeight: 'normal' }}>
              Book No............
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
              Entry No...........
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal' }}>
              Date of Registration..../.../
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
                    <h3 style={styles.h3}>Particulars of Deceased</h3>
                    <hr style={styles.hr} />

                    <table style={styles.table}>
                        <tbody>
                            <tr>
                                <td style={styles.td}>1. Name: {certificate?.["FL9N3yXzucT.aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>7. Race: {certificate?.["FL9N3yXzucT.b9BVo7x8248"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>2. Sex: {certificate?.["FL9N3yXzucT.wxrDsUO1ELy"] || ""}</td>
                                <td style={styles.td}>8. Citizenship: {certificate?.["FL9N3yXzucT.aTbE3kYe98D"] || ""}</td>
                            </tr>
                           

                            <tr>
                                <td style={styles.td}>3. Date of death: {certificate?.["FL9N3yXzucT.jGGNvNYhu47"] ? certificate["FL9N3yXzucT.jGGNvNYhu47"].split(" ")[0]: ""}</td>
                                <td style={styles.td}>9. Religion: {certificate?.["FL9N3yXzucT.b9BVo7x8248"] || ""}</td>
                            </tr>
                            
                            <tr>
                                <td style={styles.td}>4. Place of death: {certificate?.["FL9N3yXzucT.MOV6uMBMkph"] || ""}</td>
                                <td style={styles.td}>10. Permanent Address: {certificate?.["FL9N3yXzucT.iXXvJAxbOtd"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>5. Age: {certificate?.["FL9N3yXzucT.KFGxB6wpRxi"] || ""}</td>
                                <td style={styles.td}>11. Name of Father of the deceased: {certificate?.["FL9N3yXzucT.OpzRl6KIFVU"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>6. Occupation: {certificate?.["FL9N3yXzucT.s3wKlMmBs8p"] || ""}</td>
                                <td style={styles.td}>12. Name of Mother of the deceased: {certificate?.["FL9N3yXzucT.xHcmoS3icZD"] || ""}</td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>13. Cause of Death: {certificate?.["FL9N3yXzucT.XXDApzQFycS"] || ""}</td>
                                <td></td>
                            </tr>
                           
                            <tr>
                                <td style={styles.td}>14. Informat's Signature</td>
                                <td style={styles.td}>Relationship to deceased: {certificate?.["FL9N3yXzucT.qa5eIb216nF"] || ""}</td>
                            </tr>
                            <tr>
                                <td style={{ ...styles.td, ...styles.pt4 }}>Name: {certificate?.["FL9N3yXzucT.YdNUYjH3rct"] || ""}</td>
                                <td style={{ ...styles.td, ...styles.pt4 }}>Address: {certificate?.["FL9N3yXzucT.rRpqp6TPWlh"] || ""}</td>
                            </tr>
                         
                            <tr>
                                <td style={styles.td}>15. Cause of Death Certifiers:  {certificate?.["FL9N3yXzucT.aTbE3kYe98D"] || ""}</td>
                                <td style={styles.td}>
                                    Signature <span style={styles.w17}></span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                    Name {certificate?.["FL9N3yXzucT.RkPGXTudjFI"] || ""} <span style={styles.w17}></span>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td style={styles.pt4}>
                                    Designation {certificate?.["FL9N3yXzucT.NxtfpJnOOHx"] || ""} <span style={styles.w17}></span>
                                </td>
                            </tr>
                           
                        </tbody>
                    </table>

                    <footer style={styles.footer}>
                        <div>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                                I, the undersigned, do hereby certify that the above mentioned deceased was dead at the
                                time and place mentioned above and registered with the Entry No
                                <span style={{ ...styles.borderDotted, width: "9%", marginLeft: 4, marginRight: 4 }}></span>
                                in the Death Register and that Such Register Book is now legally in my custody.
                            </p>
                            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
                                Any person who (1) falsifies any of the particulars on this certificate or (2) used it as true, knowing it
                                to be false is liable to prosecution.
                            </p>
                        </div>
                        <div style={styles.flex}>
                            <div>
                                <p style={{ marginTop: 16, fontWeight: "600" }}>
                                    Date of issue <span style={styles.w6}></span> / <span style={styles.w6}></span> /{" "}
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <span style={styles.fontSemibold}>Registration Officer's</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={styles.fontSemibold}>
                                    Signature <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                    Name <span style={styles.w20}></span>
                                </span>
                                <span style={{ ...styles.fontSemibold, ...styles.mt2Text }}>
                                    Designation <span style={styles.w20}></span>
                                </span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
      
    )

};

export default DeathCertificate