import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from "../api";
import { Button } from "@mui/material";
import QrCode  from "qrcode";
import { NUMBERS } from "../constants";

const DeathCertificate = () => {
  const [url, setUrl] = useState('');
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState("");
    const [issueCount, setIssueCount] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [hideBackArrow, setHideBackArrow] = useState(false);
    const pdfRef = useRef();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentDate = new Date().toLocaleDateString('en-GB');

  const { search } = useLocation();
  const event = new URLSearchParams(search).get("death");
  
  useEffect(() => {
    if(event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/birth-certificate?death=${event}`
      QrCode.toDataURL(default_url,{
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H"
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
  }, [event]);

  const getCitizenshipDisplay = (citizenShip, nrc, passport) => {
    if(passport) return passport;
    var element = '';
    if(citizenShip) element += options[citizenShip];
    if(nrc) {
      element = `, ${nrc.replace(/\d/g, digit => NUMBERS[digit])}`;
    }
    return element;
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
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
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
        occurredAt: certificate.occurredAt,
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
          body {
            margin: 0;
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
        style={{display:"flex", fontSize: "3mm", color: "black", marginRight: "0.5cm", justifyContent: "flex-end"}}
      >
        <div id="aside" style={{width:"6.85cm",paddingRight: "1.05cm", borderRight:"2px dotted black", }}>
            <p style={{display: "flex",justifyContent: "center", alignItems: "center", fontWeight: "bold"}}> 
              <ArrowBackIcon style={{ color: 'white', border:"2px solid #A9A9A9", borderRadius: "40px", background: "#A9A9A9", marginRight: "5px", cursor: "pointer"}} className="no-print" onClick={() => navigate(-1)} /> 
              {t("DEATH_CERTIFICATE_COUNTERFOIL")}
            </p>
            <div style={{height: "1.1cm"}}>{t("VR_203")}</div>
            <div style={{height: "0.9cm"}}>{t("PAGE_NUMBER")} <span> {certificate?.["PS99q9IRjKy"] || ""} </span></div>
            <div style={{height: "0.9cm"}}>{t("BOOK_NUMBER")} <span> {certificate?.["l0Pm3ydZ2om"] || ""} </span></div>
            <div style={{height: "0.9cm"}}>{t("ENTRY_NUMBER")} <span> {certificate?.["MrtKbjcsHnk"] || ""} </span></div>
            <div style={{height: "2.7cm"}}>{t("PLACE_OF_REGISTRATION")} <span> {orgUnit?.name} </span></div>
            <div style={{height: "0.9cm"}}>{t("DATE_OF_REGISTRATION")} <span> {certificate?.["occurblackAt"] || ""} </span></div>
            <div style={{height: "0.9cm"}}>{t("NAME_OF_DECEASED")} <span> {certificate?.["YdNUYjH3rct"] || ""} </span></div>
            <div style={{height: "0.9cm"}}>{t("PLACE_OF_DEATH")} <span>{certificate?.["MOV6uMBMkph"] || ""} </span></div>
            <div style={{height: "1.2cm"}}>{t("CAUSE_OF_DEATH")} <span> {certificate?.["nQy5xQrOMXj"] || ""} </span> </div>
            <div style={{height: "0.9cm"}}>{t("SIGNATURE_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div style={{height: "0.9cm"}}>{t("NAME_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div style={{height: "0.9cm"}}>{t("DATE_OF_ISSUE")} <span> {currentDate} </span></div>
            <div id="qr-user">
              {url ? <img src={url} alt="qr-code.svg" /> : null}
            </div>
        </div>
        <div id="main" style={{ marginLeft: "0.4cm", width: "19.2cm"}}>
          <div id="header">
            <div id="top" style={{display: "grid", gridTemplateColumns: "auto 1fr", height:"1cm"}}>
              <div>{t("VR_203")}</div>
              <div style={{justifySelf: "center", fontWeight: "bold"}}>
                  {t("DEATH_CERTIFICATE")}
              </div>
            </div>
            <div id="bottom" style={{display:"flex"}}>
              <div id="first" style={{width:"12cm", heigth: "2.8cm"}}>
                <div>{t("STATE_REGION")}: <span>{orgUnit?.ancestors?.[1].name || ""}</span></div>
                <div>
                  <span style={{width:"3.85cm"}}>{t("DISTRICT")}: <span>{orgUnit?.ancestors?.[2].name || ""}</span></span>
                  <span>{t("TOWNSHIP")}: <span>{orgUnit?.ancestors?.[3].name || ""}</span></span>
                </div>
                <div>{t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}: <span> {orgUnit.name || ""} </span></div>
                <div style={{height: "4mm"}}></div>
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
            <div style={{height: "0.7cm", fontWeight: "bold", borderTop: "3px solid black", borderBottom: "3px solid black", textAlign: "center"}}>{t("PARTICULARS_OF_DECEASED")}</div>
            <div style={{display:"flex"}}>
              <div style={{width: "9.5cm", flexShrink: "0"}}>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("1")} {t("NAME")} <span>{certificate?.["aTbE3kYe98D"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("2")} {t("GENDER")} <span>{certificate?.["wxrDsUO1ELy"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("3")} {t("DATE_AND_TIME_OF_DEATH")} <span>{certificate?.["jGGNvNYhu47"] || ""}{certificate?.["VldUFL2RpDz"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("4")} {t("PLACE_OF_DEATH")} <span>{certificate?.["MOV6uMBMkph"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("5")} {t("AGE")} <span>{getAgeDisplay(certificate?.[""])}</span></div>
                <div style={{height: "0.7cm"}}>{t("6")} {t("OCCUPATION")} <span>{certificate?.["s3wKlMmBs8p"]}</span></div>
              </div>
              <div style={{width:"100%"}}>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("7")} {t("RACE")} <span>{certificate?.["b9BVo7x8248"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("8")} {t("CITIZENSHIP_AND_NRC")} <span>
                  {getCitizenshipDisplay(
                    certificate["JB1wN0sieDP"],  
                    certificate["wCN9fWzFtKE"],
                    certificate["Bog1BdtvCiw"]
                    )}
                  </span>
                </div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("9")} {t("RELIGION")} <span>{certificate?.["TseVgVwxzx9"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("10")} {t("PERMANENT_ADDRESS")} <span>{certificate?.["iXXvJAxbOtd"] || ""}</span></div>
                <div style={{height: "0.7cm", borderBottom: "1px solid black"}}>{t("11")} {t("NAME_OF_FATHER_DECEASED")} <span>{certificate?.["OpzRl6KIFVU"] || ""}</span></div>
                <div style={{height: "0.7cm"}}>{t("12")} {t("NAME_OF_MOTHER_DECEASED")} <span>{certificate?.["xHcmoS3icZD"]}</span></div>
              </div>
            </div>
            <div style={{height: "1.5cm", borderTop: "3px solid black", borderBottom: "3px solid black"}}>{t("13")} {t("CAUSE_OF_DEATH")} <span>{certificate?.["nQy5xQrOMXj"]}</span></div>
              <div style={{display: "flex", height: "1.55cm", borderBottom: "3px solid black"}}>
                <div style={{display: "flex", width: "10.5cm"}}>
                  <div style={{height: "0.7cm", width: "4.4cm", borderBottom: "1px solid black"}}>{t("14")} {t("Informants_Signature")} <span></span></div>
                  <div>
                    <div style={{height: "0.7cm", width: "6.1cm", borderBottom: "1px solid black"}}>{t("SIGNATURE")} <span></span></div>
                    <div style={{height: "0.7cm", width: "6.1cm"}}>{t("NAME")} <span>{certificate?.["YdNUYjH3rct"]}</span></div>
                  </div>
                </div>
                <div>
                  <div style={{height: "0.7cm", width: "8.7cm", borderBottom: "1px solid black"}}>{t("RELATION_TO_DECEASED")} <span>{certificate?.["qa5eIb216nF"]}</span></div>
                  <div style={{height: "0.7cm", width: "8.7cm"}}>{t("ADDRESS")} <span>{certificate?.["rRpqp6TPWlh"]}</span></div>
                </div>
              </div>
              <div style={{display: "flex", height: "2.2cm", borderBottom: "3px solid black"}}>
              <div>
                <div style={{height: "0.7cm", width: "10.5cm"}}>{t("15")} {t("CAUSE_OF_DEATH_CERTIFIERS")} <span>{certificate?.["nQy5xQrOMXj"]}</span></div>
              </div>
              <div>
                <div style={{height: "0.7cm"}}>{t("SIGNATURE")} <span></span></div>
                <div style={{height: "0.7cm"}}>{t("NAME")} <span> {certificate?.["RkPGXTudjFI"]} </span></div>
                <div style={{height: "0.7cm"}}>{t("DESIGNATION")} <span> {certificate?.["NxtfpJnOOHx"]} </span></div>
              </div>
              </div>
          </div>
          <div id="footer" style={{width: "19.2cm"}}>
            <div style={{height: "3.5cm", }}>
              <div><span style={{paddingRight: "2.5cm"}}></span>{t("DEATH_PARA1_VALIDATION")}</div>
              <div><span style={{paddingRight: "2.5cm"}}></span>{t("DEATH_PARA2_VALIDATION")}</div>
            </div>
            <div style={{height: "1.5cm", display:"flex", justifyContent:"space-between"}}>
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
    </div>
  </>
  );

};
export default DeathCertificate;
