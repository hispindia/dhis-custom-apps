// import React, { useEffect, useState } from "react";
// import "./styles.scss"; // Make sure you have your styles in this file
// import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up
// import "bootstrap-icons/font/bootstrap-icons.css";

// const Home = () => {
 
//   const [data, setData] = useState(null); // Don't initialize data as an empty string, use `null` instead
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false); // Loading state to handle async calls
//   const [allIndicators, setAllIndicators] = useState();
//   const [programindicator, setProgramindicator] = useState("");// Used for All Data elements Name and Id 
//   const [dataelement, setDataelement] = useState("");// Used for All Data elements Name and Id 

//   // Fetch TEI by QR Code
//   const fetchAllIndicators = async () => {
//     setLoading(true);
//     setErrorMessage("");
//     try {
//       const response = await ApiService.getAllIndicators();
//       if (response) {
//         setAllIndicators(response)
//       } else {
//         setErrorMessage("No trackedEntityInstances found for this QR Code.");
//         setData(null);
//       }
//     } catch (error) {
//       setErrorMessage("Error fetching TEI by QR Code.");
//       setData(null);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchAllDataElements = async () => {
   
//     try {
//       const response = await ApiService.getAllDataElements();
//       if (response) {
//         setDataelement(response)
//       } else {
//         setErrorMessage("No trackedEntityInstances found for this QR Code.");
      
//       }
//     } catch (error) {
//       setErrorMessage("Error fetching TEI by QR Code.");
     
//     } finally {
     
//     }
//   };
//   const fetchProgramIndicators = async () => {
   
//     try {
//       const response = await ApiService.getProgramIndicators();
//       if (response) {
//         setProgramindicator(response)
//       } else {
//         setErrorMessage("No trackedEntityInstances found for this QR Code.");
      
//       }
//     } catch (error) {
//       setErrorMessage("Error fetching TEI by QR Code.");
     
//     } finally {
     
//     }
//   };
// useEffect(()=>{
//   fetchAllIndicators();
//   fetchAllDataElements();
//   fetchProgramIndicators();
// },[]);


// const [searchTerm, setSearchTerm] = useState("");

// // Sample data for dynamic rendering
// const indicators = [
//   {
//     id: 1,
//     title: "1st 90- 90% of all PLHIV will have been diagnosed (0-12 months)",
//     description: "It is measured by HIV- Alive PLHIV (0-12 months) to Estimated infants living with HIV (0-12 months)",
//     createdOn: "Feb 2, 2022",
//   },
//   {
//     id: 2,
//     title: "1st 90- 90% of all PLHIV will have been diagnosed (<=14 years)",
//     description: "It is measured by HIV- Alive PLHIV (<=14 years) to Estimated children living with HIV (<=14 years)",
//     createdOn: "Feb 2, 2022",
//   },
//   {
//     id: 3,
//     title: "1st 90- 90% of all PLHIV will have been diagnosed (15-24 years)",
//     description: "It is measured by HIV- Alive PLHIV (15-24 years) to Estimated young people living with HIV (15-24 years)",
//     createdOn: "Feb 2, 2022",
//   },
//   // Add more indicators as needed
// ];

// // Filtered data based on search term
// const filteredIndicators = indicators.filter((indicator) =>
//   indicator.title.toLowerCase().includes(searchTerm.toLowerCase())
// );
// console.log("allIndicators==========",allIndicators)
//   return (
//     <>
//        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//       <h1>Indicator Dictionary</h1>
//       <div style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           placeholder="Search indicator"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             padding: "10px",
//             width: "100%",
//             maxWidth: "500px",
//             border: "1px solid #ccc",
//             borderRadius: "4px",
//           }}
//         />
//       </div>
//       <div>
//         <h2>{filteredIndicators.length} indicators</h2>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginTop: "10px",
//           }}
//         >
//           <thead>
//             <tr>
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "10px",
//                   borderBottom: "2px solid #ccc",
//                 }}
//               >
//                 Title
//               </th>
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "10px",
//                   borderBottom: "2px solid #ccc",
//                 }}
//               >
//                 Description
//               </th>
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "10px",
//                   borderBottom: "2px solid #ccc",
//                 }}
//               >
//                 Created On
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredIndicators.map((indicator) => (
//               <tr key={indicator.id}>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                   {indicator.title}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                   {indicator.description}
//                 </td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
//                   {indicator.createdOn}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>

//     </>
//   );
// };

// export default Home;



import React, { useState,useEffect } from 'react';
import "./styles.scss"; // Make sure you have your styles in this file
import { ApiService } from "../../services/apiService"; // Ensure your ApiService is correctly set up


const Home = () => {
    const [activeTab, setActiveTab] = useState('Indicators');
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState([
      {
          indicator: '1st 90- 90% of all PLHIV will have been diagnosed (0-12 months)',
          measurement: 'It is measured by HIV- Alive PLHIV (0-12 months)...',
          createdOn: 'Feb 2, 2022'
      },
      {
          indicator: '1st 90- 90% of all PLHIV will have been diagnosed (<=14 years)',
          measurement: 'It is measured by HIV- Alive PLHIV (<=14 years)...',
          createdOn: 'Feb 2, 2022'
      }
  ]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loading state to handle async calls
    const [allIndicators, setAllIndicators] = useState();
    const [programindicator, setProgramindicator] = useState("");// Used for All Data elements Name and Id 
    const [dataelement, setDataelement] = useState("");// Used for All Data elements Name and Id 
  
    // Fetch TEI by QR Code
    const fetchAllIndicators = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await ApiService.getAllIndicators();
        if (response) {
          setAllIndicators(response)
        } else {
          setErrorMessage("No trackedEntityInstances found for this QR Code.");
         
        }
      } catch (error) {
        setErrorMessage("Error fetching TEI by QR Code.");
       
      } finally {
        setLoading(false);
      }
    };
    const fetchAllDataElements = async () => {
     
      try {
        const response = await ApiService.getAllDataElements();
        if (response) {
          setDataelement(response)
        } else {
          setErrorMessage("No trackedEntityInstances found for this QR Code.");
        
        }
      } catch (error) {
        setErrorMessage("Error fetching TEI by QR Code.");
       
      } finally {
       
      }
    };
    const fetchProgramIndicators = async () => {
     
      try {
        const response = await ApiService.getProgramIndicators();
        if (response) {
          setProgramindicator(response)
        } else {
          setErrorMessage("No trackedEntityInstances found for this QR Code.");
        
        }
      } catch (error) {
        setErrorMessage("Error fetching TEI by QR Code.");
       
      } finally {
       
      }
    };
  useEffect(()=>{
    fetchAllIndicators();
    fetchAllDataElements();
    fetchProgramIndicators();
  },[]);
  
  
console.log("allIndicators========",allIndicators)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleTabChange = (tab) => {
      setActiveTab(tab);
      // Fetch data based on tab selection (Indicators or Program Indicators)
      console.log(`Switched to ${tab}`);
  };

  const handleSearch = () => {
      console.log(`Searching for: ${searchQuery}`);
      // Implement search logic here
  };

  const previousPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  const nextPage = () => {
      if (currentPage < Math.ceil(data.length / itemsPerPage)) {
          setCurrentPage(currentPage + 1);
      }
  };

  const getCurrentPageData = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return data.slice(startIndex, endIndex);
  };



    return (
        <div className="app">
            <div className="header">
                <h1>Indicator Dictionary</h1>
                <button className="download-button">Download</button>
            </div>

            <div className="content">
                <div className="controls">
                    <button 
                        className={activeTab === 'Indicators' ? 'active' : ''} 
                        onClick={() => handleTabChange('Indicators')}
                    >
                        Indicators
                    </button>
                    <button 
                        className={activeTab === 'Program Indicators' ? 'active' : ''} 
                        onClick={() => handleTabChange('Program Indicators')}
                    >
                        Program Indicators
                    </button>

                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            placeholder="Search indicator" 
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Indicator</th>
                            <th>Measurement</th>
                            <th>Created On</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {getCurrentPageData().map((row, index) => (
                            <tr key={index}>
                                <td>{row.indicator}</td>
                                <td>{row.measurement}</td>
                                <td>{row.createdOn}</td>
                            </tr>
                        ))}
                    </tbody> */}
                </table>

                <div className="pagination">
                    <button onClick={previousPage}>Previous</button>
                    <span className="page-number">Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}</span>
                    <button onClick={nextPage}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
