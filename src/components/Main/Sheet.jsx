import React, { useState, useEffect } from "react";
import "./styles.scss";
import { CircularLoader } from "@dhis2/ui";
import { ApiService } from "../../services/api";
import { CLIENTID , PREPID } from "../constants";
import { tableToExcel } from "../utils.func";

const Sheet = ({
  clickedOU,
  programList,
  programId,
  transferStatus,
}) => {
  const [loading, setLoading] = useState(true);
  const [teiList, setTeiList] = useState();
const loadTracker = (url) =>{
  window.open(url, '_blank');
}
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    let teiRows = []; 
    const tranferredData = await ApiService.trackedEntityInstance.transferredData(
      clickedOU.id,
      programId,
      transferStatus.split('-')[0],
    );
    if (tranferredData.listGrid.rows.length > 0) { 
      for (const row of tranferredData.listGrid.rows) {
        const TrackId = row[0]; 
        const EnrollingorgUnit = row[4]; 
        const TransferouName = row[6]; 
        const createdDate = row[9]

        // Fetch details for the TrackId from the API
        const list = await ApiService.trackedEntityInstance.filter(
          clickedOU.id,
          programId,
          TrackId
        );
        // Initialize an empty row in teiRows
        if(row[3] != row[5]) {
          const teiRow = [
            EnrollingorgUnit,
            TransferouName,
            list.attributes.find(attr => attr.attribute === CLIENTID)?.value || '', // clientId
            list.attributes.find(attr => attr.attribute === PREPID)?.value || '', // prepId
            list.trackedEntityInstance || '', // trackedEntityInstance
            createdDate
          ];
  
          // Push the populated teiRow into teiRows
          teiRows.push(teiRow);
        }
      }
    }

    // Update the state with teiRows after fetching and processing data
    setTeiList(teiRows);
    setLoading(false);
  };

  fetchData();
}, [clickedOU.id, programId, transferStatus]); // Dependencies are the clickedOU.id, programId, and transferStatus



  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        {" "}
        <CircularLoader />{" "}
      </div>
    );
  }
  if(!teiList.length) return <h2 className="text-center text-secondary fst-italic"> No client found!</h2>;

  return (
    <> 
    <div className="text-end">
      <a id="dlink" style={{display:"none"}}></a>
      <button className="btn btn-success" onClick={() => tableToExcel('client-referral', `client-referral-${transferStatus.split('-')[1]}`, `client-referral-${transferStatus.split('-')[1]}`)}>Download As Excel</button>
    </div>
    <div className="scroll">
      <table className="table" id='client-referral'>
        <thead className="header">
          <tr>
            <th
              style={{
                background: "rgb(44, 102, 147)",
                color: "white",
                border: "0",
              }}
              className="text-center"
              colSpan={7}
            >
              Client Referral
            </th> 
            </tr>
            <tr>
            <th>
              S.No.
            </th>
            <th>
              Client Id
            </th>
            <th>
              Prep Id
            </th>
            <th>
              Enrolling OrgUnit
            </th>
            <th>
              Transferred {transferStatus.split('-')[1]}
            </th>
            <th>
              Transferred Date
            </th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            teiList.map((tei,index) => 
              <tr><td>{index+1}</td><td>{tei[2]}</td><td>{tei[3]}</td><td>{tei[0]}</td><td>{tei[1]}</td><td>{tei[5]}</td><td><button class="btn btn-success" onClick={() => loadTracker(`../../../dhis-web-tracker-capture/index.html#/dashboard?tei=${tei[4]}&program=${programId}&ou=${clickedOU.id}`)}>Go To Tracker</button></td></tr>
            )
          }
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Sheet;
