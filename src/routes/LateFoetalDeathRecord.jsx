import { useEffect, useState } from "react";
import styles from '../App.module.css';
import { useNavigate } from "react-router-dom";
import api from '../api';
import { TablePagination, TextField } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from "react-i18next";

const LateFoetalDeathRecord = ({orgUnit, status}) => {

  const [certificate, setCertificate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showField, setShowField] = useState(null);
  const { i18n } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if(!orgUnit || !status) return;
      setLoading(true);
      api.fetchEvents([`program=cUjoGJK4gPL`, `orgUnit=${orgUnit.id}`, `filter=seXQ3F3kY3x:eq:${status}`], {})
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
        setCertificate([])
        console.log(_err);
       })
       .finally(() => setLoading(false));

    }
      fetchEvents();
   }, [orgUnit, status]);

  const [filters, setFilters] = useState({
      dob: "",
      gender: "",
      mothersName: "",
      fathersName: "",
      fatherNRC: "",
      motherNRC: ""
    });

      const FIELD_KEYS = {
      dob: "zAetLzp3cT1",
      gender: "wxrDsUO1ELy",
      mothersName: "UYmZMZt32hZ",
      fathersName: "RKs8td9BnNj",
      fatherNRC: "Fwa7gEzjZAH",
      motherNRC: "M8pvzjPdija"

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
      };


       const filteredRecords = certificate.filter((record) => {
     
     return (      
          // earlier it is not working because if any field field record[field_keys.dob] may be undefine
          (record[FIELD_KEYS.dob ]|| "").toLowerCase().includes(filters.dob.toLowerCase()) &&
          (record[FIELD_KEYS.gender] || "").toLowerCase().includes(filters.gender.toLowerCase()) &&
          (record[FIELD_KEYS.mothersName] || "").toLowerCase().includes(filters.mothersName.toLowerCase()) &&
          (record[FIELD_KEYS.fathersName] || "").toLowerCase().includes(filters.fathersName.toLowerCase()) &&
          (record[FIELD_KEYS.fatherNRC] || "").toLowerCase().includes(filters.fatherNRC.toLowerCase()) && 
          (record[FIELD_KEYS.motherNRC] || "").toLowerCase().includes(filters.motherNRC.toLowerCase()) 
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
 
  if(loading) return <div className={`${styles.card} ${styles.main}`}>Loading...</div>

  return (
    <>
      <div className={`${styles.card} ${styles.main}`}>
        <h3>Still Birth Certificate Records</h3>
        
      <table>
      <thead>
      <tr>
      <th>{renderFilterField("dob", "Date of Birth")}</th>
      <th>{renderFilterField("gender", "Gender")}</th>
      <th>{renderFilterField("mothersName", "Mother Name")}</th>
      <th>{renderFilterField("fathersName", "Father Name")}</th>
      <th>{renderFilterField("fatherNRC", "Father NRC (Full)")}</th>
      <th>{renderFilterField("motherNRC", "Mother NRC (Full)")}</th>
      <th></th>
    </tr>
           
          </thead>
          <tbody>
            {paginatedRecords.map((record, index) => (
              <tr key={index}>
                <td>{record?.["zAetLzp3cT1"] || ""}</td> { /* dob */}
                <td>{record?.["wxrDsUO1ELy"] || ""}</td> { /* gender */}
                <td>{record?.["UYmZMZt32hZ"] || ""}</td> { /* Mothers Name */}
                <td>{record?.["RKs8td9BnNj"] || ""}</td>   { /* Fathers Name */}
                <td>{record?.["Fwa7gEzjZAH"] || ""}</td>    { /* Fathers NRC */}
                <td>{record?.["M8pvzjPdija"] || ""}</td>    { /* MOTHER NRC */}
                <td>
                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <i>Generate Certificate</i>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{ width: "60px", height: "28px", background: "#BFF4B", border:"1px solid green", borderRadius: "10%" }}
                      onClick={() => {
                        navigate({pathname: "/late-Foetal-death-certificate", search: `?stillbirth=${record.event}`})
                        i18n.changeLanguage('br');
                      }}
                    >
                      Bur
                    </button>
                    <button
                      style={{ width: "60px", height: "28px",background: "#ADD8E6", border:"1px solid green", borderRadius: "10%" }}
                      onClick={() => {
                        navigate({pathname: "/late-Foetal-death-certificate", search: `?stillbirth=${record.event}`})
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
    </>
  );
}

export default  LateFoetalDeathRecord;