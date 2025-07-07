import React, { useEffect, useState } from "react";

// import { fetchDeathRecords } from "../API/DeathAPI";
import styles from '../App.module.css';
import { fetchDeathCertficateRecords } from "../API/DeathCertAPI";
import { useNavigate } from "react-router-dom";
import { TablePagination } from "@mui/material";

function DeathRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deathRecords, setDeathRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const[rowsPerPage, setRowsPerPage] = useState(3);
  const navigate = useNavigate();


  useEffect(() => {
    setLoading(true);
          fetchDeathCertficateRecords()
          .then(data => {      
           const headers = data.headers.map(h => h.name);
           const records = data.rows.map( row => 
              Object.fromEntries(row.map((value, i) => [headers[i], value]))
         );
            setDeathRecords(records);
          })
          .catch(data => setDeathRecords([]))
          .finally(() => setLoading(false));
    
  }, [])

  const filteredRecords = deathRecords.filter((r) =>
   (r["FL9N3yXzucT.aTbE3kYe98D"] || "").includes(searchQuery.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
  )

  const handlePageChange = (event, newPage) => {
      setPage(newPage);
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
  }


  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <h3> Death Certificate Records</h3>
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
              <th>Date of Reporting</th>
              <th>Date of Death</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Permanent Address</th>
              <th>Cause of Death</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record, index) => (
              <tr key={index}>
                {/* <td>{new Date().toLocaleDateString()}</td> */}
                 {/* date of report*/} <td>{record?.["FL9N3yXzucT.jGGNvNYhu47"] || ""}</td>    
              {/* date of death*/} <td>{record?.["FL9N3yXzucT.jGGNvNYhu47"] || ""}</td>
                {/* Name */} <td>{record?.["FL9N3yXzucT.aTbE3kYe98D"] || ""}</td>
              {/* gender */} <td>{record?.["FL9N3yXzucT.wxrDsUO1ELy"] || ""}</td>
                 {/* age */} <td>{record?.["FL9N3yXzucT.KFGxB6wpRxi"] || ""}</td>
               {/*permanent address */} <td>{record?.["FL9N3yXzucT.iXXvJAxbOtd"] || ""}</td>
                {/* cause of death */} <td>{record?.["FL9N3yXzucT.XXDApzQFycS"] || ""}</td>
                 <td>
                  <button className="button" onClick={() => navigate('/death-certificate', {state: {record}})}>
                    ⬇️ Generate Certificate </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination 
         component="div"
         count={filteredRecords.length}
         page={page}
         onPageChange={handlePageChange}
         rowsPerPage={rowsPerPage}
         onRowsPerPageChange={handleChangeRowsPerPage}
         
        
        />
      </div>
    </div>
  );
}

export default DeathRecords;