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

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/downloadBirthCertificate";
  const navigate = useNavigate();
  const [orgUnit, setOrgUnit] = useState({id:'', name: ''})

  const[userOrgunit, setUserOrgunit] = useState(null);
  const [orgUnits, setOrgUnits] = useState([])
  
      useEffect(()=> {
        const getOrgData = async() => {
          try {
            const allOrgUnit = await fetchOrgUnits();
            const mynamar = allOrgUnit.find(unit => unit.name === "Myanmar");
              console.log(allOrgUnit.map(u => u.name))
              setUserOrgunit(mynamar);
              setOrgUnits(allOrgUnit)
          } catch (error) {
            console.log("Error while fetching data");
          }
        }
  
        getOrgData();
      }, [])



  return (

    <>
      {/* <Header /> */}
      <div className={styles.container}>
        {!hideSidebar && <Sidebar  setOrgUnit={setOrgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>}

        <Routes>
          <Route path="/birth" element={<BirthRecords orgUnit={orgUnit} />} />
          <Route path="/death" element={<DeathRecords orgUnit={orgUnit}/>} />
          <Route path="/birth-certificate" element={<BirthCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>} />
          <Route path="/death-certificate" element={<DeathCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>} />
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