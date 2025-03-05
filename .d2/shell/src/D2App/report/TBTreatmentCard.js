import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { hospitalLogo, hospitalSymbal } from "../images";
import { OPDService } from "../Services/api";
import { downloadPDF } from "../export/export";
const TbTreatmentCard = _ref => {
  var _fetchData$kcLrIgGhPM, _fetchData$e1YAEOJgkf, _fetchData$Nanz6h218x, _fetchData$s9skUqn98W, _fetchData$tCYcDHdqoE, _fetchData$kcLrIgGhPM2, _fetchData$s9skUqn98W2, _fetchData$HkdYrf7NPb, _fetchData$LTwo15geiN, _fetchData$dP1vchhcUQ, _fetchData$Y8bBePB3Mq, _fetchData$rafHJbDBMc, _fetchData$hTeeEA3luA, _fetchData$hTeeEA3luA2, _fetchData$XpertUltra, _fetchData$wsYLk5j39R, _fetchData$wsYLk5j39R2, _fetchData$T48HXW0TTd, _fetchData$T48HXW0TTd2, _fetchData$qMj31r5XxD, _fetchData$qMj31r5XxD2, _fetchData$PPtWbZprTO, _fetchData$PPtWbZprTO2, _fetchData$F7pEZBWhMT, _fetchData$Lkt9XYo3Yc;
  let {
    open,
    setOpen,
    selectedProgramValue
  } = _ref;
  console.log('open:>>>', open);
  const [fetchData, setFetchedData] = useState({});
  async function fetchTrackedEntityInstances() {
    if (!selectedProgramValue) return;
    try {
      const allTrackedEntities = await OPDService.trackedEntityInstancesMultipleStages(selectedProgramValue);
      let objectedData = {};
      allTrackedEntities === null || allTrackedEntities === void 0 ? void 0 : allTrackedEntities.enrollments.map(enroll => {
        enroll.events.map(event => event.dataValues.map(row => {
          var _row$created, _row$created$slice, _row$created$slice$sp, _row$created$slice$sp2;
          return objectedData[row.dataElement] = {
            value: row.value,
            date: row === null || row === void 0 ? void 0 : (_row$created = row.created) === null || _row$created === void 0 ? void 0 : (_row$created$slice = _row$created.slice(0, 10)) === null || _row$created$slice === void 0 ? void 0 : (_row$created$slice$sp = _row$created$slice.split('-')) === null || _row$created$slice$sp === void 0 ? void 0 : (_row$created$slice$sp2 = _row$created$slice$sp.reverse()) === null || _row$created$slice$sp2 === void 0 ? void 0 : _row$created$slice$sp2.join('-')
          };
        }));
        enroll.attributes.map(row => {
          var _row$created2, _row$created2$slice, _row$created2$slice$s, _row$created2$slice$s2;
          return objectedData[row.attribute] = {
            value: row.value,
            date: row === null || row === void 0 ? void 0 : (_row$created2 = row.created) === null || _row$created2 === void 0 ? void 0 : (_row$created2$slice = _row$created2.slice(0, 10)) === null || _row$created2$slice === void 0 ? void 0 : (_row$created2$slice$s = _row$created2$slice.split('-')) === null || _row$created2$slice$s === void 0 ? void 0 : (_row$created2$slice$s2 = _row$created2$slice$s.reverse()) === null || _row$created2$slice$s2 === void 0 ? void 0 : _row$created2$slice$s2.join('-')
          };
        });
      });
      allTrackedEntities.attributes.map(attr => {
        var _attr$created, _attr$created$slice, _attr$created$slice$s, _attr$created$slice$s2;
        return objectedData[attr.attribute] = {
          value: attr.value,
          date: attr === null || attr === void 0 ? void 0 : (_attr$created = attr.created) === null || _attr$created === void 0 ? void 0 : (_attr$created$slice = _attr$created.slice(0, 10)) === null || _attr$created$slice === void 0 ? void 0 : (_attr$created$slice$s = _attr$created$slice.split('-')) === null || _attr$created$slice$s === void 0 ? void 0 : (_attr$created$slice$s2 = _attr$created$slice$s.reverse()) === null || _attr$created$slice$s2 === void 0 ? void 0 : _attr$created$slice$s2.join('-')
        };
      });
      console.log("Fetched Data:", objectedData);
      setFetchedData(objectedData);

      // open pdf after 1 second to show the page........
      setTimeout(() => {
        downloadPDF("printing");
      }, 1000);
      setOpen(false);
    } catch (error) {
      console.log('error', error);
      setFetchedData({});
      alert((error === null || error === void 0 ? void 0 : error.message) || 'failled api');
    }
  }
  useEffect(() => {
    if (open) {
      fetchTrackedEntityInstances();
    }
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    id: "printing",
    className: "page_border",
    style: {
      border: "4px solid black",
      display: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "FORMATU TB 4")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: hospitalSymbal,
    alt: "symbol"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: hospitalLogo,
    alt: "logo"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "no-bold"
  }, "NATIONAL PROGRAM FOR TUBERCULOSE CONTROL"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("i", null, "TUBERCULOSE TREATMENT CARD")), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("section", {
    className: "container1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Complete Name:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$kcLrIgGhPM = fetchData['kcLrIgGhPMM']) === null || _fetchData$kcLrIgGhPM === void 0 ? void 0 : _fetchData$kcLrIgGhPM.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Sex:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$e1YAEOJgkf = fetchData['e1YAEOJgkfx']) === null || _fetchData$e1YAEOJgkf === void 0 ? void 0 : _fetchData$e1YAEOJgkf.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Age:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$Nanz6h218x = fetchData['Nanz6h218xh']) === null || _fetchData$Nanz6h218x === void 0 ? void 0 : _fetchData$Nanz6h218x.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Address and Telephone Number:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$s9skUqn98W = fetchData['s9skUqn98W8']) === null || _fetchData$s9skUqn98W === void 0 ? void 0 : _fetchData$s9skUqn98W.value) || '', " ,", ((_fetchData$tCYcDHdqoE = fetchData['tCYcDHdqoEc']) === null || _fetchData$tCYcDHdqoE === void 0 ? void 0 : _fetchData$tCYcDHdqoE.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name, Address and Personal Contact Number:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$kcLrIgGhPM2 = fetchData['kcLrIgGhPMM']) === null || _fetchData$kcLrIgGhPM2 === void 0 ? void 0 : _fetchData$kcLrIgGhPM2.value) || '', ",  ", ((_fetchData$s9skUqn98W2 = fetchData['s9skUqn98W8']) === null || _fetchData$s9skUqn98W2 === void 0 ? void 0 : _fetchData$s9skUqn98W2.value) || '', ", ", ((_fetchData$HkdYrf7NPb = fetchData['HkdYrf7NPbr']) === null || _fetchData$HkdYrf7NPb === void 0 ? void 0 : _fetchData$HkdYrf7NPb.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Home Visit Initiated From and Date:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-bottom-border"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Previous TB Treatment History and Duration (if Yes, TB Registration Number):"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-bottom-border"
    // value={trackedEntity?.attributes?.find(attr => attr.displayName === "TB Treatment History")?.value || ""}
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", {
    id: "border_less"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Disease Classification"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, " ", ((_fetchData$LTwo15geiN = fetchData['LTwo15geiNf']) === null || _fetchData$LTwo15geiN === void 0 ? void 0 : _fetchData$LTwo15geiN.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Site:"))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", {
    id: "border_less"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2",
    style: {
      textAlign: "center"
    }
  }, "Type of Patient"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ((_fetchData$dP1vchhcUQ = fetchData['dP1vchhcUQH']) === null || _fetchData$dP1vchhcUQ === void 0 ? void 0 : _fetchData$dP1vchhcUQ.value) || 'N/A')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Site:"))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: "30px"
    }
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none",
      fontWeight: 600
    }
  }, "I. INTENSIVE PHASE(Date):"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$Y8bBePB3Mq = fetchData['Y8bBePB3Mqo']) === null || _fetchData$Y8bBePB3Mq === void 0 ? void 0 : _fetchData$Y8bBePB3Mq.value) || 'N/A', "  ")))))), /*#__PURE__*/React.createElement("section", {
    className: "container2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "TB Register Number / Year:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-bottom-border"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name of Health Facility Providing Treatment:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-bottom-border"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name & Telephone No. of DOT Provider:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-bottom-border"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("th", null, "Position of DOT Provider: "), /*#__PURE__*/React.createElement("td", {
    colSpan: "7"
  }, ((_fetchData$rafHJbDBMc = fetchData['rafHJbDBMc2']) === null || _fetchData$rafHJbDBMc === void 0 ? void 0 : _fetchData$rafHJbDBMc.value) || 'N/A')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    rowSpan: "2"
  }, "Month"), /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, "Productive Cough Microscopy:", ((_fetchData$hTeeEA3luA = fetchData['hTeeEA3luAl']) === null || _fetchData$hTeeEA3luA === void 0 ? void 0 : _fetchData$hTeeEA3luA.value) || 'N/A'), /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, " Date: ", ((_fetchData$hTeeEA3luA2 = fetchData['hTeeEA3luAl']) === null || _fetchData$hTeeEA3luA2 === void 0 ? void 0 : _fetchData$hTeeEA3luA2.date) || 'N/A'), /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, "XpertUltra: ", ((_fetchData$XpertUltra = fetchData['XpertUltra ']) === null || _fetchData$XpertUltra === void 0 ? void 0 : _fetchData$XpertUltra.value) || '')))), /*#__PURE__*/React.createElement("p", null, "Green color applies only for follow-up positive sputum microscope examination")), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center"
    },
    colSpan: "3"
  }, "TB/HIV"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "center"
    }
  }, "Date"), /*#__PURE__*/React.createElement("td", {
    style: {
      textAlign: "center"
    }
  }, "Result")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "HIV Test"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$wsYLk5j39R = fetchData['wsYLk5j39R1']) === null || _fetchData$wsYLk5j39R === void 0 ? void 0 : _fetchData$wsYLk5j39R.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$wsYLk5j39R2 = fetchData['wsYLk5j39R1']) === null || _fetchData$wsYLk5j39R2 === void 0 ? void 0 : _fetchData$wsYLk5j39R2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Initiate CPT"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$T48HXW0TTd = fetchData['T48HXW0TTdB']) === null || _fetchData$T48HXW0TTd === void 0 ? void 0 : _fetchData$T48HXW0TTd.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$T48HXW0TTd2 = fetchData['T48HXW0TTdB']) === null || _fetchData$T48HXW0TTd2 === void 0 ? void 0 : _fetchData$T48HXW0TTd2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Initiate ART"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$qMj31r5XxD = fetchData['qMj31r5XxDF']) === null || _fetchData$qMj31r5XxD === void 0 ? void 0 : _fetchData$qMj31r5XxD.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$qMj31r5XxD2 = fetchData['qMj31r5XxDF']) === null || _fetchData$qMj31r5XxD2 === void 0 ? void 0 : _fetchData$qMj31r5XxD2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "CD4 Result"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$PPtWbZprTO = fetchData['PPtWbZprTON']) === null || _fetchData$PPtWbZprTO === void 0 ? void 0 : _fetchData$PPtWbZprTO.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$PPtWbZprTO2 = fetchData['PPtWbZprTON']) === null || _fetchData$PPtWbZprTO2 === void 0 ? void 0 : _fetchData$PPtWbZprTO2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "ART Reg. No. & Date"), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("h4", {
    style: {
      textAlign: "center"
    }
  }, "REGIMENT and DOSAGE ( Circle appropriately to the below category: ", ((_fetchData$F7pEZBWhMT = fetchData['F7pEZBWhMTN']) === null || _fetchData$F7pEZBWhMT === void 0 ? void 0 : _fetchData$F7pEZBWhMT.value) || 'N/A'), /*#__PURE__*/React.createElement("section", {
    className: "container3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "New Case (Daily) for two months ")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "RHZE (150/75/400/275) ")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Pediatric Case (daily) for two months")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "50H/75R/150Z")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null)))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "appropriate to the below category)"))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Diabetes Status"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ((_fetchData$Lkt9XYo3Yc = fetchData['Lkt9XYo3YcP']) === null || _fetchData$Lkt9XYo3Yc === void 0 ? void 0 : _fetchData$Lkt9XYo3Yc.value) || 'N/A')))))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontStyle: "italic"
    }
  }, "R= Rifampicin H= Isoniazide Z= Pyrazinamide E= Ethambutol"), /*#__PURE__*/React.createElement("section", {
    className: "container3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    rowSpan: "2"
  }, "Month / Year"), /*#__PURE__*/React.createElement("th", {
    colSpan: "31"
  }, "Data"), /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Total dosage taken")), /*#__PURE__*/React.createElement("tr", null, Array.from({
    length: 31
  }, (_, i) => /*#__PURE__*/React.createElement("td", {
    key: i + 1
  }, String(i + 1).padStart(2, "0"))), /*#__PURE__*/React.createElement("td", null, "This month"), /*#__PURE__*/React.createElement("td", null, "Cumulative"))), /*#__PURE__*/React.createElement("tbody", null, Array.from({
    length: 6
  }, (_, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null), Array.from({
    length: 31
  }, (_, j) => /*#__PURE__*/React.createElement("td", {
    key: j
  })), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))))), /*#__PURE__*/React.createElement("div", {
    className: "header"
  }, /*#__PURE__*/React.createElement("h2", null, "II. CONTINUATION PHASE"), /*#__PURE__*/React.createElement("p", {
    className: "subtitle"
  }, "Circle appropriately to the below category")), /*#__PURE__*/React.createElement("div", {
    className: "tables-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-box"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "New Case (Daily) for 4 months"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null))))), /*#__PURE__*/React.createElement("div", {
    className: "table-box"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Pediatric Case (Daily) for 4 months"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Treatment Result (One \u2713 Mark)"), /*#__PURE__*/React.createElement("th", null, "Decided Date"))), /*#__PURE__*/React.createElement("tbody", null, ["Cured", "Complete Treatment", "Die", "Treatment Fail", "Lost to Follow Up", "Not Evaluate"].map((result, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, result), /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("h3", null, "Follow action to the lost patient and the Result"), /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "From"), /*#__PURE__*/React.createElement("th", null, "Reason for not taking medicine"), /*#__PURE__*/React.createElement("th", null, "Result from this activity"))), /*#__PURE__*/React.createElement("tbody", null, [...Array(3)].map((_, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("h3", null, "Observation"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h3", null, "Screening to close contact (Children, Adults, and PLHIV contacts)"), /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "No"), /*#__PURE__*/React.createElement("th", null, "Complete Name"), /*#__PURE__*/React.createElement("th", null, "Year"), /*#__PURE__*/React.createElement("th", null, "Relation to the patient"), /*#__PURE__*/React.createElement("th", null, "Screening Date"), /*#__PURE__*/React.createElement("th", null, "Result"), /*#__PURE__*/React.createElement("th", null, "TPT"), /*#__PURE__*/React.createElement("th", null, "TB Treatment (S/L)"))), /*#__PURE__*/React.createElement("tbody", null, [...Array(15)].map((_, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    rowSpan: "2"
  }, "Month / Year"), /*#__PURE__*/React.createElement("th", {
    colSpan: "31"
  }, "Data"), /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Total dosage taken")), /*#__PURE__*/React.createElement("tr", null, Array.from({
    length: 31
  }, (_, i) => /*#__PURE__*/React.createElement("th", {
    key: i + 1
  }, String(i + 1).padStart(2, "0"))), /*#__PURE__*/React.createElement("th", null, "This month"), /*#__PURE__*/React.createElement("th", null, "Cumulative"))), /*#__PURE__*/React.createElement("tbody", null, Array.from({
    length: 6
  }, (_, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null), Array.from({
    length: 31
  }, (_, j) => /*#__PURE__*/React.createElement("td", {
    key: j
  })), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))));
};
export default TbTreatmentCard;