import React, { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import { Button } from "@mui/material";
import QrCode from "qrcode";
import { NUMBERS } from "../constants";
import CertField from "../components/certificate/CertField";
import { buildCertificateCss } from "../components/certificate/certificateCss";

const BirthCertificate = ({ blank = false } = {}) => {
  const [url, setUrl] = useState("");
  const [certificate, setCertificate] = useState({});
  const [options, setOptions] = useState({});
  const [orgUnit, setOrgUnit] = useState({});

  const { t, i18n } = useTranslation();
  const pdfRef = useRef();

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const [printMode, setPrintMode] = useState("full");
  const [preview, setPreview] = useState(false);
  const currentDate = (() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  })();

  const navigate = useNavigate();

  const { search } = useLocation();
  const event = new URLSearchParams(search).get("birth");

  useEffect(() => {
    const resetPrintMode = () => setPrintMode("full");
    window.addEventListener("afterprint", resetPrintMode);
    return () => window.removeEventListener("afterprint", resetPrintMode);
  }, []);

  useEffect(() => {
    if (event) {
      const default_url = `https://hmistraining.mm.dhis2.net/train/api/apps/Birth-Death-Certificate/index.html#/birth-certificate?birth=${event}`;
      QrCode.toDataURL(default_url, {
        width: 200,
        margin: 1,
        errorCorrectionLevel: "H",
        color: {
          dark: "#cc0000",
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
                (translation) =>
                  (lang[translation.locale] = translation.value)
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
  };const removeNumbersDots = (value) => value?.replace(/[0-9.]+/g, "").trim() ?? value;

  // Format an ISO date / plain date string (e.g. "2026-04-13T00:00:00.000" or "2026-04-13") to "DD-MM-YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const datePart = String(dateStr).split("T")[0].split(" ")[0];
    const parts = datePart.split("-");
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`;
  };

  // Format date + time → "DD-MM-YYYY HH:MM"
  const formatDateTime = (dateStr, timeStr) => {
    const d = formatDate(dateStr);
    const t = timeStr ? String(timeStr).trim() : "";
    return t ? `${d} ${t}` : d;
  };

  const updateEventInDHIS2 = async (issueCount, reason) => {
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
      const opts = {
        margin: 0,
        filename: "Birth Certificate.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: i18n.language?.startsWith("br") ? 2 : 3,
          useCORS: true,
          letterRendering: false,
        },
        jsPDF: {
          orientation: "landscape",
          format: "a4",
          compress: true,
        },
      };
      html2pdf()
        .set(opts)
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
      handleCertificateOutput();
    }
  };

  const handleSubmitReason = async () => {
    setShowModal(false);
    const count = issueCount + 1;
    setIssueCount(count);
    await updateEventInDHIS2(count, reason);
    setReason("");
    handleCertificateOutput();
  };

  const handlePrintMode = (mode) => {
    flushSync(() => {
      setPrintMode(mode);
    });
    requestAnimationFrame(() => window.print());
  };

  const handlePrint = () => {
    handlePrintMode("full");
  };

  const handleDataOnlyPrint = () => {
    handlePrintMode("data-only");
  };

  const handleCertificateOutput = () => {
    if (i18n.language?.startsWith("br")) {
      handleDownloadPDF();
    } else {
      handlePrint();
    }
  };

  if (!certificate) return <div>No certificate data found.</div>;

  /* ── shared style fragments ── */
  const S = {
    color: "#b71c1c",
    border: "1px solid #b71c1c",
    borderDot: "1px dashed #b71c1c",
    fs: "8pt",
    fsSm: "8pt",
    fsXs: "8pt",
    fsLg: "9.5pt",
    bold: { fontWeight: 400 },
  };

  const permanentAddress = certificate?.["bVyrfnpCd6i"]
    ? certificate["bVyrfnpCd6i"]
        .split(",")
        .map((addr) => options[addr] || addr)
        .join(", ")
    : "";
  const certificateFontFamily = i18n.language?.startsWith("br")
    ? '"Pyidaungsu", "Myanmar Text", "Padauk", sans-serif'
    : "Arial, sans-serif";
  const counterfoilFatherNameLabel = i18n.language?.startsWith("br")
    ? "ဖခင်အမည်"
    : t("NAME_OF_FATHER");
  const counterfoilMotherNameLabel = i18n.language?.startsWith("br")
    ? "မိခင်အမည်"
    : t("NAME_OF_MOTHER");

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
          {/* Full certificate print is kept for later use.
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
          */}
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
              lineHeight: 2.25,
              rowGap: "0.9mm",
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
              {t("BIRTH_CERTIFICATE_COUNTERFOIL")}
            </div>

            <div style={{ fontWeight: 700, marginBottom: "1mm" }}>
              <strong>{t("VR_103")}</strong>
            </div>

            <CertField label={t("MBDR_UNIQUE_ID")} value={certificate?.event || ""} />
            <CertField
              label={t("DATE_OF_REGISTRATION")}
              value={formatDate(certificate?.["occurredAt"])}
            />
            <CertField
              label={t("Name_of_child")}
              value={certificate?.["R43kdns3YYL"] || ""}
            />
            <CertField
              label={t("SEX")}
              value={options[certificate?.["wxrDsUO1ELy"]] || ""}
            />
            <CertField
              label={t("DATE_AND_TIME_OF_BIRTH")}
              value={formatDateTime(
                certificate?.["zAetLzp3cT1"],
                certificate?.["uOK1Wcm91NB"]
              )}
            />
            <CertField
              label={t("PLACE_OF_BIRTH")}
              value={options[certificate?.["JAU9NM7UqQP"]] || certificate?.["JAU9NM7UqQP"] || ""}
            />
            <CertField
              label={counterfoilFatherNameLabel}
              value={certificate?.["RKs8td9BnNj"] || ""}
            />
            <CertField
              label={counterfoilMotherNameLabel}
              value={certificate?.["UYmZMZt32hZ"] || ""}
            />
            <CertField 
            height='15mm'
            valueStyle={{whiteSpace: "normal"}}
            label={t("PERMANENT_ADDRESS")} value={permanentAddress} />

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
            {/* ── Header: Title centered, red box on right with white text ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5mm",
                gap: "4mm",
              }}
            >
              <div style={{ flex: 1 }} />
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "12pt",
                  letterSpacing: "1px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {t("BIRTH_CERTIFICATE")}
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    background: S.color,
                    color: "#fff",
                    fontSize: S.fsSm,
                    fontWeight: 700,
                    padding: "1.5mm 3mm",
                    textAlign: "center",
                    lineHeight: 1.3,
                    maxWidth: "60mm",
                  }}
                >
                  {t("THIS_CERTIFICATE_WILL_NOT_BE_PROOF")}
                </div>
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
                  <strong>{t("VR_103")}</strong>
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

              {/* Right: Book / Page / Entry */}
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

            {/* ═══════ PARTICULARS TABLE ═══════ */}
            <div style={{ border: S.border, display: "flex", flexDirection: "column", whiteSpace: "nowrap", overflow: "hidden" }}>

              {/* ── ROW: Particulars of Child ── */}
              <div
                style={{
                  display: "flex",
                  borderBottom: S.border,
                  height: "17mm",
                }}
              >
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
                <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("1")} ${t("Name_of_child")}`}
                      value={certificate?.["R43kdns3YYL"] || ""}
                    />
                    <CertField
                      style={{ padding: "1mm 2mm", flex: 1 }}
                      label={`${t("2")} ${t("SEX")}`}
                      value={options[certificate?.["wxrDsUO1ELy"]] || ""}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("3")} ${t("DATE_AND_TIME_OF_BIRTH")}`}
                      value={formatDateTime(
                        certificate?.["zAetLzp3cT1"],
                        certificate?.["uOK1Wcm91NB"]
                      )}
                    />
                    <CertField
                      style={{ padding: "1mm 2mm", flex: 1 }}
                      label={`${t("4")} ${t("PLACE_OF_BIRTH")}`}
                      value={options[certificate?.["JAU9NM7UqQP"]] || certificate?.["JAU9NM7UqQP"] || ""}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Father ── */}
              <div
                style={{
                  display: "flex",
                  borderBottom: S.border,
                  height: "20mm",
                }}
              >
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
                <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("5")} ${t("NAME")}`}
                      value={certificate?.["RKs8td9BnNj"] || ""}
                    />
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("6")} ${t("RACE")}`}
                      value={[
                        options[certificate?.["mIRVmCzC7Tt"]],
                        certificate?.["Wg3ceiNXr3i"],
                      ].filter(Boolean).join(", ")}
                    />
                    <CertField
                      style={{ padding: "1mm 2mm", flex: 1 }}
                      label={`${t("7")} ${t("CITIZENSHIP_AND_NRC")}`}
                      value={getCitizenshipDisplay(
                        certificate["ed2RBrhMhnN"],
                        certificate["Fwa7gEzjZAH"],
                        certificate["YE1wx1a4Ky4"]
                      )}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("8")} ${t("RELIGION")}`}
                      value={options[certificate?.["m4b4SSlipKJ"]] || ""}
                    />
                    <CertField
                      style={{ padding: "1mm 2mm", flex: 1 }}
                      label={`${t("9")} ${t("OCCUPATION")}`}
                      value={certificate?.["CjjgDMbqfXX"] || ""}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Mother ── */}
              <div
                style={{
                  display: "flex",
                  borderBottom: S.border,
                  height: "25mm",
                }}
              >
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
                <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      borderRight: S.borderDot,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("10")} ${t("NAME")}`}
                      value={certificate?.["UYmZMZt32hZ"] || ""}
                    />
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("11")} ${t("RACE")}`}
                      value={[
                          options[certificate?.["XFmGvaRAJqP"]],
                          certificate?.["Vv6CLsgwrzj"],
                        ].filter(Boolean).join(", ")}
                    />
                    <CertField
                      style={{ padding: "1mm 2mm", flex: 1 }}
                      label={`${t("12")} ${t("CITIZENSHIP_AND_NRC")}`}
                      value={getCitizenshipDisplay(
                        certificate["r8oFvT4PZwL"],
                        certificate["M8pvzjPdija"],
                        certificate["CowkFxAoqnl"]
                      )}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("13")} ${t("RELIGION")}`}
                      value={options[certificate?.["QsUp6BSb8Du"]] || ""}
                    />
                    <CertField
                      style={{ borderBottom: S.borderDot, padding: "1mm 2mm", flex: 1 }}
                      label={`${t("14")} ${t("OCCUPATION")}`}
                      value={certificate?.["vg5hhREmzXe"] || ""}
                    />
                    {/* fixed 2-line box: long addresses wrap instead of clipping */}
                    <CertField
                      lines={2}
                      height="12mm"
                      style={{ padding: "1mm 2mm", flexShrink: 0 }}
                      label={`${t("15")} ${t("PERMANENT_ADDRESS")}`}
                      value={permanentAddress}
                    />
                  </div>
                </div>
              </div>

              {/* ── ROW: Particulars of Informant ── */}
              <div
                style={{
                  display: "flex",
                  borderBottom: S.border,
                  height: "19mm",
                }}
              >
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
                <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "16mm",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        padding: "2mm 2mm",
                        flex: 1,
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "2mm",
                      }}
                    >
                      {t("SIGNATURE")}
                    </div>
                    <CertField
                      style={{ padding: "1.5mm 2mm", flex: 1 }}
                      label={t("NAME")}
                      value={certificate?.["YdNUYjH3rct"] || ""}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <CertField
                      style={{ padding: "2mm 2mm 1.5mm", flex: 1 }}
                      label={t("RELATION_TO_CHILD")}
                      value={certificate?.["eYh3U6sXrTQ"] || ""}
                    />
                    {/* fixed 2-line box for the informant address */}
                    <CertField
                      lines={2}
                      height="10mm"
                      style={{ padding: "1mm 2mm", flexShrink: 0 }}
                      label={t("ADDRESS")}
                      value={certificate?.["rRpqp6TPWlh"] || ""}
                    />
                  </div>
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
                {t("LIVE_BIRTH_PARA1_VALIDATION")}
              </p>
              <p style={{ textIndent: "12mm", margin: "0 0 2.2mm 0" }}>
                {t("LIVE_BIRTH_PARA2_VALIDATION")}
              </p>
            </div>

            {/* ── Registration Officer (centered, between paragraphs) + QR ── */}
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

            {/* ── Bottom note (Para 3) ── */}
            <div
              style={{
                marginTop: "3mm",
                fontSize: S.fsXs,
                lineHeight: 1.55,
                textAlign: "left",
                padding: "0 2mm",
                textIndent: "12mm",
              }}
            >
              {t("LIVE_BIRTH_PARA3_VALIDATION")}
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

export default BirthCertificate;
