import React, { useEffect, useState } from 'react';
import ThemeButton from './ThemeButton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeReportData, collectAttributes, selectedProgram, setProgramList } from '../redux/actions/HomeActions';
import { tableToExcel } from '../utils/tableToexcel';
function Header() {
  const dispatch = useDispatch();
  const {
    serchedTxet
  } = useSelector(state => state.home);
  const {
    programs,
    record
  } = useSelector(state => state.pagination);
  const [programValue, setProgramValue] = useState({});
  const handleSelectChange = e => {
    const selectedValue = JSON.parse(e.target.value);
    setProgramValue(selectedValue);
  };
  const handleSearch = () => {
    if (!(programValue !== null && programValue !== void 0 && programValue.id)) return alert("Please select a program");
    dispatch(fetchHomeReportData({
      id: programValue === null || programValue === void 0 ? void 0 : programValue.id,
      filter: serchedTxet
    }));
    dispatch(collectAttributes(programValue === null || programValue === void 0 ? void 0 : programValue.id));
    dispatch(selectedProgram(programValue));
  };
  useEffect(() => {
    dispatch(setProgramList());
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    class: "mb-3 border-bottom border-danger py-2"
  }, /*#__PURE__*/React.createElement("div", {
    class: "container"
  }, /*#__PURE__*/React.createElement("div", {
    class: "row g-3 w-100"
  }, /*#__PURE__*/React.createElement("div", {
    class: "col-2"
  }, /*#__PURE__*/React.createElement(ThemeButton, null)), /*#__PURE__*/React.createElement("div", {
    class: "col-6"
  }, (programs === null || programs === void 0 ? void 0 : programs.length) > 0 && /*#__PURE__*/React.createElement("select", {
    class: "form-select w-100",
    "aria-label": "Default select example",
    onChange: handleSelectChange
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select Program for Event List"), programs === null || programs === void 0 ? void 0 : programs.map(option => /*#__PURE__*/React.createElement("option", {
    key: option[0],
    value: JSON.stringify({
      id: option[0],
      name: option[1]
    })
  }, option[1])))), /*#__PURE__*/React.createElement("div", {
    class: "col-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    class: "btn btn-secondary w-100",
    onClick: handleSearch
  }, "Search")), /*#__PURE__*/React.createElement("div", {
    class: "col-2"
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !record.length,
    type: "button",
    class: "btn btn-success w-100",
    onClick: () => tableToExcel("report-table", "Timor Event List")
  }, "Export Data"))))));
}
export default Header;