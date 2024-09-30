import React, { useState, useEffect } from "react";
import "./sideBar.style.scss";

import OrganisationUnitTree from "../OrganisationUnitTree";

import { useDispatch, useSelector } from "react-redux";
import {
  setBlock,
  setClickedOU,
  setDistrict,
  setOUList,
  setState,
  setUserOU,
} from "../../store/outree/outree.action";
import { setProgramList } from "../../store/metaData/metaData.action";
import { setStatus } from "../../store/main/main.action";

const SideBar = ({ data }) => {
  const dispatch = useDispatch();

  const selectedOU = useSelector((state) => state.outree.clickedOU);

  useEffect(() => {
    if (data) {
      if (data.ouList) {
        dispatch(setOUList(data.ouList.organisationUnits));
      }
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
      if(data.programList) dispatch(setProgramList(data.programList.programs));
    }
  }, [data]);

  useEffect(() => {
    if(selectedOU) {
      dispatch(setStatus(false))
    }
  }, [selectedOU])
  
  return (
    <div className="side-bar">
        {selectedOU && (
          <>
            <input
              className="form-control"
              id="organisation-unit"
              disabled
              value={selectedOU.name}
            />
            <div>
              <OrganisationUnitTree />
            </div>
          </>
        )}
    </div>
  );
};

export default SideBar;
