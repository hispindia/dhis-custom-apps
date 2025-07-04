import React, { useEffect, useState } from "react";
import styles from '../App.module.css';
// import { fetchBirthRecords } from "../API/BirthAPI";
import { useNavigate } from "react-router-dom";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";

function BirthRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [certificate, setCertificate] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
     setLoading(true);
      fetchBirthCertificateRecords()
       .then(data => {      
        const headers = data.headers.map(h => h.name);
        const records = data.rows.map( row => 
           Object.fromEntries(row.map((value, i) => [headers[i], value]))
      );
         setCertificate(records);
       })
       .catch(data => setCertificate([]))
       .finally(() => setLoading(false));
 
   }, []);


  const filteredRecords = certificate.filter((r) =>
    (r["EUfz92HiiVD.R43kdns3YYL"] || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

 

  if(loading) return <div>Loading...</div>

  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h3> Birth Certificate Records</h3>
        <input
          type="text"
          placeholder="Search records..."
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Infant Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Mother Name</th>
              <th>Father Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record?.["EUfz92HiiVD.R43kdns3YYL"] || ""}</td> { /* infant name */}
                <td>{record?.["eventdate"] ? record["eventdate"].split(" ")[0]: ""}</td> { /* dob */}
                <td>{record?.["EUfz92HiiVD.wxrDsUO1ELy"] || ""}</td> { /* gender */}
                <td>{record?.["EUfz92HiiVD.UYmZMZt32hZ"] || ""}</td> { /* Mothers Name */}
                <td>{record?.["EUfz92HiiVD.RKs8td9BnNj"] || ""}</td>   { /* Fathers Name */}
                <td>
                  <button className="button" onClick={() => navigate('/birth-certificate', {state: {record}})}>
                    ⬇️ Generate Certificate </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BirthRecords;