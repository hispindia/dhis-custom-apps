import React, { useEffect, useState } from "react";
import styles from '../App.module.css';
// import { fetchBirthRecords } from "../API/BirthAPI";
import { useNavigate } from "react-router-dom";
import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
import { TablePagination } from "@mui/material";

function BirthRecords({orgUnit}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [certificate, setCertificate] = useState([]);
  const [loading, setLoading] = useState(false);
  const[page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();


  useEffect(() => {
     setLoading(true);
      fetchBirthCertificateRecords(orgUnit.id)
       .then(data => {      
        const headers = data.headers.map(h => h.name);
        const records = data.rows.map( row => 
           Object.fromEntries(row.map((value, i) => [headers[i], value]))
      );
         setCertificate(records);
       })
       .catch(data => setCertificate([]))
       .finally(() => setLoading(false));
 
   }, [orgUnit]);


  const filteredRecords = certificate.filter((r) =>
    (r["EUfz92HiiVD.R43kdns3YYL"] || "").toLowerCase().includes(searchQuery.toLowerCase())
  );



//showing only first 10 records
  const paginatedRecords = filteredRecords.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
  )

//update page change 
   const handleChangePage = (event, newPage) => {
        setPage(newPage);
   }

   const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   }
  

 

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
            {paginatedRecords.map((record, index) => (
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

        {/* pagination */}
        <TablePagination 
            component="div"
            count={filteredRecords.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOption={[5, 10, 25, 50, 100]}
        />


        
      </div>
    </div>
  );
}

export default BirthRecords;