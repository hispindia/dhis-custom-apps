import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeReportWithPageNumber } from '../redux/actions/HomeActions';
export default function Pagination(_ref) {
  let {
    currentPage = 1,
    totalPages = 0,
    pages = [],
    loading = false
  } = _ref;
  const dispatch = useDispatch();
  const {
    selectedProgram
  } = useSelector(state => state.common);
  const {
    serchedTxet
  } = useSelector(state => state.home);
  function onPageChange(page) {
    dispatch(fetchHomeReportWithPageNumber({
      id: selectedProgram === null || selectedProgram === void 0 ? void 0 : selectedProgram.id,
      page,
      filter: serchedTxet
    }));
  }
  if (loading) return /*#__PURE__*/React.createElement("div", {
    className: "text-center",
    style: {
      height: '80vw'
    }
  }, /*#__PURE__*/React.createElement("p", null, "......loading......"));
  if (!totalPages) return /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", null));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      justifySelf: "center"
    }
  }, /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Pagination"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pagination"
  }, /*#__PURE__*/React.createElement("li", {
    className: `page-item ${currentPage === 1 ? "disabled" : ""}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "page-link",
    onClick: () => onPageChange(currentPage - 1)
  }, "Previous")), pages.map((page, index) => page === "..." ? /*#__PURE__*/React.createElement("li", {
    key: index,
    className: "page-item disabled"
  }, /*#__PURE__*/React.createElement("span", {
    className: "page-link"
  }, "\u2026")) : /*#__PURE__*/React.createElement("li", {
    key: index,
    className: `page-item ${page === currentPage ? "active" : ""}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "page-link",
    onClick: () => onPageChange(page)
  }, page))), /*#__PURE__*/React.createElement("li", {
    className: `page-item ${currentPage === totalPages ? "disabled" : ""}`
  }, /*#__PURE__*/React.createElement("button", {
    className: "page-link",
    onClick: () => onPageChange(currentPage + 1)
  }, "Next")))));
}