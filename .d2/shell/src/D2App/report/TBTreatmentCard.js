import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { hospitalLogo, hospitalSymbal } from "../images";
import { OPDService } from "../Services/api";
import { calculateAge } from "../utils/calculateAge";
import { posOrNeg, yesOrNo } from "../utils/common";
import { CircularLoader } from "@dhis2/ui-core";
const DAM_VALUE = ['kcLrIgGhPMM', 'Nanz6h218xh', 'hprn97zZAaO', 'gGi8Wtiphc6'];
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // background fade
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    // Make sure it's on top
    backdropFilter: 'blur(4px)' // optional: adds a blur effect
  }
};

const TbTreatmentCard = _ref => {
  var _fetchData$kcLrIgGhPM, _fetchData$e1YAEOJgkf, _fetchData$hb6APG0UBM, _fetchData$ch4SP6NLy, _fetchData$HkdYrf7NPb, _fetchData$LTwo15geiN, _fetchData$dP1vchhcUQ, _fetchData$Lkt9XYo3Yc, _fetchData$rafHJbDBMc, _fetchData$hTeeEA3luA, _fetchData$hTeeEA3luA2, _fetchData$hTeeEA3luA3, _fetchData$wsYLk5j39R, _fetchData$wsYLk5j39R2, _fetchData$T48HXW0TTd, _fetchData$T48HXW0TTd2, _fetchData$qMj31r5XxD, _fetchData$qMj31r5XxD2, _fetchData$PPtWbZprTO, _fetchData$PPtWbZprTO2, _fetchData$DdksjaW6MW, _fetchData$DdksjaW6MW2, _fetchData$F7pEZBWhMT, _fetchData$Ms2aNVW7fo2;
  let {
    selectedProgramValue,
    tie
  } = _ref;
  const [fetchData, setFetchedData] = useState({});
  const [observation, setObservation] = useState('');
  const [relation, setRelation] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);
  async function fetchTrackedEntityInstances() {
    if (!selectedProgramValue) return;
    setCardLoading(true);
    try {
      const allTrackedEntities = await OPDService.trackedEntityInstancesMultipleStages(selectedProgramValue, tie);
      const allRelations = await OPDService.screeningCloseRelations(tie);
      let objectedData = {};
      let rel = [];
      allTrackedEntities === null || allTrackedEntities === void 0 ? void 0 : allTrackedEntities.enrollments.map(enroll => {
        setObservation(enroll.orgUnitName);
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
      allRelations.map(event => {
        var _event$to$trackedEnti, _event$to$trackedEnti2, _event$to$trackedEnti3, _event$to$trackedEnti4;
        let obj = {};
        event.to.trackedEntityInstance.attributes.map(attr => {
          if (DAM_VALUE.includes(attr.attribute)) obj[attr.attribute] = attr.value;
        });
        obj['date'] = (_event$to$trackedEnti = event.to.trackedEntityInstance.created) === null || _event$to$trackedEnti === void 0 ? void 0 : (_event$to$trackedEnti2 = _event$to$trackedEnti.slice(0, 10)) === null || _event$to$trackedEnti2 === void 0 ? void 0 : (_event$to$trackedEnti3 = _event$to$trackedEnti2.split('-')) === null || _event$to$trackedEnti3 === void 0 ? void 0 : (_event$to$trackedEnti4 = _event$to$trackedEnti3.reverse()) === null || _event$to$trackedEnti4 === void 0 ? void 0 : _event$to$trackedEnti4.join('-');
        rel.push(obj);
      });
      console.log("Fetched Data:", rel);
      setFetchedData(objectedData);
      setRelation(rel);
      setCardLoading(false);
    } catch (error) {
      setCardLoading(false);
      console.log('error', error);
      setFetchedData({});
      alert((error === null || error === void 0 ? void 0 : error.message) || 'failled api');
    }
  }
  const openInNewTab = url => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    return null;
  };
  useEffect(() => {
    fetchTrackedEntityInstances();
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, cardLoading && /*#__PURE__*/React.createElement("div", {
    style: styles.overlay
  }, /*#__PURE__*/React.createElement(CircularLoader, null)), /*#__PURE__*/React.createElement("div", {
    id: "printing",
    className: "modal-info"
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
    className: "row g-2"
  }, /*#__PURE__*/React.createElement("section", {
    className: "col-6"
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
  }, calculateAge((_fetchData$hb6APG0UBM = fetchData['hb6APG0UBMn']) === null || _fetchData$hb6APG0UBM === void 0 ? void 0 : _fetchData$hb6APG0UBM.value))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Address and Telephone Number:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name, Address and Personal Contact Number:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, ((_fetchData$ch4SP6NLy = fetchData['ch4SP6NLy7H']) === null || _fetchData$ch4SP6NLy === void 0 ? void 0 : _fetchData$ch4SP6NLy.value) || '', ", ", ((_fetchData$HkdYrf7NPb = fetchData['HkdYrf7NPbr']) === null || _fetchData$HkdYrf7NPb === void 0 ? void 0 : _fetchData$HkdYrf7NPb.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Home Visit Initiated From and Date:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "                    ")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Previous TB Treatment History and Duration (if Yes, TB Registration Number):"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "                    "))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", {
    id: "border_less"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Disease Classification"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "2"
  }, " ", ((_fetchData$LTwo15geiN = fetchData['LTwo15geiNf']) === null || _fetchData$LTwo15geiN === void 0 ? void 0 : _fetchData$LTwo15geiN.value) || ''))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", {
    id: "border_less"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2",
    style: {
      textAlign: "left"
    }
  }, "Type of Patient"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ((_fetchData$dP1vchhcUQ = fetchData['dP1vchhcUQH']) === null || _fetchData$dP1vchhcUQ === void 0 ? void 0 : _fetchData$dP1vchhcUQ.value) || 'N/A'))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    colSpan: "2"
  }, "Diabetes Status"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ((_fetchData$Lkt9XYo3Yc = fetchData['Lkt9XYo3YcP']) === null || _fetchData$Lkt9XYo3Yc === void 0 ? void 0 : _fetchData$Lkt9XYo3Yc.value) || 'N/A')))))), /*#__PURE__*/React.createElement("section", {
    className: "col-6"
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
  })), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name of Health Facility Providing Treatment:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, observation || '', " ")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }, "Name & Telephone No. of DOT Provider:"), /*#__PURE__*/React.createElement("td", {
    style: {
      border: "none"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "table"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Position of DOT Provider:"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$rafHJbDBMc = fetchData['rafHJbDBMc2']) === null || _fetchData$rafHJbDBMc === void 0 ? void 0 : _fetchData$rafHJbDBMc.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, " Date"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$hTeeEA3luA = fetchData['hTeeEA3luAl']) === null || _fetchData$hTeeEA3luA === void 0 ? void 0 : _fetchData$hTeeEA3luA.date) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Productive Cough Microscopy"), /*#__PURE__*/React.createElement("td", {
    style: {
      backgroundColor: `${((_fetchData$hTeeEA3luA2 = fetchData['hTeeEA3luAl']) === null || _fetchData$hTeeEA3luA2 === void 0 ? void 0 : _fetchData$hTeeEA3luA2.value) === 'POSITIVE' ? 'green' : "white"}`
    }
  }, ((_fetchData$hTeeEA3luA3 = fetchData['hTeeEA3luAl']) === null || _fetchData$hTeeEA3luA3 === void 0 ? void 0 : _fetchData$hTeeEA3luA3.value) || ''))))), /*#__PURE__*/React.createElement("div", {
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
  }, "Result")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "HIV Test"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$wsYLk5j39R = fetchData['wsYLk5j39R1']) === null || _fetchData$wsYLk5j39R === void 0 ? void 0 : _fetchData$wsYLk5j39R.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$wsYLk5j39R2 = fetchData['wsYLk5j39R1']) === null || _fetchData$wsYLk5j39R2 === void 0 ? void 0 : _fetchData$wsYLk5j39R2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Initiate CPT"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$T48HXW0TTd = fetchData['T48HXW0TTdB']) === null || _fetchData$T48HXW0TTd === void 0 ? void 0 : _fetchData$T48HXW0TTd.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$T48HXW0TTd2 = fetchData['T48HXW0TTdB']) === null || _fetchData$T48HXW0TTd2 === void 0 ? void 0 : _fetchData$T48HXW0TTd2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Initiate ART"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$qMj31r5XxD = fetchData['qMj31r5XxDF']) === null || _fetchData$qMj31r5XxD === void 0 ? void 0 : _fetchData$qMj31r5XxD.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$qMj31r5XxD2 = fetchData['qMj31r5XxDF']) === null || _fetchData$qMj31r5XxD2 === void 0 ? void 0 : _fetchData$qMj31r5XxD2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "CD4 Result"), /*#__PURE__*/React.createElement("td", null, ((_fetchData$PPtWbZprTO = fetchData['PPtWbZprTON']) === null || _fetchData$PPtWbZprTO === void 0 ? void 0 : _fetchData$PPtWbZprTO.date) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$PPtWbZprTO2 = fetchData['PPtWbZprTON']) === null || _fetchData$PPtWbZprTO2 === void 0 ? void 0 : _fetchData$PPtWbZprTO2.value) || '')), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "ART Reg. No. & Date"), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null)))))), /*#__PURE__*/React.createElement("div", {
    className: "col-6"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Treatment Result"), /*#__PURE__*/React.createElement("th", null, "Decided Date"))), /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ((_fetchData$DdksjaW6MW = fetchData['DdksjaW6MWf']) === null || _fetchData$DdksjaW6MW === void 0 ? void 0 : _fetchData$DdksjaW6MW.value) || ''), /*#__PURE__*/React.createElement("td", null, ((_fetchData$DdksjaW6MW2 = fetchData['DdksjaW6MWf']) === null || _fetchData$DdksjaW6MW2 === void 0 ? void 0 : _fetchData$DdksjaW6MW2.date) || ''))))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h6", {
    className: "col-12 my-2"
  }, "REGIMENT: ", ((_fetchData$F7pEZBWhMT = fetchData['F7pEZBWhMTN']) === null || _fetchData$F7pEZBWhMT === void 0 ? void 0 : _fetchData$F7pEZBWhMT.value) || 'N/A'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h6", {
    className: "col-12",
    onClick: () => {
      var _fetchData$Ms2aNVW7fo;
      return openInNewTab(((_fetchData$Ms2aNVW7fo = fetchData['Ms2aNVW7foI']) === null || _fetchData$Ms2aNVW7fo === void 0 ? void 0 : _fetchData$Ms2aNVW7fo.value) || '');
    }
  }, "Calendar: ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary ",
    style: {
      cursor: 'pointer'
    }
  }, ((_fetchData$Ms2aNVW7fo2 = fetchData['Ms2aNVW7foI']) === null || _fetchData$Ms2aNVW7fo2 === void 0 ? void 0 : _fetchData$Ms2aNVW7fo2.value) || 'N/A')), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h6", {
    className: "col-12"
  }, "Screening to close contact (Children, Adults, and PLHIV contacts)"), /*#__PURE__*/React.createElement("div", {
    className: "col-12 w-100"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "No"), /*#__PURE__*/React.createElement("th", null, "Complete Name"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", null, "TB screening date"), /*#__PURE__*/React.createElement("th", null, "Result"), /*#__PURE__*/React.createElement("th", null, "TPT initiated"))), /*#__PURE__*/React.createElement("tbody", null, relation.map((item, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, index + 1), /*#__PURE__*/React.createElement("td", null, item['kcLrIgGhPMM'] || ''), /*#__PURE__*/React.createElement("td", null, item['Nanz6h218xh'] || ''), /*#__PURE__*/React.createElement("td", null, item['date'] || ''), /*#__PURE__*/React.createElement("td", null, posOrNeg(item['hprn97zZAaO']) || ''), /*#__PURE__*/React.createElement("td", null, yesOrNo(item['gGi8Wtiphc6']) || '')))))))));
};
export default TbTreatmentCard;