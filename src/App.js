import React from "react";
import './App.scss';
import { CircularLoader } from "@dhis2/ui";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { useDataQuery } from "@dhis2/app-runtime";

import Main from "./components/Main";
import { InitialQuery } from "./components/constants";
import SideBar from "./components/SideBar/SideBar.component";

const MyApp = () => {
  const { loading, error, data } = useDataQuery(InitialQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <div className="h-100 d-flex align-items-center justify-content-center"> <CircularLoader/> </div>;
  }
  return (
    <div className="d-flex m-2">
      <Provider store={store}>
        <SideBar data={data}/>
        <Main data={data}/>
      </Provider>
    </div>
  );
};

export default MyApp;
