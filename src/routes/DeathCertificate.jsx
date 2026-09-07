import React, { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import QrCode from "qrcode";
import { NUMBERS } from "../constants";
import CertField from "../components/certificate/CertField";
import { buildCertificateCss } from "../components/certificate/certificateCss";

const DeathCertificate = ({ blank = false } = {}) => {
  const [url, setUrl] = useState("");
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const [printMode, setPrintMode] = useState("full");
  const [preview, setPreview] = useState(false);
  const pdfRef = useRef();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const currentDate = (() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  })();

  const { search } = useLocation();
  const event = new URLSearchParams(search).get("death");

  useEffect(() => {
    const resetPrintMode = () => setPrintMode("full");
    window.addEventListener("afterprint", resetPrintMode);
    return () => window.removeEventListener("afterprint", resetPrintMode);
  }, []);

  useEffect(() => {
    if (event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/death-certificate?death=${event}`;
      QrCode.toDataURL(default_url, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then(setUrl)
        .catch(console.error);

      const fetchEvents = async () => {
        const resOptions = await api.fetchOthers("/api/optionSets.json", [
          "fields=options[id,name,code,translations]",
          "filter=id:in:[mRAsObydjNZ,xYdFirocaSj,bc2tQPU8ogy,MDNwHnWn2Ik,pUN5lFHkUu6,YNtzjFwAJVU,G5ojzNPIyxf,fgAaYvqGZqY,MJG9doiGtjX]",
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
const removeNumbersDots = (value) => value?.replace(/[0-9.]+/g, "").trim() ?? value;
  // Format an ISO date / plain date string to "DD-MM-YYYY"
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

  const ageElements = {
    days: "atkmpYCcz3x",
    hours: "zvmLxhbRqjY",
    months: "bQQ995GlXtQ",
    years: "MhXN2y88M4h",
  };

  const getAgeDisplay = (cert) => {
    const check = (value, singular, plural) => {
      const num = Number(value);
      return num === 1 ? `${num} ${singular}` : `${num} ${plural}`;
    };
    if (cert?.[ageElements.days]) {
      return check(cert[ageElements.days], "day", "days");
    }
    if (cert?.[ageElements.hours]) {
      return check(cert[ageElements.hours], "hour", "hours");
    }
    if (cert?.[ageElements.months]) {
      return check(cert[ageElements.months], "month", "months");
    }
    if (cert?.[ageElements.years]) {
      return check(cert[ageElements.years], "year", "years");
    }
    return "";
  };

  const handleDownloadPDF = () => {
    setHideBackArrow(true);
    if (pdfRef.current) {
      const opts = {
        margin: 0,
        filename: "Death Certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: i18n.language?.startsWith("br") ? 2 : 3,
          useCORS: true,
          letterRendering: false,
        },
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
    }
  };

  const updateEventInDHIS2 = async (ic) => {
    const dataValues = [];
    if (ic) {
      dataValues.push({ dataElement: "UlMXHCJhyNZ", value: ic });
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
    const count = issueCount + 1;
    setIssueCount(count);
    await updateEventInDHIS2(count);
    handleDownloadPDF();
  };

  const handlePrintMode = (mode) => {
    flushSync(() => {
      setPrintMode(mode);
    });
    requestAnimationFrame(() => window.print());
  };

  const handleDataOnlyPrint = () => {
    handlePrintMode("data-only");
  };

  if (!certificate) return <div>No certificate data found.</div>;

  /* ── shared style fragments ── */
  const S = {
    color: "#000",
    border: "1px solid #000",
    borderDot: "1px dashed #000",
    fs: "8pt",
    fsSm: "8pt",
    fsXs: "8pt",
    fsLg: "9.5pt",
    bold: { fontWeight: 400 },
  };

  const permanentAddress = certificate?.["iXXvJAxbOtd"]
    ? certificate["iXXvJAxbOtd"]
        .split(",")
        .map((addr) => options[addr] || addr)
        .join(", ")
    : "";
  const certificateFontFamily = i18n.language?.startsWith("br")
    ? '"Pyidaungsu", "Myanmar Text", "Padauk", sans-serif'
    : "Arial, sans-serif";

  return (
    <>
      {/* ── print & page styles (shared, layout-invariant) ── */}
      <style>{buildCertificateCss()}</style>

      <div className={`cert-wrapper print-${printMode} ${preview ? "preview-data-only" : ""}`} style={{ background: "#f5f5f5", minHeight: "100vh", padding: "0" }}>
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
          {blank ? (
            <button
              onClick={() => window.print()}
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
          ) : (
            <>
          <button
            onClick={handleIssueClick}
            disabled={issueCount > 0}
            style={{
              padding: "8px 20px",
              background: issueCount > 0 ? "#999" : "#1565c0",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: issueCount > 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Issue Certificate {issueCount > 0 && `(${issueCount})`}
          </button>
          <button
            onClick={handleDataOnlyPrint}
            style={{
              padding: "8px 20px",
              background: "#263238",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Print Certificate
          </button>
          <button
            onClick={() => setPreview((p) => !p)}
            style={{
              padding: "8px 20px",
              background: preview ? "#6a1b9a" : "#7e57c2",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            {preview ? "Hide Data Preview" : "Preview Data Fit"}
          </button>
            </>
          )}
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
            fontFamily: certificateFontFamily,
            fontSize: S.fs,
            color: S.color,
            display: "flex",
            overflow: "hidden",
            position: "relative",
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
              width: "65mm",
              flexShrink: 0,
              borderRight: `1.5px dashed ${S.color}`,
              paddingRight: "3mm",
              paddingTop: "4mm",
              display: "flex",
              flexDirection: "column",
              fontSize: S.fsSm,
              lineHeight: 2.05,
              rowGap: "0.7mm",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: S.fsLg,
                marginBottom: "1mm",
                lineHeight: 1.2,
                textAlign: "left",
                whiteSpace: "normal",
              }}
            >
              {t("DEATH_CERTIFICATE_COUNTERFOIL")}
            </div>

            <div style={{ fontWeight: 700, marginBottom: "1mm" }}>
              <strong>{t("VR_203")}</strong>
            </div>

            <CertField label={t("MBDR_UNIQUE_ID")} value={certificate?.event || ""} />
            <CertField
              label={t("DATE_OF_REGISTRATION")}
              value={formatDate(certificate?.["occurredAt"])}
            />
            <CertField
              label={t("NAME_OF_DECEASED")}
              value={certificate?.["aTbE3kYe98D"] || ""}
            />
            <CertField
              label={t("SEX")}
              value={options[certificate?.["wxrDsUO1ELy"]] || ""}
            />
            <CertField
              label={t("DATE_AND_TIME_OF_DEATH")}
              value={formatDateTime(
                certificate?.["jGGNvNYhu47"],
                certificate?.["VldUFL2RpDz"]
              )}
            />
            <CertField
              label={t("PLACE_OF_DEATH")}
              value={options[certificate?.["MOV6uMBMkph"]] || certificate?.["MOV6uMBMkph"] || ""}
            />
            <CertField
              height='15mm'
              label={t("CAUSE_OF_DEATH")}
              value={options[certificate?.["nQy5xQrOMXj"]] || certificate?.["nQy5xQrOMXj"] || ""}
            />
            <div style={{ marginTop: "2mm" }}>
              {t("SIGNATURE_OF_ISSUING_PERSON")}
            </div>
            <div>{t("NAME_OF_ISSUING_PERSON")}</div>
            <CertField label={t("DATE_OF_ISSUE")} value={blank ? '' : currentDate} />

            {/* QR Code - Left */}
            <div style={{ marginTop: "4mm", textAlign: "center", height: "24mm" }}>
              {url && (
                <img
                  className="cert-value"
                  src={url}
                  alt="QR Code"
                  style={{ width: "24mm", height: "24mm" }}
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
                  fontSize: "12pt",
                  letterSpacing: "1px",
                  textAlign: "center",
                }}
              >
                {t("DEATH_CERTIFICATE")}
              </div>
            </div>

            {/* ── Sub-header row: VR form + location + book info ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1mm",
                fontSize: S.fsSm,
                lineHeight: 1.4,
              }}
            >
              {/* Left: VR form + location */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, marginBottom: "1mm" }}>
                  <strong>{t("VR_203")}</strong>
                </div>
                <CertField
                  height="4mm"
                  label={t("STATE_REGION")}
                  value={removeNumbersDots(orgUnit?.ancestors?.[1]?.name) || ""}
                />
                {/* District and Township each get a fixed-width slot so the
                    township position never depends on the district value */}
                <div style={{ display: "flex", height: "4mm" }}>
                  <CertField
                    style={{ width: "48%", flexShrink: 0 }}
                    label={t("DISTRICT")}
                    value={removeNumbersDots(orgUnit?.ancestors?.[2]?.name) || ""}
                  />
                  <CertField
                    style={{ flex: 1, minWidth: 0 }}
                    label={t("TOWNSHIP")}
                    value={removeNumbersDots(orgUnit?.ancestors?.[3]?.name) || ""}
                  />
                </div>
                <CertField
                  height="4mm"
                  label={t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
                  value={removeNumbersDots(orgUnit?.name) || ""}
                />
              </div>

              {/* Right: Book / Page / Entry / Date of Registration */}
              <div
                style={{
                  width: "62mm",
                  flexShrink: 0,
                  textAlign: "left",
                  paddingLeft: "4mm",
                  whiteSpace: "nowrap",
                }}
              >
                <CertField height="4mm" label={t("MBDR_UNIQUE_ID")} value={certificate?.event || ""} />
                <CertField
                  height="4mm"
                  label={t("DATE_OF_REGISTRATION")}
                  value={formatDate(certificate?.["occurredAt"])}
                />
              </div>
            </div>

            {/* ═══════ PARTICULARS OF DECEASED TABLE ═══════ */}
            <div style={{ border: S.border, display: "flex", flexDirection: "column", whiteSpace: "nowrap", overflow: "hidden" }}>
              {/* Header bar */}
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  padding: "1mm",
                  borderBottom: S.border,
                  fontSize: S.fsSm,
                }}
              >
                {t("PARTICULARS_OF_DECEASED")}
              </div>

              {/* 2-col grid: 6 rows × 2 columns = 12 fields */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                {/* Left column: fields 1-6 */}
                <div style={{ flex: 1, borderRight: S.border, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("1")} ${t("NAME")}`}
                    value={certificate?.["aTbE3kYe98D"] || ""}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("2")} ${t("SEX")}`}
                    value={options[certificate?.["wxrDsUO1ELy"]] || ""}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("3")} ${t("DATE_AND_TIME_OF_DEATH")}`}
                    value={formatDateTime(
                      certificate?.["jGGNvNYhu47"],
                      certificate?.["VldUFL2RpDz"]
                    )}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("4")} ${t("PLACE_OF_DEATH")}`}
                    value={options[certificate?.["MOV6uMBMkph"]] || certificate?.["MOV6uMBMkph"] || ""}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("5")} ${t("AGE")}`}
                    value={getAgeDisplay(certificate)}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm" }}
                    label={`${t("6")} ${t("OCCUPATION")}`}
                    value={certificate?.["s3wKlMmBs8p"] || ""}
                  />
                </div>

                {/* Right column: fields 7-12 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("7")} ${t("RACE")}`}
                    value={[
                      options[certificate?.["b9BVo7x8248"]],
                      certificate?.["x7BjckVHXKk"]
                    ].filter(Boolean).join(", ")}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("8")} ${t("CITIZENSHIP_AND_NRC")}`}
                    value={getCitizenshipDisplay(
                      certificate["JB1wN0sieDP"],
                      certificate["wCN9fWzFtKE"],
                      certificate["Bog1BdtvCiw"]
                    )}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("9")} ${t("RELIGION")}`}
                    value={options[certificate?.["TseVgVwxzx9"]] || ""}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("10")} ${t("PERMANENT_ADDRESS")}`}
                    value={permanentAddress}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm", borderBottom: S.borderDot }}
                    label={`${t("11")} ${t("NAME_OF_FATHER_DECEASED")}`}
                    value={certificate?.["OpzRl6KIFVU"] || ""}
                  />
                  <CertField
                    style={{ padding: "1mm 2mm" }}
                    label={`${t("12")} ${t("NAME_OF_MOTHER_DECEASED")}`}
                    value={certificate?.["xHcmoS3icZD"] || ""}
                  />
                </div>
              </div>

              {/* Row 13: Cause of Death — fixed 2-line box */}
              <CertField
                lines={2}
                height="10mm"
                style={{ padding: "1mm 2mm", borderBottom: S.border }}
                label={`${t("13")} ${t("CAUSE_OF_DEATH")}`}
                value={options[certificate?.["nQy5xQrOMXj"]] || certificate?.["nQy5xQrOMXj"] || ""}
              />

              {/* Row 14: Informant */}
              <div style={{ display: "flex", borderBottom: S.border }}>
                <div style={{ flex: 1, borderRight: S.border, padding: "1mm 2mm", minWidth: 0 }}>
                  <div>
                    {t("14")} {t("Informants_Signature")}
                  </div>
                  <CertField
                    style={{ paddingLeft: "6mm", marginTop: "1mm" }}
                    label={t("NAME")}
                    value={certificate?.["YdNUYjH3rct"] || ""}
                  />
                </div>
                <div style={{ flex: 1, padding: "1mm 2mm", minWidth: 0 }}>
                  <CertField
                    label={t("RELATION_TO_DECEASED")}
                    value={certificate?.["qa5eIb216nF"] || ""}
                  />
                  <CertField
                    style={{ marginTop: "1mm" }}
                    label={t("ADDRESS")}
                    value={certificate?.["rRpqp6TPWlh"] || ""}
                  />
                </div>
              </div>

              {/* Row 15: Cause of Death Certifier */}
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1, borderRight: S.border, padding: "1mm 2mm" }}>
                  {t("15")} {t("CAUSE_OF_DEATH_CERTIFIERS")}
                </div>
                <div style={{ flex: 1, padding: "1mm 2mm", minWidth: 0 }}>
                  <div>{t("SIGNATURE")}</div>
                  <CertField
                    label={t("NAME")}
                    value={certificate?.["RkPGXTudjFI"] || ""}
                  />
                  <CertField
                    label={t("DESIGNATION")}
                    value={certificate?.["NxtfpJnOOHx"] || ""}
                  />
                </div>
              </div>
            </div>

            {/* ═══════ FOOTER: Certification text ═══════ */}
            <div
              style={{
                marginTop: "3mm",
                fontSize: S.fsXs,
                lineHeight: 1.55,
                textAlign: "left",
                padding: "0 2mm",
              }}
            >
              <p style={{ textIndent: "12mm", margin: "0 0 2.2mm 0" }}>
                {t("DEATH_PARA1_VALIDATION")}
              </p>
              <p style={{ textIndent: "12mm", margin: "0 0 2.2mm 0" }}>
                {t("DEATH_PARA2_VALIDATION")}
              </p>
            </div>

            {/* ── Registration Officer (centered) + QR ── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: S.fsSm,
                lineHeight: 1.8,
                marginTop: "2.5mm",
                height: "22mm",
              }}
            >
              <div style={{ flex: 1 }} />

              {/* Center: Registration Officer's { Signature / Name / Designation } */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3mm",
                }}
              >
                <div style={{ fontWeight: 700, textAlign: "right" }}>
                  {t("REGISTRATION_OFFICER")}
                </div>
                <div
                  style={{
                    fontSize: "28pt",
                    fontWeight: 400,
                    lineHeight: 1,
                    transform: "scaleY(1.6) translateY(1mm)",
                    transformOrigin: "center",
                    padding: "0 1mm",
                  }}
                >
                  {"{"}
                </div>
                {/* fixed width: the value must never widen the centered group */}
                <div style={{ textAlign: "left", width: "52mm", flexShrink: 0 }}>
                  <div>
                    {t("SIGNATURE")}
                  </div>
                  <CertField style={{ marginTop: "1.8mm" }} label={t("NAME")} value={""} />
                  <CertField style={{ marginTop: "1.8mm" }} label={t("DESIGNATION")} value={""} />
                </div>
              </div>

              {/* Right: QR Code */}
              <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                {url && (
                  <img
                    className="cert-value"
                    src={url}
                    alt="QR Code"
                    style={{ width: "20mm", height: "20mm" }}
                  />
                )}
              </div>
            </div>

            {/* ── Date at the very bottom ── */}
            <CertField
              style={{ marginTop: "2mm", fontSize: S.fsSm, padding: "0 2mm" }}
              label={t("DATE")}
              value={blank ? '' : currentDate}
            />
          </div>
        </div>
      </div>

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

export default DeathCertificate;
