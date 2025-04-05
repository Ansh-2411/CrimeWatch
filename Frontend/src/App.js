// import './App.css';
// import './index.css';
import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import ReportForm from './pages/ReportForm/ReportForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (

    <div >
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportForm/>} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
