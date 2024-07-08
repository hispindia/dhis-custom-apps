
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss'
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from "react-redux";
import { InitialQuery } from "./constants";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { store } from "./store/store";
import Main from './components/Main';
const MyApp = () => {
  const { loading, error, data } = useDataQuery(InitialQuery);

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <div className="h-100 d-flex align-items-center justify-content-center"><CircularLoader /></div>;
  }

  return (
    <Provider store={store}>
      <Router basename="nepalhmis/api/apps/dataset-reporting-app/index.html">
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Main data={data} head={true} />} />
          <Route path="/report" element={<Main data={data} head={false} />} />
        </Routes>
      </Router>
    </Provider>
  );
};
export default MyApp;
