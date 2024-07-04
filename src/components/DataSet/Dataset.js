import React, { useState, useEffect } from "react";
import "./dataset.style.scss";
import OrganisationUnitTree from "../OrganisationUnitTree";
import DataSetTree from "../DataSetTree";
import { useDispatch, useSelector } from "react-redux";
import {
  setClickedOU,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
import { setDatasets, setStatus, setUseSelectedUnitOnly } from "../../store/main/main.action";
import Sidebar from "../Sidebar";
import PeriodType from "../PeriodType";
import Main from "../Main/Main";
const Dataset = ({ data }) => {
  const dispatch = useDispatch();
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const SelectedRoute = useSelector((state) => state.sidebar?.Title?.text);
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

      <div style={{ width: '85%', boxSizing: 'border-box', float: 'left' }} className="p-3">
        {selectedOU && (
          <>
            <div style={{ display: "flex", width: "100%" }} className="box">

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
                <DataSetTree />
                <div>
                  <PeriodType />
                </div>
                {SelectedRoute == "Data Set Report" && (
                  <div style={{ marginTop: '3rem' }}>
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

        <Main />
      </div>
    </>
  );
};
export default Dataset;
