import React, { useEffect, useState } from "react";
import { ApiService } from "../../services/apiService";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const IndicatorDetails = () => {

  const { id: indicatorId } = useParams();
  // const  indicatorId  = location.state.id || {}; // Retrieve the passed state
  const allDataElement = useSelector((state) => state.main.dataElements);
  const [indicatorDetails, setIndicatorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const getDataElementNameById = (id) => {
    const dataElement = allDataElement.find((element) => element.id === id);
    return dataElement ? dataElement.name : id; // Return the name if found, else return the original ID
  };

  // Function to extract and map numerator IDs to names
const mapNumeratorIdsToNames = (numerator) => {
  if (!numerator || !allDataElement.length) return "No numerator data available";

  // Regex patterns for #{ID} and #{ID.SUFFIX}
  const idPattern1 = /#\{([a-zA-Z0-9]+)\}/g;
  const idPattern2 = /#\{([a-zA-Z0-9]+)\.[a-zA-Z0-9]+\}/g;

  // Extract and map the IDs from both patterns
  const mapIds = (pattern) =>
    (numerator.match(pattern) || [])
      .map((id) => {
        const idValue = id.replace(/#\{|\..*?\}/g, "").replace("}", "");
        const name = getDataElementNameById(idValue);
        return `#{${name}}`;
      })
      .join(" + ");

  const mappedPattern1 = mapIds(idPattern1);
  const mappedPattern2 = mapIds(idPattern2);

  // Combine both mapped results
  return [mappedPattern1, mappedPattern2].filter(Boolean).join(" + ");
};

  useEffect(() => {
    if (indicatorId) {
      fetchIndicatorDetails(indicatorId);
    }
  }, [indicatorId]);

  const fetchIndicatorDetails = async () => {// fetch single indicator details 
    try {
      const response = await ApiService.getIndicatorDetails(indicatorId);
      setIndicatorDetails(response);
    } catch {
      console.error("Failed to fetch indicator details");
    } finally {
      setLoading(false);
    }
  };
  console.log("indicator==========", indicatorDetails);
  console.log("id======", indicatorId);
  console.log("allDataElement============", allDataElement);
  return (
    <div className="p-8 md:p-12 bg-gray-50 min-h-screen" style={{padding:'15px'}}>
      
      <section className="mb-6">
        <h2 className="text-lg font-semibold">Introduction</h2>
        <p className="text-gray-700">
          {indicatorDetails?.displayNumeratorDescription} is a {indicatorDetails?.indicatorType?.id == "XVhx9sOUw2X" ? "Total" :'Percent'} indicator, measured by {indicatorDetails?.numeratorDescription} to {indicatorDetails?.denominatorDescription}.
        </p>
        <p>Identifed by:{indicatorId}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Calculation Details</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Expression</th>
              <th>Formula</th>
              {/* <th>Sources</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Numerator</td>
              <td>{indicatorDetails?.numeratorDescription}</td>
              <td></td>
            </tr>
            <tr>
              <td>Denominator</td>
              <td>{indicatorDetails?.denominatorDescription}</td>
              {/* <td>
                <a href="#" className="text-blue-500 underline">
                  National PLHIV Estimates
                </a>
              </td> */}
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Data Elements in Indicator</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Data Element</th>
              <th>Expression Part</th>
              <th>Aggregation</th>
              <th>Value Type</th>
              <th>ExternalAccess</th>
              <th>Favorite</th>
              {/* <th>Data Sets/Programs</th> */}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{indicatorDetails?.denominatorDescription}</td>
              <td>Denominator</td>
              <td>Sum</td>
              <td>Number</td>
              <td>{indicatorDetails?.externalAccess}</td>  
              <td>{indicatorDetails?.favorite}</td>
              {/* <td>
                <a href="#" className="text-blue-500 underline">
                  National PLHIV Estimates
                </a>
              </td> */}
            </tr>
          </tbody>
        </table>
      </section>
      <section className="mb-6">
      <span style={{fontWeight:'bold', fontSize:'16px'}}>Formula:</span>

        <div>
          {indicatorDetails &&
            mapNumeratorIdsToNames(indicatorDetails.numerator)}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">
          Accessibility & Sharing Settings
        </h2>
        <p className="text-gray-700">
          This indicator was first created on{" "}
          <strong>
            {new Date(indicatorDetails?.created).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </strong>{" "}
          by {indicatorDetails?.createdBy.name} and last updated on{" "}
          <strong>
            {new Date(indicatorDetails?.lastUpdated).toLocaleDateString(
              "en-US",
              { month: "short", day: "numeric", year: "numeric" }
            )}
          </strong>{" "}
          by {indicatorDetails?.lastUpdatedBy?.name}.
        </p>
      </section>

      {/* <footer className="mt-12 text-sm text-gray-500">
        Dictionary generated on Feb 4, 2025
      </footer> */}
    </div>
  );
};

export default IndicatorDetails;
