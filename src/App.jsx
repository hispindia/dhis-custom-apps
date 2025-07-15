import React from "react";
import { Routes, Route, BrowserRouter, useLocation, useNavigate } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styles from './App.module.css';
import BirthRecords from "./routes/BirthRecords";
import DeathRecords from "./routes/DeathRecords";
import BirthCertificate from "./routes/BirthCertificate";
import DeathCertificate from "./routes/DeathCertificate";
import { useState, useEffect } from "react";
import { fetchOrgUnits } from "./API/OrganizationAPI";
import LateFoetalDeathRecord from "./routes/LateFoetalDeathRecord";
import LateFoetalDeathCert from "./routes/lateFoetalDeathCert";
import { useDataQuery } from "@dhis2/app-runtime";
import { InitialQuery } from "./components/constants";

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/downloadBirthCertificate";
  const navigate = useNavigate();
  const [orgUnit, setOrgUnit] = useState({id:'', name: ''})
  const [dataElements, setDataElements] = useState({});

  const[userOrgunit, setUserOrgunit] = useState(null);
  const [orgUnits, setOrgUnits] = useState([]);

  const { loading, error, data } = useDataQuery(InitialQuery);

      useEffect(()=> {
        // const getOrgData = async() => {
        //   try {
        //     const allOrgUnit = await fetchOrgUnits();
        //     const myanmar = allOrgUnit.find(unit => unit.name === "Myanmar");
        //       // console.log(allOrgUnit.map(u => u.name))
        //       setUserOrgunit(myanmar);
        //       setOrgUnits(allOrgUnit);
        //   } catch (error) {
        //     console.log("Error while fetching data");
        //   }
        // }
        if(data) {
          if(data.me) {
            setUserOrgunit(data.me.organisationUnits[0]);
          }
          if(data.ouList) {
            setOrgUnits(data.ouList.organisationUnits)
          }
          if(data.dataElements && data.optionSets) {
            var de = {};
            data.dataElements.dataElements.forEach(dataElement => {
              if(dataElement.optionSetValue) {
                de[dataElement.id] = {};
                const optionSet = data.optionSets.optionSets.find(option => option.id == dataElement.optionSet.id)
                optionSet.options.forEach(option => {
                  de[dataElement.id][option.code] = option.name;
                })
              }
            })
            setDataElements(de);
          }
        }
  
        // getOrgData();
      }, [data])



  return (

    <>
      {/* <Header /> */}
      <div className={styles.container}>
        {!hideSidebar && <Sidebar  setOrgUnit={setOrgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>}

        <Routes>
          <Route path="/born-alive" element={<BirthRecords orgUnit={orgUnit} status={'Live-Birth'}/>} />
          <Route path="/death" element={<DeathRecords orgUnit={orgUnit} dataElements={dataElements}/>} />
          <Route path="/still-born" element={<LateFoetalDeathRecord orgUnit={orgUnit} status={'Still Birth'}/>} />
          <Route path="/birth-certificate" element={<BirthCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>} />
          <Route path="/death-certificate" element={<DeathCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} dataElements={dataElements}/>} />
          <Route path="/late-Foetal-death-certificate" element={<LateFoetalDeathCert orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} dataElements={dataElements}/>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/myr_registry/api/apps/birth-death-certificate/">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;