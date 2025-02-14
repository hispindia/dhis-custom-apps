import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { hospitalLogo, hospitalSymbal } from "../images";
import { OPDService } from "../Services/api";

const TbTreatmentCard = ({ selectedProgramValue }) => {
  const [trackedEntity, setTrackedEntity] = useState(null);
  

  async function fetchTrackedEntityInstances() {
    if (!selectedProgramValue) return; 

    const allTrackedEntities = await OPDService.trackedEntityInstances(selectedProgramValue);
      console.log("Fetched Data:", allTrackedEntities); 
      setTrackedEntity(allTrackedEntities?.trackedEntityInstances); 
   
  }

  useEffect(() => {
    console.log("selectedProgramValue:", selectedProgramValue);
    fetchTrackedEntityInstances();
  }, [selectedProgramValue]);

  return (
    <div
      id="printing"
      className="page_border"
      style={{ border: "4px solid black" }}
    >
      <div className="logo">
        <div>
          <strong>FORMATU TB 4</strong>
        </div>
        <div>
          <img src={hospitalSymbal} alt="symbol" />
        </div>
        <div>
          <img src={hospitalLogo} alt="logo" />
        </div>
      </div>
      <div className="header">
        <span className="no-bold">
          NATIONAL PROGRAM FOR TUBERCULOSE CONTROL
        </span>
        <br />
        <i>TUBERCULOSE TREATMENT CARD</i>
      </div>
      <div className="container">
        <section className="container1">
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <td style={{ border: "none" }}>Complete Name:</td>
                  <td style={{ border: "none" }}>
                    <input className="input-bottom-border" 
                    value={trackedEntity?.attributes?.find(attr => attr.displayName === "Complete Name")?.value || ""}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>Sex:</td>
                  <td style={{ border: "none" }}>
                    <input type="checkbox" checked={trackedEntity?.attributes?.find(attr => attr.displayName === "Gender")?.value === "Male"} readOnly  /> Male
                    <input type="checkbox" checked={trackedEntity?.attributes?.find(attr => attr.displayName === "Gender")?.value === "Female"} readOnly  /> Female
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>Age:</td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border"
                    value={trackedEntity?.attributes?.find(attr => attr.displayName === "Age")?.value || ""} />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Address and Telephone Number:
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" 
                    value={trackedEntity?.attributes?.find(attr => attr.displayName === "Permanent address")?.value || ""}/>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Name, Address and Personal Contact Number:
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Home Visit Initiated From and Date:
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Previous TB Treatment History and Duration (if Yes, TB
                    Registration Number):
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border"
                    value={trackedEntity?.attributes?.find(attr => attr.displayName === "TB Treatment History")?.value || ""}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table">
            <table id="border_less">
              <thead>
                <tr>
                  <th colSpan="2">Disease Classification</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pulmonary</td>
                  <td>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td>Extra Pulmonary</td>
                  <td>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table">
            <table id="border_less">
              <thead>
                <tr>
                  <th colSpan="2" style={{ textAlign: "center" }}>
                    Type of Patient
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="checkbox" /> New
                  </td>
                  <td>
                    <input type="checkbox" /> T. then LTFU
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" /> Relapse
                  </td>
                  <td>
                    <input type="checkbox" /> Other
                  </td>
                </tr>
                <tr>
                  <td>
                    <input type="checkbox" /> T. Failure
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table">
            <table id="border_less">
              <thead>
                <tr>
                  <th colSpan="2" style={{ textAlign: "center" }}>
                    X-Ray Initiation
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Date:</td>
                  <td>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td>(-)</td>
                  <td>Normal</td>
                </tr>
                <tr>
                  <td>(+)</td>
                  <td>Abnormal</td>
                </tr>
                <tr>
                  <td>No</td>
                  <td>(Not done)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table">
            <table style={{ marginTop: "30px" }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", fontWeight: 600 }}>
                    I. INTENSIVE PHASE(Date)
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="container2">
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <td style={{ border: "none" }}>TB Register Number / Year:</td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Name of Health Facility Providing Treatment:
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }}>
                    Name & Telephone No. of DOT Provider:
                  </td>
                  <td style={{ border: "none" }}>
                    <input type="text" className="input-bottom-border" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table">
            <table>
              <tbody>
                <tr style={{ textAlign: "center" }}>
                  <th rowSpan="2">Position of DOT Provider:</th>
                  <td colSpan="3">
                    <input type="checkbox" />
                    Health Care Worker
                  </td>
                  <td colSpan="3">
                    <input type="checkbox" />
                    NGO Staff
                  </td>
                  <td colSpan="3">
                    <input type="checkbox" />
                    PSF
                  </td>
                </tr>
                <tr>
                  <td colSpan="3">
                    <input type="checkbox" />
                    Traditional Healer
                  </td>
                  <td colSpan="3">
                    <input type="checkbox" />
                    Private Clinic
                  </td>
                  <td colSpan="3">
                    <input type="checkbox" />
                    Family
                  </td>
                </tr>
                <tr>
                  <td rowSpan="2">Month</td>
                  <td colSpan="3">Microscope Sputum</td>
                  <td colSpan="3">XpertUltra</td>
                  <td rowSpan="2" colSpan="1">
                    Body Weight(kg)
                  </td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>Lab No.</td>
                  <td>Result</td>
                  <td>Date</td>
                  <td>Lab. No.</td>
                  <td>Result</td>
                </tr>
                <tr>
                  <td>Initiate</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan="2"></td>
                </tr>
                <tr>
                  <td>2 months</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan="2"></td>
                </tr>
                <tr>
                  <td>End of treatment</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
            <p>
              Green color applies only for follow-up positive sputum microscope
              examination
            </p>
          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }} colSpan="3">
                    TB/HIV
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ textAlign: "center" }}>Date</td>
                  <td style={{ textAlign: "center" }}>Result</td>
                </tr>
                <tr>
                  <td>HIV Test</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Initiate CPT</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Initiate ART</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>CD4 Result</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>ART Reg. No. & Date</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <h4 style={{ textAlign: "center" }}>
          REGIMENT and DOSAGE ( Circle appropriately to the below category
        </h4>
        <section className="container3">
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <th>New Case (Daily) for two months </th>
                </tr>
                <tr>
                  <td>RHZE (150/75/400/275) </td>
                </tr>
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="table">
            <table>
              <tbody>
                <tr>
                  <th>Pediatric Case (daily) for two months</th>
                </tr>
                <tr>
                  <td>50H/75R/150Z</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <p>
              <b>appropriate to the below category)</b>
            </p>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">Diabetes Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>FBS</td>
                  <td>RBS</td>
                </tr>
                <tr>
                  <td>=126 mg/ dl or =7 mmol</td>
                  <td>At least 2 hrs after meal, =200mg/ dl or =11 mmol</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <p style={{ fontStyle: "italic" }}>
          R= Rifampicin H= Isoniazide Z= Pyrazinamide E= Ethambutol
        </p>
        <section className="container3">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th rowSpan="2">Month / Year</th>
                  <th colSpan="31">Data</th>
                  <th colSpan="2">Total dosage taken</th>
                </tr>
                <tr>
                  {Array.from({ length: 31 }, (_, i) => (
                    <td key={i + 1}>{String(i + 1).padStart(2, "0")}</td>
                  ))}
                  <td>This month</td>
                  <td>Cumulative</td>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }, (_, i) => (
                  <tr key={i}>
                    <td></td>
                    {Array.from({ length: 31 }, (_, j) => (
                      <td key={j}></td>
                    ))}
                    <td></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <div className="header">
        <h2>II. CONTINUATION PHASE</h2>
        <p className="subtitle">Circle appropriately to the below category</p>
      </div>

      {/* Treatment Tables */}
      <div className="tables-container">
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>New Case (Daily) for 4 months</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Pediatric Case (Daily) for 4 months</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Treatment Result Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th colSpan="2">Treatment Result (One ✓ Mark)</th>
              <th>Decided Date</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Cured",
              "Complete Treatment",
              "Die",
              "Treatment Fail",
              "Lost to Follow Up",
              "Not Evaluate",
            ].map((result, index) => (
              <tr key={index}>
                <td colSpan="2">{result}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Follow-up Table */}
      <h3>Follow action to the lost patient and the Result</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>Reason for not taking medicine</th>
              <th>Result from this activity</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Observation */}
      <h3>Observation</h3>
      <hr />

      {/* Screening Table */}
      <h3>Screening to close contact (Children, Adults, and PLHIV contacts)</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Complete Name</th>
              <th>Year</th>
              <th>Relation to the patient</th>
              <th>Screening Date</th>
              <th>Result</th>
              <th>TPT</th>
              <th>TB Treatment (S/L)</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(15)].map((_, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Data Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th rowSpan="2">Month / Year</th>
              <th colSpan="31">Data</th>
              <th colSpan="2">Total dosage taken</th>
            </tr>
            <tr>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i + 1}>{String(i + 1).padStart(2, "0")}</th>
              ))}
              <th>This month</th>
              <th>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, i) => (
              <tr key={i}>
                <td></td>
                {Array.from({ length: 31 }, (_, j) => (
                  <td key={j}></td>
                ))}
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default TbTreatmentCard;
