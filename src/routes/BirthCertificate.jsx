import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  container: {
    display: 'flex',
    gap: '16px',
    width: '100%',
    // Limit printable width for A4 landscape while allowing html2pdf scaling
    maxWidth: '11.69in', // A4 width in inches (landscape)
    boxSizing: 'border-box'
  },
  leftPane: {
    width: '8.06cm',
    padding: '12px',                                
    boxSizing: 'border-box',
    color: 'red',
    fontSize: 12,
    borderRight: '2px dashed red',
    flexShrink: 0, // Prevent the left pane from shrinking
  },
  rightPane: {
    flex: 1, // Allow the right pane to fill remaining space
    padding: '12px',
    boxSizing: 'border-box',
    color: 'red',
    fontSize: 13
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '0.25rem',
    color: 'red'
  },
  sectionTitle: {
    fontWeight: 600,
    textAlign: 'center'
  },
  smallField: {
    display: 'block',
    borderBottom: '2px dotted red',
    padding: '2px 4px',
    marginTop: 6,
  },
  dottedLineInline: {
    display: 'inline-block',
    borderBottom: '2px dotted red',
    verticalAlign: 'middle',
    minWidth: 40,
    marginLeft: 6
  },
  
  footerSmall: { fontSize: 11, color: 'red' }
};


const BirthCertificate = ({orgUnit, orgUnits}) => {
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const {t}  = useTranslation();
  const pdfRef = useRef();
  const orgUnitObj = {};
  const [downloadCount, setDownloadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-GB');
  let count = 1;

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

  useEffect(() => {
    if (state?.record) {
      setCertificate(state.record);
    } else {
      setCertificate(null);
    }
  }, [state]);

  if (!certificate) return <div>No certificate data found.</div>

  const handleIssueClick = () => {
    if(downloadCount >= 1){
      setShowModal(true);
      return;
    }
    handleDownloadPDF();
    setDownloadCount(prev => prev + 1);
  }


  const handleDownloadPDF = () => {
    if (pdfRef.current) {
      const options = {
        margin: [0.315, 0, 0, 0], // [top, right, bottom, left] in inches (0.8cm)
        filename: 'Birth Certificate.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true
         },
        jsPDF: { orientation: 'landscape', unit: 'in', format: 'a4', compress: true }
      };
      html2pdf()
        .set(options)
        .from(pdfRef.current)
        .save();
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


  return (
    <>
    <div style={{ background: "#fff", padding: "16px", fontFamily: "sans-serif", width: "100%", position: "relative" }}>

      <button
        onClick={handleIssueClick}
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
         Issue Certificate {issueCount > 0 && `(${issueCount})`}
      </button>

      
      <main ref={pdfRef} style={{ width: "100%", display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
        <div style={styles.container}>

          
          <aside style={styles.leftPane}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '15px' }} onClick={() => navigate(-1)}>
                <ArrowBackIcon style={{ color: 'black' }} />
                <h4 style={{fontWeight: 600, textAlign: "left", marginLeft: '8px', marginBottom: '0', marginTop: '0'}}>{t("BIRTH_CERTIFICATE_COUNTERFOIL")}</h4>
            </div>
            <div style={{ fontSize: "15px"}}>
              <div style={{ fontWeight: 600 }}>{t("VR_103") || "V.R Form 103"}</div>
              <div style={{ marginTop: "12px"}}>
                <div>{t("PAGE_NUMBER")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "192px", paddingLeft: "5px"}}>{certificate?.["PS99q9IRjKy"] || ""}</span></div>
                <div style={{ marginTop: 8}}>{t("BOOK_NUMBER")} <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "165px", paddingLeft: "5px"}}>{certificate?.["l0Pm3ydZ2om"] || ""}</span></div>
                <div style={{ marginTop: 8}}>{t("ENTRY_NUMBER")} <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "152px", paddingLeft: "5px"}}>{certificate?.["MrtKbjcsHnk"] || ""}</span></div>
                 <div style={{ marginTop: 8 }}>{t("PLACE_OF_REGISTRATION")} <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "136px", paddingLeft: "5px"}}>{orgUnitObj[certificate.orgUnit]}</span></div>
                <div style={{ marginTop: 8 }}>{t("DATE_OF_REGISTRATION")} <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "136px", paddingLeft: "5px"}}>{certificate?.["occurredAt"] || ""}</span></div>
              </div>
            </div>

            

          <div style={{ fontSize: 15, marginTop: "22px"}}>
              <div style={{ marginBottom: 10}}>
                <div>{t("Name_of_child")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "179px", paddingLeft: "5px"}}>{certificate?.["R43kdns3YYL"] || ""}</span></div>
              </div>

              <div style={{ marginBottom: 8}}>
                <div>{t("SEX")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "230px", paddingLeft: "5px"}}>{certificate?.["wxrDsUO1ELy"] || ""}</span></div>
              </div>

              <div style={{ marginBottom: 8}}>
                <div>{t("PLACE_OF_BIRTH")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "180px", paddingLeft: "5px"}}>{certificate?.["JAU9NM7UqQP"] || ""}</span></div>
              </div>
           
            <div style={{ marginBottom: 8}}>
                <div>{t("NAME_OF_FATHER")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "164px", paddingLeft: "5px"}}>{certificate?.["RKs8td9BnNj"] || ""}</span></div>
              </div>

            <div style={{ marginBottom: 8}}>
                <div>{t("NAME_OF_MOTHER")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "150px", paddingLeft: "5px"}}>{certificate?.["UYmZMZt32hZ"] || ""}</span></div>
            </div>
            

            <div style={{ marginTop: 8}}>
              <div>{t("PERMANENT_ADDRESS")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "140px", paddingLeft: "5px"}}>{certificate?.["bVyrfnpCd6i"] || ""}</span></div>
            </div>

          </div>

           <div style={{ fontSize: 15, marginTop: "15px"}}>
              <div style={{ marginBottom: 8 }}>
                <div>{t("SIGNATURE_OF_ISSUING_PERSON")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "62px", paddingLeft: "5px"}}>{certificate?.[""] || ""}</span></div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div>{t("NAME_OF_ISSUING_PERSON")}<span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "100px", paddingLeft: "5px"}}>{certificate?.[""] || ""}</span></div>
              </div>

              <div style={{ marginBottom: 8 }}>
                 <div>
                  <p style={{ marginTop: 0 }}>
                     {t("DATE_OF_ISSUE")} <span style={{ display: "inline-block", width: 24, verticalAlign: "middle", paddingLeft: "5px"}}>{currentDate}</span>
                  </p>
                </div>
                
              </div>

          </div>

          </aside>

          {/* ===== RIGHT PANE - Main Certificate content ===== */}
          <section style={styles.rightPane}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <div style={{width: "21%"}}></div>
             <div>
               <h2 style={{ fontSize: 20, color: "red", fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>{t("BIRTH_CERTIFICATE")}</h2>
             </div>
            <div style={{ marginTop: 12 }}>
              <div style={{
                width: '7.5cm',
                height: '1.7cm',
                backgroundColor: 'red',
                color: 'white',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                lineHeight: '1.25',
                padding: '0 8px',
                boxSizing: 'border-box'
              }}>
                <span>This certificate will not</span>
                <span style={{ marginTop: '5px' }}>be a proof for citizenship</span>
              </div>

            </div>
          </div>

            {/* Header inside right pane */}
            <header style={styles.header}>
              <div style={{ color: 'red', fontSize: 14, paddingTop: '15px' }}>
                <p style={{ marginBottom: 8, fontWeight: 'normal' }}>{t("VR_103")}</p>
                <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("STATE_REGION")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted red', width: '37%', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[2] ? orgUnit.path[2] : ''}
                  </span>
                </p>
                <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("DISTRICT")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted red', width: '46%', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[3] ? orgUnit.path[3] : ''}
                  </span>
                </p>
                <p style={{ marginBottom: 8, fontWeight: 'normal'}}>
                  {t("TOWNSHIP")}
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted red', width: '53px', verticalAlign: 'middle', marginLeft: 4, paddingLeft: '4px' }}>
                    {orgUnit.path[4] ? orgUnit.path[4]: ''}
                  </span>
                </p>
              </div>

              <div style={{ color: 'red', fontSize: 13, paddingTop: '15px', textAlign: 'left', marginTop: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span>{t("PAGE_NUMBER")}</span>
                  <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "200px", paddingLeft: "6px"}}>{certificate?.["PS99q9IRjKy"] || ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span>{t("BOOK_NUMBER")}</span>
                  <span style={{display: "inline-block", borderBottom: "2px dotted red", verticalAlign: "middle", minWidth: "200px", paddingLeft: "6px"}}>{certificate?.["l0Pm3ydZ2om"] || ""}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span>{t("ENTRY_NUMBER")}</span>
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted red', verticalAlign: "middle", minWidth: "200px", paddingLeft: "6px" }}>{certificate?.["MrtKbjcsHnk"] || ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span>{t("DATE_OF_REGISTRATION")}</span>
                  <span style={{ display: 'inline-block', borderBottom: '2px dotted red', verticalAlign: "middle", minWidth: "200px", paddingLeft: "6px" }}>{certificate?.["occurredAt"] || ''}</span>
                </div>
              </div>
            </header>

            <div style={{ width: "100%", fontSize: 13 }}>
              {/* Particular of Child */}
              <div>
                <div style={borderSolid}></div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25%", textAlign: "center", fontWeight: "600", color: 'red', display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 12, borderRight: "2px solid red" }}>
                    {t("PARTICULARS_OF_CHILD")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 5px" }}>
                      <div style={{ width: "50%", paddingBottom: 2, color: 'red'}}>{t("1")}{t("NAME")} : {certificate?.["R43kdns3YYL"] || ""} </div>
                      <div style={{ width: "50%", paddingBottom: 2, color: 'red' }}>{t("3")}{t("DATE_AND_TIME_OF_BIRTH")}: {certificate?.["zAetLzp3cT1"] || ""} {" "} {certificate?.["uOK1Wcm91NB"] || ""}</div>
                    </div>

                    <div style={{ ...borderBlack, marginBottom: '2px' }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '8px' }}>
                      <div style={{ width: "50%",color: 'red' }}>{t("2")}{t("SEX")}:{certificate?.["wxrDsUO1ELy"] || ""}</div>
                      <div style={{ width: "50%", color: 'red' }}>{t("4")}{t("PLACE_OF_BIRTH")}: {certificate?.["JAU9NM7UqQP"] || ""}</div>
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Father */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25%", textAlign: "center",color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 12, borderRight: "2px solid red" }}>
                    {t("PATICULAR_OF_FATHER")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px 5px' }}>
                      <div style={{ width: "50%", paddingBottom: 2, color:"red" }}>{t("5")}{t("NAME")}: {certificate?.["RKs8td9BnNj"] || ""}</div>
                      <div style={{ width: "50%", paddingBottom: 2, color:"red" }}>{t("8")}{t("RELIGION")}: {certificate?.["m4b4SSlipKJ"] || ""}</div>
                    </div>
                    <div style={{ ...borderBlack, marginBottom: '2px' }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px 5px' }}>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red"}}>{t("6")}{t("RACE")}: {certificate?.["mIRVmCzC7Tt"] || ""}</div>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red"}}>{t("9")}{t("OCCUPATION")}: {certificate?.["CjjgDMbqfXX"] || ""}</div>
                    </div>
                    <div style={{ ...borderBlack, marginBottom: '2px' }}></div>
                    <div>
                      <div style={{ width: "50%", padding: '8px', color: "red"}}>{t("7")}{t("CITIZENSHIP_AND_NRC")}: {getCitizenshipDisplay(certificate["ed2RBrhMhnN"],certificate["Fwa7gEzjZAH"], certificate["YE1wx1a4Ky4"])}</div>
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Mother */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25%", textAlign: "center", color: "red", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 12, borderRight: "2px solid red" }}>
                    {t("PARTICULAR_OF_MOTHER")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px 5px' }}>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red" }}>{t("10")}{t("NAME")}: {certificate?.["UYmZMZt32hZ"] || ""}</div>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red" }}>{t("13")}{t("RELIGION")}: {certificate?.["bVyrfnpCd6i"] || ""}</div>
                    </div>
                    <div style={{ ...borderBlack, marginBottom: '2px' }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px 5px' }}>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red" }}>{t("11")}{t("RACE")}: {certificate?.["XFmGvaRAJqP"] || ""}</div>
                      <div style={{ width: "50%", paddingBottom: 2, color: "red" }}>{t("14")}{t("OCCUPATION")}: {certificate?.["vg5hhREmzXe"] || ""}</div>
                    </div>
                    <div style={{ ...borderBlack, marginBottom: '2px' }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px' }}>
                      <div style={{ width: "50%", color: "red"}}>{t("12")}{t("CITIZENSHIP_AND_NRC")}: {getCitizenshipDisplay(certificate["r8oFvT4PZwL"],certificate["M8pvzjPdija"], certificate["CowkFxAoqnl"])}</div>
                      <div style={{ width: "50%", color: "red"}}>{t("15")}{t("PERMANENT_ADDRESS")}: {certificate?.["bVyrfnpCd6i"] || ""}</div>
                    </div>
                  </div>
                </div>
                <div style={borderGray}></div>
              </div>

              {/* Particular of Informant */}
              <div>
                <div style={{ display: "flex" }}>
                  <div style={{ width: "25%",color: "red", textAlign: "center", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", paddingRight: 12, borderRight: "2px solid red" }}>
                     {t("PARTICULAR_OF_INFORMANT")}
                  </div>
                  <div style={{ width: "75%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: '2px 5px' }}>
                      <div style={{ width: "50%", color: "red" }}> {t("SIGNATURE")}: </div>  
                      <div style={{ width: "50%", color: "red" }}> {t("RELATION_TO_CHILD")}: {certificate?.["eYh3U6sXrTQ"] || ""} </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: '2px' }}>
                      <div style={{ width: "50%", padding: "8px", color: "red" }}>{t("NAME")}: {certificate?.["YdNUYjH3rct"]  || ""}</div>
                      <div style={{ width: "50%", padding: "8px", color: "red" }}> {t("ADDRESS")}: {certificate?.["rRpqp6TPWlh"]}</div>
                    </div>
                  </div>
                </div>
                <div style={borderSolid}></div>
              </div>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: 0 }}>
              <div style={{ marginTop: 1, fontSize: 11 }}>
                <p style={{ width: "100%",color: "red"}}>
                     {t("LIVE_BIRTH_PARA1_VALIDATION")}
                 </p>
                 <p style={{ width: "100%", color: "red", display: "block", marginBottom: 0, marginTop: 0}}>
                     {t("LIVE_BIRTH_PARA2_VALIDATION")}
                </p>
                <p style={{ width: "100%", color: "red", display: "block", marginBottom: 0, marginTop: 2}}>
                     {t("LIVE_BIRTH_PARA3_VALIDATION")}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", color: "red", fontSize: 11, marginTop: 0}}>
                <div>
                  <p style={{marginTop: 0, fontWeight: "600", fontSize: 12}}>
                     {t("DATE")} <span style={{ display: "inline-block", width: 24, verticalAlign: "middle" }}>{currentDate}</span>
                  </p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", fontSize: 12, paddingTop: 1}}>
                  <span style={{ fontWeight: "600" }}> {t("REGISTRATION_OFFICER")}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontSize: 11}}>
                  <span style={{ fontWeight: "600" }}>
                    {t("SIGNATURE")} <span style={{ ...borderDotted, width: 80 }}></span>
                  </span>
                  <span style={{ fontWeight: "600", marginTop: 2 }}>
                    {t("NAME")} <span style={{ ...borderDotted, width: 80 }}>{certificate?.["B1QxOlRIEVk"]}</span>
                  </span>
                  <span style={{ fontWeight: "600", marginTop: 2 }}>
                     {t("DESIGNATION")} <span style={{ ...borderDotted, width: 80 }}>{certificate?.["qsIjbrXLBL5"]}</span>
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
          <h3 style={{ textAlign: "center" }}>Please provide the reason</h3>

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

export default BirthCertificate;
