import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Button,
} from "@dhis2/ui-core";
import ReactPaginate from "react-js-pagination";
import { CircularProgress } from "@material-ui/core";
import classes from "./App.module.css";
import Modal from "./common/Modal/Modal";
import "./Pagination.css"; // Custom CSS file for pagination
import { OPDService } from "./Services/api";
import TBTreatmentCard from "./report/TBTreatmentCard";
import { downloadPDF } from "./export/export";

const Home = () => {
  const [options, setOptions] = useState([]);
  const [selectedProgramValue, setSelectedProgramValue] = useState("");
  const [event, setEvent] = useState([]);
  const [Data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [header1, setHeader1] = useState([]);
  const [result, setResult] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [show, setShow] = useState({ value: false, id: "" });
  const [showEventModal, setShowEventModal] = useState({ value: false });
  const [showTreatmentCardModal, setShowTreatmentCardModal] = useState({
    value: false,
  });
  const [eventData, setEventData] = useState([]);
  const [programStages, setProgramStages] = useState([]);
  const [dataElements, setDataElements] = useState([]);
  const [programName, setProgramName] = useState("");
  

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  const componentRef = useRef(null);
  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const tableToExcel = (function () {
    var uri = "data:application/vnd.ms-excel;base64,",
      template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)));
      },
      format = function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
          return c[p];
        });
      };
    return function (table, name, filename) {
      if (!table.nodeType) table = document.getElementById(table);

      var ctx = { worksheet: name || "Worksheet", table: table.innerHTML };
      document.getElementById("dlink").href =
        uri + base64(format(template, ctx));
      document.getElementById("dlink").download = `${name}.xls`;
      document.getElementById("dlink").click();
    };
  })();

  console.log("programStages>>>>>>>", programStages);
  console.log("eventData>>>>>", eventData);
  console.log("dataElements>>>>>>", dataElements);
  useEffect(() => {
    if (show.value == true) {
      fetchRecords();
    }
  }, [show]);
  useEffect(() => {
    fetchProgramOptions();
    fetchRecordsAll();
  }, []);
  useEffect(() => {
    tableDatafetch();

    tableHeaderDatafetch();
  }, [selectedProgramValue]);
  useEffect(() => {
    HeaderData(header1);
  }, [header1]);
  async function fetchRecordsAll() {
    const AllprogramStages = await OPDService.ProgramStages();
    const allDataElements = await OPDService.AllDataelement();
    setProgramStages(AllprogramStages);
    setDataElements(allDataElements);
  }
  async function fetchRecords() {
    const eventResponse = await OPDService.EventAPi(selectedProgramValue, show);

    setEventData(eventResponse);
  }
  async function fetchProgramOptions() {
    const programResponse = await OPDService.Programoptions();
    setOptions(programResponse?.listGrid?.rows);
  }
  async function tableDatafetch() {
    const allTableData = await OPDService.tableDataplot(selectedProgramValue);
    setEvent(allTableData?.trackedEntityInstances);
    setData(allTableData?.trackedEntityInstances?.length);
  }
  async function tableHeaderDatafetch() {
    const allTableHeaderData = await OPDService.tableHeaderData(
      selectedProgramValue
    );
    setHeader1(allTableHeaderData);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value to set the number of items per page

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // var val = () => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // //   const currentData = event(indexOfFirstItem, indexOfLastItem);
  // //  {console.log("currrrrrr",currentData)}
  //   if (event != undefined) {
  //     const v = event.map((ele, index) => {
  //      {console.log("777",ele)}
  //       if (ele) {
  //         var proId = ele.program;
  //         var name = [],
  //           attribute = [],
  //           // data = [],
  //           date = [];
  //           const data = ele.attributes;
  //           // setData(data.length)

  //         //date['value'] =  JSON.stringify(new Date(ele.eventDate)).slice(1,11);
  //         // date["value"] = ele.eventDate.substring(0, 10);

  //         // for (let program of options) {
  //         //   if (program.id == proId) {
  //         //     name["value"] = program.name;
  //         //   }
  //         // }

  //         // sashikat
  //         // for (let value of ele.attributes) {
  //         //   attribute["0"] = name;
  //         //   if (value.attribute == "oh9MPiyR2Vl") {
  //         //     attribute["1"] = value;
  //         //   }
  //         //   if (value.attribute == "HkdYrf7NPbr") {
  //         //     attribute["2"] = value;
  //         //   }
  //         //   if (value.attribute == "ssCmTkWjung") {
  //         //     attribute["3"] = value;
  //         //   }
  //         //   if (value.attribute == "hAfeN4FmzHa") {
  //         //     attribute["4"] = value;
  //         //   }

  //         // for(let i=0; i< atrribeyesArr.length; i++){
  //         //   attribute.push({i:atrribeyesArr[i]})
  //         // }

  //         // }
  //         // if (!attribute["1"]) {
  //         //   let data = [{ value: "" }];
  //         //   attribute["1"] = data;
  //         // }
  //         // if (!attribute["2"]) {
  //         //   let data = [{ value: "" }];
  //         //   attribute["2"] = data;
  //         // }
  //         // if (!attribute["3"]) {
  //         //   let data = [{ value: "" }];
  //         //   attribute["3"] = data;
  //         // }
  //         // if (!attribute["4"]) {
  //         //   let data = [{ value: "" }];
  //         //   attribute["4"] = data;
  //         // }

  //         console.log('data',data)
  //         // console.log("DATA",Data)
  //         return (
  //           <>
  //             {data.length ? (
  //               <TableRow>
  //                 {data.map((ele) => (
  //                   <>
  //                   <TableCell>{ele.value}</TableCell>

  //                   </>
  //                 ))}
  //                 {/* <Button primary={true} onClick={() => onEdit(ele.orgUnit, ele.event, ele.dataValues)}>Edit</Button> */}
  //               </TableRow>
  //             ) : (
  //               ""
  //             )}
  //           </>
  //         );
  //       }
  //     });
  //     return v;
  //   }
  // };

  // const val = () => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  //   if (event !== undefined) {
  //     const filteredData = event
  //       .filter((ele) => {
  //         return Object.keys(searchValues).every((attributeId) => {
  //           const searchValue = searchValues[attributeId];
  //           const attribute = ele.attributes.find(
  //             (attr) => attr.attribute === attributeId
  //           );
  //           return (
  //             !searchValue ||
  //             (attribute && attribute.value.includes(searchValue))
  //           );
  //         });
  //       })
  //       .slice(indexOfFirstItem, indexOfLastItem);

  //     return filteredData.map((ele, index) => (
  //       <TableRow key={index}>
  //         {ele.attributes.map((attr, attrIndex) => (
  //           <TableCell key={attrIndex}>{attr.value}</TableCell>
  //         ))}
  //       </TableRow>
  //     ));
  //   } else {
  //     return null; // Handle case where event is undefined or empty
  //   }
  // };
  const val = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    if (event !== undefined) {
      const filteredData = event
        .filter((ele) => {
          return Object.keys(searchValues).every((attributeId) => {
            const searchValue = searchValues[attributeId];
            const attribute = ele.attributes.find(
              (attr) => attr.attribute === attributeId
            );
            return (
              !searchValue ||
              (attribute && attribute.value.includes(searchValue))
            );
          });
        })
        .slice(indexOfFirstItem, indexOfLastItem);

      return filteredData.map((ele, index) => {
        return (
          <TableRow key={index} className={classes.zebraStriping}>
            {header1?.programTrackedEntityAttributes?.map((attribute) => {
              const foundAttribute = ele.attributes.find(
                (attr) =>
                  attr.attribute === attribute?.trackedEntityAttribute?.id
              );
              const TrackID = ele.trackedEntityInstance;

              return (
                <TableCell
                  key={attribute?.trackedEntityAttribute?.id}
                  className={classes.itemAlign}
                >
                  <div onClick={() => setShow({ value: true, id: TrackID })}>
                    {foundAttribute ? foundAttribute.value : ""}
                  </div>
                </TableCell>
              );
            })}
            <TableCell
              style={{ whiteSpace: "nowrap" }}
              className={classes.itemAlign}
            >
              <div>
                <button
                  onClick={() =>downloadPDF("printing")}
                  style={{ padding: "5px 10px", fontSize: "12px" }}
                >
                  Download
                </button>
              </div>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      return null;
    }
  };

  const handleSelectChange = (e) => {
    const selectedValue = JSON.parse(e.target.value);

    setSelectedProgramValue(selectedValue.id);
    setProgramName(selectedValue.name);
  };
  const handleSearchChange = (attributeId, value) => {
    setSearchValues((prevSearchValues) => ({
      ...prevSearchValues,
      [attributeId]: value,
    }));
  };

  function HeaderData(header1) {
    const Blank = [];

    if (header1?.programTrackedEntityAttributes !== undefined) {
      for (var j = 0; j < header1.programTrackedEntityAttributes.length; j++) {
        if (
          header1.programTrackedEntityAttributes[j]?.trackedEntityAttribute
            ?.attributeValues !== undefined
        ) {
          for (
            var k = 0;
            k <
            header1.programTrackedEntityAttributes[j].trackedEntityAttribute
              .attributeValues.length;
            k++
          ) {
            if (
              header1.programTrackedEntityAttributes[j].trackedEntityAttribute
                .attributeValues[k]?.attribute?.code === "showInConsent" &&
              header1.programTrackedEntityAttributes[j].trackedEntityAttribute
                .attributeValues[k]?.value === "true"
            ) {
              const customIDAttribute = {
                attribute:
                  header1.programTrackedEntityAttributes[j]
                    .trackedEntityAttribute.id,
                displayName:
                  header1.programTrackedEntityAttributes[j]
                    .trackedEntityAttribute.name,
                value: "",
              };

              Blank.push(customIDAttribute);
              setResult(Blank);
              console.log("getting the Blank array data", Blank);
              // If you want to continue checking other elements, remove the 'return' statement
              // return;
            }
          }
        }
      }
    }
  }

  const getNameProgameStage = (id) => {
    const programStage = programStages?.programStages?.find(
      (stage) => stage.id === id
    );
    return programStage ? programStage.name : "Unknown";
  };
  const getNameDataElement = (id) => {
    const dataelementName = dataElements?.dataElements?.find(
      (stage) => stage.id === id
    );
    return dataelementName ? dataelementName.name : "Unknown";
  };
  return (
    <>
      <div
        className={darkMode ? classes["dark-mode"] : classes["light-mode"]}
        style={{ overflow: "auto" }}
      >
        <div style={{ padding: "5px" }}>
          <div>
            {options.length > 0 && (
              <select onChange={handleSelectChange}>
                <option value="">Select Program for Event List</option>
                {options.map((option) => (
                  <option
                    key={option[0]}
                    value={JSON.stringify({ id: option[0], name: option[1] })}
                  >
                    {option[1]}
                  </option>
                ))}
              </select>
            )}
            <button onClick={toggleMode}>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => tableToExcel("report-table", "Timor Event List")}
            >
              Export Data
            </button>
          </div>
          <Modal
            show={show.value} onClose={() => setShow({ value: false })} 
          >
            <Table>
              <TableRow onClick={() => setShowEventModal({ value: true })} >
                <TableCell>Selected Program:</TableCell>
                <TableCell>{programName ? programName : ""}</TableCell>
              </TableRow>
              {eventData?.events?.map((event, index) => (
                <div>
                  <TableRow>
                    <TableCell>Program Stage:</TableCell>
                    <TableCell>
                      {getNameProgameStage(event?.programStage)}
                    </TableCell>
                  </TableRow>

                  <TableRow className={classes.zebraStriping}>
                    <TableCell>Event Date:</TableCell>
                    <TableCell>
                      {event.eventDate ? event.eventDate.split("T")[0] : ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status:</TableCell>
                    <TableCell>{event.status}</TableCell>
                  </TableRow>
                  {event?.dataValues?.length > 0 && (
                    <>
                      <span>DataElements</span>
                      <TableRow className={classes.zebraStriping}>
                        {event?.dataValues?.map((dataValue, idx) => (
                          <TableRow key={idx} className={classes.zebraStriping}>
                            <TableCell>
                              {getNameDataElement(dataValue?.dataElement)}:
                            </TableCell>
                            <TableCell> {dataValue.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableRow>
                    </>
                  )}
                </div>
              ))}
            </Table>
          </Modal>

          <div className={classes.desgin}>
            <a id="dlink"></a>
            <div id="report-table">
              <Table
                className={darkMode ? classes.darkTable : classes.lightTable}
              >
                <TableHead>
                  {header1?.programTrackedEntityAttributes?.length > 0 && (
                    <TableRow>
                      {header1?.programTrackedEntityAttributes?.map((ele) => (
                        <TableCell
                          key={ele?.trackedEntityAttribute?.id}
                          style={{ whiteSpace: "nowrap" }}
                          className={classes.itemAlign}
                        >
                          <b>{ele?.trackedEntityAttribute?.name}</b>
                        </TableCell>
                      ))}
                      <TableCell
                        style={{ whiteSpace: "nowrap" }}
                        className={classes.itemAlign}
                      >
                        <b>Download TB Treatment Card</b>
                      </TableCell>
                    </TableRow>
                  )}
                </TableHead>

                <TableBody>
                  {header1?.programTrackedEntityAttributes?.length > 0 && (
                    <TableRow>
                      {header1?.programTrackedEntityAttributes?.map((ele) => (
                        <TableCell
                          key={ele?.trackedEntityAttribute?.id}
                          style={{ whiteSpace: "nowrap" }}
                          className={
                            darkMode
                              ? `${classes.searchBackground} ${classes.itemAlign}`
                              : `${classes.itemAlign}`
                          }
                        >
                          <input
                            type="text"
                            placeholder={`Search ${ele?.trackedEntityAttribute?.name}`}
                            onChange={(e) =>
                              handleSearchChange(
                                ele?.trackedEntityAttribute?.id,
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  )}

                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          header1?.programTrackedEntityAttributes?.length + 1
                        }
                        style={{ textAlign: "center" }}
                      >
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {val && val()?.length > 0 ? val() : null}

                      <Modal
                        // show={show.value && show.id === "modal2"}
                        // onClose={() => setShow({ value: false })}
                        show={showTreatmentCardModal.value}
                        onClose={() =>
                          setShowTreatmentCardModal({ value: false })
                        }
                      >
                        <TBTreatmentCard />
                      </Modal>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>

            <ReactPaginate
              activePage={currentPage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={Data}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
