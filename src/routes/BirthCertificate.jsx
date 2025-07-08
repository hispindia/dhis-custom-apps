import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { data } from "autoprefixer";
import { useLocation, useParams } from "react-router-dom";


const borderDotted = {
  display: "inline-block",
  borderBottom: "2px dotted black",
  verticalAlign: "middle",
};
const borderSolid = {
  borderBottom: "2px solid black",
  width: "100%",
};
const borderGray = {
  borderBottom: "2px solid #d1d5db",
  width: "100%",
};

const borderBlack = {
  borderBottom: "2px dotted black",
  width: "100%"
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '350px',
    marginBottom: '1.5rem',
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
    borderBottom: '2px dotted black',
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
    borderBottom: '2px dotted black',
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
  const pdfRef = useRef();
  const orgUnitObj = {};
  orgUnits.forEach(ou => {
    orgUnitObj[ou.id] = ou.name;
  })
  orgUnit = {
    ...orgUnit,
    path: orgUnit.path.split('/').map(ou => orgUnitObj[ou] ? orgUnitObj[ou] : ou)
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
        <h2 style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>BIRTH CERTIFICATE</h2>
        {/* Header for main certificate */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            color: '#000', 
            backgroundColor: '#fff'
          }}
        >
          {/* Left Section */}
          <section style={{ color: '#000', fontSize: 16, width: "30%" }}>
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
                    width: '31%',
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
                    width: '31%',
                    verticalAlign: 'middle',
                    marginLeft: 8
                  }}>
                    {orgUnit.path[4] ? orgUnit.path[4] : ''}
                  </span>
              </p>


            </div>

            <div>
              <p style={{ fontWeight: 'normal' }}>
                Ward / Village-tract  ............
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
          <section style={{ marginTop: 40, color: '#000', fontSize: 16, width: "30%" }}>
            <p style={{ fontWeight: 'normal' }}>
              Page No ............
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


        <div style={{ marginTop: 24, width: "100%" }}>
          {/* Particular of Child */}
          <div>
            <div style={borderSolid}></div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid black" }}>
                Particular of Child
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px" }}>


                  <div style={{ width: "50%", paddingBottom: 4 }}>1. Name : {certificate?.["EUfz92HiiVD.R43kdns3YYL"] || ""} </div>  {/* Name - 1 index */}


                  <div style={{ width: "50%", paddingBottom: 4 }}>3. Date of Birth: {certificate?.["eventdate"] ? certificate["eventdate"].split(" ")[0] : ""}</div>   {/* dob 0th index */}


                </div>

                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%" }}>2. Sex:  {certificate?.["EUfz92HiiVD.wxrDsUO1ELy"] || ""}</div> {/* gender - 2 index */}
                  <div style={{ width: "50%" }}>4. Place of Birth: {certificate?.["EUfz92HiiVD.JAU9NM7UqQP"] || ""}</div> {/* 4 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Father */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid black" }}>
                Particular of Father
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4 }}>5. Name: {certificate?.["EUfz92HiiVD.RKs8td9BnNj"] || ""}</div> {/*  5 index */}
                  <div style={{ width: "50%", paddingBottom: 4 }}>8. Religion: {certificate?.["EUfz92HiiVD.m4b4SSlipKJ"] || ""}</div> {/*  8 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4 }}>6. Race: {certificate?.["EUfz92HiiVD.mIRVmCzC7Tt"] || ""}</div> {/*  6 index */}
                  <div style={{ width: "50%", paddingBottom: 4 }}>9. Occupation: {certificate?.["EUfz92HiiVD.CjjgDMbqfXX"] || ""}</div> {/*  9 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div>
                  <div style={{ width: "50%", padding: '8px' }}>7. Citizenship: {certificate?.["EUfz92HiiVD.ed2RBrhMhnN"] || ""}</div> {/*  7 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Mother */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid black" }}>
                Particular of Mother
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4 }}>5. Name: {certificate?.["EUfz92HiiVD.UYmZMZt32hZ"] || ""}</div> {/*  10 index */}
                  <div style={{ width: "50%", paddingBottom: 4 }}>8. Religion: {certificate?.["EUfz92HiiVD.QsUp6BSb8Du"] || ""}</div> {/*  13 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%", paddingBottom: 4 }}>6. Race: {certificate?.["EUfz92HiiVD.XFmGvaRAJqP"] || ""}</div> {/*  11 index */}
                  <div style={{ width: "50%", paddingBottom: 4 }}>9. Occupation: {certificate?.["EUfz92HiiVD.vg5hhREmzXe"] || ""}</div> {/*  14 index */}
                </div>
                <div style={{ ...borderBlack, marginBottom: '10px' }}></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%" }}>7. Citizenship: {certificate?.["EUfz92HiiVD.r8oFvT4PZwL"] || ""}</div> {/*  12 index */}
                  <div style={{ width: "50%" }}>10. Permanent Address: {certificate?.["EUfz92HiiVD.bVyrfnpCd6i"] || ""}</div> {/*  15 index */}
                </div>
              </div>
            </div>
            <div style={borderGray}></div>
          </div>

          {/* Particular of Informant */}
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "25%", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 16, borderRight: "2px solid black" }}>
                Particular of Informant
              </div>
              <div style={{ width: "75%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                  <div style={{ width: "50%" }}>Signature</div>
                  <div style={{ width: "50%" }}>Relationship to Child: {certificate?.["EUfz92HiiVD.eYh3U6sXrTQ"] || ""}</div> {/*  17 index */}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '16' }}>
                  <div style={{ width: "50%", padding: "8px" }}>Name: {certificate?.["EUfz92HiiVD.YdNUYjH3rct"] || ""}</div> {/*  16 index */}
                  <div style={{ width: "50%", padding: "8px" }}>Address: {certificate?.["EUfz92HiiVD.rRpqp6TPWlh"] || ""}</div> {/*  18 index */}
                </div>
              </div>
            </div>
            <div style={borderSolid}></div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div style={{ marginTop: 16, fontSize: 14 }}>
            <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
              I, the undersigned, do hereby certify that the above mentioned child was born alive at the time and
              place mentioned above and registered with the Entry No
              ........ in the Birth Register which is in my legal custody. </p>
              {/* <span style={{ ...borderDotted, width: "9%" }}></span> */}
               <p style={{ width: "100%", display: "block", marginBottom: 8 }}>
              Any person who (1) falsifies any of the particulars on this certificate or (2) used it as true, knowing it
              to be false is liable to prosecution.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 16, justifyContent: "space-between" }}>
            <div>
              <p style={{ marginTop: 16, fontWeight: "600" }}>
                Date of issue <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span>
                / <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}></span> /
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ fontWeight: "600" }}>Registration Officer's</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600" }}>
                Signature <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                Name <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
              <span style={{ fontWeight: "600", marginTop: 8 }}>
                Designation <span style={{ ...borderDotted, width: 80 }}></span>
              </span>
            </div>
          </div>
        </footer>
      </main>

    </div>

  );
};

export default BirthCertificate;