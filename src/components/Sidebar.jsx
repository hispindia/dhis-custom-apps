
import React from "react";
// import { Link } from "react-router-dom";
import TreeNode from "./TreeNode";
import { Link } from 'react-router-dom';
import styles from '../App.module.css';

const orgUnits = {
  name: "National Health System",
  children: [
    { name: "Central Region" },
    { name: "Northern Region" },
    { name: "Southern Region" },
  ],
};

const Sidebar = () => {
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
          <TreeNode node={orgUnits} />
        </div>
      </div>
    </div>
  );
}

export default Sidebar

