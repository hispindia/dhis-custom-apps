
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import TreeNode from "./TreeNode";
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { fetchOrgUnits } from "../API/OrganizationAPI";

const Sidebar = ({setOrgUnit, userOrgunit, orgUnits}) => {

  
   return (
    <div className={styles.sidebar}>
      <div className="card">
        <h3>🔍 Search Records</h3>
        <Link to="/birth" className="button" style={{ marginBottom: "0.5rem", display: "block" }}>
          Birth Records
        </Link>
        <Link to="/death" className="button" style={{ display: "block" }}>
          Death Records
        </Link> 
      </div>
      <div className="card">
        <h3>📁 Organization Unit Hierarchy</h3>
        <div id="orgTree">
         {
         userOrgunit ? <TreeNode node={userOrgunit} orgUnits={orgUnits} setOrgUnit={setOrgUnit} /> : <p>Loading..</p>
         }
        </div>
      </div>
      </div>
  );
}

export default Sidebar

