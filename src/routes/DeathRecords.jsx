import { useEffect, useState } from "react";
import styles from '../App.module.css';
import api from '../api';
import { useNavigate } from "react-router-dom";
import { TablePagination, TextField } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from "react-i18next";

const DeathRecords = ({orgUnit, dataElements}) => {
  
  const [certificate, setCertificate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showField, setShowField] = useState(null);

  const { i18n } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if(!orgUnit) return;
      setLoading(true);

      return await api.fetchEvents([`program=TXuxHniKS6l`, `orgUnit=${orgUnit.id}`])
          .then(res => {     
            const records = res.events.map(event => {
            const record = {
                event: event.event,
                orgUnit: event.orgUnit,
                program: event.program,
                programStage: event.programStage,
                occurredAt: event.occurredAt.split("T")[0] || "", 
              };
              event.dataValues.forEach(dv => {
                record[dv.dataElement] = dv.value;
              });
            return record;
            })
            setCertificate(records);
          })
          .catch((_err) => {
            setCertificate([]);
            console.log(_err)
          })
          .finally(() => setLoading(false));
    }

    fetchEvents();
    
  }, [orgUnit])
  
  const [filters, setFilters] = useState({
          dateOfReporting: "",
          dateOfDeath: "",
          name: "",
          gender: "",
          age: "",
          nrcFull: "",
          permanentAddress: "",
          causeOfDeath: ""
  })

    const FIELD_KEYS = {
      dateOfReporting: "jGGNvNYhu47",
      dateOfDeath: "jGGNvNYhu47",
      name: "aTbE3kYe98D",
      gender: "wxrDsUO1ELy",
      age: "KFGxB6wpRxi",
      nrcFull: "wCN9fWzFtKE", 
      permanentAddress: "iXXvJAxbOtd",
      causeOfDeath: "XXDApzQFycS"

    }
    const renderFilterField = (fieldKey, label) => {
    return (
      <div>
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
  }


   const filteredRecords = certificate.filter((record) => {
     
     return (      
          (record[FIELD_KEYS.dateOfReporting] || "").toLowerCase().includes(filters.dateOfReporting.toLowerCase()) &&
          // earlier it is not working because if any field field record[field_keys.dob] may be undefine
          (record[FIELD_KEYS.dateOfDeath ]|| "").toLowerCase().includes(filters.dateOfDeath.toLowerCase()) &&
          (record[FIELD_KEYS.name] || "").toLowerCase().includes(filters.name.toLowerCase()) &&
          (record[FIELD_KEYS.gender] || "").toLowerCase().includes(filters.gender.toLowerCase()) &&
          (record[FIELD_KEYS.age] || "").toLowerCase().includes(filters.age.toLowerCase()) &&
          (record[FIELD_KEYS.nrcFull] || "").toLowerCase().includes(filters.nrcFull.toLowerCase()) &&
          (record[FIELD_KEYS.permanentAddress] || "").toLowerCase().includes(filters.permanentAddress.toLowerCase()) && 
          (record[FIELD_KEYS.causeOfDeath] || "").toLowerCase().includes(filters.causeOfDeath.toLowerCase())
      );
    })

  

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

   const handleFilterChange = (field, value) => {
        setFilters((prev) => ({
          ...prev, 
          [field]:value
        }));
    }

  if(loading) return <div className={`${styles.card} ${styles.main}`}> Loading... </div>

  return (
     <div className={`${styles.card} ${styles.main}`}>
        <h3> Death Certificate Records</h3>
      
    <table>
    <thead>
    <tr>
      <th>{renderFilterField("dateOfReporting", "Date of Reporting")}</th>
      <th>{renderFilterField("dateOfDeath", "Date of Death")}</th>
      <th>{renderFilterField("name", "Name")}</th>
      <th>{renderFilterField("gender", "Gender")}</th>
      <th>{renderFilterField("age", "Age")}</th>
      <th>{renderFilterField("nrcFull", "NRC (Full)")}</th>
      <th>{renderFilterField("permanentAddress", "Permanent Address")}</th>
      <th>{renderFilterField("causeOfDeath", "Cause of Death")}</th>
      <th></th>
    </tr>


  </thead>
          <tbody>
            {paginatedRecords.map((record, index) => (
              <tr key={index}>
               
              <td>{typeof record["jGGNvNYhu47"] === "string" ? record["jGGNvNYhu47"].split(" ")[0]: ""}</td>     {/* date of report*/}
              <td>{typeof record["jGGNvNYhu47"] === "string" ? record["jGGNvNYhu47"].split(" ")[0]: ""}</td>  {/* date of death*/}
              <td>{record["aTbE3kYe98D"] || ""}</td>  {/* name */}
              <td>{record["wxrDsUO1ELy"] || ""}</td>  {/* gender*/}
              <td>{record["KFGxB6wpRxi"] || ""}</td>  {/* age */}
              <td>{record["wCN9fWzFtKE"] || ""}</td>  {/* nrc full =*/}
              <td>{record["iXXvJAxbOtd"] || ""}</td>  {/*permanent address */} 
              <td>{(dataElements['nQy5xQrOMXj'] && dataElements['nQy5xQrOMXj'][record["nQy5xQrOMXj"]]) ? dataElements['nQy5xQrOMXj'][record["nQy5xQrOMXj"]] : ""}</td>   {/* cause of death */} 
                 <td>
                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <i>Generate Certificate</i>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{ width: "60px", height: "28px", background: "#BFF4B", border:"1px solid green", borderRadius: "10%" }}
                      onClick={() => {
                          navigate({pathname: "/death-certificate", search: `?death=${record.event}`})
                        i18n.changeLanguage('br');
                      }}
                    >
                      Bur
                    </button>
                    <button
                      style={{ width: "60px", height: "28px",background: "#ADD8E6", border:"1px solid green", borderRadius: "10%" }}
                      onClick={() => {
                        navigate({pathname: "/death-certificate", search: `?death=${record.event}`})
                        i18n.changeLanguage('en');
                      }}
                    >
                   En
      </button>
    </div>
            </div>
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
        rowsPerPageOption={[5, 10, 25, 50, 100]}
         
        
        />
      </div>
  );
}

export default DeathRecords;