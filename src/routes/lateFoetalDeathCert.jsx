import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from "../api";
import { Button } from "@mui/material";
import QrCode  from "qrcode";
import { NUMBERS } from "../constants";

const LateFoetalDeathCert = () => {
  const [url, setUrl] = useState('');
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

  const pdfRef = useRef();
  const { t } = useTranslation();
  const orgUnitObj = {};
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString('en-GB');
  
  const { search } = useLocation();
  const event = new URLSearchParams(search).get("stillbirth");
  // if(!event) return;
  
  useEffect(() => {
    if(event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/birth-certificate?death=${event}`
      QrCode.toDataURL(default_url,{
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#0033cc",   // QR dots (red)
          light: "#ffffff", // background (white)
        },
      })
      .then(setUrl)
      .catch(console.error);
      const fetchEvents = async() => {
        const resOptions = await api.fetchOthers("/api/optionSets/FYXoXlEZXae.json", ["fields=options[id,name,code]"]);
        if(resOptions.options) {
          const options = {};
          resOptions.options.forEach(option => {
            options[option.code] = option.name;
          })
          setOptions(options);
        }
        
        const resEvent = await api.fetchEvent(event);
        if(resEvent) {
          const event = {};
          resEvent.dataValues.forEach(dv => event[dv.dataElement] = dv.value);
          const issueCount = event["UlMXHCJhyNZ"] ? Number(event["UlMXHCJhyNZ"]) : 0;
          setCertificate(event);
          setIssueCount(issueCount);
          let orgUnit = await api.fetchOrgUnits([`fields=id,name,path,ancestors[id,name]`, `filter=id:eq:${resEvent.orgUnit}`]);       
          setOrgUnit(orgUnit.organisationUnits[0])
        }
      }
      fetchEvents();
    }
  }, [event])

  const getCitizenshipDisplay = (citizenShip, nrc, passport) => {
    if(passport) return passport;
    var element = '';
    if(citizenShip) element += options[citizenShip];
    if(nrc) {
      element = `, ${nrc.replace(/\d/g, digit => NUMBERS[digit])}`;
    }
    return element;
  };

  const handleDownloadPDF = async () => { 
    setHideBackArrow(true);
    if (!pdfRef.current) return;

    const el = pdfRef.current;
    el.style.overflow = "visible";
    //a4 content height
    const CM_TO_PX = 37.7952755906;
    const targetHeightPx = 19.1 * CM_TO_PX;

    //measuing actual rendeblue height
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
      setShowToast(true);
      setTimeout(() => {
          setShowToast(false);
      }, 3000);

    } finally {
      el.style.transform = prevTransform || "";
      el.style.transformOrigin = prevTransformOrigin || "";
      el.style.overflow = "";
    }
  };

  const updateEventInDHIS2 = async(issueCount, reason) => {
    console.log(certificate);
    const dataValues = [];
    if(issueCount) {
      dataValues.push({ dataElement: "UlMXHCJhyNZ", value: issueCount })
    }
    if(reason) {
      dataValues.push({dataElement: "ofuG4AdYrY1", value: reason })
    }
    const payload = {
      events: [{
        event: certificate.event,
        program: certificate.program,
        orgUnit: certificate.orgUnit,
        programStage: certificate.programStage,
        occurblueAt: certificate.occurblueAt,
        dataValues
      }]
    };
    await api.pushEvents(payload);
  };

  const handleIssueClick = async () => {
    if(issueCount > 0) setShowModal(true);
    else {
      const count = issueCount+1;
      setIssueCount(count);
      await updateEventInDHIS2(count);
      handleDownloadPDF();
    }
  }

  const handleSubmitReason = async() => {
    // console.log('reason', reason);
    setShowModal(false);
    const count = issueCount+1;
    setIssueCount(count);
    await updateEventInDHIS2(count, reason);
    setReason(""); 
    handleDownloadPDF();
  }

  const handlePrint = () => {
      window.print();
  };

  //if there is no certificate data
  if (!certificate) return <div>No certificate data found.</div>;

  return (
    <>
      <style>
        {`
        @page {
          size: A4 landscape;
          margin: 0;
        }

        @media print {
          .no-print {
            display: none;
          }
          * {
            padding: 0;
            margin: 0;
          }
          div {
            box-sizing: border-box; 
          }
        }
        #certificate {
          display: flex;
          justify-content: flex-end; /* push content right */
        }
      `}
      </style>

    <div
      style={{
          background: "#fff",
          padding: "22px"
      }}
    >
    <div 
      style={{
        background: "#fff",
        fontFamily: "sans-serif",
      }}
    >  
      <div className="no-print" style={{ textAlign: "right" }}>
        <button
          onClick={handleIssueClick}
          style={{
              padding: "8px 16px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "2px"
          }}
        >
          Issue Certificate {issueCount > 0 && `(${issueCount})`}
        </button>
        <button
          onClick={handlePrint}
          style={{
            padding: "8px 12px",
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            marginRight: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        > Print </button>
      </div>
      <div 
        ref={pdfRef}
        id="certificate"
        style={{display:"flex", fontSize: "3mm", color: "blue", marginRight: "0.5cm", justifyContent: "flex-end"}}
      >
        <div id="aside" style={{width:"6.25cm", borderRight:"2px dotted blue", }}>
            <p style={{display: "flex",justifyContent: "center", alignItems: "center", fontWeight: "bold"}}> 
              <ArrowBackIcon style={{ color: 'white', border:"2px solid #A9A9A9", borderRadius: "40px", background: "#A9A9A9", marginRight: "5px", cursor: "pointer"}} className="no-print" onClick={() => navigate(-1)} /> 
              {t("LATE_FOETAL_DEATH_CERTIFICATE_COUNTERFOIL")}
            </p>
            <div style={{marginBottom: "0.9cm"}}>{t("VR_153")}</div>
            <div>{t("PAGE_NUMBER")} <span> {certificate?.["PS99q9IRjKy"] || ""} </span></div>
            <div>{t("BOOK_NUMBER")} <span> {certificate?.["l0Pm3ydZ2om"] || ""} </span></div>
            <div>{t("ENTRY_NUMBER")} <span> {certificate?.["MrtKbjcsHnk"] || ""} </span></div>
            <div style={{height: "2.5cm"}}>{t("PLACE_OF_REGISTRATION")} <span> {orgUnit?.name} </span></div>
            <div>{t("DATE_OF_REGISTRATION")} <span> {certificate?.["occurblueAt"] || ""} </span></div>
            <div>{t("SEX")} <span> {certificate?.["R43kdns3YYL"] || ""} </span></div>
            <div>{t("DEATH_OF_BIRTH")} <span>{certificate?.["JAU9NM7UqQP"] || ""} </span></div>
            <div>{t("PLACE_OF_BIRTH")} <span> {certificate?.["JAU9NM7UqQP"] || ""} </span> </div>
            <div>{t("NAME_OF_FATHER")} <span>{certificate?.["RKs8td9BnNj"] || ""}</span></div>
            <div>{t("NAME_OF_MOTHER")}<span> {certificate?.["UYmZMZt32hZ"] || ""} </span></div>
            <div>{t("ADDRESS")} <span> {certificate?.["bVyrfnpCd6i"] || ""} </span></div>
            <div>{t("SIGNATURE_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div>{t("NAME_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div>{t("DATE_OF_ISSUE")} <span> {currentDate} </span></div>
            <div id="qr-user">
              {url ? <img src={url} alt="qr-code.svg" /> : null}
            </div>
        </div>
        <div id="main" style={{ marginLeft: "0.4cm", width: "19.8cm"}}>
          <div id="header">
            <div id="top" style={{marginTop: "1cm", marginBottom: "0.5cm", display: "grid", gridTemplateColumns: "auto 1fr"}}>
              <div>{t("VR_153")}</div>
              <div style={{justifySelf: "center", fontWeight: "bold"}}>
                  {t("LATE_FOETAL_DEATH_CERTIFICATE")}
              </div>
            </div>
            <div id="bottom" style={{display:"flex"}}>
              <div id="first" style={{width:"10.5cm", heigth: "2.55cm"}}>
                <div>{t("STATE_REGION")}: <span>{orgUnit?.ancestors?.[1].name || ""}</span></div>
                <div>
                  <span style={{width:"3.85cm"}}>{t("DISTRICT")}: <span>{orgUnit?.ancestors?.[2].name || ""}</span></span>
                  <span>{t("TOWNSHIP")}: <span>{orgUnit?.ancestors?.[3].name || ""}</span></span>
                </div>
                <div>{t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}: <span> {orgUnit.name || ""} </span></div>
              </div>
              {/* <div id="qr-client">
                {url ? <img src={url} alt="qr-code.svg" height={50} width={50}/> : null}
              </div> */}
              <div id="second">
                <div>{t("BOOK_NUMBER")} <span> {certificate?.["l0Pm3ydZ2om"] || ""} </span></div>
                <div>{t("PAGE_NUMBER")} <span> {certificate?.["PS99q9IRjKy"] || ""} </span></div>
                <div>{t("ENTRY_NUMBER")} <span> {certificate?.["MrtKbjcsHnk"] || ""} </span></div>
                <div>{t("DATE_OF_REGISTRATION")} <span> {certificate?.["JAU9NM7UqQP"] || ""} </span></div>
              </div>
            </div>
          </div>
          <div id="main-content">
            <div style={{display: "flex", height: "2.05cm", borderTop: "2px solid blue", borderBottom: "2px solid blue"}}>
              <div style={{display: "flex", flexShrink: "0", width: "10.4cm"}}>
                <div style={{width: "3.15cm", flexShrink: "0", borderRight: "2px solid blue", textAlign:"center"}}>{<Trans i18nKey="PARTICULARS_OF_CHILD" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("1")} {t("SEX")}: <span>{certificate?.["wxrDsUO1ELy"] || ""}</span></div>
                  <div style={{height: "0.6cm", borderBottom: "2px dotted blue"}}></div>
                  <div><span style={{marginLeft: "0.3cm"}}></span> {t("2")} {t("DATE_AND_TIME_OF_BIRTH")}: <span> {certificate?.["zAetLzp3cT"] || ""} {certificate?.["uOK1Wcm91NB"] || ""}</span></div>
                </div>
              </div>  
              <div style={{width: "100%"}}>
                <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("3")} {t("PLACE_OF_BIRTH")}: <span>{certificate?.["JAU9NM7UqQP"] || ""}</span></div>
                <div style={{height: "0.6cm", borderBottom: "2px dotted blue"}}></div>
                <div style={{height: "0.6cm"}}></div>
              </div>
            </div>
            <div style={{display: "flex", height: "2cm", borderBottom: "2px solid blue"}}>
              <div style={{display:"flex", flexShrink: "0", width: "10.4cm"}}>
                <div style={{width: "3.15cm", flexShrink: "0", borderRight: "2px solid blue", textAlign:"center"}}>{<Trans i18nKey="PARTICULAR_OF_FATHER" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("4")} {t("NAME")}: <span>{certificate?.["RKs8td9BnNj"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("5")} {t("RACE")}: <span>{certificate?.["mIRVmCzC7Tt"] || ""}</span></div>
                  <div><span style={{marginLeft: "0.3cm"}}></span> {t("6")} {t("CITIZENSHIP_AND_NRC")}: 
                    <span>
                        {getCitizenshipDisplay(
                          certificate["ed2RBrhMhnN"],
                          certificate["Fwa7gEzjZAH"],
                          certificate["YE1wx1a4Ky4"]
                        )}
                    </span>
                  </div>
                </div>
                </div>
              <div style={{width: "100%"}}>
                <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("7")} {t("RELIGION")}: <span>{certificate?.["m4b4SSlipKJ"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("8")} {t("OCCUPATION")}:<span>{certificate?.["CjjgDMbqfXX"] || ""}</span></div>
              </div>        
            </div>
            <div style={{display: "flex", height: "2cm", borderBottom: "2px solid blue"}}>
              <div style={{display: "flex", flexShrink: "0", width: "10.2cm"}}>
                <div style={{width: "3.15cm", flexShrink: "0", borderRight: "2px solid blue", textAlign:"center"}}>{<Trans i18nKey="PARTICULAR_OF_MOTHER" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted blue"}}><span style={{marginLeft: "0.3cm"}}></span> {t("9")} {t("NAME")}: <span>{certificate?.["UYmZMZt32hZ"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted blue"}}>{t("10")} {t("RACE")}: <span>{certificate?.["XFmGvaRAJqP"] || ""}</span></div>
                  <div>{t("11")} {t("CITIZENSHIP_AND_NRC")}: 
                    <span>
                      {getCitizenshipDisplay( 
                        certificate["r8oFvT4PZwL"],
                        certificate["M8pvzjPdija"],
                        certificate["CowkFxAoqnl"]
                      )}
                    </span>
                  </div>
                </div>  
              </div>
              <div style={{width: "100%"}}>
                <div style={{borderBottom: "2px dotted blue"}}>{t("12")} {t("RELIGION")}:<span>{certificate?.["bVyrfnpCd6i"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted blue"}}>{t("13")} {t("OCCUPATION")}:<span>{certificate?.["vg5hhREmzXe"] || ""}</span></div>
                <div>{t("14")} {t("PERMANENT_ADDRESS")}:<span>{certificate?.["bVyrfnpCd6i"] || ""}</span></div>
              </div>
            </div>
            <div style={{display: "flex",  flexShrink: "0",height: "1.95cm", borderBottom: "2px solid blue"}}>
              <div style={{display: "flex", flexShrink: "0", width: "11.2cm"}}>
                <div style={{width: "3.15cm", flexShrink: "0", borderRight: "2px solid blue", textAlign:"center"}}>{<Trans i18nKey="PARTICULAR_OF_PERSON" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{ height: "0.9cm", width: "8cm", display: "flex", alignItems: "flex-end", borderBottom: "2px dotted blue"}}><span style={{marginLeft: "1cm"}}></span>{t("SIGNATURE")}: <span></span></div>
                  <div style={{ height: "0.9cm", width: "8cm", display: "flex", alignItems: "flex-end"}}><span style={{marginLeft: "1cm"}}></span>{t("NAME")}: <span></span></div>
                </div>
              </div>
              <div style={{width: "100%"}}>
                <div style={{ height: "0.9cm", display: "flex", alignItems: "flex-end", borderBottom: "2px dotted blue"}}>{t("QUALIFICATION")}: <span></span></div>
              </div>
            </div>
            <div style={{display: "flex",  flexShrink: "0",height: "1.75cm", borderBottom: "2px solid blue"}}>
              <div style={{display: "flex", flexShrink: "0", width: "11.2cm"}}>
                <div style={{width: "3.15cm", flexShrink: "0", borderRight: "2px solid blue", textAlign:"center"}}>{<Trans i18nKey="PARTICULAR_OF_INFORMANT" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{ height: "0.9cm", display: "flex", alignItems: "flex-end", borderBottom: "2px dotted blue"}}><span style={{marginLeft: "1cm"}}></span>{t("SIGNATURE")}: <span></span></div>
                  <div style={{ height: "0.9cm", display: "flex", alignItems: "flex-end"}}><span style={{marginLeft: "1cm"}}></span>{t("NAME")}: <span>{certificate?.["YdNUYjH3rct"] || ""}</span></div>
                </div>
              </div>
              <div style={{width: "100%", height: "0.9cm",borderBottom: "2px dotted blue"}}>
                <div style={{ height: "0.9cm", display: "flex", alignItems: "flex-end", borderBottom: "2px dotted blue"}}>{t("RELATION_TO_CHILD")}: <span>{certificate?.["eYh3U6sXrTQ"] || ""}</span></div>
                <div style={{ height: "0.9cm", display: "flex", alignItems: "flex-end"}}>{t("ADDRESS")}: <span>{certificate?.["rRpqp6TPWlh"]}</span></div>
              </div>
            </div>
          </div>
          <div id="footer">
            <div style={{height: "3.35", width: "19.8cm"}}>
              <div style={{wordSpacing: "16px"}}><span style={{ paddingRight: "1.5cm"}}></span>{t("STILL_BORN_PARA1_VALIDATION")}</div>
              <div style={{wordSpacing: "16px"}}><span style={{paddingRight: "1.5cm"}}></span>{t("STILL_BORN_PARA2_VALIDATION")}</div>
            </div>
            <div style={{height: "1.9cm, width: 19.8cm", display:"flex", justifyContent:"space-between"}}>
              <div>{t("DATE")} <span>{currentDate}</span></div>
              <div>{t("REGISTRATION_OFFICER")}</div>

              <div>
                <div>{t("SIGNATURE")} <span></span></div>
                <div>{t("NAME")} <span> {certificate?.["B1QxOlRIEVk"]} </span></div>
                <div>{t("DESIGNATION")} <span> {certificate?.["qsIjbrXLBL5"]} </span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

          <Button 
            color="primary"
            variant="contained" 
            disabled= {!reason ? true: false} 
            onClick={handleSubmitReason}
            >
            Submit
            </Button>

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
    </div>
    </>
  );
};

export default LateFoetalDeathCert;
