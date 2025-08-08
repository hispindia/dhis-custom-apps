import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { data } from "autoprefixer";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'


const borderDotted = {
  display: "inline-block",
  borderBottom: "2px dotted red",
  verticalAlign: "middle",
};
const borderSolid = {
  borderBottom: "2px solid red",
  width: "100%",
};
const borderGray = {
  borderBottom: "2px solid red",
  width: "100%",
};

const borderBlack = {
  borderBottom: "2px dotted red",
  width: "100%"
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '350px',
    marginBottom: '1.5rem',
    color: 'red'
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
    borderBottom: '2px dotted red',
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
    borderBottom: '2px dotted red',
    marginLeft: '5px',
    verticalAlign: 'middle',
  },
  rightSection: {
    marginTop: '2.5rem',
  },
};

const BirthCertificate = ({orgUnit, orgUnits}) => {
  // const {eventId} = useParams();
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const {t}  = useTranslation();
  console.log(t("BIRCERT"));

  const pdfRef = useRef();
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
          color: "black",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PDF
      </button>

      <main ref={pdfRef} style={{ margin: "1rem", width: "100%" }}>
        <h2 style={{ fontSize: 24, color: "red", fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>{t("BIRCERT")}</h2>
        {/* Header for main certificate */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: 'red', 
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "30%" }}>
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal', color:'red' }}>{t("VR103")}</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal', color:'red'}}>
                 {t("S/d")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 'normal', color: 'red' }}>
                   {t("D")}
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
              </p>

            </div>

            <div>
              <p style={{ fontWeight: 'normal', color:'red'}}>
                   {t("T")}
               <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>


            </div>

            <div>
              <p style={{ fontWeight: 'normal', color: 'red'}}>
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
          <section style={{ marginTop: 40, color: 'red', fontSize: 16, width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
               {t("PN")} ............ 
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
            <p style={{ fontWeight: 'normal', color: 'red' }}>
              {t("BN")} ............
              
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color: 'red' }}>
              {t("EN")} ........... 
              {/* <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted black',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}></span> */}
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color:'red'}}>
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
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'red', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("POC")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red'}}>1.  {t("N")} : {certificate?.["R43kdns3YYL"] || ""} </div>  {/* Name - 1 index */}
                  <br />
                


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red' }}>
                    3.  {t("DOB")}: {
                    typeof certificate?.["eventdate"] === "string" 
                    ? certificate["eventdate"].split(" ")[0] 
                    : ""
                    }
                  </div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%",color: 'red' }}>2.  {t("S")}:  {certificate?.["wxrDsUO1ELy"] || ""}</div> {/* gender - 2 index */}
                  <div style={{ width: "50%", color: 'red' }}>4.  {t("POB")}: {certificate?.["JAU9NM7UqQP"] || ""}</div> {/* 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center",color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("POF")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>5.  {t("N")}: {certificate?.["RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>8.  {t("R")}: {certificate?.["m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>6.  {t("RC")}: {certificate?.["mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>9.  {t("OC")}: {certificate?.["CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px', color: "red"}}>7.  {t("C")}: {certificate?.["ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("POM")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>10.  {t("N")}: {certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>13.  {t("PD")}: {certificate?.["QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>11.  {t("RC")}: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>14.  {t("OC")}: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red"}}>12.  {t("C")}: {certificate?.["r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  <div style={{ width: "50%", color: "red"}}>15.  {t("PD")}: {certificate?.["bVyrfnpCd6i"] || ""}</div> {/*  15 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%",color: "red", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                 {t("POI")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red" }}> {t("SIG")}</div>
                  <div style={{ width: "50%", color: "red" }}> {t("RTC")}: {certificate?.["eYh3U6sXrTQ"] || ""}</div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px", color: "red" }}> {t("N")}: {certificate?.["YdNUYjH3rct"] || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px", color: "red" }}> {t("AD")}: {certificate?.["rRpqp6TPWlh"] || ""}</div> {/*  18 index */}
                </div>
              </div>
            </div>
            <div style={borderSolid}></div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <p style={{ width: "100%",color: "red"}}>
                 {t("LIVE_BIRTH_PARA1_VALIDATION")}
             </p>
              {/* <span style={{ ...borderDotted, width: "9%" }}></span> */}
               <p style={{ width: "100%", color: "red", display: "block"}}>
                   {t("LIVE_BIRTH_PARA2_VALIDATION")}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: "red"}}>
            <div>
              <p style={{ marginTop: 5, fontWeight: "600" }}>
                 {t("DOI")} <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span>
                / <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span> /
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontWeight: "600" }}> {t("RO")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600" }}>
                {t("SIG")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 2 }}>
                {t("N")}<span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 2 }}>
                 {t("DG")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
            </div>
          </div>
        </footer>
      </main>

    </div>

  );
};

export default BirthCertificate;