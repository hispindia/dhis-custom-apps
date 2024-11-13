import React, { useEffect, useState } from "react";
import "./styles.scss"; // Make sure you have your styles in this file
import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up
import "bootstrap-icons/font/bootstrap-icons.css";

const IndividualTracking = ({ head }) => {
  const [searchType, setSearchType] = useState("qrcode"); // 'qrcode' or 'uniqueid'
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [uniqueIdValue, setUniqueIdValue] = useState("");
  const [getTei, setGetTei] = useState("");
  const [data, setData] = useState(null); // Don't initialize data as an empty string, use `null` instead
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to handle async calls
  const [orgname, setOrgname] = useState("");// All the Organization names and Id 
  const [dataelement, setDataelement] = useState("");// Used for All Data elements Name and Id 

  // Fetch TEI by QR Code
  const fetchQrTei = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getQrCodeTei(qrCodeValue);
      if (response?.trackedEntityInstances?.length > 0) {
        const instanceId = response?.trackedEntityInstances[0]?.trackedEntityInstance;
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
      const response = await ApiService.getUniqeTei(uniqueIdValue);
      if (response?.trackedEntityInstances?.length > 0) {
        const instanceId = response?.trackedEntityInstances[0]?.trackedEntityInstance;
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
  const fetchEvent = async (tei) => {
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
  const fetchOrgName = async (orgunit) => {

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
    if (data && data?.events && data.events.length > 0) {
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

  const handleUniqueIDChange = (e) => {
    const value = e.target.value;
    setUniqueIdValue(value);
    setErrorMessage(""); // Clear error on input change
  };

  const handleQRCodeChange = (e) => {
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
  const dataElementLookup = dataelement?.dataElements?.reduce((acc, element) => {
    acc[element.id] = element?.shortName;
    return acc;
  }, {});

  return (
    <>
      <div className="dataset-container my-3">
        {/* Filter Icon on the left */}
        <i className="bi bi-funnel-fill filter-icon"></i>

        {/* Radio buttons for search type */}
        <div className="search-type-container">
          <label>
            <input
              type="radio"
              value="qrcode"
              checked={searchType === "qrcode"}
              onChange={() => setSearchType("qrcode")}
              style={{ margin: '8px' }}
            />
            Search by QR Code
          </label>
          <label>
            <input
              type="radio"
              value="uniqueid"
              checked={searchType === "uniqueid"}
              onChange={() => setSearchType("uniqueid")}
              style={{ margin: '8px' }}
            />
            Search by Unique ID
          </label>
        </div>

        {/* Input fields based on selection */}
        <div className="input-container">
          {searchType === "qrcode" && (
            <div className="input-group">
              <label htmlFor="qr-input">QR Code:</label>
              <div className="input-with-icons">
                <input
                  type="text"
                  id="qr-input"
                  placeholder="Enter QR Code here"
                  className="input-text"
                  value={qrCodeValue}
                  onChange={handleQRCodeChange}
                />
                <i
                  className="bi bi-search icon-right search-icon"
                  onClick={handleSearch}
                  title="Click to search by QR Code"
                ></i>
              </div>
            </div>
          )}

          {searchType === "uniqueid" && (
            <div className="input-group">
              <label htmlFor="unique-id-input">Unique ID:</label>
              <div className="input-with-icons">
                <input
                  type="text"
                  id="unique-id-input"
                  placeholder="Enter Unique ID here"
                  className="input-text"
                  value={uniqueIdValue}
                  onChange={handleUniqueIDChange}
                />
                <i
                  className="bi bi-search icon-right search-icon"
                  onClick={handleSearch}
                  title="Click to search by Unique ID"
                ></i>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error message display */}
      <div style={{ fontWeight: "bold", textAlign: "center" }}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      {loading ? (
        <div className="loading-indicator">Loading...</div>
      ) : (
        data && (
          <div className="timeline-wrapper" >
            {/* <div className="timeline-container">
              <div className="timeline-line"></div>
              {data?.events?.map((event, index) => (
                <div
                  className="timeline-event"
                  key={index}
                  style={{
                    left: `${(index / (data.events.length - 1)) * 100}%`,
                  }}
                >
                  <div className="event-circle"></div>
                  <div className="event-label">
                    {new Date(event?.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div> */}

            <div className="timeline-container">
              <div className="timeline-line"></div>
              {data?.events?.map((event, index) => {
                const yesIomDataElements = event?.dataValues
                  .filter((dataValue) => dataValue?.value === "Yes (IOM)")
                  .map((dataValue) => dataElementLookup[dataValue?.dataElement]);

                return (
                  <div className="timeline-event" key={index} style={{ left: `${(index / (data?.events?.length - 1)) * 100}%` }}>

                    {/* Place the yesIomDataElements above the event circle */}
                    {yesIomDataElements?.length > 0 && (
                      <div className="event-value" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '30px', textAlign: 'center' }}>
                        {yesIomDataElements?.join(", ")}
                      </div>
                    )}

                    <div className="event-circle"></div>
                    <div
                      className="event-date"
                      style={{
                        position: 'absolute',
                        top: '30px', // Adjust spacing below the circle as needed
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {new Date(event.eventDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}

              {/* First Event Date at the Start */}
              {/* {data?.events?.length > 0 && (
                <div className="event-start-label">
                  {new Date(data?.events[0]?.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )} */}

              {/* Last Event Date at the End */}
              {/* {data?.events?.length > 1 && (
                <div className="event-end-label">
                  {new Date(data.events[data?.events?.length - 1].eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )} */}
            </div>


            <div className="table-container">
              <div className="data-box">
                <div
                  style={{
                    textAlign: "center",
                    color: "#118DFF",
                    backgroundColor: "#a9cef0",
                    fontWeight: "bold",
                  }}
                >
                  Origin
                </div>
                {data?.events?.length > 0 && (
                  <div className="event-box">
                    {data?.events[0].dataValues.find(
                      (dataValue) => dataValue.dataElement === "Z5xlVrNUci3"
                    )?.value || "N/A"}
                  </div>
                )}
              </div>

              <div className="data-box">
                <div
                  style={{
                    textAlign: "center",
                    color: "#118DFF",
                    backgroundColor: "#a9cef0",
                    fontWeight: "bold",
                  }}
                >
                  First Contact
                </div>
                {data?.events?.length > 0 && (
                  <div className="event-box">
                    {data.events[0].dataValues.find(
                      (dataValue) => dataValue.dataElement === "fXZL56HdDsH"
                    )?.value || orgname?.parent?.parent?.name}
                  </div>
                )}
              </div>

              <div className="data-box">
                <div
                  style={{
                    textAlign: "center",
                    color: "#118DFF",
                    backgroundColor: "#a9cef0",
                    fontWeight: "bold",
                  }}
                >
                  In Transit
                </div>

                {/* Horizontal scrolling container for events */}
                <div className="event-container-horizontal">
                  {data?.events?.map((event, eventIndex) => {
                    const GoingTocountry = event.dataValues.find(
                      (dataValue) => dataValue.dataElement === "WNhI1Tykxf0"
                    );
                    const GoingToprovince = event.dataValues.find(
                      (dataValue) => dataValue.dataElement === "ext8UP5JnKH"
                    );

                    return (
                      <div className="event-box-horizontal" key={eventIndex}>
                        <div className="event-details">
                          <div className="event-detail">
                            <strong>Country: </strong>
                            {GoingTocountry ? GoingTocountry.value : "N/A"}
                          </div>
                          <div className="event-detail">
                            <strong>Province: </strong>
                            {GoingToprovince ? GoingToprovince.value : "N/A"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="data-box">
                <div
                  style={{
                    textAlign: "center",
                    color: "#118DFF",
                    backgroundColor: "#a9cef0",
                    fontWeight: "bold",
                  }}
                >
                  Destination
                </div>
                {data?.events?.length > 0 && (
                  <div className="event-box">
                    {data.events[0].dataValues.find(
                      (dataValue) => dataValue.dataElement === "WNhI1Tykxf0"
                    )?.value || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}

    </>
  );
};

export default IndividualTracking;
