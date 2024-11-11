import React from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.css';
import { Provider } from "react-redux";
import { InitialQuery } from "./constants";
import { useDataQuery } from "@dhis2/app-runtime";
import { CircularLoader } from "@dhis2/ui";
import { store } from "./store/store";
import Main from './components/Main';
const MyApp = () => {
  // Simulating data query
  const { loading, error, data } = useDataQuery(InitialQuery);
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }
  if (loading) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <CircularLoader />
      </div>
    );
  }
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Main data={data} head={true} />} />
          <Route path="/group" element={<Main data={data} head={false} />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default MyApp;
