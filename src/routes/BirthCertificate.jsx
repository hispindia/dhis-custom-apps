import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import { Button } from "@mui/material";
import QrCode  from "qrcode";
import { NUMBERS } from "../constants";

const BirthCertificate = () => {
  const [url, setUrl] = useState('');
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

  const { t } = useTranslation();
  const pdfRef = useRef();
  
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const currentDate = new Date().toLocaleDateString("en-GB");

  const navigate = useNavigate();

  const { search } = useLocation();
  const event = new URLSearchParams(search).get("birth");
  // if(!event) return;

  useEffect(() => {
    if(event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/birth-certificate?birth=${event}`
      QrCode.toDataURL(default_url,{
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#ff0000",   // QR dots (red)
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
  
  const updateEventInDHIS2 = async (issueCount, reason) => {
    console.log(certificate);
    const dataValues = [];
    if (issueCount) {
      dataValues.push({ dataElement: "UlMXHCJhyNZ", value: issueCount });
    }
    if (reason) {
      dataValues.push({ dataElement: "ofuG4AdYrY1", value: reason });
    }
    const payload = {
      events: [
        {
          event: certificate.event,
          program: certificate.program,
          orgUnit: certificate.orgUnit,
          programStage: certificate.programStage,
          occurredAt: certificate.occurredAt,
          dataValues,
        },
      ],
    };
    await api.pushEvents(payload);
  };

  const handleDownloadPDF = async () => {
    setHideBackArrow(true);

    if (pdfRef.current) {
      let newCount = issueCount + 1;
      const options = {
        margin: [0.315, 0, 0, 0], // [top, right, bottom, left] in inches (0.8cm)
        filename: "Birth Certificate.pdf",
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          orientation: "landscape",
          format: "a4",
          compress: true,
        },
      };
      html2pdf()
        .set(options)
        .from(pdfRef.current)
        .save()
        .then(async () => {
          setHideBackArrow(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        });
    }
  };

  const handleIssueClick = async () => {
    if (issueCount > 0) setShowModal(true);
    else {
      const count = issueCount + 1;
      setIssueCount(count);
      await updateEventInDHIS2(count);
      handleDownloadPDF();
    }
  };

  const handleSubmitReason = async () => {
    // console.log('reason', reason);
    setShowModal(false);
    const count = issueCount + 1;
    setIssueCount(count);
    await updateEventInDHIS2(count, reason);
    setReason("");
    handleDownloadPDF();
  };
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

          div {
            box-sizing: border-box; 
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
      }}>
      <div
        style={{
          // padding: "16px",
          fontFamily: "sans-serif",
          width: "100%",

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
            }}
          >
            Issue Certificate {issueCount > 0 && `(${issueCount})`}
          </button>

          {/* PRINT BUTTON */}
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
          >
            Print
          </button>
        </div>
      <div 
        ref={pdfRef}
        id="certificate"
        style={{display:"flex", fontSize: "3mm", color: "red", marginRight: "0.5cm", justifyContent: "flex-end"}}
      >
        <div id="aside" style={{width:"7.05cm", borderRight:"2px dotted red", }}>
            <p style={{display: "flex", alignItems: "center", fontWeight: "bold", height: "1.2cm"}}> 
              <ArrowBackIcon style={{ color: 'white', border:"2px solid #A9A9A9", borderRadius: "40px", background: "#A9A9A9", marginRight: "5px", cursor: "pointer"}} className="no-print" onClick={() => navigate(-1)}/> 
              {t("BIRTH_CERTIFICATE_COUNTERFOIL")} 
            </p>
            <div style={{height: "1cm"}}>{t("VR_103")}</div>
            <div>{t("BOOK_NUMBER")} <span> {certificate?.["l0Pm3ydZ2om"] || ""} </span></div>
            <div>{t("PAGE_NUMBER")} <span> {certificate?.["PS99q9IRjKy"] || ""} </span></div>
            <div>{t("ENTRY_NUMBER")} <span> {certificate?.["MrtKbjcsHnk"] || ""} </span></div>
            <div>{t("PLACE_OF_REGISTRATION")} <span> {orgUnit?.name} </span></div>
            <div>{t("DATE_OF_REGISTRATION")} <span> {certificate?.["occurredAt"] || ""} </span></div>
            <div>{t("Name_of_child")} <span> {certificate?.["R43kdns3YYL"] || ""} </span></div>
            <div>{t("SEX")} <span> {certificate?.["R43kdns3YYL"] || ""} </span></div>
            <div>{t("PLACE_OF_BIRTH")} <span> {certificate?.["JAU9NM7UqQP"] || ""} </span> </div>
            <div>{t("DATE_AND_TIME_OF_BIRTH")} <span>{certificate?.["zAetLzp3cT1"] || ""} {certificate?.["uOK1Wcm91NB"] || ""} </span></div>
            <div>{t("NAME_OF_FATHER")} <span>{certificate?.["RKs8td9BnNj"] || ""}</span></div>
            <div>{t("NAME_OF_MOTHER")}<span> {certificate?.["UYmZMZt32hZ"] || ""} </span></div>
            <div>{t("PERMANENT_ADDRESS")} <span> {certificate?.["bVyrfnpCd6i"] || ""} </span></div>
            <div>{t("SIGNATURE_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div>{t("NAME_OF_ISSUING_PERSON")} <span>__________</span></div>
            <div>{t("DATE_OF_ISSUE")} <span> {currentDate} </span></div>
            <div id="qr-user">
              {url ? <img src={url} alt="qr-code.svg" /> : null}
            </div>
        </div>
        <div id="main" style={{ marginLeft: "0.4cm", width: "19.9cm"}}>
          <div id="header">
            <div id="top" style={{height:"2.15cm", display:"flex", textAlign:"center"}}>

              {/* <div id="qr-client">
                {url ? <img src={url} alt="qr-code.svg" heigth={70} width={70}/> : null}
              </div> */}
              <div>
              <div style={{fontWeight: "bold"}}>
                {t("BIRTH_CERTIFICATE")}
              </div>
              <div>
                {t("THIS_CERTIFICATE_WILL_NOT_BE_PROOF")}
              </div>
              </div>
            </div>
            <div id="mid">
              {t("VR_103")}
            </div>
            <div id="bottom" style={{display:"flex"}}>
              <div id="first" style={{width:"12.1cm", heigth: "2.4cm"}}>
                <div style={{height: "4mm"}}></div>
                <div>{t("STATE_REGION")}: <span>{orgUnit?.ancestors?.[1].name || ""}</span></div>
                <div>
                  <span style={{width:"3.85cm"}}>{t("DISTRICT")}: <span>{orgUnit?.ancestors?.[2].name || ""}</span></span>
                  <span>{t("TOWNSHIP")}: <span>{orgUnit?.ancestors?.[3].name || ""}</span></span>
                </div>
                <div>{t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}: <span> {orgUnit.name || ""} </span></div>
              </div>
              <div id="third">
                <div>{t("BOOK_NUMBER")} <span> {certificate?.["l0Pm3ydZ2om"] || ""} </span></div>
                <div>{t("PAGE_NUMBER")} <span> {certificate?.["PS99q9IRjKy"] || ""} </span></div>
                <div>{t("ENTRY_NUMBER")} <span> {certificate?.["MrtKbjcsHnk"] || ""} </span></div>
                <div>{t("DATE_OF_REGISTRATION")} <span> {certificate?.["JAU9NM7UqQP"] || ""} </span></div>
              </div>
            </div>
          </div>
          <div id="main-content">
            <div style={{display: "flex", height: "1.95cm", borderTop: "2px solid red", borderBottom: "2px solid red"}}>
              <div style={{display: "flex",flexShrink: "0", width: "10.9cm"}}>
                <div style={{width: "3.3cm", flexShrink: "0", borderRight: "2px solid red", textAlign: "center"}}>{<Trans i18nKey="PARTICULARS_OF_CHILD" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted red"}}>{t("1")} {t("Name_of_child")}: <span>{certificate?.["R43kdns3YYL"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted red"}}>{t("2")} {t("SEX")}: <span>{certificate?.["wxrDsUO1ELy"] || ""}</span></div>
                  <div style={{height: "0.6cm"}}></div>
                </div>
              </div>  
              <div style={{width: "100%"}}>
                <div style={{borderBottom: "2px dotted red"}}>{t("3")} {t("DATE_AND_TIME_OF_BIRTH")}: <span> {certificate?.["JAU9NM7UqQP"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted red"}}>{t("4")} {t("PLACE_OF_BIRTH")}: <span>{certificate?.["JAU9NM7UqQP"] || ""}</span></div>
                <div style={{height: "0.6cm"}}></div>
              </div>
            </div>
            <div style={{display: "flex", height: "1.95cm", borderBottom: "2px solid red"}}>
              <div style={{display:"flex", flexShrink: "0", width: "10.9cm"}}>
                <div style={{width: "3.3cm", flexShrink: "0", borderRight: "2px solid red", textAlign: "center"}}>{<Trans i18nKey="PARTICULAR_OF_FATHER" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted red"}}>{t("5")} {t("NAME")}: <span>{certificate?.["RKs8td9BnNj"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted red"}}>{t("6")} {t("RACE")}: <span>{certificate?.["mIRVmCzC7Tt"] || ""}</span></div>
                  <div>{t("7")} {t("CITIZENSHIP_AND_NRC")}: 
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
                <div style={{borderBottom: "2px dotted red"}}>{t("8")} {t("RELIGION")}: <span>{certificate?.["m4b4SSlipKJ"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted red"}}>{t("9")} {t("OCCUPATION")}:<span>{certificate?.["CjjgDMbqfXX"] || ""}</span></div>
              </div>        
            </div>
            <div style={{display: "flex", height: "2.5cm", borderBottom: "2px solid red"}}>
              <div style={{display: "flex", flexShrink: "0", width: "10.9cm"}}>
                <div style={{width: "3.3cm", flexShrink: "0", borderRight: "2px solid red", textAlign: "center"}}>{<Trans i18nKey="PARTICULAR_OF_MOTHER" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted red"}}>{t("10")} {t("NAME")}: <span>{certificate?.["UYmZMZt32hZ"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted red"}}>{t("11")} {t("RACE")}: <span>{certificate?.["XFmGvaRAJqP"] || ""}</span></div>
                  <div style={{borderBottom: "2px dotted red"}}>{t("12")} {t("CITIZENSHIP_AND_NRC")}: 
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
                <div style={{borderBottom: "2px dotted red"}}>{t("13")} {t("RELIGION")}:<span>{certificate?.["QsUp6BSb8Du"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted red"}}>{t("14")} {t("OCCUPATION")}:<span>{certificate?.["vg5hhREmzXe"] || ""}</span></div>
                <div style={{borderBottom: "2px dotted red"}}>{t("15")} {t("PERMANENT_ADDRESS")}:<span>{certificate?.["bVyrfnpCd6i"] || ""}</span></div>
              </div>
            </div>
            <div style={{display: "flex",  flexShrink: "0",height: "1.35cm", borderBottom: "2px solid red"}}>
              <div style={{display: "flex", flexShrink: "0", width: "11.7cm"}}>
                <div style={{width: "3.3cm", flexShrink: "0", borderRight: "2px solid red", textAlign: "center"}}>{<Trans i18nKey="PARTICULAR_OF_INFORMANT" />}</div>
                <div style={{width: "100%"}}>
                  <div style={{borderBottom: "2px dotted red"}}>{t("SIGNATURE")}: <span></span></div>
                  <div>{t("NAME")}: <span>{certificate?.["YdNUYjH3rct"] || ""}</span></div>
                </div>
              </div>
              <div style={{width: "100%"}}>
                <div style={{borderBottom: "2px dotted red"}}>{t("RELATION_TO_CHILD")}: <span>{certificate?.["eYh3U6sXrTQ"] || ""}</span></div>
                <div>{t("ADDRESS")}: <span>{certificate?.["rRpqp6TPWlh"]}</span></div>
              </div>
            </div>
          </div>
          <div id="footer">
            <div style={{height: "3.7", width: "19.9cm", wordSpacing: "16px"}}>
              <span style={{paddingRight: "2.5cm"}}></span>{t("LIVE_BIRTH_PARA1_VALIDATION")} <br/>  
              <span style={{paddingRight: "2.5cm"}}></span>{t("LIVE_BIRTH_PARA2_VALIDATION")}
            </div>
            <div style={{height: "1.9cm, width: 19.9cm", display:"flex", justifyContent:"space-between"}}>
              <div style={{height: "1.9cm", display:"flex", alignItems: "flex-end"}}><div>{t("DATE")} <span>{currentDate}</span></div></div>
              <div>{t("REGISTRATION_OFFICER")}</div>

              <div>
                <div>{t("SIGNATURE")} <span></span></div>
                <div>{t("NAME")} <span> {certificate?.["B1QxOlRIEVk"]} </span></div>
                <div>{t("DESIGNATION")} <span> {certificate?.["qsIjbrXLBL5"]} </span></div>
              </div>
            </div>
            <div style={{height: "1.25cm", width: "19.9cm", wordSpacing: "16px"}}>
              {t("LIVE_BIRTH_PARA3_VALIDATION")}
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
              disabled={!reason ? true : false}
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
    </>
  );
};

export default BirthCertificate;
