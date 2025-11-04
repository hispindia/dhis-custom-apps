import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation } from "react-router-dom";
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
  console.log(t("BIRTH_CERTIFICATE"));

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
        <h2 style={{ fontSize: 24, color: "red", fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>{t("BIRTH_CERTIFICATE")}</h2>
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
            <p style={{ marginBottom: 4, marginTop: 12, fontWeight: 'normal', color:'red' }}>{t("VR_103")}</p>
            <div>
              <p style={{ marginBottom: 4, marginTop: 16, fontWeight: 'normal', color:'red'}}>
                 {t("STATE_DIVISION")}
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
                   {t("DISTRICT")}
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
                   {t("TOWNSHIP")}
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
                   {t("WARD/VILLAGE_TRACT")} 
                <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {certificate["hQnTVzOd0m9"] ||  ""}
                  </span>
              </p>
            </div>
          </section>

          {/* Right Section */}
          <section style={{ marginTop: 40, color: 'red', fontSize: 16, width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
               {t("PAGE_NUMBER")}  
               <span style={{
                    display: 'inline-block',
                    borderBottom: '2px dotted red',
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {certificate?.["PS99q9IRjKy"] || ''}
                  </span>
            </p>
            <p style={{ fontWeight: 'normal', color: 'red' }}>
              {t("BOOK_NUMBER")} 
              
              { <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted red',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                    {certificate?.["l0Pm3ydZ2om"] || ""}
                </span> }
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color: 'red' }}>
              {t("ENTRY_NUMBER")} 
              { <span style={{
                  display: 'inline-block',
                  borderBottom: '2px dotted red',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                  {certificate?.["MrtKbjcsHnk"] || ''}
                </span> }
            </p>
            <p style={{ marginBottom: 4, fontWeight: 'normal', color:'red'}}>
                {t("DATE_OF_REGISTRATION")} 

                  { <span style={{
                  borderBottom: '2px dotted red',
                  width: 60,
                  verticalAlign: 'middle',
                  marginLeft: 8
                }}>
                  {certificate?.["occurredAt"] || ''}
                </span> }
            </p>
          </section>

        </header>


        <div style={{ marginTop: 24, width: "100%" }}>
          {/* Particular of Child */}
          <div>
            <div style={borderSolid}></div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'red', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("PARTICULARS_OF_CHILD")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red'}}>1.  {t("NAME")} : {certificate?.["R43kdns3YYL"] || ""} </div>  {/* Name - 1 index */}
                  <br />
                


                  <div style={{ width: "50%", paddingBottom: 4, color: 'red' }}>
                    3.  {t("DATE_OF_BIRTH")}: {
                      certificate?.["zAetLzp3cT1"]
                    }
                  </div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%",color: 'red' }}>2.  {t("SEX")}:  {certificate?.["wxrDsUO1ELy"] || ""}</div> {/* gender - 2 index */}
                  <div style={{ width: "50%", color: 'red' }}>4.  {t("PLACE_OF_BIRTH")}: {certificate?.["JAU9NM7UqQP"] || ""}</div> {/* 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center",color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("PATICULAR_OF_FATHER")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>5.  {t("NAME")}: {certificate?.["RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color:"red" }}>8.  {t("RELIGION")}: {certificate?.["m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>6.  {t("RACE")}: {certificate?.["mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red"}}>9.  {t("OCCUPATION")}: {certificate?.["CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px', color: "red"}}>7.  {t("CITIZENSHIP")}: {certificate?.["ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                {t("PARTICULAR_OF_MOTHER")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>10.  {t("NAME")}: {certificate?.["UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>13.  {t("PERMANENT_ADDRESS")}: {certificate?.["bVyrfnpCd6i"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>11.  {t("RACE")}: {certificate?.["XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4, color: "red" }}>14.  {t("OCCUPATION")}: {certificate?.["vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red"}}>12.  {t("CITIZENSHIP")}: {certificate?.["r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  {/* <div style={{ width: "50%", color: "red"}}>15.  {t("PD")}: {certificate?.["bVyrfnpCd6i"] || ""}</div> */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%",color: "red", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid red" }}>
                 {t("PARTICULAR_OF_INFORMANT")}
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", color: "red" }}> {t("NAME")}: {certificate?.["YdNUYjH3rct"] || ""}</div>
                  <div style={{ width: "50%", color: "red" }}> {t("ADDRESS")}: {certificate?.["rRpqp6TPWlh"] || ""} </div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px", color: "red" }}>{t("RELATION_TO_CHILD")}: {certificate?.["eYh3U6sXrTQ"]  || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px", color: "red" }}>  {t("SIGNATURE")}</div> {/*  18 index */}
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
                 {t("DATE_OF_ISSUE")} <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span>
                / <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span> /
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontWeight: "600" }}> {t("REGISTRATION_OFFICER")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600" }}>
                {t("SIGNATURE")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 2 }}>
                {t("NAME")}<span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 2 }}>
                 {t("DESIGNATION")} <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
            </div>
          </div>
        </footer>
      </main>

    </div>

  );
};

export default BirthCertificate;