import React from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  setFilteredOU,
  setSearchedOU,
  setSearchedOUList,
} from "../../store/outree/outree.action";

const SearchBar = () => {
  const dispatch = useDispatch();
  const ouList = useSelector((state) => state.outree.ouList);
  const searchedOU = useSelector((state) => state.outree.searchedOU);
  const searchedOUList = useSelector((state) => state.outree.searchedOUList);

  const handleSearchedOU = (e) => {
    const { value } = e.target;
    const list = value
      ? ouList.filter((ou) => ou.name.toLowerCase().includes(value.toLowerCase()))
      : [];

    dispatch(setSearchedOU(value));
    dispatch(setSearchedOUList(list));
  };
  const handleFilteredOU = (e) => {
    const { id } = e.target;
    const ou = ouList.filter((ou) => ou.id == id);
    dispatch(setFilteredOU(ou[0]));
    dispatch(setSearchedOU(""));
    dispatch(setSearchedOUList([]));
  };

  return (
    <>
      <input
        type="text"
        className="form-control"
        placeholder="Search Facility"
        onChange={handleSearchedOU}
        value={searchedOU}
      ></input>
      <div
        id="serach-ou-modal"
        className={searchedOUList.length ? "ou-modal" : "ou-hide"}
      >
        {searchedOUList.map((ou) => (
          <p key={ou.id} id={ou.id} onClick={handleFilteredOU}>
            {ou.name}
          </p>
        ))}
      </div>
    </>
  );
};

export default SearchBar;
