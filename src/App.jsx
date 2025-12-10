import React from "react";
import { Routes, Route, HashRouter, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import styles from './App.module.css';
import BirthRecords from "./routes/BirthRecords";
import DeathRecords from "./routes/DeathRecords";
import BirthCertificate from "./routes/BirthCertificate";
import DeathCertificate from "./routes/DeathCertificate";
import { useState, useEffect } from "react";
import LateFoetalDeathRecord from "./routes/LateFoetalDeathRecord";
import LateFoetalDeathCert from "./routes/lateFoetalDeathCert";
import { InitialQuery } from "./components/constants";
import Dhis2HeaderBar from "./components/HeaderBar/HeaderBar.component";
import api from "./api";
import './i18n'

function AppContent() {
  const location = useLocation();
  const hideSidebar = [
    "/birth-certificate",
    "/death-certificate",
    "/late-Foetal-death-certificate",
  ].includes(location.pathname);
  const [orgUnit, setOrgUnit] = useState(null);
  const [orgUnits, setOrgUnits] = useState([]);
  const [dataElements, setDataElements] = useState({});
  const[userOrgunit, setUserOrgunit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [me, ouList, optionSets, dataElements] = await Promise.all([
        api.fetchOthers( InitialQuery.me.resource, [`fields=${InitialQuery.me.params.fields.join(',')}`]),
        api.fetchOthers( InitialQuery.ouList.resource, [`fields=${InitialQuery.ouList.params.fields.join(',')}`]),
        api.fetchOthers( InitialQuery.optionSets.resource, [`fields=${InitialQuery.optionSets.params.fields.join(',')}`]),
        api.fetchOthers( InitialQuery.dataElements.resource, [`fields=${InitialQuery.dataElements.params.fields.join(',')}`]),
      ]);
      if (me) {
        setUserOrgunit(me.organisationUnits[0]);
      }
      if (ouList) {
        setOrgUnits(ouList.organisationUnits);
      }
      if (dataElements && optionSets) {
        var de = {};
        dataElements.dataElements.forEach((dataElement) => {
          if (dataElement.optionSetValue) {
            de[dataElement.id] = {};
            const optionSet = optionSets.optionSets.find(
              (option) => option.id == dataElement.optionSet.id
            );
            optionSet?.options?.forEach((option) => {
              const my = option?.translations?.find(
                (translation) => translation.locale == "my"
              );
              if (my) {
                de[dataElement.id][option.code] = my.value;
              } else {
                de[dataElement.id][option.code] = option.name;
              }
            });
          }
        });
        setDataElements(de);
      }
    };

    fetchData();
  }, []);

  return (

    <>
      <Dhis2HeaderBar title={'Birth & Death Certificate'} />
      <div className={styles.container}>
        {!hideSidebar && <Sidebar  setOrgUnit={setOrgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits}/>}

        <div style={{flex: 1}}>
          <Routes>
          <Route path="/" element={<BirthRecords orgUnit={orgUnit} status={'Live Birth'} />} />
          <Route path="/born-alive" element={<BirthRecords orgUnit={orgUnit} status={'Live Birth'}/>} />
          <Route path="/death" element={<DeathRecords orgUnit={orgUnit} dataElements={dataElements}/>} />
          <Route path="/still-born" element={<LateFoetalDeathRecord orgUnit={orgUnit} status={'Stillbirth'}/>} />
          <Route path="/birth-certificate" element={<BirthCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} dataElements={dataElements}/>} />
          <Route path="/death-certificate" element={<DeathCertificate orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} dataElements={dataElements}/>} />
          <Route path="/late-Foetal-death-certificate" element={<LateFoetalDeathCert orgUnit={orgUnit} userOrgunit={userOrgunit} orgUnits={orgUnits} dataElements={dataElements}/>} />
          <Route path="*" element={<BirthRecords orgUnit={orgUnit} status={'Live-Birth'} />} />
        </Routes>

        </div>
      </div>
    </>
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