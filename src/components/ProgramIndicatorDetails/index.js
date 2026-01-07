import React, { useEffect, useState } from "react";
import { ApiService } from "../../services/apiService";

import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { use } from "react";

const ProgramIndicatorDetails = () => {
  const { id: programindicatorId } = useParams();
  // const  indicatorId  = location.state.id || {}; // Retrieve the passed state
  const navigate = useNavigate(); // Initialize useNavigate
  const [programindicatorDetails, setProgramindicatorDetails] = useState(null);
  const [programStages, setProgramStages] = useState();
  const [dataElements, setDataElements] = useState();
  const [trackentityAttributes, setTrackentityAttributes] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchProgramstages();
    fetchDataElements();
    fetchTrackedEntityAttributes();
  }, []);
  useEffect(() => {
    if (programindicatorId) {
      fetchProgramIndicatorDetails(programindicatorId);
    }
  }, [programindicatorId]);

  const fetchProgramIndicatorDetails = async () => {
    // fetch single indicator details
    try {
      const response = await ApiService.getProgramDetails(programindicatorId);
      setProgramindicatorDetails(response);
    } catch {
      console.error("Failed to fetch indicator details");
    } finally {
      setLoading(false);
    }
  };
  const fetchProgramstages = async () => {
    // fetch single indicator details
    try {
      const response = await ApiService.getProgramStages();
      setProgramStages(response?.programStages);
    } catch {
      console.error("Failed to fetch indicator details");
    }
  };
  const fetchDataElements = async () => {
    // fetch single indicator details
    try {
      const response = await ApiService.getDataElements();
      setDataElements(response?.dataElements);
    } catch {
      console.error("Failed to fetch indicator details");
    }
  };
  const fetchTrackedEntityAttributes = async () => {
    // fetch single indicator details
    try {
      const response = await ApiService.getTrackedEntityAttributes();
      setTrackentityAttributes(response?.trackedEntityAttributes);
    } catch {
      console.error("Failed to fetch indicator details");
    }
  };
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  // function replaceProgramStageIds(filter, programStages,dataElements) {
  //   if (!filter || !Array.isArray(programStages)) return filter;

  //   return filter.replace(
  //     /#\{([^.}]+)\.([^}]+)\}/g,
  //     (match, stageId, dataElementId) => {
  //       const stageObj = programStages.find(
  //         stage => stage.id === stageId
  //       );

  //       const stageName = stageObj ? stageObj.name : stageId;
  //         // find data element name
  //       const deObj = dataElements?.find(
  //         de => de.id === dataElementId
  //       );
  //       const dataElementName = deObj ? deObj.name : dataElementId;

  //       return `#{${stageName}.${dataElementName}}`;
  //     }
  //   );
  // }
  function replaceProgramStageIds(
    filter,
    programStages,
    dataElements,
    trackentityAttributes
  ) {
    if (!filter) return filter;

    let updatedFilter = filter;

    // 🔹 Replace ProgramStage.DataElement
    updatedFilter = updatedFilter.replace(
      /#\{([^.}]+)\.([^}]+)\}/g,
      (match, stageId, dataElementId) => {
        const stageObj = programStages?.find((stage) => stage.id === stageId);
        const stageName = stageObj ? stageObj.name : stageId;

        const deObj = dataElements?.find((de) => de.id === dataElementId);
        const dataElementName = deObj ? deObj.name : dataElementId;

        return `#{${stageName}.${dataElementName}}`;
      }
    );

    // 🔹 Replace Tracked Entity Attributes A{UID}
    updatedFilter = updatedFilter.replace(
      /A\{([^}]+)\}/g,
      (match, attributeId) => {
        const attrObj = trackentityAttributes?.find(
          (attr) => attr.id === attributeId
        );
        const attributeName = attrObj ? attrObj.name : attributeId;

        return `A{${attributeName}}`;
      }
    );

    return updatedFilter;
  }

  // console.log("indicator==========", programindicatorDetails);
  // console.log("id======shashi", programindicatorId);
  // console.log("programStages===",programStages)
  // console.log("dataelements====",dataElements)

  return (
    <div
      className="p-8 md:p-12 bg-gray-50 min-h-screen"
      style={{ padding: "15px" }}
    >
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        style={{ background: "#2C6693" }}
      >
        Back
      </button>
      <section className="mb-6">
        <h2 className="text-lg font-semibold">Introduction</h2>
        <p className="text-gray-700">
          {programindicatorDetails?.displayName} is a{" "}
          {programindicatorDetails?.dimensionItemType}.
        </p>
        <p>Identifed by:{programindicatorId}</p>
        <p> {programindicatorDetails?.favorite} </p>
        <p>{programindicatorDetails?.externalAccess}</p>
        <p>
          Filter:
          {replaceProgramStageIds(
            programindicatorDetails?.filter,
            programStages,
            dataElements,
            trackentityAttributes
          )}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Calculation Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th>AggregationType</th>
              <th>AnalyticsType</th>
              <th>Favorite</th>
              <th>ExternalAccess</th>
              <th>Expression</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{programindicatorDetails?.aggregationType}</td>
              <td>{programindicatorDetails?.analyticsType}</td>
              <td>{programindicatorDetails?.favorite}</td>
              <td>{programindicatorDetails?.externalAccess}</td>
              <td>{programindicatorDetails?.expression}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">
          Accessibility & Sharing Settings
        </h2>
        <p className="text-gray-700">
          This indicator was first created on{" "}
          <strong>
            {new Date(programindicatorDetails?.created).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </strong>{" "}
          by {programindicatorDetails?.createdBy.name} and last updated on{" "}
          <strong>
            {new Date(programindicatorDetails?.lastUpdated).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            )}
          </strong>{" "}
          by {programindicatorDetails?.lastUpdatedBy?.name}.
        </p>
      </section>
    </div>
  );
};

export default ProgramIndicatorDetails;
