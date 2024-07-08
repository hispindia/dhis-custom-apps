import React, { useState, useEffect } from "react";
import "./main.style.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
import { setDatasets, setStatus, setUseSelectedUnitOnly } from "../../store/main/main.action";

import OrganisationUnitTree from "../OrganisationUnitTree";
import Sidebar from "../Sidebar";
import DataSets from "../Datasets";
import Period from "../Period";
import Report from "../Report";

const Main = ({ data, head }) => {
  const dispatch = useDispatch();
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const status = useSelector((state) => state.main.status);
  const useSelectedUnitOnly = useSelector((state) => state.main?.useSelectedUnitOnly);
  
  useEffect(() => {
    if (data) {
      if (data.ouList) dispatch(setOUList(data.ouList.organisationUnits));
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
    }
  }, [data]);
  useEffect(() => {
    if (selectedOU && selectedOU.id) {
      dispatch(setDatasets(data.dataSetList.dataSets));
    }
  }, [selectedOU]);


  const handleCheckboxChange = (e) => {
    dispatch(setUseSelectedUnitOnly(e.target.checked));
  };
  return (
    <>
      <Sidebar />

      <div style={{ width: '85%', boxSizing: 'border-box', float: 'left' }}>
        {selectedOU && (
          <>
            <div className="box p-3 d-flex w-100">
              <div >
                <input
                  className="form-control"
                  id="organisation-unit"
                  disabled
                  value={selectedOU.name}
                />
                <OrganisationUnitTree />
              </div>
              <div style={{ position: 'relative', marginLeft: '13px' }}>
              <h3 className="text-center fw-bold my-2">{head? "Data Set Report":"Reporting Rate Summary"}</h3>
              <DataSets head={head}/>
              <Period head={head}/>
                {head && (
                  <div className="mt-5">
                    <input
                      type="checkbox"
                      id="useSelectedUnitOnly"
                      checked={useSelectedUnitOnly}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ms-1" htmlFor="useSelectedUnitOnly">Use data for Selected Unit Only</label>
                  </div>
                )}
                <div className="button-container">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(setStatus(true))
                    }
                    className={"btn btn-primary "}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      fontWeight: 'bold',
                      padding: '0.5rem 1rem',

                      width: '10vw',
                      minWidth: '100px',
                      maxWidth: '150',
                      position: 'absolute',
                      bottom: '0'

                    }}
                  >
                    GET REPORT
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {status ? <Report head={head}/> : ''}
      </div>
    </>
  );
};
export default Main;
