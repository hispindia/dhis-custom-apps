import React, { useState, useEffect } from "react";
import "./styles.scss"; // Ensure your styles are correctly set up
import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up
import "bootstrap-icons/font/bootstrap-icons.css";
import { RingLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import { setState } from "../../store/main/main.action";

const ProgramRules = () => {
  const [activeTab, setActiveTab] = useState("Indicators");
  const [searchQuery, setSearchQuery] = useState("");
  const [programrules, setProgramrules] = useState();
  const dispatch = useDispatch();

  const fetchProgramRules = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await ApiService.getProgramRules();
      if (response && response.programRules && response.programRules.length > 0) {
        setProgramrules(response.programRules); // Populate state with data
       
      } else {
        setErrorMessage("No indicators found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching indicators.");
    } finally {
      setLoading(false);
    }
  };
//==========================
 
 

  useEffect(() => {
    fetchProgramRules();
    
  }, []);
 

  

 


  



  
   



  

  // Get the current page's data based on the active tab and selectedGroupIndicator
  const getCurrentPageData = () => {
   {
      // when selectedGroupIndicator is selected then get the filterObjects data
      const data =
        activeTab === "ProgramRules" ? programrules : '';
      // const data = activeTab === "Indicators" ? allIndicators : allProgramIndicators;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
    } 
  }; // this function will display the row in the table

  // Calculate the total number of pages based on the active tab

  const totalPages = Math.ceil(
 activeTab === "ProgramRules" ? programrules.length / itemsPerPage : ""
     
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
    if(activeTab === "ProgramRules"){
      navigate(`/IndicatorDetails/${id}`);
    }
    else{
      navigate(`/ProgramIndicatorDetails/${id}`); 
    }
   
  };

  // Get table headers and row data dynamically based on the active tab
  const getTableHeaders = () => {
    if (activeTab === "ProgramRules") {
      return (
        <tr>
          <th>ID</th>
          <th>Name</th>
          
        </tr>
      );
    }
  };

  const getRowData = (row) => {
    if (activeTab === "ProgramRules") {
      return (
        <>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.id || "N/A"}</td>
          <td onClick={() => handleRowClick(row?.id)} style={{ cursor: 'pointer', }}>{row?.displayShortName || "N/A"}</td>
         
        
        </>
      );
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

export default ProgramRules;
