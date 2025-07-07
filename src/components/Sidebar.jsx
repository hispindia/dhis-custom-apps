
import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import TreeNode from "./TreeNode";
import { Link } from 'react-router-dom';
import styles from '../App.module.css';
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { fetchOrgUnits } from "../API/OrganizationAPI";

const orgUnits = {
  name: "National Health System",
  children: [
    { name: "Central Region" },
    { name: "Northern Region" },
    { name: "Southern Region" },
  ],
};

const Sidebar = () => {

    const[mynamarNode, setMyanmarNode] = useState(null);
    const [orgUnits, setOrgUnits] = useState([])

    useEffect(()=> {
      const getOrgData = async() => {
        try {
          const allOrgUnit = await fetchOrgUnits();
          const mynamar = allOrgUnit.find(unit => unit.name === "Myanmar");
            console.log(allOrgUnit.map(u => u.name))
            setMyanmarNode(mynamar);
            setOrgUnits(allOrgUnit)
        } catch (error) {
          console.log("Error while fetching data");
        }
      }

      getOrgData();
    }, [])

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
         {mynamarNode ? <TreeNode node={mynamarNode} orgUnits={orgUnits} /> : <p>Loading..</p>
         
         }
       
         

        </div>
      </div>
      </div>
  );
}

export default Sidebar

