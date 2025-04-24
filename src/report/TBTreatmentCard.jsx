import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { hospitalLogo, hospitalSymbal } from "../images";
import { OPDService } from "../Services/api";
import { calculateAge } from "../utils/calculateAge";
import { posOrNeg, yesOrNo } from "../utils/common";
import { CircularLoader } from "@dhis2/ui-core";

const DAM_VALUE = ['kcLrIgGhPMM', 'Nanz6h218xh', 'hprn97zZAaO', 'gGi8Wtiphc6']

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // background fade
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // Make sure it's on top
    backdropFilter: 'blur(4px)', // optional: adds a blur effect
  },
}

const TbTreatmentCard = ({ selectedProgramValue, tie }) => {
  const [fetchData, setFetchedData] = useState({});
  const [observation, setObservation] = useState('');
  const [relation, setRelation] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);

  async function fetchTrackedEntityInstances() {
    if (!selectedProgramValue) return;

    setCardLoading(true)

    try {
      const allTrackedEntities = await OPDService.trackedEntityInstancesMultipleStages(selectedProgramValue, tie);
      const allRelations = await OPDService.screeningCloseRelations(tie);

      let objectedData = {};
      let rel = [];

      allTrackedEntities?.enrollments.map(enroll => {
        setObservation(enroll.orgUnitName)
        enroll.events.map(event => event.dataValues.map((row) => objectedData[row.dataElement] = {
          value: row.value,
          date: row?.created?.slice(0, 10)?.split('-')?.reverse()?.join('-'),
        }))
        enroll.attributes.map((row) => objectedData[row.attribute] = {
          value: row.value,
          date: row?.created?.slice(0, 10)?.split('-')?.reverse()?.join('-'),
        })
      });

      allTrackedEntities.attributes.map(attr => objectedData[attr.attribute] = {
        value: attr.value,
        date: attr?.created?.slice(0, 10)?.split('-')?.reverse()?.join('-'),
      });


      allRelations.map(event => {
        let obj = {}
        event.to.trackedEntityInstance.attributes.map(attr => {
          if (DAM_VALUE.includes(attr.attribute)) obj[attr.attribute] = attr.value;
        })
        obj['date'] = event.to.trackedEntityInstance.created?.slice(0, 10)?.split('-')?.reverse()?.join('-');
        rel.push(obj);
      })

      console.log("Fetched Data:", rel);
      setFetchedData(objectedData);
      setRelation(rel);
      setCardLoading(false)
    } catch (error) {
      setCardLoading(false)
      console.log('error', error)
      setFetchedData({});
      alert(error?.message || 'failled api');
    }

  }

  const openInNewTab = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    return null
  };
  useEffect(() => {
    fetchTrackedEntityInstances();
  }, []);


  return (
    <>
      {cardLoading &&
        <div style={styles.overlay}>
          <CircularLoader />
        </div>
      }
      <div
        id="printing"
        className="modal-info"
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
        <div className="row g-2">

          <section className="col-6">
            <div className="table">
              <table>
                <tbody>
                  <tr>
                    <td style={{ border: "none" }}>Complete Name:</td>
                    <td style={{ border: "none" }}>{fetchData['kcLrIgGhPMM']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>Sex:</td>
                    <td style={{ border: "none" }}>{fetchData['e1YAEOJgkfx']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>Age:</td>
                    <td style={{ border: "none" }}>
                      {calculateAge(fetchData['hb6APG0UBMn']?.value)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>Address and Telephone Number:</td>
                    <td style={{ border: "none" }}>
                      {/* {fetchData['s9skUqn98W8']?.value || ''} ,{fetchData['tCYcDHdqoEc']?.value || ''} */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>
                      Name, Address and Personal Contact Number:
                    </td>
                    <td style={{ border: "none" }}>
                      {/* {fetchData['kcLrIgGhPMM']?.value || ''},  {fetchData['s9skUqn98W8']?.value || ''}, {fetchData['HkdYrf7NPbr']?.value || ''} */}
                      {fetchData['ch4SP6NLy7H']?.value || ''}, {fetchData['HkdYrf7NPbr']?.value || ''}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>
                      Home Visit Initiated From and Date:
                    </td>
                    <td style={{ border: "none" }}>                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>
                      Previous TB Treatment History and Duration (if Yes, TB
                      Registration Number):
                    </td>
                    <td style={{ border: "none" }}>                    </td>
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
                    <td colSpan="2"> {fetchData['LTwo15geiNf']?.value || ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table">
              <table id="border_less">
                <thead>
                  <tr>
                    <th colSpan="2" style={{ textAlign: "left" }}>
                      Type of Patient
                    </th>
                  </tr>

                </thead>
                <tbody>
                  <tr>
                    <td >
                      {fetchData['dP1vchhcUQH']?.value || 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <td >{fetchData['Lkt9XYo3YcP']?.value || 'N/A'}</td>

                  </tr>

                </tbody>
              </table>
            </div>
          </section>

          <section className="col-6">
            <div className="table">
              <table>
                <tbody>
                  <tr>
                    <td style={{ border: "none" }}>TB Register Number / Year:</td>
                    <td style={{ border: "none" }}>
                      {/* <input type="text" className="input-bottom-border" /> */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>
                      Name of Health Facility Providing Treatment:
                    </td>
                    <td style={{ border: "none" }}>{observation || ''} </td>
                  </tr>
                  <tr>
                    <td style={{ border: "none" }}>
                      Name & Telephone No. of DOT Provider:
                    </td>
                    <td style={{ border: "none" }}>
                      {/* <input type="text" className="input-bottom-border" /> */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table">
              <table>
                <tbody>
                  <tr>
                    <th >Position of DOT Provider:</th>
                    <td >{fetchData['rafHJbDBMc2']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td > Date</td>
                    <td >{fetchData['hTeeEA3luAl']?.date || ''}</td>
                  </tr>
                  <tr>
                    <td >Productive Cough Microscopy</td>
                    <td style={{ backgroundColor: `${fetchData['hTeeEA3luAl']?.value === 'POSITIVE' ? 'green' : "white"}` }}>{fetchData['hTeeEA3luAl']?.value || ''}</td>
                  </tr>
                </tbody>
              </table>
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
                    <td ></td>
                    <td style={{ textAlign: "center" }}>Date</td>
                    <td style={{ textAlign: "center" }}>Result</td>
                  </tr>
                  <tr>
                    <td >HIV Test</td>
                    <td >{fetchData['wsYLk5j39R1']?.date || ''}</td>
                    <td >{fetchData['wsYLk5j39R1']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td >Initiate CPT</td>
                    <td >{fetchData['T48HXW0TTdB']?.date || ''}</td>
                    <td >{fetchData['T48HXW0TTdB']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td >Initiate ART</td>
                    <td >{fetchData['qMj31r5XxDF']?.date || ''}</td>
                    <td >{fetchData['qMj31r5XxDF']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td >CD4 Result</td>
                    <td >{fetchData['PPtWbZprTON']?.date || ''}</td>
                    <td >{fetchData['PPtWbZprTON']?.value || ''}</td>
                  </tr>
                  <tr>
                    <td >ART Reg. No. & Date</td>
                    <td ></td>
                    <td ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="col-6">
            <table>
              <thead>
                <tr>
                  <th >Treatment Result</th>
                  <th >Decided Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td >{fetchData['DdksjaW6MWf']?.value || ''}</td>
                  <td >{fetchData['DdksjaW6MWf']?.date || ''}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <br ></br>
          <h6 className="col-12 my-2">
            REGIMENT: {fetchData['F7pEZBWhMTN']?.value || 'N/A'}
          </h6>
          <br ></br>
          <h6 className="col-12" onClick={() => openInNewTab(fetchData['Ms2aNVW7foI']?.value || '')} >Calendar: <span className="text-primary " style={{ cursor: 'pointer' }}>{fetchData['Ms2aNVW7foI']?.value || 'N/A'}</span></h6>


          <hr />

          {/* Screening Table */}
          <h6 className="col-12">Screening to close contact (Children, Adults, and PLHIV contacts)</h6>
          <div className="col-12 w-100">
            <table>
              <thead>
                <tr>
                  <th >No</th>
                  <th >Complete Name</th>
                  <th >Age</th>
                  <th >TB screening date</th>
                  <th >Result</th>
                  <th >TPT initiated</th>
                </tr>
              </thead>
              <tbody>
                {relation.map((item, index) => (
                  <tr key={index}>
                    <td >{index + 1}</td>
                    <td >{item['kcLrIgGhPMM'] || ''}</td>
                    <td >{item['Nanz6h218xh'] || ''}</td>
                    <td >{item['date'] || ''}</td>
                    <td >{posOrNeg(item['hprn97zZAaO']) || ''}</td>
                    <td >{yesOrNo(item['gGi8Wtiphc6']) || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>

    </>


  );
};


export default TbTreatmentCard;
