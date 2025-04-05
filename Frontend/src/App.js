// import './App.css';
// import './index.css';
import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import ReportForm from './pages/ReportForm/ReportForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReportStatusPage from './pages/Status/ReportStatusPage'

function App() {
  return (

    <div >
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/status/:id" element={<ReportStatusPage />} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
