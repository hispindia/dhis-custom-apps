import React, { useEffect, useState } from "react";
import { ApiService } from "../../services/apiService";


import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const ProgramRuleDetails = () => {
  const { id: programruleId } = useParams();
  // const  indicatorId  = location.state.id || {}; // Retrieve the passed state
  const navigate = useNavigate(); // Initialize useNavigate
  const [ruleDetails, setRuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (programruleId) {
      fetchProgramruleDetails(programruleId);
    }
  }, [programruleId]);

  const fetchProgramruleDetails = async () => {
    // fetch single indicator details
    try {
      const response = await ApiService.getProgrruledetails(programruleId);
      setRuleDetails(response);
    } catch {
      console.error("Failed to fetch indicator details");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  console.log("indicator==========", ruleDetails);
  console.log("id======", programruleId);

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
        <h2 className="text-sm font-semibold">Introduction</h2>
        <p className="text-gray-700">
          {ruleDetails?.displayName} is a Program Rule.
          
        </p>
        <p>Condition:{ruleDetails?.condition}.</p>
        <p>Identifed by:{programruleId}</p>
      </section>

     

      <section className="mb-6">
        <h2 className="text-sm font-semibold">
          Accessibility & Sharing Settings
        </h2>
        <p className="text-gray-700">
          This ProgramRule was first created on{" "}
          <strong>
            {new Date(ruleDetails?.created).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            )}
          </strong>{" "}
         and Last Updated on{" "} 
          <strong>
            {new Date(ruleDetails?.lastUpdated).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            )}
          </strong>{" "}
          by {ruleDetails?.lastUpdatedBy?.name}.
        </p>
      </section>
    </div>
  );
};

export default ProgramRuleDetails;
