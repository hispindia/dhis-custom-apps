import React, { useState, useEffect } from "react";
import "./main.style.scss";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../Sidebar";
import IndividualTracking from "../IndividualTracking"
import GroupTracking from "../GroupTracking";
const Main = ({ data, head }) => {
  return (
    <>
      <Sidebar />
      <div style={{ width: '85%', boxSizing: 'border-box', float: 'left' }}>
        <>
          <div className="box p-3 w-85">
            <div style={{ position: 'relative', marginLeft: '13px' }}>
              <h3 className="text-center fw-bold my-2">{head ? "Individual Tracking" : "Group Tracking"}</h3>
              {head ? <IndividualTracking head={head} /> : <GroupTracking head={head} />}


            </div>
          </div>
        </>

      </div>
    </>
  );
};
export default Main;
