import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { data } from "autoprefixer";
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
  width: "100%"
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '350px',
    marginBottom: '1.5rem',
    color: 'blue'
  },
  section: {
    fontWeight: 'normal',
  },
  line: {
    marginBottom: '0.25rem',
  },
  lineWithTopMarginSmall: {
    marginTop: '0.75rem',
    marginBottom: '0.25rem',
  },
  lineWithTopMarginLarge: {
    marginTop: '1rem',
    marginBottom: '0.25rem',
  },
  dottedLine: {
    display: 'inline-block',
    borderBottom: '2px dotted blue',
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
  smallWidth: {
    width: '31%',
  },
  mediumWidth: {
    width: '6rem',
  },
  largeWidth: {
    width: '8rem',
  },
  dateBox: {
    display: 'inline-block',
    width: '0.75rem',
    borderBottom: '2px dotted blue',
    marginLeft: '5px',
    verticalAlign: 'middle',
  },
  rightSection: {
    marginTop: '2.5rem',
  },
};

const LateFoetalDeathCert = ({orgUnit, orgUnits, dataElements}) => {
  // const {eventId} = useParams();
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const pdfRef = useRef();
  const {t} = useTranslation();
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

  console.log("OrgUnit", orgUnit);

  useEffect(() => {
    if (state?.record) {
      setCertificate(state.record);
    } else {
      setCertificate(null);
    }
  }, [state]);

  //if there is no certificate data 
  if (!certificate) return <div>No certificate data found.</div>


  const handleDownloadPDF = () => {
    if (pdfRef.current) {
      html2pdf()
        .set({ margin: 0.5, filename: 'Birth Certificate.pdf', html2canvas: { scale: 2 } })
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
          color: "#000",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

      <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
        <h2 style={{ fontSize: 24, color: "blue", fontWeight: "bold", textAlign: "center", marginBottom: 8 }}> 
         {t("LFDC")}
        </h2>
        {/* Header for main certificate */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: 'blue', 
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "30%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal', color:'blue' }}>{t("VR153")}</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal', color:'blue'}}>
                {t("S/d")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal', color: 'blue' }}>
               {t("D")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal', color:'blue'}}>
                {t("T")}
               <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted blue',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>


            </div>

            <div>
              <p style={{ fontWeight: 'normal', color: 'blue'}}>
                {t("W/v")} ............
                {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : ''}
                  </span> */}
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: 'blue', fontSize: 16, width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
              {t("PN")}............
              {/* <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted black',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[5] ? orgUnit.path[5] : '............'}
                  </span> */}
            </p>
            <p style={{ fontWeight: 'normal', color: 'blue' }}>
             {t("BN")}............
              
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color: 'blue' }}>
             {t("EN")}........... 
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color:'blue'}}>
             {t("DR")} ..../.../ 
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


        <div style={{ marginTop: 24, width: "100%" }}>
          {/* Particular of Child */}
          <div>
            <div style={borderSolid}></div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'blue', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                {t("POC")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4, color: 'blue'}}>1. {t("S")}: {certificate?.["wxrDsUO1ELy"] || ""}</div>  {/* Name - 1 index */}


                  <div style={{ width: "50%", paddingBottom: 4, color: 'blue' }}>3. {t("POB")}: {typeof certificate?.["eventdate"] === "string" ? certificate["eventdate"].split(" ")[0] : ""}</div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%",color: 'blue' }}>2. {t("DOB")}: {certificate?.["zAetLzp3cT1"] || ""} </div> {/* gender - 2 index */}
                  {/* <div style={{ width: "50%", color: 'blue' }}>4. Place of Birth: {certificate?.["JAU9NM7UqQP"] || ""}</div> 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center",color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
                {t("POF")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color:"blue" }}>5. {t("N")}: {certificate?.["RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color:"blue" }}>8. {t("R")}: {certificate?.["m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue"}}>6. {t("RC")}: {certificate?.["mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue"}}>9. {t("OC")}: {certificate?.["CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px', color: "blue"}}>7.{t("C")}: {certificate?.["ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
               {t("POM")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>5. {t("N")}: {certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>8. {t("R")}: {certificate?.["QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>6. {t("RC")}: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>9. {t("OC")}: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "blue"}}>7. {t("C")}: {certificate?.["r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  <div style={{ width: "50%", color: "blue"}}>10.  {t("PD")}: {certificate?.["bVyrfnpCd6i"] || ""}</div> {/*  15 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of person who certify that the child was still born */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "blue", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
              {t("PPCCSB")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>{t("SIG")}: {t("SIG")}{certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}> {t("Q")}: {certificate?.["QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>{t("N")}: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "blue" }}>{t("AD")}: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
               
              </div>
            </div>
            <div style={borderGray}></div>
          </div>


          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%",color: "blue", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid blue" }}>
               {t("POI")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "blue" }}>{t("SIG")}</div>
                  <div style={{ width: "50%", color: "blue" }}>{t("RTC")} : {certificate?.["eYh3U6sXrTQ"] || ""}</div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px", color: "blue" }}>{t("N")}: {certificate?.["YdNUYjH3rct"] || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px", color: "blue" }}>{t("AD")}: {certificate?.["rRpqp6TPWlh"] || ""}</div> {/*  18 index */}
                </div>
              </div>
            </div>
            <div style={borderSolid}></div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <p style={{ width: "100%",color: "blue", display: "block", marginBottom: 8 }}>
              {t("STILL_BORN_PARA1_VALIDATION")}    
            </p>

              {/* <span style={{ ...borderDotted, width: "9%" }}></span> */}
               <p style={{ width: "100%", color: "blue", display: "block", marginBottom: 8 }}>
                {t("STILL_BORN_PARA2_VALIDATION")}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 16, justifyContent: "space-between", color: "blue"}}>
            <div>
              <p style={{ marginTop: 16, fontWeight: "600" }}>
               {t("DOI")} <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span>
                / <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span> /
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontWeight: "600" }}>{t("RO")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600" }}>
                {t("SIG")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
               {t("N")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                {t("DG")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
            </div>
          </div>
        </footer>
      </main>

    </div>

  );
};

export default LateFoetalDeathCert;