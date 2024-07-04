// import React from 'react'
// import 'bootstrap/dist/css/bootstrap.css';

// import i18n from '@dhis2/d2-i18n'
// import classes from './App.module.css'
// import { Provider } from "react-redux";

// import { InitialQuery } from "./constants";
// import { useDataQuery } from "@dhis2/app-runtime";

// import Main from "./components/Main/main.component";

// import { CircularLoader } from "@dhis2/ui";

// import { store } from "./store/store";
// const MyApp = () => {
//   const { loading, error, data } = useDataQuery(InitialQuery);

//   if (error) {
//     return <span>ERROR: {error.message}</span>;
//   }

//   if (loading) {
//     return <div className="h-100 d-flex align-items-center justify-content-center"> <CircularLoader /> </div>;
//   }
//   return (
//     // <div className="d-flex m-2">
//     <div>
//       <Provider store={store}>
//         <Main data={data} />

//       </Provider>
//     </div>
//   );
// };


// export default MyApp;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss'

import 'bootstrap/dist/css/bootstrap.css';


import { Provider } from "react-redux";

import { InitialQuery } from "./constants";
import { useDataQuery } from "@dhis2/app-runtime";

import Dataset from "./components/DataSet/Dataset";


import { CircularLoader } from "@dhis2/ui";

import { store } from "./store/store";


import Sidebar from './components/Sidebar';
import Main from './components/Main/Main';
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
          <Route path="/" element={<Dataset data={data} />} />
          <Route path="/report" element={<Dataset data={data} />} />
         
        </Routes>

      </Router>
    </Provider>

  );
};
export default MyApp;
