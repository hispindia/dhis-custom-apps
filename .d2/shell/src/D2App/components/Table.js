import React from 'react';
import { CunstomLoader } from "./Loader";
import { TableWrapperTD, TableWrapperTH, TableWrapperTR } from './wrapper/TableWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedText } from '../redux/actions/HomeActions';
const DynamicTable = _ref => {
  var _data$, _headers, _headers2;
  let {
    data = [],
    header = {},
    loading = false,
    download = false,
    actionHeader = '',
    actionCallback = null,
    actionText = '',
    setSelectedRow = '',
    detailsCallBack = null
  } = _ref;
  const {
    serchedTxet,
    keyWithAttrubute
  } = useSelector(state => state.home);
  const dispatch = useDispatch();
  if (loading) return /*#__PURE__*/React.createElement(CunstomLoader, null);

  // if (!data || data.length === 0) return <div className="text-center" style={{ height: '43vw' }}>
  //     <p>No data available</p>
  // </div>;

  console.log({
    header
  });
  let headers = [];
  if (header) headers = Object.keys(header !== null && header !== void 0 ? header : {});else headers = Object.keys((_data$ = data === null || data === void 0 ? void 0 : data[0]) !== null && _data$ !== void 0 ? _data$ : {}).filter(key => key !== 'id');

  // console.log({ headers })

  function handleSearch(event) {
    const {
      name,
      value
    } = event.target;
    const data = {
      ...serchedTxet,
      [keyWithAttrubute[name]]: value
    };
    if (value) {
      dispatch(setSearchedText(data));
    } else {
      delete data[keyWithAttrubute[name]];
      dispatch(setSearchedText(data));
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "m-2 w-100 overflow-auto",
    id: "report-table"
  }, /*#__PURE__*/React.createElement("a", {
    id: "dlink"
  }), /*#__PURE__*/React.createElement("table", {
    className: "table table-striped table-bordered",
    style: {
      minHeight: "40vw"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement(TableWrapperTR, null, (_headers = headers) === null || _headers === void 0 ? void 0 : _headers.map((header, i) => {
    const isLast = i === headers.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: header
    }, /*#__PURE__*/React.createElement(TableWrapperTH, null, header), download && isLast && /*#__PURE__*/React.createElement(TableWrapperTH, {
      key: `${header}-action`
    }, actionHeader));
  })), /*#__PURE__*/React.createElement(TableWrapperTR, null, (_headers2 = headers) === null || _headers2 === void 0 ? void 0 : _headers2.map(header => {
    var _serchedTxet$keyWithA;
    return /*#__PURE__*/React.createElement(TableWrapperTH, {
      key: header
    }, /*#__PURE__*/React.createElement("input", {
      onChange: handleSearch,
      value: (_serchedTxet$keyWithA = serchedTxet[keyWithAttrubute[header]]) !== null && _serchedTxet$keyWithA !== void 0 ? _serchedTxet$keyWithA : '',
      key: header,
      name: header,
      style: {
        width: "14rem"
      },
      type: "text",
      class: "form-control",
      placeholder: `Search ${header}`
    }));
  }))), /*#__PURE__*/React.createElement("tbody", null, data === null || data === void 0 ? void 0 : data.map((row, idx) => /*#__PURE__*/React.createElement(TableWrapperTR, {
    key: idx
  }, headers.map((header, hIdx) => {
    const isLast = hIdx === headers.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: hIdx
    }, /*#__PURE__*/React.createElement(TableWrapperTD, {
      style: {
        cursor: "pointer"
      },
      onClick: () => {
        setSelectedRow && setSelectedRow(row.id);
        detailsCallBack && detailsCallBack();
      }
    }, row[header]), download && isLast && /*#__PURE__*/React.createElement(TableWrapperTD, {
      key: `download-${idx}`
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setSelectedRow && setSelectedRow(row.id);
        actionCallback && actionCallback();
      },
      type: "button",
      className: "btn btn-sm btn-success"
    }, actionText)));
  }))))), !data.length ? /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", null, "No data available")) : "");
};
export default DynamicTable;