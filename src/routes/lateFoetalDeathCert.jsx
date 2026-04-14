import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import { Button } from "@mui/material";
import QrCode from "qrcode";
import { NUMBERS } from "../constants";

const LateFoetalDeathCert = () => {
  const [url, setUrl] = useState("");
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

  const pdfRef = useRef();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const navigate = useNavigate();

  const currentDate = (() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  })();

  const { search } = useLocation();
  const event = new URLSearchParams(search).get("stillbirth");

  useEffect(() => {
    if (event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/late-Foetal-death-certificate?stillbirth=${event}`;
      QrCode.toDataURL(default_url, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#0033cc",
          light: "#ffffff",
        },
      })
        .then(setUrl)
        .catch(console.error);

      const fetchEvents = async () => {
        const resOptions = await api.fetchOthers("/api/optionSets.json", [
          "fields=options[id,name,code,translations]",
          "filter=id:in:[mRAsObydjNZ,bc2tQPU8ogy,xYdFirocaSj,pUN5lFHkUu6,FYXoXlEZXae,bc2tQPU8ogy,YNtzjFwAJVU,G5ojzNPIyxf,fgAaYvqGZqY,MJG9doiGtjX]",
        ]);
        if (resOptions.optionSets) {
          const opts = {};
          resOptions.optionSets.forEach((optionSet) => {
            optionSet.options.forEach((option) => {
              var lang = {};
              option.translations.forEach(
                (translation) => (lang[translation.locale] = translation.value)
              );
              opts[option.code] = lang?.["my"] || option.name;
            });
          });
          setOptions(opts);
        }

        const resEvent = await api.fetchEvent(event);
        if (resEvent) {
          const ev = {};
          resEvent.dataValues.forEach((dv) => (ev[dv.dataElement] = dv.value));
          ev["event"] = resEvent.event;
          ev["orgUnit"] = resEvent.orgUnit;
          ev["occurredAt"] = resEvent.occurredAt;
          ev["program"] = resEvent.program;
          ev["programStage"] = resEvent.programStage;

          const ic = ev["UlMXHCJhyNZ"] ? Number(ev["UlMXHCJhyNZ"]) : 0;
          setCertificate(ev);
          setIssueCount(ic);
          let ou = await api.fetchOrgUnits([
            `fields=id,name,path,ancestors[id,name]`,
            `filter=id:eq:${resEvent.orgUnit}`,
          ]);
          setOrgUnit(ou.organisationUnits[0]);
        }
      };
      fetchEvents();
    }
  }, [event]);

  const getCitizenshipDisplay = (citizenShip, nrc, passport) => {
    if (passport) return passport;
    var element = "";
    if (citizenShip) element += options[citizenShip];
    if (nrc) {
      element = `${nrc.replace(/\d/g, (digit) => NUMBERS[digit])}`;
    }
    return element;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const datePart = String(dateStr).split("T")[0].split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  };

  const formatDateTime = (dateStr, timeStr) => {
    const d = formatDate(dateStr);
    const t = timeStr ? String(timeStr).trim() : "";
    return t ? `${d} ${t}` : d;
  };

  const handleDownloadPDF = async () => {
    setHideBackArrow(true);
    if (!pdfRef.current) return;

    const opts = {
      margin: 0,
      filename: "Late Foetal Death Certificate.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { orientation: "landscape", format: "a4", compress: true },
    };
    html2pdf()
      .set(opts)
      .from(pdfRef.current)
      .save()
      .then(() => {
        setHideBackArrow(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
  };

  const updateEventInDHIS2 = async (ic, reason) => {
    const dataValues = [];
    if (ic) {
      dataValues.push({ dataElement: "UlMXHCJhyNZ", value: ic });
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

  /* ── shared style fragments (BLUE theme) ── */
  const S = {
    color: "#0033cc",
    border: "1px solid #0033cc",
    borderDot: "1px dashed #0033cc",
    fs: "7.5pt",
    fsSm: "7pt",
    fsXs: "6.5pt",
    fsLg: "9pt",
    bold: { fontWeight: 700 },
  };

  const permanentAddress = certificate?.["bVyrfnpCd6i"]
    ? certificate["bVyrfnpCd6i"]
        .split(",")
        .map((addr) => options[addr] || addr)
        .join(", ")
    : "";

  return (
    <>
      {/* ── print & page styles ── */}
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            overflow: hidden !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .cert-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            min-height: 0 !important;
            height: auto !important;
            overflow: hidden !important;
          }
          .no-print { display: none !important; }
          header,
          [class*="headerbar"],
          [class*="HeaderBar"],
          [data-test*="headerbar"],
          .dhis2-ui-headerbar,
          .jsx-headerbar {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
          }
          .cert-page {
            margin: 0 !important;
            padding: 3mm 4mm 2mm 4mm !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            overflow: hidden !important;
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
          }
        }
        @media screen {
          .cert-page {
            box-shadow: 0 1px 8px rgba(0,0,0,0.12);
            margin: 12px auto;
          }
        }
      `}</style>

      <div
        className="cert-wrapper"
        style={{ background: "#f5f5f5", minHeight: "100vh", padding: "0" }}
      >
        {/* ── toolbar ── */}
        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            background: "#fff",
            borderBottom: "1px solid #ddd",
          }}
        >
          {!hideBackArrow && (
            <button
              onClick={() => navigate(-1)}
              style={{
                marginRight: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#555",
                fontSize: "14px",
              }}
            >
              <ArrowBackIcon style={{ fontSize: 20 }} /> Back
            </button>
          )}
          <button
            onClick={handleIssueClick}
            style={{
              padding: "8px 20px",
              background: "#1565c0",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Issue Certificate {issueCount > 0 && `(${issueCount})`}
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: "8px 20px",
              background: "#c62828",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Print
          </button>
        </div>

        {/* ══════════════ A4 LANDSCAPE CERTIFICATE ══════════════ */}
        <div
          ref={pdfRef}
          className="cert-page"
          style={{
            width: "297mm",
            maxHeight: "210mm",
            height: "210mm",
            background: "#fff",
            fontFamily: "'Pyidaungsu', 'Myanmar Text', 'Padauk', sans-serif",
            fontSize: S.fs,
            color: S.color,
            display: "flex",
            overflow: "hidden",
            position: "relative",
            boxSizing: "border-box",
            padding: "3mm 4mm 2mm 4mm",
          }}
        >
          {/* ── duplicate watermark ── */}
          {issueCount > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-30deg)",
                fontSize: "90px",
                fontWeight: 700,
                opacity: 0.08,
                color: S.color,
                pointerEvents: "none",
                zIndex: 10,
                letterSpacing: "12px",
              }}
            >
              DUPLICATE
            </div>
          )}

          {/* ╔══════════════════════════════════╗
             ║   LEFT: COUNTERFOIL              ║
             ╚══════════════════════════════════╝ */}
          <div
            style={{
              width: "62mm",
              flexShrink: 0,
              borderRight: `1.5px dashed ${S.color}`,
              paddingRight: "3mm",
              paddingTop: "6mm",
              display: "flex",
              flexDirection: "column",
              fontSize: S.fsSm,
              lineHeight: 1.4,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: S.fsLg,
                marginBottom: "1mm",
                lineHeight: 1.2,
                textAlign: "left",
              }}
            >
              {t("LATE_FOETAL_DEATH_CERTIFICATE_COUNTERFOIL")}
            </div>

            <div style={{ fontWeight: 700, marginBottom: "1mm" }}>
              <strong>{t("VR_153")}</strong>
            </div>

            <div>{t("BOOK_NUMBER")} {certificate?.["l0Pm3ydZ2om"] || ""}</div>
            <div>{t("PAGE_NUMBER")} {certificate?.["PS99q9IRjKy"] || ""}</div>
            <div>{t("ENTRY_NUMBER")} {certificate?.["MrtKbjcsHnk"] || ""}</div>
            <div>
              {t("DATE_OF_REGISTRATION")}{" "}
              <span style={S.bold}>{formatDate(certificate?.["occurredAt"])}</span>
            </div>
            <div>
              {t("SEX")}{" "}
              {options[certificate?.["wxrDsUO1ELy"]] || ""}
            </div>
            <div>
              {t("DATE_AND_TIME_OF_BIRTH")}{" "}
              <span style={S.bold}>
                {formatDateTime(
                  certificate?.["zAetLzp3cT1"],
                  certificate?.["uOK1Wcm91NB"]
                )}
              </span>
            </div>
            <div>
              {t("PLACE_OF_BIRTH")}{" "}
              {options[certificate?.["JAU9NM7UqQP"]] || certificate?.["JAU9NM7UqQP"] || ""}
            </div>
            <div>
              {t("NAME_OF_FATHER")}{" "}
              <span style={S.bold}>
                {certificate?.["RKs8td9BnNj"] || ""}
              </span>
            </div>
            <div>
              {t("NAME_OF_MOTHER")}{" "}
              <span style={S.bold}>
                {certificate?.["UYmZMZt32hZ"] || ""}
              </span>
            </div>
            <div>
              {t("ADDRESS")} {permanentAddress}
            </div>
            <div style={{ marginTop: "2mm" }}>
              {t("SIGNATURE_OF_ISSUING_PERSON")}
            </div>
            <div>{t("NAME_OF_ISSUING_PERSON")}</div>
            <div>
              {t("DATE_OF_ISSUE")} <span style={S.bold}>{currentDate}</span>
            </div>

            {/* QR Code - Left */}
            <div style={{ marginTop: "3mm", textAlign: "center" }}>
              {url && (
                <img
                  src={url}
                  alt="QR Code"
                  style={{ width: "22mm", height: "22mm" }}
                />
              )}
            </div>
          </div>

          {/* ╔══════════════════════════════════╗
             ║   RIGHT: MAIN CERTIFICATE        ║
             ╚══════════════════════════════════╝ */}
          <div
            style={{
              flex: 1,
              paddingLeft: "4mm",
              paddingRight: "2mm",
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {/* ── Header: Title ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5mm",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "11pt",
                  letterSpacing: "1px",
                  textAlign: "center",
                }}
              >
                {t("LATE_FOETAL_DEATH_CERTIFICATE")}
              </div>
            </div>

            {/* ── Sub-header: VR form + location + book info ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1mm",
                fontSize: S.fsSm,
                lineHeight: 1.4,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: "1mm" }}>
                  <strong>{t("VR_153")}</strong>
                </div>
                <div>
                  {t("STATE_REGION")}{" "}
                  <span style={S.bold}>
                    {orgUnit?.ancestors?.[1]?.name || ""}
                  </span>
                </div>
                <div>
                  {t("DISTRICT")}{" "}
                  <span style={S.bold}>
                    {orgUnit?.ancestors?.[2]?.name || ""}
                  </span>
                  <span style={{ marginLeft: "6mm" }}>
                    {t("TOWNSHIP")}{" "}
                    <span style={S.bold}>
                      {orgUnit?.ancestors?.[3]?.name || ""}
                    </span>
                  </span>
                </div>
                <div>
                  {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}{" "}
                  <span style={S.bold}>{orgUnit?.name || ""}</span>
                </div>
              </div>

              <div
                style={{
                  width: "52mm",
                  flexShrink: 0,
                  textAlign: "left",
                  paddingLeft: "4mm",
                }}
              >
                <div>
                  {t("BOOK_NUMBER")}{" "}
                  {certificate?.["l0Pm3ydZ2om"] || ""}
                </div>
                <div>
                  {t("PAGE_NUMBER")}{" "}
                  {certificate?.["PS99q9IRjKy"] || ""}
                </div>
                <div>
                  {t("ENTRY_NUMBER")}{" "}
                  {certificate?.["MrtKbjcsHnk"] || ""}
                </div>
                <div>
                  {t("DATE_OF_REGISTRATION")}{" "}
                  <span style={S.bold}>{formatDate(certificate?.["occurredAt"])}</span>
                </div>
              </div>
            </div>

            {/* ═══════ PARTICULARS TABLE ═══════ */}
            <div style={{ border: S.border, display: "flex", flexDirection: "column" }}>

              {/* ── ROW: Particulars of Child ── */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                <div
                  style={{
                    width: "28mm",
                    flexShrink: 0,
                    borderRight: S.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: S.fsSm,
                    padding: "1mm",
                    lineHeight: 1.3,
                  }}
                >
                  <Trans i18nKey="PARTICULARS_OF_CHILD" />
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("1")} {t("SEX")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["wxrDsUO1ELy"]] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("2")} {t("DATE_AND_TIME_OF_BIRTH")}{" "}
                      <span style={S.bold}>
                        {formatDateTime(
                          certificate?.["zAetLzp3cT1"],
                          certificate?.["uOK1Wcm91NB"]
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("3")} {t("PLACE_OF_BIRTH")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["JAU9NM7UqQP"]] || certificate?.["JAU9NM7UqQP"] || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Father ── */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                <div
                  style={{
                    width: "28mm",
                    flexShrink: 0,
                    borderRight: S.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: S.fsSm,
                    padding: "1mm",
                    lineHeight: 1.3,
                  }}
                >
                  <Trans i18nKey="PARTICULAR_OF_FATHER" />
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("4")} {t("NAME")}{" "}
                      <span style={S.bold}>
                        {certificate?.["RKs8td9BnNj"] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("5")} {t("RACE")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["mIRVmCzC7Tt"]] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("6")} {t("CITIZENSHIP_AND_NRC")}{" "}
                      <span style={S.bold}>
                        {getCitizenshipDisplay(
                          certificate["ed2RBrhMhnN"],
                          certificate["Fwa7gEzjZAH"],
                          certificate["YE1wx1a4Ky4"]
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("7")} {t("RELIGION")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["m4b4SSlipKJ"]] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("8")} {t("OCCUPATION")}{" "}
                      <span style={S.bold}>
                        {certificate?.["CjjgDMbqfXX"] || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Mother ── */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                <div
                  style={{
                    width: "28mm",
                    flexShrink: 0,
                    borderRight: S.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: S.fsSm,
                    padding: "1mm",
                    lineHeight: 1.3,
                  }}
                >
                  <Trans i18nKey="PARTICULAR_OF_MOTHER" />
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("9")} {t("NAME")}{" "}
                      <span style={S.bold}>
                        {certificate?.["UYmZMZt32hZ"] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("10")} {t("RACE")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["XFmGvaRAJqP"]] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("11")} {t("CITIZENSHIP_AND_NRC")}{" "}
                      <span style={S.bold}>
                        {getCitizenshipDisplay(
                          certificate["r8oFvT4PZwL"],
                          certificate["M8pvzjPdija"],
                          certificate["CowkFxAoqnl"]
                        )}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("12")} {t("RELIGION")}{" "}
                      <span style={S.bold}>
                        {options[certificate?.["QsUp6BSb8Du"]] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", borderBottom: S.borderDot, flex: 1 }}>
                      {t("13")} {t("OCCUPATION")}{" "}
                      <span style={S.bold}>
                        {certificate?.["vg5hhREmzXe"] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1, minHeight: "10mm", lineHeight: 1.5 }}>
                      {t("14")} {t("PERMANENT_ADDRESS")}{" "}
                      <span style={S.bold}>{permanentAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Person (certifier) ── */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                <div
                  style={{
                    width: "28mm",
                    flexShrink: 0,
                    borderRight: S.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: S.fsSm,
                    padding: "1mm",
                    lineHeight: 1.3,
                  }}
                >
                  <Trans i18nKey="PARTICULAR_OF_PERSON" />
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "18mm",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("SIGNATURE")}
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("NAME")}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("QUALIFICATION")}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Informant ── */}
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: "28mm",
                    flexShrink: 0,
                    borderRight: S.border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: S.fsSm,
                    padding: "1mm",
                    lineHeight: 1.3,
                  }}
                >
                  <Trans i18nKey="PARTICULAR_OF_INFORMANT" />
                </div>
                <div style={{ flex: 1, display: "flex" }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "18mm",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("SIGNATURE")}
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("NAME")}{" "}
                      <span style={S.bold}>
                        {certificate?.["YdNUYjH3rct"] || ""}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("RELATION_TO_CHILD")}{" "}
                      <span style={S.bold}>
                        {certificate?.["eYh3U6sXrTQ"] || ""}
                      </span>
                    </div>
                    <div style={{ padding: "1mm 2mm", flex: 1 }}>
                      {t("ADDRESS")}{" "}
                      <span style={S.bold}>
                        {certificate?.["rRpqp6TPWlh"] || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════ FOOTER: Certification text ═══════ */}
            <div
              style={{
                marginTop: "1.5mm",
                fontSize: S.fsXs,
                lineHeight: 1.45,
                textAlign: "left",
                padding: "0 2mm",
              }}
            >
              <p style={{ textIndent: "12mm", margin: "0 0 1mm 0" }}>
                {t("STILL_BORN_PARA1_VALIDATION")}
              </p>
              <p style={{ textIndent: "12mm", margin: "0 0 1mm 0" }}>
                {t("STILL_BORN_PARA2_VALIDATION")}
              </p>
            </div>

            {/* ── Registration Officer (centered) + QR ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: S.fsSm,
                lineHeight: 1.4,
                marginTop: "3mm",
              }}
            >
              <div style={{ flex: 1 }} />

              {/* Center: Registration Officer's { Signature / Name / Designation }
                   The label is placed in the "middle row" of the brace so it
                   aligns with the "Name" line specifically. */}
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  gap: "2mm",
                }}
              >
                {/* Left stack: 3 equal rows - label sits in middle row (Name) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "right",
                  }}
                >
                  <div>&nbsp;</div>
                  <div style={{ fontWeight: 700 }}>
                    {t("REGISTRATION_OFFICER")}
                  </div>
                  <div>&nbsp;</div>
                </div>
                <div
                  style={{
                    fontSize: "28pt",
                    fontWeight: 400,
                    lineHeight: 1,
                    transform: "scaleY(1.6)",
                    transformOrigin: "center",
                    padding: "0 1mm",
                    alignSelf: "center",
                  }}
                >
                  {"{"}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div>{t("SIGNATURE")}</div>
                  <div>
                    {t("NAME")}{" "}
                    <span style={S.bold}>
                      {certificate?.["B1QxOlRIEVk"] || ""}
                    </span>
                  </div>
                  <div>
                    {t("DESIGNATION")}{" "}
                    <span style={S.bold}>
                      {certificate?.["qsIjbrXLBL5"] || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: QR Code */}
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                {url && (
                  <img
                    src={url}
                    alt="QR Code"
                    style={{ width: "20mm", height: "20mm" }}
                  />
                )}
              </div>
            </div>

            {/* ── Date at the very bottom ── */}
            <div
              style={{
                marginTop: "2mm",
                fontSize: S.fsSm,
                textAlign: "left",
                padding: "0 2mm",
              }}
            >
              {t("DATE")} <span style={S.bold}>{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Reason for re-issuance ── */}
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
            <h3 style={{ textAlign: "center", margin: "0 0 16px 0" }}>
              Please provide the reason
            </h3>
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
                fontFamily: "inherit",
              }}
            />
            <Button
              color="primary"
              variant="contained"
              disabled={!reason}
              onClick={handleSubmitReason}
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
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

export default LateFoetalDeathCert;
