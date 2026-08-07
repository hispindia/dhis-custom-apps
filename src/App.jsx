import React from "react";
import { Routes, Route, HashRouter, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import styles from './App.module.css';
import BirthRecords from "./routes/BirthRecords";
import DeathRecords from "./routes/DeathRecords";
import BirthCertificate from "./routes/BirthCertificate";
import DeathCertificate from "./routes/DeathCertificate";
import BlankBirthCertificate from "./routes/BlankBirthCertificate";
import BlankDeathCertificate from "./routes/BlankDeathCertificate";
import BlankLateFoetalDeathCertificate from "./routes/BlankLateFoetalDeathCertificate";
import { useState, useEffect } from "react";
import LateFoetalDeathRecord from "./routes/LateFoetalDeathRecord";
import LateFoetalDeathCert from "./routes/lateFoetalDeathCert";
import { InitialQuery } from "./constants";
import api from "./api";
import './i18n'

function AppContent() {
  const location = useLocation();
  const hideSidebar = [
    "/birth-certificate",
    "/blank-birth-certificate",
    "/blank-death-certificate",
    "/blank-late-foetal-death-certificate",
    "/death-certificate",
    "/late-Foetal-death-certificate",
  ].includes(location.pathname);
  const [orgUnit, setOrgUnit] = useState(null);
  const [orgUnits, setOrgUnits] = useState([]);
  const[userOrgunit, setUserOrgunit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [me, ouList] = await Promise.all([
        api.fetchOthers( InitialQuery.me.resource, [`fields=${InitialQuery.me.params.fields.join(',')}`]),
        api.fetchOthers( InitialQuery.ouList.resource, [`fields=${InitialQuery.ouList.params.fields.join(',')}`]),
      ]);
      if (me) {
        setUserOrgunit(me.organisationUnits[0]);
      }
      if (ouList) {
        setOrgUnits(ouList.organisationUnits);
      }
    };

    fetchData();
  }, []);

  return (
      <div className={styles.container}>
        {
        
        !hideSidebar && (
          <div className={styles.sidebar}>
            <Sidebar  orgUnit={orgUnit} setOrgUnit={setOrgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>
          </div>)
        }
        
          <Routes>
          <Route path="/" element={<Navigate to="/born-alive" replace />} />
          <Route path="/born-alive" element={<BirthRecords orgUnit={orgUnit} status={'Live-Birth'}/>} />
          <Route path="/death" element={<DeathRecords orgUnit={orgUnit} />} />
          <Route path="/still-born" element={<LateFoetalDeathRecord orgUnit={orgUnit} status={'Still Birth'}/>} />
          <Route path="/birth-certificate" element={<BirthCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} />} />
          <Route path="/blank-birth-certificate" element={<BlankBirthCertificate />} />
          <Route path="/blank-death-certificate" element={<BlankDeathCertificate />} />
          <Route path="/blank-late-foetal-death-certificate" element={<BlankLateFoetalDeathCertificate />} />
          <Route path="/death-certificate" element={<DeathCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} />} />
          <Route path="/late-Foetal-death-certificate" element={<LateFoetalDeathCert orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} />} />
          <Route path="*" element={<Navigate to="/born-alive" replace />} />
        </Routes>
      </div>
  );
}

function App() {
  return (
    <HashRouter >
      <AppContent />
    </HashRouter>
  );
}

export default App;
