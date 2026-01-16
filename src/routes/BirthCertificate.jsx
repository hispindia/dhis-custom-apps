// import React, { useEffect, useState, useRef } from "react";
// import html2pdf from "html2pdf.js";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import api from "../api";
// import { Button } from "@mui/material";

// const borderDotted = {
//   display: "inline-block",
//   borderBottom: "2px dotted red",
//   verticalAlign: "middle",
// };
// const borderSolid = {
//   borderBottom: "2px solid red",
//   width: "100%",
// };
// const borderGray = {
//   borderBottom: "2px solid red",
//   width: "100%",
// };

// const borderBlack = {
//   borderBottom: "2px dotted red",
//   width: "100%",
// };

// const styles = {
//   container: {
//     display: "flex",
//     gap: "16px",
//     width: "100%",
//     // Limit printable width for A4 landscape while allowing html2pdf scaling
//     maxWidth: "11.69in", // A4 width in inches (landscape)
//     boxSizing: "border-box",
//   },
//   leftPane: {
//     width: "8.06cm",
//     // padding: "12px",
//     boxSizing: "border-box",
//     color: "red",
//     fontSize: 12,
//     borderRight: "2px dashed red",

//     flexShrink: 0, // Prevent the left pane from shrinking
//   },
//   rightPane: {
//     flex: 1, // Allow the right pane to fill remaining space
//     paddingLeft: "15px",
//     boxSizing: "border-box",
//     color: "red",
//     fontSize: 13,
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "16px",
//     paddingBottom: "2.5cm",
//     color: "red",
//     height:'2.1cm'
//   },

//   sectionTitle: {
//     fontWeight: 600,
//     textAlign: "center",
//   },
//   smallField: {
//     display: "block",
//     borderBottom: "2px dotted red",
//     padding: "2px 4px",
//     marginTop: 6,
//   },
//   dottedLineInline: {
//     display: "inline-block",
//     borderBottom: "2px dotted red",
//     verticalAlign: "middle",
//     minWidth: 40,
//     marginLeft: 6,
//   },

//   footerSmall: { fontSize: 11, color: "red" },
// };

// const PRINT_ROW = {
//   minHeight: "0.65cm",
//   lineHeight: "0.65cm",
//   display: "flex",
//   alignItems: "center",
// };

// const PRINT_VALUE = {
//   display: "inline-block",
//   minHeight: "0.65cm",
//   lineHeight: "0.65cm",
//   overflow: "visible !important",
//   verticalAlign: "middle",
// };


// const BirthCertificate = ({ orgUnit, orgUnits, dataElements }) => {
//   const { state } = useLocation();
//   const [certificate, setCertificate] = useState(state?.record || null);
//   const { t } = useTranslation();
//   const pdfRef = useRef();
//   const orgUnitObj = {};
//   const [printPreview, setPrintPreview] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [reason, setReason] = useState("");
//   const [issueCount, setIssueCount] = useState(0);
//   const [showToast, setShowToast] = useState(false);
//   const [hideBackArrow, setHideBackArrow] = useState(false);
//   const navigate = useNavigate();
//   const currentDate = new Date().toLocaleDateString("en-GB");
// const printBorder = printPreview
//   ? "none"
//   : "2px dotted red";
//   const printBorderSolid = printPreview
//   ? "none"
//   : "2px solid red";

//   orgUnits.forEach((ou) => {
//     orgUnitObj[ou.id] = ou.name;
//   });
//   orgUnit = {
//     ...orgUnit,
//     path:
//       typeof orgUnit.path === "string"
//         ? orgUnit.path
//             .split("/")
//             .map((ou) => (orgUnitObj[ou] ? orgUnitObj[ou] : ou))
//         : [],
//   };

//   useEffect(() => {
//     const container = pdfRef.current;
//     if (!container) return;

//     const spans = container.querySelectorAll("span");

//     spans.forEach((span) => {
//       const style = window.getComputedStyle(span);

//       // Label = no dotted border
//       if (!style.borderBottom || style.borderBottom === "none") {
//         span.classList.add("hide-label");
//       }
//     });
//   }, []);

//   const getCitizenshipDisplay = (citizenShip, nrc, passport) => {
//     if (!citizenShip) {
//       return passport ? `${passport}` : "";
//     }
//     const c = String(citizenShip).trim();
//     const isMyanmar =
//       c.toLowerCase().includes("myanmar") ||
//       c.toLowerCase().includes("burmese");
//     if (isMyanmar) {
//       return nrc ? `${c}, ${nrc}` : c;
//     }

//     return passport ? ` ${passport}` : c;
//   };

//   useEffect(() => {
//     if (state?.record) {
//       setCertificate(state.record);
//       setIssueCount(
//         state.record["UlMXHCJhyNZ"] ? Number(state.record["UlMXHCJhyNZ"]) : 0
//       );
//     } else {
//       setCertificate(null);
//     }
//   }, [state]);

//   const updateEventInDHIS2 = async (issueCount, reason) => {
//     console.log(certificate);
//     const dataValues = [];
//     if (issueCount) {
//       dataValues.push({ dataElement: "UlMXHCJhyNZ", value: issueCount });
//     }
//     if (reason) {
//       dataValues.push({ dataElement: "ofuG4AdYrY1", value: reason });
//     }
//     const payload = {
//       events: [
//         {
//           event: certificate.event,
//           program: certificate.program,
//           orgUnit: certificate.orgUnit,
//           programStage: certificate.programStage,
//           occurredAt: certificate.occurredAt,
//           dataValues,
//         },
//       ],
//     };
//     await api.pushEvents(payload);
//   };

//   const handleDownloadPDF = async () => {
//     setHideBackArrow(true);

//     if (pdfRef.current) {
//       let newCount = issueCount + 1;
//       const options = {
//         margin: [0.315, 0, 0, 0], // [top, right, bottom, left] in inches (0.8cm)
//         filename: "Birth Certificate.pdf",
//         image: { type: "jpeg", quality: 0.95 },
//         html2canvas: {
//           scale: 2,
//           useCORS: true,
//         },
//         jsPDF: {
//           orientation: "landscape",
//           unit: "in",
//           format: "a4",
//           compress: true,
//         },
//       };
//       html2pdf()
//         .set(options)
//         .from(pdfRef.current)
//         .save()
//         .then(async () => {
//           setHideBackArrow(false);
//           setShowToast(true);
//           setTimeout(() => setShowToast(false), 3000);
//         });
//     }
//   };

//   const handleIssueClick = async () => {
//     if (issueCount > 0) setShowModal(true);
//     else {
//       const count = issueCount + 1;
//       setIssueCount(count);
//       await updateEventInDHIS2(count);
//       handleDownloadPDF();
//     }
//   };

//   const handleSubmitReason = async () => {
//     // console.log('reason', reason);
//     setShowModal(false);
//     const count = issueCount + 1;
//     setIssueCount(count);
//     await updateEventInDHIS2(count, reason);
//     setReason("");
//     handleDownloadPDF();
//   };
//   const handlePrint = () => {
//     // Enable print preview mode (hide labels, lock layout)
//     setHideBackArrow(true);
//     setPrintPreview(true);

//     // Give browser time to apply styles
//     setTimeout(() => {
//       window.print();

//       // Restore screen view after printing
//       setTimeout(() => {
//         setPrintPreview(false);
//       }, 300);
//     }, 300);
//   };

//   if (!certificate) return <div>No certificate data found.</div>;

//   return (
//     <>
//       <style>
//         {`
//         @media screen {
//   body * {
//     visibility: visible;
//   }
// }

// /* PRINT MODE */
// @media print {
//   /* Hide everything by default */
//   body * {
//     visibility: hidden !important;
//   }

//   /* Show only main certificate */
//   .certificate-page,
//   .certificate-page * {
//     visibility: visible !important;
//   }
// .border-solid,
//   .border-gray,
//   .border-black,
//   .borderDotted {
//     border-bottom: none !important;
//   }
//   /* Lock position to top-left */
//   .certificate-page {
//     position: absolute;
//     top: 0.8cm;
//     left: 0;
//   }
//       @media print {
//         @page {
//           size: 29cm 20.6cm;
//           margin: 0;
//         }
//  footer {
//     padding-top: 0.5cm !important;
//      height: auto !important;
//   }

//      header {
//     padding-bottom: 0.5cm !important;
//     height: auto !important;
//   }

//         // html, body {
//         //   width: 29.1cm;
//         //   height: 20.6cm;
//         //   margin: 0;
//         //   // padding: 0;
//         //   overflow: visible !important;
//         // }
// html, body {
//     width: 29cm;
//     height: 20.6cm;
//     margin: 0;
//     padding: 0;
//     overflow: hidden;
//   }
//         * {
//           overflow: visible !important;
//         }

//         .no-print {
//           display: none !important;
//         }

//         .hide-label {
//         visibility  : hidden !important;
//         }

//         main {
//           overflow: visible !important;
//         }
//       }
//     `}
//       </style>
//       <div
//         style={{
//           background: "#fff",
//           // padding: "16px",
//           fontFamily: "sans-serif",
//           width: "100%",

//         }}
//       >
//         <div className="hide-label" style={{ textAlign: "right" }}>
//           <button
//             onClick={handleIssueClick}
//             style={{
//               padding: "8px 16px",
//               background: "#1976d2",
//               color: "#fff",
//               border: "none",
//               borderRadius: 4,
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             Issue Certificate {issueCount > 0 && `(${issueCount})`}
//           </button>

//           {/* PRINT BUTTON */}
//           <button
//             onClick={handlePrint}
//             style={{
//               padding: "8px 12px",
//               background: "#d32f2f",
//               color: "#fff",
//               border: "none",
//               marginRight: "8px",
//               cursor: "pointer",
//               fontWeight: "bold",
//             }}
//           >
//             Print
//           </button>
//         </div>

//         <main
//           ref={pdfRef}
//          className={`certificate-page ${printPreview ? "print-preview" : ""}`}
//           style={{
//             width: "29cm",
//             height: "20.6cm",
//             // paddingTop: "0.5cm",
//             paddingBottom: "0.6cm",
//             paddingRight: "0.5cm",
//             display: "flex",
//             boxSizing: "border-box",

//             // margin: "0 auto",
//           }}
//         >
//           <div
//             style={{
//               width: "100%",
//               height: "100%",
//               display: "flex",
//               boxSizing: "border-box",
//             }}
//           >
//             <aside
//               style={{
//                 ...styles.leftPane,
//                 // borderBottom: printBorder, 
//                 width: "7.45cm",
//                 minWidth: "7.45cm",
//                 maxWidth: "7.45cm",
//                 height: "100%",
//                 boxSizing: "border-box",
//                 paddingLeft:'1.4cm'
//               }}
//             >
//               {!hideBackArrow && (
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     cursor: "pointer",
//                     marginBottom: "15px",
//                   }}
//                   onClick={() => navigate(-1)}
//                 >
//                   <ArrowBackIcon style={{ color: "black" }} />

//                   <h4
//                     style={{
//                       fontWeight: 600,
//                       textAlign: "left",
//                       marginLeft: "8px",
//                       marginBottom: "0",
//                       marginTop: "0",
//                     }}
//                   >
//                     {t("BIRTH_CERTIFICATE_COUNTERFOIL")}
//                   </h4>
//                 </div>
//               )}
//               <div style={{ fontSize: "15px" }}>
//                 <div style={{ fontWeight: 600 }}>
//                   {t("VR_103") || "V.R Form 103"}
//                 </div>
//                 <div style={{
//                   //  marginTop: "12px" 
//                    }}>
//                   <div style={PRINT_ROW}>
//                     <span className="hide-label" >{t("PAGE_NUMBER")}</span>
//                     <span
//                       style={{
//                         ...PRINT_VALUE,
//                          borderBottom: printBorder,
//                         minWidth: "165px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["PS99q9IRjKy"] || ""}
//                     </span>
//                   </div>

//                   <div style={{ marginTop: 8 }}>
//                     <span className="hide-label" > {t("BOOK_NUMBER")} </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "165px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["l0Pm3ydZ2om"] || ""}
//                     </span>
//                   </div>
//                   <div style={{ 
//                     // marginTop: 8 
//                     }}>
//                     <span className="hide-label"> {t("ENTRY_NUMBER")} </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "152px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["MrtKbjcsHnk"] || ""}
//                     </span>
//                   </div>
//                   <div style={{ 
//                     // marginTop: 8 
//                     }}>
//                     <span className="hide-label">
//                       {" "}
//                       {t("PLACE_OF_REGISTRATION")}{" "}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "136px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {orgUnitObj[certificate.orgUnit]}
//                     </span>
//                   </div>
//                   <div style={{
//                     //  marginTop: 8 
//                      }}>
//                     <span className="hide-label">
//                       {" "}
//                       {t("DATE_OF_REGISTRATION")}{" "}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "136px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["occurredAt"] || ""}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ fontSize: 15,
//                 //  marginTop: "22px" 
//                  }}>
//                 <div style={{ 
//                   // marginBottom: 10 
//                   }}>
//                   <div>
//                     <span className="hide-label"> {t("Name_of_child")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "179px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["R43kdns3YYL"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{

//                   // marginBottom: 8
//                    }}>
//                   <div>
//                     <span className="hide-label"> {t("SEX")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "230px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["wxrDsUO1ELy"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{
//                   //  marginBottom: 8 
//                    }}>
//                   <div>
//                     <span className="hide-label"> {t("PLACE_OF_BIRTH")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "180px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["JAU9NM7UqQP"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{
//                   //  marginBottom: 8
//                     }}>
//                   <div>
//                     <span className="hide-label">
//                       {" "}
//                       {t("DATE_AND_TIMEOFBIRTH")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "180px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["JAU9NM7UqQP"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{ 
//                   // marginBottom: 8
//                    }}>
//                   <div>
//                     <span className="hide-label"> {t("NAME_OF_FATHER")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "164px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["RKs8td9BnNj"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{ 
//                   // marginBottom: 8 
//                   }}>
//                   <div>
//                     <span className="hide-label"> {t("NAME_OF_MOTHER")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "150px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["UYmZMZt32hZ"] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{
//                   //  marginTop: 8 
//                    }}>
//                   <div>
//                     <span className="hide-label">
//                       {" "}
//                       {t("PERMANENT_ADDRESS")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "140px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.["bVyrfnpCd6i"] || ""}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ fontSize: 15, 
//                 // marginTop: "15px" 
//                 }}>
//                 <div style={{
//                   //  marginBottom: 8
//                     }}>
//                   <div>
//                     <span className="hide-label">
//                       {" "}
//                       {t("SIGNATURE_OF_ISSUING_PERSON")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "62px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.[""] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{ 
//                   // marginBottom: 8 
//                   }}>
//                   <div>
//                     <span className="hide-label">
//                       {" "}
//                       {t("NAME_OF_ISSUING_PERSON")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         // minWidth: "100px",
//                         // paddingLeft: "5px",
//                       }}
//                     >
//                       {certificate?.[""] || ""}
//                     </span>
//                   </div>
//                 </div>

//                 <div style={{
//                   //  marginBottom: 8 
//                    }}>
//                   <div>
//                     <p style={{ marginTop: 0 }}>
//                       <span className="hide-label"> {t("DATE_OF_ISSUE")} </span>
//                       <span
//                         style={{
//                           display: "inline-block",
//                           width: 24,
//                           verticalAlign: "middle",
//                           // paddingLeft: "5px",
//                         }}
//                       >
//                         {currentDate}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </aside>

//             {/* ===== RIGHT PANE - Main Certificate content ===== */}
//             <section style={styles.rightPane}>
//               <div style={{ display: "flex", justifyContent: "space-between",height:'2.15cm' ,width:'19.9cm'}}>
//                 <div style={{ width: "21%" }}></div>
//                 <div>
//                   <h2
//                     style={{
//                       fontSize: 20,
//                       color: "red",
//                       fontWeight: "bold",
//                       textAlign: "center",
//                       marginBottom: 4,
//                     }}
//                   >
//                     <span className="hide-label">
//                       {" "}
//                       {t("BIRTH_CERTIFICATE")}
//                     </span>
//                   </h2>
//                 </div>
//                 <div style={{ marginTop: 12 }}>
//                   <div
//                     style={{
//                       width: "7.5cm",
//                       height: "1.7cm",
//                       backgroundColor: "red",
//                       color: "white",
//                       fontWeight: "600",
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       textAlign: "center",
//                       lineHeight: "1.25",
//                       padding: "0 8px",
//                       boxSizing: "border-box",
//                     }}
//                   >
//                     <span>This certificate will not</span>
//                     <span style={{ marginTop: "5px" }}>
//                       be a proof for citizenship
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Header inside right pane */}
//               {/* <header style={styles.header}>
//                 <div style={{ color: "red", fontSize: 14, paddingTop: "15px",width:'12.1cm' }}>
//                   <p style={{ marginBottom: 8, fontWeight: "normal" }}>
//                     <span className="hide-label"> {t("VR_103")}</span>
//                   </p>
//                   <p style={{ marginBottom: 8, fontWeight: "normal" }}>
//                     <span className="hide-label"> {t("STATE_REGION")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         width: "37%",
//                         verticalAlign: "middle",
//                         marginLeft: 4,
//                         paddingLeft: "4px",
//                       }}
//                     >
//                       {orgUnit.path[2] ? orgUnit.path[2] : ""}
//                     </span>
//                   </p>
//                   <div style={{ display: "flex" }}>
//                     <p style={{ marginBottom: 8, fontWeight: "normal" }}>
//                       <span className="hide-label"> {t("DISTRICT")}</span>
//                       <span
//                         style={{
//                           display: "inline-block",
//                           borderBottom: printBorder,
//                           width: "30%",
//                           verticalAlign: "middle",
//                           marginLeft: 4,
//                           paddingLeft: "4px",
//                         }}
//                       >
//                         {orgUnit.path[3] ? orgUnit.path[3] : ""}
//                       </span>
//                     </p>
//                     <p style={{ marginBottom: 8, fontWeight: "normal" }}>
//                       <span className="hide-label"> {t("TOWNSHIP")}</span>
//                       <span
//                         style={{
//                           display: "inline-block",
//                           borderBottom: printBorder,
//                           width: "30%",
//                           verticalAlign: "middle",
//                           marginLeft: 4,
//                           paddingLeft: "4px",
//                         }}
//                       >
//                         {orgUnit.path[4] ? orgUnit.path[4] : ""}
//                       </span>
//                     </p>
//                   </div>

//                   <p style={{ marginBottom: 8, fontWeight: "normal" }}>
//                     <span className="hide-label">
//                       {" "}
//                       {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         width: "53px",
//                         verticalAlign: "middle",
//                         marginLeft: 4,
//                         paddingLeft: "4px",
//                       }}
//                     >
//                       {orgUnit.path[5] ? orgUnit.path[5] : ""}
//                     </span>
//                   </p>
//                 </div>

//                 <div
//                   style={{
//                     color: "red",
//                     fontSize: 13,
//                     paddingTop: "15px",
//                     textAlign: "left",
//                     // marginTop: "26px",

//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <span className="hide-label">{t("PAGE_NUMBER")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "200px",
//                         paddingLeft: "6px",
//                       }}
//                     >
//                       {certificate?.["PS99q9IRjKy"] || ""}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <span className="hide-label">{t("BOOK_NUMBER")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "200px",
//                         paddingLeft: "6px",
//                       }}
//                     >
//                       {certificate?.["l0Pm3ydZ2om"] || ""}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <span className="hide-label">{t("ENTRY_NUMBER")}</span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "200px",
//                         paddingLeft: "6px",
//                       }}
//                     >
//                       {certificate?.["MrtKbjcsHnk"] || ""}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <span className="hide-label">
//                       {t("DATE_OF_REGISTRATION")}
//                     </span>
//                     <span
//                       style={{
//                         display: "inline-block",
//                         borderBottom: printBorder,
//                         verticalAlign: "middle",
//                         minWidth: "200px",
//                         paddingLeft: "6px",
//                       }}
//                     >
//                       {certificate?.["occurredAt"] || ""}
//                     </span>
//                   </div>
//                 </div>
//               </header> */}
//               <header style={styles.header}>
//   {/* LEFT SECTION */}
//   <div style={styles.leftSection}>
//     <p style={styles.row}>
//       <span className="hide-label">{t("VR_103")}</span>
//     </p>

//     <p style={styles.row}>
//       <span className="hide-label">{t("STATE_REGION")}</span>
//       <span style={{ ...styles.line, width: "4.5cm" }}>
//         {orgUnit.path[2] || ""}
//       </span>
//     </p>

//     <div style={{ display: "flex", gap: "0.5cm" }}>
//       <p style={styles.row}>
//         <span className="hide-label">{t("DISTRICT")}</span>
//         <span style={{ ...styles.line, width: "3.2cm" }}>
//           {orgUnit.path[3] || ""}
//         </span>
//       </p>

//       <p style={styles.row}>
//         <span className="hide-label">{t("TOWNSHIP")}</span>
//         <span style={{ ...styles.line, width: "3.2cm" }}>
//           {orgUnit.path[4] || ""}
//         </span>
//       </p>
//     </div>

//     <p style={styles.row}>
//       <span className="hide-label">
//         {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
//       </span>
//       <span style={{ ...styles.line, width: "2.5cm" }}>
//         {orgUnit.path[5] || ""}
//       </span>
//     </p>
//   </div>

//   {/* RIGHT SECTION */}
//   <div style={{paddingTop:'1cm'}}>
//     <div style={styles.rightRow}>
//       <span className="hide-label" style={styles.rightLabel}>{t("PAGE_NUMBER")}</span>
//       <span style={{ width: "3.5cm",  borderBottom: printBorder, display: "inline-block",}}>
//         {certificate?.["PS99q9IRjKy"] || ""}
//       </span>
//     </div>

//     <div style={styles.rightRow}>
//       <span className="hide-label" style={styles.rightLabel}>{t("BOOK_NUMBER")}</span>
//       <span style={{ width: "3.5cm",  borderBottom: printBorder, display: "inline-block",}}>
//         {certificate?.["l0Pm3ydZ2om"] || ""}
//       </span>
//     </div>

//     <div style={styles.rightRow}>
//       <span className="hide-label" style={styles.rightLabel}>{t("ENTRY_NUMBER")}</span>
//       <span style={{ width: "3.5cm",  borderBottom: printBorder, display: "inline-block",}}>
//         {certificate?.["MrtKbjcsHnk"] || ""}
//       </span>
//     </div>

//     <div style={styles.rightRow}>
//       <span className="hide-label" style={{  }}>{t("DATE_OF_REGISTRATION")}</span>
//       <span style={{ ...styles.line, width: "3.5cm",   borderBottom: printBorder,}}>
//         {certificate?.["occurredAt"] || ""}
//       </span>
//     </div>
//   </div>
// </header>


//               <div style={{ width: "19.9cm", fontSize: 13,height:'7.75cm' }}>
//                 {/* Particular of Child */}
//                 <div>
//                   <div style={{borderBottom:printBorderSolid}}></div>
//                   <div style={{ display: "flex" }}>
//                     <div
//                       style={{
//                         width: "3.3cm",
//                         textAlign: "center",
//                         fontWeight: "600",
//                         color: "red",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         // paddingRight: 12,
//                         height:'1.95cm',
//                         borderRight: "2px solid red",
//                       }}
//                     >
//                       <span className="hide-label">
//                         {" "}
//                         {t("PARTICULARS_OF_CHILD")}
//                       </span>
//                     </div>
//                     <div style={{ width: "16.6cm" ,height:'1.95cm',}}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           // padding: "2px 5px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >

//                           <span className="hide-label" > {t("1")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("NAME")}{" "}
//                           </span>:  {certificate?.["R43kdns3YYL"] || ""}{" "}
//                         </div>
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("3")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("DATE_AND_TIME_OF_BIRTH")}:{" "}
//                           </span>
//                           {certificate?.["zAetLzp3cT1"] || ""}{" "}
//                           {certificate?.["uOK1Wcm91NB"] || ""}
//                         </div>
//                       </div>

//                       <div
//                         style={{borderBottom: printBorder,
//                            marginBottom: "2px"
//                            }}
//                       ></div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           // padding: "8px",
//                         }}
//                       >
//                         <div style={{ width: "50%", color: "red" }}>
//                           <span className="hide-label"> {t("2")}</span>
//                           <span className="hide-label"> {t("SEX")}</span>:
//                           {certificate?.["wxrDsUO1ELy"] || ""}
//                         </div>
//                         <div style={{ width: "50%", color: "red" }}>
//                           <span className="hide-label"> {t("4")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("PLACE_OF_BIRTH")}:{" "}
//                           </span>
//                           {certificate?.["JAU9NM7UqQP"] || ""}
//                         </div>
//                       </div>

//                     </div>
//                   </div>

//                   <div style={{borderBottom:printBorderSolid}}></div>
//                 </div>

//                 {/* Particular of Father */}
//                 <div>
//                   <div style={{ display: "flex" }}>
//                     <div
//                       style={{
//                         width: "3.3cm",
//                         height:'1.95cm',
//                         textAlign: "center",
//                         color: "red",
//                         fontWeight: "600",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         // paddingRight: 12,
//                         borderRight: "2px solid red",
//                       }}
//                     >
//                       <span className="hide-label">
//                         {" "}
//                         {t("PATICULAR_OF_FATHER")}
//                       </span>
//                     </div>
//                     <div style={{ width: "16.6cm",height:'1.95cm', }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px 5px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50%",
//                             paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("5")}</span>
//                           <span className="hide-label"> {t("NAME")}</span>:{" "}
//                           {certificate?.["RKs8td9BnNj"] || ""}
//                         </div>
//                         <div
//                           style={{
//                             width: "50%",
//                             paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("8")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("RELIGION")}
//                           </span>: {certificate?.["m4b4SSlipKJ"] || ""}
//                         </div>
//                       </div>
//                       <div
//                         style={{ borderBottom: printBorder, marginBottom: "2px" }}
//                       ></div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px 5px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("6")}</span>
//                           <span className="hide-label"> {t("RACE")}</span>:{" "}
//                           {certificate?.["mIRVmCzC7Tt"] || ""}
//                         </div>
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("9")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("OCCUPATION")}:{" "}
//                           </span>
//                           {certificate?.["CjjgDMbqfXX"] || ""}
//                         </div>
//                       </div>
//                       <div
//                         style={{ borderBottom: printBorder,
//                           //  marginBottom: "2px"
//                            }}
//                       ></div>
//                       <div>
//                         <div
//                           style={{ width: "50%", 
//                             // padding: "8px",
//                              color: "red" }}
//                         >
//                           <span className="hide-label"> {t("7")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("CITIZENSHIP_AND_NRC")}:{" "}
//                           </span>
//                           {getCitizenshipDisplay(
//                             dataElements["ed2RBrhMhnN"][
//                               certificate["ed2RBrhMhnN"]
//                             ],
//                             certificate["YE1wx1a4Ky4"]
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{borderBottom:printBorderSolid}}></div>
//                 </div>

//                 {/* Particular of Mother */}
//                 <div>
//                   <div style={{ display: "flex" }}>
//                     <div
//                       style={{
//                         width: "3.3cm",
//                         height:'2.5cm',
//                         textAlign: "center",
//                         color: "red",
//                         fontWeight: "600",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         // paddingRight: 12,
//                         borderRight: "2px solid red",
//                       }}
//                     >
//                       <span className="hide-label">
//                         {" "}
//                         {t("PARTICULAR_OF_MOTHER")}
//                       </span>
//                     </div>
//                     <div style={{ width: "16.6cm",height:'2.5cm' }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                            paddingLeft: "2px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("10")}</span>
//                           <span className="hide-label"> {t("NAME")}</span>:{" "}
//                           {certificate?.["UYmZMZt32hZ"] || ""}
//                         </div>
//                         <div
//                           style={{
//                             width: "50%",
//                             // paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("13")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("RELIGION")}
//                           </span>: {certificate?.["bVyrfnpCd6i"] || ""}
//                         </div>
//                       </div>
//                       <div
//                         style={{ borderBottom: printBorder,  }}
//                       ></div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           paddingLeft: "2px",
//                         }}
//                       >
//                         <div
//                           style={{
//                             width: "50%",
//                             paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label">{t("11")}</span>
//                           <span className="hide-label">{t("RACE")}</span>:{" "}
//                           {certificate?.["XFmGvaRAJqP"] || ""}
//                         </div>
//                         <div
//                           style={{
//                             width: "50%",
//                             paddingBottom: 2,
//                             color: "red",
//                           }}
//                         >
//                           <span className="hide-label"> {t("14")}</span>
//                           <span className="hide-label">
//                             {" "}
//                             {t("OCCUPATION")}:{" "}
//                           </span>
//                           {certificate?.["vg5hhREmzXe"] || ""}
//                         </div>
//                       </div>
//                       <div
//                         style={{ borderBottom: printBorder,  }}
//                       ></div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px",
//                         }}
//                       >
//                         <div style={{ width: "50%", color: "red" }}>
//                           <span className="hide-label" >
//                             {" "}
//                             {t("12")}
//                             {t("CITIZENSHIP_AND_NRC")}
//                           </span>
//                           :{" "}
//                           {getCitizenshipDisplay(
//                             dataElements["r8oFvT4PZwL"][
//                               certificate["r8oFvT4PZwL"]
//                             ],
//                             certificate["CowkFxAoqnl"]
//                           )}
//                         </div>
//                         <div style={{ width: "50%", color: "red" }}>
//                           <span className="hide-label">
//                             {" "}
//                             {t("15")}
//                             {t("PERMANENT_ADDRESS")}
//                           </span>
//                           : {certificate?.["bVyrfnpCd6i"] || ""}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{borderBottom:printBorderSolid}}></div>
//                 </div>

//                 {/* Particular of Informant */}
//                 <div>
//                   <div style={{ display: "flex" }}>
//                     <div
//                       style={{
//                         width: "3.3cm",
//                         height:'1.35cm',
//                         color: "red",
//                         textAlign: "center",
//                         fontWeight: "600",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         // paddingRight: 12,
//                         borderRight: "2px solid red",
//                       }}
//                     >
//                       <span className="hide-label">
//                         {" "}
//                         {t("PARTICULAR_OF_INFORMANT")}
//                       </span>
//                     </div>
//                     <div style={{ width: "16.6cm",height:'1.35cm' }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           padding: "2px 5px",
//                         }}
//                       >
//                         <div style={{ width: "50%", color: "red" }}>
//                           {" "}
//                           {t("SIGNATURE")}:{" "}
//                         </div>
//                         <div style={{ width: "50%", color: "red" }}>
//                           {" "}
//                           <span className="hide-label">
//                             {" "}
//                             {t("RELATION_TO_CHILD")}
//                           </span>
//                           : {certificate?.["eYh3U6sXrTQ"] || ""}{" "}
//                         </div>
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           paddingTop: "2px",
//                         }}
//                       >
//                         <div
//                           style={{ width: "50%", padding: "8px", color: "red" }}
//                         >
//                           <span className="hide-label"> {t("NAME")}</span>:{" "}
//                           {certificate?.["YdNUYjH3rct"] || ""}
//                         </div>
//                         <div
//                           style={{ width: "50%", padding: "8px", color: "red" }}
//                         >
//                           {" "}
//                           <span className="hide-label">
//                             {" "}
//                             {t("ADDRESS")}
//                           </span>: {certificate?.["rRpqp6TPWlh"]}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div style={{borderBottom:printBorderSolid}}></div>
//                 </div>
//               </div>

//               {/* Footer */}
//               <footer style={{ height:'6.85cm' }} className="certificate-footer">
//                 <div style={{ marginTop: 1, fontSize: 11 ,
//                   // height:'3.7cm'
//                   }}>
//                   <p  className="hide-label" style={{ width: "100%", color: "red" }}>
//                     {t("LIVE_BIRTH_PARA1_VALIDATION")}
//                   </p>
//                   <p className="hide-label"
//                     style={{
//                       width: "100%",
//                       color: "red",
//                       display: "block",
//                       marginBottom: 0,
//                       marginTop: 0,
//                     }}
//                   >
//                     {t("LIVE_BIRTH_PARA2_VALIDATION")}
//                   </p>

//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "flex-start",
//                     justifyContent: "space-between",
//                     color: "red",
//                     fontSize: 11,
//                     marginTop: 0,
//                     height:'1.9cm'
//                   }}
//                 >
//                   <div>
//                     <p className="hide-label"
//                       style={{ marginTop: 0, fontWeight: "600", fontSize: 12 }}
//                     >
//                       <span className="hide-label"> {t("DATE")} </span>
//                       <span
//                         style={{
//                           display: "inline-block",
//                           width: 24,
//                           verticalAlign: "middle",
//                         }}
//                       >
//                         {currentDate}
//                       </span>
//                     </p>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",
//                       alignItems: "flex-start",
//                       fontSize: 12,
//                       // paddingTop: 1,

//                     }}
//                   >
//                     <span className="hide-label" style={{ fontWeight: "600" }}>
//                       {" "}
//                       {t("REGISTRATION_OFFICER")}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       fontSize: 11,
//                        paddingRight:'5cm',
//                        paddingBottom:'1.5cm'

//                     }}
//                   >
//                     <span className="hide-label" style={{ fontWeight: "600" }}>
//                       {t("SIGNATURE")}{" "}
//                       <span style={{borderBottom: printBorder, width: 80 }}></span>
//                     </span>
//                     <span style={{ fontWeight: "600",
//                       //  marginTop: 2
//                         }}>
//                       <span className="hide-label"> {t("NAME")} </span>
//                       <span style={{ borderBottom: printBorder, width: 80 }}>
//                         {certificate?.["B1QxOlRIEVk"]}
//                       </span>
//                     </span>
//                     <span style={{ fontWeight: "600", 
//                       // marginTop: 2 
//                       }}>
//                       <span className="hide-label"> {t("DESIGNATION")} </span>
//                       <span style={{ borderBottom: printBorder,  width: 80 }}>
//                         {certificate?.["qsIjbrXLBL5"]}
//                       </span>
//                     </span>

//                   </div>

//                 </div>
//                 <p className="hide-label"
//                     style={{
//                       width: "100%",
//                       color: "red",
//                       display: "block",
//                       height:'1.25cm'
//                       // marginBottom: 0,
//                       // marginTop: 2,
//                     }}
//                   >
//                     {t("LIVE_BIRTH_PARA3_VALIDATION")}
//                   </p>
//                  {/* <div style={{ marginTop: 1, fontSize: 11 }}>

//                   </div> */}
//               </footer>
//             </section>
//           </div>
//         </main>
//       </div>

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.45)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 9999,
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "24px 28px",
//               borderRadius: 10,
//               width: 360,
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//           >
//             <h3 style={{ textAlign: "center" }}>Please provide the reason</h3>

//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Enter your reason..."
//               style={{
//                 width: "100%",
//                 height: 90,
//                 padding: 10,
//                 borderRadius: 6,
//                 border: "1px solid #ccc",
//                 marginBottom: 12,
//               }}
//             />

//             <Button
//               color="primary"
//               variant="contained"
//               disabled={!reason ? true : false}
//               onClick={handleSubmitReason}
//             >
//               Submit
//             </Button>
//           </div>
//         </div>
//       )}

//       {showToast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 30,
//             right: 30,
//             background: "#333",
//             color: "#fff",
//             padding: "12px 20px",
//             borderRadius: 8,
//             zIndex: 9999,
//           }}
//         >
//           Certificate issued successfully
//         </div>
//       )}
//     </>
//   );
// };

// export default BirthCertificate;
import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../api";
import { Button } from "@mui/material";

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
  width: "100%",
};

const styles = {
  container: {
    display: "flex",
    gap: "16px",
    width: "100%",
    // Limit printable width for A4 landscape while allowing html2pdf scaling
    maxWidth: "11.69in", // A4 width in inches (landscape)
    boxSizing: "border-box",
  },
  leftPane: {
    width: "8.06cm",
    // padding: "12px",
    boxSizing: "border-box",
    color: "red",
    fontSize: 12,
    //borderRight: "2px dashed red",

    flexShrink: 0, // Prevent the left pane from shrinking
  },
  rightPane: {
    flex: 1, // Allow the right pane to fill remaining space
    paddingLeft: "10px",
    boxSizing: "border-box",
    color: "red",
    fontSize: 13,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    // paddingBottom: 20,
    color: "red",
    //height: '2.1cm'
  },

  sectionTitle: {
    fontWeight: 600,
    textAlign: "center",
  },
  smallField: {
    display: "block",
    borderBottom: "2px dotted red",
    padding: "2px 4px",
    marginTop: 6,
  },
  dottedLineInline: {
    display: "inline-block",
    borderBottom: "2px dotted red",
    verticalAlign: "middle",
    minWidth: 40,
    marginLeft: 6,
  },

  footerSmall: { fontSize: 11, color: "red" },
};

const PRINT_ROW = {
  minHeight: "0.65cm",
  lineHeight: "0.65cm",
  display: "flex",
  alignItems: "center",
};

const PRINT_VALUE = {
  display: "inline-block",
  minHeight: "0.65cm",
  lineHeight: "0.65cm",
  overflow: "visible !important",
  verticalAlign: "middle",
};


const BirthCertificate = ({ orgUnit, orgUnits, dataElements }) => {
  const { state } = useLocation();
  const [certificate, setCertificate] = useState(state?.record || null);
  const { t } = useTranslation();
  const pdfRef = useRef();
  const orgUnitObj = {};
  const [printPreview, setPrintPreview] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [issueCount, setIssueCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [hideBackArrow, setHideBackArrow] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("en-GB");
  const printBorder = printPreview
    ? "none"
    : "2px dotted red";
  const printBorderSolid = printPreview
    ? "none"
    : "2px solid red";

  orgUnits.forEach((ou) => {
    orgUnitObj[ou.id] = ou.name;
  });
  orgUnit = {
    ...orgUnit,
    path:
      typeof orgUnit.path === "string"
        ? orgUnit.path
          .split("/")
          .map((ou) => (orgUnitObj[ou] ? orgUnitObj[ou] : ou))
        : [],
  };

  const PRINT_ROW = {
    display: "grid",
    gridTemplateColumns: "5cm auto",
    alignItems: "baseline",
    minHeight: "0.7cm",
  };

  const PRINT_LABEL = {
    whiteSpace: "nowrap",
    fontWeight: 500,
  };

  const PRINT_VALUE = (border) => ({
    borderBottom: border,
    minHeight: "0.7cm",
  });


  // useEffect(() => {
  //   const container = pdfRef.current;
  //   if (!container) return;

  //   const spans = container.querySelectorAll("span");

  //   spans.forEach((span) => {
  //     const style = window.getComputedStyle(span);

  //     // Label = no dotted border
  //     if (!style.borderBottom || style.borderBottom === "none") {
  //       span.classList.add("hide-label");
  //     }
  //   });
  // }, []);

  const getCitizenshipDisplay = (citizenShip, nrc, passport) => {
    if (!citizenShip) {
      return passport ? `${passport}` : "";
    }
    const c = String(citizenShip).trim();
    const isMyanmar =
      c.toLowerCase().includes("myanmar") ||
      c.toLowerCase().includes("burmese");
    if (isMyanmar) {
      return nrc ? `${c}, ${nrc}` : c;
    }

    return passport ? ` ${passport}` : c;
  };

  useEffect(() => {
    if (state?.record) {
      setCertificate(state.record);
      setIssueCount(
        state.record["UlMXHCJhyNZ"] ? Number(state.record["UlMXHCJhyNZ"]) : 0
      );
    } else {
      setCertificate(null);
    }
  }, [state]);

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
          unit: "in",
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
    // Enable print preview mode (hide labels, lock layout)
    setHideBackArrow(true);
    setPrintPreview(true);

    // Give browser time to apply styles
    setTimeout(() => {
      window.print();

      // Restore screen view after printing
      setTimeout(() => {
        setPrintPreview(false);
      }, 300);
    }, 300);
  };

  if (!certificate) return <div>No certificate data found.</div>;

  return (
    <>
      <style>
        {`
        @media screen {
  body * {
    visibility: visible;
  }
}

/* PRINT MODE */
@media print {
  /* Hide everything by default */
  body * {
    visibility: hidden !important;
  }

  /* Show only main certificate */
  .certificate-page,
  .certificate-page * {
    visibility: visible !important;
  }
.border-solid,
  .border-gray,
  .border-black,
  .borderDotted {
    border-bottom: none !important;
  }
  /* Lock position to top-left */
  .certificate-page {
    position: absolute;
    top: 0.8cm;
    left: 0;
  }
      @media print {
        @page {
          size: 29cm 20.6cm;
          margin: 0;
        }
 footer {
     padding-top: 0.55cm !important;
     height: auto !important;
  }

     header {
    padding-bottom: 0.5cm !important;
    // height: 0.5cm !important;
  }

        // html, body {
        //   width: 29.1cm;
        //   height: 20.6cm;
        //   margin: 0;
             padding: 0;
        //   overflow: visible !important;
        // }
html, body {
    width: 29cm;
    height: 20.6cm;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
        * {
          overflow: visible !important;
        }

        .no-print {
          display: none !important;
        }

        .hide-label {
        visibility  : hidden !important;
        }

        main {
          overflow: visible !important;
        }
      }
    `}
      </style>

      <style>
        {`
@media print {
  @page {
    size: A4 landscape;
    margin: 0.8cm;
  }

  html, body {
    width: auto !important;
    height: auto !important;
    overflow: visible !important;
  }

  .no-print {
    display: none !important;
  }

  .hide-label {
    color: transparent !important; /* keeps spacing */
  }
}
`}
      </style>



      <div
        style={{
          background: "#fff",
          // padding: "16px",
          fontFamily: "sans-serif",
          width: "100%",

        }}
      >
        <div className="hide-label" style={{ textAlign: "right" }}>
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

        <main
          ref={pdfRef}
          className={`certificate-page ${printPreview ? "print-preview" : ""}`}
          style={{
            width: "29cm",
            height: "20.6cm",
            paddingTop: "0.5cm",
            paddingBottom: "0.6cm",
            paddingRight: "0.5cm",
            display: "flex",
            boxSizing: "border-box",

            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              boxSizing: "border-box",
            }}
          >
            <aside
              style={{
                ...styles.leftPane,
                // borderBottom: printBorder, 
                width: "7.45cm",
                minWidth: "7.45cm",
                maxWidth: "7.45cm",
                height: "100%",
                boxSizing: "border-box",
                paddingLeft: '1.4cm',
              }}
            >
              {!hideBackArrow && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    marginBottom: "15px",
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIcon style={{ color: "black" }} />

                  <h4
                    style={{
                      fontWeight: 600,
                      textAlign: "left",
                      marginLeft: "8px",
                      marginBottom: "0",
                      marginTop: "0",
                    }}
                  >
                    {t("BIRTH_CERTIFICATE_COUNTERFOIL")}
                  </h4>
                </div>
              )}
              <div style={{ fontSize: "15px" , margin: 0,
                      marginTop: "0", }}>
                <div style={{ fontWeight: 600 }}>
                  {t("VR_103") || "V.R Form 103"}
                </div>
                <div style={{
                  //  marginTop: "12px" 
                }}>
                  <div style={PRINT_ROW}>
                    <span style={PRINT_LABEL} className="hide-label">
                      {t("PAGE_NUMBER")}
                    </span>
                    <span style={PRINT_VALUE(printBorder)}>
                      {certificate?.["PS99q9IRjKy"] || ""}
                    </span>
                  </div>


                  <div style={{ marginTop: 8 }}>
                    <span className="hide-label" > {t("BOOK_NUMBER")} </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "165px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["l0Pm3ydZ2om"] || ""}
                    </span>
                  </div>
                  <div style={{
                    // marginTop: 8 
                  }}>
                    <span className="hide-label"> {t("ENTRY_NUMBER")} </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "152px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["MrtKbjcsHnk"] || ""}
                    </span>
                  </div>
                  <div style={{
                    // marginTop: 8 
                  }}>
                    <span className="hide-label">
                      {" "}
                      {t("PLACE_OF_REGISTRATION")}{" "}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "136px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {orgUnitObj[certificate.orgUnit]}
                    </span>
                  </div>
                  <div style={{
                    //  marginTop: 8 
                  }}>
                    <span className="hide-label">
                      {" "}
                      {t("DATE_OF_REGISTRATION")}{" "}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "136px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["occurredAt"] || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: 15,
                //  marginTop: "22px" 
              }}>
                <div style={{
                  // marginBottom: 10 
                }}>
                  <div>
                    <span className="hide-label"> {t("Name_of_child")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "179px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["R43kdns3YYL"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{

                  // marginBottom: 8
                }}>
                  <div>
                    <span className="hide-label"> {t("SEX")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "230px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["wxrDsUO1ELy"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  //  marginBottom: 8 
                }}>
                  <div>
                    <span className="hide-label"> {t("PLACE_OF_BIRTH")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "180px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["JAU9NM7UqQP"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  //  marginBottom: 8
                }}>
                  <div>
                    <span className="hide-label">
                      {" "}
                      {t("DATE_AND_TIMEOFBIRTH")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "180px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["JAU9NM7UqQP"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  // marginBottom: 8
                }}>
                  <div>
                    <span className="hide-label"> {t("NAME_OF_FATHER")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "164px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["RKs8td9BnNj"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  // marginBottom: 8 
                }}>
                  <div>
                    <span className="hide-label"> {t("NAME_OF_MOTHER")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "150px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["UYmZMZt32hZ"] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  //  marginTop: 8 
                }}>
                  <div>
                    <span className="hide-label">
                      {" "}
                      {t("PERMANENT_ADDRESS")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "140px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.["bVyrfnpCd6i"] || ""}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: 15,
                // marginTop: "15px" 
              }}>
                <div style={{
                  //  marginBottom: 8
                }}>
                  <div>
                    <span className="hide-label">
                      {" "}
                      {t("SIGNATURE_OF_ISSUING_PERSON")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "62px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.[""] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  // marginBottom: 8 
                }}>
                  <div>
                    <span className="hide-label">
                      {" "}
                      {t("NAME_OF_ISSUING_PERSON")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        // minWidth: "100px",
                        // paddingLeft: "5px",
                      }}
                    >
                      {certificate?.[""] || ""}
                    </span>
                  </div>
                </div>

                <div style={{
                  //  marginBottom: 8 
                }}>
                  <div>
                    <p style={{ marginTop: 0 }}>
                      <span className="hide-label"> {t("DATE_OF_ISSUE")} </span>
                      <span
                        style={{
                          display: "inline-block",
                          width: 24,
                          verticalAlign: "middle",
                          // paddingLeft: "5px",
                        }}
                      >
                        {currentDate}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* ===== RIGHT PANE - Main Certificate content ===== */}
            <section style={styles.rightPane}>
              <div style={{ display: "flex", justifyContent: "space-between", height: '2.15cm', width: '19.9cm' }}>
                <div style={{ width: "21%" }}></div>
                <div>
                  <h2
                    style={{
                      fontSize: 20,
                      color: "red",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span className="hide-label">
                      {" "}
                      {t("BIRTH_CERTIFICATE")}
                    </span>
                  </h2>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      width: "7.5cm",
                      height: "1.7cm",
                      backgroundColor: "red",
                      color: "white",
                      fontWeight: "600",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      lineHeight: "1.25",
                      //padding: "0 8px",
                      boxSizing: "border-box",
                    }}
                  >
                    <span>This certificate will not</span>
                    <span style={{ marginTop: "5px" }}>
                      be a proof for citizenship
                    </span>
                  </div>
                </div>
              </div>

              {/* Header inside right pane */}
              {/* <header style={styles.header}>
                <div style={{ color: "red", fontSize: 14, paddingTop: "15px",width:'12.1cm' }}>
                  <p style={{ marginBottom: 8, fontWeight: "normal" }}>
                    <span className="hide-label"> {t("VR_103")}</span>
                  </p>
                  <p style={{ marginBottom: 8, fontWeight: "normal" }}>
                    <span className="hide-label"> {t("STATE_REGION")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        width: "37%",
                        verticalAlign: "middle",
                        marginLeft: 4,
                        paddingLeft: "4px",
                      }}
                    >
                      {orgUnit.path[2] ? orgUnit.path[2] : ""}
                    </span>
                  </p>
                  <div style={{ display: "flex" }}>
                    <p style={{ marginBottom: 8, fontWeight: "normal" }}>
                      <span className="hide-label"> {t("DISTRICT")}</span>
                      <span
                        style={{
                          display: "inline-block",
                          borderBottom: printBorder,
                          width: "30%",
                          verticalAlign: "middle",
                          marginLeft: 4,
                          paddingLeft: "4px",
                        }}
                      >
                        {orgUnit.path[3] ? orgUnit.path[3] : ""}
                      </span>
                    </p>
                    <p style={{ marginBottom: 8, fontWeight: "normal" }}>
                      <span className="hide-label"> {t("TOWNSHIP")}</span>
                      <span
                        style={{
                          display: "inline-block",
                          borderBottom: printBorder,
                          width: "30%",
                          verticalAlign: "middle",
                          marginLeft: 4,
                          paddingLeft: "4px",
                        }}
                      >
                        {orgUnit.path[4] ? orgUnit.path[4] : ""}
                      </span>
                    </p>
                  </div>

                  <p style={{ marginBottom: 8, fontWeight: "normal" }}>
                    <span className="hide-label">
                      {" "}
                      {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        width: "53px",
                        verticalAlign: "middle",
                        marginLeft: 4,
                        paddingLeft: "4px",
                      }}
                    >
                      {orgUnit.path[5] ? orgUnit.path[5] : ""}
                    </span>
                  </p>
                </div>

                <div
                  style={{
                    color: "red",
                    fontSize: 13,
                    paddingTop: "15px",
                    textAlign: "left",
                    // marginTop: "26px",

                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span className="hide-label">{t("PAGE_NUMBER")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "200px",
                        paddingLeft: "6px",
                      }}
                    >
                      {certificate?.["PS99q9IRjKy"] || ""}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span className="hide-label">{t("BOOK_NUMBER")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "200px",
                        paddingLeft: "6px",
                      }}
                    >
                      {certificate?.["l0Pm3ydZ2om"] || ""}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span className="hide-label">{t("ENTRY_NUMBER")}</span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "200px",
                        paddingLeft: "6px",
                      }}
                    >
                      {certificate?.["MrtKbjcsHnk"] || ""}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span className="hide-label">
                      {t("DATE_OF_REGISTRATION")}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        borderBottom: printBorder,
                        verticalAlign: "middle",
                        minWidth: "200px",
                        paddingLeft: "6px",
                      }}
                    >
                      {certificate?.["occurredAt"] || ""}
                    </span>
                  </div>
                </div>
              </header> */}


              <header style={styles.header}>
                {/* LEFT SECTION */}
                <div style={{ height: "2.1cm",  paddingTop: 0, marginTop: 0}}>
                  <p style={{ margin: 0, padding: 0 }}>
                    <span className="hide-label">{t("VR_103")}</span>
                  </p>

                  <p style={{ margin: 0, padding: 0 }}>
                    <span className="hide-label">{t("STATE_REGION")}</span>
                    <span style= {{paddingLeft : 80}}>{orgUnit.path[2] || ""}</span>
                  </p>

                  <div style={{ display: "flex", margin: 0, padding: 0}}>
                    <p style={{ margin: 0, padding: 0 }}>
                      <span className="hide-label">{t("DISTRICT")}</span>
                      <span>{orgUnit.path[3] || ""}</span>
                    </p>

                    <p style={{ margin: 0, padding: 0 }}>
                      <span className="hide-label">{t("TOWNSHIP")}</span>
                      <span  style= {{paddingLeft : 60}}>{orgUnit.path[4] || ""}</span>
                    </p>
                  </div>

                  <p style={{ margin: 0, padding: 0 }}>
                    <span className="hide-label">
                      {t("BIRTH_AND_DEATH_REGISTRATION_PLACE")}
                    </span>
                    <span>{orgUnit.path[5] || ""}</span>
                  </p>
                </div>


                {/* RIGHT SECTION */}
                <div>
                  <div style={styles.rightRow}>
                    <span className="hide-label" style={styles.rightLabel}>{t("PAGE_NUMBER")}</span>
                    <span style={{ width: "3.5cm", borderBottom: printBorder, display: "inline-block", }}>
                      {certificate?.["PS99q9IRjKy"] || ""}
                    </span>
                  </div>

                  <div style={styles.rightRow}>
                    <span className="hide-label" style={styles.rightLabel}>{t("BOOK_NUMBER")}</span>
                    <span style={{ width: "3.5cm", borderBottom: printBorder, display: "inline-block", }}>
                      {certificate?.["l0Pm3ydZ2om"] || ""}
                    </span>
                  </div>

                  <div style={styles.rightRow}>
                    <span className="hide-label" style={styles.rightLabel}>{t("ENTRY_NUMBER")}</span>
                    <span style={{ width: "3.5cm", borderBottom: printBorder, display: "inline-block", }}>
                      {certificate?.["MrtKbjcsHnk"] || ""}
                    </span>
                  </div>

                  <div style={styles.rightRow}>
                    <span className="hide-label" style={{}}>{t("DATE_OF_REGISTRATION")}</span>
                    <span style={{ ...styles.line, width: "3.5cm", borderBottom: printBorder, }}>
                      {certificate?.["occurredAt"] || ""}
                    </span>
                  </div>
                </div>
              </header>


              <div style={{ width: "19.9cm", fontSize: 13, height: '8.05cm', paddingTop: '0', marginTop: '0', paddingLeft: 40}}>
                {/* Particular of Child */}
                <div>
                  <div style={{ borderBottom: printBorderSolid,  paddingTop: '0', marginTop: '0' }}></div>
                  <div style={{ display: "flex",  paddingTop: '0', marginTop: '0' }}>
                    <div
                      style={{
                        width: "3.3cm",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "red",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // paddingRight: 12,
                        height: '1.95cm',
                        //borderRight: "2px solid red",
                        paddingTop: '0',
                        marginTop: '0',
                      }}
                    >
                      <span className="hide-label">
                        {" "}
                        {t("PARTICULARS_OF_CHILD")}
                      </span>
                    </div>
                    <div style={{ width: "16.6cm", height: '1.95cm', }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          //padding: "2px 5px",
                          padding: 0,
                          margin: 0
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                            padding: 0,
                            margin: 0
                          }}
                        >

                          <span className="hide-label" > {t("1")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("NAME")}{" "}:
                          </span>
                          <span style={{ paddingLeft: 15 }}> {certificate?.["R43kdns3YYL"] || ""}{" "}</span>
                        </div>
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                             padding:0,
                          margin:0
                          }}
                        >
                          <span className="hide-label"> {t("3")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("DATE_AND_TIME_OF_BIRTH")}:{" "}
                          </span>
                          <span style={{ paddingLeft: 15, }}>
                            {certificate?.["zAetLzp3cT1"] || ""}{" "}
                            {certificate?.["uOK1Wcm91NB"] || ""}
                          </span>

                        </div>
                      </div>

                      <div
                        style={{
                          borderBottom: printBorder,
                          marginBottom: "2px",
                        }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          // padding: "8px",
                        }}
                      >
                        <div style={{ width: "50%", color: "red" }}>
                          <span className="hide-label"> {t("2")}</span>
                          <span className="hide-label"> {t("SEX")}</span>:
                          <span style={{ paddingLeft: 15, }}>{certificate?.["wxrDsUO1ELy"] || ""}</span>

                        </div>
                        <div style={{ width: "50%", color: "red" }}>
                          <span className="hide-label"> {t("4")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("PLACE_OF_BIRTH")}:{" "}
                          </span>
                          <span style={{ paddingLeft: 15, }}> {certificate?.["JAU9NM7UqQP"] || ""}</span>

                        </div>
                      </div>

                    </div>
                  </div>

                  <div style={{ borderBottom: printBorderSolid, }}></div>
                </div>

                {/* Particular of Father */}
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "3.3cm",
                        height: '1.95cm',
                        textAlign: "center",
                        color: "red",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // paddingRight: 12,
                        //borderRight: "2px solid red",
                        paddingTop: '0',
                        marginTop: '0',
                      }}
                    >
                      <span className="hide-label">
                        {" "}
                        {t("PATICULAR_OF_FATHER")}
                      </span>
                    </div>
                    <div style={{ width: "16.6cm", height: '1.95cm', }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px 5px",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("5")}</span>
                          <span className="hide-label"> {t("NAME")}</span>:{" "}
                          <span style={{ paddingLeft: 15, }}>{certificate?.["RKs8td9BnNj"] || ""}</span>

                        </div>
                        <div
                          style={{
                            width: "50%",
                            paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("8")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("RELIGION")}
                          </span>:
                          <span style={{ paddingLeft: 15, }}>{certificate?.["m4b4SSlipKJ"] || ""}</span>
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: printBorder, marginBottom: 4 }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px 5px",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("6")}</span>
                          <span className="hide-label"> {t("RACE")}</span>:{" "}
                          {certificate?.["mIRVmCzC7Tt"] || ""}
                        </div>
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("9")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("OCCUPATION")}:{" "}
                          </span>
                          {certificate?.["CjjgDMbqfXX"] || ""}
                        </div>
                      </div>
                      <div
                        style={{
                          borderBottom: printBorder,
                          //  marginBottom: "2px"
                        }}
                      ></div>
                      <div>
                        <div
                          style={{
                            width: "50%",
                            // padding: "8px",
                            color: "red"
                          }}
                        >
                          <span className="hide-label"> {t("7")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("CITIZENSHIP_AND_NRC")}:{" "}
                          </span>
                          {getCitizenshipDisplay(
                            dataElements["ed2RBrhMhnN"][
                            certificate["ed2RBrhMhnN"]
                            ],
                            certificate["YE1wx1a4Ky4"]
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderBottom: printBorderSolid, paddingTop : 6 }}></div>
                </div>

                {/* Particular of Mother */}
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "3.3cm",
                        height: '2.5cm',
                        textAlign: "center",
                        color: "red",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // paddingRight: 12,
                        //borderRight: "2px solid red",
                        paddingTop: '0',
                        marginTop: '0',
                      }}
                    >
                      <span className="hide-label">
                        {" "}
                        {t("PARTICULAR_OF_MOTHER")}
                      </span>
                    </div>
                    <div style={{ width: "16.6cm", height: '2.5cm' }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingLeft: "2px",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("10")}</span>
                          <span className="hide-label"> {t("NAME")}</span>:{" "}
                          {certificate?.["UYmZMZt32hZ"] || ""}
                        </div>
                        <div
                          style={{
                            width: "50%",
                            // paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("13")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("RELIGION")}
                          </span>: {certificate?.["bVyrfnpCd6i"] || ""}
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: printBorder, }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingLeft: "2px",
                        }}
                      >
                        <div
                          style={{
                            width: "50%",
                            paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label">{t("11")}</span>
                          <span className="hide-label">{t("RACE")}</span>:{" "}
                          {certificate?.["XFmGvaRAJqP"] || ""}
                        </div>
                        <div
                          style={{
                            width: "50%",
                            paddingBottom: 2,
                            color: "red",
                          }}
                        >
                          <span className="hide-label"> {t("14")}</span>
                          <span className="hide-label">
                            {" "}
                            {t("OCCUPATION")}:{" "}
                          </span>
                          {certificate?.["vg5hhREmzXe"] || ""}
                        </div>
                      </div>
                      <div
                        style={{ borderBottom: printBorder, }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "2px",
                        }}
                      >
                        <div style={{ width: "50%", color: "red" }}>
                          <span className="hide-label" >
                            {" "}
                            {t("12")}
                            {t("CITIZENSHIP_AND_NRC")}
                          </span>
                          :{" "}
                          {getCitizenshipDisplay(
                            dataElements["r8oFvT4PZwL"][
                            certificate["r8oFvT4PZwL"]
                            ],
                            certificate["CowkFxAoqnl"]
                          )}
                        </div>
                        <div style={{ width: "50%", color: "red" }}>
                          <span className="hide-label">
                            {" "}
                            {t("15")}
                            {t("PERMANENT_ADDRESS")}
                          </span>
                          : {certificate?.["bVyrfnpCd6i"] || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderBottom: printBorderSolid }}></div>
                </div>

                {/* Particular of Informant */}
                <div>
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "3.3cm",
                        height: '1.35cm',
                        color: "red",
                        textAlign: "center",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // paddingRight: 12,
                        //borderRight: "2px solid red",
                        paddingTop: 0,
                        marginTop: 0,
                      }}
                    >
                      <span className="hide-label">
                        {" "}
                        {t("PARTICULAR_OF_INFORMANT")}
                      </span>
                    </div>
                    <div style={{ width: "16.6cm", height: '1.35cm' }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          //padding: "2px 5px",
                        }}
                      >
                        <div style={{ width: "50%", color: "red" }}>
                          {" "}
                          {t("SIGNATURE")}:{" "}
                        </div>
                        <div style={{ width: "50%", color: "red" }}>
                          {" "}
                          <span className="hide-label">
                            {" "}
                            {t("RELATION_TO_CHILD")}
                          </span>
                          : {certificate?.["eYh3U6sXrTQ"] || ""}{" "}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          //paddingTop: 2
                        }}
                      >
                        <div
                          style={{ width: "50%", color: "red" }}
                        >
                          <span className="hide-label"> {t("NAME")}</span>:{" "}
                          {certificate?.["YdNUYjH3rct"] || ""}
                        </div>
                        <div
                          style={{ width: "50%",  color: "red" }}
                        >
                          {" "}
                          <span className="hide-label">
                            {" "}
                            {t("ADDRESS")}
                          </span>: {certificate?.["rRpqp6TPWlh"]}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderBottom: printBorderSolid }}></div>
                </div>
              </div>

              {/* Footer */}
              <footer style={{ height: '6.85cm' }} className="certificate-footer">
                <div style={{
                  marginTop: 1, fontSize: 11,
                  // height:'3.7cm'
                }}>
                  <p className="hide-label" style={{ width: "100%", color: "red" }}>
                    {t("LIVE_BIRTH_PARA1_VALIDATION")}
                  </p>
                  <p className="hide-label"
                    style={{
                      width: "100%",
                      color: "red",
                      display: "block",
                      marginBottom: 0,
                      marginTop: 0,
                    }}
                  >
                    {t("LIVE_BIRTH_PARA2_VALIDATION")}
                  </p>

                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    color: "red",
                    fontSize: 11,
                    marginTop: 0,
                    height: '1.9cm'
                  }}
                >
                  <div>
                    <p className="hide-label"
                      style={{ marginTop: 0, fontWeight: "600", fontSize: 12 }}
                    >
                      <span className="hide-label"> {t("DATE")} </span>
                      <span
                        style={{
                          display: "inline-block",
                          width: 24,
                          verticalAlign: "middle",
                        }}
                      >
                        {currentDate}
                      </span>
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      fontSize: 12,
                      // paddingTop: 1,

                    }}
                  >
                    <span className="hide-label" style={{ fontWeight: "600" }}>
                      {" "}
                      {t("REGISTRATION_OFFICER")}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: 11,
                      paddingRight: '5cm',
                      //paddingBottom: '1.5cm'

                    }}
                  >
                    <span className="hide-label" style={{ fontWeight: "600" }}>
                      {t("SIGNATURE")}{" "}
                      <span style={{ borderBottom: printBorder, width: 80 }}></span>
                    </span>
                    <span style={{
                      fontWeight: "600",
                      //  marginTop: 2
                      paddingTop: 22,
                    }}>
                      <span className="hide-label"> {t("NAME")} </span>
                      <span style={{ borderBottom: printBorder, width: 80 }}>
                        {certificate?.["B1QxOlRIEVk"]}
                      </span>
                    </span>
                    <span style={{
                      fontWeight: "600",
                      // marginTop: 2 
                    }}>
                      <span className="hide-label"> {t("DESIGNATION")} </span>
                      <span style={{ borderBottom: printBorder, width: 80 }}>
                        {certificate?.["qsIjbrXLBL5"]}
                      </span>
                    </span>

                  </div>

                </div>
                <p className="hide-label"
                  style={{
                    width: "100%",
                    color: "red",
                    display: "block",
                    height: '1.25cm'
                    // marginBottom: 0,
                    // marginTop: 2,
                  }}
                >
                  {t("LIVE_BIRTH_PARA3_VALIDATION")}
                </p>
                {/* <div style={{ marginTop: 1, fontSize: 11 }}>
                  
                  </div> */}
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
