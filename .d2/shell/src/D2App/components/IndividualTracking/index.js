import React, { useEffect, useState } from "react";
import "./styles.scss"; // Make sure you have your styles in this file
import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up
import "bootstrap-icons/font/bootstrap-icons.css";
const IndividualTracking = _ref => {
  var _dataelement$dataElem, _data$events, _data$events3, _data$events$0$dataVa, _data$events4, _data$events$0$dataVa2, _orgname$parent, _orgname$parent$paren, _data$events5, _data$events6, _data$events$0$dataVa3;
  let {
    head
  } = _ref;
  const [searchType, setSearchType] = useState("qrcode"); // 'qrcode' or 'uniqueid'
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [uniqueIdValue, setUniqueIdValue] = useState("");
  const [getTei, setGetTei] = useState("");
  const [data, setData] = useState(null); // Don't initialize data as an empty string, use `null` instead
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to handle async calls
  const [orgname, setOrgname] = useState(""); // All the Organization names and Id 
  const [dataelement, setDataelement] = useState(""); // Used for All Data elements Name and Id 

  // Fetch TEI by QR Code
  const fetchQrTei = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      var _response$trackedEnti;
      const response = await ApiService.getQrCodeTei(qrCodeValue);
      if ((response === null || response === void 0 ? void 0 : (_response$trackedEnti = response.trackedEntityInstances) === null || _response$trackedEnti === void 0 ? void 0 : _response$trackedEnti.length) > 0) {
        var _response$trackedEnti2;
        const instanceId = response === null || response === void 0 ? void 0 : (_response$trackedEnti2 = response.trackedEntityInstances[0]) === null || _response$trackedEnti2 === void 0 ? void 0 : _response$trackedEnti2.trackedEntityInstance;
        setGetTei(instanceId);
        fetchEvent(instanceId); // Directly fetch the event after getting TEI
      } else {
        setErrorMessage("No trackedEntityInstances found for this QR Code.");
        setData(null);
      }
    } catch (error) {
      setErrorMessage("Error fetching TEI by QR Code.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch TEI by Unique ID
  const fetchUniqueTei = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      var _response$trackedEnti3;
      const response = await ApiService.getUniqeTei(uniqueIdValue);
      if ((response === null || response === void 0 ? void 0 : (_response$trackedEnti3 = response.trackedEntityInstances) === null || _response$trackedEnti3 === void 0 ? void 0 : _response$trackedEnti3.length) > 0) {
        var _response$trackedEnti4;
        const instanceId = response === null || response === void 0 ? void 0 : (_response$trackedEnti4 = response.trackedEntityInstances[0]) === null || _response$trackedEnti4 === void 0 ? void 0 : _response$trackedEnti4.trackedEntityInstance;
        setGetTei(instanceId);
        fetchEvent(instanceId); // Directly fetch the event after getting TEI
      } else {
        setErrorMessage("No trackedEntityInstances found for this Unique ID.");
        setData(null);
      }
    } catch (error) {
      setErrorMessage("Error fetching TEI by Unique ID.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch event data
  const fetchEvent = async tei => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getEvent(tei || getTei); // Use passed TEI or state TEI
      setData(response);
    } catch (error) {
      setErrorMessage("Error fetching event data.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  const fetchOrgName = async orgunit => {
    setErrorMessage("");
    try {
      const response = await ApiService.getOrgName(orgunit); // Use passed TEI or state TEI
      setOrgname(response);
    } catch (error) {
      setErrorMessage("Error fetching event data.");
    }
  };
  const fetchDataElementName = async () => {
    setErrorMessage("");
    try {
      const response = await ApiService.getMedicineName(); // Use passed TEI or state TEI
      setDataelement(response);
    } catch (error) {
      setErrorMessage("Error fetching event data.");
    }
  };
  useEffect(() => {
    if (data && data !== null && data !== void 0 && data.events && data.events.length > 0) {
      const orgUnit = data.events[0].orgUnit; // Get orgUnit from the first event
      if (orgUnit) {
        fetchOrgName(orgUnit); // Fetch organization name once we have the orgUnit
      }
    }
  }, [data]);

  // Search handler, calls the appropriate fetch function
  const handleSearch = () => {
    setErrorMessage(""); // Clear previous errors
    if (searchType === "qrcode" && qrCodeValue.trim()) {
      fetchQrTei();
    } else if (searchType === "uniqueid" && uniqueIdValue.trim()) {
      fetchUniqueTei();
    } else {
      setErrorMessage("Please enter a valid value before searching.");
    }
  };
  const handleUniqueIDChange = e => {
    const value = e.target.value;
    setUniqueIdValue(value);
    setErrorMessage(""); // Clear error on input change
  };
  const handleQRCodeChange = e => {
    const value = e.target.value;
    setQrCodeValue(value);
    setErrorMessage(""); // Clear error on input change
  };

  // Clear inputs and states when search type changes
  useEffect(() => {
    if (searchType === "qrcode") {
      setUniqueIdValue("");
    } else if (searchType === "uniqueid") {
      setQrCodeValue("");
    }
    setData(null);
    setGetTei("");
    setErrorMessage("");
  }, [searchType]);
  useEffect(() => {
    fetchDataElementName();
  }, []);
  const dataElementLookup = dataelement === null || dataelement === void 0 ? void 0 : (_dataelement$dataElem = dataelement.dataElements) === null || _dataelement$dataElem === void 0 ? void 0 : _dataelement$dataElem.reduce((acc, element) => {
    acc[element.id] = element === null || element === void 0 ? void 0 : element.shortName;
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dataset-container my-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-funnel-fill filter-icon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "search-type-container"
  }, /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    value: "qrcode",
    checked: searchType === "qrcode",
    onChange: () => setSearchType("qrcode"),
    style: {
      margin: '8px'
    }
  }), "Search by QR Code"), /*#__PURE__*/React.createElement("label", null, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    value: "uniqueid",
    checked: searchType === "uniqueid",
    onChange: () => setSearchType("uniqueid"),
    style: {
      margin: '8px'
    }
  }), "Search by Unique ID")), /*#__PURE__*/React.createElement("div", {
    className: "input-container"
  }, searchType === "qrcode" && /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "qr-input"
  }, "QR Code:"), /*#__PURE__*/React.createElement("div", {
    className: "input-with-icons"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "qr-input",
    placeholder: "Enter QR Code here",
    className: "input-text",
    value: qrCodeValue,
    onChange: handleQRCodeChange
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-search icon-right search-icon",
    onClick: handleSearch,
    title: "Click to search by QR Code"
  }))), searchType === "uniqueid" && /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "unique-id-input"
  }, "Unique ID:"), /*#__PURE__*/React.createElement("div", {
    className: "input-with-icons"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "unique-id-input",
    placeholder: "Enter Unique ID here",
    className: "input-text",
    value: uniqueIdValue,
    onChange: handleUniqueIDChange
  }), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-search icon-right search-icon",
    onClick: handleSearch,
    title: "Click to search by Unique ID"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "bold",
      textAlign: "center"
    }
  }, errorMessage && /*#__PURE__*/React.createElement("p", {
    className: "error-message"
  }, errorMessage)), loading ? /*#__PURE__*/React.createElement("div", {
    className: "loading-indicator"
  }, "Loading...") : data && /*#__PURE__*/React.createElement("div", {
    className: "timeline-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-line"
  }), data === null || data === void 0 ? void 0 : (_data$events = data.events) === null || _data$events === void 0 ? void 0 : _data$events.map((event, index) => {
    var _data$events2;
    const yesIomDataElements = event === null || event === void 0 ? void 0 : event.dataValues.filter(dataValue => (dataValue === null || dataValue === void 0 ? void 0 : dataValue.value) === "Yes (IOM)").map(dataValue => dataElementLookup[dataValue === null || dataValue === void 0 ? void 0 : dataValue.dataElement]);
    return /*#__PURE__*/React.createElement("div", {
      className: "timeline-event",
      key: index,
      style: {
        left: `${index / ((data === null || data === void 0 ? void 0 : (_data$events2 = data.events) === null || _data$events2 === void 0 ? void 0 : _data$events2.length) - 1) * 100}%`
      }
    }, (yesIomDataElements === null || yesIomDataElements === void 0 ? void 0 : yesIomDataElements.length) > 0 && /*#__PURE__*/React.createElement("div", {
      className: "event-value",
      style: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '30px',
        textAlign: 'center'
      }
    }, yesIomDataElements === null || yesIomDataElements === void 0 ? void 0 : yesIomDataElements.join(", ")), /*#__PURE__*/React.createElement("div", {
      className: "event-circle"
    }), /*#__PURE__*/React.createElement("div", {
      className: "event-date",
      style: {
        position: 'absolute',
        top: '30px',
        // Adjust spacing below the circle as needed
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '0.85rem'
      }
    }, new Date(event.eventDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })));
  })), /*#__PURE__*/React.createElement("div", {
    className: "table-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "data-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "#118DFF",
      backgroundColor: "#a9cef0",
      fontWeight: "bold"
    }
  }, "Origin"), (data === null || data === void 0 ? void 0 : (_data$events3 = data.events) === null || _data$events3 === void 0 ? void 0 : _data$events3.length) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "event-box"
  }, (data === null || data === void 0 ? void 0 : (_data$events$0$dataVa = data.events[0].dataValues.find(dataValue => dataValue.dataElement === "Z5xlVrNUci3")) === null || _data$events$0$dataVa === void 0 ? void 0 : _data$events$0$dataVa.value) || "N/A")), /*#__PURE__*/React.createElement("div", {
    className: "data-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "#118DFF",
      backgroundColor: "#a9cef0",
      fontWeight: "bold"
    }
  }, "First Contact"), (data === null || data === void 0 ? void 0 : (_data$events4 = data.events) === null || _data$events4 === void 0 ? void 0 : _data$events4.length) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "event-box"
  }, ((_data$events$0$dataVa2 = data.events[0].dataValues.find(dataValue => dataValue.dataElement === "fXZL56HdDsH")) === null || _data$events$0$dataVa2 === void 0 ? void 0 : _data$events$0$dataVa2.value) || (orgname === null || orgname === void 0 ? void 0 : (_orgname$parent = orgname.parent) === null || _orgname$parent === void 0 ? void 0 : (_orgname$parent$paren = _orgname$parent.parent) === null || _orgname$parent$paren === void 0 ? void 0 : _orgname$parent$paren.name))), /*#__PURE__*/React.createElement("div", {
    className: "data-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "#118DFF",
      backgroundColor: "#a9cef0",
      fontWeight: "bold"
    }
  }, "In Transit"), /*#__PURE__*/React.createElement("div", {
    className: "event-container-horizontal"
  }, data === null || data === void 0 ? void 0 : (_data$events5 = data.events) === null || _data$events5 === void 0 ? void 0 : _data$events5.map((event, eventIndex) => {
    const GoingTocountry = event.dataValues.find(dataValue => dataValue.dataElement === "WNhI1Tykxf0");
    const GoingToprovince = event.dataValues.find(dataValue => dataValue.dataElement === "ext8UP5JnKH");
    return /*#__PURE__*/React.createElement("div", {
      className: "event-box-horizontal",
      key: eventIndex
    }, /*#__PURE__*/React.createElement("div", {
      className: "event-details"
    }, /*#__PURE__*/React.createElement("div", {
      className: "event-detail"
    }, /*#__PURE__*/React.createElement("strong", null, "Country: "), GoingTocountry ? GoingTocountry.value : "N/A"), /*#__PURE__*/React.createElement("div", {
      className: "event-detail"
    }, /*#__PURE__*/React.createElement("strong", null, "Province: "), GoingToprovince ? GoingToprovince.value : "N/A")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "data-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      color: "#118DFF",
      backgroundColor: "#a9cef0",
      fontWeight: "bold"
    }
  }, "Destination"), (data === null || data === void 0 ? void 0 : (_data$events6 = data.events) === null || _data$events6 === void 0 ? void 0 : _data$events6.length) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "event-box"
  }, ((_data$events$0$dataVa3 = data.events[0].dataValues.find(dataValue => dataValue.dataElement === "WNhI1Tykxf0")) === null || _data$events$0$dataVa3 === void 0 ? void 0 : _data$events$0$dataVa3.value) || "N/A")))));
};
export default IndividualTracking;