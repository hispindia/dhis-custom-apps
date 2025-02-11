import React, { useState, useEffect } from "react";
import "./styles.scss"; // Ensure your styles are correctly set up
import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up
import "bootstrap-icons/font/bootstrap-icons.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { setState, setTab } from "../../store/main/main.action";

const Home = () => {
  const [activeTab, setActiveTab] = useState("Indicators");
  const [searchQuery, setSearchQuery] = useState("");
  const [allIndicators, setAllIndicators] = useState([]);
  const [allProgramIndicators, setAllProgramIndicators] = useState([]);
  const allDataElement = useSelector((state) => state.main.dataElements);
  const [groupindicators, setGroupindicators] = useState([]);
  const [selectedGroupIndicator, setSelectedGroupIndicator] = useState("");
  const [filterindicator, setFilterindicator] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to handle async calls
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page
  const [originalAllIndicators, setOriginalAllIndicators] = useState([]);
  const [programrules, setProgramrules] = useState([]);
  const dispatch = useDispatch();

  // Fetch all indicators from API
  const fetchAllIndicators = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getAllIndicators();
      if (response && response.indicators && response.indicators.length > 0) {
        setAllIndicators(response.indicators); // Populate state with data
        setOriginalAllIndicators(response.indicators);
        setSearchQuery("");
      } else {
        setErrorMessage("No indicators found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching indicators.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all program indicators from API
  const fetchAllProgramIndicators = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getProgramIndicators();
      if (
        response &&
        response.programIndicators &&
        response.programIndicators.length > 0
      ) {
        setAllProgramIndicators(response.programIndicators); // Populate state with data
      } else {
        setErrorMessage("No program indicators found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching program indicators.");
    } finally {
      setLoading(false);
    }
  };
  // Fetch all DataElements to pick the Name of the DataElement
  const fetchAllDataElement = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getAllDataElements();
      if (
        response &&
        response.dataElements &&
        response.dataElements.length > 0
      ) {
        // setAllDataElement(response.dataElements); // Populate state with data
        dispatch(setState(response.dataElements));
      } else {
        setErrorMessage("No program indicators found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching program indicators.");
    } finally {
      setLoading(false);
    }
  };
  // fetch Group indicator for the group select option
  const fetchGroupIndicators = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getIndicatorGroup();
      if (
        response &&
        response.indicatorGroups &&
        response.indicatorGroups.length > 0
      ) {
        setGroupindicators(response.indicatorGroups); // Populate state with data
      } else {
        setErrorMessage("No program indicators found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching program indicators.");
    } finally {
      setLoading(false);
    }
  };
  // fetch programRules list data
  const fetchProgramRules = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getProgramRules();
      if (
        response &&
        response.programRules &&
        response.programRules.length > 0
      ) {
        setProgramrules(response.programRules); // Populate state with data
      } else {
        setErrorMessage("No program rules found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching program rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIndicators();
    fetchAllProgramIndicators();
    fetchAllDataElement();
    fetchGroupIndicators();
    fetchProgramRules();
  }, []);
  // useEffect(() => {
  //   if (activeTab === "ProgramRules") {
  //     fetchProgramRules();
  //   }
  // }, [activeTab]); // Run effect when tab changes

 
  // when selectedGroupIndicator then fetch the FilterIndicator that are present in the list
  useEffect(() => {
    const fetchFilterIndicators = async () => {
      if (!selectedGroupIndicator) return; // Only fetch if an ID is selected

      setLoading(true);
      setErrorMessage("");

      try {
        const response = await ApiService.getFilterIndicator(
          selectedGroupIndicator
        );
        if (response && response.indicators && response.indicators.length > 0) {
          setFilterindicator(response.indicators); // Populate state with data
        } else {
          setErrorMessage("No indicators found for the selected group.");
        }
      } catch (error) {
        setErrorMessage("Error fetching filtered indicators.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterIndicators();
  }, [selectedGroupIndicator]);


// filtered indicaator data when selected Group indicator is selected and set to state
  useEffect(() => {
    // Filter and update state when inputs change
    const filtered = allIndicators.filter((indicator) =>
      filterindicator.some((filterItem) => filterItem.id === indicator.id)
    );
    setFilteredObjects(filtered);
  }, [allIndicators, filterindicator]);

  console.log("groupindicators=====", groupindicators);
  console.log("selectedGroupIndicator====", selectedGroupIndicator);
  console.log("allIndicators==========", allIndicators);
  console.log("filterindicators=====", filterindicator);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(setTab(tab));
    setCurrentPage(1); // Reset to the first page when changing tabs
    setSearchQuery("");
    setSelectedGroupIndicator("");
    console.log("aaaaaaaaaaa", tab)
    // if(tab == "ProgramRules"){
    //   navigate(`/programrules`);
    // }
  };
// GroupIndicators selected and handle change function 
  const handleGroupIndicatorChange = (event) => {
    setSelectedGroupIndicator(event.target.value);
    setSearchQuery("");
    console.log(`Selected Group Indicator: ${event.target.value}`);
  };
// handle search function 
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
// handle download function bas
  const handleDownload = () => {
    let dataToDownload;
    if (selectedGroupIndicator) {
      dataToDownload =
        activeTab === "Indicators" && selectedGroupIndicator
          ? filteredObjects
          : allProgramIndicators;

      if (dataToDownload.length === 0) {
        alert(`No ${activeTab.toLowerCase()} available for download.`);
        return;
      } // when selectedGroupIndicator selected then download will take this part
    } else {
      dataToDownload =
        activeTab === "Indicators" ? allIndicators : activeTab === "Program Indicators" ? allProgramIndicators : programrules;

      if (dataToDownload.length === 0) {
        alert(`No ${activeTab.toLowerCase()} available for download.`);
        return;
      }
    }

    const getDataElementNameById = (id) => {
      const dataElement = allDataElement.find((element) => element.id === id);
      return dataElement ? dataElement.name : id; // Return the name if found, else return the original ID
    };

   
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

    // Convert data to CSV format
    const headers =
      activeTab === "Indicators"
        ? [
          "Display Short Name",
          "Numerator Description",
          "Denominator Description",
          "Numerator",
          "ID",
          "Name",
          "Denominator",
        ]
        : activeTab === "Program Indicators" ? ["ID", "Name", "AggregationType", "AnalyticsType"] : ["ID", "Name"];

    const rows = dataToDownload.map((item) => {
      { console.log("item=======", item) }
      if (activeTab === "Indicators") {
        const numeratorNames = mapNumeratorIdsToNames(item?.numerator);
        return [
          item?.displayShortName || "N/A",
          item?.displayNumeratorDescription || "N/A",
          item?.displayDenominatorDescription || "N/A",
          numeratorNames || "N/A", // Show the names instead of IDs
          item?.id || "N/A",
          item?.name || "N/A",
          item?.denominator || "N/A",
        ];
      } else if (activeTab === "Program Indicators") {
        return [
          item?.id || "N/A",
          item?.name || "N/A",
          item?.aggregationType || "N/A",
          item?.analyticsType || "N/A",
        ];
      }
      else {
        return [
          item?.id || "N/A",
          item?.name || "N/A",

        ];
      }
    });

    // Create a CSV string
    const csvContent = [
      headers.join(","), // Join headers
      ...rows.map((row) => row.join(",")), // Join rows
    ].join("\n");

    // Trigger file download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${activeTab.toLowerCase().replace(" ", "_")}.csv`
    );
    link.click();
  };

  // Get the current page's data based on the active tab and selectedGroupIndicator
  const getCurrentPageData = () => {
    if (selectedGroupIndicator) {
      // when selectedGroupIndicator is selected then get the filterObjects data
      const data =
        activeTab === "Indicators" ? filteredObjects : allProgramIndicators;
      // const data = activeTab === "Indicators" ? allIndicators : allProgramIndicators;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    } else {
      const data =
        activeTab === "Indicators" ? allIndicators : activeTab === "Program Indicators" ? allProgramIndicators : programrules;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    }
  }; // this function will display the row in the table

  // Calculate the total number of pages based on the active tab

  const totalPages = Math.ceil(selectedGroupIndicator && activeTab === "Indicators" ? filteredObjects.length / itemsPerPage : (activeTab === "Indicators" ? allIndicators.length : activeTab === "Program Indicators" ? allProgramIndicators.length : programrules.length) / itemsPerPage
  ); // count the total pages selectedGroupIndicator conditionally applied

  // Navigate to the previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const navigate = useNavigate();


  console.trace("ggggggggg")
  const handleRowClick = (id) => {
    if (activeTab === "Indicators") {
      navigate(`/IndicatorDetails/${id}`);
    }
    else if (activeTab === "Indicators"){
      navigate(`/ProgramIndicatorDetails/${id}`);
    }
    else{
      navigate('/')
    }

  };

  // Get table headers and row data dynamically based on the active tab
  const getTableHeaders = () => {
    if (activeTab === "Indicators") {
      return (
        <tr>
          <th>ID</th>
          <th>Display Short Name</th>
          <th>Numerator Description</th>
          <th>Denominator Description</th>
        </tr>
      );
    } else if (activeTab == "Program Indicators") {
      return (
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>AggregationType</th>
          <th>AnalyticsType</th>
        </tr>
      );
    } else {
      return (
        <>
          <th>ID</th>
          <th>Name</th>
        </>
      )
    }
  };

  const getRowData = (row) => {
    if (activeTab === "Indicators") {
      return (
        <>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.id || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.displayShortName || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.displayNumeratorDescription || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.displayDenominatorDescription || "N/A"}</td>
        </>
      );
    } else if (activeTab == "Program Indicators") {
      return (
        <>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.id || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.name || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.aggregationType || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.analyticsType || "N/A"}</td>

        </>
      );
    }
    else {
      return (
        <>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.id || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.name || "N/A"}</td>
        </>
      )
    }
  };



  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      // Reset to the original indicators when search is cleared
      setAllIndicators(originalAllIndicators);
      return;
    }

    const filteredResults = originalAllIndicators.filter(
      (indicator) =>
        indicator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (indicator.displayShortName &&
          indicator.displayShortName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );

    setAllIndicators(filteredResults);
  }, [searchQuery]);

  return (
    <div className="app">
      <div className="header">
        <h1>Indicator Dictionary</h1>
        <button className="download-button" onClick={handleDownload}>
          Download
        </button>
      </div>

      <div className="content">
        <div className="controls">
          <button
            className={activeTab === "Indicators" ? "active" : ""}
            onClick={() => handleTabChange("Indicators")}
          >
            Indicators
          </button>
          <button
            className={activeTab === "Program Indicators" ? "active" : ""}
            onClick={() => handleTabChange("Program Indicators")}
          >
            Program Indicators
          </button>
          <button
            className={activeTab === "ProgramRules" ? "active" : ""}
            onClick={() => handleTabChange("ProgramRules")}
          >
            ProgramRules
          </button>

          <div className="group-indicator-dropdown">
            <label htmlFor="group-indicator-select">
              Filter by Group Indicator:
            </label>
            <select
              className="group-indicator-select"
              value={selectedGroupIndicator}
              onChange={handleGroupIndicatorChange}
            >
              <option value="">Select a Group Indicator</option>
              {groupindicators.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name || "Unnamed Group"}
                </option>
              ))}
            </select>
          </div>

          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search indicator"
            />
            {/* <button onClick={handleSearch}>Search</button> */}
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <RingLoader color="#36d7b7" size={120} />
          </div>
        ) : errorMessage ? (
          <p className="error">{errorMessage}</p>
        ) : getCurrentPageData().length === 0 ? (
          <p>No data available to display.</p>
        ) : (
          <>
            <table className="table">
              <thead>{getTableHeaders()}</thead>
              <tbody>
                {getCurrentPageData().map((row, index) => (
                  <tr key={index}>{getRowData(row)}</tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={previousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span className="page-number">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
