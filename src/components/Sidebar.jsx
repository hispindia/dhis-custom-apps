
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import TreeNode from "./TreeNode";
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { fetchOrgUnits } from "../API/OrganizationAPI";

const Sidebar = ({setOrgUnit, userOrgunit, orgUnits}) => {

    const[selectedOrgUnitId, setSelectedOrgUnitId] = useState(null);
    const[selectedTab, setSelectedTab] = useState(null);


    useEffect(() => {

      fetchOrgUnits().then(setOrgUnit);

    }, []);

  
   return (
    <div className={styles.sidebar}>
      <div className="card">
        {/* <h3>🔍 Search Records</h3> */}
        <Link to="/birth"
         className="button" 
         style={{
           marginBottom: "0.5rem", 
           display: "block", 
           backgroundColor: selectedTab === "birth" ? "#e0f7fa":"transparent",
           borderRadius: "4px",
           padding: "6px 10px",
           transition: "background-color 0.3s ease",
           border: selectedTab === "birth" ? "1px solid green" : "",
           textDecoration: "none",
           }}
            onClick={() => setSelectedTab("birth")}
           >
          Birth Records
        </Link>


        <Link to="/death"
         className="button"
        style={{ 
          display: "block",
          backgroundColor: selectedTab === "death" ? "#e0f7fa":"transparent",
          borderRadius: "4px",
          padding: "6px 10px",
          transition: "background-color 0.3s ease",
          border: selectedTab === "death" ? "1px solid green": "", 
          textDecoration: "none",   
          }}
          onClick={() => setSelectedTab("death")}
          >
          Death Records
        </Link> 
      </div>
      <div className="card">
        <h3>📁 Organization Unit Hierarchy</h3>
        <div id="orgTree" style={{overflow:"auto",height:"300px"}}>
         {
         userOrgunit ? 
        <TreeNode 
        node={userOrgunit}
        orgUnits={orgUnits} 
        setOrgUnit={setOrgUnit}
        selectedOrgUnitId={selectedOrgUnitId}
        setSelectedOrgUnitId={setSelectedOrgUnitId}
      />
         : <p>Loading..</p>
         }
        </div>
      </div>
      </div>
  );
}

export default Sidebar

