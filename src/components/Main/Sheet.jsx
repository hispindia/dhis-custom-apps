import React, { useState, useEffect } from "react";
import "./styles.scss";

import { CircularLoader } from "@dhis2/ui";
import { ApiService } from "../../services/api";

const Sheet = ({
  clickedOU,
  programList,
  programId,
}) => {
  const [loading, setLoading] = useState(true);
  const [teiList, setTeiList] = useState([]);

const loadTracker = (url) =>{
  window.open(url, '_blank');
}
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      var modifiedList = [];
      const list = await ApiService.trackedEntityInstance.filter(
        clickedOU.id,
        programId,
      );
      console.log(list)
      list.trackedEntityInstances.forEach(tei => {
        var modifiedTEI = {};
        tei.attributes.forEach(attr => {
          modifiedTEI[attr.attribute] = attr.value;
        })
        tei.enrollments.forEach(enrollments => {
          enrollments.events.forEach(event => {
              if(event.status == 'SCHEDULE') {
                modifiedList.push({
                  clientId:modifiedTEI["P3Spi0kT92n"]? modifiedTEI["P3Spi0kT92n"]: '',
                  prepId: modifiedTEI["n2gG7cdigPc"]? modifiedTEI["n2gG7cdigPc"]: '',
                  enrollingOU: clickedOU.name,
                  transferredOU: "",
                  trackedEntityInstance: tei.trackedEntityInstance
                })
              }
            
          })
        })
        setTeiList(modifiedList)
      })
      
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center">
        {" "}
        <CircularLoader />{" "}
      </div>
    );
  }
  return (
    <div className="scroll">
      <table className="table">
        <thead className="header">
          <tr>
            <th
              style={{
                background: "rgb(44, 102, 147)",
                color: "white",
                border: "0",
              }}
              className="text-center"
              colSpan={6}
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
              Transferred OrgUnit
            </th>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            teiList.map((tei,index) => 
              <tr><td>{index+1}</td><td>{tei.clientId}</td><td>{tei.prepId}</td><td>{tei.enrollingOU}</td><td>{tei.transferredOU}</td><td><button class="btn btn-success" onClick={() => loadTracker(`https://links.hispindia.org/prep_tracker/dhis-web-tracker-capture/index.html#/dashboard?tei=${tei.trackedEntityInstance}&program=${programId}&ou=${clickedOU.id}`)}>Go To Tracker</button></td></tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
};

export default Sheet;
