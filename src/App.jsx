import React from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import styles from './App.module.css';
import BirthRecords from "./routes/BirthRecords";
import DeathRecords from "./routes/DeathRecords";
import BirthCertificate from "./routes/BirthCertificate";
import DeathCertificate from "./routes/DeathCertificate";

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/downloadBirthCertificate";

  return (
    <>
      <Header />
      <div className={styles.container}>
        {!hideSidebar && <Sidebar />}
        <Routes>
          <Route path="/birth" element={<BirthRecords />} />
          <Route path="/death" element={<DeathRecords />} />
          <Route path="/birth-certificate" element={<BirthCertificate />} />
          <Route path="/death-certificate" element={<DeathCertificate />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;