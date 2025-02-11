import React, { useEffect, useState } from "react";
import { ApiService } from "../../services/apiService";


import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const ProgramIndicatorDetails = () => {
  const { id: programindicatorId } = useParams();
  // const  indicatorId  = location.state.id || {}; // Retrieve the passed state
  const navigate = useNavigate(); // Initialize useNavigate
  const [programindicatorDetails, setProgramindicatorDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  console.log("indicator==========", programindicatorDetails);
  console.log("id======", programindicatorId);

  return (
    <div
      className="p-8 md:p-12 bg-gray-50 min-h-screen"
      style={{ padding: "15px" }}
    >
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        style={{background:'#2C6693'}}
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
