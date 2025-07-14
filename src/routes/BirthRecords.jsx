  import React, { useEffect, useState } from "react";
  import styles from '../App.module.css';
  // import { fetchBirthRecords } from "../API/BirthAPI";
  import { useNavigate } from "react-router-dom";
  import { fetchBirthCertificateRecords } from "../API/BirthCertAPI";
  import { TablePagination, TextField } from "@mui/material";
  import MoreVertIcon from '@mui/icons-material/MoreVert';

  const BirthRecords = ({orgUnit}) => {

  
    const [certificate, setCertificate] = useState([]);
    const [loading, setLoading] = useState(false);
    const[page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const[showField, setShowField] = useState(null);

    const [filters, setFilters] = useState({
      infantName: "",
      dob: "",
      gender: "",
      mothersName: "",
      fathersName: ""
    });

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

      const FIELD_KEYS = {
      infantName: "EUfz92HiiVD.R43kdns3YYL",
      dob: "eventdate",
      gender: "EUfz92HiiVD.wxrDsUO1ELy",
      mothersName: "EUfz92HiiVD.UYmZMZt32hZ",
      fathersName: "EUfz92HiiVD.RKs8td9BnNj"

    }

    

    const renderFilterField = (fieldKey, label) => {
    return (
      <div style={{ minWidth: "140px" }}>
        {showField === fieldKey ? (
          <TextField
            label={label}
            size="small"
            value={filters[fieldKey]}
            onChange={(e) => handleFilterChange(fieldKey, e.target.value)}
            //hiding when focus is lost
            onBlur={() => setShowField(null)} 
            autoFocus
          />
        ) : (
          <div
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            onClick={() => setShowField(fieldKey)}
          >
            <span style={{ fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: "20px" }}>{<MoreVertIcon />}</span>
          </div>
        )}
      </div>
    );
  };



    const filteredRecords = certificate.filter((record) => {
      return (
          record[FIELD_KEYS.infantName]?.toLowerCase().includes(filters.infantName.toLowerCase()) &&
          record[FIELD_KEYS.dob]?.toLowerCase().includes(filters.dob.toLowerCase()) &&
          record[FIELD_KEYS.gender]?.toLowerCase().includes(filters.gender.toLowerCase()) &&
          record[FIELD_KEYS.mothersName]?.toLowerCase().includes(filters.mothersName.toLowerCase()) &&
          record[FIELD_KEYS.fathersName]?.toLowerCase().includes(filters.fathersName.toLowerCase())
      );
    })



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

    
    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
          ...prev, 
          [field]:value
        }));
    }
    

  

    if(loading) return <div>Loading...</div>

    return (
      <div className={styles.main}>
        <div className={styles.card}>
          <h3> Birth Certificate Records</h3>
        
          <table>
  <thead>
   
    <tr>
      <th>{renderFilterField("infantName", "Infant Name")}</th>
      <th>{renderFilterField("dob", "Date of Birth")}</th>
      <th>{renderFilterField("gender", "Gender")}</th>
      <th>{renderFilterField("mothersName", "Mother Name")}</th>
      <th>{renderFilterField("fathersName", "Father Name")}</th>
      <th></th>
    </tr>
  </thead>

  <tbody>
    {filteredRecords.map((record, index) => (
      <tr key={index}>
        <td>{record?.["EUfz92HiiVD.R43kdns3YYL"] || ""}</td>
        <td>{record?.["eventdate"] ? record["eventdate"].split(" ")[0] : ""}</td>
        <td>{record?.["EUfz92HiiVD.wxrDsUO1ELy"] || ""}</td>
        <td>{record?.["EUfz92HiiVD.UYmZMZt32hZ"] || ""}</td>
        <td>{record?.["EUfz92HiiVD.RKs8td9BnNj"] || ""}</td>
        <td>
          <button
            className="button"
            onClick={() =>
              navigate("/birth-certificate", { state: { record } })
            }
          >
            ⬇️ Generate Certificate
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


          {/* pagination */}
          <TablePagination 
              component="div"
              count={certificate.length}
              page={paginatedRecords}
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