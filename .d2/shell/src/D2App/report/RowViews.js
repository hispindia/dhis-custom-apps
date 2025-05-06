import React, { useEffect, useState } from 'react';
import { TableWrapperTD, TableWrapperTR } from '../components/wrapper/TableWrapper';
import { useSelector } from 'react-redux';
import { CunstomLoader } from '../components/Loader';
import { AllDataelement } from '../redux/actions/HomeActions';
function RowViews() {
  var _eventData$events;
  const {
    selectedProgram
  } = useSelector(state => state.common);
  const {
    programStages,
    eventData,
    loading
  } = useSelector(state => state.home);
  const [dataElements, setDataElements] = useState({});
  const getNameProgameStage = id => {
    return programStages[id] ? programStages[id] : "Unknown";
  };
  const getNameDataElement = id => {
    return dataElements[id] ? dataElements[id] : "Unknown";
  };
  useEffect(() => {
    (async () => {
      const res = await AllDataelement();
      setDataElements(res);
    })();
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(CunstomLoader, null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("table", {
    className: "table table-striped table-bordered"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
    style: {
      textAlign: "left"
    }
  }, "Selected Program"), /*#__PURE__*/React.createElement(TableWrapperTD, {
    style: {
      textAlign: "left"
    }
  }, (selectedProgram === null || selectedProgram === void 0 ? void 0 : selectedProgram.name) || '')), eventData === null || eventData === void 0 ? void 0 : (_eventData$events = eventData.events) === null || _eventData$events === void 0 ? void 0 : _eventData$events.map((event, index) => {
    var _event$dataValues, _event$dataValues2;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, "Program Stage"), /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, " ", getNameProgameStage(event === null || event === void 0 ? void 0 : event.programStage))), /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, "Event Date"), /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, event.eventDate ? event.eventDate.split("T")[0] : "")), /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, "Status"), /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, event.status)), (event === null || event === void 0 ? void 0 : (_event$dataValues = event.dataValues) === null || _event$dataValues === void 0 ? void 0 : _event$dataValues.length) > 0 && /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    }, "DataElements"), /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        textAlign: "left"
      }
    })), event === null || event === void 0 ? void 0 : (_event$dataValues2 = event.dataValues) === null || _event$dataValues2 === void 0 ? void 0 : _event$dataValues2.map((dataValue, idx) => {
      return /*#__PURE__*/React.createElement(TableWrapperTR, null, /*#__PURE__*/React.createElement(TableWrapperTD, {
        style: {
          textAlign: "left"
        }
      }, getNameDataElement(dataValue === null || dataValue === void 0 ? void 0 : dataValue.dataElement), ":"), /*#__PURE__*/React.createElement(TableWrapperTD, {
        style: {
          textAlign: "left"
        }
      }, dataValue.value === "true" ? "YES" : dataValue.value === "false" ? "NO" : dataValue.value));
    }));
  }))));
}
export default RowViews;